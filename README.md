# StreamrTV Stripe Integration Monorepo

A monorepo containing both the frontend (Next.js) and backend (Express) for a Stripe Connect integration demo.

## Structure

- `frontend/` — Next.js 13+ app (creator onboarding, dashboard, payments UI)
- `backend/` — Express + TypeScript API (Stripe payment endpoints)

## Getting Started

### Prerequisites
- Node.js 18+
- npm
- Stripe account & API keys

### Setup

#### Frontend
1. `cd frontend`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create `.env.local` in `frontend/` with:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
   NEXT_PUBLIC_APP_URL=https://your-app-url
   ```
4. Run dev server:
   ```sh
   npm run dev
   ```

#### Backend
1. `cd backend`
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create `.env` in `backend/` with:
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   ```
4. Run dev server:
   ```sh
   npm run dev
   ```

## Project Overview

- `frontend/` — Next.js app for onboarding, dashboard, and payments
- `backend/` — Express API for Stripe payment processing

See each folder's README.md for more details.
