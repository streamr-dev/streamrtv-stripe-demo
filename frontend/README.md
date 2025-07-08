# Frontend (Next.js + TypeScript)

This is the frontend for the StreamrTV Stripe Integration demo. It provides the UI for creator onboarding, dashboard, and payment processing using Stripe Connect.

## Features
- Creator onboarding with Stripe Connect Express
- Secure payment processing
- Creator dashboard showing earnings
- Direct access to Stripe dashboard
- Support for multiple currencies

## Prerequisites
- Node.js 18+
- npm
- Stripe account

## Setup
1. Install dependencies:
   ```sh
   npm install
   ```
2. Create a `.env.local` file in this directory with:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   NEXT_PUBLIC_APP_URL=https://your-app-url
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts
- `npm run dev` — Start the Next.js development server
- `npm run build` — Build for production
- `npm start` — Start the production server
- `npm run lint` — Lint the codebase

## Folder Structure
- `/src/app/api/stripe/*` — Stripe API endpoints (frontend proxy)
- `/src/app/onboarding` — Creator onboarding flow
- `/src/app/dashboard` — Creator dashboard
- `/src/app/purchase` — Payment processing

## Tech Stack
- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- Stripe.js & React Stripe.js

## Notes
- For backend API, see the `../backend` folder.
- Never expose your Stripe secret key in this frontend code.