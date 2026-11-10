# RunReady

AI-powered skiing progression platform.
Created by **Emerson Brown Saville** (Penn State class project).

Built with Next.js 16 (App Router), Tailwind CSS, and Neon Auth, with accounts stored in Neon Postgres. Payments and AI features are not built yet.

## Environment variables

Set these in Vercel → Project → Settings → Environment Variables. Never commit them.

| Variable | Where it comes from |
|---|---|
| `NEON_AUTH_BASE_URL` | Added by the Vercel–Neon integration when Neon Auth is enabled |
| `NEON_AUTH_COOKIE_SECRET` | A random secret of 32+ characters that you generate (signs session cookies) |
| `DATABASE_URL` | Added by the Vercel–Neon integration (used by `npm run users`) |

Pull them into a git-ignored `.env.local` file for local development:

```bash
npx vercel link
npx vercel env pull .env.local
```

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

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
