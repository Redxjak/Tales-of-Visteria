const fs = require("fs");
const path = require("path");

const mapDir = path.resolve(__dirname, "..", "docs", "beta", "assets", "maps");

function attr(source, name) {
  const match = source.match(new RegExp(`${name}="([^"]*)"`));
  return match ? match[1] : "";
}

function parseMap(file) {
  const text = fs.readFileSync(path.join(mapDir, file), "utf8");
  const width = Number(attr(text.match(/<map[^>]*>/)[0], "width"));
  const height = Number(attr(text.match(/<map[^>]*>/)[0], "height"));
  const layers = {};
  for (const match of text.matchAll(/<layer[^>]*name="([^"]+)"[^>]*>[\s\S]*?<data encoding="csv">([\s\S]*?)<\/data>/g)) {
    layers[match[1]] = match[2].trim().split(",").map((value) => Number(value.trim()) || 0);
  }
  const objects = [];
  for (const match of text.matchAll(/<object ([^>]*)>([\s\S]*?)<\/object>/g)) {
    const head = match[1];
    const body = match[2];
    const props = {};
    for (const prop of body.matchAll(/<property name="([^"]+)" value="([^"]*)"/g)) {
      props[prop[1]] = prop[2];
    }
    objects.push({
      name: attr(head, "name"),
      type: attr(head, "type"),
      x: Math.floor(Number(attr(head, "x")) / 16),
      y: Math.floor(Number(attr(head, "y")) / 16),
      props
    });
  }
  return { file, width, height, layers, objects };
}

function index(map, x, y) {
  return y * map.width + x;
}

function walkable(map, x, y) {
  if (x < 0 || y < 0 || x >= map.width || y >= map.height) return false;
  return (map.layers.Ground[index(map, x, y)] || 0) > 0 && (map.layers.Collision[index(map, x, y)] || 0) === 0;
}

function reachable(map, start) {
  const seen = new Set([`${start.x},${start.y}`]);
  const queue = [start];
  for (let i = 0; i < queue.length; i += 1) {
    const current = queue[i];
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const x = current.x + dx;
      const y = current.y + dy;
      const key = `${x},${y}`;
      if (!seen.has(key) && walkable(map, x, y)) {
        seen.add(key);
        queue.push({ x, y });
      }
    }
  }
  return seen;
}

for (const file of fs.readdirSync(mapDir).filter((name) => name.startsWith("cletus_") && name.endsWith(".tmx"))) {
  const map = parseMap(file);
  for (const [name, layer] of Object.entries(map.layers)) {
    if (layer.length !== map.width * map.height) {
      throw new Error(`${file} ${name} has ${layer.length} tiles, expected ${map.width * map.height}`);
    }
  }
  const spawn = map.objects.find((object) => object.type === "spawn");
  if (!spawn) throw new Error(`${file} has no spawn`);
  const seen = reachable(map, spawn);
  const important = map.objects.filter((object) => ["monster", "loot", "npc", "exit", "story", "door"].includes(object.type));
  const unreachable = important.filter((object) => !seen.has(`${object.x},${object.y}`));
  if (unreachable.length) {
    throw new Error(`${file} unreachable objects: ${unreachable.map((object) => `${object.name}@${object.x},${object.y}`).join(", ")}`);
  }
  console.log(`${file}: ${Object.keys(map.layers).length} layers, ${map.objects.length} objects, ${seen.size} reachable tiles`);
}
