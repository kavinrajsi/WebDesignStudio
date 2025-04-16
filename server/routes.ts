import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // Create Razorpay Order
  app.post("/api/create-order", async (req: Request, res: Response) => {
    try {
      const { amount, currency = "INR", receipt, notes } = req.body;
      
      // Validate required fields
      if (!amount) {
        return res.status(400).json({ error: "Amount is required" });
      }
      
      // Create Razorpay order
      const options = {
        amount: parseInt(amount) * 100, // Razorpay expects amount in paise
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        notes: notes || {},
      };
      
      const order = await razorpay.orders.create(options);
      
      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ error: "Failed to create payment order" });
    }
  });

  // Verify Razorpay Payment
  app.post("/api/verify-payment", (req: Request, res: Response) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      
      // Validate required fields
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: "Missing payment verification parameters" });
      }
      
      // In a production environment, you would verify the signature here
      // using razorpay.webhooks.verify() or crypto.createHmac()
      
      // For this demo, we'll consider the payment verified
      res.json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
      });
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ error: "Failed to verify payment" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
