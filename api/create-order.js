// api/create-order.js
import Razorpay from 'razorpay';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,    // from Vercel env vars
  key_secret: process.env.RAZORPAY_SECRET // from Vercel env vars
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, currency = 'INR', receipt, notes } = req.body;
    
    if (!amount) {
      return res.status(400).json({ 
        success: false, 
        error: 'Amount is required' 
      });
    }

    const options = { 
      amount: Math.round(parseFloat(amount) * 100), // convert to paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
      notes: notes || {}
    };

    console.log('Creating Razorpay order with options:', options);
    const order = await razorpay.orders.create(options);
    console.log('Order created:', order.id);

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return res.status(500).json({ 
      success: false, 
      error: error.message || 'Failed to create order' 
    });
  }
}
