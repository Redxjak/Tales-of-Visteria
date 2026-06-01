(function () {
  "use strict";

  const ASSET_BASE = "../assets";
  const MAPS = [
    `${ASSET_BASE}/maps/visteria_ruins_depth_1.tmx`,
    `${ASSET_BASE}/maps/visteria_ruins_depth_2.tmx`
  ];
  const TILE_INFO = {
    1: { key: "floor", label: "stone floor", walkable: true },
    2: { key: "wall", label: "wall", walkable: false },
    3: { key: "stairs", label: "stairs", walkable: true },
    4: { key: "chasm", label: "chasm", walkable: false },
    5: { key: "door", label: "old door", walkable: true },
    6: { key: "lava", label: "magma", walkable: false },
    7: { key: "water", label: "dark water", walkable: false },
    8: { key: "chest", label: "locked chest", walkable: true }
  };
  const MONSTERS = {
    cave_rat: { name: "Cave Rat", hp: 9, attack: 3, xp: 12, sprite: "monster_rat.svg" },
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
    message: "Find the stairs. Survive the rooms. Bring back proof that the old city still has teeth.",
    log: ["You descend into the buried halls beneath Visteria."],
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
    const terrainLayer = Array.from(xml.querySelectorAll("layer")).find((layer) => layer.getAttribute("name") === "terrain");
    const terrain = terrainLayer.querySelector("data").textContent.trim().split(",").map((value) => Number(value.trim()) || 1);
    const objects = Array.from(xml.querySelectorAll("objectgroup object")).map((object) => {
      const props = {};
      object.querySelectorAll("property").forEach((property) => {
        props[property.getAttribute("name")] = property.getAttribute("value");
      });
      return {
        type: object.getAttribute("type") || "",
        x: Math.floor(Number(object.getAttribute("x")) / 16),
        y: Math.floor(Number(object.getAttribute("y")) / 16),
        props
      };
    });
    return { width, height, terrain, objects };
  }

  function applyMap(map) {
    state.map = map;
    state.monsters = [];
    state.loot = [];
    map.objects.forEach((object) => {
      if (object.type === "start") {
        state.hero.x = object.x;
        state.hero.y = object.y;
      } else if (object.type === "monster") {
        const base = MONSTERS[object.props.monster] || MONSTERS.cave_rat;
        state.monsters.push({ ...base, x: object.x, y: object.y, hp: base.hp, maxHp: base.hp });
      } else if (object.type === "loot") {
        state.loot.push({ x: object.x, y: object.y, kind: object.props.kind || "gold", amount: Number(object.props.amount) || 1 });
      }
    });
    state.log.unshift(`Depth ${state.depth + 1}: ${map.width} x ${map.height} TMX map loaded.`);
  }

  function render() {
    if (!state.map) {
      app.innerHTML = `<p class="readout">${escapeHtml(state.message)}</p>`;
      return;
    }
    const cells = [];
    for (let y = 0; y < state.map.height; y += 1) {
      for (let x = 0; x < state.map.width; x += 1) {
        const tile = TILE_INFO[state.map.terrain[y * state.map.width + x]] || TILE_INFO[1];
        const monster = state.monsters.find((candidate) => candidate.x === x && candidate.y === y && candidate.hp > 0);
        const loot = state.loot.find((item) => item.x === x && item.y === y);
        const hero = state.hero.x === x && state.hero.y === y;
        let content = "";
        if (hero) {
          content = `<img src="${ASSET_BASE}/sprites/${state.hero.sprite}" alt="hero">`;
        } else if (monster) {
          content = `<img src="${ASSET_BASE}/sprites/${monster.sprite}" alt="${escapeHtml(monster.name)}">`;
        } else if (loot) {
          content = `<span class="token">${loot.kind === "potion" ? "!" : "$"}</span>`;
        }
        cells.push(`<div class="tile tile-${tile.key}" title="${escapeHtml(tile.label)}">${content}</div>`);
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
    const tile = TILE_INFO[state.map.terrain[y * state.map.width + x]] || TILE_INFO[2];
    const monster = state.monsters.find((candidate) => candidate.x === x && candidate.y === y && candidate.hp > 0);
    if (monster) {
      attackMonster(monster);
    } else if (!tile.walkable) {
      state.message = `The ${tile.label} blocks your path.`;
      state.log.unshift(state.message);
    } else {
      state.hero.x = x;
      state.hero.y = y;
      collectLoot();
      if (tile.key === "stairs") {
        descend();
        return;
      }
      state.message = `You step onto ${tile.label}.`;
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
    const tile = TILE_INFO[state.map.terrain[y * state.map.width + x]] || TILE_INFO[2];
    const occupied = state.monsters.some((candidate) => candidate !== monster && candidate.hp > 0 && candidate.x === x && candidate.y === y);
    const heroThere = state.hero.x === x && state.hero.y === y;
    if (!tile.walkable || occupied || heroThere) {
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
      state.hero.gold += loot.amount || 1;
      state.log.unshift(`You collect ${loot.amount || 1} gold.`);
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

  function descend() {
    if (state.depth + 1 >= MAPS.length) {
      state.message = "You reach the sealed beta gate. The deeper dungeon waits for the next build.";
      state.log.unshift("Beta complete: both TMX depths cleared.");
      finishTurn();
      return;
    }
    state.log.unshift("You take the stairs down.");
    loadDepth(state.depth + 1);
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
    state.log = ["You descend into the buried halls beneath Visteria."];
    state.message = "Find the stairs. Survive the rooms. Bring back proof that the old city still has teeth.";
    loadDepth(0);
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
