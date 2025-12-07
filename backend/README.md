# Backend (Express + TypeScript)

## Setup

1. Install dependencies:
   ```sh
   npm install
   ```

2. Create a `.env` file in this directory with your Stripe secret key:
   ```env
   STRIPE_SECRET_KEY=sk_test_your_secret_key_here
   ```

## Scripts

- `npm run dev` — Start the server in development mode (with ts-node)
- `npm run build` — Compile TypeScript to JavaScript
- `npm start` — Run the compiled server from `dist/`

## Endpoints

- POST `/api/stripe/create-payment-intent`
  - Body: `{ amount: number, connectedAccountId: string }`
  - Returns: `{ clientSecret: string }`