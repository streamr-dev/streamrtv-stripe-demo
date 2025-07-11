import Stripe from 'stripe';

class StripeWrapper {
  private readonly stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2025-06-30.basil',
  });

  public async createPaymentIntent(params: Stripe.PaymentIntentCreateParams) {
    return this.stripe.paymentIntents.create(params);
  }

  public async listPaymentIntents(params: Stripe.PaymentIntentListParams) {
    return this.stripe.paymentIntents.list(params);
  }

  public async listAccounts(params: Stripe.AccountListParams) {
    return this.stripe.accounts.list(params);
  }

  public async createAccount(params: Stripe.AccountCreateParams) {
    return this.stripe.accounts.create(params);
  }

  public async createAccountLink(params: Stripe.AccountLinkCreateParams) {
    return this.stripe.accountLinks.create(params);
  }

  public async createLoginLink(accountId: string) {
    return this.stripe.accounts.createLoginLink(accountId);
  }

  public async retrieveBalance(params?: Stripe.RequestOptions) {
    return this.stripe.balance.retrieve(params);
  }
}

export default StripeWrapper;