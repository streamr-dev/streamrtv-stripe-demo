import { Router, Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
import validate from 'express-zod-safe';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export const lookupAccountSchema = z.object({
  email: z.string().email(),
});

router.post(
  '/',
    validate({ body: lookupAccountSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body;
      const accounts = await stripe.accounts.list({ limit: 100 });
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

export default router;