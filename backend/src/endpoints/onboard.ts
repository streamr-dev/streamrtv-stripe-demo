import { Router, Request, Response, NextFunction } from 'express';
import StripeWrapper from './StripeWrapper';
import { z } from 'zod';
import validate from 'express-zod-safe';

export const onboardSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  country: z.string().min(2),
});

export default function onboard(stripeWrapper: StripeWrapper): Router {
  const router = Router();

  router.post(
    '/',
    validate({ body: onboardSchema }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email, name, country } = req.body;
        const account = await stripeWrapper.createAccount({
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
        const accountLink = await stripeWrapper.createAccountLink({
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

  return router;
}