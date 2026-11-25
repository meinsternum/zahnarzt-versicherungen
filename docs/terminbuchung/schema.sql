-- Tabelle für Buchungen. Zugriff nur über den Service-Key vom Server (Netlify Function).
-- RLS ist aktiv und es gibt bewusst keine Policies: Browser und anon-Key kommen nicht an die Daten.
create schema if not exists extensions;
create extension if not exists btree_gist with schema extensions;

create table if not exists public.bookings (
  id uuid primary key,
  token text not null unique,
  type_id text not null,
  staff_id text not null,
  start_at timestamptz not null,
  end_at timestamptz not null,
  name text not null,
  email text not null,
  phone text not null default '',
  note text not null default '',
  source text not null default '',
  channel text not null default 'online' check (channel in ('online', 'phone', 'onsite')),
  status text not null default 'confirmed' check (status in ('confirmed', 'cancelled')),
  event_id text not null default '',
  meet_link text not null default '',
  reminders_sent integer[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_at > start_at),
  -- verhindert Doppelbuchungen: pro Person dürfen sich bestätigte Termine nicht überschneiden
  constraint no_overlap exclude using gist (staff_id with =, tstzrange(start_at, end_at) with &&) where (status = 'confirmed')
);

create index if not exists bookings_start_idx on public.bookings (start_at) where status = 'confirmed';

alter table public.bookings enable row level security;
