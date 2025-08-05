import { Router, Request, Response, NextFunction } from 'express';
import StripeWrapper from './StripeWrapper';
import { z } from 'zod';
import validate from 'express-zod-safe';

export const createPaymentIntentSchema = z.object({
  amount: z.number().positive(), // TODO: maybe API could take in cents, floats not good idea for money?
  connectedAccountId: z.string().min(1),
  // TODO: add metadata fields streamId and viewerNodeId (or e.g. chat username)
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
          application_fee_amount: Math.round(amount * 0.1 * 100), // TODO: do we want to collect this fee? make configurable?
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