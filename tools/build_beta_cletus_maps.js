const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const mapDir = path.join(root, "docs", "beta", "assets", "maps");
const spriteDir = path.join(root, "docs", "beta", "assets", "sprites");

const W = 40;
const H = 28;
const T = 16;
const layerNames = ["Ground", "Walls", "Decor", "Objects", "Collision"];

function blank(value = 0) {
  return Array(W * H).fill(value);
}

function idx(x, y) {
  return y * W + x;
}

function rect(layer, x, y, w, h, value) {
  for (let yy = y; yy < y + h; yy += 1) {
    for (let xx = x; xx < x + w; xx += 1) {
      if (xx >= 0 && yy >= 0 && xx < W && yy < H) {
        layer[idx(xx, yy)] = value;
      }
    }
  }
}

function carve(map, x, y, w, h, tile = 1) {
  rect(map.Ground, x, y, w, h, tile);
  rect(map.Collision, x, y, w, h, 0);
}

function wallBox(map, x, y, w, h) {
  for (let xx = x; xx < x + w; xx += 1) {
    map.Walls[idx(xx, y)] = 9;
    map.Walls[idx(xx, y + h - 1)] = 9;
    map.Collision[idx(xx, y)] = 31;
    map.Collision[idx(xx, y + h - 1)] = 31;
  }
  for (let yy = y; yy < y + h; yy += 1) {
    map.Walls[idx(x, yy)] = 9;
    map.Walls[idx(x + w - 1, yy)] = 9;
    map.Collision[idx(x, yy)] = 31;
    map.Collision[idx(x + w - 1, yy)] = 31;
  }
}

function base(areaId, title, music = "urgent_dark_fantasy") {
  return {
    areaId,
    title,
    music,
    Ground: blank(0),
    Walls: blank(0),
    Decor: blank(0),
    Objects: blank(0),
    Collision: blank(31),
    objects: []
  };
}

function object(map, name, type, x, y, props = {}) {
  map.objects.push({ id: map.objects.length + 1, name, type, x, y, props });
}

function spawn(map, name, x, y, facing = "east") {
  object(map, name, "spawn", x, y, { spawn_id: name, facing });
}

function transition(map, name, x, y, targetMap, targetSpawn, text) {
  object(map, name, "exit", x, y, { target_map: targetMap, target_spawn: targetSpawn, text });
}

function monster(map, name, encounter, x, y, note = "") {
  object(map, name, "monster", x, y, { encounter, note });
}

function loot(map, name, kind, x, y, text, amount = 1) {
  object(map, name, "loot", x, y, { kind, amount: String(amount), text });
}

function npc(map, name, x, y, text, sprite = "") {
  object(map, name, "npc", x, y, { text, sprite });
}

function story(map, name, x, y, text, props = {}) {
  object(map, name, "story", x, y, { text, once: "true", ...props });
}

function door(map, name, x, y, text = "Cletus shoulders the old door open.") {
  object(map, name, "door", x, y, { state: "closed", blocks_movement: "true", text });
}

function mapCaravan() {
  const m = base("cletus_caravan_road", "Caravan Ambush");
  carve(m, 2, 11, 35, 6, 2);
  carve(m, 4, 7, 8, 6, 3);
  carve(m, 15, 8, 7, 5, 3);
  carve(m, 25, 8, 8, 5, 3);
  carve(m, 32, 15, 4, 8, 1);
  rect(m.Decor, 5, 8, 5, 3, 16);
  rect(m.Decor, 16, 9, 4, 2, 16);
  rect(m.Decor, 27, 9, 4, 2, 16);
  spawn(m, "caravan_start", 4, 14);
  spawn(m, "from_cave", 33, 21, "north");
  npc(m, "caravan_route_sign", 33, 20, "Caravan road. The way back is blocked by fire and raiders. The cave mouth is south.");
  npc(m, "wounded_guard", 7, 13, "The guard shoves a dented shield at Cletus. \"Hold the road long enough to run.\"");
  loot(m, "dented_shield", "shield", 8, 14, "Cletus straps on a dented caravan shield. Defense rises.");
  loot(m, "travelers_potion", "potion", 18, 12, "A red potion rolls out from under a shattered wagon.");
  story(m, "cleave_lesson", 11, 14, "Cletus remembers his training: Cleave can strike every enemy next to him once per round.", { ability: "cleave" });
  monster(m, "goblin_looter_01", "caravan_goblin", 14, 13);
  monster(m, "goblin_looter_02", "caravan_goblin", 16, 15);
  monster(m, "orc_raider", "caravan_orc", 23, 13);
  monster(m, "goblin_chaser", "caravan_goblin", 28, 15);
  story(m, "overrun_warning", 29, 14, "More raiders pour around the caravan. Cletus can win fights, but not the whole ambush. The cave path is the only way out.");
  transition(m, "to_cave_mouth", 34, 22, "cletus_escape_cave", "cave_entry", "Cletus dives into the cave as shouts crash against the stone behind him.");
  return m;
}

