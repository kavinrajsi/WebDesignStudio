import Razorpay from 'razorpay';
import { z } from 'zod';

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Validation schemas
const createOrderSchema = z.object({
  amount: z.number().min(1),
  currency: z.string().min(3).max(3),
  receipt: z.string().min(1),
  notes: z.object({
    packageId: z.string().min(1)
  }).optional(),
});

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

// Error types
export class RazorpayError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'RazorpayError';
  }
}

// Validation functions
export function validateCreateOrder(data: any) {
  try {
    return createOrderSchema.parse(data);
  } catch (error) {
    throw new RazorpayError('Invalid order data', 'INVALID_DATA');
  }
}

export function validateVerifyPayment(data: any) {
  try {
    return verifyPaymentSchema.parse(data);
  } catch (error) {
    throw new RazorpayError('Invalid payment verification data', 'INVALID_DATA');
  }
}

// Payment verification
export async function verifyPayment(
  orderId: string,
  paymentId: string,
  signature: string
) {
  try {
    // Verify signature
    const generatedSignature = razorpay.util.generateSignature(
      `${orderId}|${paymentId}`,
      process.env.RAZORPAY_KEY_SECRET!
    );

    if (generatedSignature !== signature) {
      throw new RazorpayError('Invalid payment signature', 'INVALID_SIGNATURE');
    }

    // Fetch payment details
    const payment = await razorpay.payments.fetch(paymentId);

    if (!payment) {
      throw new RazorpayError('Payment not found', 'PAYMENT_NOT_FOUND');
    }

    if (payment.status !== 'captured') {
      throw new RazorpayError('Payment not captured', 'PAYMENT_NOT_CAPTURED');
    }

    return payment;
  } catch (error) {
    if (error instanceof RazorpayError) throw error;
    throw new RazorpayError('Payment verification failed', 'VERIFICATION_FAILED');
  }
}

// Order creation
export async function createOrder(data: any) {
  try {
    const validatedData = validateCreateOrder(data);
    
    // Create order
    const order = await razorpay.orders.create({
      amount: validatedData.amount * 100, // Convert to paise
      currency: validatedData.currency,
      receipt: validatedData.receipt,
      notes: validatedData.notes,
    });

    if (!order) {
      throw new RazorpayError('Failed to create order', 'ORDER_CREATION_FAILED');
    }

    return {
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    };
  } catch (error) {
    if (error instanceof RazorpayError) throw error;
    throw new RazorpayError('Failed to create order', 'ORDER_CREATION_FAILED');
  }
}

// Logger
export const logger = {
  error: (message: string, metadata?: any) => {
    console.error(`[Razorpay] ${message}`, metadata);
  },
  info: (message: string, metadata?: any) => {
    console.log(`[Razorpay] ${message}`, metadata);
  },
};
