# Wedding Portal — Khushal Sinhmar Films

A private, premium client portal for delivering wedding photos and videos, managing appointments, and showing live availability. Built with Next.js 14, Supabase, Resend, and Framer Motion.

---

## Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + custom design tokens |
| Animations | Framer Motion |
| Backend/Auth | Supabase (PostgreSQL + RLS + Auth + Storage) |
| Email | Resend + React Email |
| Deployment | Vercel + Supabase Cloud |

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Go to **Database → SQL Editor** and run the contents of `supabase/migrations/001_initial_schema.sql`
3. Go to **Storage** and create a bucket named `client-media` with **Private** visibility
4. Run the storage policy SQL from the comments at the bottom of the migration file

### 3. Configure environment variables

Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

| Variable | Where to find it |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API (keep secret!) |
| `RESEND_API_KEY` | [resend.com/api-keys](https://resend.com/api-keys) |
| `ADMIN_EMAIL` | Your email for booking notifications |
| `EMAIL_FROM` | A verified sender address in Resend |

### 4. Make yourself an admin

After signing up and confirming your email, run this in the Supabase SQL Editor:

```sql
update public.profiles set role = 'admin' where email = 'your@email.com';
```

### 5. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Key URLs

| URL | Purpose |
|---|---|
| `/login` | Login for clients and admin |
| `/dashboard` | Client overview page |
| `/media` | Client gallery (photos + videos) |
| `/appointments` | Client's bookings |
| `/book` | **Public** booking page (share with anyone) |
| `/admin/dashboard` | Admin overview |
| `/admin/clients` | Manage all client accounts |
| `/admin/appointments` | All bookings + confirm/cancel |

---

## Creating Client Accounts

Use the API route (server-side, secure):

```bash
POST /api/admin/create-client
Content-Type: application/json

{
  "full_name": "Emma & James Smith",
  "email": "emma@email.com",
  "password": "temporary-password-123",
  "wedding_date": "2025-09-14",
  "package_type": "Full Day Coverage",
  "notes": "Ceremony at St. Paul's, reception at The Manor"
}
```

Or use the UI at `/admin/clients/new`.

---

## Uploading Media

Navigate to `/admin/clients/[clientId]` and use the drag-and-drop upload zone. Files are uploaded using the **TUS resumable upload protocol** — so large videos (10–20 GB) can be uploaded and will auto-resume if interrupted.

---

## Privacy & Security

- **Row Level Security (RLS)** is enforced at the PostgreSQL level — clients can only ever see their own files, even if they manipulate API calls
- Media is served via **signed URLs** (1-hour expiry) — never raw storage paths
- Double-booking is prevented by a **PostgreSQL exclusion constraint** on the `appointments` table
- The `SUPABASE_SERVICE_ROLE_KEY` is only used in server-side Route Handlers — never exposed to the browser

---

## Deployment

1. Push to GitHub
2. Connect your repo to [Vercel](https://vercel.com)
3. Add all environment variables in Vercel's dashboard
4. Deploy — Vercel auto-deploys on every push to `main`

**Estimated monthly cost at launch:** ~$0–$45/month (Vercel Hobby + Supabase Free)

---

## Customisation Checklist

- [ ] Replace "Khushal Sinhmar Films & Photography" in `components/layout/Logo.tsx`
- [ ] Update `EMAIL_FROM` and `ADMIN_EMAIL` in `.env.local`
- [ ] Set working hours in `lib/utils/availability.ts` (`WORK_START_HOUR`, `WORK_END_HOUR`)
- [ ] Update `app/layout.tsx` metadata (site name, description)
- [ ] Optionally add your brand's Instagram/website link to the footer
