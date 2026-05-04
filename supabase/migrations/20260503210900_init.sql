-- Captain Shad — initial schema
-- Multi-tenant model: every guide owns their own data; RLS enforces isolation.
-- Public client recap is fetched server-side using the service role and bypasses RLS.

-- ---------- enums ----------
create type subscription_tier as enum ('free', 'pro');
create type subscription_status as enum ('inactive', 'trialing', 'active', 'past_due', 'canceled', 'unpaid');
create type trip_status as enum ('scheduled', 'in_progress', 'completed', 'archived');
create type kept_or_released as enum ('kept', 'released', 'unknown');
create type privacy_level as enum ('private', 'pattern_only', 'public_safe');

-- ---------- helper for updated_at ----------
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------- user_profile ----------
create table public.user_profile (
  id                    uuid primary key references auth.users(id) on delete cascade,
  guide_name            text not null default '',
  company_name          text not null default '',
  booking_url           text not null default '',
  phone                 text not null default '',
  email                 text not null default '',
  logo_url              text not null default '',
  service_area          text[] not null default '{}',
  target_species        text[] not null default '{}',
  privacy_defaults      jsonb not null default '{"hide_exact_locations":true,"hide_route":true,"allow_pattern_summary":true}'::jsonb,
  onboarded             boolean not null default false,
  stripe_customer_id    text,
  subscription_tier     subscription_tier not null default 'free',
  subscription_status   subscription_status not null default 'inactive',
  current_period_end    timestamptz,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create trigger user_profile_updated_at before update on public.user_profile
for each row execute function public.touch_updated_at();

alter table public.user_profile enable row level security;

create policy "user can view own profile" on public.user_profile
  for select using (auth.uid() = id);
create policy "user can update own profile" on public.user_profile
  for update using (auth.uid() = id);
create policy "user can insert own profile" on public.user_profile
  for insert with check (auth.uid() = id);

-- Auto-create profile row on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.user_profile (id, email)
  values (new.id, coalesce(new.email, ''));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- client (CRM-lite) ----------
create table public.client (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.user_profile(id) on delete cascade,
  name        text not null,
  email       text not null default '',
  phone       text not null default '',
  notes       text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index client_user_id_idx on public.client(user_id);

create trigger client_updated_at before update on public.client
for each row execute function public.touch_updated_at();

alter table public.client enable row level security;
create policy "client owner all" on public.client
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- trip ----------
create table public.trip (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.user_profile(id) on delete cascade,
  client_id         uuid references public.client(id) on delete set null,
  trip_date         date not null,
  title             text not null,
  general_area      text not null default '',
  launch_location   text not null default '',
  water_body        text not null default '',
  boat_type         text not null default '',
  target_species    text[] not null default '{}',
  privacy_level     privacy_level not null default 'private',
  status            trip_status not null default 'completed',
  notes             text not null default '',
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index trip_user_id_idx on public.trip(user_id);
create index trip_client_id_idx on public.trip(client_id);
create index trip_date_idx on public.trip(user_id, trip_date desc);

create trigger trip_updated_at before update on public.trip
for each row execute function public.touch_updated_at();

alter table public.trip enable row level security;
create policy "trip owner all" on public.trip
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- catch ----------
create table public.catch (
  id                    uuid primary key default gen_random_uuid(),
  trip_id               uuid not null references public.trip(id) on delete cascade,
  user_id               uuid not null references public.user_profile(id) on delete cascade,
  species               text not null,
  time_caught           timestamptz not null,
  approx_length_inches  numeric,
  approx_weight_lbs     numeric,
  kept_or_released      kept_or_released not null default 'released',
  bait_or_lure          text not null default '',
  presentation          text not null default '',
  structure_tags        text[] not null default '{}',
  water_depth_ft        numeric,
  photo_url             text,
  notes                 text not null default ''
);

create index catch_trip_id_idx on public.catch(trip_id);
create index catch_user_id_idx on public.catch(user_id);

alter table public.catch enable row level security;
create policy "catch owner all" on public.catch
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- conditions (one per trip) ----------
create table public.conditions (
  id                uuid primary key default gen_random_uuid(),
  trip_id           uuid not null unique references public.trip(id) on delete cascade,
  user_id           uuid not null references public.user_profile(id) on delete cascade,
  time_observed     timestamptz not null default now(),
  tide_stage        text not null default 'unknown',
  wind_direction    text not null default 'unknown',
  wind_speed_mph    numeric,
  water_clarity     text not null default 'unknown',
  cloud_cover       text not null default 'unknown',
  bait_activity     text not null default 'unknown',
  bird_activity     text not null default 'unknown',
  current_strength  text not null default 'unknown',
  markers           text[] not null default '{}',
  notes             text not null default ''
);

create index conditions_user_id_idx on public.conditions(user_id);

alter table public.conditions enable row level security;
create policy "conditions owner all" on public.conditions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- debrief (one per trip) ----------
create table public.debrief (
  id                       uuid primary key default gen_random_uuid(),
  trip_id                  uuid not null unique references public.trip(id) on delete cascade,
  user_id                  uuid not null references public.user_profile(id) on delete cascade,
  main_pattern             text not null default '',
  why_this_area            text not null default '',
  what_changed             text not null default '',
  bite_turn_on             text not null default '',
  bite_shut_off            text not null default '',
  what_guide_looked_for    text not null default '',
  what_guide_avoided       text not null default '',
  try_tomorrow             text not null default '',
  practice_for_next        text not null default ''
);

create index debrief_user_id_idx on public.debrief(user_id);

alter table public.debrief enable row level security;
create policy "debrief owner all" on public.debrief
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- pattern_card (one per trip) ----------
create table public.pattern_card (
  id                       uuid primary key default gen_random_uuid(),
  trip_id                  uuid not null unique references public.trip(id) on delete cascade,
  user_id                  uuid not null references public.user_profile(id) on delete cascade,
  title                    text not null,
  summary                  text not null,
  target_species           text[] not null default '{}',
  tide_pattern             text not null default '',
  wind_pattern             text not null default '',
  structure_pattern        text not null default '',
  bait_pattern             text not null default '',
  presentation_pattern     text not null default '',
  bite_window              text not null default '',
  why_it_worked            text not null default '',
  what_to_try_next_time    text not null default '',
  confidence_score         numeric not null default 0,
  privacy_warning          text not null default '',
  conservation_note        text not null default '',
  created_at               timestamptz not null default now()
);

create index pattern_card_user_id_idx on public.pattern_card(user_id);

alter table public.pattern_card enable row level security;
create policy "pattern_card owner all" on public.pattern_card
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- recap_share ----------
create table public.recap_share (
  id              uuid primary key default gen_random_uuid(),
  trip_id         uuid not null unique references public.trip(id) on delete cascade,
  user_id         uuid not null references public.user_profile(id) on delete cascade,
  token           text not null unique,
  view_count      integer not null default 0,
  last_viewed_at  timestamptz,
  expires_at      timestamptz,
  created_at      timestamptz not null default now()
);

create index recap_share_token_idx on public.recap_share(token);
create index recap_share_user_id_idx on public.recap_share(user_id);

alter table public.recap_share enable row level security;
create policy "recap_share owner all" on public.recap_share
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ---------- storage bucket for catch photos ----------
insert into storage.buckets (id, name, public)
values ('catches', 'catches', false)
on conflict (id) do nothing;

-- Owner-scoped photo policies. Object name convention: {user_id}/{trip_id}/{catch_id}.jpg
-- so the first path segment is the owning user's UUID. RLS policy ties access to that.
create policy "catch photos: owner read"
  on storage.objects for select
  using (bucket_id = 'catches' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "catch photos: owner write"
  on storage.objects for insert
  with check (bucket_id = 'catches' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "catch photos: owner update"
  on storage.objects for update
  using (bucket_id = 'catches' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "catch photos: owner delete"
  on storage.objects for delete
  using (bucket_id = 'catches' and (storage.foldername(name))[1] = auth.uid()::text);
