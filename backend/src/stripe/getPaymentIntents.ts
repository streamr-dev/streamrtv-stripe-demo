import { Router, Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
    });
    res.json({
      paymentIntents: paymentIntents.data.map((intent) => ({
        id: intent.id,
        amount: intent.amount / 100,
        currency: intent.currency,
        status: intent.status,
        created: new Date(intent.created * 1000).toISOString(),
        metadata: intent.metadata,
      })),
    });
  } catch (error) {
    console.error('Error fetching payment intents:', error);
    next(error);
  }
});

export default router;