function mapCave() {
  const m = base("cletus_escape_cave", "Cave Escape");
  carve(m, 2, 13, 12, 4, 1);
  carve(m, 12, 10, 5, 8, 1);
  carve(m, 17, 8, 10, 5, 1);
  carve(m, 25, 11, 5, 10, 1);
  carve(m, 29, 18, 8, 4, 1);
  wallBox(m, 16, 7, 12, 7);
  m.Walls[idx(16, 12)] = 0;
  m.Collision[idx(16, 12)] = 0;
  m.Walls[idx(25, 13)] = 0;
  m.Collision[idx(25, 13)] = 0;
  spawn(m, "cave_entry", 3, 15);
  spawn(m, "from_city", 34, 19, "west");
  transition(m, "back_to_caravan", 2, 15, "cletus_caravan_road", "from_cave", "Cletus climbs back toward the ruined caravan road.");
  npc(m, "faded_signpost", 6, 14, "A faded signpost points toward forest and cave. The forest exhales gray miasma. The cave drops toward old stone.");
  monster(m, "cave_goblin_01", "cave_goblin", 13, 12);
  monster(m, "cave_goblin_02", "cave_goblin", 15, 16);
  loot(m, "abandoned_satchel", "gold", 20, 10, "The satchel holds coin and a whetstone. Cletus sharpens his axe.");
  story(m, "guard_lesson", 24, 11, "The tunnel narrows. Cletus learns Guard: spend a turn bracing to reduce the next blows.", { ability: "guard" });
  monster(m, "ash_orc_chaser", "ash_orc", 27, 16);
  transition(m, "to_buried_city", 35, 19, "cletus_buried_city", "city_entry", "The cave opens into a dead underground street.");
  return m;
}

function mapBuriedCity() {
  const m = base("cletus_buried_city", "Buried City And Ghost Girl", "low_dungeon_ambient");
  carve(m, 3, 11, 34, 6, 1);
  carve(m, 18, 5, 5, 14, 1);
  carve(m, 6, 5, 8, 5, 1);
  carve(m, 27, 17, 8, 7, 1);
  wallBox(m, 5, 4, 10, 7);
  wallBox(m, 26, 16, 10, 9);
  m.Walls[idx(30, 16)] = 0;
  m.Collision[idx(30, 16)] = 0;
  spawn(m, "city_entry", 4, 14);
  spawn(m, "from_districts", 33, 14, "west");
  transition(m, "back_to_cave", 3, 14, "cletus_escape_cave", "from_city", "Cletus slips back into the cave tunnel.");
  npc(m, "pale_girl", 20, 8, "The pale girl watches Cletus lift his axe. The swing cuts cold air. She tilts her head, then points to the barracks and the market before vanishing.", "npc_ghost_girl.svg");
  story(m, "ghost_fight_result", 20, 10, "Cletus rushes the ghost, slips through her shape, and hits the floor hard. Lesson learned: not every problem is axe-shaped.", { ability: "second_wind" });
  loot(m, "cracked_doll", "doll", 21, 10, "The cracked doll is cold in Cletus's hand. It goes in the sack whether he likes it or not.");
  monster(m, "miasma_wraith", "miasma_wraith", 13, 14);
  loot(m, "old_potion_cache", "potion", 30, 18, "A sealed medical tube still holds one usable potion.");
  transition(m, "to_district_sign", 34, 14, "cletus_districts", "district_entry", "Cletus reaches an old road sign: barracks left, merchant district right.");
  return m;
}

