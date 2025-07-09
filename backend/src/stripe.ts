import { Router, Request, Response, NextFunction } from 'express';
import Stripe from 'stripe';

const router = Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

// TODO: add Zod validation for request bodies
router.post('/create-payment-intent', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { amount, connectedAccountId } = req.body;

    if (!amount || !connectedAccountId) {
      res.status(400).json({ error: 'Amount and connected account ID are required' });
      return;
    }

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

router.post('/lookup-account', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ error: 'Email is required' });
      return;
    }

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
});

router.post('/onboard', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, country } = req.body;
    if (!email || !name || !country) {
      res.status(400).json({ error: 'Email, name, and country are required' });
      return;
    }
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
});

export default router;