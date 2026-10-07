# Flower Room NG

Florist storefront for Lagos — pastel pink shop inspired by flowers.ae, with Paystack checkout, WhatsApp chat button, and an admin panel.

## Setup

```bash
# use Node 20+
nvm use 22
npm install
cp .env.example .env
npm run db:reset
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)  
Default password: `flowerroomadmin` (change in `.env`).

## Environment

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | SQLite path (`file:./dev.db`) |
| `ADMIN_PASSWORD` | Admin login |
| `ADMIN_SECRET` | JWT cookie secret |
| `PAYSTACK_SECRET_KEY` / `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` | Live/test Paystack keys |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | WhatsApp FAB (e.g. `2348012345678`) |
| `NEXT_PUBLIC_PHONE` | Header phone |
| `NEXT_PUBLIC_SITE_URL` | Paystack callback base URL |

Without real Paystack keys, checkout still creates orders and redirects to a demo success page.

## Scripts

- `npm run dev` — development server
- `npm run db:seed` — reseed catalogue
- `npm run db:reset` — wipe DB and reseed
