# PupPilot 🐾

Daily dog care management app — Next.js + Supabase + Tailwind CSS.

---

## Setup (5 steps)

### 1. Create Supabase project
1. Go to [supabase.com](https://supabase.com) → New project
2. Copy your **Project URL** and **anon public key** (Settings → API)

### 2. Run the database schema
1. Go to your Supabase project → **SQL Editor**
2. Paste the entire contents of `supabase/schema.sql`
3. Click **Run**

### 3. Create the storage bucket
1. In Supabase → **Storage** → **New bucket**
2. Name it `documents`, check **Public bucket**
3. In Storage → **Policies** → add these policies on `storage.objects`:
   - INSERT: `auth.uid() is not null`
   - SELECT: `true` (public reads)
   - DELETE: `auth.uid()::text = (storage.foldername(name))[1]`

### 4. Set environment variables
Create a file called `.env.local` in the root of this project:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 5. Deploy to Vercel
1. Push this folder to a new GitHub repo
2. Go to [vercel.com](https://vercel.com) → Import project
3. Add the two env vars from step 4
4. Deploy — Vercel installs everything automatically

---

## Pages

| Route | Description |
|---|---|
| `/today` | Dashboard — dog card, checklist, reminders, quick actions |
| `/dogs` | Dog profiles list |
| `/dogs/new` | Add a dog |
| `/checklist` | Manage daily routines |
| `/reminders` | Vet visits, meds, recurring events |
| `/records` | Document upload & storage |
| `/sitter-guide` | AI-generated sitter guide |
| `/training` | Training goals & session logs |
| `/settings` | Account, notifications, billing |
| `/pricing` | Stripe pricing placeholder |
| `/login` | Sign in |
| `/signup` | Create account |

---

## Colors
- Blue `#5B9BD5` — primary actions
- Coral `#E8705A` — alerts, accents
- Cream `#FDF8F3` — background
- Charcoal `#2E2E2E` — text
