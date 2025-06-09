# StreamrTV Stripe Integration

A Next.js application demonstrating Stripe Connect integration for content creators to receive payments from their audience.

## Features

- Creator onboarding with Stripe Connect Express
- Secure payment processing
- Creator dashboard showing earnings
- Direct access to Stripe dashboard
- Support for multiple currencies

## Prerequisites

- Node.js 18+ and npm
- A Stripe account
- Stripe API keys (test mode for development)

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_APP_URL=url //has to be https, use ngrok on localhost for a tunnel to port 3000
```

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app/api/stripe/*` - Stripe API endpoints
- `/src/app/onboarding` - Creator onboarding flow
- `/src/app/dashboard` - Creator dashboard
- `/src/app/purchase` - Payment processing

## Important Security Recommendations

### Authentication System

The current implementation uses a simple email-based lookup for accessing creator dashboards. For production use, I strongly recommend implementing a proper authentication system:

1. Set up a database to store user accounts
2. Implement email/password authentication
3. Link Stripe accounts to user accounts
4. Use secure session management
5. Add proper authorization checks

### API Security

- Never expose Stripe secret keys in client-side code
- Use environment variables for sensitive data
- Implement rate limiting
- Add request validation

## Development

- Built with Next.js 13+ (App Router)
- Uses TypeScript for type safety
- Styled with Tailwind CSS
- Implements Stripe Connect Express for creator onboarding

## Production Deployment

1. Set up environment variables in your hosting platform
2. Build the application:

```bash
npm run build
```

3. Start the production server:

```bash
npm start
```
