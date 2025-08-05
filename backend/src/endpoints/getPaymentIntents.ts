import { Router, Request, Response, NextFunction } from 'express';
import StripeWrapper from './StripeWrapper';

// TODO: for debugging / development purposes, can be removed later
export default function getPaymentIntents(stripeWrapper: StripeWrapper): Router {
  const router = Router();

  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const paymentIntents = await stripeWrapper.listPaymentIntents({
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

  return router;
}