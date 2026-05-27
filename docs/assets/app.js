(function () {
  "use strict";

  const VERSION = "0.7.0";
  const MAP_DIRECTIONS = ["LEFT", "UP", "RIGHT", "DOWN"];
  const BASE_LEVEL = 5;
  const BASE_XP_TO_NEXT = 100;
  const XP_PER_LEVEL = 50;
  const SUPABASE_URL = "https://fojkijwketpzxsbikmsl.supabase.co";
  const SUPABASE_KEY = "sb_publishable_pxMr-7kXAoQ9gz0mTTWLew_FAIRtAio";
  const LEADERBOARD_TABLE = "leaderboard_scores";
  const lang = document.body.dataset.language || "en";
  const storagePrefix = "tov.web.";
  const uiTextByLanguage = {
    en: {
      english: "English",
      spanish: "Spanish",
      characterSheet: "Character Sheet",
      plotDevelopment: "Plot Development",
      noCharacter: "No character selected.\n\nStart a new game or load a save.",
      trait: "Trait",
      value: "Value",
      name: "Name",
      race: "Race",
      className: "Class",
      level: "Level",
      experience: "Experience",
      hp: "HP",
      ac: "AC",
      attackBonus: "Attack Bonus",
      damage: "Damage",
      equipment: "Equipment",
      enemyHp: "Enemy HP",
      leaderboard: "Leaderboard",
      submitScore: "Submit Score",
      playerNamePrompt: "Name for the leaderboard:",
      scoreSubmitted: "Score submitted.",
      scoreSubmitFailed: "Could not submit score. The leaderboard table may not be set up yet.",
      leaderboardLoading: "Loading leaderboard...",
      leaderboardEmpty: "No scores yet.",
      leaderboardFailed: "Could not load leaderboard.",
      leaderboardHeader: "Leaderboard",
      leaderboardLine: "{rank}. {name} - {score} ({character})",
      moveOn: "Move on"
    },
    es: {
      english: "Inglés",
      spanish: "Español",
      characterSheet: "Hoja de personaje",
      plotDevelopment: "Desarrollo de la trama",
      noCharacter: "No hay personaje seleccionado.\n\nEmpieza una nueva partida o carga una partida guardada.",
      trait: "Rasgo",
      value: "Valor",
      name: "Nombre",
      race: "Raza",
      className: "Clase",
      level: "Nivel",
      experience: "Experiencia",
      hp: "PV",
      ac: "CA",
      attackBonus: "Bonif. ataque",
      damage: "Daño",
      equipment: "Equipo",
      enemyHp: "PV enemigos",
      leaderboard: "Clasificación",
      submitScore: "Enviar puntaje",
      playerNamePrompt: "Nombre para la clasificación:",
      scoreSubmitted: "Puntaje enviado.",
      scoreSubmitFailed: "No se pudo enviar el puntaje. Tal vez falte crear la tabla de clasificación.",
      leaderboardLoading: "Cargando clasificación...",
      leaderboardEmpty: "Todavía no hay puntajes.",
      leaderboardFailed: "No se pudo cargar la clasificación.",
      leaderboardHeader: "Clasificación",
      leaderboardLine: "{rank}. {name} - {score} ({character})",
      moveOn: "Continuar"
    }
  };
  const ui = uiTextByLanguage[lang] || uiTextByLanguage.en;

  const classes = {
    warrior: {
      name: "Cletus",
      title: "Barbarian",
      race: "Goliath",
      maxHealth: 55,
      gold: 6,
      supplies: 2,
      gear: ["greataxe", "travel cloak"],
      bonus: "combat",
      ac: 15,
      attackBonus: 6,
      damageDie: 12,
      damageBonus: 4,
      attacks: 2,
      description: "A Goliath Barbarian with high health and brutal melee attacks."
    },
    ranger: {
      name: "Ren",
      title: "Ranger",
      race: "Elf",
      maxHealth: 44,
      gold: 8,
      supplies: 3,
      gear: ["longbow", "short blade"],
      bonus: "sneak",
      ac: 15,
      attackBonus: 7,
      damageDie: 8,
      damageBonus: 4,
      attacks: 2,
      description: "An Elven Ranger with strong accuracy and two attacks."
    },
    scholar: {
      name: "Cal",
      title: "Warlock",
      race: "Human",
      maxHealth: 40,
      gold: 10,
      supplies: 2,
      gear: ["old journal", "silver charm", "eldritch focus"],
      bonus: "persuasion",
      ac: 14,
      attackBonus: 7,
      damageDie: 10,
      damageBonus: 4,
      attacks: 2,
      description: "A Human Warlock with eldritch power and persuasion."
    },
    dwarf: {
      name: "Kili",
      title: "Fighter",
      race: "Dwarf",
      maxHealth: 50,
      gold: 5,
      supplies: 3,
      gear: ["battleaxe", "stone token"],
      bonus: "lore",
      ac: 16,
      attackBonus: 7,
      damageDie: 8,
      damageBonus: 4,
      attacks: 2,
      description: "A Dwarven Fighter with armor, stamina, and two attacks."
    },
    dm: {
      name: "Jon",
      title: "DM",
      race: "God",
      maxHealth: 999,
      gold: 0,
      supplies: 0,
      gear: ["DM screen", "loaded d20"],
      bonus: "fate",
      ac: 99,
      attackBonus: 99,
      damageDie: 20,
      damageBonus: 99,
      attacks: 1,
      description: "A nicotine addicted God controlling the story from above."
    }
  };

  const classTranslations = {
    es: {
      warrior: {
        title: "Bárbaro",
        race: "Goliat",
        description: "Un Bárbaro goliat con mucha salud y ataques cuerpo a cuerpo brutales."
      },
      ranger: {
        title: "Explorador",
        race: "Elfo",
        description: "Un Explorador élfico con gran precisión y dos ataques."
      },
      scholar: {
        title: "Brujo",
        race: "Humano",
        description: "Un Brujo humano con poder eldritch y buena persuasión."
      },
      dwarf: {
        title: "Guerrero",
        race: "Enano",
        description: "Un Guerrero enano con armadura, aguante y dos ataques."
      },
      dm: {
        title: "DM",
        race: "Dios",
        description: "Un Dios adicto a la nicotina que controla la historia desde arriba."
      }
    }
  };
  Object.entries(classTranslations[lang] || {}).forEach(([key, values]) => Object.assign(classes[key], values));

  const monsterStats = {
    goblin: { name: "Goblin", ac: 15, hp: 7, attackBonus: 4, damageDie: 6, damageBonus: 2, xp: 20 },
    orc: { name: "Orc", ac: 13, hp: 15, attackBonus: 5, damageDie: 12, damageBonus: 3, xp: 35 },
    gremlin: { name: "Gremlin", ac: 13, hp: 10, attackBonus: 4, damageDie: 6, damageBonus: 1, xp: 20 },
    ghoul: { name: "Ghoul", ac: 12, hp: 18, attackBonus: 4, damageDie: 6, damageBonus: 2, xp: 25 },
    mimic: { name: "Mimic", ac: 12, hp: 35, attackBonus: 5, damageDie: 8, damageBonus: 3, xp: 45 }
  };

  const achievementsByLanguage = {
    en: {
      first_fight: "First Blood",
      ghost_ally: "Tiny Terror",
      group_kill: "Crowd Control",
      lucky: "Lucky",
      unlucky: "Unlucky",
      forest_mind_break: "Dazed and Confused",
      ghost_slayer: "Ghost Slayer",
      ghost_kiss: "Not Your Goth Baddie",
      pyromaniac: "Pyromaniac",
      send_hydra: "Fuck Dem Kids",
      correct_chest_key: "Keyed In",
      mimic_nap: "Sleep Tight",
      played_everyone: "Full Party"
    },
    es: {
      first_fight: "Primera sangre",
      ghost_ally: "Terror diminuto",
      group_kill: "Control de masas",
      lucky: "Con suerte",
      unlucky: "Sin suerte",
      forest_mind_break: "Aturdido y confundido",
      ghost_slayer: "Cazafantasmas",
      ghost_kiss: "No es tu gótica",
      pyromaniac: "Piromano",
      send_hydra: "Al diablo con ellos",
      correct_chest_key: "La llave correcta",
      mimic_nap: "Duerme bien",
      played_everyone: "Grupo completo"
    }
  };
  const achievements = achievementsByLanguage[lang] || achievementsByLanguage.en;

  const xpReasonsByLanguage = {
    en: {
      combat: "won a fight",
      caravan_run: "escaped the caravan",
      forest_attempt: "tested the forest path",
      choose_cave: "chose the cave",
      go_deeper: "pressed deeper into Visteria",
      ghost_choice: "faced the ghost girl",
      doll_choice: "made a choice about the doll",
      district_choice: "chose a district route",
      search: "searched for supplies",
      residential_choice: "explored the residential district",
      bridge: "reached the bridge"
    },
    es: {
      combat: "ganaste una pelea",
      caravan_run: "escapaste de la caravana",
      forest_attempt: "probaste el camino del bosque",
      choose_cave: "elegiste la cueva",
      go_deeper: "avanzaste más profundo en Visteria",
      ghost_choice: "enfrentaste a la niña fantasma",
      doll_choice: "decidiste qué hacer con la muñeca",
      district_choice: "elegiste una ruta de distrito",
      search: "buscaste suministros",
      residential_choice: "exploraste el distrito residencial",
      bridge: "llegaste al puente"
    }
  };
  const xpReasons = xpReasonsByLanguage[lang] || xpReasonsByLanguage.en;

  const decisionXp = {
    caravan_run: 20,
    forest_attempt: 10,
    choose_cave: 20,
    go_deeper: 15,
    ghost_choice: 20,
    doll_choice: 15,
    district_choice: 20,
    search: 15,
    residential_choice: 20,
    bridge: 25
  };

  const state = {
    text: {},
    player: null,
    stats: loadJson("stats", defaultStats()),
    combat: null,
    storyParts: [],
    showGameOverImage: false,
    leaderboard: [],
    choices: []
  };

  const app = document.getElementById("app");

  init();

  async function init() {
    try {
      const response = await fetch(`../assets/data/${lang}.json`);
      state.text = await response.json();
    } catch {
      const fallback = await fetch("../assets/data/en.json");
      state.text = await fallback.json();
    }
    drawShell();
    showStart();
  }

  function drawShell() {
    app.innerHTML = `
      <header class="topbar">
        <div class="title-row">
          <h1 class="title">Tales of Visteria</h1>
          <span class="version">v${VERSION}</span>
        </div>
        <div class="meta-row">
          <a class="lang-link" href="../en/">${ui.english}</a>
          <a class="lang-link" href="../es/">${ui.spanish}</a>
        </div>
        <div id="status" class="status"></div>
      </header>
      <section class="layout">
        <aside class="side-panel player-panel">
          <h2 class="panel-title">${ui.characterSheet}</h2>
          <div id="sheet" class="sheet"></div>
        </aside>
        <section class="story-panel">
          <div id="story" class="story"></div>
        </section>
        <aside class="side-panel plot-panel">
          <h2 class="panel-title">${ui.plotDevelopment}</h2>
          <div id="plot" class="plot"></div>
        </aside>
      </section>
      <nav id="choices" class="choices"></nav>
    `;
  }

  function t(key, vars = {}) {
    let value = state.text[key] || key;
    return format(value, vars);
  }

  function format(value, vars = {}) {
    for (const [name, replacement] of Object.entries(vars)) {
      value = value.replaceAll(`{${name}}`, String(replacement));
    }
    return value;
  }

  function write(text, clear = false) {
    if (clear) {
      state.storyParts = [];
      state.showGameOverImage = false;
    }
    if (state.storyParts.length) {
      state.storyParts.push("<hr>");
    }
    state.storyParts.push(escapeHtml(text));
    render();
  }

  function writeKey(key, vars = {}, clear = false) {
    write(t(key, vars), clear);
  }

  function setChoices(choices) {
    state.choices = choices;
    render();
  }

  function render() {
    document.getElementById("story").innerHTML = state.storyParts.join("");
    if (state.showGameOverImage) {
      const img = document.createElement("img");
      img.className = "game-over-image";
      img.alt = "Tales of Visteria party";
      img.src = "../assets/game_over_party.png";
      document.getElementById("story").appendChild(img);
    }
    document.getElementById("status").textContent = statusText();
    document.getElementById("sheet").innerHTML = sheetText();
    document.getElementById("plot").textContent = plotText();
    const choiceArea = document.getElementById("choices");
    choiceArea.innerHTML = "";
    state.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.className = "choice";
      button.type = "button";
      button.textContent = choice.label;
      button.addEventListener("click", choice.action);
      choiceArea.appendChild(button);
    });
  }

  function showStart() {
    const stats = plotText();
    write(t("story.start", { stats }), true);
    setChoices([
      choice(t("choice.new_game"), showCharacterSelect),
      choice(t("choice.load_game"), loadGame),
      choice(ui.leaderboard, showLeaderboard),
      choice(t("choice.quit"), () => write("You can close this browser tab whenever you are ready."))
    ]);
  }

  function showCharacterSelect() {
    const lines = [t("story.character_select"), ""];
    Object.keys(classes).forEach((key) => {
      const data = classes[key];
      lines.push(`${data.name} the ${data.title}: ${data.description}`);
    });
    write(lines.join("\n"), true);
    setChoices([
      choice("Cletus", () => newPlayer("warrior")),
      choice("Ren", () => newPlayer("ranger")),
      choice("Cal", () => newPlayer("scholar")),
      choice("Kili", () => newPlayer("dwarf")),
      choice("Jon the DM", () => newPlayer("dm")),
      choice(t("choice.back"), showStart)
    ]);
  }

  function newPlayer(characterClass) {
    const template = classes[characterClass];
    state.player = {
      class: characterClass,
      name: template.name,
      title: template.title,
      race: template.race,
      health: template.maxHealth,
      maxHealth: template.maxHealth,
      gold: template.gold,
      supplies: template.supplies,
      gear: [...template.gear],
      bonus: template.bonus,
      level: BASE_LEVEL,
      experience: 0,
      xpToNext: BASE_XP_TO_NEXT,
      upgrades: { ac: 0, damage: 0 },
      flags: {
        forestAttempts: 0,
        girlHint: "",
        girlHelped: false,
        monstersScattered: false,
        hasDoll: false,
        hasThroneMap: false,
        hasPartialMap: false,
        hasDwarvenAle: false,
        hasMagistoneOrb: false,
        completedRecorded: false,
        deathRecorded: false
      },
      score: {
        fightsWon: 0,
        decisions: 0,
        submitted: false,
        startedAt: Date.now()
      },
      gameOverReason: "default"
    };
    state.stats[characterClass].runs += 1;
    saveStats();
    checkPlayedEveryone();
    continueChapter(characterClass === "dm" ? "dmIntro" : "caravan", true);
  }

  function continueChapter(chapter, clear = false) {
    if (!state.player) {
      showStart();
      return;
    }
    if (state.player.health <= 0) {
      gameOver();
      return;
    }
    const chapters = {
      dmIntro,
      dmGhost,
      dmDistricts,
      caravan,
      escape,
      cave,
      ghostGirl,
      districts,
      residential,
      bridge,
      complete
    };
    state.player.chapter = chapter;
    chapters[chapter](clear);
  }

  function dmIntro(clear = false) {
    writeKey("story.dm_intro", {}, clear);
    setChoices([
      choice(t("choice.dm_orcs"), () => {
        writeKey("story.dm_send_orcs");
        setChoices([
          choice(t("choice.caves"), () => dmChooseRoute("caves")),
          choice(t("choice.forest"), () => dmChooseRoute("forest"))
        ]);
      }),
      choice(t("choice.dm_hydra"), () => {
        unlock("send_hydra");
        state.player.gameOverReason = "hydra";
        state.player.health = 0;
        gameOver();
      })
    ]);
  }

  function dmChooseRoute(route) {
    writeKey(route === "forest" ? "story.dm_choose_forest" : "story.dm_choose_caves");
    continueChapter("dmGhost");
  }

  function dmGhost(clear = false) {
    writeKey("story.dm_ghost", {}, clear);
    setChoices([
      choice("Cletus", () => dmWatch("cletus")),
      choice("Cal", () => dmWatch("cal")),
      choice("Ren", () => dmWatch("ren")),
      choice("Kili", () => dmWatch("kili"))
    ]);
  }

  function dmWatch(name) {
    const roll = d20();
    const key = roll <= 10 ? "low" : "high";
    writeKey("story.dm_watch_result", { roll, result: t(`story.dm_watch_${name}_${key}`) });
    writeKey("story.dm_watch_continue");
    setChoices([choice(t("choice.keep_watching"), () => continueChapter("dmDistricts"))]);
  }

  function dmDistricts(clear = false) {
    writeKey("story.dm_districts", {}, clear);
    setChoices([
      choice(t("choice.dm_barracks"), dmBarracks),
      choice(t("choice.dm_merchant"), dmMerchant)
    ]);
  }

  function dmBarracks() {
    writeKey("story.dm_barracks");
    setChoices([
      choice(t("choice.dm_barracks_armory"), () => dmRollScene("story.dm_barracks_armory", "story.dm_barracks_armory", 10, dmBarracksLoot)),
      choice(t("choice.dm_barracks_quarters"), () => dmRollScene("story.dm_barracks_quarters", "story.dm_barracks_quarters", 10, dmBarracksLoot)),
      choice(t("choice.dm_barracks_combat"), () => {
        writeKey("story.dm_barracks_combat");
        setChoices([choice(t("choice.loot_bodies"), dmBarracksMap)]);
      })
    ]);
  }

  function dmRollScene(templateKey, resultPrefix, threshold, next) {
    const roll = d20();
    const result = t(`${resultPrefix}_${roll <= threshold ? "low" : "high"}`);
    writeKey(templateKey, { roll, result });
    setChoices([choice(t("choice.roll_loot"), next)]);
  }

  function dmBarracksLoot() {
    const roll = d20();
    const result = roll <= 7 ? "low" : roll <= 14 ? "mid" : "high";
    writeKey("story.dm_barracks_loot", { roll, result: t(`story.dm_barracks_loot_${result}`) });
    setChoices([choice(roll > 14 ? t("choice.read_map") : t("choice.move_houses"), roll > 14 ? dmBarracksMap : dmResidential)]);
  }

  function dmBarracksMap() {
    writeKey("story.dm_barracks_map");
    setChoices([choice(t("choice.move_houses"), dmResidential)]);
  }

  function dmMerchant() {
    writeKey("story.dm_merchant");
    setChoices([
      choice(t("choice.dm_merchant_shop"), dmMerchantShop),
      choice(t("choice.dm_merchant_sneak"), dmMerchantSneak),
      choice(t("choice.dm_merchant_combat"), dmMerchantCombat)
    ]);
  }

  function dmMerchantShop() {
    const roll = d20();
    const result = t(`story.dm_merchant_shop_${roll <= 10 ? "low" : "high"}`);
    writeKey("story.dm_merchant_shop", { roll, result });
    setChoices([choice(roll <= 10 ? t("choice.make_fight") : t("choice.roll_loot"), roll <= 10 ? dmMerchantCombat : dmMerchantLoot)]);
  }

  function dmMerchantSneak() {
    const roll = d20();
    const result = t(`story.dm_merchant_sneak_${roll <= 16 ? "low" : "high"}`);
    writeKey("story.dm_merchant_sneak", { roll, result });
    setChoices([choice(roll <= 16 ? t("choice.make_fight") : t("choice.move_houses"), roll <= 16 ? dmMerchantCombat : dmResidential)]);
  }

  function dmMerchantCombat() {
    writeKey("story.dm_merchant_combat");
    setChoices([choice(t("choice.loot_bodies"), dmMerchantMap)]);
  }

  function dmMerchantLoot() {
    const roll = d20();
    const result = roll <= 7 ? "low" : roll <= 14 ? "mid" : "high";
    writeKey("story.dm_merchant_loot", { roll, result: t(`story.dm_merchant_loot_${result}`) });
    setChoices([choice(roll > 14 ? t("choice.read_map") : t("choice.move_houses"), roll > 14 ? dmMerchantMap : dmResidential)]);
  }

  function dmMerchantMap() {
    writeKey("story.dm_merchant_map");
    setChoices([choice(t("choice.move_houses"), dmResidential)]);
  }

  function dmResidential() {
    writeKey("story.dm_residential");
    setChoices([
      choice(t("choice.dm_manor"), dmManor),
      choice(t("choice.dm_shack"), () => {
        writeKey("story.dm_shack");
        setChoices([choice(t("choice.move_bridge"), dmBridge)]);
      }),
      choice(t("choice.dm_mimic_house"), dmMimicHouse),
      choice(t("choice.dm_bridge"), dmBridge)
    ]);
  }

  function dmManor() {
    writeKey("story.dm_manor");
    setChoices([
      choice(t("choice.dm_manor_orb"), () => {
        writeKey("story.dm_manor_orb");
        setChoices([choice(t("choice.move_bridge"), dmBridge)]);
      }),
      choice(t("choice.dm_manor_boom"), () => {
        writeKey("story.dm_manor_boom");
        setChoices([choice(t("choice.rewind"), dmResidential)]);
      }),
      choice(t("choice.dm_bridge"), dmBridge)
    ]);
  }

  function dmMimicHouse() {
    writeKey("story.dm_mimic_house");
    setChoices([
      choice(t("choice.dm_mimic_burn"), () => {
        writeKey("story.dm_mimic_burn");
        setChoices([choice(t("choice.move_bridge"), dmBridge)]);
      }),
      choice(t("choice.dm_bridge"), dmBridge),
      choice(t("choice.dm_mimic_loot"), () => {
        writeKey("story.dm_mimic_loot");
        setChoices([choice(t("choice.drag_out"), dmBridge)]);
      }),
      choice(t("choice.dm_mimic_rest"), () => {
        writeKey("story.dm_mimic_rest");
        setChoices([choice(t("choice.rewind"), dmMimicHouse)]);
      })
    ]);
  }

  function dmBridge() {
    writeKey("story.dm_bridge");
    setChoices([choice(t("choice.chapter_complete"), () => continueChapter("complete"))]);
  }

  function caravan(clear = false) {
    writeKey("story.caravan", {}, clear);
    setChoices([
      choice(t("choice.fight"), () => {
        writeKey("story.caravan_fight");
        startCombat(["orc", "goblin", "goblin"], "story.caravan_combat_victory", {
          attackersPerRound: 2,
          onWin: () => {
            unlock("first_fight");
            addItem("notched axe");
            writeKey("story.caravan_overrun");
            continueChapter("escape");
          },
          onRun: () => {
            writeKey("story.caravan_run");
            state.player.supplies += 1;
            writeKey("story.caravan_overrun");
            continueChapter("escape");
          }
        });
      }),
      choice(t("choice.run"), () => {
        writeKey("story.caravan_run");
        state.player.supplies += 1;
        awardDecisionXp("caravan_run");
        writeKey("story.caravan_overrun");
        continueChapter("escape");
      }),
      choice(t("choice.save"), saveGame),
      choice(t("choice.main_menu"), showStart)
    ]);
  }

  function escape(clear = false) {
    writeKey("story.escape", {}, clear);
    setChoices([
      choice(t("choice.forest"), () => {
        state.player.flags.forestAttempts += 1;
        state.stats[state.player.class].forest_attempts += 1;
        saveStats();
        writeKey("story.escape_forest");
        if (state.player.flags.forestAttempts > 5) {
          unlock("forest_mind_break");
          state.player.gameOverReason = "forest_mind_break";
          state.player.health = 0;
          gameOver();
          return;
        }
        writeKey("story.escape_forest_repeat");
        awardDecisionXp("forest_attempt");
        continueChapter("escape");
      }),
      choice(t("choice.cave"), () => {
        writeKey("story.escape_cave");
        awardDecisionXp("choose_cave");
        continueChapter("cave");
      })
    ]);
  }

  function cave(clear = false) {
    writeKey("story.cave", {}, clear);
    setChoices([
      choice(t("choice.fight"), () => {
        writeKey("story.cave_fight_start");
        startCombat(["goblin", "goblin"], "story.cave_fight_success", {
          attackersPerRound: 2,
          onWin: () => continueChapter("ghostGirl"),
          onRun: () => {
            writeKey("story.cave_deeper");
            continueChapter("ghostGirl");
          }
        });
      }),
      choice(t("choice.go_deeper"), () => {
        writeKey("story.cave_deeper");
        awardDecisionXp("go_deeper");
        continueChapter("ghostGirl");
      })
    ]);
  }

  function ghostGirl(clear = false) {
    writeKey("story.ghost_girl", {}, clear);
    setChoices([
      choice(t("choice.persuade"), ghostPersuade),
      choice(t("choice.fight"), ghostFight),
      choice(t("choice.sneak_past"), () => {
        writeKey("story.sneak_past_girl_start");
        writeKey("story.sneak_past_girl_result");
        writeKey("story.ghost_black_miasma");
        awardDecisionXp("ghost_choice");
        dollChoice();
      })
    ]);
  }

  function ghostPersuade() {
    const roll = rollD20("persuasion");
    if (roll <= 7) {
      writeKey("story.persuade_low");
      dollChoice();
    } else if (roll <= 15) {
      state.player.flags.girlHint = "merchant_glowy_ball";
      writeKey("story.persuade_mid");
      dollChoice();
    } else {
      state.player.flags.girlHelped = true;
      state.player.flags.monstersScattered = true;
      unlock("ghost_ally");
      writeKey("story.persuade_high");
      awardDecisionXp("ghost_choice");
      continueChapter("districts");
    }
  }

  function ghostFight() {
    const cls = state.player.class;
    writeKey(`story.fight_girl_${cls}`);
    awardDecisionXp("ghost_choice");
    if (cls === "scholar") {
      unlock("ghost_slayer");
      writeKey("story.ghost_black_miasma");
      dollChoice();
      return;
    }
    if (cls === "ranger") {
      writeKey("story.ghost_black_miasma");
      dollChoice();
      return;
    }
    if (cls === "dwarf") {
      unlock("ghost_kiss");
    }
    writeKey("story.ghost_play");
    state.player.gameOverReason = "ghost_black_pits";
    state.player.health = 0;
    gameOver();
  }

  function dollChoice() {
    writeKey("story.doll_choice");
    setChoices([
      choice(t("choice.grab_doll"), () => {
        state.player.flags.hasDoll = true;
        addItem("cracked doll");
        writeKey("story.doll_grab");
        awardDecisionXp("doll_choice");
        continueChapter("districts");
      }),
      choice(t("choice.leave_doll"), () => {
        addItem("cracked doll");
        state.player.flags.hasDoll = true;
        writeKey("story.doll_leave");
        awardDecisionXp("doll_choice");
        continueChapter("districts");
      })
    ]);
  }

  function districts(clear = false) {
    writeKey("story.districts", {}, clear);
    setChoices([
      choice(t("choice.barracks"), () => {
        awardDecisionXp("district_choice");
        barracks();
      }),
      choice(t("choice.merchant_district"), () => {
        awardDecisionXp("district_choice");
        merchant();
      }),
      choice(t("choice.rest"), () => {
        state.player.health = state.player.maxHealth;
        writeKey("story.districts_rest");
        districts();
      }),
      choice(t("choice.save"), saveGame)
    ]);
  }

  function barracks() {
    writeKey("story.barracks_enter");
    writeKey("story.barracks_description");
    setChoices([
      choice(t("choice.sneak_armory"), () => barracksSneak("armory")),
      choice(t("choice.center_ring"), barracksCombat),
      choice(t("choice.sneak_quarters"), () => barracksSneak("quarters"))
    ]);
  }

  function barracksSneak(type) {
    writeKey(type === "armory" ? "story.barracks_armory" : "story.barracks_quarters");
    const roll = rollD20("sneak");
    if (roll <= 10) {
      writeKey(type === "armory" ? "story.barracks_armory_fail" : "story.barracks_quarters_fail");
      barracksCombat();
    } else {
      writeKey(type === "armory" ? "story.barracks_armory_success" : "story.barracks_quarters_success");
      searchLoot(() => continueChapter("residential"));
    }
  }

  function barracksCombat() {
    writeKey("story.barracks_fight");
    startCombat(["orc", "orc", "orc"], "story.barracks_combat_victory", {
      attackersPerRound: 1,
      onWin: () => {
        writeKey("story.combat_loot_map");
        awardMap();
        continueChapter("residential");
      }
    });
  }

  function merchant() {
    writeKey("story.city_enter");
    if (state.player.flags.girlHint === "merchant_glowy_ball") {
      writeKey("story.city_girl_hint");
    }
    writeKey("story.city_description");
    setChoices([
      choice(t("choice.sneak_shop"), () => merchantShop()),
      choice(t("choice.assault_monsters"), merchantCombat),
      choice(t("choice.sneak_past_monsters"), merchantSneak)
    ]);
  }

  function merchantShop() {
    writeKey("story.city_shop");
    const roll = rollD20("sneak");
    if (roll <= 10) {
      writeKey("story.city_shop_fail");
      merchantCombat();
    } else {
      writeKey("story.city_shop_success");
      searchLoot(() => continueChapter("residential"));
    }
  }

  function merchantSneak() {
    writeKey("story.city_sneak");
    const roll = rollD20("sneak");
    if (roll <= 16) {
      writeKey("story.city_sneak_fail");
      merchantCombat();
    } else {
      writeKey("story.city_sneak_success");
      continueChapter("residential");
    }
  }

  function merchantCombat() {
    writeKey("story.city_assault");
    startCombat(["goblin", "goblin", "goblin", "goblin", "goblin", "orc", "orc"], "story.city_combat_victory", {
      attackersPerRound: 1,
      onWin: () => {
        writeKey("story.combat_loot_map");
        awardMap();
        continueChapter("residential");
      }
    });
  }

  function searchLoot(next) {
    const roll = rollD20("search");
    awardDecisionXp("search");
    if (roll <= 7) {
      writeKey("story.search_city_low");
      state.player.gold += 3;
      state.player.flags.hasDwarvenAle = true;
      addItem("dwarven ale");
    } else if (roll <= 14) {
      writeKey("story.search_potion");
      addItem("health potion");
    } else {
      awardMap();
    }
    setChoices([choice(ui.moveOn, next)]);
  }

  function awardMap() {
    state.player.flags.hasThroneMap = true;
    writeKey("story.throne_map", { directions: MAP_DIRECTIONS.join(", ") });
  }

  function residential(clear = false) {
    writeKey("story.residential_enter", {}, clear);
    writeKey("story.residential");
    setChoices([
      choice(t("choice.large_manor"), () => {
        awardDecisionXp("residential_choice");
        largeManor();
      }),
      choice(t("choice.small_shack"), () => {
        awardDecisionXp("residential_choice");
        smallShack();
      }),
      choice(t("choice.large_house"), () => {
        awardDecisionXp("residential_choice");
        mimicHouse();
      }),
      choice(t("choice.proceed_bridge"), () => goBridge())
    ]);
  }

  function largeManor() {
    writeKey("story.large_manor");
    const roll = rollD20("sneak");
    if (roll <= 14) {
      writeKey("story.large_manor_seen");
      manorCombat();
    } else if (roll <= 19) {
      writeKey("story.large_manor_unseen");
      setChoices([
        choice(t("choice.attack_them"), manorCombat),
        choice(t("choice.sneak_past"), manorSneak),
        choice(t("choice.proceed_bridge"), goBridge)
      ]);
    } else {
      writeKey("story.large_manor_grouped");
      setChoices([choice(t("choice.take_them_out"), manorGroupKill)]);
    }
  }

  function manorSneak() {
    writeKey("story.manor_sneak");
    setChoices([
      choice(t("choice.attack_them"), manorCombat),
      choice(t("choice.loot_manor"), manorLoot),
      choice(t("choice.proceed_bridge"), goBridge)
    ]);
  }

  function manorGroupKill() {
    writeKey(`story.manor_group_kill_${state.player.class}`);
    unlock("group_kill");
    ensureScoreState();
    state.player.score.fightsWon += 1;
    awardXp((monsterStats.goblin.xp * 5) + (monsterStats.orc.xp * 2), "combat");
    manorWin();
  }

  function manorCombat() {
    startCombat(["goblin", "goblin", "goblin", "goblin", "goblin", "orc", "orc"], "story.manor_combat_victory", {
      attackersPerRound: 1,
      onWin: manorWin
    });
  }

  function manorWin() {
    writeKey("story.manor_win");
    setChoices([choice(t("choice.loot_manor"), manorLoot)]);
  }

  function manorLoot() {
    writeKey("story.manor_loot");
    setChoices([
      choice(t("choice.use_keys_chest"), manorChestKeys),
      choice(t("choice.leave_found"), goBridge),
      choice(t("choice.store_keys_chest"), () => {
        addItem("unmarked keys");
        addItem("small black chest");
        writeKey("story.manor_store_chest");
        setChoices([choice(t("choice.leave_house"), goBridge)]);
      })
    ]);
  }

  function manorChestKeys() {
    writeKey("story.manor_chest_keys");
    const keys = ["blue", "yellow", "red", "black", "iron", "gold", "silver", "green"];
    setChoices(keys.map((key) => choice(t(`choice.${key}_key`), () => {
      if (key === "red") {
        unlock("correct_chest_key");
        writeKey("story.manor_chest_unlock");
        setChoices([choice(t("choice.open_chest"), () => {
          state.player.flags.hasMagistoneOrb = true;
          addItem("magistone orb");
          writeKey("story.manor_magistone_orb");
          setChoices([choice(t("choice.leave_house"), goBridge)]);
        })]);
      } else {
        writeKey("story.manor_chest_trap");
        state.player.gameOverReason = "manor_chest";
        state.player.health = 0;
        gameOver();
      }
    })));
  }

  function smallShack() {
    writeKey("story.small_shack");
    startCombat(["gremlin", "ghoul"], "story.small_shack_win", {
      attackersPerRound: 2,
      onWin: () => {
        setChoices([
          choice(t("choice.return_street"), () => continueChapter("residential", true)),
          choice(t("choice.proceed_bridge"), goBridge)
        ]);
      }
    });
  }

  function mimicHouse() {
    writeKey("story.mimic_house");
    setChoices([
      choice(t("choice.burn_house"), () => {
        unlock("pyromaniac");
        writeKey("story.mimic_house_burn");
        setChoices([choice(t("choice.leave_house"), goBridge)]);
      }),
      choice(t("choice.leave_immediately"), () => {
        writeKey("story.mimic_house_leave");
        goBridge();
      }),
      choice(t("choice.loot_chests"), () => {
        writeKey("story.mimic_house_loot");
        writeKey("story.mimic_house_loot_clear");
        mimicFightOne();
      }),
      choice(t("choice.rest_here"), () => {
        unlock("mimic_nap");
        writeKey("story.mimic_house_rest");
        state.player.gameOverReason = "mimic";
        state.player.health = 0;
        gameOver();
      })
    ]);
  }

  function mimicFightOne() {
    startCombat(["mimic"], "story.mimic_house_fight_one_win", {
      attackersPerRound: 1,
      deathReason: "mimic",
      onWin: () => {
        writeKey("story.mimic_house_second_wave");
        setChoices([
          choice(t("choice.fight"), mimicFightTwo),
          choice(t("choice.flee"), mimicFlee)
        ]);
      }
    });
  }

  function mimicFightTwo() {
    startCombat(["mimic", "mimic"], "story.mimic_house_fight_two_win", {
      attackersPerRound: 2,
      deathReason: "mimic",
      onWin: () => {
        state.player.flags.hasPartialMap = true;
        state.player.flags.hasMagistoneOrb = true;
        addItem("torn bridge map");
        addItem("magistone orb");
        writeKey("story.mimic_house_escape");
        setChoices([choice(t("choice.proceed_bridge"), goBridge)]);
      }
    });
  }

  function mimicFlee() {
    writeKey("story.mimic_house_flee");
    const options = [
      choice(t("choice.black_hole"), () => {
        writeKey("story.mimic_house_black_hole");
        state.player.gameOverReason = "mimic";
        state.player.health = 0;
        gameOver();
      }),
      choice(t("choice.cast_fire"), () => {
        writeKey("story.mimic_house_fire");
        setChoices([choice(t("choice.proceed_bridge"), goBridge)]);
      }),
      choice(t("choice.attack_walls"), () => {
        writeKey("story.mimic_house_walls");
        state.player.gameOverReason = "mimic";
        state.player.health = 0;
        gameOver();
      })
    ];
    if (state.player.flags.hasDwarvenAle || state.player.gear.includes("dwarven ale")) {
      options.push(choice(t("choice.pour_ale"), () => {
        removeItem("dwarven ale");
        writeKey("story.mimic_house_ale");
        setChoices([choice(t("choice.proceed_bridge"), goBridge)]);
      }));
    }
    setChoices(options);
  }

  function goBridge() {
    awardDecisionXp("bridge");
    continueChapter("bridge");
  }

  function bridge(clear = false) {
    let text = t("story.bridge");
    if (state.player.flags.hasThroneMap) {
      text += t("story.bridge_has_map");
    } else if (state.player.flags.hasPartialMap) {
      text += t("story.bridge_partial_map");
    } else {
      text += t("story.bridge_no_map");
    }
    text += t("story.bridge_temp_end");
    write(text, clear);
    recordEnding();
    saveGame();
    setChoices([
      choice(t("choice.main_menu"), showStart),
      choice(t("choice.save"), saveGame)
    ]);
  }

  function complete(clear = false) {
    writeKey("story.complete", {}, clear);
    recordEnding();
    saveGame();
    setChoices([
      choice(ui.submitScore, submitScore),
      choice(ui.leaderboard, showLeaderboard),
      choice(t("choice.main_menu"), showStart)
    ]);
  }

  function startCombat(enemyTypes, victoryKey, options = {}) {
    const enemies = enemyTypes.map((type, index) => {
      const base = monsterStats[type];
      return { ...base, type, id: index + 1, name: `${base.name} ${index + 1}`, hp: base.hp, maxHp: base.hp };
    });
    state.combat = {
      enemies,
      victoryKey,
      attackersPerRound: options.attackersPerRound || 1,
      onWin: options.onWin || null,
      onRun: options.onRun || null,
      deathReason: options.deathReason || "combat",
      guarding: false
    };
    writeKey("ui.initiate_combat");
    showCombatChoices();
  }

  function showCombatChoices() {
    if (!state.combat) {
      return;
    }
    const labels = [
      choice(t("choice.attack"), () => playerAttack(false)),
      choice(t("choice.heavy_attack"), () => playerAttack(true)),
      choice(t("choice.dodge"), dodge),
      choice(t("choice.run"), runCombat)
    ];
    if (state.player.gear.includes("health potion")) {
      labels.push(choice(t("choice.health_potion"), drinkPotion));
    }
    setChoices(labels);
  }

  function playerAttack(heavy) {
    const stats = combatStats();
    const target = state.combat.enemies.find((enemy) => enemy.hp > 0);
    if (!target) {
      combatVictory();
      return;
    }
    const attacks = heavy ? 1 : stats.attacks;
    const damageDie = heavy ? stats.damageDie + 4 : stats.damageDie;
    const attackBonus = heavy ? stats.attackBonus - 2 : stats.attackBonus;
    for (let i = 1; i <= attacks; i += 1) {
      const currentTarget = state.combat.enemies.find((enemy) => enemy.hp > 0);
      if (!currentTarget) {
        break;
      }
      const natural = d20();
      const total = natural + attackBonus;
      writeKey("story.combat_attack_roll", {
        attack_number: i,
        natural,
        bonus: attackBonus,
        total,
        enemy: currentTarget.name,
        ac: currentTarget.ac
      });
      if (natural === 1) {
        writeKey("story.combat_miss");
      } else if (natural === 20 || total >= currentTarget.ac) {
        let damage = rollDie(damageDie) + stats.damageBonus;
        if (natural === 20) {
          damage += rollDie(damageDie);
        }
        currentTarget.hp -= damage;
        writeKey("story.combat_hit", { enemy: currentTarget.name, damage });
        if (currentTarget.hp <= 0) {
          writeKey("story.combat_enemy_drops", { enemy: currentTarget.name });
        }
      } else {
        writeKey("story.combat_miss");
      }
    }
    if (state.combat.enemies.every((enemy) => enemy.hp <= 0)) {
      combatVictory();
      return;
    }
    enemyTurn();
    if (state.player.health <= 0) {
      state.player.gameOverReason = state.combat.deathReason;
      gameOver();
    } else {
      showCombatChoices();
    }
  }

  function dodge() {
    state.combat.guarding = true;
    writeKey("story.combat_dodge");
    enemyTurn();
    showCombatChoices();
  }

  function runCombat() {
    const roll = rollD20("sneak");
    if (roll >= 12) {
      writeKey("story.combat_run_success");
      const onRun = state.combat.onRun;
      state.combat = null;
      if (onRun) {
        onRun();
      } else {
        continueChapter("residential");
      }
    } else {
      writeKey("story.combat_run_fail");
      enemyTurn();
      showCombatChoices();
    }
  }

  function drinkPotion() {
    removeItem("health potion");
    const healing = rollDie(4) + rollDie(4) + 6;
    state.player.health = Math.min(state.player.maxHealth, state.player.health + healing);
    writeKey("story.combat_potion", { healing });
    enemyTurn();
    showCombatChoices();
  }

  function enemyTurn() {
    const playerAc = combatStats().ac + (state.combat.guarding ? 5 : 0);
    state.combat.enemies.filter((enemy) => enemy.hp > 0).slice(0, state.combat.attackersPerRound).forEach((enemy) => {
      const natural = d20(false);
      const total = natural + enemy.attackBonus;
      if (natural === 1) {
        writeKey("story.enemy_miss", { enemy: enemy.name, natural, total, ac: playerAc });
      } else if (natural === 20 || total >= playerAc) {
        let damage = rollDie(enemy.damageDie) + enemy.damageBonus;
        if (natural === 20) {
          damage += rollDie(enemy.damageDie);
        }
        state.player.health -= damage;
        writeKey("story.enemy_hit", { enemy: enemy.name, natural, total, ac: playerAc, damage });
      } else {
        writeKey("story.enemy_miss", { enemy: enemy.name, natural, total, ac: playerAc });
      }
    });
    state.combat.guarding = false;
  }

  function combatVictory() {
    const combat = state.combat;
    state.combat = null;
    writeKey(combat.victoryKey);
    ensureScoreState();
    state.player.score.fightsWon += 1;
    const xp = combat.enemies.reduce((total, enemy) => total + enemy.xp, 0);
    awardXp(xp, "combat");
    if (combat.onWin) {
      combat.onWin();
    }
  }

  function combatStats() {
    const base = classes[state.player.class];
    return {
      ac: base.ac + state.player.upgrades.ac,
      attackBonus: base.attackBonus,
      damageDie: base.damageDie,
      damageBonus: base.damageBonus + state.player.upgrades.damage,
      attacks: base.attacks
    };
  }

  function awardDecisionXp(reason) {
    if (state.player) {
      ensureScoreState();
      state.player.score.decisions += 1;
    }
    awardXp(decisionXp[reason] || 0, reason);
  }

  function awardXp(amount, reason) {
    if (!state.player || state.player.class === "dm" || amount <= 0) {
      return;
    }
    state.player.experience += amount;
    writeKey("story.xp_gain", { amount, reason: xpReasons[reason] || reason });
    while (state.player.experience >= state.player.xpToNext) {
      state.player.experience -= state.player.xpToNext;
      state.player.level += 1;
      state.player.xpToNext = BASE_XP_TO_NEXT + Math.max(0, state.player.level - BASE_LEVEL) * XP_PER_LEVEL;
      state.player.maxHealth += 2;
      state.player.health += 2;
      showLevelUpChoices();
      return;
    }
  }

  function showLevelUpChoices() {
    writeKey("story.level_up", { level: state.player.level });
    setChoices([
      choice(t("choice.level_hp"), () => {
        state.player.maxHealth += 5;
        state.player.health += 5;
        writeKey("story.level_hp");
        continueAfterLevel();
      }),
      choice(t("choice.level_ac"), () => {
        state.player.upgrades.ac += 1;
        writeKey("story.level_ac");
        continueAfterLevel();
      }),
      choice(t("choice.level_damage"), () => {
        state.player.upgrades.damage += 1;
        writeKey("story.level_damage");
        continueAfterLevel();
      }),
      choice(t("choice.level_heal"), () => {
        state.player.health = state.player.maxHealth;
        writeKey("story.level_heal");
        continueAfterLevel();
      })
    ]);
  }

  function continueAfterLevel() {
    if (state.combat) {
      showCombatChoices();
    } else {
      render();
    }
  }

  function rollD20(skill) {
    const natural = d20();
    const bonus = state.player && state.player.bonus === skill ? 2 : 0;
    const result = natural + bonus;
    writeKey("ui.roll", { result });
    return result;
  }

  function d20(track = true) {
    const roll = rollDie(20);
    if (track) {
      if (roll === 20) unlock("lucky");
      if (roll === 1) unlock("unlucky");
    }
    return roll;
  }

  function rollDie(sides) {
    return Math.floor(Math.random() * sides) + 1;
  }

  function addItem(item) {
    if (!state.player.gear.includes(item)) {
      state.player.gear.push(item);
    }
  }

  function removeItem(item) {
    const index = state.player.gear.indexOf(item);
    if (index >= 0) {
      state.player.gear.splice(index, 1);
    }
  }

  function unlock(id) {
    if (!state.stats._achievements[id]) {
      state.stats._achievements[id] = true;
      saveStats();
      writeKey("ui.achievement_unlocked", { name: achievements[id] || id, description: "" });
    }
  }

  function checkPlayedEveryone() {
    const playedAll = Object.keys(classes).every((key) => state.stats[key].runs > 0);
    if (playedAll) {
      unlock("played_everyone");
    }
  }

  function recordEnding() {
    if (state.player && !state.player.flags.completedRecorded) {
      state.stats[state.player.class].reached_end += 1;
      state.player.flags.completedRecorded = true;
      saveStats();
    }
  }

  function gameOver() {
    if (state.player && !state.player.flags.deathRecorded) {
      state.stats[state.player.class].died += 1;
      state.player.flags.deathRecorded = true;
      saveStats();
    }
    const reason = state.player ? state.player.gameOverReason : "default";
    write(`${t("story.game_over_header")}\n\n${t(`game_over.${reason}`)}\n\n${t("story.game_over_footer")}`, true);
    state.showGameOverImage = true;
    setChoices([
      choice(ui.submitScore, submitScore),
      choice(ui.leaderboard, showLeaderboard),
      choice(t("choice.new_game"), showCharacterSelect),
      choice(t("choice.main_menu"), showStart)
    ]);
  }

  async function showLeaderboard() {
    write(ui.leaderboardLoading, true);
    setChoices([choice(t("choice.main_menu"), showStart)]);
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${LEADERBOARD_TABLE}?select=player_name,character_name,score,ending_reached,fights_won,achievements_unlocked,created_at&order=score.desc&limit=25`, {
        headers: supabaseHeaders()
      });
      if (!response.ok) {
        throw new Error(`Leaderboard request failed: ${response.status}`);
      }
      const scores = await response.json();
      if (!scores.length) {
        write(`${ui.leaderboardHeader}\n\n${ui.leaderboardEmpty}`, true);
        return;
      }
      const lines = [ui.leaderboardHeader, ""];
      scores.forEach((score, index) => {
        lines.push(format(ui.leaderboardLine, {
          rank: index + 1,
          name: score.player_name,
          score: score.score,
          character: score.character_name
        }));
      });
      write(lines.join("\n"), true);
    } catch {
      write(`${ui.leaderboardHeader}\n\n${ui.leaderboardFailed}`, true);
    }
  }

  async function submitScore() {
    if (!state.player) {
      return;
    }
    ensureScoreState();
    if (state.player.score.submitted) {
      write(ui.scoreSubmitted);
      return;
    }
    const previousName = localStorage.getItem(`${storagePrefix}leaderboardName`) || state.player.name;
    const playerName = window.prompt(ui.playerNamePrompt, previousName);
    if (!playerName) {
      return;
    }
    const cleanName = playerName.trim().slice(0, 32);
    if (!cleanName) {
      return;
    }
    localStorage.setItem(`${storagePrefix}leaderboardName`, cleanName);
    const payload = leaderboardPayload(cleanName);
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${LEADERBOARD_TABLE}`, {
        method: "POST",
        headers: {
          ...supabaseHeaders(),
          "Content-Type": "application/json",
          Prefer: "return=minimal"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error(`Score submit failed: ${response.status}`);
      }
      state.player.score.submitted = true;
      saveGame();
      write(`${ui.scoreSubmitted}\n\n${cleanName}: ${payload.score}`);
      setChoices([
        choice(ui.leaderboard, showLeaderboard),
        choice(t("choice.main_menu"), showStart)
      ]);
    } catch {
      write(ui.scoreSubmitFailed);
    }
  }

  function leaderboardPayload(playerName) {
    ensureScoreState();
    const achievementsUnlocked = Object.keys(state.stats._achievements || {}).filter((key) => state.stats._achievements[key]).length;
    return {
      player_name: playerName,
      character_name: state.player.name,
      character_class: state.player.title,
      score: calculateScore(achievementsUnlocked),
      ending_reached: Boolean(state.player.flags.completedRecorded),
      fights_won: state.player.score.fightsWon,
      deaths: state.player.flags.deathRecorded ? 1 : 0,
      achievements_unlocked: achievementsUnlocked,
      forest_attempts: state.player.flags.forestAttempts || 0,
      route: scoreRoute(),
      language: lang
    };
  }

  function calculateScore(achievementsUnlocked) {
    const player = state.player;
    let score = 0;
    score += player.level * 100;
    score += player.experience;
    score += player.score.fightsWon * 75;
    score += player.score.decisions * 15;
    score += achievementsUnlocked * 50;
    score += player.gold * 5;
    score += player.supplies * 10;
    score += player.gear.length * 10;
    if (player.flags.completedRecorded) {
      score += 1000;
    }
    if (player.flags.hasDoll) {
      score += 100;
    }
    if (player.flags.hasMagistoneOrb) {
      score += 150;
    }
    if (player.flags.hasThroneMap) {
      score += 150;
    } else if (player.flags.hasPartialMap) {
      score += 75;
    }
    if (player.flags.deathRecorded) {
      score -= 200;
    }
    return Math.max(0, Math.round(score));
  }

  function scoreRoute() {
    if (!state.player) {
      return "unknown";
    }
    const flags = state.player.flags;
    const pieces = [state.player.chapter || "unknown"];
    if (flags.hasThroneMap) {
      pieces.push("full map");
    } else if (flags.hasPartialMap) {
      pieces.push("partial map");
    }
    if (flags.hasMagistoneOrb) {
      pieces.push("magistone orb");
    }
    if (flags.girlHelped) {
      pieces.push("ghost ally");
    }
    return pieces.join(" | ");
  }

  function supabaseHeaders() {
    return {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`
    };
  }

  function ensureScoreState() {
    if (!state.player.score) {
      state.player.score = {
        fightsWon: 0,
        decisions: 0,
        submitted: false,
        startedAt: Date.now()
      };
    }
  }

  function saveGame() {
    if (state.player) {
      localStorage.setItem(`${storagePrefix}${lang}.save`, JSON.stringify(state.player));
      writeKey("ui.game_saved");
    }
  }

  function loadGame() {
    const saved = localStorage.getItem(`${storagePrefix}${lang}.save`);
    if (!saved) {
      writeKey("ui.no_saved_game");
      return;
    }
    try {
      state.player = JSON.parse(saved);
      ensureScoreState();
      writeKey("ui.loaded_game", {}, true);
      continueChapter(state.player.chapter || "caravan");
    } catch {
      writeKey("ui.save_read_error");
    }
  }

  function defaultStats() {
    const stats = { _achievements: {} };
    Object.keys(classes).forEach((key) => {
      stats[key] = {
        name: classes[key].name,
        runs: 0,
        reached_end: 0,
        died: 0,
        forest_attempts: 0
      };
    });
    return stats;
  }

  function saveStats() {
    localStorage.setItem(`${storagePrefix}stats`, JSON.stringify(state.stats));
  }

  function loadJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(`${storagePrefix}${key}`)) || fallback;
    } catch {
      return fallback;
    }
  }

  function statusText() {
    if (!state.player) {
      return "";
    }
    return `${state.player.name} the ${state.player.title}   Health: ${state.player.health}/${state.player.maxHealth}   Gold: ${state.player.gold}   Supplies: ${state.player.supplies}   Gear: ${state.player.gear.join(", ") || t("ui.none")}`;
  }

  function sheetText() {
    if (!state.player) {
      return ui.noCharacter;
    }
    const stats = combatStats();
    return [
      `${ui.trait.padEnd(18)}${ui.value}`,
      "------------------------------",
      `${ui.name.padEnd(18)}${state.player.name}`,
      `${ui.race.padEnd(18)}${state.player.race}`,
      `${ui.className.padEnd(18)}${state.player.title}`,
      `${ui.level.padEnd(18)}${state.player.class === "dm" ? "DM" : state.player.level}`,
      `${ui.experience.padEnd(18)}${state.player.experience}/${state.player.xpToNext}`,
      `${ui.hp.padEnd(18)}${state.player.health}/${state.player.maxHealth}`,
      `${ui.ac.padEnd(18)}${stats.ac}`,
      `${ui.attackBonus.padEnd(18)}+${stats.attackBonus}`,
      `${ui.damage.padEnd(18)}d${stats.damageDie} + ${stats.damageBonus}`,
      "",
      ui.equipment,
      "------------------------------",
      state.player.gear.join("\n") || t("ui.none"),
      enemyHpText()
    ].join("\n");
  }

  function enemyHpText() {
    if (!state.combat) {
      return "";
    }
    const lines = [
      "",
      ui.enemyHp,
      "------------------------------"
    ];
    state.combat.enemies.forEach((enemy) => {
      lines.push(`${enemy.name.padEnd(16)}${Math.max(0, enemy.hp)}/${enemy.maxHp}`);
    });
    return lines.join("\n");
  }

  function plotText() {
    const lines = [t("ui.stats_heading")];
    Object.keys(classes).forEach((key) => {
      const stats = state.stats[key];
      lines.push(`${stats.name}: Runs ${stats.runs} | Endings ${stats.reached_end} | Deaths ${stats.died} | Forest attempts ${stats.forest_attempts}`);
    });
    const unlocked = Object.keys(achievements).filter((key) => state.stats._achievements[key]);
    lines.push("", t("ui.achievements_heading"), t("ui.achievements_progress", { unlocked: unlocked.length, total: Object.keys(achievements).length }));
    if (!unlocked.length) {
      lines.push(t("ui.no_achievements"));
    } else {
      unlocked.forEach((id) => lines.push(achievements[id]));
    }
    return lines.join("\n");
  }

  function choice(label, action) {
    return { label, action };
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
