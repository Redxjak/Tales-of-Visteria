# Tales of Visteria

A simple GUI dark fantasy adventure.

Current version: **0.7.6**

## Content warning

This game may contain vulgar language and dark fantasy themes.

## How to play

Browser version:

- English: [https://redxjak.github.io/ToV/en](https://redxjak.github.io/ToV/en)
- Spanish: [https://redxjak.github.io/ToV/es](https://redxjak.github.io/ToV/es)

Download or run the latest Windows executable:

[TalesofVisteria.exe](dist/TalesofVisteria.exe)

Run the game from this folder:

```powershell
python game.py
```

If your computer uses the Python launcher instead:

```powershell
py game.py
```

On Windows, you can also double-click `Tales of Visteria.pyw` to launch the GUI without a console window.

## Text and translations

Story and UI text are loaded from `translations/en.json`, with the Spanish pass maintained in `translations/es.json`.

For another language, copy `translations/en.json` to a new file, keep the same keys, and translate only the values. The browser version already has `/en` and `/es` routes.

## Online accounts and leaderboard

Version 0.7.6 adds Supabase email/password accounts, cloud user data, and public leaderboard support for the browser version.

Before using it live, run `supabase/leaderboard.sql` in the Supabase SQL editor for the project. The browser app uses the public Supabase URL and publishable key, so Row Level Security must stay enabled.

Public usernames are stored in `user_profiles`, and cloud stats/save data are stored in `user_game_data`. Guest play still uses local browser storage only.

## Current chapter

The playable opening includes:

- Windowed start screen with new game, load game, and quit
- Character selection with Cletus the Warrior, Ren the Ranger, Cal the Scholar, Kili the Dwarf, and Jon the DM
- Special Jon the DM route based on the Visio map
- A caravan attack and forced escape
- Forest loop with miasma
- Cave route into the buried city
- Encounter with the pale girl
- Character-specific outcomes in the pale girl scene
- Doll choice after the pale girl disappears
- City or barracks route, feeding into the residential area
- Bridge, warehouse ritual, and production area finale
- Basic save/load using `savegame.json`
- Browser version with user accounts and leaderboards
- English story/UI text loaded from `translations/en.json`, ready for additional language files
- Monster references loaded from `monster_stats.json`, generated from the D&D monster stats spreadsheet
