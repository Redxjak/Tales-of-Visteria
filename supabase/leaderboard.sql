create table if not exists public.leaderboard_scores (
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

alter table public.leaderboard_scores
add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table public.leaderboard_scores enable row level security;

create table if not exists public.user_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 1 and 32),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_profiles enable row level security;

create table if not exists public.user_game_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  stats jsonb not null default '{}'::jsonb,
  saved_game jsonb,
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.user_game_data enable row level security;

grant select, insert on table public.leaderboard_scores to anon, authenticated;
grant select, insert, update on table public.user_profiles to authenticated;
grant select, insert, update on table public.user_game_data to authenticated;

drop policy if exists "Anyone can read leaderboard" on public.leaderboard_scores;
create policy "Anyone can read leaderboard"
on public.leaderboard_scores
for select
to public
using (true);

drop policy if exists "Anyone can submit leaderboard scores" on public.leaderboard_scores;
create policy "Anyone can submit leaderboard scores"
on public.leaderboard_scores
for insert
to public
with check (
  score >= 0
  and score <= 999999
  and char_length(player_name) between 1 and 32
  and fights_won >= 0
  and deaths >= 0
  and achievements_unlocked >= 0
  and forest_attempts >= 0
  and (user_id is null or user_id = auth.uid())
);

drop policy if exists "Users can read own profile" on public.user_profiles;
create policy "Users can read own profile"
on public.user_profiles
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can insert own profile" on public.user_profiles;
create policy "Users can insert own profile"
on public.user_profiles
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can update own profile" on public.user_profiles;
create policy "Users can update own profile"
on public.user_profiles
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

drop policy if exists "Users can read own game data" on public.user_game_data;
create policy "Users can read own game data"
on public.user_game_data
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can insert own game data" on public.user_game_data;
create policy "Users can insert own game data"
on public.user_game_data
for insert
to authenticated
with check (user_id = auth.uid());

drop policy if exists "Users can update own game data" on public.user_game_data;
create policy "Users can update own game data"
on public.user_game_data
for update
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());
