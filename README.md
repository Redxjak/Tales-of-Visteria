# Tales of Visteria

A simple GUI dark fantasy adventure.

## Content warning

This game may contain vulgar language and dark fantasy themes.

## How to play

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

Story and UI text are loaded from `translations/en.json`.

For another language, copy `translations/en.json` to a new file such as `translations/es.json`, keep the same keys, and translate only the values. The game currently loads English, but this structure is ready for a future online version to choose a language file based on the page link.

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
- English story/UI text loaded from `translations/en.json`, ready for additional language files
- Monster references loaded from `monster_stats.json`, generated from the D&D monster stats spreadsheet
