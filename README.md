# Flower Room NG

Florist storefront for Lagos — pastel pink shop inspired by flowers.ae, with Paystack checkout, WhatsApp, customer accounts, and an admin panel.

## Stack

- **Next.js** — storefront + admin + API
- **Supabase** — PostgreSQL database + Storage for product photos
- **Paystack** — card / transfer payments (NGN)

## Setup

### 1. Create a Supabase project

1. Go to [supabase.com](https://supabase.com) → New project  
2. **Database** → copy the connection string (URI). Prefer the **pooler** URL for Vercel (`?pgbouncer=true`).  
3. **Project Settings → API** → copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server only)

Storage: the app auto-creates a public bucket named `uploads` on first admin photo upload. You can also create it manually (public).

### 2. Install & env

```bash
# Node 20+
nvm use 22
npm install
cp .env.example .env
# Edit .env with Supabase + Paystack + admin secrets
```

### 3. Database

```bash
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).  
Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

## Environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | Supabase Postgres URI |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for photo uploads |
| `ADMIN_PASSWORD` | Admin login |
| `ADMIN_SECRET` / `CUSTOMER_SECRET` | JWT cookie secrets |
| `PAYSTACK_SECRET_KEY` / `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Paystack keys |
| `NEXT_PUBLIC_SITE_URL` | Public site URL (Paystack callbacks) |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp FAB |

Without Supabase Storage keys, admin uploads fall back to local `public/uploads` (dev only — **not** durable on Vercel).  
Without Paystack keys, checkout creates orders and uses a demo success redirect.

## Deploy (Vercel)

1. Push to GitHub  
2. Import on Vercel  
3. Set all env vars from `.env.example` (use **live** Paystack keys for production)  
4. `NEXT_PUBLIC_SITE_URL` = your production domain  
5. Build command already runs `prisma generate` via `npm run build`  
6. After first deploy, run `prisma db push` / seed once against the production `DATABASE_URL` (local machine or Vercel CLI)

## Scripts

- `npm run dev` — development server  
- `npm run db:seed` — seed catalogue  
- `npm run db:reset` — wipe DB and reseed (**destructive**)  
- `npm run db:push` — apply Prisma schema to Supabase  
