create table if not exists public.beta_tester_allowlist (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  is_active boolean not null default true,
  note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint beta_tester_allowlist_email_check check (email = lower(trim(email))),
  constraint beta_tester_allowlist_identity_check check (user_id is not null or char_length(email) > 3)
);

create unique index if not exists beta_tester_allowlist_email_key
on public.beta_tester_allowlist (email);

create unique index if not exists beta_tester_allowlist_user_id_key
on public.beta_tester_allowlist (user_id)
where user_id is not null;

alter table public.beta_tester_allowlist enable row level security;

create table if not exists public.beta_leaderboard_scores (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  player_name text not null check (char_length(player_name) between 1 and 32),
  character_name text not null,
  character_class text not null,
  score integer not null check (score >= 0 and score <= 999999),
  ending_reached boolean not null default false,
  fights_won integer not null default 0 check (fights_won >= 0),
  deaths integer not null default 0 check (deaths >= 0),
  achievements_unlocked integer not null default 0 check (achievements_unlocked >= 0),
  forest_attempts integer not null default 0 check (forest_attempts >= 0),
  route text,
  language text not null default 'en',
  created_at timestamptz not null default now()
);

alter table public.beta_leaderboard_scores enable row level security;

create table if not exists public.beta_user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 32),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.beta_user_profiles enable row level security;

create table if not exists public.beta_user_game_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stats jsonb not null default '{}'::jsonb,
  saved_game jsonb,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.beta_user_game_data enable row level security;

grant select on table public.beta_tester_allowlist to authenticated;
grant select, insert on table public.beta_leaderboard_scores to authenticated;
grant select, insert, update on table public.beta_user_profiles to authenticated;
grant select, insert, update on table public.beta_user_game_data to authenticated;

drop policy if exists "Beta testers can read own allowlist row" on public.beta_tester_allowlist;
create policy "Beta testers can read own allowlist row"
on public.beta_tester_allowlist
for select
to authenticated
using (
  is_active
  and (
    user_id = (select auth.uid())
    or lower(email) = lower((select auth.jwt() ->> 'email'))
  )
);

drop policy if exists "Beta testers can read beta leaderboard" on public.beta_leaderboard_scores;
create policy "Beta testers can read beta leaderboard"
on public.beta_leaderboard_scores
for select
to authenticated
using (
  exists (
    select 1
    from public.beta_tester_allowlist testers
    where testers.is_active
      and (
        testers.user_id = (select auth.uid())
        or lower(testers.email) = lower((select auth.jwt() ->> 'email'))
      )
  )
);

drop policy if exists "Beta testers can submit own beta scores" on public.beta_leaderboard_scores;
create policy "Beta testers can submit own beta scores"
on public.beta_leaderboard_scores
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and score >= 0
  and score <= 999999
  and char_length(player_name) between 1 and 32
  and fights_won >= 0
  and deaths >= 0
  and achievements_unlocked >= 0
  and forest_attempts >= 0
  and exists (
    select 1
    from public.beta_tester_allowlist testers
    where testers.is_active
      and (
        testers.user_id = (select auth.uid())
        or lower(testers.email) = lower((select auth.jwt() ->> 'email'))
      )
  )
);

drop policy if exists "Beta testers can read own profile" on public.beta_user_profiles;
create policy "Beta testers can read own profile"
on public.beta_user_profiles
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Beta testers can insert own profile" on public.beta_user_profiles;
create policy "Beta testers can insert own profile"
on public.beta_user_profiles
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.beta_tester_allowlist testers
    where testers.is_active
      and (
        testers.user_id = (select auth.uid())
        or lower(testers.email) = lower((select auth.jwt() ->> 'email'))
      )
  )
);

drop policy if exists "Beta testers can update own profile" on public.beta_user_profiles;
create policy "Beta testers can update own profile"
on public.beta_user_profiles
for update
to authenticated
using (user_id = (select auth.uid()))
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.beta_tester_allowlist testers
    where testers.is_active
      and (
        testers.user_id = (select auth.uid())
        or lower(testers.email) = lower((select auth.jwt() ->> 'email'))
      )
  )
);

drop policy if exists "Beta testers can read own game data" on public.beta_user_game_data;
create policy "Beta testers can read own game data"
on public.beta_user_game_data
for select
to authenticated
using (user_id = (select auth.uid()));

drop policy if exists "Beta testers can insert own game data" on public.beta_user_game_data;
create policy "Beta testers can insert own game data"
on public.beta_user_game_data
for insert
to authenticated
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.beta_tester_allowlist testers
    where testers.is_active
      and (
        testers.user_id = (select auth.uid())
        or lower(testers.email) = lower((select auth.jwt() ->> 'email'))
      )
  )
);

drop policy if exists "Beta testers can update own game data" on public.beta_user_game_data;
create policy "Beta testers can update own game data"
on public.beta_user_game_data
for update
to authenticated
using (user_id = (select auth.uid()))
with check (
  user_id = (select auth.uid())
  and exists (
    select 1
    from public.beta_tester_allowlist testers
    where testers.is_active
      and (
        testers.user_id = (select auth.uid())
        or lower(testers.email) = lower((select auth.jwt() ->> 'email'))
      )
  )
);
