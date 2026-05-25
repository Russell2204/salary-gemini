<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# VibeFinance — Personal finance dashboard (Russian, UZS)

## Quick commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run lint` | ESLint 9 flat config |
| `npx prisma generate` | Generate client to `generated/client/` (auto-runs on `npm install`) |
| `npx prisma db push` | Sync schema to DB |
| `npx tsx <file.ts>` | Run standalone TS scripts (e.g. `test-prisma.ts`) |

No seed script in package.json despite `prisma/seed.ts` existing — run via `npx tsx prisma/seed.ts` manually.

## Architecture

- **Next.js 16 App Router** — `app/` has pages + `app/api/` routes. Layout in Russian (`lang="ru"`).
- **NextAuth v5 beta** — credentials provider, JWT sessions. Config in `auth.ts`; dynamic import of prisma inside `authorize()` keeps it out of Edge runtime.
- **Middleware** (`middleware.ts`) — wraps `auth()`, protects `/` (dashboard), redirects logged-in users away from `/login` & `/register`. Matcher excludes `/api`, `_next/*`, `favicon.ico`.
- **Gemini AI** — `POST /api/analyze` sends current-month data to `gemini-2.5-flash` with Russian-language prompts. Requires `GEMINI_API_KEY`.
- **Components** — all client components; data fetching lives in `app/page.tsx` and flows via props + `onUpdate` callback.

## Prisma 7 quirks

- Uses **`prisma-client` generator** (not the old `@prisma/client`). Output goes to `generated/client/`.
- **No `index.{ts,js}`** — entry point is `client.ts`. Import path must include it: `'../generated/client/client'`.
- **`url` is NOT in `schema.prisma`** — managed via `prisma.config.ts` which reads `DATABASE_URL` from env.
- Uses explicit **`PrismaPg` adapter** (`@prisma/adapter-pg`) — import the generated client, not `@prisma/client`.
- Singleton pattern in `lib/prisma.ts` with `pg.Pool`.
- `generated/client/` is gitignored — must regenerate after clone via `postinstall` or `npx prisma generate`.

## Database state (inconsistent — beware)

`schema.prisma` declares `provider = "postgresql"` and the app uses `PrismaPg` adapter, but the existing migration (SQLite syntax), `.env` (`file:./dev.db`), and `dev.db` file are all **SQLite**. Switch to a real PostgreSQL instance before production.

## Required env vars (`.env`)

```
DATABASE_URL=postgresql://...
GEMINI_API_KEY=...
AUTH_SECRET=...
AUTH_URL=http://localhost:3000
```