function mapDistricts() {
  const m = base("cletus_districts", "Barracks, Market, And Residential Road");
  carve(m, 3, 13, 34, 4, 1);
  carve(m, 6, 6, 12, 8, 3);
  carve(m, 22, 6, 13, 8, 2);
  carve(m, 14, 16, 6, 7, 1);
  carve(m, 24, 16, 7, 7, 1);
  wallBox(m, 5, 5, 14, 10);
  wallBox(m, 21, 5, 15, 10);
  wallBox(m, 13, 15, 8, 9);
  wallBox(m, 23, 15, 9, 9);
  carve(m, 3, 13, 34, 4, 1);
  rect(m.Walls, 3, 13, 34, 4, 0);
  spawn(m, "district_entry", 4, 15);
  spawn(m, "from_bridge", 35, 15, "west");
  transition(m, "back_to_buried_city", 3, 15, "cletus_buried_city", "from_districts", "Cletus heads back toward the ghost girl's street.");
  npc(m, "old_road_sign", 8, 14, "Left: Barracks. Right: Merchant District. Straight: Residential road to the bridge.");
  door(m, "barracks_gate", 10, 13, "Cletus kicks the barracks gate until the hinge gives.");
  monster(m, "barracks_orc_01", "ash_orc", 11, 9);
  monster(m, "barracks_orc_02", "ash_orc", 15, 11);
  loot(m, "armory_spear_cache", "weapon", 15, 8, "Cletus finds a better axe haft and a bundle of pointy sticks. Attack rises.");
  loot(m, "barracks_route_map", "map", 17, 13, "A brittle military route map shows the first bridge moves: LEFT, then UP.");
  door(m, "market_gate", 26, 13, "The market gate screeches. Everything nearby hears it.");
  monster(m, "market_goblin_01", "goblin_scout", 25, 9);
  monster(m, "market_goblin_02", "goblin_scout", 29, 11);
  monster(m, "market_orc", "ash_orc", 33, 12);
  loot(m, "merchant_potion", "potion", 31, 8, "A merchant's lockbox contains a potion and enough coin to matter.");
  story(m, "residential_warning", 17, 18, "The homes ahead look safer than the streets. That is exactly why Cletus does not trust them.");
  monster(m, "shack_ghoul", "shack_ghoul", 16, 21);
  monster(m, "mimic_chest", "mimic_chest", 27, 19);
  loot(m, "magistone_orb", "orb", 29, 21, "The magistone orb pulses once, then settles into Cletus's pack.");
  transition(m, "to_bridge_approach", 36, 15, "cletus_bridge_approach", "bridge_entry", "Heat rolls over Cletus before he sees the lava.");
  return m;
}

function mapBridge() {
  const m = base("cletus_bridge_approach", "Start Of The Bridge", "bridge_heat");
  carve(m, 2, 13, 20, 5, 1);
  carve(m, 20, 10, 16, 8, 4);
  rect(m.Decor, 24, 8, 10, 2, 24);
  rect(m.Decor, 24, 18, 10, 2, 24);
  spawn(m, "bridge_entry", 3, 15);
  transition(m, "back_to_districts", 2, 15, "cletus_districts", "from_bridge", "Cletus steps away from the bridge heat and returns to the district road.");
  npc(m, "bridge_warning_post", 7, 14, "Bridge to the King's Castle. Patrols ahead. Traps beneath the soot.");
  story(m, "bridge_map_hint", 13, 15, "If Cletus found the brittle map, this is where LEFT then UP starts to matter.");
  monster(m, "bridge_goblin_01", "goblin_scout", 21, 13);
  monster(m, "bridge_goblin_02", "goblin_scout", 23, 16);
  monster(m, "bridge_orc_patrol", "bridge_orc", 27, 14);
  loot(m, "bridge_lantern_cache", "potion", 18, 13, "A potion sits beside a dead magistone lantern.");
  story(m, "bridge_start_checkpoint", 33, 14, "Cletus reaches the start of the bridge proper. The next beta slice can begin with the trap route and warehouse.");
  return m;
}

function layerCsv(values) {
  const rows = [];
  for (let y = 0; y < H; y += 1) {
    rows.push(values.slice(y * W, y * W + W).join(","));
  }
  return rows.join(",\n");
}

function propsXml(props, indent = "   ") {
  const entries = Object.entries(props || {});
  if (!entries.length) return "";
  return `\n${indent}<properties>\n${entries.map(([name, value]) => `${indent} <property name="${xml(name)}" value="${xml(value)}"/>`).join("\n")}\n${indent}</properties>`;
}

