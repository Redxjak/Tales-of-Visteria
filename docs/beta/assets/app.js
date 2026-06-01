(function () {
  "use strict";

  const ASSET_BASE = "../assets";
  const BETA_VERSION = "0.2.3-status-menu";
  const TILESET_COLUMNS = 8;
  const RENDER_LAYERS = ["Ground", "Walls", "Decor", "Objects"];
  const MAPS = {
    cletus_caravan_road: { title: "Caravan Ambush", path: `${ASSET_BASE}/maps/cletus_caravan_road.tmx` },
    cletus_escape_cave: { title: "Cave Escape", path: `${ASSET_BASE}/maps/cletus_escape_cave.tmx` },
    cletus_buried_city: { title: "Buried City", path: `${ASSET_BASE}/maps/cletus_buried_city.tmx` },
    cletus_districts: { title: "District Road", path: `${ASSET_BASE}/maps/cletus_districts.tmx` },
    cletus_bridge_approach: { title: "Bridge Approach", path: `${ASSET_BASE}/maps/cletus_bridge_approach.tmx` }
  };
  const MONSTERS = {
    caravan_goblin: { name: "Caravan Goblin", hp: 13, attack: 4, xp: 16, sprite: "monster_goblin.svg" },
    caravan_orc: { name: "Caravan Orc", hp: 24, attack: 7, xp: 34, sprite: "monster_orc.svg" },
    cave_goblin: { name: "Cave Goblin", hp: 15, attack: 4, xp: 18, sprite: "monster_goblin.svg" },
    goblin_scout: { name: "Goblin Scout", hp: 14, attack: 4, xp: 18, sprite: "monster_goblin.svg" },
    ash_orc: { name: "Ash Orc", hp: 22, attack: 6, xp: 32, sprite: "monster_orc.svg" },
    bridge_orc: { name: "Bridge Orc", hp: 28, attack: 7, xp: 42, sprite: "monster_orc.svg" },
    miasma_wraith: { name: "Miasma Wraith", hp: 18, attack: 5, xp: 28, sprite: "monster_wraith.svg" },
    shack_ghoul: { name: "Shack Ghoul", hp: 20, attack: 6, xp: 30, sprite: "monster_wraith.svg" },
    mimic_chest: { name: "Mimic Chest", hp: 26, attack: 7, xp: 40, sprite: "monster_mimic.svg" }
  };
  const ITEM_SPRITES = {
    doll: "item_doll.svg",
    orb: "item_orb.svg"
  };
  const ABILITY_TEXT = {
    cleave: "Cleave ready: hit every adjacent enemy.",
    guard: "Guard ready: brace and reduce incoming blows.",
    second_wind: "Second Wind ready: recover a burst of HP once per map."
  };

  const state = {
    currentMapId: "cletus_caravan_road",
    map: null,
    mapTitle: "Caravan Ambush",
    monsters: [],
    loot: [],
    doors: [],
    npcs: [],
    exits: [],
    stories: [],
    seenStories: new Set(),
    mapCache: {},
    message: "Cletus wakes to screams in the caravan line.",
    log: ["Cletus grips his axe as the caravan erupts into chaos."],
    hero: freshHero()
  };

  const app = document.getElementById("app");
  init();

  async function init() {
    bindKeys();
    window.addEventListener("resize", render);
    await loadMap("cletus_caravan_road", "caravan_start");
  }

  function freshHero() {
    return {
      x: 1,
      y: 1,
      hp: 44,
      maxHp: 44,
      attack: 8,
      defense: 1,
      xp: 0,
      gold: 0,
      potions: 1,
      shield: false,
      mapPiece: false,
      doll: false,
      orb: false,
      guarding: false,
      secondWindUsed: false,
      abilities: ["basic_attack"],
      sprite: "hero_cletus.svg"
    };
  }

  async function loadMap(mapId, spawnId) {
    const entry = MAPS[mapId];
    if (!entry) {
      state.message = "The next beta map is not wired yet.";
      render();
      return;
    }
    if (state.map) {
      saveCurrentMapState();
    }
    state.currentMapId = mapId;
    state.mapTitle = entry.title;
    try {
      const response = await fetch(entry.path);
      const text = await response.text();
      applyMap(parseTmx(text), spawnId);
      restoreMapState(mapId);
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
        props[property.getAttribute("name")] = property.getAttribute("value") || "";
      });
      return {
        id: object.getAttribute("id"),
        name: object.getAttribute("name") || "",
        type: object.getAttribute("type") || "",
        x: Math.floor(Number(object.getAttribute("x")) / tileWidth),
        y: Math.floor(Number(object.getAttribute("y")) / tileHeight),
        props
      };
    });
    return { width, height, tileWidth, tileHeight, tilesetImage, layers, objects };
  }

  function applyMap(map, spawnId) {
    state.map = map;
    state.monsters = [];
    state.loot = [];
    state.doors = [];
    state.npcs = [];
    state.exits = [];
    state.stories = [];
    state.hero.guarding = false;
    state.hero.secondWindUsed = false;
    map.objects.forEach((object) => {
      if (object.type === "spawn" && (!spawnId || object.name === spawnId || object.props.spawn_id === spawnId)) {
        state.hero.x = object.x;
        state.hero.y = object.y;
      } else if (object.type === "monster") {
        const base = MONSTERS[object.props.encounter] || MONSTERS.caravan_goblin;
        state.monsters.push({ ...base, id: object.name, x: object.x, y: object.y, hp: base.hp, maxHp: base.hp });
      } else if (object.type === "loot") {
        state.loot.push({ id: object.name, x: object.x, y: object.y, name: object.name, kind: object.props.kind || "cache", amount: Number(object.props.amount) || 1, text: object.props.text || "" });
      } else if (object.type === "door") {
        state.doors.push({ x: object.x, y: object.y, name: object.name, open: object.props.state === "open", blocks: object.props.blocks_movement !== "false", text: object.props.text || "" });
      } else if (object.type === "npc") {
        state.npcs.push({ x: object.x, y: object.y, name: object.name || "NPC", text: object.props.text || "", sprite: object.props.sprite || "" });
      } else if (object.type === "exit") {
        state.exits.push({ x: object.x, y: object.y, name: object.name || "exit", targetMap: object.props.target_map, targetSpawn: object.props.target_spawn, text: object.props.text || "" });
      } else if (object.type === "story") {
        state.stories.push({ id: `${state.currentMapId}:${object.name}`, x: object.x, y: object.y, text: object.props.text || "", once: object.props.once !== "false", ability: object.props.ability || "" });
      }
    });
    state.log.unshift(`${state.mapTitle} loaded.`);
  }

  function saveCurrentMapState() {
    state.mapCache[state.currentMapId] = {
      monsters: state.monsters.map((monster) => ({ ...monster })),
      loot: state.loot.map((item) => ({ ...item })),
      doors: state.doors.map((door) => ({ ...door }))
    };
  }

  function restoreMapState(mapId) {
    const cached = state.mapCache[mapId];
    if (!cached) return;
    state.monsters = cached.monsters.map((monster) => ({ ...monster }));
    state.loot = cached.loot.map((item) => ({ ...item }));
    state.doors = cached.doors.map((door) => ({ ...door }));
  }

  function render() {
    if (!state.map) {
      app.innerHTML = `<p class="readout">${escapeHtml(state.message)}</p>`;
      return;
    }
    const cells = [];
    const camera = cameraWindow();
    for (let y = camera.y; y < camera.y + camera.rows; y += 1) {
      for (let x = camera.x; x < camera.x + camera.cols; x += 1) {
        const index = y * state.map.width + x;
        const monster = state.monsters.find((candidate) => candidate.x === x && candidate.y === y && candidate.hp > 0);
        const loot = state.loot.find((item) => item.x === x && item.y === y);
        const door = state.doors.find((item) => item.x === x && item.y === y && !item.open);
        const npc = state.npcs.find((item) => item.x === x && item.y === y);
        const exit = state.exits.find((item) => item.x === x && item.y === y);
        const storyTile = state.stories.find((item) => item.x === x && item.y === y && !state.seenStories.has(item.id));
        const hero = state.hero.x === x && state.hero.y === y;
        const layerHtml = RENDER_LAYERS.map((layerName) => tileLayerHtml((state.map.layers[layerName] || [])[index])).join("");
        let content = layerHtml;
        if (hero) {
          content += `<img class="actor" src="${ASSET_BASE}/sprites/${state.hero.sprite}" alt="Cletus">`;
        } else if (monster) {
          content += `<img class="actor" src="${ASSET_BASE}/sprites/${monster.sprite}" alt="${escapeHtml(monster.name)}">`;
        } else if (npc && npc.sprite) {
          content += `<img class="actor" src="${ASSET_BASE}/sprites/${npc.sprite}" alt="${escapeHtml(npc.name)}">`;
        } else if (loot && ITEM_SPRITES[loot.kind]) {
          content += `<img class="actor" src="${ASSET_BASE}/sprites/${ITEM_SPRITES[loot.kind]}" alt="${escapeHtml(loot.kind)}">`;
        } else if (loot) {
          content += `<span class="token">$</span>`;
        } else if (door) {
          content += `<span class="token">D</span>`;
        } else if (npc) {
          content += `<span class="token">?</span>`;
        } else if (exit) {
          content += `<span class="token">&gt;</span>`;
        } else if (storyTile) {
          content += `<span class="token">!</span>`;
        }
        cells.push(`<div class="tile" data-world="${x},${y}">${content}</div>`);
      }
    }
    const monsterLine = state.monsters.filter((monster) => monster.hp > 0).map((monster) => `${monster.name} ${monster.hp}/${monster.maxHp}`).join(" | ") || "No enemies standing";
    app.innerHTML = `
      <header class="topbar">
        <div class="title-row">
          <h1>Tales of Visteria</h1>
          <span class="beta-pill">Cletus Beta</span>
          <span class="beta-pill">v${BETA_VERSION}</span>
        </div>
        <div class="status-row">
          <span>${escapeHtml(state.mapTitle)}</span>
        </div>
      </header>
      <section class="dungeon-shell">
        <aside class="status-menu" aria-label="Cletus status">
          ${statusMenuHtml()}
        </aside>
        <div class="playfield">
          <div class="board" style="--view-cols:${camera.cols};--view-rows:${camera.rows};grid-template-columns: repeat(${camera.cols}, var(--tile-size));">${cells.join("")}</div>
          <div class="readout">
            <p>${escapeHtml(state.message)}</p>
            <p>${escapeHtml(monsterLine)}</p>
            <ol>${state.log.slice(0, 6).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ol>
          </div>
        </div>
      </section>
      <nav class="controls">
        <button type="button" data-move="0,-1">Up</button>
        <button type="button" data-move="-1,0">Left</button>
        <button type="button" data-move="1,0">Right</button>
        <button type="button" data-move="0,1">Down</button>
        <button type="button" data-cleave ${hasAbility("cleave") ? "" : "disabled"}>Cleave</button>
        <button type="button" data-guard ${hasAbility("guard") ? "" : "disabled"}>Guard</button>
        <button type="button" data-second-wind ${hasAbility("second_wind") && !state.hero.secondWindUsed ? "" : "disabled"}>Second Wind</button>
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
    document.querySelector("[data-cleave]").addEventListener("click", cleave);
    document.querySelector("[data-guard]").addEventListener("click", guard);
    document.querySelector("[data-second-wind]").addEventListener("click", secondWind);
    document.querySelector("[data-potion]").addEventListener("click", drinkPotion);
    document.querySelector("[data-restart]").addEventListener("click", restart);
  }

  function cameraWindow() {
    const compactWidth = window.innerWidth < 700;
    const compactHeight = window.innerHeight < 720;
    const cols = Math.min(state.map.width, compactWidth ? 15 : 23);
    const rows = Math.min(state.map.height, compactHeight ? 11 : 15);
    const x = clamp(state.hero.x - Math.floor(cols / 2), 0, Math.max(0, state.map.width - cols));
    const y = clamp(state.hero.y - Math.floor(rows / 2), 0, Math.max(0, state.map.height - rows));
    return { x, y, cols, rows };
  }

  function statusMenuHtml() {
    const stats = [
      ["HP", `${state.hero.hp}/${state.hero.maxHp}`],
      ["Attack", state.hero.attack],
      ["Defense", state.hero.defense],
      ["XP", state.hero.xp],
      ["Gold", state.hero.gold],
      ["Position", `${state.hero.x}, ${state.hero.y}`]
    ];
    const inventory = inventoryItems();
    const abilities = state.hero.abilities.map((ability) => ability === "basic_attack" ? "Axe attack" : (ABILITY_TEXT[ability] || ability));
    return `
      <div class="status-portrait">
        <img src="${ASSET_BASE}/sprites/${state.hero.sprite}" alt="Cletus portrait">
        <div>
          <h2>Cletus</h2>
          <p>Warrior</p>
        </div>
      </div>
      <section class="status-block">
        <h3>Stats</h3>
        <dl>${stats.map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`).join("")}</dl>
      </section>
      <section class="status-block">
        <h3>Inventory</h3>
        <ul>${inventory.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
      </section>
      <section class="status-block">
        <h3>Abilities</h3>
        <ul>${abilities.map((ability) => `<li>${escapeHtml(ability)}</li>`).join("")}</ul>
      </section>
    `;
  }

  function inventoryItems() {
    const items = [`Health potion x${state.hero.potions}`];
    if (state.hero.shield) items.push("Dented shield");
    if (state.hero.mapPiece) items.push("Brittle bridge map");
    if (state.hero.doll) items.push("Cracked doll");
    if (state.hero.orb) items.push("Magistone orb");
    if (!state.hero.shield && !state.hero.mapPiece && !state.hero.doll && !state.hero.orb && state.hero.potions <= 0) {
      items.push("Pack is empty");
    }
    return items;
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
      } else if (event.key === "q") {
        cleave();
      } else if (event.key === "e") {
        guard();
      }
    });
  }

  function moveHero(dx, dy) {
    if (state.hero.hp <= 0) return;
    const x = state.hero.x + dx;
    const y = state.hero.y + dy;
    const monster = liveMonsterAt(x, y);
    const door = state.doors.find((candidate) => candidate.x === x && candidate.y === y && !candidate.open);
    const npc = state.npcs.find((candidate) => candidate.x === x && candidate.y === y);
    const exit = state.exits.find((candidate) => candidate.x === x && candidate.y === y);
    if (monster) {
      attackMonster(monster);
    } else if (door && door.blocks) {
      door.open = true;
      door.blocks = false;
      state.message = door.text || "Cletus forces the door open.";
      state.log.unshift(state.message);
      monsterTurn();
    } else if (!isWalkable(x, y)) {
      state.message = "Broken stone and wreckage block the path.";
      state.log.unshift(state.message);
    } else if (exit) {
      state.hero.x = x;
      state.hero.y = y;
      state.message = exit.text || "Cletus pushes onward.";
      state.log.unshift(state.message);
      loadMap(exit.targetMap, exit.targetSpawn);
      return;
    } else {
      state.hero.x = x;
      state.hero.y = y;
      interactHere(npc);
      monsterTurn();
    }
    finishTurn();
  }

  function interactHere(npc) {
    state.message = "Cletus moves through the ruins.";
    if (npc) {
      state.message = npc.text || `${npc.name} has nothing more to say.`;
      state.log.unshift(state.message);
    }
    triggerStories();
    collectLoot();
  }

  function triggerStories() {
    state.stories.forEach((storyItem) => {
      if (storyItem.x !== state.hero.x || storyItem.y !== state.hero.y) return;
      if (storyItem.once && state.seenStories.has(storyItem.id)) return;
      state.seenStories.add(storyItem.id);
      if (storyItem.ability && !hasAbility(storyItem.ability)) {
        state.hero.abilities.push(storyItem.ability);
        state.log.unshift(ABILITY_TEXT[storyItem.ability] || `Cletus learned ${storyItem.ability}.`);
      }
      state.message = storyItem.text;
      state.log.unshift(storyItem.text);
    });
  }

  function collectLoot() {
    const index = state.loot.findIndex((item) => item.x === state.hero.x && item.y === state.hero.y);
    if (index < 0) return;
    const loot = state.loot.splice(index, 1)[0];
    if (loot.kind === "potion") {
      state.hero.potions += loot.amount;
    } else if (loot.kind === "shield") {
      state.hero.shield = true;
      state.hero.defense += 1;
    } else if (loot.kind === "weapon") {
      state.hero.attack += 2;
    } else if (loot.kind === "map") {
      state.hero.mapPiece = true;
    } else if (loot.kind === "doll") {
      state.hero.doll = true;
    } else if (loot.kind === "orb") {
      state.hero.orb = true;
    } else {
      state.hero.gold += 6 * loot.amount;
    }
    state.message = loot.text || `Cletus collects ${loot.name}.`;
    state.log.unshift(state.message);
  }

  function attackMonster(monster) {
    const damage = Math.max(1, rollDie(8) + state.hero.attack - 3);
    monster.hp = Math.max(0, monster.hp - damage);
    state.message = `Cletus strikes the ${monster.name} for ${damage}.`;
    state.log.unshift(state.message);
    if (monster.hp <= 0) {
      state.hero.xp += monster.xp;
      state.hero.gold += Math.max(1, Math.floor(monster.xp / 5));
      state.log.unshift(`${monster.name} falls. +${monster.xp} XP.`);
    } else {
      monsterTurn();
    }
  }

  function cleave() {
    if (!hasAbility("cleave") || state.hero.hp <= 0) return;
    const adjacent = state.monsters.filter((monster) => monster.hp > 0 && distance(monster, state.hero) === 1);
    if (!adjacent.length) {
      state.message = "No enemy is close enough for Cleave.";
      finishTurn();
      return;
    }
    adjacent.forEach((monster) => {
      const damage = Math.max(2, rollDie(6) + Math.floor(state.hero.attack / 2));
      monster.hp = Math.max(0, monster.hp - damage);
      state.log.unshift(`Cleave hits ${monster.name} for ${damage}.`);
      if (monster.hp <= 0) {
        state.hero.xp += monster.xp;
        state.log.unshift(`${monster.name} drops under the arc.`);
      }
    });
    state.message = "Cletus sweeps his axe in a hard arc.";
    monsterTurn();
    finishTurn();
  }

  function guard() {
    if (!hasAbility("guard") || state.hero.hp <= 0) return;
    state.hero.guarding = true;
    state.message = "Cletus plants his feet and raises his shield.";
    state.log.unshift(state.message);
    monsterTurn();
    finishTurn();
  }

  function secondWind() {
    if (!hasAbility("second_wind") || state.hero.secondWindUsed || state.hero.hp <= 0) return;
    state.hero.secondWindUsed = true;
    const healing = rollDie(10) + 10;
    state.hero.hp = Math.min(state.hero.maxHp, state.hero.hp + healing);
    state.message = `Cletus drags in a breath and recovers ${healing} HP.`;
    state.log.unshift(state.message);
    monsterTurn();
    finishTurn();
  }

  function monsterTurn() {
    state.monsters.filter((monster) => monster.hp > 0).forEach((monster) => {
      const close = distance(monster, state.hero);
      if (close === 1) {
        const guardBonus = state.hero.guarding ? 3 : 0;
        const damage = Math.max(1, rollDie(monster.attack) - state.hero.defense - guardBonus);
        state.hero.hp = Math.max(0, state.hero.hp - damage);
        state.log.unshift(`${monster.name} hits Cletus for ${damage}.`);
      } else if (close <= 6) {
        const stepX = Math.sign(state.hero.x - monster.x);
        const stepY = Math.sign(state.hero.y - monster.y);
        if (tryMoveMonster(monster, stepX, 0) || tryMoveMonster(monster, 0, stepY)) {
          state.log.unshift(`${monster.name} closes in.`);
        }
      }
    });
    state.hero.guarding = false;
  }

  function tryMoveMonster(monster, dx, dy) {
    if (!dx && !dy) return false;
    const x = monster.x + dx;
    const y = monster.y + dy;
    const door = state.doors.find((candidate) => candidate.x === x && candidate.y === y && !candidate.open && candidate.blocks);
    const occupied = state.monsters.some((candidate) => candidate !== monster && candidate.hp > 0 && candidate.x === x && candidate.y === y);
    const heroThere = state.hero.x === x && state.hero.y === y;
    if (!isWalkable(x, y) || door || occupied || heroThere) return false;
    monster.x = x;
    monster.y = y;
    return true;
  }

  function drinkPotion() {
    if (state.hero.potions <= 0) {
      state.message = "No potion is ready in Cletus's pack.";
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
      state.message = "Cletus falls before reaching the bridge.";
      state.log.unshift(state.message);
    }
    render();
  }

  function restart() {
    state.seenStories = new Set();
    state.mapCache = {};
    state.hero = freshHero();
    state.log = ["Cletus grips his axe as the caravan erupts into chaos."];
    state.message = "Cletus wakes to screams in the caravan line.";
    loadMap("cletus_caravan_road", "caravan_start");
  }

  function hasAbility(ability) {
    return state.hero.abilities.includes(ability);
  }

  function liveMonsterAt(x, y) {
    return state.monsters.find((candidate) => candidate.x === x && candidate.y === y && candidate.hp > 0);
  }

  function distance(a, b) {
    return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
  }

  function tileLayerHtml(gid) {
    if (!gid) return "";
    const index = gid - 1;
    const col = index % TILESET_COLUMNS;
    const row = Math.floor(index / TILESET_COLUMNS);
    return `<span class="tile-layer" style="background-image:url('${state.map.tilesetImage}');background-position:calc(-${col} * var(--tile-size)) calc(-${row} * var(--tile-size));"></span>`;
  }

  function isWalkable(x, y) {
    if (x < 0 || y < 0 || x >= state.map.width || y >= state.map.height) return false;
    const index = y * state.map.width + x;
    const ground = (state.map.layers.Ground || [])[index] || 0;
    const collision = (state.map.layers.Collision || [])[index] || 0;
    const openDoor = state.doors.some((door) => door.x === x && door.y === y && door.open);
    if (openDoor) return ground > 0;
    return ground > 0 && collision === 0;
  }

  function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function escapeHtml(value) {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll("\"", "&quot;")
      .replaceAll("'", "&#039;");
  }
}());
