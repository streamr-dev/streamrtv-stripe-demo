import request from 'supertest';
import express from 'express';
import accountsRouter from '../src/endpoints/accounts';
import StripeWrapper from '../src/endpoints/StripeWrapper';
import { mock } from 'jest-mock-extended';

const mockStripeWrapper = mock<StripeWrapper>();
mockStripeWrapper.listAccounts.mockResolvedValue({
  data: [
    {
      id: 'acct_1',
      business_profile: { name: 'Test Business' },
      email: 'test@example.com',
      country: 'US',
      charges_enabled: true,
    },
    {
      id: 'acct_2',
      business_profile: { name: null },
      email: 'disabled@example.com',
      country: 'CA',
      charges_enabled: false,
    },
  ],
} as any);

describe('GET /accounts', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/accounts', accountsRouter(mockStripeWrapper));
  });

  it('should return enabled Stripe accounts', async () => {
    const res = await request(app).get('/accounts');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      accounts: [
        {
          id: 'acct_1',
          name: 'Test Business',
          email: 'test@example.com',
          country: 'US',
        },
      ],
    });
  });
});