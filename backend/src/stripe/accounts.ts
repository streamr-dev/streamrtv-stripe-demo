import { Router, Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accounts = await stripe.accounts.list({ limit: 100 });
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

export default router;