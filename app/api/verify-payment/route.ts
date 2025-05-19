import { NextResponse } from 'next/server';
import crypto from 'crypto';

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

    if (isTestMode) {
      // In test mode, always return success
      console.log('Test mode payment verified successfully');
      
      return NextResponse.json({
        success: true,
        message: 'Test payment verified successfully',
        test_mode: true,
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        invoice_number: invoiceNumber
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
      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        invoice_number: invoiceNumber
      });
    } else {
      console.error('Invalid signature:', {
        received: razorpay_signature,
        calculated: signature
      });

      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid signature',
          invoice_number: invoiceNumber
        },
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