function xml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("\"", "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function tmx(map) {
  const layers = layerNames.map((name, index) => ` <layer id="${index + 1}" name="${name}" width="${W}" height="${H}"${name === "Collision" ? " opacity=\"0.28\" visible=\"0\"" : ""}>
  <data encoding="csv">
${layerCsv(map[name])}
  </data>
 </layer>`).join("\n");
  const objects = map.objects.map((obj) => `  <object id="${obj.id}" name="${xml(obj.name)}" type="${xml(obj.type)}" x="${obj.x * T}" y="${obj.y * T}" width="${T}" height="${T}">${propsXml(obj.props, "   ")}
  </object>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<map version="1.10" tiledversion="1.11.0" orientation="orthogonal" renderorder="right-down" width="${W}" height="${H}" tilewidth="${T}" tileheight="${T}" infinite="0" nextlayerid="7" nextobjectid="${map.objects.length + 1}">
 <properties>
  <property name="style" value="pixel_beta_cletus"/>
  <property name="area_id" value="${xml(map.areaId)}"/>
  <property name="title" value="${xml(map.title)}"/>
  <property name="music_hint" value="${xml(map.music)}"/>
 </properties>
 <tileset firstgid="1" name="veyrindel_dungeon_16" tilewidth="16" tileheight="16" tilecount="32" columns="8">
  <image source="tilesets/veyrindel_dungeon_16.png" width="128" height="64"/>
 </tileset>
${layers}
 <objectgroup id="6" name="Entities">
${objects}
 </objectgroup>
</map>
`;
}

const maps = [mapCaravan(), mapCave(), mapBuriedCity(), mapDistricts(), mapBridge()];
fs.mkdirSync(mapDir, { recursive: true });
fs.mkdirSync(spriteDir, { recursive: true });
for (const map of maps) {
  fs.writeFileSync(path.join(mapDir, `${map.areaId}.tmx`), tmx(map));
}

const sprites = {
  "hero_cletus.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="#231915" d="M5 1h6v2h1v4h1v7H3V7h1V3h1z"/><path fill="#d4a06b" d="M6 2h4v3H6z"/><path fill="#7a2925" d="M5 5h6v4H5z"/><path fill="#3d4a56" d="M4 9h8v5H4z"/><path fill="#c9c3b4" d="M2 6h3v2H2zM11 6h3v2h-3z"/><path fill="#9c6b2e" d="M1 10h4v2H1z"/><path fill="#e7d49a" d="M7 3h1v1H7zM9 3h1v1H9z"/><path fill="#5b341c" d="M3 12h2v3H3zM11 12h2v3h-2z"/></svg>`,
  "npc_ghost_girl.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="#111015" d="M5 1h6v2h1v5h1v7H3V8h1V3h1z"/><path fill="#ece7df" d="M6 3h4v4H6z"/><path fill="#23202a" d="M5 7h6v7H5z"/><path fill="#030305" d="M6 4h1v1H6zM9 4h1v1H9z"/><path fill="#b8c7d7" d="M2 9h2v2H2zM12 9h2v2h-2z"/></svg>`,
  "npc_caravan_guard.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="#2a211a" d="M5 2h6v3h1v8H4V5h1z"/><path fill="#c28d62" d="M6 3h4v3H6z"/><path fill="#666b70" d="M4 7h8v6H4z"/><path fill="#8e2f2a" d="M3 9h3v4H3z"/><path fill="#201915" d="M5 13h2v2H5zM10 13h2v2h-2z"/></svg>`,
  "monster_mimic.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="#4b2b19" d="M2 5h12v8H2z"/><path fill="#7a4b22" d="M3 4h10v3H3z"/><path fill="#e8d9aa" d="M4 8h8v1H4zM5 10h1v2H5zM8 10h1v2H8zM11 10h1v2h-1z"/><path fill="#21120d" d="M3 7h10v1H3z"/><path fill="#c99a35" d="M7 5h2v2H7z"/></svg>`,
  "item_doll.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="#181318" d="M6 1h4v3h1v3h1v7H4V7h1V4h1z"/><path fill="#e9ddd2" d="M6 3h4v3H6z"/><path fill="#5d2230" d="M5 7h6v6H5z"/><path fill="#09080a" d="M6 4h1v1H6zM9 4h1v1H9z"/><path fill="#d9c9b6" d="M3 8h2v2H3zM11 8h2v2h-2z"/></svg>`,
  "item_orb.svg": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" shape-rendering="crispEdges"><path fill="#1b1230" d="M5 2h6v2h2v6h-2v2H5v-2H3V4h2z"/><path fill="#6fe0d0" d="M6 4h4v1h1v4h-1v1H6V9H5V5h1z"/><path fill="#f8fff8" d="M7 5h2v1H7z"/></svg>`
};

for (const [name, content] of Object.entries(sprites)) {
  fs.writeFileSync(path.join(spriteDir, name), content);
}

console.log(`Wrote ${maps.length} Cletus beta TMX maps and ${Object.keys(sprites).length} sprites.`);
