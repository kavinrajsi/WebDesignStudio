// This file is required by Vercel to handle serverless functions
export default function handler(req, res) {
  // This will be handled by individual API routes
  res.status(404).json({ error: 'Not Found' });
}
