import { Router, Request, Response, NextFunction } from 'express';
import StripeWrapper from './StripeWrapper';
import { z } from 'zod';
import validate from 'express-zod-safe';

export const lookupAccountSchema = z.object({
  email: z.string().email(),
});

export default function lookupAccount(stripeWrapper: StripeWrapper): Router {
  const router = Router();

  router.post(
    '/',
    validate({ body: lookupAccountSchema }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email } = req.body;
        const accounts = await stripeWrapper.listAccounts({ limit: 100 });
        const account = accounts.data.find((acc) => acc.email === email);
        if (!account) {
          res.status(404).json({ error: 'No account found with this email' });
          return;
        }
        if (!account.charges_enabled) {
          res.status(400).json({ error: 'Account is not fully set up. Please complete onboarding.' });
          return;
        }
        res.json({
          accountId: account.id,
          name: account.business_profile?.name || 'Unnamed Account',
        });
      } catch (error) {
        console.error('Error looking up Stripe account:', error);
        next(error);
      }
    }
  );

  return router;
}