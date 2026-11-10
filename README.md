# RunReady

AI-powered skiing progression platform.
Created by **Emerson Brown Saville** (Penn State class project).

Built with Next.js 16 (App Router), Tailwind CSS, Neon Postgres + Neon Auth (accounts), the Claude API (AI progression plans, Claude Sonnet 5.5), and Stripe Checkout ($9.99/month subscription).

## Environment variables

Set these in Vercel → Project → Settings → Environment Variables. Never commit them.

| Variable | Where it comes from |
|---|---|
| `VITE_NEON_AUTH_URL` (or `NEON_AUTH_BASE_URL`) | Neon Auth URL, added by the Vercel–Neon integration when Neon Auth is enabled |
| `NEON_AUTH_COOKIE_SECRET` | A random secret of 32+ characters that you generate (signs session cookies) |
| `DATABASE_URL` | Added by the Vercel–Neon integration (accounts data, plans, subscriptions) |
| `ANTHROPIC_API_KEY` | Claude API key from console.anthropic.com (AI plans) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...` for testing, `sk_live_...` for real payments) |
| `STRIPE_PRICE_CENTS` | Optional monthly price in cents (default `999`; use `100` for a $1 test) |
| `STRIPE_WEBHOOK_SECRET` | Optional: keeps renewals and cancellations in sync via `/api/stripe/webhook` |

Pull them into a git-ignored `.env.local` file for local development:

```bash
npx vercel link
npx vercel env pull .env.local --environment=preview
```

The integration adds its variables to Production and Preview, so pull from Preview.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## How it works

- **AI plans:** `/plan/new` collects the skier's answers; `src/lib/ai/plan.ts` sends them to Claude with structured outputs and saves the plan in the `progression_plans` table. Free accounts get 1 plan; Pro is unlimited.
- **Payments:** the Upgrade button starts Stripe Checkout; `/billing/success` confirms the session with Stripe and records the subscription in the `subscriptions` table.
- **Demo account:** `demo@demo.com` always has full paid access (`src/lib/access.ts`). Create it once through the normal sign-up page.
- Tables are created automatically on first use (`src/lib/db.ts`).

## Auth routes

- `/auth/sign-up` and `/auth/sign-in`: email + password forms. Neon Auth hashes passwords; the app never stores them.
- `/dashboard`: protected page. Signed-out visitors are redirected to sign-in.
- `/api/auth/*`: Neon Auth proxy handler.
- `npm run users`: lists accounts in `neon_auth.user` (no password data).

## Checks

```bash
npm run lint
npx tsc --noEmit
npm run build
```
