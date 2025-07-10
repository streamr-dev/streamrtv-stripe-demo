import { Router, Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
import validate from 'express-zod-safe';

const router = Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export const onboardSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  country: z.string().min(2),
});

router.post(
  '/',
    validate({ body: onboardSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, country } = req.body;
      const account = await stripe.accounts.create({
        type: 'express',
        email,
        business_type: 'individual',
        country,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_profile: {
          name,
          url: process.env.NEXT_PUBLIC_APP_URL,
        },
      });
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/refresh`,
        return_url: `${process.env.NEXT_PUBLIC_APP_URL}/onboarding/success?accountId=${account.id}`,
        type: 'account_onboarding',
      });
      res.json({
        accountId: account.id,
        url: accountLink.url,
      });
    } catch (error) {
      console.error('Error creating Stripe account:', error);
      next(error);
    }
  }
);

export default router;