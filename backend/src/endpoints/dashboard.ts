import { Router, Request, Response, NextFunction } from 'express';
import StripeWrapper from './StripeWrapper';

export default function dashboard(stripeWrapper: StripeWrapper): Router {
  const router = Router();

  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accountId = req.query.accountId as string;
      if (!accountId) {
        res.status(400).json({ error: 'Account ID is required' });
        return;
      }
      const balance = await stripeWrapper.retrieveBalance({ stripeAccount: accountId });
      const loginLink = await stripeWrapper.createLoginLink(accountId);
      res.json({
        balance: {
          available: balance.available.map((b) => ({ amount: b.amount / 100, currency: b.currency })),
          pending: balance.pending.map((b) => ({ amount: b.amount / 100, currency: b.currency })),
        },
        dashboardUrl: loginLink.url,
      });
    } catch (error) {
      console.error('Error fetching Stripe dashboard data:', error);
      next(error);
    }
  });

  return router;
}