import { NextResponse } from 'next/server';
import { InvoiceService } from '@/app/services/invoiceService';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: false
    }
  }
);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const paymentId = searchParams.get('paymentId');

    if (!orderId || !paymentId) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Get customer details from Supabase
    const { data: customerData, error: customerError } = await supabase
      .from('seo_audit_requests')
      .select('name, email, phone, website')
      .eq('id', orderId)
      .single();

    if (customerError) {
      console.error('Error fetching customer data:', customerError);
      return NextResponse.json(
        { error: 'Failed to fetch customer data' },
        { status: 500 }
      );
    }

    // Generate PDF
    const pdfBuffer = await InvoiceService.generatePDF({
      invoiceNumber: InvoiceService.generateInvoiceNumber(),
      customer: customerData,
      amount: 870,
      gstAmount: 870 * 0.18,
      totalAmount: 870 + (870 * 0.18),
      paymentId,
      orderId,
      status: 'success',
      date: new Date().toISOString().split('T')[0],
    });

    // Return PDF with appropriate headers
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="invoice_${orderId}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating invoice:', error);
    return NextResponse.json(
      { error: 'Failed to generate invoice' },
      { status: 500 }
    );
  }
} 