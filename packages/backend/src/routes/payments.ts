import express, { Request, Response } from 'express';
import Stripe from 'stripe';

const router = express.Router();

// Initialize stripe if key present
const stripeKey = process.env.STRIPE_SECRET_KEY || '';
let stripe: Stripe | null = null;
if (stripeKey) {
  try {
    stripe = new Stripe(stripeKey, { apiVersion: '2023-10-16' });
  } catch (err) {
    console.warn('Stripe init failed:', err);
    stripe = null;
  }
}

// Create a payment intent (stubbed when stripe not configured)
router.post('/intent', async (req: Request, res: Response) => {
  const { amount = 1000, currency = 'usd' } = req.body || {};
  try {
    if (!stripe) {
      // Return a stubbed client_secret for local/dev
      return res.json({ success: true, clientSecret: 'stub_client_secret', amount, currency });
    }

    const paymentIntent = await stripe.paymentIntents.create({ amount, currency });
    res.json({ success: true, clientSecret: paymentIntent.client_secret, amount, currency });
  } catch (err) {
    console.error('Payment intent error', err);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Webhook endpoint placeholder
router.post('/webhook', express.raw({ type: 'application/json' }), (req: Request, res: Response) => {
  // In production, verify stripe signature and handle events
  console.log('Received payment webhook (raw body length):', (req as any).body?.length || 0);
  res.json({ received: true });
});

export default router;
