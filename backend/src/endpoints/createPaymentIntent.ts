import { Router, Request, Response, NextFunction } from 'express';
import StripeWrapper from './StripeWrapper';
import { z } from 'zod';
import validate from 'express-zod-safe';

export const createPaymentIntentSchema = z.object({
  amount: z.number().positive(),
  connectedAccountId: z.string().min(1),
});

export default function createPaymentIntent(stripeWrapper: StripeWrapper): Router {
  const router = Router();

  router.post(
    '/',
    validate({ body: createPaymentIntentSchema }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { amount, connectedAccountId } = req.body;
        const paymentIntent = await stripeWrapper.createPaymentIntent({
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

  return router;
}