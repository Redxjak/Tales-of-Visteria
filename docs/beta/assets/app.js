(function () {
  "use strict";

  const ASSET_BASE = "../assets";
  const MAPS = [
    `${ASSET_BASE}/maps/veyrindel_pixel_dungeon.tmx`
  ];
  const RENDER_LAYERS = ["Ground", "Walls", "Decor", "Objects"];
  const TILESET_COLUMNS = 8;
  const MONSTERS = {
    cave_rat: { name: "Cave Rat", hp: 9, attack: 3, xp: 12, sprite: "monster_rat.svg" },
    small_depths_rat: { name: "Depths Rat", hp: 11, attack: 3, xp: 14, sprite: "monster_rat.svg" },
    slime_rat: { name: "Slime Rat", hp: 16, attack: 4, xp: 20, sprite: "monster_slime.svg" },
    mire_wisp: { name: "Mire Wisp", hp: 20, attack: 5, xp: 26, sprite: "monster_wraith.svg" },
    goblin_scout: { name: "Goblin Scout", hp: 14, attack: 4, xp: 18, sprite: "monster_goblin.svg" },
    ash_orc: { name: "Ash Orc", hp: 22, attack: 6, xp: 32, sprite: "monster_orc.svg" },
    ember_slime: { name: "Ember Slime", hp: 18, attack: 5, xp: 24, sprite: "monster_slime.svg" },
    memory_wraith: { name: "Memory Wraith", hp: 30, attack: 8, xp: 45, sprite: "monster_wraith.svg" }
  };

  const state = {
    depth: 0,
    map: null,
    monsters: [],
    loot: [],
    doors: [],
    npcs: [],
    exits: [],
    message: "Explore the Veyrindel depths. Find the stairs and survive what the map wakes up.",
    log: ["You enter the Veyrindel depths."],
    hero: {
      x: 1,
      y: 1,
      hp: 34,
      maxHp: 34,
      attack: 7,
      defense: 1,
      xp: 0,
      gold: 0,
      potions: 1,
      sprite: "hero_visterian.svg"
    }
  };

  const app = document.getElementById("app");

  init();

  async function init() {
    bindKeys();
    await loadDepth(0);
  }

  async function loadDepth(depth) {
    state.depth = depth;
    try {
      const response = await fetch(MAPS[depth]);
      const text = await response.text();
      applyMap(parseTmx(text));
    } catch {
      state.message = "The TMX map could not be loaded.";
    }
    render();
  }

  function parseTmx(text) {
    const xml = new DOMParser().parseFromString(text, "application/xml");
    const mapNode = xml.querySelector("map");
    const width = Number(mapNode.getAttribute("width"));
    const height = Number(mapNode.getAttribute("height"));
    const tileWidth = Number(mapNode.getAttribute("tilewidth")) || 16;
    const tileHeight = Number(mapNode.getAttribute("tileheight")) || 16;
    const imageNode = xml.querySelector("tileset image");
    const tilesetImage = imageNode ? `${ASSET_BASE}/maps/${imageNode.getAttribute("source")}` : "";
    const layers = {};
    Array.from(xml.querySelectorAll("layer")).forEach((layer) => {
      const name = layer.getAttribute("name") || "";
      layers[name] = layer.querySelector("data").textContent.trim().split(",").map((value) => Number(value.trim()) || 0);
    });
    const objects = Array.from(xml.querySelectorAll("objectgroup object")).map((object) => {
      const props = {};
      object.querySelectorAll("property").forEach((property) => {
        props[property.getAttribute("name")] = property.getAttribute("value");
      });
      return {
        name: object.getAttribute("name") || "",
        type: object.getAttribute("type") || "",
        x: Math.floor(Number(object.getAttribute("x")) / tileWidth),
        y: Math.floor(Number(object.getAttribute("y")) / tileHeight),
        props
      };
    });
    return { width, height, tileWidth, tileHeight, tilesetImage, layers, objects };
  }

  function applyMap(map) {
    state.map = map;
    state.monsters = [];
    state.loot = [];
    state.doors = [];
    state.npcs = [];
    state.exits = [];
    map.objects.forEach((object) => {
      if (object.type === "spawn") {
        state.hero.x = object.x;
        state.hero.y = object.y;
      } else if (object.type === "monster") {
        const base = MONSTERS[object.props.encounter] || MONSTERS[object.props.monster] || MONSTERS.cave_rat;
        state.monsters.push({ ...base, x: object.x, y: object.y, hp: base.hp, maxHp: base.hp });
      } else if (object.type === "loot") {
        state.loot.push({ x: object.x, y: object.y, name: object.name, kind: object.props.kind || object.props.loot_table || "cache", amount: Number(object.props.amount) || 1 });
      } else if (object.type === "door") {
        state.doors.push({ x: object.x, y: object.y, name: object.name, open: object.props.state === "open", blocks: object.props.blocks_movement !== "false" });
      } else if (object.type === "npc") {
        state.npcs.push({ x: object.x, y: object.y, name: object.name || "Warden Echo" });
      } else if (object.type === "exit") {
        state.exits.push({ x: object.x, y: object.y, name: object.name || "stairs_down" });
      }
    });
    state.log.unshift(`Veyrindel map loaded: ${map.width} x ${map.height}.`);
  }

  function render() {
    if (!state.map) {
      app.innerHTML = `<p class="readout">${escapeHtml(state.message)}</p>`;
      return;
    }
    const cells = [];
    for (let y = 0; y < state.map.height; y += 1) {
      for (let x = 0; x < state.map.width; x += 1) {
        const index = y * state.map.width + x;
        const monster = state.monsters.find((candidate) => candidate.x === x && candidate.y === y && candidate.hp > 0);
        const loot = state.loot.find((item) => item.x === x && item.y === y);
        const door = state.doors.find((item) => item.x === x && item.y === y && !item.open);
        const npc = state.npcs.find((item) => item.x === x && item.y === y);
        const exit = state.exits.find((item) => item.x === x && item.y === y);
        const hero = state.hero.x === x && state.hero.y === y;
        const layerHtml = RENDER_LAYERS.map((layerName) => tileLayerHtml((state.map.layers[layerName] || [])[index])).join("");
        let content = layerHtml;
        if (hero) {
          content += `<img class="actor" src="${ASSET_BASE}/sprites/${state.hero.sprite}" alt="hero">`;
        } else if (monster) {
          content += `<img class="actor" src="${ASSET_BASE}/sprites/${monster.sprite}" alt="${escapeHtml(monster.name)}">`;
        } else if (loot) {
          content += `<span class="token">$</span>`;
        } else if (door) {
          content += `<span class="token">D</span>`;
        } else if (npc) {
          content += `<span class="token">?</span>`;
        } else if (exit) {
          content += `<span class="token">&gt;</span>`;
        }
        cells.push(`<div class="tile">${content}</div>`);
      }
    }
    const monsterLine = state.monsters.filter((monster) => monster.hp > 0).map((monster) => `${monster.name} ${monster.hp}/${monster.maxHp}`).join(" | ") || "No monsters standing";
    app.innerHTML = `
      <header class="topbar">
        <div class="title-row">
          <h1>Tales of Visteria</h1>
          <span class="beta-pill">Pixel Dungeon Beta</span>
        </div>
        <div class="status-row">
          <span>Depth ${state.depth + 1}</span>
          <span>HP ${state.hero.hp}/${state.hero.maxHp}</span>
          <span>XP ${state.hero.xp}</span>
          <span>Gold ${state.hero.gold}</span>
          <span>Potions ${state.hero.potions}</span>
        </div>
      </header>
      <section class="dungeon-shell">
        <div class="board" style="grid-template-columns: repeat(${state.map.width}, var(--tile-size));">${cells.join("")}</div>
        <div class="readout">
          <p>${escapeHtml(state.message)}</p>
          <p>${escapeHtml(monsterLine)}</p>
          <ol>${state.log.slice(0, 5).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ol>
        </div>
      </section>
      <nav class="controls">
        <button type="button" data-move="0,-1">Up</button>
        <button type="button" data-move="-1,0">Left</button>
        <button type="button" data-move="1,0">Right</button>
        <button type="button" data-move="0,1">Down</button>
        <button type="button" data-potion>Drink Potion</button>
        <button type="button" data-restart>Restart</button>
      </nav>
    `;
    document.querySelectorAll("[data-move]").forEach((button) => {
      button.addEventListener("click", () => {
        const [dx, dy] = button.dataset.move.split(",").map(Number);
        moveHero(dx, dy);
      });
    });
    document.querySelector("[data-potion]").addEventListener("click", drinkPotion);
    document.querySelector("[data-restart]").addEventListener("click", restart);
  }

  function bindKeys() {
    window.addEventListener("keydown", (event) => {
      const directions = {
        ArrowUp: [0, -1],
        w: [0, -1],
        ArrowLeft: [-1, 0],
        a: [-1, 0],
        ArrowRight: [1, 0],
        d: [1, 0],
        ArrowDown: [0, 1],
        s: [0, 1]
      };
      const direction = directions[event.key];
      if (direction) {
        event.preventDefault();
        moveHero(direction[0], direction[1]);
      }
    });
  }

  function moveHero(dx, dy) {
    if (state.hero.hp <= 0) {
      return;
    }
    const x = state.hero.x + dx;
    const y = state.hero.y + dy;
    const monster = state.monsters.find((candidate) => candidate.x === x && candidate.y === y && candidate.hp > 0);
    const door = state.doors.find((candidate) => candidate.x === x && candidate.y === y && !candidate.open);
    const npc = state.npcs.find((candidate) => candidate.x === x && candidate.y === y);
    const exit = state.exits.find((candidate) => candidate.x === x && candidate.y === y);
    if (monster) {
      attackMonster(monster);
    } else if (door && door.blocks) {
      door.open = true;
      door.blocks = false;
      state.message = "You force the old door open.";
      state.log.unshift(state.message);
    } else if (!isWalkable(x, y)) {
      state.message = "The dungeon stone blocks your path.";
      state.log.unshift(state.message);
    } else if (npc) {
      state.hero.x = x;
      state.hero.y = y;
      state.message = "The warden echo whispers: Veyrindel remembers every footstep.";
      state.log.unshift(state.message);
      monsterTurn();
    } else if (exit) {
      state.hero.x = x;
      state.hero.y = y;
      state.message = "You reach the stairs down. The next Veyrindel depth waits for a future map.";
      state.log.unshift("Beta complete: Veyrindel depth cleared.");
    } else {
      state.hero.x = x;
      state.hero.y = y;
      collectLoot();
      state.message = "You move through the Veyrindel depths.";
      monsterTurn();
    }
    finishTurn();
  }

  function attackMonster(monster) {
    const damage = Math.max(1, rollDie(6) + state.hero.attack - 3);
    monster.hp = Math.max(0, monster.hp - damage);
    state.message = `You strike the ${monster.name} for ${damage}.`;
    state.log.unshift(state.message);
    if (monster.hp <= 0) {
      state.hero.xp += monster.xp;
      state.hero.gold += Math.max(1, Math.floor(monster.xp / 4));
      state.log.unshift(`${monster.name} collapses. +${monster.xp} XP.`);
    } else {
      monsterTurn();
    }
  }

  function monsterTurn() {
    state.monsters.filter((monster) => monster.hp > 0).forEach((monster) => {
      const distance = Math.abs(monster.x - state.hero.x) + Math.abs(monster.y - state.hero.y);
      if (distance === 1) {
        const damage = Math.max(1, rollDie(monster.attack) - state.hero.defense);
        state.hero.hp = Math.max(0, state.hero.hp - damage);
        state.log.unshift(`${monster.name} hits you for ${damage}.`);
      } else if (distance <= 5) {
        const stepX = Math.sign(state.hero.x - monster.x);
        const stepY = Math.sign(state.hero.y - monster.y);
        if (tryMoveMonster(monster, stepX, 0) || tryMoveMonster(monster, 0, stepY)) {
          state.log.unshift(`${monster.name} shuffles closer.`);
        }
      }
    });
  }

  function tryMoveMonster(monster, dx, dy) {
    if (!dx && !dy) {
      return false;
    }
    const x = monster.x + dx;
    const y = monster.y + dy;
    const door = state.doors.find((candidate) => candidate.x === x && candidate.y === y && !candidate.open && candidate.blocks);
    const occupied = state.monsters.some((candidate) => candidate !== monster && candidate.hp > 0 && candidate.x === x && candidate.y === y);
    const heroThere = state.hero.x === x && state.hero.y === y;
    if (!isWalkable(x, y) || door || occupied || heroThere) {
      return false;
    }
    monster.x = x;
    monster.y = y;
    return true;
  }

  function collectLoot() {
    const index = state.loot.findIndex((item) => item.x === state.hero.x && item.y === state.hero.y);
    if (index < 0) {
      return;
    }
    const loot = state.loot.splice(index, 1)[0];
    if (loot.kind === "potion") {
      state.hero.potions += 1;
      state.log.unshift("You pick up a red health potion.");
    } else {
      state.hero.gold += 6;
      state.log.unshift(`You search ${loot.name || "a cache"} and find useful coin.`);
    }
  }

  function drinkPotion() {
    if (state.hero.potions <= 0) {
      state.message = "No potion is ready in your pack.";
      finishTurn();
      return;
    }
    state.hero.potions -= 1;
    const healing = rollDie(8) + 8;
    state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + healing);
    state.message = `The potion restores ${healing} HP.`;
    state.log.unshift(state.message);
    monsterTurn();
    finishTurn();
  }

  function finishTurn() {
    if (state.hero.hp <= 0) {
      state.message = "You fall in the dark. The beta dungeon claims another adventurer.";
      state.log.unshift(state.message);
    }
    render();
  }

  function restart() {
    state.depth = 0;
    state.hero = { x: 1, y: 1, hp: 34, maxHp: 34, attack: 7, defense: 1, xp: 0, gold: 0, potions: 1, sprite: "hero_visterian.svg" };
    state.log = ["You enter the Veyrindel depths."];
    state.message = "Explore the Veyrindel depths. Find the stairs and survive what the map wakes up.";
    loadDepth(0);
  }

  function tileLayerHtml(gid) {
    if (!gid) {
      return "";
    }
    const index = gid - 1;
    const col = index % TILESET_COLUMNS;
    const row = Math.floor(index / TILESET_COLUMNS);
    return `<span class="tile-layer" style="background-image:url('${state.map.tilesetImage}');background-position:calc(-${col} * var(--tile-size)) calc(-${row} * var(--tile-size));"></span>`;
  }

  function isWalkable(x, y) {
    if (x < 0 || y < 0 || x >= state.map.width || y >= state.map.height) {
      return false;
    }
    const index = y * state.map.width + x;
    const ground = (state.map.layers.Ground || [])[index] || 0;
    const collision = (state.map.layers.Collision || [])[index] || 0;
    const openDoor = state.doors.some((door) => door.x === x && door.y === y && door.open);
    if (openDoor) {
      return ground > 0;
    }
    return ground > 0 && collision === 0;
  }

  function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
}());
