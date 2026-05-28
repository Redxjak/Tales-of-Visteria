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

## Divine 12

- Karna Masta: The God Emperor; legalism and nobility.
- Lucius: God of magic, order, and contracts.
- Bahamut: God of justice, valour, bravery, orderly warfare, and metallic dragons.
- Tiamat: Goddess of evil, chaos, motherhood, and chromatic dragons; patron goddess of exiles, the rejected, and the misunderstood.
- Maxwell: The Creator Goddess; creator of life; goddess of light, love, and marriage; older twin of Cardes; married to the Elven King of Sylvane out of pact with the Feywild.
- Cardes: God of destruction, death, desolation, and ruin; younger twin of Maxwell.
- Zevalhua: Goddess of ambition, deceit, treachery, plots, advancement, and innovation.
- Afla Dilith: God of true war, blood, violence, slaughter, single combat, and pride.
- Kulyuk: God of peace, pacifism, sacrifice, and courage; wed to Isha.
- Isha: World Tree; goddess of natural life, nature, cycles, rebirth, renewal, and sage travels; patron of pilgrims and travelers; wed to Kulyuk.
- Ananke: Goddess of fate, prophecy, futures, and divinations; the Lady of What Will Be, What Is, and What Has Been.
- Vaeruun: God of weather, storms, calamity, disasters natural or otherwise, seafaring, and crop growth.

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

## Current Browser Game Status

Version 0.8.0 is now a browser game under `docs/`.

- Entry points:
  - `/en`
  - `/es`
  - Root redirect page.
- Account modes:
  - Login.
  - Google login.
  - Create account.
  - Guest play.
- Current systems:
  - Save/load.
  - Local guest storage.
  - Cloud-backed user data through Supabase.
  - Leaderboard submission and leaderboard display.
  - Achievements.
  - XP, level-ups, and combat upgrades.
  - Score breakdowns on game over and chapter endpoints.
  - English and Spanish data files.

## Current Story Flow

- Start screen.
- Character selection:
  - Cletus the Warrior.
  - Ren the Ranger.
  - Cal the Scholar.
  - Kili the Dwarf.
  - Jon the DM.
- Jon route:
  - DM chooses orcs/goblins or hydra.
  - DM route can watch the ghost girl scene.
  - DM route can steer barracks or merchant district.
  - DM route can steer residential choices.
  - DM route currently ends at the bridge summary and chapter-complete state.
- Player route:
  - Caravan attack.
  - Fight or run.
  - Escape choice between forest and cave.
  - Forest loops until the player gives up or breaks.
  - Cave leads into the buried city.
  - Ghost girl encounter.
  - Character-specific fight outcomes.
  - Persuasion outcomes and doll drop.
  - Doll choice.
  - District choice between barracks and merchant district.
  - Optional rest at the district sign.
  - Barracks route.
  - Merchant route.
  - Residential area.
  - Optional rest before bridge.

## Residential Status

- Large Manor:
  - Sneak check.
  - Fight, sneak, or grouped takedown options.
  - Loot path with unmarked keys and trapped black chest.
  - Correct key grants the magistone orb.
- Small Shack:
  - Gremlin and ghoul encounter.
  - Return to street or proceed to bridge.
- Large House / Mimic House:
  - Burn house safely exits toward bridge.
  - Leave immediately exits toward bridge.
  - Rest causes mimic-house death and unlocks the mimic nap achievement.
  - Loot path:
    - First chest reveals a mimic.
    - The player snaps out of the welcoming feeling.
    - First mimic combat starts automatically.
    - If the first mimic is defeated, two more mimics appear.
    - Fight leads to two-mimic combat.
    - Victory grants the torn bridge map and magistone orb.
    - Flee reveals the house is a mimic and opens black hole, fire, wall attack, and possible dwarven ale outcomes.

## Bridge And Warehouse Status

- Bridge approach:
  - Full throne map reveals the complete safe route.
  - Torn map reveals LEFT, then UP.
  - No map warns the player.
  - Sneak across the lava bridge.
  - Failed sneak triggers bridge patrol combat.
- Warehouse ritual:
  - The player finds a ritual inside the bridge structure.
  - Fight five orcs and four cultists.
  - Fight the silver-masked ritual leader.
  - Silver mask choice:
    - Leave it.
    - Store it.
    - Wear it for power and corruption.
  - Ritual surge choice:
    - Leave the warehouse.
    - Stop the ritual.
    - Jump into the hole.
- False Hydra / Order branch:
  - Leaving the warehouse triggers the False Hydra reveal.
  - The Order arrives and freezes the scene.
  - Player can ask who they are, what the monster is, and why they are here.
  - The Order removes the threat and the warehouse vanishes.
- Bridge-end checkpoint:
  - Unlocks the warehouse-survived achievement.
  - Records the endpoint.
  - Allows rest.
  - Allows putting the silver mask back on if stored.
  - Allows score submission, leaderboard, save, and main menu.
  - Moves into the orc camps preview.

## Current Endpoint

- The active story endpoint is the orc camps preview.
- The old production-area path puzzle text still exists in the data file, but it is not the active endpoint in the current browser flow.

## Planned Story

- Orc camp.
- Castle.
- Throne room.
- Final boss fight.
- Treasure room.
- Consequences for silver mask possession, use, and corruption.
- More Jon the DM route coverage beyond the bridge summary.
