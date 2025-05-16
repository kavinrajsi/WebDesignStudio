import { NextResponse } from "next/server";
import { verifyPayment, logger } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logger.info("Verifying payment", { data });

    // Validate payment data
    const payment = await verifyPayment(
      data.razorpay_order_id,
      data.razorpay_payment_id,
      data.razorpay_signature
    );

    logger.info("Payment verified successfully", { paymentId: payment.id });

    return NextResponse.json({
      success: true,
      message: "Payment verified successfully",
      payment
    });
  } catch (error) {
    logger.error("Payment verification failed", { error });
    
    if (error instanceof RazorpayError) {
      return NextResponse.json(
        { 
          success: false,
          error: error.message,
          code: error.code 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false,
        error: "Internal server error",
        code: "INTERNAL_ERROR" 
      },
      { status: 500 }
    );
  }
}
