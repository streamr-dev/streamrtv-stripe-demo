import { Router, Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
import validate from 'express-zod-safe';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export const createPaymentIntentSchema = z.object({
  amount: z.number().positive(),
  connectedAccountId: z.string().min(1),
});

router.post(
  '/',
  validate({ body: createPaymentIntentSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { amount, connectedAccountId } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100),
        currency: 'usd',
        application_fee_amount: Math.round(amount * 0.1 * 100),
        transfer_data: {
          destination: connectedAccountId,
        },
        metadata: {
          broadcastId: 'some-broadcast-id',
          viewerNodeId: 'some-viewer-node',
        },
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error('Error creating payment intent:', error);
      next(error);
    }
  }
);

export default router;