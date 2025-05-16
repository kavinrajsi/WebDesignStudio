import dotenv from 'dotenv';
import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import Razorpay from "razorpay";

// Load environment variables
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "",
  key_secret: process.env.RAZORPAY_KEY_SECRET || "",
});

// CORS middleware
const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const allowedOrigins = [
    'https://www.seoauditsolutions.com',
    'https://seoauditsolutions.com',
    'http://localhost:3000',
    'http://localhost:5173'
  ];
  
  const origin = req.headers.origin || '';
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    // Cache preflight requests for 1 hour (helps reduce the number of preflight requests)
    res.setHeader('Access-Control-Max-Age', '3600');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    return res.status(204).end();
  }
  
  // For actual requests
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Apply CORS middleware
  app.use(corsMiddleware);
  // Health check endpoint
  app.get("/api/health", (req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  // Create Razorpay Order
  app.post("/api/create-order", async (req: Request, res: Response) => {
    // Set CORS headers
    const origin = req.headers.origin || '';
    const allowedOrigins = [
      'https://www.seoauditsolutions.com',
      'https://seoauditsolutions.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    try {
      const { amount, currency = "INR", receipt, notes } = req.body;
      
      // Validate required fields
      if (!amount) {
        return res.status(400).json({ 
          success: false,
          error: "Amount is required" 
        });
      }
      
      // Create Razorpay order
      const options = {
        amount: Math.round(parseFloat(amount) * 100), // Convert to paise and ensure it's an integer
        currency,
        receipt: receipt || `receipt_${Date.now()}`,
        payment_capture: 1, // Auto-capture payment
        notes: notes || {},
      };
      
      console.log('Creating Razorpay order with options:', options);
      
      const order = await razorpay.orders.create(options);
      
      console.log('Razorpay order created:', order);
      
      res.json({
        success: true,
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: process.env.RAZORPAY_KEY_ID,
      });
    } catch (error) {
      console.error("Error creating Razorpay order:", error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : "Failed to create payment order" 
      });
    }
  });

  // Verify Razorpay Payment
  app.post("/api/verify-payment", (req: Request, res: Response) => {
    // Set CORS headers
    const origin = req.headers.origin || '';
    const allowedOrigins = [
      'https://www.seoauditsolutions.com',
      'https://seoauditsolutions.com',
      'http://localhost:3000',
      'http://localhost:5173'
    ];
    
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      
      // Validate required fields
      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ 
          success: false,
          error: "Missing payment verification parameters" 
        });
      }
      
      console.log('Verifying payment:', { razorpay_order_id, razorpay_payment_id });
      
      // In a production environment, you should verify the signature
      // Here's how you would do it with Razorpay's crypto utility
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
      hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
      const generated_signature = hmac.digest('hex');
      
      const isSignatureValid = generated_signature === razorpay_signature;
      
      if (!isSignatureValid) {
        console.error('Invalid signature for payment:', razorpay_payment_id);
        return res.status(400).json({
          success: false,
          error: "Invalid payment signature"
        });
      }
      
      console.log('Payment verified successfully:', razorpay_payment_id);
      
      res.json({
        success: true,
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature
      });
    } catch (error) {
      console.error("Error verifying payment:", error);
      res.status(500).json({ 
        success: false,
        error: error instanceof Error ? error.message : "Failed to verify payment" 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
