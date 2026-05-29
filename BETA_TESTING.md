# Tales of Visteria Private Beta

The beta site is an app-gated preview that uses separate browser storage and separate Supabase tables from the live game.

## Beta URLs

- English: `/beta/en/`
- Spanish: `/beta/es/`

On the current GitHub Pages site, that will be:

- `https://redxjak.github.io/ToV/beta/en/`
- `https://redxjak.github.io/ToV/beta/es/`

## Supabase Setup

1. Run `supabase/beta.sql` in the Supabase SQL editor.
2. Add tester emails in lowercase:

```sql
insert into public.beta_tester_allowlist (email, note)
values ('tester@example.com', 'first beta tester')
on conflict (email) do update
set is_active = true,
    updated_at = now();
```

3. Test with an approved account before sharing the beta URL.

## Release Checklist

- Confirm the live site still opens `/en/` and `/es/`.
- Confirm `/beta/en/` shows the beta badge and requires sign-in.
- Confirm an unapproved account is blocked before New Game or Load Game.
- Confirm an approved account can play, save, load, submit a beta score, and open the beta report form.
- Confirm beta scores are stored in `beta_leaderboard_scores`, not `leaderboard_scores`.
- Confirm beta cloud saves are stored in `beta_user_game_data`, not `user_game_data`.
- Send testers the beta URL and remind them that saves and scores are separate from live.
