import { NextResponse } from "next/server";
import { createOrder, logger } from "@/lib/razorpay";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    logger.info("Creating order", { data });

    const result = await createOrder(data);
    logger.info("Order created successfully", { orderId: result.orderId });

    return NextResponse.json(result);
  } catch (error) {
    logger.error("Order creation failed", { error });
    
    if (error instanceof RazorpayError) {
      return NextResponse.json(
        { error: error.message, code: error.code },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: "Internal server error", code: "INTERNAL_ERROR" },
      { status: 500 }
    );
  }
}
