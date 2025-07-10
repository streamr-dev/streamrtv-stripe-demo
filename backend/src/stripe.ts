import { Router, Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';
import { z } from 'zod';
import validate from 'express-zod-safe';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

// Zod schemas for POST endpoints
const createPaymentIntentSchema = z.object({
  amount: z.number().positive(),
  connectedAccountId: z.string().min(1),
});

const lookupAccountSchema = z.object({
  email: z.string().email(),
});

const onboardSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1),
  country: z.string().min(2),
});

router.post(
    '/create-payment-intent',
    validate({ body: createPaymentIntentSchema }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { amount, connectedAccountId } = req.body;

        // Create a payment intent with the connected account
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: 'usd',
          application_fee_amount: Math.round(amount * 0.1 * 100), // 10% platform fee
          transfer_data: {
            destination: connectedAccountId, // TODO: validate connected account ID
          },
          metadata: {
            broadcastId: 'some-broadcast-id', // TODO: replace with actual broadcast ID from request
            viewerNodeId: 'some-viewer-node', // TODO replace with actual viewer node ID from request
          }
        });

        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error) {
        console.error('Error creating payment intent:', error);
        next(error);
      }
    }
);

// TODO: remove, for testing purposes
router.get('/get-payment-intents', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100
    });

    res.json({
      paymentIntents: paymentIntents.data.map((intent) => ({
        id: intent.id,
        amount: intent.amount / 100, // Convert back to dollars
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

router.get('/accounts', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accounts = await stripe.accounts.list({ limit: 100 }); // TODO: pagination after 100 accounts
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

// TODO: add authentication middleware to protect this route?
router.get('/dashboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const accountId = req.query.accountId as string;
    if (!accountId) {
      res.status(400).json({ error: 'Account ID is required' });
      return;
    }

    // TODO: Do we need to retrieve this balance, is stripe login link enough??
    const balance = await stripe.balance.retrieve({
      stripeAccount: accountId
    });
    const loginLink = await stripe.accounts.createLoginLink(accountId);

    res.json({
      balance: {
        available: balance.available.map((b) => ({
          amount: b.amount / 100,
          currency: b.currency
        })),
        pending: balance.pending.map((b) => ({
          amount: b.amount / 100,
          currency: b.currency
        })),
      },
      dashboardUrl: loginLink.url,
    });
  } catch (error) {
    console.error('Error fetching Stripe dashboard data:', error);
    next(error);
  }
});

router.post(
    '/lookup-account',
    validate({ body: lookupAccountSchema }),
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { email } = req.body;

        const accounts = await stripe.accounts.list({
          limit: 100
        }); // TODO: pagination after 100 accounts
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

router.post(
    '/onboard',
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