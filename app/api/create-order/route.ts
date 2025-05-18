import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

// Test mode configuration
const isTestMode = process.env.NEXT_PUBLIC_RAZORPAY_TEST_MODE === 'true';

// Log configuration for debugging
console.log('Razorpay Configuration:', {
  isTestMode,
  keyId: isTestMode ? process.env.RAZORPAY_TEST_KEY_ID : process.env.RAZORPAY_KEY_ID,
  hasKeySecret: isTestMode 
    ? !!process.env.RAZORPAY_TEST_KEY_SECRET 
    : !!process.env.RAZORPAY_KEY_SECRET
});

// Validate environment variables
if (!process.env.RAZORPAY_TEST_KEY_ID || !process.env.RAZORPAY_TEST_KEY_SECRET) {
  console.error('Missing Razorpay test credentials');
}

const razorpay = new Razorpay({
  key_id: isTestMode 
    ? process.env.RAZORPAY_TEST_KEY_ID! 
    : process.env.RAZORPAY_KEY_ID!,
  key_secret: isTestMode 
    ? process.env.RAZORPAY_TEST_KEY_SECRET! 
    : process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, currency, receipt, notes } = body;

    // Validate request data
    if (!amount || !currency) {
      return NextResponse.json(
        { error: 'Missing required fields: amount and currency' },
        { status: 400 }
      );
    }

    const options = {
      amount: amount,
      currency: currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: notes || {},
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt
    });
  } catch (error) {
    // Enhanced error logging
    console.error('Error creating order:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return NextResponse.json(
      { 
        error: 'Error creating order',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}