# Tales of Visteria Design Notes

Source: `C:\Users\derri\Downloads\Tales of Visteria.vsdx`

## Opening

- Character selection:
  - Cletus the Warrior
  - Cal the Scholar
  - Ren the Ranger
  - Kili the Dwarf
  - Jon the DM
- The party begins in a merchant caravan.
- Orcs and goblins attack.
- Player choice:
  - Fight: kill some enemies, but the caravan is still overrun.
  - Run: escape the caravan attack.

## Escape Choice

- The player is chased and finds a faded, unreadable signpost.
- Choice:
  - Forest with gray miasma.
  - Cave.
- Forest route:
  - Player gets lost for hours.
  - They return to the beginning while still being chased, as if no time passed.
- Cave route:
  - Player slips into the cave as shouts get louder.

## Cave And Ghost Girl

- The cave leads into a dead underground place.
- A little girl with a white face and black hair stands in the corridor.
- Main choices:
  - Fight.
  - Persuasion.
  - Sneak past.

## Persuasion Branch

- Roll D20.
- Results shown in the diagram:
  - 1-7.
  - 8-15.
  - 16-20.
- Strong result:
  - She points toward the barracks and says there are "pointy sticks."
  - She points toward the city and says there is "shiny stuff."
  - She leaves and drops a doll.
- Another persuasion outcome:
  - The player tells her they are being chased and asks for help.
  - She disappears and drops a doll.
  - The player hears terrified screams from the orcs and goblins.

## Fight Branch

- Physical attacks pass through her.
- Character-specific ideas:
  - Cletus rushes her with an axe and falls.
  - Cal manifests power and hurls it at her.
  - Ren shoots an arrow and notices distortion where the arrow passes through.
  - Kili tries to kiss the ghost and dies.
- Possible hostile result:
  - Her eyes become black empty pits.
  - The player loses their sense of self and dies.
- Another hostile result:
  - She screams, disorienting the player and causing severe pain.
  - Black miasma pours from her and she disappears.

## Doll Choice

- After the girl disappears, the player hears monsters getting closer.
- Choice:
  - Grab the doll.
  - Leave the doll and run.
- If the doll is left:
  - The player feels a shiver.
  - A glance back shows the doll is gone.

## City Or Barracks

- The road ends at a sign:
  - Left: Barracks.
  - Right: City.
- Barracks:
  - Better equipment and weapons.
  - "Pointy sticks" clue from ghost girl.
- City:
  - Better valuables.
  - "Shiny stuff" clue from ghost girl.

## Current Endpoint In Diagram

- The diagram currently ends after the city/barracks branch with a note that this is the end so far.
- The current Python prototype continues past this into:
  - Residential area.
  - Bridge.
  - Warehouse ritual.
  - Production area path puzzle.

## Implementation Notes

- Current script already supports:
  - Start screen.
  - New/load game.
  - Cletus, Cal, Ren, Kili, and Jon.
  - A special Jon the DM route.
  - Caravan attack.
  - Forest loop.
  - Cave route.
  - Ghost girl encounter.
  - City or barracks route feeding into residential, then bridge.
- Good next code changes:
  - Expand Jon's DM route past the current outline endpoint.
  - Add different city/barracks descriptions depending on whether the ghost girl helped.
