-- PupPilot Database Schema
-- Run this in your Supabase SQL Editor (supabase.com → project → SQL Editor)

-- ============================================================
-- DOGS
-- ============================================================
create table if not exists public.dogs (
  id            uuid primary key default gen_random_uuid(),
  owner_id      uuid references auth.users(id) on delete cascade not null,
  name          text not null,
  breed         text,
  age_years     numeric(4,1),
  weight_lbs    numeric(6,1),
  sex           text check (sex in ('Male','Female')),
  notes         text,
  vet_name      text,
  vet_phone     text,
  microchip     text,
  avatar_url    text,
  created_at    timestamptz default now()
);

alter table public.dogs enable row level security;
create policy "Users manage own dogs" on public.dogs
  using (auth.uid() = owner_id) with check (auth.uid() = owner_id);

-- ============================================================
-- ROUTINES
-- ============================================================
create table if not exists public.routines (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  dog_id        uuid references public.dogs(id) on delete set null,
  title         text not null,
  category      text not null default 'other',
  time_of_day   text check (time_of_day in ('Morning','Afternoon','Evening','Night','Anytime')),
  active        boolean default true,
  created_at    timestamptz default now()
);

alter table public.routines enable row level security;
create policy "Users manage own routines" on public.routines
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- ROUTINE LOGS (daily check-ins)
-- ============================================================
create table if not exists public.routine_logs (
  id            uuid primary key default gen_random_uuid(),
  routine_id    uuid references public.routines(id) on delete cascade not null,
  user_id       uuid references auth.users(id) on delete cascade not null,
  log_date      date not null,
  created_at    timestamptz default now(),
  unique (routine_id, user_id, log_date)
);

alter table public.routine_logs enable row level security;
create policy "Users manage own logs" on public.routine_logs
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- REMINDERS
-- ============================================================
create table if not exists public.reminders (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  dog_id        uuid references public.dogs(id) on delete set null,
  title         text not null,
  category      text,
  remind_at     timestamptz,
  frequency     text default 'Once',
  notes         text,
  active        boolean default true,
  created_at    timestamptz default now()
);

alter table public.reminders enable row level security;
create policy "Users manage own reminders" on public.reminders
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- DOCUMENTS
-- ============================================================
create table if not exists public.documents (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  dog_id        uuid references public.dogs(id) on delete set null,
  name          text not null,
  file_url      text not null,
  file_type     text,
  category      text,
  notes         text,
  created_at    timestamptz default now()
);

alter table public.documents enable row level security;
create policy "Users manage own documents" on public.documents
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- SITTER GUIDES
-- ============================================================
create table if not exists public.sitter_guides (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  dog_id        uuid references public.dogs(id) on delete set null,
  content       text not null,
  generated_at  timestamptz default now(),
  created_at    timestamptz default now(),
  unique (user_id)
);

alter table public.sitter_guides enable row level security;
create policy "Users manage own sitter guides" on public.sitter_guides
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- TRAINING GOALS
-- ============================================================
create table if not exists public.training_goals (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade not null,
  dog_id        uuid references public.dogs(id) on delete set null,
  title         text not null,
  category      text,
  target_date   date,
  notes         text,
  completed     boolean default false,
  created_at    timestamptz default now()
);

alter table public.training_goals enable row level security;
create policy "Users manage own training goals" on public.training_goals
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- TRAINING LOGS
-- ============================================================
create table if not exists public.training_logs (
  id                uuid primary key default gen_random_uuid(),
  goal_id           uuid references public.training_goals(id) on delete cascade not null,
  user_id           uuid references auth.users(id) on delete cascade not null,
  session_date      date not null,
  duration_minutes  integer,
  notes             text,
  created_at        timestamptz default now()
);

alter table public.training_logs enable row level security;
create policy "Users manage own training logs" on public.training_logs
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- STORAGE BUCKET for documents
-- ============================================================
-- Run these in Storage → Buckets if not created automatically:
-- insert into storage.buckets (id, name, public) values ('documents', 'documents', true);
-- create policy "Auth users can upload" on storage.objects for insert with check (auth.uid() is not null);
-- create policy "Public read documents" on storage.objects for select using (true);
-- create policy "Users delete own docs" on storage.objects for delete using (auth.uid()::text = (storage.foldername(name))[1]);
