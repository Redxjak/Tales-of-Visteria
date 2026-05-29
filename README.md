# Tales of Visteria

A browser-based dark fantasy adventure.

Current version: **0.8.23**

## Community

Join the Discord server for project updates and feedback: [Redxjak Discord](https://discord.gg/9C4npSfNQd)

## Content warning

This game may contain vulgar language and dark fantasy themes.

## How to play

Browser version:

- English: [https://redxjak.github.io/Tales-of-Visteria/en/](https://redxjak.github.io/Tales-of-Visteria/en/)
- Spanish: [https://redxjak.github.io/Tales-of-Visteria/es/](https://redxjak.github.io/Tales-of-Visteria/es/)

## Canonical repository and site

This repository is the single source of truth for Tales of Visteria:

- Canonical repo: [Redxjak/Tales-of-Visteria](https://github.com/Redxjak/Tales-of-Visteria)
- Canonical site: [https://redxjak.github.io/Tales-of-Visteria/](https://redxjak.github.io/Tales-of-Visteria/)

Publish game updates from this repository's `main` branch and `docs/` folder. Do not publish new game updates to `Redxjak/ToV`.

## Text and translations

Story and UI text are loaded by the browser version from `docs/assets/data/en.json`, with the Spanish pass maintained in `docs/assets/data/es.json`.

For another language, copy `docs/assets/data/en.json` to a new file, keep the same keys, and translate only the values. The browser version already has `/en` and `/es` routes.

## Online accounts and leaderboard

Version 0.8.1 expands the bridge into a major ritual sequence, extends Jon the DM through the orc camps preview, adds new achievements, embedded level-up choices, and score breakdowns on game over.

Before using it live, run `supabase/leaderboard.sql` in the Supabase SQL editor for the project. The browser app uses the public Supabase URL and publishable key, so Row Level Security must stay enabled.

Public usernames are stored in `user_profiles`, and cloud stats/save data are stored in `user_game_data`. Guest play still uses local browser storage only.

## Private beta

The private beta lives under `/beta/` and is gated inside the app by Supabase login plus a tester allowlist. Beta saves, stats, and leaderboard rows use separate tables and browser storage from the live game. Run `supabase/beta.sql` before inviting testers, then follow `BETA_TESTING.md`.

## Current chapter

The playable opening includes:

- Browser start screen with login, guest play, new game, and load game
- Character selection with Cletus the Warrior, Ren the Ranger, Cal the Scholar, Kili the Dwarf, and Jon the DM
- Special Jon the DM route based on the Visio map
- A caravan attack and forced escape
- Forest loop with miasma
- Cave route into the buried city
- Encounter with the pale girl
- Character-specific outcomes in the pale girl scene
- Doll choice after the pale girl disappears
- City or barracks route, feeding into the residential area
- Lava bridge approach and patrol encounter
- Warehouse ritual battle against orcs, cultists, and a dangerous ritual leader
- A hidden bridge turning point with branching consequences
- Ritual surge branch with leave, stop, or jump-into-the-hole outcomes
- False Hydra interruption and the arrival of the Order
- Bridge-end checkpoint with rest, score submission, save, and leaderboard options
- Orc camps preview endpoint for the next story update
- Browser version with user accounts and leaderboards
- English story/UI text loaded from `docs/assets/data/en.json`, ready for additional language files
- Monster references included in the browser game data
