-- ============================================================
-- Wedding Portal — Initial Schema + Row Level Security
-- Run this in your Supabase SQL Editor (Database > SQL Editor)
-- ============================================================

-- ── Extensions ──────────────────────────────────────────────
create extension if not exists btree_gist;

-- ── Profiles ────────────────────────────────────────────────
-- Extends auth.users. Auto-created on user sign-up via trigger.
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  full_name  text not null default '',
  email      text not null unique,
  role       text not null default 'client' check (role in ('admin', 'client')),
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Trigger: create profile row whenever a new user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── Clients ─────────────────────────────────────────────────
-- Wedding-specific metadata for each client account
create table if not exists public.clients (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null unique references public.profiles(id) on delete cascade,
  wedding_date date,
  package_type text,
  notes        text,   -- admin-only field
  created_by   uuid references public.profiles(id),
  created_at   timestamptz not null default now()
);

-- ── Media Files ──────────────────────────────────────────────
create table if not exists public.media_files (
  id            uuid primary key default gen_random_uuid(),
  client_id     uuid not null references public.clients(id) on delete cascade,
  file_name     text not null,
  file_type     text not null check (file_type in ('photo', 'video')),
  storage_path  text not null,
  size_bytes    bigint,
  thumbnail_url text,
  is_favorite   boolean not null default false,
  uploaded_by   uuid references public.profiles(id),
  created_at    timestamptz not null default now()
);

-- ── Media Reactions ──────────────────────────────────────────
create table if not exists public.media_reactions (
  id            uuid primary key default gen_random_uuid(),
  media_file_id uuid not null references public.media_files(id) on delete cascade,
  client_id     uuid not null references public.clients(id) on delete cascade,
  reaction      text not null,
  created_at    timestamptz not null default now(),
  unique(media_file_id, client_id)
);

-- ── Appointments ─────────────────────────────────────────────
create table if not exists public.appointments (
  id               uuid primary key default gen_random_uuid(),
  client_id        uuid references public.clients(id) on delete set null,
  appointment_type text not null check (appointment_type in ('consultation', 'review_session', 'other')),
  start_time       timestamptz not null,
  end_time         timestamptz not null,
  status           text not null default 'pending'
                   check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  notes            text,
  booked_by_name   text,
  booked_by_email  text,
  created_at       timestamptz not null default now(),
  constraint no_end_before_start check (end_time > start_time)
);

-- Prevent double-booking at the database level
alter table public.appointments
  drop constraint if exists no_overlap;
alter table public.appointments
  add constraint no_overlap
  exclude using gist (tstzrange(start_time, end_time) with &&)
  where (status not in ('cancelled'));

-- ── Availability Blocks ──────────────────────────────────────
-- Admin manually blocks time (holidays, personal, etc.)
create table if not exists public.availability_blocks (
  id         uuid primary key default gen_random_uuid(),
  start_time timestamptz not null,
  end_time   timestamptz not null,
  reason     text,
  created_at timestamptz not null default now()
);

-- ════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════

-- Helper: returns true if the current user is an admin
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

-- ── RLS: profiles ────────────────────────────────────────────
alter table public.profiles enable row level security;
drop policy if exists "profiles_own" on public.profiles;
drop policy if exists "profiles_admin" on public.profiles;

create policy "profiles_own" on public.profiles
  for all using (auth.uid() = id);

create policy "profiles_admin" on public.profiles
  for all using (public.is_admin());

-- ── RLS: clients ─────────────────────────────────────────────
alter table public.clients enable row level security;
drop policy if exists "clients_own" on public.clients;
drop policy if exists "clients_admin" on public.clients;

create policy "clients_own" on public.clients
  for select using (user_id = auth.uid());

create policy "clients_admin" on public.clients
  for all using (public.is_admin());

-- ── RLS: media_files ─────────────────────────────────────────
alter table public.media_files enable row level security;
drop policy if exists "media_client_select" on public.media_files;
drop policy if exists "media_client_favorite" on public.media_files;
drop policy if exists "media_admin" on public.media_files;

-- Clients can read only their own files
create policy "media_client_select" on public.media_files
  for select using (
    client_id in (
      select id from public.clients where user_id = auth.uid()
    )
  );

-- Clients can toggle is_favorite only on their own files
create policy "media_client_favorite" on public.media_files
  for update using (
    client_id in (select id from public.clients where user_id = auth.uid())
  ) with check (
    client_id in (select id from public.clients where user_id = auth.uid())
  );

-- Admins can do everything
create policy "media_admin" on public.media_files
  for all using (public.is_admin());

-- ── RLS: media_reactions ─────────────────────────────────────
alter table public.media_reactions enable row level security;
drop policy if exists "reactions_own" on public.media_reactions;
drop policy if exists "reactions_admin" on public.media_reactions;

create policy "reactions_own" on public.media_reactions
  for all using (
    client_id in (select id from public.clients where user_id = auth.uid())
  );

create policy "reactions_admin" on public.media_reactions
  for all using (public.is_admin());

-- ── RLS: appointments ────────────────────────────────────────
alter table public.appointments enable row level security;
drop policy if exists "appt_client_select" on public.appointments;
drop policy if exists "appt_public_insert" on public.appointments;
drop policy if exists "appt_admin" on public.appointments;

-- Clients can see their own confirmed appointments
create policy "appt_client_select" on public.appointments
  for select using (
    client_id in (select id from public.clients where user_id = auth.uid())
    or booked_by_email = (select email from public.profiles where id = auth.uid())
  );

-- Anyone (public) can insert a new appointment (for public booking page)
-- The API route validates the input before inserting
create policy "appt_public_insert" on public.appointments
  for insert with check (true);

-- Admins can do everything
create policy "appt_admin" on public.appointments
  for all using (public.is_admin());

-- ── RLS: availability_blocks ─────────────────────────────────
alter table public.availability_blocks enable row level security;
drop policy if exists "blocks_public_select" on public.availability_blocks;
drop policy if exists "blocks_admin" on public.availability_blocks;

-- Anyone can read blocks (needed for public availability calendar)
create policy "blocks_public_select" on public.availability_blocks
  for select using (true);

create policy "blocks_admin" on public.availability_blocks
  for all using (public.is_admin());

-- ════════════════════════════════════════════════════════════
-- STORAGE BUCKET + POLICIES
-- Run these separately after creating the bucket in the dashboard.
-- Bucket name: client-media   Type: Private (not public)
-- ════════════════════════════════════════════════════════════

/*
-- After creating the "client-media" bucket as PRIVATE, run:

-- Clients can read only from their own folder: clients/{their_client_id}/...
create policy "client_read_own_files" on storage.objects
  for select using (
    bucket_id = 'client-media'
    and (storage.foldername(name))[1] = 'clients'
    and (storage.foldername(name))[2] = (
      select c.id::text from public.clients c
      where c.user_id = auth.uid()
      limit 1
    )
  );

-- Only admins (via service role in server actions) can upload
-- No client-facing upload policy needed since uploads go through the server
*/

-- ── Seed: create admin profile (run once after inviting yourself) ─
-- After you sign up and confirm your email, run this to make yourself admin:
-- update public.profiles set role = 'admin' where email = 'your@email.com';
