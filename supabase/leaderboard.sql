create table if not exists public.leaderboard_scores (
  id uuid primary key default gen_random_uuid(),
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

alter table public.leaderboard_scores enable row level security;

drop policy if exists "Anyone can read leaderboard" on public.leaderboard_scores;
create policy "Anyone can read leaderboard"
on public.leaderboard_scores
for select
to anon
using (true);

drop policy if exists "Anyone can submit leaderboard scores" on public.leaderboard_scores;
create policy "Anyone can submit leaderboard scores"
on public.leaderboard_scores
for insert
to anon
with check (
  score >= 0
  and score <= 999999
  and char_length(player_name) between 1 and 32
  and fights_won >= 0
  and deaths >= 0
  and achievements_unlocked >= 0
  and forest_attempts >= 0
);
