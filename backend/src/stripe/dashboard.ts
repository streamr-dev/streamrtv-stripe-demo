import { Router, Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = req.query.accountId as string;
    if (!accountId) {
      res.status(400).json({ error: 'Account ID is required' });
      return;
    }
    const balance = await stripe.balance.retrieve({ stripeAccount: accountId });
    const loginLink = await stripe.accounts.createLoginLink(accountId);
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

export default router;