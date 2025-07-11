import request from 'supertest';
import express from 'express';
import accountsRouter from '../src/stripe/accounts';

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    accounts: {
      list: jest.fn().mockResolvedValue({
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
      }),
    },
  }));
});

describe('GET /accounts', () => {
  let app: express.Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use('/accounts', accountsRouter);
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