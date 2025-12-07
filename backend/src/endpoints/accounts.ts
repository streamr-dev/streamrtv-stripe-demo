import { Router, Request, Response, NextFunction } from 'express';
import StripeWrapper from './StripeWrapper';

// TODO: rename to "merchants" or another relevant term
export default function accounts(stripeWrapper: StripeWrapper): Router {
  const router = Router();

  router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const accounts = await stripeWrapper.listAccounts({ limit: 100 }); // TODO: in future, limit could become wrong
      const enabledAccounts = accounts.data.filter((account) => account.charges_enabled);
      res.json({
        accounts: enabledAccounts.map((account) => ({
          id: account.id,
          name: account.business_profile?.name || 'Unnamed Account',
          email: account.email,
          country: account.country,
        })),
      });
    } catch (error) {
      console.error('Error fetching Stripe accounts:', error);
      next(error);
    }
  });

  return router
}