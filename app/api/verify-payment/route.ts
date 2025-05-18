import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { InvoiceService } from '@/app/services/invoiceService';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId,
    } = body;

    // Log the incoming request
    console.log('Payment verification request:', {
      razorpay_order_id,
      razorpay_payment_id,
      has_signature: !!razorpay_signature,
      orderId,
    });

    // Check if we're in test mode
    const isTestMode = process.env.NEXT_PUBLIC_RAZORPAY_TEST_MODE === 'true';
    console.log('Test mode status:', isTestMode);

    // Get customer details from Supabase
    const { data: customerData, error: customerError } = await supabase
      .from('seoaudit_product')
      .select('name, email, phone, website')
      .eq('id', orderId)
      .single();

    if (customerError) {
      console.error('Error fetching customer data:', customerError);
      throw new Error('Failed to fetch customer data');
    }

    if (isTestMode) {
      // In test mode, always return success
      console.log('Test mode payment verified successfully');
      
      // Generate and send invoice for test mode
      await InvoiceService.generateAndSendInvoice(
        customerData,
        razorpay_payment_id,
        razorpay_order_id,
        'success'
      );

      return NextResponse.json({
        success: true,
        message: 'Test payment verified successfully',
        test_mode: true,
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id
      });
    }

    // Verify signature for production mode
    const text = `${razorpay_order_id}|${razorpay_payment_id}`;
    const signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(text)
      .digest('hex');

    const isAuthentic = signature === razorpay_signature;
    console.log('Signature verification:', { isAuthentic });

    if (isAuthentic) {
      // Generate and send invoice for successful payment
      await InvoiceService.generateAndSendInvoice(
        customerData,
        razorpay_payment_id,
        razorpay_order_id,
        'success'
      );

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id
      });
    } else {
      console.error('Invalid signature:', {
        received: razorpay_signature,
        calculated: signature
      });

      // Generate and send invoice for failed payment
      await InvoiceService.generateAndSendInvoice(
        customerData,
        razorpay_payment_id,
        razorpay_order_id,
        'error'
      );

      return NextResponse.json(
        { success: false, message: 'Invalid signature' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error verifying payment',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 