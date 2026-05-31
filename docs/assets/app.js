(function () {
  "use strict";

  const VERSION = "0.9.12";
  const ASSET_BASE = document.body.dataset.assetBase || "../assets";
  const DATA_ASSET_BASE = document.body.dataset.dataAssetBase || ASSET_BASE;
  const BRIDGE_DIRECTIONS = ["left", "up", "right", "down"];
  const BASE_LEVEL = 5;
  const BASE_XP_TO_NEXT = 100;
  const XP_PER_LEVEL = 50;
  const CHEAT_STAT_VALUE = 999999;
  const CUSTOM_CHARACTER_SCHEMA_VERSION = "custom-character-v1";
  const CUSTOM_ATTRIBUTES = ["str", "dex", "con", "int", "wis", "cha"];
  const SUPABASE_URL = "https://fojkijwketpzxsbikmsl.supabase.co";
  const SUPABASE_KEY = "sb_publishable_pxMr-7kXAoQ9gz0mTTWLew_FAIRtAio";
  const CHANNEL_CONFIG = {
    live: {
      storagePrefix: "tov.web.",
      leaderboardTable: "leaderboard_scores",
      profileTable: "user_profiles",
      gameDataTable: "user_game_data",
      allowGuests: true,
      allowlistTable: "",
      reportLabel: "issue"
    }
  };
  const appConfig = CHANNEL_CONFIG.live;
  const LEADERBOARD_TABLE = appConfig.leaderboardTable;
  const PROFILE_TABLE = appConfig.profileTable;
  const GAME_DATA_TABLE = appConfig.gameDataTable;
  const DISCORD_URL = "https://discord.gg/9C4npSfNQd";
  const SUGGESTION_URL = "https://github.com/Redxjak/Tales-of-Visteria/issues/new?template=suggestion.yml";
  const ISSUE_URL = "https://github.com/Redxjak/Tales-of-Visteria/issues/new?template=issue.yml";
  const MUSIC_TRACKS = {
    epic: `${ASSET_BASE}/audio/fantasy_medieval_epic_music.mp3`,
    ambient: `${ASSET_BASE}/audio/fantasy_medieval_ambient.mp3`,
    mystery: `${ASSET_BASE}/audio/fantasy_medieval_mystery_ambient.mp3`,
    combat: `${ASSET_BASE}/audio/medieval_epic.mp3`
  };
  const MUSIC_VOLUMES = {
    normal: 0.36,
    low: 0.24,
    combat: 0.34
  };
  const NAME_MAX_LENGTH = 32;
  const PUBLIC_NAME_DENYLIST = [
    "nigger",
    "nigga",
    "fag",
    "faggot",
    "kike",
    "spic",
    "chink",
    "gook",
    "wetback",
    "tranny",
    "nazi",
    "hitler",
    "kkk"
  ];
  const GAME_OVER_IMAGES = {
    hydra: { file: "false_hydra.png", alt: "False hydra" },
    false_hydra: { file: "false_hydra.png", alt: "False hydra" },
    obliviarch: { file: "obliviarch.png", alt: "Obliviarch" },
    mask_corruption: { file: "obliviarch.png", alt: "Obliviarch" }
  };
  const CHAPTER_MUSIC = {
    dmIntro: "epic",
    dmGhost: "ambient",
    dmDistricts: "ambient",
    dmBridgeEnd: "ambient",
    dmOrcCamps: "mystery",
    caravan: "ambient",
    escape: "ambient",
    cave: "mystery",
    ghostGirl: "mystery",
    districts: "ambient",
    residential: "ambient",
    bridge: "mystery",
    warehouse: "mystery",
    bridgeEnd: "ambient",
    orcCamps: "mystery",
    complete: "ambient"
  };
  const MUSIC_CREDITS = [
    {
      title: "Fantasy Medieval Epic Music",
      artist: "DeusLower",
      source: "https://pixabay.com/music/main-title-fantasy-medieval-epic-music-239599/"
    },
    {
      title: "Fantasy Medieval Ambient",
      artist: "DeusLower",
      source: "https://pixabay.com/music/folk-fantasy-medieval-ambient-237371/"
    },
    {
      title: "Fantasy Medieval Mystery Ambient",
      artist: "DeusLower",
      source: "https://pixabay.com/music/mystery-fantasy-medieval-mystery-ambient-292418/"
    },
    {
      title: "Medieval Epic",
      artist: "SoundGalleryBy",
      source: "https://pixabay.com/music/main-title-medieval-epic-117935/"
    }
  ];
  const PIXABAY_LICENSE_URL = "https://pixabay.com/service/license-summary/";
  const lang = document.body.dataset.language || "en";
  const storagePrefix = appConfig.storagePrefix;
  const uiTextByLanguage = {
    en: {
      english: "English",
      spanish: "Español",
      language: "Language",
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
      attackBonus: "Attack Chance Bonus",
      damage: "Damage",
      equipment: "Equipment",
      enemyHp: "Enemy HP",
      leaderboard: "Leaderboard",
      submitScore: "Submit Score",
      playerNamePrompt: "Name for the leaderboard:",
      scoreSubmitted: "Score submitted.",
      scoreSubmitFailed: "Could not submit score. Please try again later",
      deathScorePrompt: "You have died. Click here to see your scores",
      leaderboardLoading: "Loading leaderboard...",
      leaderboardEmpty: "No scores yet.",
      leaderboardFailed: "Could not load leaderboard.",
      leaderboardHeader: "Leaderboard",
      leaderboardWarning: "Warning: leaderboards will be reset with the release of version 1.0. A special mention will be made for the top three players at that time. Max possible score in the current live version: 6,600.",
      leaderboardLine: "{rank}. {name} - {score} ({character})",
      promptCancel: "Cancel",
      promptContinue: "Continue",
      promptConfirm: "Confirm",
      submitScoreWarning: "Submitting your score leaves the current run screen. Use Load Game afterward to restore this saved session.",
      loginScreen: "Sign in, create an account, or play as a guest",
      displayNamePrompt: "Choose a public username:",
      emailPrompt: "Email address:",
      passwordPrompt: "Password:",
      loginPrompt: "Email address:",
      login: "Sign In",
      googleLogin: "Sign in with Google",
      createAccount: "Create Account",
      logout: "Logout",
      playAsGuest: "Play as Guest",
      guest: "Guest",
      accountCreated: "Account created. If Supabase asks for email confirmation, check your email before signing in.",
      loginFailed: "Sign in failed. Check your email and password. Request a password reset through a Discord ticket:",
      signupFailed: "Account creation failed. The email may already be used, or Supabase may require a stronger password.",
      logoutDone: "Signed out.",
      cloudLoaded: "Cloud save loaded.",
      cloudSaved: "Cloud save updated.",
      accountLabel: "Player: {name}",
      accountMenu: "Account menu",
      info: "Info",
      achievementsLabel: "Achievements",
      faq: "FAQ",
      closeFaq: "Close FAQ",
      credits: "Credits",
      closeCredits: "Close Credits",
      discord: "Discord",
      suggest: "Suggest",
      reportIssue: "Report Issue",
      cheatCodes: "Cheat Codes",
      log: "Log",
      closeLog: "Close",
      emptyLog: "No story log yet.",
      moveOn: "Move on",
      musicOn: "Music: On",
      musicOff: "Music: Off",
      musicVolume: "Music volume",
      nameLimit: "{count}/{max} characters",
      nameRequired: "Enter a name.",
      nameTooLong: "Names must be {max} characters or fewer.",
      nameBlocked: "Choose a different public name."
    },
    es: {
      english: "English",
      spanish: "Español",
      language: "Idioma",
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
      attackBonus: "Bonif. prob. ataque",
      damage: "Daño",
      equipment: "Equipo",
      enemyHp: "PV enemigos",
      leaderboard: "Clasificación",
      submitScore: "Enviar puntaje",
      playerNamePrompt: "Nombre para la clasificación:",
      scoreSubmitted: "Puntaje enviado.",
      scoreSubmitFailed: "No se pudo enviar el puntaje. Tal vez falte crear la tabla de clasificación.",
      deathScorePrompt: "Has muerto. Haz clic aqui para ver tus puntajes",
      leaderboardLoading: "Cargando clasificación...",
      leaderboardEmpty: "Todavía no hay puntajes.",
      leaderboardFailed: "No se pudo cargar la clasificación.",
      leaderboardHeader: "Clasificación",
      leaderboardWarning: "Aviso: la clasificación se reiniciará con el lanzamiento de la versión 1.0. Se hará una mención especial para los tres mejores jugadores en ese momento. Puntaje máximo posible en la versión en vivo actual: 6,600.",
      leaderboardLine: "{rank}. {name} - {score} ({character})",
      promptCancel: "Cancelar",
      promptContinue: "Continuar",
      promptConfirm: "Confirmar",
      submitScoreWarning: "Enviar tu puntaje te saca de la pantalla de la partida actual. Usa Cargar partida despues para restaurar esta sesion guardada.",
      loginScreen: "Inicia sesion, crea una cuenta o juega como invitado",
      displayNamePrompt: "Elige un nombre publico:",
      emailPrompt: "Correo electronico:",
      passwordPrompt: "Contrasena:",
      loginPrompt: "Correo electronico:",
      login: "Iniciar sesion",
      googleLogin: "Iniciar sesion con Google",
      createAccount: "Crear cuenta",
      logout: "Cerrar sesion",
      playAsGuest: "Jugar como invitado",
      guest: "Invitado",
      accountCreated: "Cuenta creada. Si Supabase pide confirmacion por correo, revisa tu correo antes de iniciar sesion.",
      loginFailed: "No se pudo iniciar sesion. Revisa tu correo y contrasena. Solicita un restablecimiento de contrasena con un ticket de Discord:",
      signupFailed: "No se pudo crear la cuenta. Puede que el correo ya exista o que la contrasena sea debil.",
      logoutDone: "Sesion cerrada.",
      cloudLoaded: "Guardado en la nube cargado.",
      cloudSaved: "Guardado en la nube actualizado.",
      accountLabel: "Jugador: {name}",
      accountMenu: "Menu de cuenta",
      info: "Info",
      achievementsLabel: "Logros",
      faq: "FAQ",
      closeFaq: "Cerrar FAQ",
      credits: "Creditos",
      closeCredits: "Cerrar creditos",
      discord: "Discord",
      suggest: "Sugerir",
      reportIssue: "Reportar problema",
      cheatCodes: "Codigos de trampa",
      log: "Registro",
      closeLog: "Cerrar",
      emptyLog: "Todavia no hay registro.",
      moveOn: "Continuar",
      musicOn: "Musica: Si",
      musicOff: "Musica: No",
      musicVolume: "Volumen de musica",
      nameLimit: "{count}/{max} caracteres",
      nameRequired: "Escribe un nombre.",
      nameTooLong: "Los nombres deben tener {max} caracteres o menos.",
      nameBlocked: "Elige otro nombre publico."
    }
  };
  const ui = uiTextByLanguage[lang] || uiTextByLanguage.en;
  const fallbackText = {
    "choice.fight_bridge_orcs": "Fight the Orcs",
    "choice.sneak_bridge": "Sneak Across the Bridge",
    "choice3.sneak_bridge": "Sneak Across the Bridge",
    "story.level_up_title": "Level up!",
    "story.level_up_body": "+4 Health\nChoose your level up reward.",
    "story.level_up_body_mana": "+4 Health, +4 Mana\nChoose your level up reward.",
    "choice.level_mana": "Gain Mana",
    "choice.level_attribute": "Gain Attribute",
    "story.cheat_prompt": "Enter a cheat code.",
    "story.cheat_unknown": "That cheat code does nothing.",
    "story.cheat_enabled": "Cheat enabled: {cheat}.",
    "story.level_mana": "Your maximum mana increases by another 4, and power returns to you.",
    "story.level_attribute": "{attribute} increases to {value}.",
    "story.level_attribute_unavailable": "Only custom characters can increase attributes."
  };

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
      description: "A Goliath Barbarian with a greataxe, Rage, and Reckless Attack pressure."
    },
    ranger: {
      name: "Ren",
      title: "Ranger",
      race: "Elf",
      maxHealth: 46,
      gold: 8,
      supplies: 3,
      gear: ["longbow", "short blade"],
      bonus: "sneak",
      ac: 15,
      attackBonus: 7,
      damageDie: 8,
      damageBonus: 4,
      attacks: 2,
      description: "An Elven Ranger with longbow attacks and sharp ranged accuracy."
    },
    scholar: {
      name: "Cal",
      title: "Warlock",
      race: "Human",
      maxHealth: 44,
      gold: 10,
      supplies: 2,
      gear: ["old journal", "silver charm", "eldritch focus"],
      bonus: "persuasion",
      ac: 15,
      attackBonus: 7,
      damageDie: 10,
      damageBonus: 4,
      attacks: 2,
      description: "A Human Warlock with Eldritch Blast, an eldritch focus, and persuasion."
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
      description: "A Dwarven Fighter with battleaxe attacks, armor, and Second Wind stamina."
    },
    dm: {
      name: "Jon",
      title: "DM",
      race: "God",
      maxHealth: 420,
      gold: 0,
      supplies: 0,
      gear: ["DM screen", "loaded d20"],
      bonus: "fate",
      ac: 69,
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
        description: "Un Barbaro goliat con gran hacha, Furia y presion de Ataque Temerario."
      },
      ranger: {
        title: "Explorador",
        race: "Elfo",
        description: "Un Explorador elfico con ataques de arco largo y gran precision a distancia."
      },
      scholar: {
        title: "Brujo",
        race: "Humano",
        description: "Un Brujo humano con Eldritch Blast, foco eldritch y buena persuasion."
      },
      dwarf: {
        title: "Guerrero",
        race: "Enano",
        description: "Un Guerrero enano con ataques de hacha de batalla, armadura y Segundo Aliento."
      },
      dm: {
        title: "DM",
        race: "Dios",
        description: "Un Dios adicto a la nicotina que controla la historia desde arriba."
      }
    }
  };
  Object.entries(classTranslations[lang] || {}).forEach(([key, values]) => Object.assign(classes[key], values));

  const betaClassBuilds = {
    warrior: {
      title: "Barbarian",
      priority: ["str", "con", "dex", "wis", "cha", "int"],
      maxHealth: 46,
      acBase: 12,
      attackStat: "str",
      damageStat: "str",
      manaBase: 6,
      attacks: 2,
      bonus: "combat",
      gear: ["travel cloak"],
      abilities: ["rage"],
      description: "STR/CON bruiser with Rage and Reckless Attack pressure."
    },
    ranger: {
      title: "Ranger",
      priority: ["dex", "wis", "con", "str", "int", "cha"],
      maxHealth: 40,
      acBase: 13,
      attackStat: "dex",
      damageStat: "dex",
      manaBase: 7,
      attacks: 2,
      bonus: "sneak",
      gear: ["travel cloak"],
      abilities: ["hunters_mark"],
      description: "DEX/WIS striker with Longbow attacks and Hunter's Mark."
    },
    scholar: {
      title: "Warlock",
      priority: ["cha", "con", "dex", "wis", "int", "str"],
      maxHealth: 36,
      acBase: 12,
      attackStat: "cha",
      damageStat: "cha",
      manaBase: 12,
      attacks: 1,
      bonus: "persuasion",
      gear: ["old journal"],
      abilities: ["eldritch_bolt", "drain_life"],
      description: "CHA caster with Eldritch Blast and life-draining magic."
    },
    dwarf: {
      title: "Fighter",
      priority: ["str", "con", "dex", "wis", "int", "cha"],
      maxHealth: 44,
      acBase: 14,
      attackStat: "str",
      damageStat: "str",
      manaBase: 8,
      attacks: 2,
      bonus: "lore",
      gear: ["stone token"],
      abilities: ["second_wind"],
      description: "Weapon master with Battleaxe attacks, maneuvers, and Second Wind."
    }
  };

  const betaRaces = {
    goliath: {
      name: "Goliath",
      image: "race_goliath.png",
      bonuses: { str: 2, con: 1 },
      maxHealth: 4,
      ability: "stone_endurance",
      description: "+2 STR, +1 CON, +4 HP, Stone's Endurance."
    },
    elf: {
      name: "Elf",
      image: "race_elf.png",
      bonuses: { dex: 2, wis: 1 },
      attackBonus: 1,
      ability: "elven_focus",
      description: "+2 DEX, +1 WIS, +1 attack chance, Elven Accuracy."
    },
    human: {
      name: "Human",
      image: "race_human.png",
      bonuses: { str: 1, dex: 1, con: 1, int: 1, wis: 1, cha: 1 },
      mana: 2,
      ability: "human_resolve",
      description: "+1 to every stat, +2 mana, Resourceful."
    },
    dwarf: {
      name: "Dwarf",
      image: "race_dwarf.png",
      bonuses: { con: 2, str: 1 },
      ac: 1,
      ability: "dwarven_guard",
      description: "+2 CON, +1 STR, +1 AC, Dwarven Toughness."
    }
  };

  const betaWeapons = {
    greataxe: {
      name: "Greataxe",
      damageDie: 12,
      damageBonus: 1,
      attackBonus: -1,
      attacks: 0,
      skill: "cleave",
      description: "d12 damage, -1 attack chance, +1 damage, grants Cleave."
    },
    longbow: {
      name: "Longbow",
      damageDie: 8,
      damageBonus: 0,
      attackBonus: 1,
      attacks: 1,
      skill: "pinning_shot",
      description: "d8 damage, +1 attack chance, +1 attack speed, grants Ensnaring Strike."
    },
    battleaxe: {
      name: "Battleaxe and Shield",
      damageDie: 8,
      damageBonus: 0,
      attackBonus: 0,
      ac: 1,
      attacks: 0,
      skill: "shield_bash",
      description: "d8 damage, +1 AC, grants Shield Master Shove."
    },
    eldritch_focus: {
      name: "Eldritch Focus",
      damageDie: 10,
      damageBonus: 1,
      attackBonus: 0,
      attacks: 0,
      skill: "hex_bolt",
      attackStat: "cha",
      damageStat: "cha",
      description: "d10 spell damage, +1 damage, uses CHA, grants Hex."
    }
  };

  const defaultRaceKeyByClass = {
    warrior: "goliath",
    ranger: "elf",
    scholar: "human",
    dwarf: "dwarf"
  };

  const defaultWeaponKeyByClass = {
    warrior: "greataxe",
    ranger: "longbow",
    scholar: "eldritch_focus",
    dwarf: "battleaxe"
  };

  const betaPowers = {
    rage: { name: "Rage", cost: 3, type: "buff", turns: 3, text: "You enter a barbarian rage. For three turns, your attacks deal +2 damage." },
    hunters_mark: { name: "Hunter's Mark", cost: 4, type: "attack", attackBonus: 2, damageBonus: 3, text: "You mark your prey and strike the weakest opening." },
    eldritch_bolt: { name: "Witch Bolt", cost: 3, type: "spell", damageDie: 12, attackBonus: 1, damageBonus: 2, text: "A crackling beam lashes from your focus." },
    drain_life: { name: "Vampiric Touch", cost: 5, type: "spell", damageDie: 8, attackBonus: 0, damageBonus: 1, healHalf: true, text: "Necrotic power tears warmth from the enemy and drags it back into you." },
    second_wind: { name: "Second Wind", cost: 4, type: "heal", healDie: 8, healBonus: 8, text: "You draw on a fighter's reserve and pull yourself back together." },
    stone_endurance: { name: "Stone's Endurance", cost: 3, type: "guard", acBonus: 4, text: "Stone-hard resilience carries you through the enemy turn." },
    elven_focus: { name: "Elven Accuracy", cost: 2, type: "attack", attackBonus: 3, damageBonus: 0, text: "You focus with impossible elven precision." },
    human_resolve: { name: "Resourceful", cost: 2, type: "restore", manaRestore: 4, text: "You steady yourself and find one more reserve of power." },
    dwarven_guard: { name: "Dwarven Toughness", cost: 2, type: "guard", acBonus: 3, text: "You plant your feet and endure like stone." },
    cleave: { name: "Cleave", cost: 3, type: "cleave", attackBonus: -1, damageBonus: 2, text: "You swing wide, trying to carry the blow into a second foe." },
    pinning_shot: { name: "Ensnaring Strike", cost: 4, type: "attack", attackBonus: 2, damageBonus: 1, guard: true, text: "Vines of conjured force snare the enemy and buy you space." },
    shield_bash: { name: "Shield Master Shove", cost: 2, type: "attack", damageDie: 6, attackBonus: 1, damageBonus: 1, guard: true, text: "You drive forward behind the shield and break their footing." },
    hex_bolt: { name: "Hex", cost: 3, type: "spell", damageDie: 10, attackBonus: 1, damageBonus: 3, text: "You curse the target and feed the spell through your blast." }
  };

  const betaAttributeHelp = {
    str: "Strength affects melee attack chance and melee damage.",
    dex: "Dexterity affects AC, ranged attack chance, and ranged damage.",
    con: "Constitution adds maximum health at character creation.",
    int: "Intelligence is a knowledge stat for later beta features.",
    wis: "Wisdom supports awareness, survival, and ranger-style choices.",
    cha: "Charisma affects warlock spell attacks, spell damage, and social pressure."
  };

  const betaClassCombatLabels = {
    warrior: { attack: "Greataxe Attack", heavy: "Reckless Attack" },
    ranger: { attack: "Longbow Attack", heavy: "Sharpshooter Shot" },
    scholar: { attack: "Eldritch Blast", heavy: "Agonizing Blast" },
    dwarf: { attack: "Battleaxe Attack", heavy: "Menacing Attack" }
  };

  const monsterStats = {
    goblin: { name: "Goblin", ac: 15, hp: 7, attackBonus: 4, damageDie: 6, damageBonus: 2, xp: 20 },
    orc: { name: "Orc", ac: 13, hp: 15, attackBonus: 5, damageDie: 12, damageBonus: 3, xp: 35 },
    gremlin: { name: "Gremlin", ac: 13, hp: 10, attackBonus: 4, damageDie: 6, damageBonus: 1, xp: 20 },
    ghoul: { name: "Ghoul", ac: 12, hp: 18, attackBonus: 4, damageDie: 6, damageBonus: 2, xp: 25 },
    mimic: { name: "Mimic", ac: 12, hp: 35, attackBonus: 5, damageDie: 8, damageBonus: 3, xp: 45 },
    cultist: { name: "Masked Cultist", ac: 13, hp: 12, attackBonus: 4, damageDie: 6, damageBonus: 2, xp: 25 },
    ritualLeader: { name: "Cultist Leader", ac: 15, hp: 42, attackBonus: 7, damageDie: 10, damageBonus: 4, xp: 90 },
    falseHydra: { name: "False Hydra", ac: 19, hp: 350, attackBonus: 14, damageDie: 10, damageBonus: 8, xp: 155000 },
    obliviarchPhaseOne: { name: "Obliviarch", ac: 17, hp: 140, attackBonus: 9, damageDie: 10, damageBonus: 6, xp: 175 },
    obliviarchPhaseTwo: { name: "Wounded Obliviarch", ac: 16, hp: 95, attackBonus: 7, damageDie: 8, damageBonus: 5, xp: 250 }
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
      played_everyone: "Full Party",
      mask_on: "I'm feeling good!",
      bridge_cleared: "Bridge Burner",
      warehouse_survived: "Was it a dream?",
      high_ac: "Can't touch this",
      big_damage: "Unlimited powa",
      maxed_out: "Maxed out",
      all_day: "I can do this all day",
      map_goblin: "Map Goblin",
      wrong_turn_right_lesson: "Wrong Turn, Right Lesson",
      haunted_carry_on: "Haunted Carry-On",
      this_is_mine_now: "This Is Mine Now",
      mimic_survivor: "Mimic Survivor",
      false_confidence: "False Confidence",
      obliviarch_revealed: "Hydra? I Hardly Know Ya",
      crownbreaker: "Crownbreaker",
      cartographers_nightmare: "Cartographer's Nightmare",
      mercy_has_luggage: "Mercy Has Luggage",
      ale_chemistry: "Ale Chemistry",
      clean_getaway: "Clean Getaway",
      overprepared: "Overprepared",
      cheater: "Cheater",
      bad_idea_connoisseur: "Bad Idea Connoisseur",
      union_violation: "Union Violation",
      aggressively_educational: "Aggressively Educational",
      free_wazetax: "Free Wazetax",
      no_one_left_in_cage: "No One Gets Left in a Cage",
      not_my_problem: "Not My Problem",
      bridge_scholar: "Bridge Scholar",
      blind_crossing: "Blind Crossing",
      cult_breaker: "Cult Breaker",
      customer_service: "Customer Service",
      osha_incident: "OSHA Incident"
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
      played_everyone: "Grupo completo",
      mask_on: "¡Me siento bien!",
      warehouse_survived: "¿Fue un sueño?",
      bridge_cleared: "Puente superado",
      high_ac: "No puedes tocar esto",
      big_damage: "Powa ilimitado",
      maxed_out: "Al máximo",
      all_day: "Puedo hacer esto todo el día",
      map_goblin: "Goblin de mapas",
      wrong_turn_right_lesson: "Giro equivocado, lección correcta",
      haunted_carry_on: "Equipaje encantado",
      this_is_mine_now: "Esto ahora es mío",
      mimic_survivor: "Superviviente del mimic",
      false_confidence: "Falsa confianza",
      obliviarch_revealed: "¿Hydra? Apenas la conozco",
      crownbreaker: "Rompecoronas",
      cartographers_nightmare: "Pesadilla de cartógrafo",
      mercy_has_luggage: "La misericordia trae equipaje",
      ale_chemistry: "Química de cerveza",
      clean_getaway: "Escape limpio",
      overprepared: "Sobrepreparado",
      cheater: "Tramposo",
      bad_idea_connoisseur: "Conocedor de malas ideas",
      union_violation: "Violación sindical",
      aggressively_educational: "Agresivamente educativo",
      free_wazetax: "Liberen a Wazetax",
      no_one_left_in_cage: "Nadie queda en una jaula",
      not_my_problem: "No es mi problema",
      bridge_scholar: "Erudito del puente",
      blind_crossing: "Cruce a ciegas",
      cult_breaker: "Rompecultos",
      customer_service: "Servicio al cliente",
      osha_incident: "Incidente laboral"
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
    logParts: [],
    logVisible: false,
    faqVisible: false,
    creditsVisible: false,
    showGameOverImage: false,
    gameOverImage: null,
    awaitingLevelReward: false,
    levelRewardChoices: [],
    pendingChoices: null,
    pendingLevelContinuation: null,
    promptDialog: null,
    currentStatusReturn: null,
    activeMobilePanel: null,
    oauthLoginFailed: false,
    account: loadAccount(),
    leaderboard: [],
    music: {
      audio: null,
      enabled: loadMusicEnabled(),
      current: "silence",
      volume: MUSIC_VOLUMES.normal,
      userVolume: loadMusicVolume()
    },
    notice: "",
    noticeTimer: null,
    choices: []
  };

  const app = document.getElementById("app");

  init();

  async function init() {
    try {
      const response = await fetch(`${DATA_ASSET_BASE}/data/${lang}.json`);
      state.text = await response.json();
    } catch {
      const fallback = await fetch(`${DATA_ASSET_BASE}/data/en.json`);
      state.text = await fallback.json();
    }
    await handleOAuthRedirect();
    if (state.account && !state.account.guest) {
      await refreshAccountSession();
      await loadCloudData();
    }
    drawShell();
    bindFirstGestureAudio();
    if (state.account && canEnterGame()) {
      showStart();
    } else {
      showLoginScreen();
      if (state.oauthLoginFailed) {
        writeLoginFailed();
      }
    }
  }

  function drawShell() {
    app.innerHTML = `
      <header class="topbar">
        <div class="title-row">
          <img class="game-logo" src="${ASSET_BASE}/tales-of-visteria-logo.png" alt="Tales of Visteria">
          <span class="version">v${VERSION}</span>
        </div>
        <div class="meta-row">
          <details id="account-menu" class="account-menu">
            <summary aria-label="${ui.accountMenu}"><span id="account-status"></span></summary>
            <div class="account-menu-panel">
              <div class="account-language-group">
                <p>${ui.language}</p>
                <div class="account-language-options">
                  <a class="account-language-link" href="../en/">${ui.english}</a>
                  <a class="account-language-link" href="../es/">${ui.spanish}</a>
                </div>
              </div>
              <button id="menu-save" type="button">${t("choice.save")}</button>
              <button id="menu-load" type="button">${t("choice.load_game")}</button>
              <button id="menu-leaderboard" type="button">${ui.leaderboard}</button>
              <button id="menu-faq" type="button">${ui.faq}</button>
              <button id="menu-credits" type="button">${ui.credits}</button>
              <button id="menu-cheats" type="button">${ui.cheatCodes}</button>
              <button id="menu-discord" type="button">${ui.discord}</button>
              <button id="menu-suggest" type="button">${ui.suggest}</button>
              <button id="menu-issue" type="button">${ui.reportIssue}</button>
              <button id="menu-logout" type="button">${ui.logout}</button>
            </div>
          </details>
          <button id="music-button" class="utility-button music-button" type="button"></button>
          <label class="music-volume-control" for="music-volume">
            <span>${ui.musicVolume}</span>
            <input id="music-volume" type="range" min="0" max="100" step="1">
          </label>
          <button id="log-button" class="utility-button" type="button">${ui.log}</button>
          <details id="info-menu" class="mobile-info-menu">
            <summary>${ui.info}</summary>
            <div class="mobile-info-menu-panel">
              <button type="button" data-mobile-panel="character">${ui.characterSheet}</button>
              <button type="button" data-mobile-panel="plot">${ui.plotDevelopment}</button>
            </div>
          </details>
        </div>
        <div id="status" class="status"></div>
        <div id="notice" class="notice" hidden></div>
      </header>
      <section class="layout">
        <aside class="side-panel player-panel" data-mobile-panel-name="character">
          <h2 class="panel-title">${ui.characterSheet}</h2>
          <div id="sheet" class="sheet"></div>
        </aside>
        <section class="story-panel">
          <div id="story" class="story"></div>
        </section>
        <aside class="side-panel plot-panel" data-mobile-panel-name="plot">
          <h2 class="panel-title">${ui.plotDevelopment}</h2>
          <div id="plot" class="plot"></div>
        </aside>
      </section>
      <section id="log-panel" class="embedded-log" hidden>
        <div class="log-header">
          <h2 id="log-title">${ui.log}</h2>
          <button id="close-log" class="utility-button" type="button">${ui.closeLog}</button>
        </div>
        <div id="log-content" class="log-content"></div>
      </section>
      <section id="faq-panel" class="faq-panel" hidden>
        <div class="log-header">
          <h2>${ui.faq}</h2>
          <button id="close-faq" class="utility-button" type="button">${ui.closeFaq}</button>
        </div>
        <div id="faq-content" class="faq-content"></div>
      </section>
      <section id="credits-panel" class="faq-panel credits-panel" hidden>
        <div class="log-header">
          <h2>${ui.credits}</h2>
          <button id="close-credits" class="utility-button" type="button">${ui.closeCredits}</button>
        </div>
        <div id="credits-content" class="faq-content"></div>
      </section>
      <nav id="choices" class="choices"></nav>
      <section id="level-modal" class="modal-overlay" hidden>
        <div class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="level-modal-title">
          <h2 id="level-modal-title"></h2>
          <p id="level-modal-body"></p>
          <div id="level-modal-choices" class="modal-choices"></div>
        </div>
      </section>
      <section id="prompt-modal" class="modal-overlay" hidden>
        <form id="prompt-form" class="modal-panel" role="dialog" aria-modal="true" aria-labelledby="prompt-modal-title">
          <h2 id="prompt-modal-title"></h2>
          <p id="prompt-modal-body"></p>
          <input id="prompt-modal-input" class="modal-input" autocomplete="off">
          <div id="prompt-modal-helper" class="modal-helper"></div>
          <div id="prompt-modal-error" class="modal-error" role="alert"></div>
          <div class="modal-choices">
            <button id="prompt-modal-submit" class="choice" type="submit"></button>
            <button id="prompt-modal-cancel" class="choice choice-secondary" type="button"></button>
          </div>
        </form>
      </section>
    `;
  }

  function t(key, vars = {}) {
    let value = state.text[key] || fallbackText[key] || key;
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
      state.gameOverImage = null;
    }
    const escapedText = escapeHtml(text);
    if (state.storyParts.length) {
      state.storyParts.push("<hr>");
    }
    state.storyParts.push(escapedText);
    if (state.logParts.length) {
      state.logParts.push("<hr>");
    }
    state.logParts.push(escapedText);
    render();
  }

  function writeHtml(html, clear = false) {
    if (clear) {
      state.storyParts = [];
      state.showGameOverImage = false;
      state.gameOverImage = null;
    }
    if (state.storyParts.length) {
      state.storyParts.push("<hr>");
    }
    state.storyParts.push(html);
    if (state.logParts.length) {
      state.logParts.push("<hr>");
    }
    state.logParts.push(html);
    render();
  }

  function writeLoginFailed() {
    const discordLink = `<a href="${escapeHtml(DISCORD_URL)}" target="_blank" rel="noopener noreferrer">${escapeHtml(ui.discord)}</a>`;
    writeHtml(`${escapeHtml(ui.loginFailed)} ${discordLink}`);
  }

  function writeKey(key, vars = {}, clear = false) {
    write(t(key, vars), clear);
  }

  function setChoices(choices, force = false) {
    if (state.awaitingLevelReward && !force) {
      state.pendingChoices = choices;
      render();
      return;
    }
    state.choices = choices;
    render();
  }

  function render() {
    if (state.player) {
      ensurePlayerState();
      applyCheatSustain();
    }
    document.getElementById("story").innerHTML = state.storyParts.join("");
    if (state.showGameOverImage) {
      const gameOverImage = state.gameOverImage || { file: "game_over_party.png", alt: "Tales of Visteria party" };
      const img = document.createElement("img");
      img.className = "game-over-image";
      img.alt = gameOverImage.alt;
      img.src = `${ASSET_BASE}/${gameOverImage.file}`;
      document.getElementById("story").appendChild(img);
    }
    document.getElementById("status").textContent = statusText();
    const notice = document.getElementById("notice");
    if (notice) {
      notice.textContent = state.notice;
      notice.hidden = !state.notice;
    }
    document.getElementById("account-status").textContent = accountStatusText();
    bindAccountMenu();
    document.getElementById("sheet").innerHTML = sheetText();
    document.getElementById("plot").textContent = plotText();
    document.getElementById("log-content").innerHTML = state.logParts.length ? state.logParts.join("") : escapeHtml(ui.emptyLog);
    syncMusicButton();
    document.getElementById("log-button").onclick = toggleLog;
    bindMobilePanels();
    document.getElementById("close-log").onclick = hideLog;
    document.getElementById("log-panel").hidden = !state.logVisible;
    document.getElementById("faq-content").innerHTML = faqHtml();
    document.getElementById("close-faq").onclick = hideFaq;
    document.getElementById("faq-panel").hidden = !state.faqVisible;
    document.getElementById("credits-content").innerHTML = creditsHtml();
    document.getElementById("close-credits").onclick = hideCredits;
    document.getElementById("credits-panel").hidden = !state.creditsVisible;
    renderLevelModal();
    renderPromptModal();
    const choiceArea = document.getElementById("choices");
    choiceArea.innerHTML = "";
    state.choices.forEach((choice) => {
      const button = document.createElement("button");
      button.className = "choice";
      button.type = "button";
      button.textContent = choice.label;
      if (choice.detail) {
        button.title = choice.detail;
        button.setAttribute("aria-label", `${choice.label}. ${choice.detail}`);
      }
      button.addEventListener("click", () => {
        if (state.combat && state.player && state.player.health <= 0) {
          finishCombatDeath();
          return;
        }
        if (!choice.preserveScene) {
          beginVisibleScene();
        }
        choice.action();
      });
      choiceArea.appendChild(button);
    });
  }

  function renderLevelModal() {
    const modal = document.getElementById("level-modal");
    if (!modal) {
      return;
    }
    modal.hidden = !state.awaitingLevelReward;
    if (!state.awaitingLevelReward) {
      return;
    }
    document.getElementById("level-modal-title").textContent = t("story.level_up_title", { level: state.player.level });
    document.getElementById("level-modal-body").textContent = t(hasManaAbilities() ? "story.level_up_body_mana" : "story.level_up_body");
    const choiceArea = document.getElementById("level-modal-choices");
    choiceArea.innerHTML = "";
    state.levelRewardChoices.forEach((levelChoice) => {
      const button = document.createElement("button");
      button.className = "choice";
      button.type = "button";
      button.textContent = levelChoice.label;
      if (levelChoice.detail) {
        button.title = levelChoice.detail;
        button.setAttribute("aria-label", `${levelChoice.label}. ${levelChoice.detail}`);
      }
      button.addEventListener("click", levelChoice.action);
      choiceArea.appendChild(button);
    });
  }

  function renderPromptModal() {
    const modal = document.getElementById("prompt-modal");
    if (!modal) {
      return;
    }
    const dialog = state.promptDialog;
    modal.hidden = !dialog;
    if (!dialog) {
      return;
    }
    const form = document.getElementById("prompt-form");
    const input = document.getElementById("prompt-modal-input");
    const helper = document.getElementById("prompt-modal-helper");
    const error = document.getElementById("prompt-modal-error");
    document.getElementById("prompt-modal-title").textContent = dialog.title;
    document.getElementById("prompt-modal-body").textContent = dialog.body || "";
    document.getElementById("prompt-modal-submit").textContent = dialog.confirmLabel || ui.promptContinue;
    document.getElementById("prompt-modal-cancel").textContent = dialog.cancelLabel || ui.promptCancel;
    input.hidden = !dialog.input;
    input.type = dialog.password ? "password" : "text";
    input.value = dialog.value || "";
    input.placeholder = dialog.placeholder || "";
    input.maxLength = dialog.maxLength || 524288;
    if (helper) {
      helper.hidden = !dialog.input || !dialog.maxLength;
      helper.textContent = dialog.maxLength ? format(ui.nameLimit, { count: input.value.length, max: dialog.maxLength }) : "";
    }
    if (error) {
      error.textContent = dialog.error || "";
      error.hidden = !dialog.error;
    }
    input.oninput = () => {
      dialog.value = input.value;
      dialog.error = "";
      if (helper && dialog.maxLength) {
        helper.textContent = format(ui.nameLimit, { count: input.value.length, max: dialog.maxLength });
      }
      if (error) {
        error.textContent = "";
        error.hidden = true;
      }
    };
    form.onsubmit = (event) => {
      event.preventDefault();
      submitPromptDialog(dialog.input ? input.value : true);
    };
    document.getElementById("prompt-modal-cancel").onclick = () => closePromptDialog("");
    if (dialog.input) {
      setTimeout(() => input.focus(), 0);
    }
  }

  function submitPromptDialog(value) {
    const dialog = state.promptDialog;
    if (!dialog) {
      return;
    }
    let nextValue = value;
    if (dialog.input) {
      nextValue = typeof dialog.normalize === "function" ? dialog.normalize(value) : value.trim();
    }
    if (typeof dialog.validate === "function") {
      const validationError = dialog.validate(nextValue);
      if (validationError) {
        dialog.value = value;
        dialog.error = validationError;
        render();
        return;
      }
    }
    closePromptDialog(nextValue);
  }

  function closePromptDialog(value) {
    const dialog = state.promptDialog;
    if (!dialog) {
      return;
    }
    state.promptDialog = null;
    render();
    dialog.resolve(value);
  }

  function beginVisibleScene() {
    state.storyParts = [];
    state.showGameOverImage = false;
    state.gameOverImage = null;
  }

  function setMusic(track, options = {}) {
    const nextTrack = track || "silence";
    const nextVolume = options.volume || MUSIC_VOLUMES.normal;
    state.music.current = nextTrack;
    state.music.volume = nextVolume;
    if (nextTrack === "silence" || !state.music.enabled) {
      stopMusic();
      syncMusicButton();
      return;
    }
    const src = MUSIC_TRACKS[nextTrack];
    if (!src) {
      stopMusic();
      syncMusicButton();
      return;
    }
    if (!state.music.audio || state.music.audio.dataset.track !== nextTrack) {
      stopMusic();
      state.music.audio = new Audio(src);
      state.music.audio.dataset.track = nextTrack;
      state.music.audio.loop = true;
      state.music.audio.preload = "auto";
    }
    state.music.audio.volume = effectiveMusicVolume(nextVolume);
    const playAttempt = state.music.audio.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(() => {});
    }
    syncMusicButton();
  }

  function stopMusic() {
    if (!state.music.audio) {
      return;
    }
    state.music.audio.pause();
  }

  function toggleMusic() {
    state.music.enabled = !state.music.enabled;
    localStorage.setItem(`${storagePrefix}musicEnabled`, JSON.stringify(state.music.enabled));
    if (state.music.enabled) {
      setMusic(state.music.current, { volume: state.music.volume });
    } else {
      stopMusic();
      syncMusicButton();
    }
  }

  function effectiveMusicVolume(baseVolume = state.music.volume) {
    return Math.max(0, Math.min(1, baseVolume * state.music.userVolume));
  }

  function updateMusicVolume(value) {
    const parsed = Number(value);
    const nextVolume = Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) / 100 : 1;
    state.music.userVolume = nextVolume;
    localStorage.setItem(`${storagePrefix}musicVolume`, String(Math.round(nextVolume * 100)));
    if (state.music.audio) {
      state.music.audio.volume = effectiveMusicVolume();
    }
    syncMusicButton();
  }

  function bindFirstGestureAudio() {
    const unlock = () => {
      if (state.music.enabled && state.music.current !== "silence") {
        setMusic(state.music.current, { volume: state.music.volume });
      }
      document.removeEventListener("pointerdown", unlock);
      document.removeEventListener("keydown", unlock);
    };
    document.addEventListener("pointerdown", unlock, { once: true });
    document.addEventListener("keydown", unlock, { once: true });
  }

  function syncMusicButton() {
    const button = document.getElementById("music-button");
    const slider = document.getElementById("music-volume");
    if (!button) {
      return;
    }
    button.textContent = state.music.enabled ? ui.musicOn : ui.musicOff;
    button.classList.toggle("is-muted", !state.music.enabled);
    button.onclick = toggleMusic;
    if (slider) {
      slider.value = String(Math.round(state.music.userVolume * 100));
      slider.disabled = !state.music.enabled;
      slider.setAttribute("aria-label", ui.musicVolume);
      slider.oninput = (event) => updateMusicVolume(event.target.value);
    }
  }

  function restoreChapterMusic(volume = MUSIC_VOLUMES.normal) {
    if (!state.player) {
      setMusic("epic");
      return;
    }
    setMusic(CHAPTER_MUSIC[state.player.chapter] || "ambient", { volume });
  }

  function showLog() {
    state.logVisible = true;
    const panel = document.getElementById("log-panel");
    if (panel) {
      panel.hidden = false;
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function toggleLog() {
    if (state.logVisible) {
      hideLog();
    } else {
      showLog();
    }
  }

  function hideLog() {
    state.logVisible = false;
    const panel = document.getElementById("log-panel");
    if (panel) {
      panel.hidden = true;
    }
  }

  function bindMobilePanels() {
    const infoMenu = document.getElementById("info-menu");
    if (infoMenu) {
      infoMenu.querySelectorAll("[data-mobile-panel]").forEach((button) => {
        button.onclick = () => {
          activateInfoPanel(button.dataset.mobilePanel);
          infoMenu.open = false;
        };
      });
    }
    syncMobilePanels();
  }

  function toggleMobilePanel(name) {
    state.activeMobilePanel = state.activeMobilePanel === name ? null : name;
    syncMobilePanels();
  }

  function activateInfoPanel(name) {
    const isMobileLayout = window.matchMedia("(max-width: 980px)").matches;
    if (isMobileLayout) {
      toggleMobilePanel(name);
      return;
    }
    const panel = document.querySelector(`[data-mobile-panel-name="${name}"]`);
    if (panel) {
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function closeMobilePanels() {
    state.activeMobilePanel = null;
    syncMobilePanels();
  }

  function syncMobilePanels() {
    document.body.classList.toggle("mobile-panel-open", Boolean(state.activeMobilePanel));
    document.querySelectorAll("[data-mobile-panel-name]").forEach((panel) => {
      panel.classList.toggle("is-open", panel.dataset.mobilePanelName === state.activeMobilePanel);
    });
    document.querySelectorAll("[data-mobile-panel]").forEach((button) => {
      button.classList.toggle("is-active", button.dataset.mobilePanel === state.activeMobilePanel);
    });
  }

  function showFaq() {
    state.faqVisible = true;
    const panel = document.getElementById("faq-panel");
    if (panel) {
      panel.hidden = false;
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function hideFaq() {
    state.faqVisible = false;
    const panel = document.getElementById("faq-panel");
    if (panel) {
      panel.hidden = true;
    }
  }

  function showCredits() {
    state.creditsVisible = true;
    const panel = document.getElementById("credits-panel");
    if (panel) {
      panel.hidden = false;
      panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  function hideCredits() {
    state.creditsVisible = false;
    const panel = document.getElementById("credits-panel");
    if (panel) {
      panel.hidden = true;
    }
  }

  function bindAccountMenu() {
    const menu = document.getElementById("account-menu");
    const saveButton = document.getElementById("menu-save");
    const loadButton = document.getElementById("menu-load");
    const leaderboardButton = document.getElementById("menu-leaderboard");
    const faqButton = document.getElementById("menu-faq");
    const creditsButton = document.getElementById("menu-credits");
    const cheatsButton = document.getElementById("menu-cheats");
    const discordButton = document.getElementById("menu-discord");
    const suggestButton = document.getElementById("menu-suggest");
    const issueButton = document.getElementById("menu-issue");
    const logoutButton = document.getElementById("menu-logout");
    if (!saveButton || !loadButton || !leaderboardButton || !faqButton || !creditsButton || !cheatsButton || !discordButton || !suggestButton || !issueButton || !logoutButton) {
      return;
    }
    if (menu) {
      menu.hidden = false;
    }
    saveButton.disabled = !state.player;
    cheatsButton.disabled = !state.player;
    logoutButton.disabled = !state.account;
    saveButton.onclick = () => runAccountMenuAction(saveGame);
    loadButton.onclick = () => runAccountMenuAction(loadGame);
    leaderboardButton.onclick = () => runAccountMenuAction(showLeaderboard);
    faqButton.onclick = () => runAccountMenuAction(showFaq);
    creditsButton.onclick = () => runAccountMenuAction(showCredits);
    cheatsButton.onclick = () => runAccountMenuAction(showCheatCodePrompt);
    discordButton.onclick = () => runAccountMenuAction(openDiscord);
    suggestButton.onclick = () => runAccountMenuAction(openSuggestionForm);
    issueButton.onclick = () => runAccountMenuAction(openIssueForm);
    logoutButton.onclick = () => runAccountMenuAction(logout);
  }

  function runAccountMenuAction(action) {
    const menu = document.getElementById("account-menu");
    if (menu) {
      menu.open = false;
    }
    action();
  }

  function openSuggestionForm() {
    openExternal(SUGGESTION_URL);
  }

  function openDiscord() {
    openExternal(DISCORD_URL);
  }

  function openIssueForm() {
    openExternal(ISSUE_URL);
  }

  async function showCheatCodePrompt() {
    if (!state.player) {
      writeKey("story.cheat_unknown");
      return;
    }
    const code = await promptText(t("story.cheat_prompt"), "", {
      title: ui.cheatCodes,
      placeholder: "infinite health"
    });
    if (!code) {
      return;
    }
    applyCheatCode(code);
  }

  function normalizeCheatCode(code) {
    return String(code || "").toLowerCase().replace(/[^a-z]/g, "");
  }

  function applyCheatCode(code) {
    ensurePlayerState();
    const normalized = normalizeCheatCode(code);
    const cheatMap = {
      infinitehealth: { key: "health", label: "Infinite Health" },
      infinitemana: { key: "mana", label: "Infinite Mana" },
      infiniteac: { key: "ac", label: "Infinite AC" },
      infinitedamage: { key: "damage", label: "Infinite Damage" },
      infinitedamge: { key: "damage", label: "Infinite Damage" },
      infiniteattackchance: { key: "attack", label: "Infinite Attack Chance" }
    };
    const cheat = cheatMap[normalized];
    if (!cheat) {
      writeKey("story.cheat_unknown");
      return false;
    }
    state.player.cheats[cheat.key] = true;
    unlock("cheater");
    applyCheatSustain();
    writeKey("story.cheat_enabled", { cheat: cheat.label });
    saveGame();
    return true;
  }

  function isCheatActive(key) {
    return Boolean(state.player && state.player.cheats && state.player.cheats[key]);
  }

  function applyCheatSustain() {
    if (!state.player || !state.player.cheats) {
      return;
    }
    if (state.player.cheats.health) {
      state.player.maxHealth = Math.max(state.player.maxHealth || 0, CHEAT_STAT_VALUE);
      state.player.health = state.player.maxHealth;
    }
    if (state.player.cheats.mana) {
      state.player.maxMana = Math.max(state.player.maxMana || 0, CHEAT_STAT_VALUE);
      state.player.mana = state.player.maxMana;
    }
  }

  function openExternal(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function faqHtml() {
    const entries = lang === "es" ? [
      {
        question: "Que hacen las opciones de ataque?",
        answer: "Attack usa tus ataques normales. Heavy Attack hace un solo ataque mas fuerte, pero con -1 al tiro para golpear. Dodge sube tu AC por ese turno. Run intenta escapar con una tirada de sneak. Health Potion aparece cuando llevas una pocion y cura 2d4 + 6 antes de que el enemigo responda."
      },
      {
        question: "Como se calculan los puntajes?",
        answer: "Tu puntaje suma nivel x 100, experiencia restante, peleas ganadas x 75, decisiones x 15 y logros x 50. Terminar una ruta suma 1000. Algunos objetos importantes dan bonificaciones: la muneca, el orbe de magistone, la mascara plateada y los mapas. Morir resta 200. Oro, suministros, pociones y equipo normal no suman puntaje."
      },
      {
        question: "Cuando puedo enviar un puntaje?",
        answer: "Puedes enviar un puntaje desde Game Over o desde un final de capitulo. Cada partida guardada solo puede enviarse una vez, y enviar el puntaje sale de la pantalla actual; usa Cargar partida despues si quieres volver a esa sesion."
      },
      {
        question: "Que hacen los premios de nivel?",
        answer: "Cada nivel aumenta tu vida maxima. Gain HP aumenta aun mas tu vida maxima y actual. Gain AC hace que seas mas dificil de golpear. Gain Damage aumenta tu bono de dano. Full Heal restaura vida y mana. Los personajes personalizados tambien pueden ganar mana o subir un atributo."
      },
      {
        question: "Como funcionan las cuentas y guardados?",
        answer: "Los invitados guardan en este navegador. Si inicias sesion con correo o Google, el juego tambien intenta guardar tus estadisticas, logros y partida en la nube para usarlas despues."
      },
      {
        question: "Que hay de nuevo en la creacion de personaje?",
        answer: "Ahora puedes elegir personajes predeterminados o crear uno personalizado. Los personajes personalizados eligen raza, clase, arma, atributos y habilidades con mana; el menu de estado muestra mana, arma, atributos y habilidades conocidas."
      },
      {
        question: "Donde puedo revisar mi progreso?",
        answer: "Usa Estado actual del juego en el menu para ver la version, sistemas disponibles, historia implementada y planes generales. Desarrollo de la trama muestra estadisticas, progreso de logros y el resumen del personaje."
      },
      {
        question: "Como reporto errores o doy ideas?",
        answer: "Usa Report Issue para abrir un reporte con detalles de version y sesion. El boton Discord abre la comunidad para comentarios rapidos."
      }
    ] : [
      {
        question: "What do the attack options do?",
        answer: "Attack uses your normal number of attacks. Heavy Attack makes one stronger swing, but takes -1 on the hit roll. Dodge raises your AC for that enemy turn. Run tries to escape with a sneak roll. Health Potion appears when you have one and heals 2d4 + 6 before the enemy responds."
      },
      {
        question: "How are leaderboard scores calculated?",
        answer: "Your score adds level x 100, remaining experience, fights won x 75, decisions x 15, and achievements x 50. Reaching an ending adds 1000. Key items can add bonuses too: the doll, magistone orb, silver mask, and maps. Dying subtracts 200. Gold, supplies, potions, and ordinary gear do not add score."
      },
      {
        question: "When can I submit a score?",
        answer: "You can submit from Game Over or from a chapter ending. Each saved run can only submit once, and submitting leaves the current run screen; use Load Game afterward if you want to return to that saved session."
      },
      {
        question: "What do level-up rewards do?",
        answer: "Every level raises your max HP. Gain HP raises max HP and current HP even more. Gain AC makes you harder to hit. Gain Damage increases your damage bonus. Full Heal restores health and mana. Custom characters can also gain mana or raise an attribute."
      },
      {
        question: "How do accounts and saves work?",
        answer: "Guests save in this browser. Signed-in players using email or Google stay signed in unless they log out, and the game also tries to sync stats, achievements, and saves to the cloud."
      },
      {
        question: "What changed with character creation?",
        answer: "You can choose default characters or create a custom one. Custom characters pick race, class, weapon, attributes, and mana abilities; the status menu shows mana, weapon, attributes, and known abilities."
      },
      {
        question: "Where can I check progress?",
        answer: "Use Current game status in the menu to see the version, available systems, implemented story, and broad next-story notes. Plot Development shows stats, achievement progress, and character details."
      },
      {
        question: "How do I report bugs or send ideas?",
        answer: "Use Report Issue to open a report with version and session details. The Discord button opens the community for quick feedback."
      }
    ];
    return entries.map((entry) => `
      <article class="faq-entry">
        <h3>${escapeHtml(entry.question)}</h3>
        <p>${escapeHtml(entry.answer)}</p>
      </article>
    `).join("");
  }

  function creditsHtml() {
    const intro = lang === "es"
      ? "Tales of Visteria creado por Redxjak. Musica usada bajo la Pixabay Content License."
      : "Tales of Visteria created by Redxjak. Music used under the Pixabay Content License.";
    const storyCredits = [
      "A story DM'd by Jubikino",
      "The world of Visteria was created by MolarCapybara",
      "An adaptation made by Redxjak"
    ];
    const musicHeading = lang === "es" ? "Musica" : "Music";
    const licenseLabel = lang === "es" ? "Resumen de licencia de Pixabay" : "Pixabay license summary";
    const trackHtml = MUSIC_CREDITS.map((track) => `
      <article class="faq-entry">
        <h3>${escapeHtml(track.title)}</h3>
        <p>${escapeHtml(track.artist)} - <a href="${escapeHtml(track.source)}" target="_blank" rel="noopener noreferrer">Pixabay</a></p>
      </article>
    `).join("");
    return `
      <article class="faq-entry">
        <h3>Tales of Visteria</h3>
        <p>${escapeHtml(intro)}</p>
        <p>${storyCredits.map((credit) => escapeHtml(credit)).join("<br>")}</p>
      </article>
      <article class="faq-entry">
        <h3>${escapeHtml(musicHeading)}</h3>
        <p><a href="${escapeHtml(PIXABAY_LICENSE_URL)}" target="_blank" rel="noopener noreferrer">${escapeHtml(licenseLabel)}</a></p>
      </article>
      ${trackHtml}
    `;
  }

  function showStart() {
    if (!canEnterGame()) {
      showLoginScreen();
      return;
    }
    setMusic("epic");
    const stats = plotText();
    write(t("story.start", { stats }), true);
    const choices = [
      choice(t("choice.new_game"), showCharacterSelect),
      choice(t("choice.load_game"), loadGame),
      choice(ui.leaderboard, showLeaderboard),
      choice(ui.suggest, openSuggestionForm),
      choice(ui.reportIssue, openIssueForm)
    ];
    setChoices(choices);
  }

  function showLoginScreen() {
    setMusic("epic", { volume: MUSIC_VOLUMES.low });
    state.player = null;
    write(ui.loginScreen, true);
    const choices = [
      choice(ui.login, signIn),
      choice(ui.googleLogin, signInWithGoogle),
      choice(ui.createAccount, createAccount)
    ];
    if (appConfig.allowGuests) {
      choices.push(choice(ui.playAsGuest, playAsGuest));
    }
    setChoices(choices);
  }

  async function signIn() {
    const email = await promptText(ui.loginPrompt, state.account && state.account.email ? state.account.email : "", {
      title: ui.login,
      placeholder: "you@example.com"
    });
    if (!email) {
      return;
    }
    const password = await promptText(ui.passwordPrompt, "", {
      title: ui.login,
      password: true
    });
    if (!password) {
      return;
    }
    try {
      const session = await authRequest("token?grant_type=password", {
        email,
        password
      });
      setAuthenticatedAccount(session);
      await loadCloudData();
      showStart();
    } catch {
      writeLoginFailed();
    }
  }

  async function createAccount() {
    const displayName = await promptText(ui.displayNamePrompt, "", {
      title: ui.createAccount,
      ...namePromptOptions({ publicName: true })
    });
    if (!displayName) {
      return;
    }
    const cleanDisplayName = normalizeName(displayName);
    const email = await promptText(ui.emailPrompt, "", {
      title: ui.createAccount,
      placeholder: "you@example.com"
    });
    if (!email) {
      return;
    }
    const password = await promptText(ui.passwordPrompt, "", {
      title: ui.createAccount,
      password: true
    });
    if (!password) {
      return;
    }
    try {
      const session = await authRequest("signup", {
        email,
        password,
        data: { display_name: cleanDisplayName }
      });
      if (session.access_token) {
        setAuthenticatedAccount(session, cleanDisplayName);
        await saveProfile();
        await saveCloudData();
        showStart();
      } else {
        state.account = {
          name: cleanDisplayName,
          email,
          guest: false,
          pendingConfirmation: true
        };
        localStorage.setItem(`${storagePrefix}account`, JSON.stringify(state.account));
        localStorage.setItem(`${storagePrefix}leaderboardName`, state.account.name);
        write(ui.accountCreated, true);
        const choices = [choice(ui.login, signIn)];
        if (appConfig.allowGuests) {
          choices.push(choice(ui.playAsGuest, playAsGuest));
        }
        setChoices(choices);
      }
    } catch {
      write(ui.signupFailed);
    }
  }

  function signInWithGoogle() {
    const redirectTo = window.location.href.split("#")[0];
    const params = new URLSearchParams({
      provider: "google",
      redirect_to: redirectTo
    });
    window.location.href = `${SUPABASE_URL}/auth/v1/authorize?${params.toString()}`;
  }

  function playAsGuest() {
    state.account = { name: ui.guest, guest: true };
    localStorage.removeItem(`${storagePrefix}account`);
    showStart();
  }

  async function logout() {
    state.account = null;
    state.player = null;
    localStorage.removeItem(`${storagePrefix}account`);
    write(ui.logoutDone, true);
    const choices = [
      choice(ui.login, signIn),
      choice(ui.googleLogin, signInWithGoogle),
      choice(ui.createAccount, createAccount)
    ];
    if (appConfig.allowGuests) {
      choices.push(choice(ui.playAsGuest, playAsGuest));
    }
    setChoices(choices);
  }

  function showCharacterSelect() {
    showBetaCharacterSelect();
  }

  function showBetaCharacterSelect() {
    setMusic("ambient");
    write([
      "Choose Your Character",
      "",
      "Pick one of the default characters, or create a custom character.",
      "",
      "Cletus the Barbarian: A Goliath Barbarian with high health and brutal melee attacks.",
      "Ren the Ranger: An Elven Ranger with high accuracy and two attacks.",
      "Cal the Warlock: A Human Warlock with eldritch power and strong persuasion.",
      "Kili the Fighter: A Dwarven Fighter with sturdy defenses and practical lore.",
      "Jon the DM: A behind-the-screen chaos option."
    ].join("\n"), true);
    setChoices([
      choice("Create Custom Character", showBetaCharacterName),
      choice("Cletus", () => newPlayer("warrior")),
      choice("Ren", () => newPlayer("ranger")),
      choice("Cal", () => newPlayer("scholar")),
      choice("Kili", () => newPlayer("dwarf")),
      choice("Jon the DM", () => newPlayer("dm")),
      choice(t("choice.back"), showStart)
    ]);
  }

  async function showBetaCharacterName() {
    setMusic("ambient");
    const previousName = state.account && state.account.name && state.account.name !== ui.guest ? state.account.name : "";
    const name = await promptText("Character name:", previousName, {
      title: "Create Custom Character",
      ...namePromptOptions()
    });
    if (!name) {
      showStart();
      return;
    }
    state.betaCreator = {
      name: normalizeName(name)
    };
    showBetaRaceSelect();
  }

  function showBetaStatRolls() {
    const creator = state.betaCreator;
    if (!creator || !creator.race || !creator.characterClass) {
      showBetaCharacterName();
      return;
    }
    const build = betaClassBuilds[creator.characterClass];
    const race = betaRaces[creator.race];
    if (!creator.rolls) {
      creator.rolls = rollBetaStatArray();
    }
    creator.assignedStats = assignBetaStats(creator.rolls, build.priority);
    const finalAttributes = betaFinalAttributes(creator.assignedStats, race);
    write([
      "Character Creation",
      "",
      `Name: ${creator.name}`,
      `Race: ${race.name}`,
      `Class: ${build.title}`,
      "Final Stats:",
      betaAttributeList(finalAttributes),
      "",
      "Stats are rolled as 4d6 drop lowest, auto-assigned to this class's best attributes, then adjusted by race.",
      "",
      betaAttributeHelpText()
    ].join("\n"), true);
    setChoices([
      choice("Keep These Stats", showBetaWeaponSelect, { detail: "Accept this stat roll and choose a starting weapon." }),
      choice("Reroll Stats", () => {
        creator.rolls = rollBetaStatArray();
        showBetaStatRolls();
      }, { detail: "Roll a fresh set of attributes for this race and class." }),
      choice(t("choice.back"), showBetaClassSelect, { detail: "Return to class selection." })
    ]);
  }

  function showBetaClassSelect() {
    const creator = state.betaCreator;
    if (!creator || !creator.race) {
      showBetaCharacterName();
      return;
    }
    const race = betaRaces[creator.race];
    writeHtml(classSelectionHtml(creator, race), true);
    setChoices([
      choice("Barbarian", () => chooseBetaClass("warrior"), { detail: betaClassBuilds.warrior.description }),
      choice("Ranger", () => chooseBetaClass("ranger"), { detail: betaClassBuilds.ranger.description }),
      choice("Warlock", () => chooseBetaClass("scholar"), { detail: betaClassBuilds.scholar.description }),
      choice("Fighter", () => chooseBetaClass("dwarf"), { detail: betaClassBuilds.dwarf.description }),
      choice(t("choice.back"), showBetaRaceSelect, { detail: "Return to race selection." })
    ]);
  }

  function classSelectionHtml(creator, race) {
    const cards = ["warrior", "ranger", "scholar", "dwarf"].map((key) => {
      const build = betaClassBuilds[key];
      return `
        <article class="class-card">
          <img src="${ASSET_BASE}/${betaClassImageFile(creator.race, key)}" alt="${escapeHtml(`${race.name} ${build.title}`)}">
          <div class="class-card-body">
            <h3>${escapeHtml(build.title)}</h3>
            <p>${escapeHtml(build.description)}</p>
            <p class="class-card-ability">Abilities: ${escapeHtml(build.abilities.map(betaPowerSummary).join("; "))}</p>
          </div>
        </article>
      `;
    }).join("");
    return `
      <section class="class-selection">
        <h2>Choose a Class</h2>
        <p>Name: ${escapeHtml(creator.name)}</p>
        <p>Race: ${escapeHtml(race.name)}</p>
        <div class="class-card-grid">${cards}</div>
      </section>
    `;
  }

  function betaClassImageFile(raceKey, classKey) {
    const classSlug = betaClassBuilds[classKey].title.toLowerCase();
    return `class_${raceKey}_${classSlug}.png`;
  }

  function chooseBetaClass(characterClass) {
    state.betaCreator.characterClass = characterClass;
    state.betaCreator.rolls = rollBetaStatArray();
    state.betaCreator.assignedStats = assignBetaStats(state.betaCreator.rolls, betaClassBuilds[characterClass].priority);
    showBetaStatRolls();
  }

  function showBetaRaceSelect() {
    const creator = state.betaCreator;
    if (!creator) {
      showBetaCharacterName();
      return;
    }
    writeHtml(raceSelectionHtml(creator), true);
    setChoices([
      choice("Goliath", () => chooseBetaRace("goliath"), { detail: betaRaces.goliath.description }),
      choice("Elf", () => chooseBetaRace("elf"), { detail: betaRaces.elf.description }),
      choice("Human", () => chooseBetaRace("human"), { detail: betaRaces.human.description }),
      choice("Dwarf", () => chooseBetaRace("dwarf"), { detail: betaRaces.dwarf.description }),
      choice(t("choice.back"), showBetaCharacterName, { detail: "Return to name entry." })
    ]);
  }

  function raceSelectionHtml(creator) {
    const cards = ["goliath", "elf", "human", "dwarf"].map((key) => {
      const race = betaRaces[key];
      const ability = race.ability ? `<p class="race-card-ability">Ability: ${escapeHtml(betaPowerSummary(race.ability))}</p>` : "";
      return `
        <article class="race-card">
          <img src="${ASSET_BASE}/${race.image}" alt="${escapeHtml(race.name)}">
          <div class="race-card-body">
            <h3>${escapeHtml(race.name)}</h3>
            <p>${escapeHtml(race.description)}</p>
            ${ability}
          </div>
        </article>
      `;
    }).join("");
    return `
      <section class="race-selection">
        <h2>Choose a Race</h2>
        <p>Name: ${escapeHtml(creator.name)}</p>
        <div class="race-card-grid">${cards}</div>
        <pre class="race-attribute-help">${escapeHtml(betaAttributeHelpText())}</pre>
      </section>
    `;
  }

  function chooseBetaRace(race) {
    state.betaCreator.race = race;
    showBetaClassSelect();
  }

  function showBetaWeaponSelect() {
    const creator = state.betaCreator;
    const build = betaClassBuilds[creator.characterClass];
    const race = betaRaces[creator.race];
    const finalAttributes = betaFinalAttributes(creator.assignedStats, race);
    write([
      "Choose a Starting Weapon",
      "",
      `${creator.name} the ${race.name} ${build.title}`,
      betaAttributeLine(finalAttributes),
      "",
      ...Object.values(betaWeapons).map((weapon) => `${weapon.name}: ${weapon.description}\nWeapon skill: ${betaPowerSummary(weapon.skill)}`)
    ].join("\n\n"), true);
    setChoices([
      choice("Greataxe", () => newBetaPlayer("greataxe"), { detail: betaWeapons.greataxe.description }),
      choice("Longbow", () => newBetaPlayer("longbow"), { detail: betaWeapons.longbow.description }),
      choice("Battleaxe and Shield", () => newBetaPlayer("battleaxe"), { detail: betaWeapons.battleaxe.description }),
      choice("Eldritch Focus", () => newBetaPlayer("eldritch_focus"), { detail: betaWeapons.eldritch_focus.description }),
      choice(t("choice.back"), showBetaStatRolls, { detail: "Return to stat rolls." })
    ]);
  }

  function newPlayer(characterClass) {
    const template = classes[characterClass];
    state.player = {
      schemaVersion: undefined,
      class: characterClass,
      name: template.name,
      title: template.title,
      race: template.race,
      health: template.maxHealth,
      maxHealth: template.maxHealth,
      gold: template.gold,
      healthPotions: characterClass === "dm" ? 0 : 1,
      supplies: template.supplies,
      gear: characterClass === "dm" ? [...template.gear] : [...template.gear, "health potion"],
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
        pickedUpDoll: false,
        dollInSack: false,
        dollRevealed: false,
        hasThroneMap: false,
        hasPartialMap: false,
        bridgeRoute: randomBridgeRoute(),
        bridgeNavigationStep: 0,
        districtsRested: false,
        largeManorCleared: false,
        mimicHouseCleared: false,
        smallShackCleared: false,
        bridgeXpAwarded: false,
        bridgeRested: false,
        hasDwarvenAle: false,
        hasMagistoneOrb: false,
        cleanGetawayDistrict: false,
        hasSilverMask: false,
        wearingSilverMask: false,
        maskPowerClaimed: false,
        playerSuccumbedToMask: false,
        magistoneOrbSpent: false,
        crownDestroyed: false,
        dollDestroyed: false,
        obliviarchDestroyed: false,
        orderObservedPlayer: false,
        warehouseStage: "not_started",
        warehouseRested: false,
        bridgeEndMaskResolved: false,
        maskCorruption: 0,
        orderQuestionsAsked: [],
        bridgeEndRested: false,
        castleSideRested: false,
        hasCastleSupplies: false,
        servantAmbushCleared: false,
        orcCampOuterResolved: false,
        orcCampPartyResolved: false,
        aleBarrelUsed: false,
        partyRockTried: false,
        rescuedWazetax: false,
        wazetaxHidden: false,
        wazetaxQuestionsAsked: [],
        bridgeWrongTurns: 0,
        classSaveUsed: false,
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

  function newBetaPlayer(weaponKey) {
    const creator = state.betaCreator;
    const build = betaClassBuilds[creator.characterClass];
    const race = betaRaces[creator.race];
    const weapon = betaWeapons[weaponKey];
    const attributes = betaFinalAttributes(creator.assignedStats, race);
    const conMod = betaModifier(attributes.con);
    const maxHealth = build.maxHealth + (conMod * 3) + (race.maxHealth || 0);
    const maxMana = Math.max(0, build.manaBase + betaModifier(attributes[build.damageStat]) + (race.mana || 0));
    state.player = {
      schemaVersion: CUSTOM_CHARACTER_SCHEMA_VERSION,
      betaCustom: true,
      class: creator.characterClass,
      name: creator.name,
      title: build.title,
      race: race.name,
      raceKey: creator.race,
      weaponKey,
      weaponName: weapon.name,
      attributes,
      rolledStats: [...creator.rolls],
      health: maxHealth,
      maxHealth,
      mana: maxMana,
      maxMana,
      gold: 8,
      healthPotions: 0,
      supplies: 3,
      gear: [...build.gear, weapon.name],
      bonus: build.bonus,
      knownAbilities: [...new Set([...build.abilities, race.ability, weapon.skill].filter(Boolean))],
      level: BASE_LEVEL,
      experience: 0,
      xpToNext: BASE_XP_TO_NEXT,
      upgrades: { ac: 0, damage: 0 },
      flags: initialPlayerFlags(),
      score: {
        fightsWon: 0,
        decisions: 0,
        submitted: false,
        startedAt: Date.now()
      },
      gameOverReason: "default"
    };
    delete state.betaCreator;
    state.stats[creator.characterClass].runs += 1;
    saveStats();
    checkPlayedEveryone();
    continueChapter("caravan", true);
  }

  function initialPlayerFlags() {
    return {
      forestAttempts: 0,
      girlHint: "",
      girlHelped: false,
      monstersScattered: false,
      hasDoll: false,
      pickedUpDoll: false,
      dollInSack: false,
      dollRevealed: false,
      hasThroneMap: false,
      hasPartialMap: false,
      bridgeRoute: randomBridgeRoute(),
      bridgeNavigationStep: 0,
      districtsRested: false,
      smallShackCleared: false,
      bridgeXpAwarded: false,
      bridgeRested: false,
      hasDwarvenAle: false,
      hasMagistoneOrb: false,
      cleanGetawayDistrict: false,
      hasSilverMask: false,
      wearingSilverMask: false,
      maskPowerClaimed: false,
      playerSuccumbedToMask: false,
      magistoneOrbSpent: false,
      crownDestroyed: false,
      dollDestroyed: false,
      obliviarchDestroyed: false,
      orderObservedPlayer: false,
      warehouseStage: "not_started",
      warehouseRested: false,
      bridgeEndMaskResolved: false,
      maskCorruption: 0,
      orderQuestionsAsked: [],
      bridgeEndRested: false,
      castleSideRested: false,
      hasCastleSupplies: false,
      servantAmbushCleared: false,
      orcCampOuterResolved: false,
      orcCampPartyResolved: false,
      aleBarrelUsed: false,
      partyRockTried: false,
      rescuedWazetax: false,
      wazetaxHidden: false,
      wazetaxQuestionsAsked: [],
      bridgeWrongTurns: 0,
      classSaveUsed: false,
      completedRecorded: false,
      deathRecorded: false
    };
  }

  function rollBetaStatArray() {
    return CUSTOM_ATTRIBUTES.map(() => {
      const rolls = [rollDie(6), rollDie(6), rollDie(6), rollDie(6)].sort((a, b) => b - a);
      return rolls.slice(0, 3).reduce((total, value) => total + value, 0);
    }).sort((a, b) => b - a);
  }

  function assignBetaStats(rolls, priority) {
    const assigned = {};
    priority.forEach((attribute, index) => {
      assigned[attribute] = rolls[index];
    });
    return assigned;
  }

  function betaFinalAttributes(baseAttributes, race) {
    const attributes = {};
    CUSTOM_ATTRIBUTES.forEach((attribute) => {
      attributes[attribute] = (baseAttributes[attribute] || 10) + (race.bonuses[attribute] || 0);
    });
    return attributes;
  }

  function betaModifier(score) {
    return Math.floor((score - 10) / 2);
  }

  function betaAttributeLine(attributes) {
    return `STR ${attributes.str} | DEX ${attributes.dex} | CON ${attributes.con} | INT ${attributes.int} | WIS ${attributes.wis} | CHA ${attributes.cha}`;
  }

  function betaAttributeList(attributes) {
    return [
      `Strength: ${attributes.str}`,
      `Dexterity: ${attributes.dex}`,
      `Constitution: ${attributes.con}`,
      `Intelligence: ${attributes.int}`,
      `Wisdom: ${attributes.wis}`,
      `Charisma: ${attributes.cha}`
    ].join("\n");
  }

  function betaAttributeHelpText() {
    return [
      "What stats do:",
      `STR: ${betaAttributeHelp.str}`,
      `DEX: ${betaAttributeHelp.dex}`,
      `CON: ${betaAttributeHelp.con}`,
      `INT: ${betaAttributeHelp.int}`,
      `WIS: ${betaAttributeHelp.wis}`,
      `CHA: ${betaAttributeHelp.cha}`
    ].join("\n");
  }

  function betaPowerSummary(powerId) {
    const power = betaPowers[powerId];
    if (!power) {
      return powerId;
    }
    const parts = [`${power.name} (${power.cost} mana)`];
    if (power.attackBonus) parts.push(`${power.attackBonus > 0 ? "+" : ""}${power.attackBonus} attack`);
    if (power.damageBonus) parts.push(`${power.damageBonus > 0 ? "+" : ""}${power.damageBonus} damage`);
    if (power.damageDie) parts.push(`d${power.damageDie} damage die`);
    if (power.healDie) parts.push(`heals d${power.healDie} + ${power.healBonus || 0}`);
    if (power.acBonus) parts.push(`+${power.acBonus} AC this turn`);
    if (power.manaRestore) parts.push(`restores ${power.manaRestore} mana`);
    if (power.turns) parts.push(`${power.turns} turns`);
    if (power.healHalf) parts.push("heals for half damage dealt");
    if (power.guard) parts.push("also guards");
    return `${parts.join(", ")}. ${power.text}`;
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
      dmBridgeEnd,
      dmOrcCamps: dmOrcCampsPreview,
      caravan,
      escape,
      cave,
      ghostGirl,
      districts,
      residential,
      bridge,
      warehouseApproach,
      warehouse: warehouseRitual,
      bridgeEnd,
      orcCamps,
      castleApproach,
      complete
    };
    state.player.chapter = chapter;
    restoreChapterMusic();
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
    writeKey("story.dm_barracks_map", { directions: bridgeDirectionList() });
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
    writeKey("story.dm_merchant_map", { directions: bridgeDirectionList() });
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
        state.player.flags.hasMagistoneOrb = true;
        addItem("magistone orb");
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
        state.player.flags.hasMagistoneOrb = true;
        addItem("magistone orb");
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
    setMusic("mystery");
    writeKey("story.dm_bridge", { directions: bridgeDirectionList() });
    setChoices([
      choice(t("choice.dm_watch_sneak"), dmBridgeSneak),
      choice(t("choice.dm_skip_warehouse"), dmWarehouse)
    ]);
  }

  function dmBridgeSneak() {
    writeKey("story.dm_bridge_sneak_start");
    const roll = rollD20("sneak");
    const spotted = roll <= 10;
    writeKey("story.dm_bridge_sneak_result", {
      roll,
      result: t(spotted ? "story.dm_bridge_sneak_low" : "story.dm_bridge_sneak_high")
    });
    setChoices([
      spotted
        ? choice(t("choice.dm_bridge_patrol"), dmBridgePatrol)
        : choice(t("choice.dm_follow_warehouse"), dmWarehouse)
    ]);
  }

  function dmBridgePatrol() {
    setMusic("combat", { volume: MUSIC_VOLUMES.combat });
    writeKey("story.dm_bridge_patrol");
    setChoices([
      choice(t("choice.dm_if_win"), dmWarehouse),
      choice(t("choice.dm_if_lose"), () => dmGameOver("combat"))
    ]);
  }

  function dmWarehouse() {
    setMusic("mystery");
    writeKey("story.dm_warehouse");
    setChoices([
      choice(t("choice.dm_if_win"), dmWarehouseLeaderRage),
      choice(t("choice.dm_if_lose"), () => dmGameOver("warehouse"))
    ]);
  }

  function dmWarehouseLeaderRage() {
    setMusic("combat", { volume: MUSIC_VOLUMES.combat });
    writeKey("story.dm_warehouse_leader_rage");
    setChoices([
      choice(t("choice.dm_if_win"), dmSilverMaskChoice),
      choice(t("choice.dm_if_lose"), () => dmGameOver("warehouse"))
    ]);
  }

  function dmSilverMaskChoice() {
    writeKey("story.dm_silver_mask_choice");
    setChoices([
      choice(t("choice.dm_leave_mask"), () => {
        state.player.flags.hasSilverMask = false;
        state.player.flags.wearingSilverMask = false;
        writeKey("story.dm_silver_mask_left");
        dmRitualSurge();
      }),
      choice(t("choice.dm_store_mask"), () => {
        state.player.flags.hasSilverMask = true;
        state.player.flags.wearingSilverMask = false;
        addItem("silver mask");
        writeKey("story.dm_silver_mask_stored");
        dmRitualSurge();
      }),
      choice(t("choice.dm_wear_mask"), () => {
        state.player.flags.hasSilverMask = true;
        state.player.flags.wearingSilverMask = true;
        applySilverMaskPower();
        addItem("silver mask");
        writeKey("story.dm_silver_mask_worn");
        dmRitualSurge();
      })
    ]);
  }

  function dmRitualSurge() {
    writeKey("story.dm_ritual_surge");
    setChoices([
      choice(t("choice.dm_leave_warehouse"), dmWarehouseLeave),
      choice(t("choice.dm_stop_ritual"), dmWarehouseStopRitual),
      choice(t("choice.dm_jump_hole"), dmWarehouseJumpHole)
    ]);
  }

  function dmWarehouseLeave() {
    writeKey("story.dm_warehouse_leave");
    setMusic("silence");
    setChoices([choice(t("choice.dm_order_arrive"), dmFalseHydraInterruption)]);
  }

  function dmFalseHydraInterruption() {
    setMusic("silence");
    writeKey("story.dm_false_hydra_interruption");
    setChoices([choice(t("choice.dm_listen_order"), dmOrderDialogue)]);
  }

  function dmOrderDialogue() {
    setMusic("epic", { volume: MUSIC_VOLUMES.low });
    writeKey("story.dm_order_dialogue");
    dmBridgeEnd();
  }

  function dmWarehouseStopRitual() {
    writeKey("story.dm_warehouse_stop_ritual");
    setChoices([choice(t("choice.next"), dmFalseHydraInterruption)]);
  }

  function dmWarehouseJumpHole() {
    writeKey("story.dm_warehouse_jump_hole");
    setChoices([choice(t("choice.dm_game_over"), () => dmGameOver("ritual_hole"))]);
  }

  function dmBridgeEnd() {
    state.player.chapter = "dmBridgeEnd";
    writeKey("story.dm_bridge_end");
    unlock("warehouse_survived");
    recordEnding();
    saveGame();
    showDmBridgeEndChoices();
  }

  function showDmBridgeEndChoices() {
    const choices = [
      choice(t("choice.dm_rest_bridge"), dmBridgeEndRest)
    ];
    if (state.player.flags.hasSilverMask && !state.player.flags.wearingSilverMask) {
      choices.push(choice(t("choice.dm_put_mask_on"), dmSilverMaskReworn));
    }
    choices.push(
      choice(t("choice.dm_move_orc_camps"), dmOrcCampsPreview),
      currentStatusChoice()
    );
    setChoices(choices);
  }

  function dmSilverMaskReworn() {
    state.player.flags.wearingSilverMask = true;
    applySilverMaskPower();
    writeKey("story.dm_silver_mask_reworn");
    showDmBridgeEndChoices();
  }

  function dmBridgeEndRest() {
    state.player.health = state.player.maxHealth;
    writeKey("story.dm_bridge_end_rest");
    showDmBridgeEndChoices();
  }

  function dmOrcCampsPreview() {
    state.player.chapter = "dmOrcCamps";
    writeKey("story.dm_orc_camps_preview");
    saveGame();
    setChoices([
      choice(t("choice.dm_sneak_tents"), dmOrcCampSneakTents),
      choice(t("choice.dm_sneak_barrels"), dmOrcCampSneakBarrels),
      choice(t("choice.dm_fight_fire_orcs"), dmOrcCampFireFight),
      choice(t("choice.save"), saveGame)
    ]);
  }

  function dmOrcSceneRoll() {
    const roll = d20();
    writeKey("story.dm_orc_roll", { roll });
    return roll;
  }

  function dmOrcCampSneakTents() {
    writeKey("story.dm_orc_tents");
    const roll = dmOrcSceneRoll();
    if (roll >= 9) {
      writeKey("story.dm_orc_tents_success");
      dmOrcCampInnerPath();
      return;
    }
    writeKey("story.dm_orc_tents_fail");
    setChoices([
      choice(t("choice.dm_if_win"), dmOrcCampInnerPath),
      choice(t("choice.dm_if_lose"), () => dmGameOver("combat"))
    ]);
  }

  function dmOrcCampSneakBarrels() {
    writeKey("story.dm_orc_barrels");
    const roll = dmOrcSceneRoll();
    if (roll >= 15) {
      writeKey("story.dm_orc_barrels_success");
      dmOrcCampInnerPath();
      return;
    }
    writeKey("story.dm_orc_barrels_fail");
    setChoices([
      choice(t("choice.dm_if_win"), dmOrcCampInnerPath),
      choice(t("choice.dm_if_lose"), () => dmGameOver("combat"))
    ]);
  }

  function dmOrcCampFireFight() {
    writeKey("story.dm_orc_fire_fight");
    setChoices([
      choice(t("choice.dm_if_win"), dmOrcCampInnerPath),
      choice(t("choice.dm_if_lose"), () => dmGameOver("combat"))
    ]);
  }

  function dmOrcCampInnerPath() {
    state.player.flags.orcCampOuterResolved = true;
    writeKey("story.dm_orc_inner_path");
    dmOrcPartyArea();
  }

  function dmOrcPartyArea() {
    writeKey("story.dm_orc_party_area");
    setChoices([
      choice(t("choice.dm_sneak_past_party"), dmOrcPartySneak),
      choice(t("choice.dm_create_distraction"), dmOrcPartyDistraction),
      choice(t("choice.dm_fight_party_orcs"), dmOrcPartyFight),
      choice(t("choice.save"), saveGame)
    ]);
  }

  function dmOrcPartySneak() {
    writeKey("story.dm_orc_party_sneak");
    dmOrcCages();
  }

  function dmOrcPartyDistraction() {
    writeKey("story.dm_orc_party_distraction");
    setChoices([
      choice(t("choice.dm_light_ale_barrel"), dmOrcPartyAleBarrel),
      choice(t("choice.dm_throw_rock"), dmOrcPartyThrowRock),
      choice(t("choice.back"), dmOrcPartyArea)
    ]);
  }

  function dmOrcPartyAleBarrel() {
    state.player.flags.aleBarrelUsed = true;
    const roll = dmOrcSceneRoll();
    if (roll <= 4) {
      writeKey("story.dm_orc_party_ale_hurt");
      setChoices([
        choice(t("choice.dm_if_survive"), dmOrcPartyArea),
        choice(t("choice.dm_if_die"), () => dmGameOver("ale_explosion"))
      ]);
      return;
    }
    if (roll >= 11) {
      unlock("osha_incident");
      writeKey("story.dm_orc_party_ale_success");
      dmOrcCages();
      return;
    }
    writeKey("story.dm_orc_party_ale_fail");
    dmOrcPartyArea();
  }

  function dmOrcPartyThrowRock() {
    state.player.flags.partyRockTried = true;
    writeKey("story.dm_orc_party_rock_fail");
    dmOrcPartyArea();
  }

  function dmOrcPartyFight() {
    writeKey("story.dm_orc_party_fight");
    setChoices([
      choice(t("choice.dm_if_win"), dmOrcPartyFightChoice),
      choice(t("choice.dm_if_lose"), () => dmGameOver("orc_party"))
    ]);
  }

  function dmOrcPartyFightChoice() {
    writeKey("story.dm_orc_party_fight_warning");
    setChoices([
      choice(t("choice.dm_fall_back_cages"), () => {
        unlock("union_violation");
        dmOrcCages();
      }),
      choice(t("choice.dm_keep_fighting_party"), dmOrcPartyFightDisaster)
    ]);
  }

  function dmOrcPartyFightDisaster() {
    unlock("aggressively_educational");
    writeKey("story.dm_orc_party_fight_disaster");
    setChoices([
      choice(t("choice.dm_if_win"), dmOrcCages),
      choice(t("choice.dm_if_lose"), () => dmGameOver("orc_party"))
    ]);
  }

  function dmOrcCages() {
    state.player.flags.orcCampPartyResolved = true;
    writeKey("story.dm_orc_cages");
    setChoices([
      choice(t("choice.dm_rescue_wazetax"), dmRescueWazetax),
      choice(t("choice.dm_leave_wazetax"), dmLeaveWazetax)
    ]);
  }

  function dmRescueWazetax() {
    state.player.flags.rescuedWazetax = true;
    state.player.flags.wazetaxHidden = false;
    state.player.flags.wazetaxQuestionsAsked = [];
    unlock("free_wazetax");
    writeKey("story.dm_wazetax_rescue");
    dmCastleFrontWithWazetax();
  }

  function dmLeaveWazetax() {
    state.player.flags.rescuedWazetax = false;
    unlock("not_my_problem");
    writeKey("story.dm_wazetax_left");
    dmCastleApproach();
  }

  function dmCastleFrontWithWazetax() {
    state.player.chapter = "dmCastleApproach";
    writeKey("story.dm_castle_front_wazetax");
    dmShowWazetaxChoices();
  }

  function dmShowWazetaxChoices() {
    const asked = state.player.flags.wazetaxQuestionsAsked || [];
    const choices = [];
    if (!asked.includes("who")) {
      choices.push(choice(t("choice.dm_ask_wazetax_who"), () => dmAskWazetax("who")));
    }
    if (!asked.includes("happened")) {
      choices.push(choice(t("choice.dm_ask_wazetax_happened"), () => dmAskWazetax("happened")));
    }
    if (!asked.includes("knows")) {
      choices.push(choice(t("choice.dm_ask_wazetax_knows"), () => dmAskWazetax("knows")));
    }
    choices.push(choice(t("choice.dm_hide_wazetax"), dmHideWazetax));
    setChoices(choices);
  }

  function dmAskWazetax(topic) {
    writeKey(`story.dm_wazetax_${topic}`);
    const asked = state.player.flags.wazetaxQuestionsAsked || [];
    if (!asked.includes(topic)) {
      asked.push(topic);
    }
    state.player.flags.wazetaxQuestionsAsked = asked;
    dmShowWazetaxChoices();
  }

  function dmHideWazetax() {
    state.player.flags.wazetaxHidden = true;
    unlock("no_one_left_in_cage");
    writeKey("story.dm_wazetax_hide");
    dmCastleApproach();
  }

  function dmCastleApproach() {
    state.player.chapter = "dmCastleApproach";
    writeKey("story.dm_castle_approach");
    const choices = [
      choice(t("choice.dm_main_gate"), dmCastleMainGate),
      choice(t("choice.dm_side_entrance"), dmCastleSideEntrance)
    ];
    if (state.player.flags.hasSilverMask && !state.player.flags.wearingSilverMask) {
      choices.push(choice(t("choice.dm_put_mask_on"), () => {
        const hadClaimedMaskPower = state.player.flags.maskPowerClaimed;
        state.player.flags.wearingSilverMask = true;
        applySilverMaskPower();
        if (hadClaimedMaskPower) {
          unlock("this_is_mine_now");
        }
        writeKey("story.dm_castle_put_on_mask");
        dmCastleMainGate();
      }));
    }
    setChoices(choices);
  }

  function dmCastleMainGate() {
    if (state.player.flags.wearingSilverMask) {
      writeKey("story.dm_castle_main_gate_mask");
      setChoices([choice(t("choice.dm_side_entrance"), dmCastleSideEntrance)]);
      return;
    }
    writeKey("story.dm_castle_main_gate_fight");
    setChoices([
      choice(t("choice.dm_if_win"), dmCastleSideEntrance),
      choice(t("choice.dm_if_lose"), () => dmGameOver("castle_courtyard"))
    ]);
  }

  function dmCastleSideEntrance() {
    state.player.health = state.player.maxHealth;
    restoreBetaMana();
    writeKey("story.dm_castle_side_entrance");
    saveGame();
    setChoices([choice(t("choice.dm_servant_quarters"), dmServantQuarters)]);
  }

  function dmServantQuarters() {
    writeKey("story.dm_servant_quarters");
    setChoices([choice(t("choice.dm_throne_room"), dmThroneRoom)]);
  }

  function dmThroneRoom() {
    writeKey("story.dm_doll_reveal");
    writeKey("story.dm_throne_room");
    if (state.player.flags.wearingSilverMask) {
      writeKey("story.dm_crown_temptation");
      setChoices([
        choice(t("choice.dm_succumb_mask"), dmSuccumbToMask),
        choice(t("choice.dm_resist_mask"), dmResistanceSummoning)
      ]);
      return;
    }
    if (state.player.flags.hasSilverMask) {
      writeKey("story.dm_crown_temptation");
      setChoices([
        choice(t("choice.dm_put_mask_on"), () => {
          state.player.flags.wearingSilverMask = true;
          state.player.flags.playerSuccumbedToMask = true;
          applySilverMaskPower();
          unlock("this_is_mine_now");
          dmMaskCorruptionEnding();
        }),
        choice(t("choice.dm_resist_mask"), dmResistanceSummoning)
      ]);
      return;
    }
    dmResistanceSummoning();
  }

  function dmSuccumbToMask() {
    state.player.flags.playerSuccumbedToMask = true;
    unlock("this_is_mine_now");
    dmMaskCorruptionEnding();
  }

  function dmMaskCorruptionEnding() {
    writeKey("story.dm_mask_corruption");
    dmGameOver("mask_corruption");
  }

  function dmResistanceSummoning() {
    if (state.player.flags.maskPowerClaimed) {
      unlock("false_confidence");
    }
    writeKey("story.dm_false_hydra_final");
    unlock("obliviarch_revealed");
    setChoices([choice(t("choice.dm_face_obliviarch"), dmObliviarchPhaseOne)]);
  }

  function dmObliviarchPhaseOne() {
    writeKey("story.dm_obliviarch_phase_one");
    setChoices([
      choice(t("choice.dm_if_win"), dmObliviarchPhaseTwoIntro),
      choice(t("choice.dm_if_lose"), () => {
        if (state.player.flags.hasMagistoneOrb && !state.player.flags.magistoneOrbSpent) {
          state.player.flags.magistoneOrbSpent = true;
          state.player.flags.hasMagistoneOrb = false;
          removeItem("magistone orb");
          writeKey("story.dm_magistone_orb_trigger");
          dmObliviarchPhaseTwoIntro();
          return;
        }
        dmGameOver("false_hydra");
      })
    ]);
  }

  function dmObliviarchPhaseTwoIntro() {
    writeKey("story.dm_obliviarch_phase_two_intro");
    setChoices([choice(t("choice.dm_face_obliviarch"), dmObliviarchPhaseTwo)]);
  }

  function dmObliviarchPhaseTwo() {
    writeKey("story.dm_obliviarch_phase_two");
    setChoices([
      choice(t("choice.dm_if_win"), dmFinalStrikePrompt),
      choice(t("choice.dm_if_lose"), () => dmGameOver("false_hydra"))
    ]);
  }

  function dmFinalStrikePrompt() {
    writeKey("story.dm_final_strike_prompt");
    setChoices([
      choice(t("choice.dm_attack_doll"), dmDestroyObliviarch),
      choice(t("choice.dm_attack_crown"), dmFinalStrikeWrongTarget),
      choice(t("choice.dm_attack_creature"), dmFinalStrikeWrongTarget)
    ]);
  }

  function dmFinalStrikeWrongTarget() {
    writeKey("story.dm_final_strike_wrong_target");
    dmFinalStrikePrompt();
  }

  function dmDestroyObliviarch() {
    state.player.flags.crownDestroyed = true;
    state.player.flags.dollDestroyed = true;
    state.player.flags.obliviarchDestroyed = true;
    state.player.flags.hasDoll = false;
    state.player.flags.dollInSack = false;
    removeItem("cracked doll");
    unlock("crownbreaker");
    writeKey("story.dm_obliviarch_destroyed");
    dmOrderEntersThroneRoom();
  }

  function dmOrderEntersThroneRoom() {
    state.player.flags.orderObservedPlayer = true;
    writeKey("story.dm_order_throne_room_arrival");
    if (state.player.flags.hasSilverMask && !state.player.flags.wearingSilverMask) {
      state.player.flags.hasSilverMask = false;
      removeItem("silver mask");
      writeKey("story.dm_order_destroys_stored_mask");
    } else {
      writeKey("story.dm_order_no_mask_comment");
    }
    writeKey("story.dm_order_cleanses_throne_room");
    setChoices([choice(t("choice.dm_leave_throne_room"), dmSurvivingRouteClosing)]);
  }

  function dmSurvivingRouteClosing() {
    writeKey("story.dm_surviving_route_closing");
    recordEnding();
    writeCurrentScore();
    saveGame();
    setChoices([
      choice(ui.submitScore, submitScore),
      choice(ui.leaderboard, showLeaderboard),
      choice(t("choice.main_menu"), showStart),
      currentStatusChoice()
    ]);
  }

  function dmGameOver(reason) {
    state.player.gameOverReason = reason;
    state.player.health = 0;
    gameOver();
  }

  function currentStatusChoice() {
    return choice(t("choice.current_status"), currentGameStatus, { preserveScene: true });
  }

  function currentGameStatus() {
    restoreChapterMusic(MUSIC_VOLUMES.low);
    state.currentStatusReturn = {
      storyParts: [...state.storyParts],
      choices: [...state.choices],
      showGameOverImage: state.showGameOverImage,
      gameOverImage: state.gameOverImage
    };
    writeKey("story.current_status", { version: VERSION }, true);
    setChoices([choice(t("choice.back"), restoreCurrentStatusReturn)]);
  }

  function restoreCurrentStatusReturn() {
    const previous = state.currentStatusReturn;
    if (!previous) {
      showStart();
      return;
    }
    state.currentStatusReturn = null;
    state.storyParts = previous.storyParts;
    state.showGameOverImage = previous.showGameOverImage;
    state.gameOverImage = previous.gameOverImage;
    setChoices(previous.choices, true);
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
      dollChoice();
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
        state.player.flags.pickedUpDoll = true;
        state.player.flags.dollInSack = true;
        addItem("cracked doll");
        writeKey("story.doll_grab");
        awardDecisionXp("doll_choice");
        continueChapter("districts");
      }),
      choice(t("choice.leave_doll"), () => {
        state.player.flags.hasDoll = false;
        state.player.flags.pickedUpDoll = false;
        state.player.flags.dollInSack = true;
        writeKey("story.doll_leave");
        awardDecisionXp("doll_choice");
        continueChapter("districts");
      })
    ]);
  }

  function districts(clear = false) {
    writeKey("story.districts", {}, clear);
    const choices = [
      choice(t("choice.barracks"), () => {
        awardDecisionXp("district_choice");
        barracks();
      }),
      choice(t("choice.merchant_district"), () => {
        awardDecisionXp("district_choice");
        merchant();
      })
    ];
    if (!state.player.flags.districtsRested) {
      choices.push(choice(t("choice.rest"), restAtDistricts));
    }
    choices.push(choice(t("choice.save"), saveGame));
    setChoices(choices);
  }

  function restAtDistricts() {
    state.player.flags.districtsRested = true;
    state.player.health = state.player.maxHealth;
    writeKey("story.districts_rest");
    districts();
  }

  function barracks() {
    setMusic("mystery");
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
      state.player.flags.cleanGetawayDistrict = true;
      searchLoot(() => continueChapter("residential"), "barracks");
    }
  }

  function barracksCombat() {
    writeKey("story.barracks_fight");
    startCombat(["orc", "orc", "orc"], "story.barracks_combat_victory", {
      attackersPerRound: 1,
      onWin: () => {
        writeKey("story.combat_loot_map");
        awardMap("barracks");
        continueChapter("residential");
      },
      onRun: () => continueChapter("residential")
    });
  }

  function merchant() {
    setMusic("mystery");
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
      state.player.flags.cleanGetawayDistrict = true;
      searchLoot(() => continueChapter("residential"), "merchant");
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
      state.player.flags.cleanGetawayDistrict = true;
      continueChapter("residential");
    }
  }

  function merchantCombat() {
    writeKey("story.city_assault");
    startCombat(["goblin", "goblin", "goblin", "goblin", "goblin", "orc", "orc"], "story.city_combat_victory", {
      attackersPerRound: 1,
      onWin: () => {
        writeKey("story.combat_loot_map");
        awardMap("merchant");
        continueChapter("residential");
      },
      onRun: () => continueChapter("residential")
    });
  }

  function searchLoot(next, source = "") {
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
      if (source === "merchant") {
        unlock("customer_service");
      }
    } else {
      awardMap(source);
    }
    setChoices([choice(ui.moveOn, next)]);
  }

  function awardMap(source = "") {
    state.player.flags.hasThroneMap = true;
    unlock("map_goblin");
    if (state.player.flags.hasPartialMap) {
      state.player.flags.hasPartialMap = false;
      removeItem("torn bridge map");
    }
    if (source === "merchant") {
      unlock("customer_service");
    }
    writeKey("story.throne_map", { directions: bridgeDirectionList() });
  }

  function randomBridgeRoute() {
    const route = [...BRIDGE_DIRECTIONS];
    for (let i = route.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [route[i], route[j]] = [route[j], route[i]];
    }
    return route;
  }

  function isValidBridgeRoute(route) {
    if (!Array.isArray(route) || route.length !== BRIDGE_DIRECTIONS.length) {
      return false;
    }
    const expected = [...BRIDGE_DIRECTIONS].sort().join("|");
    return [...route].sort().join("|") === expected;
  }

  function bridgeRoute() {
    if (!state.player.flags) {
      state.player.flags = {};
    }
    if (!isValidBridgeRoute(state.player.flags.bridgeRoute)) {
      state.player.flags.bridgeRoute = randomBridgeRoute();
    }
    return state.player.flags.bridgeRoute;
  }

  function bridgeDirectionLabel(direction) {
    return t(`choice.${direction}`).toUpperCase();
  }

  function bridgeDirectionList(count = BRIDGE_DIRECTIONS.length) {
    return bridgeRoute().slice(0, count).map(bridgeDirectionLabel).join(", ");
  }

  function fadeBridgeMapFromLog() {
    const routeText = bridgeDirectionList();
    const firstTwo = bridgeDirectionList(2);
    const mapPhrases = [
      "safe bridge path",
      "safe route through the bridge traps",
      "first two directions",
      "first two safe directions",
      "camino seguro del puente",
      "ruta segura entre las trampas",
      "primeras dos direcciones",
      "primeras dos direcciones seguras"
    ];
    state.logParts = state.logParts.filter((part) => {
      const lower = part.toLowerCase();
      return !part.includes(routeText) && !part.includes(firstTwo) && !mapPhrases.some((phrase) => lower.includes(phrase));
    });
  }

  function residential(clear = false) {
    writeKey("story.residential_enter", {}, clear);
    writeKey("story.residential");
    setChoices(residentialChoices());
  }

  function residentialChoices() {
    const choices = [];
    if (!state.player.flags.largeManorCleared) {
      choices.push(choice(t("choice.large_manor"), () => {
        awardDecisionXp("residential_choice");
        largeManor();
      }));
    }
    if (!state.player.flags.mimicHouseCleared) {
      choices.push(choice(t("choice.large_house"), () => {
        awardDecisionXp("residential_choice");
        mimicHouse();
      }));
    }
    if (!state.player.flags.smallShackCleared) {
      choices.splice(1, 0, choice(t("choice.small_shack"), () => {
        awardDecisionXp("residential_choice");
        smallShack();
      }));
    }
    if (!state.player.flags.bridgeRested) {
      choices.push(choice(t("choice.rest"), restBeforeBridge));
    }
    choices.push(
      choice(t("choice.proceed_bridge"), () => goBridge()),
      choice(t("choice.save"), saveGame)
    );
    return choices;
  }

  function restBeforeBridge() {
    state.player.flags.bridgeRested = true;
    state.player.health = state.player.maxHealth;
    writeKey("story.residential_rest");
    setChoices(residentialChoices());
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
        choice(t("choice.return_street"), returnToResidentialStreet)
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
      choice(t("choice.return_street"), returnToResidentialStreet)
    ]);
  }

  function manorGroupKill() {
    writeKey(`story.manor_group_kill_${state.player.class}`);
    state.player.flags.cleanGetawayDistrict = false;
    unlock("group_kill");
    ensureScoreState();
    state.player.score.fightsWon += 1;
    awardXp((monsterStats.goblin.xp * 5) + (monsterStats.orc.xp * 2), "combat");
    manorWin();
  }

  function manorCombat() {
    state.player.flags.cleanGetawayDistrict = false;
    startCombat(["goblin", "goblin", "goblin", "goblin", "goblin", "orc", "orc"], "story.manor_combat_victory", {
      attackersPerRound: 1,
      onWin: manorWin,
      onRun: returnToResidentialStreet
    });
  }

  function manorWin() {
    writeKey("story.manor_win");
    setChoices([choice(t("choice.loot_manor"), manorLoot)]);
  }

  function manorLoot() {
    writeKey("story.manor_loot");
    setChoices(manorLootChoices(!state.player.flags.manorRested));
  }

  function manorLootChoices(includeRest) {
    const choices = [
      choice(t("choice.use_keys_chest"), manorChestKeys),
      choice(t("choice.leave_found"), completeLargeManor),
      choice(t("choice.store_keys_chest"), () => {
        addItem("unmarked keys");
        addItem("small black chest");
        writeKey("story.manor_store_chest");
        setChoices([choice(t("choice.leave_house"), completeLargeManor)]);
      })
    ];
    if (includeRest) {
      choices.push(choice(t("choice.rest"), manorRest));
    }
    return choices;
  }

  function manorRest() {
    state.player.flags.manorRested = true;
    state.player.health = state.player.maxHealth;
    writeKey("story.manor_rest");
    setChoices(manorLootChoices(false));
  }

  function manorChestKeys() {
    writeKey("story.manor_chest_keys");
    const keys = ["blue", "yellow", "red", "black", "iron", "gold", "silver", "green"];
    setChoices(keys.map((key) => choice(t(`choice.${key}_key`), () => {
      if (key === "red") {
        unlock("correct_chest_key");
        writeKey("story.manor_chest_unlock");
        setChoices([choice(t("choice.open_chest"), () => {
          if (!state.player.flags.hasMagistoneOrb && !state.player.flags.magistoneOrbSpent) {
            state.player.flags.hasMagistoneOrb = true;
            addItem("magistone orb");
          }
          writeKey("story.manor_magistone_orb");
          setChoices([choice(t("choice.leave_house"), completeLargeManor)]);
        })]);
      } else {
        writeKey("story.manor_chest_trap");
        state.player.gameOverReason = "manor_chest";
        state.player.health = 0;
        gameOver();
      }
    })));
  }

  function completeLargeManor() {
    state.player.flags.largeManorCleared = true;
    returnToResidentialStreet();
  }

  function smallShack() {
    writeKey("story.small_shack");
    state.player.flags.cleanGetawayDistrict = false;
    startCombat(["gremlin", "ghoul"], "story.small_shack_win", {
      attackersPerRound: 2,
      onWin: () => {
        state.player.flags.smallShackCleared = true;
        setChoices([
          choice(t("choice.return_street"), () => continueChapter("residential", true)),
          choice(t("choice.proceed_bridge"), goBridge)
        ]);
      },
      onRun: goBridge
    });
  }

  function mimicHouse() {
    writeKey("story.mimic_house");
    setChoices([
      choice(t("choice.burn_house"), () => {
        unlock("pyromaniac");
        writeKey("story.mimic_house_burn");
        setChoices([choice(t("choice.leave_house"), completeMimicHouse)]);
      }),
      choice(t("choice.leave_immediately"), () => {
        writeKey("story.mimic_house_leave");
        completeMimicHouse();
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
    state.player.flags.cleanGetawayDistrict = false;
    startCombat(["mimic"], "story.mimic_house_fight_one_win", {
      attackersPerRound: 1,
      deathReason: "mimic",
      onWin: () => {
        writeKey("story.mimic_house_second_wave");
        setChoices([
          choice(t("choice.fight"), mimicFightTwo),
          choice(t("choice.flee"), mimicFlee)
        ]);
      },
      onRun: mimicFlee
    });
  }

  function mimicFightTwo() {
    startCombat(["mimic", "mimic"], "story.mimic_house_fight_two_win", {
      attackersPerRound: 2,
      deathReason: "mimic",
      onWin: () => {
        if (!state.player.flags.hasMagistoneOrb && !state.player.flags.magistoneOrbSpent) {
          state.player.flags.hasMagistoneOrb = true;
          addItem("magistone orb");
        }
        if (state.player.flags.hasThroneMap) {
          writeKey("story.mimic_house_escape_full_map");
        } else if (!state.player.flags.hasPartialMap) {
          state.player.flags.hasPartialMap = true;
          addItem("torn bridge map");
          writeKey("story.mimic_house_escape", {
            first: bridgeDirectionLabel(bridgeRoute()[0]),
            second: bridgeDirectionLabel(bridgeRoute()[1])
          });
        }
        mimicHouseTongueCatch();
      },
      onRun: mimicFlee
    });
  }

  function mimicHouseTongueCatch() {
    writeKey("story.mimic_house_tongue_catch");
    setChoices([
      choice(t("choice.cut_tongue"), () => resolveMimicTongueEscape("cut", 0.4)),
      choice(t("choice.burn_tongue"), () => resolveMimicTongueEscape("burn", 0.6))
    ]);
  }

  function resolveMimicTongueEscape(method, successChance) {
    if (Math.random() < successChance) {
      writeKey(`story.mimic_house_tongue_${method}_success`);
      unlock("mimic_survivor");
      setChoices([choice(t("choice.return_street"), completeMimicHouse)]);
      return;
    }
    writeKey(`story.mimic_house_tongue_${method}_fail`);
    state.player.gameOverReason = "mimic";
    state.player.health = 0;
    gameOver();
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
      choice(mimicFireChoiceLabel(), () => {
        writeKey(`story.mimic_house_fire_${mimicFireVariant()}`);
        setChoices([choice(t("choice.return_street"), completeMimicHouse)]);
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
        unlock("ale_chemistry");
        writeKey("story.mimic_house_ale");
        setChoices([choice(t("choice.return_street"), completeMimicHouse)]);
      }));
    }
    setChoices(options);
  }

  function mimicFireVariant() {
    if (!state.player) {
      return "spark";
    }
    if (state.player.class === "warrior") {
      return "torch";
    }
    if (state.player.class === "ranger") {
      return "flare";
    }
    if (state.player.class === "scholar") {
      return "cantrip";
    }
    if (state.player.class === "dwarf") {
      return "lantern";
    }
    if (state.player.betaCustom) {
      if (state.player.class === "ranger" || state.player.weaponKey === "longbow") {
        return "flare";
      }
      if (state.player.class === "scholar" || state.player.weaponKey === "eldritch_focus") {
        return "cantrip";
      }
    }
    return "spark";
  }

  function mimicFireChoiceLabel() {
    return t(`choice.mimic_fire_${mimicFireVariant()}`);
  }

  function completeMimicHouse() {
    state.player.flags.mimicHouseCleared = true;
    returnToResidentialStreet();
  }

  function returnToResidentialStreet() {
    continueChapter("residential", true);
  }

  function goBridge() {
    if (!state.player.flags.bridgeXpAwarded) {
      state.player.flags.bridgeXpAwarded = true;
      awardDecisionXp("bridge");
    }
    continueChapter("bridge");
  }

  function bridge(clear = false) {
    setMusic("epic");
    let text = t("story.bridge");
    if (state.player.flags.hasThroneMap) {
      text += t("story.bridge_has_map", { directions: bridgeDirectionList() });
    } else if (state.player.flags.hasPartialMap) {
      text += t("story.bridge_partial_map", {
        first: bridgeDirectionLabel(bridgeRoute()[0]),
        second: bridgeDirectionLabel(bridgeRoute()[1])
      });
    } else {
      text += t("story.bridge_no_map");
    }
    write(text, clear);
    setChoices([
      choice(t("choice.sneak_bridge"), bridgeSneak),
      choice(t("choice.fight_bridge_orcs"), bridgeFightOrcs),
      choice(t("choice.save"), saveGame)
    ]);
  }

  function bridgeFightOrcs() {
    writeKey("story.bridge_orc_fight_start");
    startCombat(["orc", "orc", "orc", "orc"], "story.bridge_orc_fight_defeated", {
      attackersPerRound: 2,
      deathReason: "combat",
      onWin: bridgeNavigationStart
    });
  }

  function bridgeSneak() {
    setMusic("mystery");
    writeKey("story.bridge_sneak_start");
    if (rollD20("sneak") >= 13) {
      writeKey("story.bridge_sneak_success");
      if (state.player.flags.cleanGetawayDistrict) {
        unlock("clean_getaway");
      }
      bridgeNavigationStart();
      return;
    }
    writeKey("story.bridge_sneak_fail");
    startCombat(["orc", "goblin", "goblin"], "story.bridge_patrol_defeated", {
      attackersPerRound: 2,
      deathReason: "combat",
      onWin: bridgeNavigationStart
    });
  }

  function bridgeNavigationStart() {
    setMusic("mystery");
    state.player.flags.bridgeNavigationStep = 0;
    fadeBridgeMapFromLog();
    writeKey("story.bridge_navigation_start", {}, true);
    showBridgeNavigationChoices();
  }

  function showBridgeNavigationChoices() {
    const step = state.player.flags.bridgeNavigationStep + 1;
    if (step > 1) {
      writeKey("story.bridge_navigation_step", { step });
    }
    setChoices(BRIDGE_DIRECTIONS.map((direction) => (
      choice(t(`choice.${direction}`), () => chooseBridgeDirection(direction))
    )));
  }

  function chooseBridgeDirection(direction) {
    const route = bridgeRoute();
    const step = state.player.flags.bridgeNavigationStep || 0;
    if (direction !== route[step]) {
      unlock("wrong_turn_right_lesson");
      writeKey("story.bridge_wrong");
      state.player.flags.bridgeWrongTurns = (state.player.flags.bridgeWrongTurns || 0) + 1;
      if (state.player.flags.bridgeWrongTurns === 1) {
        const damage = rollDie(10) + rollDie(10) + 8;
        state.player.health = Math.max(0, state.player.health - damage);
        write(`The old bridge trap snaps shut, but you wrench yourself free before it finishes the job. You take ${damage} damage and stumble back to the start of the trapped path.`);
        if (state.player.health <= 0) {
          state.player.gameOverReason = "bridge_trap";
          gameOver();
          return;
        }
        state.player.flags.bridgeNavigationStep = 0;
        showBridgeNavigationChoices();
        return;
      }
      state.player.gameOverReason = "bridge_trap";
      state.player.health = 0;
      gameOver();
      return;
    }
    state.player.flags.bridgeNavigationStep = step + 1;
    if (state.player.flags.bridgeNavigationStep >= route.length) {
      writeKey("story.bridge_success");
      unlock("bridge_cleared");
      if (state.player.flags.hasThroneMap) {
        unlock("bridge_scholar");
      } else if (state.player.flags.hasPartialMap) {
        unlock("cartographers_nightmare");
      } else {
        unlock("blind_crossing");
      }
      warehouseApproach();
      return;
    }
    writeKey("story.bridge_quiet");
    showBridgeNavigationChoices();
  }

  function warehouseApproach(clear = false) {
    state.player.chapter = "warehouseApproach";
    setMusic("mystery");
    writeKey("story.warehouse_approach", {}, clear);
    const choices = [];
    if (!state.player.flags.warehouseRested) {
      choices.push(choice(t("choice.rest"), restBeforeWarehouse));
    }
    choices.push(
      choice(t("choice.enter_warehouse"), warehouseRitual),
      choice(t("choice.save"), saveGame)
    );
    setChoices(choices);
  }

  function restBeforeWarehouse() {
    state.player.flags.warehouseRested = true;
    state.player.health = state.player.maxHealth;
    restoreBetaMana();
    writeKey("story.warehouse_rest");
    warehouseApproach();
  }

  function warehouseRitual() {
    state.player.chapter = "warehouse";
    setMusic("mystery");
    writeKey("story.warehouse_enter");
    if (state.player.flags.warehouseStage === "guards_defeated") {
      ritualLeaderRage();
      return;
    }
    if (state.player.flags.warehouseStage === "leader_defeated") {
      silverMaskChoice();
      return;
    }
    if (state.player.flags.warehouseStage === "mask_resolved") {
      warehouseAfterMask();
      return;
    }
    if (state.player.flags.warehouseStage === "cleared") {
      bridgeEnd(true);
      return;
    }
    startWarehouseGuardCombat();
  }

  function startWarehouseGuardCombat() {
    startCombat(["cultist", "cultist", "cultist"], "story.warehouse_cultists_defeated", {
      attackersPerRound: 2,
      deathReason: "warehouse",
      onWin: () => {
        state.player.flags.warehouseStage = "guards_defeated";
        ritualLeaderRage();
      },
      onRun: warehouseRunCaught
    });
  }

  function warehouseRunCaught() {
    writeKey("story.warehouse_run_caught");
    setChoices([
      choice(t("choice.fight_back"), warehouseFightBack),
      choice(t("choice.watch_ritual"), warehouseWatchRitual)
    ]);
  }

  function warehouseFightBack() {
    writeKey("story.warehouse_fight_back");
    startWarehouseGuardCombat();
  }

  function warehouseWatchRitual() {
    if (tryWarlockHardSave("The silver charm at your throat cracks with a sharp flash. Cal tears his mind away from the ritual's pull and staggers back to his feet.")) {
      warehouseRunCaught();
      return;
    }
    state.player.gameOverReason = "warehouse";
    state.player.health = 0;
    writeKey("story.warehouse_watch_ritual");
    gameOver();
  }

  function ritualLeaderRage() {
    setMusic("combat", { volume: MUSIC_VOLUMES.combat });
    if (state.player.flags.hasDoll) {
      writeKey("story.warehouse_leader_rage_known_doll");
    } else if (state.player.flags.dollInSack) {
      writeKey("story.warehouse_leader_rage_hidden_doll");
    } else {
      writeKey("story.warehouse_leader_rage_no_doll");
    }
    startCombat(["ritualLeader", "cultist"], "story.warehouse_leader_defeated", {
      attackersPerRound: 2,
      deathReason: "warehouse",
      onWin: () => {
        state.player.flags.warehouseStage = "leader_defeated";
        unlock("cult_breaker");
        silverMaskChoice();
      }
    });
  }

  function silverMaskChoice() {
    setMusic("mystery", { volume: MUSIC_VOLUMES.low });
    writeKey("story.silver_mask_choice");
    setChoices([
      choice(t("choice.leave_mask"), confirmLeaveMask),
      choice(t("choice.store_mask"), storeSilverMask),
      choice(t("choice.wear_mask"), wearSilverMask)
    ]);
  }

  function confirmLeaveMask() {
    writeKey("story.silver_mask_leave_confirm");
    setChoices([
      choice(t("choice.leave_mask_confirm"), leaveSilverMask),
      choice(t("choice.store_mask"), storeSilverMask),
      choice(t("choice.wear_mask"), wearSilverMask)
    ]);
  }

  function leaveSilverMask() {
    state.player.flags.hasSilverMask = false;
    state.player.flags.wearingSilverMask = false;
    state.player.flags.warehouseStage = "mask_resolved";
    writeKey("story.silver_mask_left");
    warehouseAfterMask();
  }

  function storeSilverMask() {
    state.player.flags.hasSilverMask = true;
    state.player.flags.wearingSilverMask = false;
    state.player.flags.warehouseStage = "mask_resolved";
    addItem("silver mask");
    writeKey("story.silver_mask_stored");
    warehouseAfterMask();
  }

  function wearSilverMask() {
    state.player.flags.hasSilverMask = true;
    state.player.flags.wearingSilverMask = true;
    state.player.flags.warehouseStage = "mask_resolved";
    applySilverMaskPower();
    addItem("silver mask");
    writeKey("story.silver_mask_worn");
    warehouseAfterMask();
  }

  function applySilverMaskPower() {
    state.player.flags.maskCorruption = Math.max(state.player.flags.maskCorruption || 0, 1);
    unlock("mask_on");
    if (!state.player.flags.maskPowerClaimed) {
      state.player.maxHealth += 6;
      state.player.health += 6;
      state.player.upgrades.damage += 3;
      state.player.flags.maskPowerClaimed = true;
    }
  }

  function warehouseAfterMask() {
    setMusic("mystery");
    writeKey("story.warehouse_ritual_surges");
    setChoices([
      choice(t("choice.leave_warehouse"), warehouseLeave),
      choice(t("choice.stop_ritual"), warehouseStopRitual),
      choice(t("choice.jump_hole"), warehouseJumpHole)
    ]);
  }

  function warehouseLeave() {
    writeKey("story.warehouse_leave");
    setMusic("silence");
    setChoices([
      choice(t("choice.stand_ground"), () => falseHydraInterruption("stand"), { detail: "Face the creature for as long as your nerve holds." }),
      choice(t("choice.run_for_life"), () => falseHydraInterruption("run"), { detail: "Run from the creature before the bridge gives out." })
    ]);
  }

  function falseHydraInterruption(reaction = "") {
    setMusic("silence");
    if (reaction === "stand") {
      write("You plant your feet and raise your weapon. The choice is yours, even if the world has other plans.");
    } else if (reaction === "run") {
      write("You turn and run hard enough for your lungs to burn. The choice is yours, even if the world has other plans.");
    }
    writeKey("story.false_hydra_interruption");
    if (state.player.flags.wearingSilverMask) {
      writeKey("story.order_mask_warning");
      state.player.flags.wearingSilverMask = false;
      state.player.flags.hasSilverMask = true;
      addItem("silver mask");
    }
    writeKey("story.order_arrival");
    state.player.flags.orderQuestionsAsked = [];
    showOrderQuestionChoices();
  }

  function showOrderQuestionChoices() {
    const asked = state.player.flags.orderQuestionsAsked || [];
    const questions = [
      ["who", "choice.ask_who_order"],
      ["monster", "choice.ask_monster"],
      ["why", "choice.ask_why_here"]
    ];
    setChoices(
      questions
        .filter(([topic]) => !asked.includes(topic))
        .map(([topic, label]) => choice(t(label), () => orderDialogue(topic)))
    );
  }

  function orderDialogue(topic) {
    setMusic("epic", { volume: MUSIC_VOLUMES.low });
    writeKey(`story.order_dialogue_${topic}`);
    const asked = state.player.flags.orderQuestionsAsked || [];
    if (!asked.includes(topic)) {
      asked.push(topic);
    }
    state.player.flags.orderQuestionsAsked = asked;
    if (asked.length < 3) {
      showOrderQuestionChoices();
      return;
    }
    writeKey("story.order_departure");
    if (state.player.flags.wearingSilverMask) {
      writeKey("story.order_mask_missed_one");
    }
    bridgeEnd();
  }

  function warehouseStopRitual() {
    setMusic("silence");
    writeKey("story.warehouse_stop_ritual");
    setChoices([choice(t("choice.next"), falseHydraInterruption)]);
  }

  function warehouseJumpHole() {
    writeKey("story.warehouse_jump_hole");
    if (tryWarlockHardSave("Eldritch force catches Cal at the edge of the impossible fall and throws him back onto the warehouse floor. The charm goes cold and silent.")) {
      warehouseAfterMask();
      return;
    }
    state.player.gameOverReason = "ritual_hole";
    state.player.health = 0;
    gameOver();
  }

  function bridgeEnd(clear = false) {
    setMusic("ambient");
    state.player.flags.warehouseStage = "cleared";
    state.player.chapter = "bridgeEnd";
    writeKey("story.bridge_temp_end", {}, clear);
    if (!state.player.flags.bridgeEndRested) {
      state.player.flags.bridgeEndRested = true;
      state.player.health = state.player.maxHealth;
      restoreBetaMana();
      writeKey("story.bridge_end_rest");
    }
    resolveBridgeEndMask();
    checkOverprepared();
    unlock("warehouse_survived");
    recordEnding();
    writeCurrentScore();
    saveGame();
    showBridgeEndChoices();
  }

  function resolveBridgeEndMask() {
    if (state.player.flags.bridgeEndMaskResolved) {
      return;
    }
    if (state.player.flags.wearingSilverMask) {
      writeKey("story.silver_mask_reworn");
      state.player.flags.bridgeEndMaskResolved = true;
    } else if (!state.player.flags.hasSilverMask) {
      state.player.flags.bridgeEndMaskResolved = true;
    }
  }

  function showBridgeEndChoices() {
    const choices = [];
    if (state.player.flags.hasSilverMask && !state.player.flags.wearingSilverMask) {
      choices.push(choice(t("choice.put_mask_on"), putSilverMaskBackOn));
    }
    if (!state.player.flags.bridgeEndRested) {
      choices.push(choice(t("choice.rest"), restAfterBridge));
    }
    choices.push(
      choice(t("choice.move_orc_camps"), moveToOrcCamps),
      currentStatusChoice(),
      choice(ui.submitScore, submitScore),
      choice(ui.leaderboard, showLeaderboard),
      choice(t("choice.main_menu"), showStart),
      choice(t("choice.save"), saveGame)
    );
    setChoices(choices);
  }

  function restAfterBridge() {
    state.player.flags.bridgeEndRested = true;
    state.player.health = state.player.maxHealth;
    restoreBetaMana();
    writeKey("story.bridge_end_rest");
    showBridgeEndChoices();
  }

  function putSilverMaskBackOn() {
    const hadClaimedMaskPower = state.player.flags.maskPowerClaimed;
    state.player.flags.wearingSilverMask = true;
    state.player.flags.bridgeEndMaskResolved = true;
    applySilverMaskPower();
    if (hadClaimedMaskPower) {
      unlock("this_is_mine_now");
    }
    writeKey("story.silver_mask_put_on_after_order");
    writeCurrentScore();
    showBridgeEndChoices();
  }

  function moveToOrcCamps() {
    continueChapter("orcCamps", true);
  }

  function orcCamps(clear = false) {
    state.player.chapter = "orcCamps";
    writeKey("story.orc_camps_preview", {}, clear);
    setChoices([choice(t("choice.approach_camps"), orcCampsApproach)]);
  }

  function orcCampsApproach() {
    setMusic("mystery");
    writeKey("story.orc_camps_approach");
    orcCampOuterChoice();
  }

  function orcCampOuterChoice() {
    writeKey("story.orc_camp_outer_choice");
    setChoices([
      choice(t("choice.sneak_tents"), orcCampSneakTents),
      choice(t("choice.sneak_barrels"), orcCampSneakBarrels),
      choice(t("choice.fight_fire_orcs"), orcCampFireFight),
      choice(t("choice.save"), saveGame)
    ]);
  }

  function orcSceneRoll() {
    const roll = d20();
    writeKey("story.orc_camp_roll", { roll });
    return roll;
  }

  function orcCampSneakTents() {
    const roll = orcSceneRoll();
    if (roll >= 9) {
      writeKey("story.orc_tents_success");
      orcCampInnerPath();
      return;
    }
    writeKey("story.orc_tents_fail");
    startCombat(["orc"], "story.orc_tent_orc_defeated", {
      attackersPerRound: 1,
      onWin: orcCampInnerPath,
      onRun: orcCampInnerPath
    });
  }

  function orcCampSneakBarrels() {
    const roll = orcSceneRoll();
    if (roll >= 15) {
      writeKey("story.orc_barrels_success");
      orcCampInnerPath();
      return;
    }
    writeKey("story.orc_barrels_fail");
    startCombat(["orc"], "story.orc_barrel_orc_defeated", {
      attackersPerRound: 1,
      onWin: orcCampInnerPath,
      onRun: orcCampInnerPath
    });
  }

  function orcCampFireFight() {
    writeKey("story.orc_fire_fight_start");
    startCombat(["orc", "orc", "orc"], "story.orc_fire_first_wave_defeated", {
      attackersPerRound: 2,
      onWin: orcCampFireReinforcements,
      onRun: orcCampInnerPath
    });
  }

  function orcCampFireReinforcements() {
    startCombat(["orc"], "story.orc_fire_second_wave_defeated", {
      attackersPerRound: 1,
      onWin: orcCampInnerPath,
      onRun: orcCampInnerPath
    });
  }

  function orcCampInnerPath() {
    state.player.flags.orcCampOuterResolved = true;
    writeKey("story.orc_camp_inner_path");
    orcPartyArea();
  }

  function orcPartyArea() {
    writeKey("story.orc_party_area");
    setChoices([
      choice(t("choice.sneak_past"), orcPartySneak),
      choice(t("choice.create_distraction"), orcPartyDistraction),
      choice(t("choice.fight_party_orcs"), orcPartyFight),
      choice(t("choice.save"), saveGame)
    ]);
  }

  function orcPartySneak() {
    writeKey("story.orc_party_sneak");
    orcCages();
  }

  function orcPartyDistraction() {
    writeKey("story.orc_party_distraction_choice");
    const choices = [];
    if (!state.player.flags.aleBarrelUsed) {
      choices.push(choice(t("choice.light_ale_barrel"), orcPartyAleBarrel));
    }
    if (!state.player.flags.partyRockTried) {
      choices.push(choice(t("choice.throw_rock"), orcPartyThrowRock));
    }
    choices.push(choice(t("choice.back"), orcPartyArea));
    setChoices(choices);
  }

  function orcPartyAleBarrel() {
    state.player.flags.aleBarrelUsed = true;
    const roll = orcSceneRoll();
    if (roll <= 4) {
      const damage = rollDie(8) + 4;
      state.player.health = Math.max(0, state.player.health - damage);
      writeKey("story.orc_party_ale_hurt", { damage });
      if (state.player.health <= 0) {
        state.player.gameOverReason = "ale_explosion";
        gameOver();
        return;
      }
    }
    if (roll >= 11) {
      unlock("osha_incident");
      writeKey("story.orc_party_ale_success");
      orcCages();
      return;
    }
    writeKey("story.orc_party_ale_fail");
    orcPartyArea();
  }

  function orcPartyThrowRock() {
    state.player.flags.partyRockTried = true;
    writeKey("story.orc_party_rock_fail");
    orcPartyArea();
  }

  function orcPartyFight() {
    writeKey("story.orc_party_fight_start");
    startCombat(["orc", "orc", "orc"], "story.orc_party_vanguard_win", {
      attackersPerRound: 2,
      deathReason: "orc_party",
      onWin: orcPartyFightChoice,
      onRun: orcCages
    });
  }

  function orcPartyFightChoice() {
    writeKey("story.orc_party_fight_warning");
    setChoices([
      choice(t("choice.fall_back_to_cages"), orcPartyFallBack),
      choice(t("choice.keep_fighting_party"), orcPartyFightDisaster)
    ]);
  }

  function orcPartyFallBack() {
    unlock("union_violation");
    orcCages();
  }

  function orcPartyFightDisaster() {
    unlock("aggressively_educational");
    writeKey("story.orc_party_fight_disaster");
    startCombat(Array(30).fill("orc"), "story.orc_party_win", {
      attackersPerRound: 6,
      deathReason: "orc_party",
      onWin: orcCages,
      onRun: orcCages
    });
  }

  function orcCages() {
    state.player.flags.orcCampPartyResolved = true;
    writeKey("story.orc_cages");
    setChoices([
      choice(t("choice.rescue_prisoner"), rescueWazetax),
      choice(t("choice.leave_prisoner"), leaveWazetax)
    ]);
  }

  function rescueWazetax() {
    state.player.flags.rescuedWazetax = true;
    state.player.flags.wazetaxHidden = false;
    state.player.flags.wazetaxQuestionsAsked = [];
    unlock("free_wazetax");
    writeKey("story.wazetax_rescue");
    castleFrontWithWazetax();
  }

  function leaveWazetax() {
    state.player.flags.rescuedWazetax = false;
    unlock("not_my_problem");
    writeKey("story.wazetax_left");
    castleApproach();
  }

  function castleFrontWithWazetax() {
    state.player.chapter = "castleApproach";
    writeKey("story.castle_front_wazetax");
    showWazetaxChoices();
  }

  function showWazetaxChoices() {
    const asked = state.player.flags.wazetaxQuestionsAsked || [];
    const choices = [];
    if (!asked.includes("who")) {
      choices.push(choice(t("choice.ask_wazetax_who"), () => askWazetax("who")));
    }
    if (!asked.includes("happened")) {
      choices.push(choice(t("choice.ask_wazetax_happened"), () => askWazetax("happened")));
    }
    if (!asked.includes("knows")) {
      choices.push(choice(t("choice.ask_wazetax_knows"), () => askWazetax("knows")));
    }
    choices.push(choice(t("choice.wazetax_hide"), hideWazetax));
    setChoices(choices);
  }

  function askWazetax(topic) {
    writeKey(`story.wazetax_${topic}`);
    const asked = state.player.flags.wazetaxQuestionsAsked || [];
    if (!asked.includes(topic)) {
      asked.push(topic);
    }
    state.player.flags.wazetaxQuestionsAsked = asked;
    showWazetaxChoices();
  }

  function hideWazetax() {
    state.player.flags.wazetaxHidden = true;
    unlock("no_one_left_in_cage");
    writeKey("story.wazetax_hide");
    castleApproach();
  }

  function castleExteriorEndpoint(clear = false) {
    state.player.chapter = "castleApproach";
    setMusic("mystery", { volume: MUSIC_VOLUMES.low });
    writeKey(state.player.flags.rescuedWazetax ? "story.castle_exterior_endpoint_wazetax" : "story.castle_exterior_endpoint", {}, clear);
    recordEnding();
    writeCurrentScore();
    saveGame();
    setChoices([
      choice(ui.submitScore, submitScore),
      choice(ui.leaderboard, showLeaderboard),
      currentStatusChoice(),
      choice(t("choice.main_menu"), showStart),
      choice(t("choice.save"), saveGame)
    ]);
  }

  function castleApproach(clear = false) {
    state.player.chapter = "castleApproach";
    setMusic("mystery");
    writeKey("story.castle_approach", {}, clear);
    if (state.player.flags.hasSilverMask || state.player.flags.wearingSilverMask) {
      writeKey("story.castle_approach_mask_whisper");
    }
    const choices = [
      choice(t("choice.enter_main_gate"), castleMainGate),
      choice(t("choice.look_other_way"), castleEntranceChoice)
    ];
    if (state.player.flags.hasSilverMask && !state.player.flags.wearingSilverMask) {
      choices.push(choice(t("choice.put_mask_on"), castlePutOnMask));
    }
    choices.push(choice(t("choice.save"), saveGame));
    setChoices(choices);
  }

  function castlePutOnMask() {
    const hadClaimedMaskPower = state.player.flags.maskPowerClaimed;
    state.player.flags.wearingSilverMask = true;
    applySilverMaskPower();
    if (hadClaimedMaskPower) {
      unlock("this_is_mine_now");
    }
    writeKey("story.castle_put_on_mask");
    castleApproach();
  }

  function castleEntranceChoice() {
    writeKey("story.castle_entrance_choice");
    setChoices([
      choice(t("choice.return_main_entrance"), castleApproach),
      choice(t("choice.take_side_entrance"), castleSideEntrance)
    ]);
  }

  function castleMainGate() {
    if (state.player.flags.wearingSilverMask) {
      writeKey("story.castle_main_gate_mask");
      setChoices([choice(t("choice.order_aside"), castleMainGateMaskSuccess)]);
      return;
    }
    writeKey("story.castle_main_gate_no_mask");
    startCombat(["ritualLeader", "ritualLeader", "ritualLeader", "orc", "orc", "orc", "orc", "orc", "orc"], "story.castle_courtyard_win", {
      attackersPerRound: 5,
      deathReason: "castle_courtyard",
      onWin: castleMainHall,
      onRun: () => {
        state.player.gameOverReason = "castle_courtyard";
        state.player.health = 0;
        gameOver();
      }
    });
  }

  function castleMainGateMaskSuccess() {
    writeKey("story.castle_main_gate_mask_success");
    castleMainHall();
  }

  function castleMainHall() {
    writeKey("story.castle_main_hall");
    setChoices([choice(t("choice.continue_servants"), castleServantQuarters)]);
  }

  function castleSideEntrance() {
    state.player.flags.castleSideRested = true;
    state.player.health = state.player.maxHealth;
    restoreBetaMana();
    writeKey("story.castle_side_entrance");
    saveGame();
    setChoices([choice(t("choice.enter_side_passage"), castleKitchen)]);
  }

  function castleKitchen() {
    state.player.flags.hasCastleSupplies = true;
    state.player.supplies += 2;
    writeKey("story.castle_kitchen");
    setChoices([choice(t("choice.continue_storage"), castleStorage)]);
  }

  function castleStorage() {
    state.player.gold += 30;
    addStackableItem("health potion", 2);
    writeKey("story.castle_storage");
    setChoices([choice(t("choice.leave_storage"), castleServantQuarters)]);
  }

  function castleServantQuarters() {
    writeKey("story.castle_servant_quarters");
    setChoices([
      choice(t("choice.search_empty_room"), servantRoomEmpty),
      choice(t("choice.inspect_bodies"), servantRoomBodies),
      choice(t("choice.open_barred_door"), servantRoomAmbush),
      choice(t("choice.study_portrait"), servantRoomPortrait),
      choice(t("choice.follow_corridor"), castleInnerCorridor)
    ]);
  }

  function servantRoomEmpty() {
    writeKey("story.servant_room_empty");
    setChoices([choice(t("choice.return_corridor"), castleServantQuarters)]);
  }

  function servantRoomBodies() {
    writeKey("story.servant_room_bodies");
    setChoices([choice(t("choice.return_corridor"), castleServantQuarters)]);
  }

  function servantRoomAmbush() {
    if (state.player.flags.servantAmbushCleared) {
      writeKey("story.servant_room_ambush_cleared");
      setChoices([choice(t("choice.return_corridor"), castleServantQuarters)]);
      return;
    }
    writeKey("story.servant_room_ambush");
    startCombat(["goblin", "goblin", "orc"], "story.servant_room_ambush_win", {
      attackersPerRound: 2,
      onWin: () => {
        state.player.flags.servantAmbushCleared = true;
        castleServantQuarters();
      },
      onRun: castleInnerCorridor
    });
  }

  function servantRoomPortrait() {
    writeKey("story.servant_room_portrait");
    setChoices([choice(t("choice.read_note"), servantNote)]);
  }

  function servantNote() {
    writeKey("story.servant_note");
    setChoices([choice(t("choice.return_corridor"), castleServantQuarters)]);
  }

  function castleInnerCorridor() {
    writeKey("story.castle_inner_corridor");
    const choices = [];
    if (!state.player.flags.kingsStudyFound) {
      choices.push(choice(t("choice.search_kings_study"), kingsStudy));
    }
    choices.push(choice(t("choice.follow_doll_pull"), throneRoomPull));
    setChoices(choices);
  }

  function kingsStudy() {
    state.player.flags.kingsStudyFound = true;
    writeKey("story.kings_study");
    setChoices([choice(t("choice.return_corridor"), castleInnerCorridor)]);
  }

  function throneRoomPull() {
    if (state.player.flags.hasDoll) {
      state.player.flags.dollRevealed = true;
      if (state.player.flags.pickedUpDoll) {
        unlock("mercy_has_luggage");
      }
      writeKey("story.throne_room_pull_known");
    } else if (state.player.flags.dollInSack) {
      state.player.flags.hasDoll = true;
      state.player.flags.dollRevealed = true;
      addItem("cracked doll");
      unlock("haunted_carry_on");
      writeKey("story.throne_room_pull_hidden");
    } else {
      writeKey("story.throne_room_pull_no_doll");
    }
    if (state.player.flags.hasSilverMask && !state.player.flags.wearingSilverMask) {
      writeKey("story.throne_room_mask_whisper_stored");
    } else if (state.player.flags.wearingSilverMask) {
      writeKey("story.throne_room_mask_whisper_worn");
    }
    setChoices([choice(t("choice.follow_doll_pull"), throneRoom)]);
  }

  function throneRoom() {
    writeKey("story.throne_room");
    if (state.player.flags.wearingSilverMask) {
      writeKey("story.throne_room_crown_temptation");
    }
    setChoices([choice(t("choice.approach_throne"), throneRoomApproach)]);
  }

  function throneRoomApproach() {
    if (state.player.flags.wearingSilverMask) {
      maskCorruptionEnding();
      return;
    }
    if (state.player.flags.hasSilverMask) {
      throneRoomMaskTemptation();
      return;
    }
    resistanceSummoning();
  }

  function throneRoomMaskTemptation() {
    writeKey("story.throne_room_mask_temptation");
    setChoices([
      choice(t("choice.put_mask_on"), throneRoomPutOnMask),
      choice(t("choice.resist_urge"), throneRoomResistMask)
    ]);
  }

  function throneRoomPutOnMask() {
    state.player.flags.wearingSilverMask = true;
    state.player.flags.playerSuccumbedToMask = true;
    applySilverMaskPower();
    unlock("this_is_mine_now");
    maskCorruptionEnding();
  }

  function throneRoomResistMask() {
    if (state.player.flags.maskPowerClaimed) {
      unlock("false_confidence");
    }
    writeKey("story.throne_room_resist_mask");
    resistanceSummoning();
  }

  function maskCorruptionEnding() {
    setMusic("mystery", { volume: MUSIC_VOLUMES.low });
    if (tryWarlockHardSave("The silver charm burns white-hot and shatters. Cal remembers his own name through the mask's hunger and rips the thing away before the crown can claim him.")) {
      state.player.flags.playerSuccumbedToMask = false;
      state.player.flags.hasSilverMask = false;
      state.player.flags.wearingSilverMask = false;
      removeItem("silver mask");
      resistanceSummoning();
      return;
    }
    state.player.flags.playerSuccumbedToMask = true;
    state.player.flags.orderObservedPlayer = true;
    state.player.flags.hasSilverMask = false;
    state.player.flags.wearingSilverMask = false;
    removeItem("silver mask");
    writeKey("story.mask_corruption_release", { playerName: state.player.name });
    writeKey("story.mask_corruption_courtyard");
    writeKey("story.mask_corruption_order", { playerName: state.player.name });
    state.player.gameOverReason = "mask_corruption";
    state.player.health = 0;
    gameOver();
  }

  function resistanceSummoning() {
    state.player.health = state.player.maxHealth;
    restoreBetaMana();
    write("You draw one steady breath before the throne answers. Health and mana return to full.");
    writeKey("story.doll_summoning");
    writeHtml(`<figure class="boss-reveal"><img src="${ASSET_BASE}/obliviarch.png" alt="Obliviarch"><figcaption>Obliviarch</figcaption></figure>`);
    unlock("obliviarch_revealed");
    setChoices([choice(t("choice.face_false_hydra"), obliviarchPhaseOne)]);
  }

  function obliviarchPhaseOne() {
    startCombat(["obliviarchPhaseOne"], "story.obliviarch_phase_one_win", {
      attackersPerRound: 1,
      deathReason: "obliviarch",
      magistoneRescue: true,
      onWin: obliviarchPhaseTwoIntro,
      onRun: () => {
        state.player.gameOverReason = "obliviarch";
        state.player.health = 0;
        gameOver();
      }
    });
    if (state.player.flags.hasMagistoneOrb && !state.player.flags.magistoneOrbSpent) {
      triggerMagistoneRescue();
    }
  }

  function obliviarchPhaseTwoIntro() {
    writeKey("story.obliviarch_phase_two_intro");
    setChoices([choice(t("choice.face_obliviarch"), obliviarchPhaseTwo)]);
  }

  function obliviarchPhaseTwo() {
    startCombat(["obliviarchPhaseTwo"], "story.obliviarch_phase_two_win", {
      attackersPerRound: 1,
      deathReason: "obliviarch",
      onWin: finalStrikePrompt,
      onRun: () => {
        state.player.gameOverReason = "obliviarch";
        state.player.health = 0;
        gameOver();
      }
    });
  }

  function finalStrikePrompt() {
    writeKey("story.obliviarch_final_strike_prompt");
    setChoices([
      choice(t("choice.attack_doll"), destroyObliviarch),
      choice(t("choice.attack_crown"), finalStrikeWrongTarget),
      choice(t("choice.attack_creature"), finalStrikeWrongTarget)
    ]);
  }

  function finalStrikeWrongTarget() {
    writeKey("story.obliviarch_final_wrong_target");
    finalStrikePrompt();
  }

  function destroyObliviarch() {
    state.player.flags.crownDestroyed = true;
    state.player.flags.dollDestroyed = true;
    state.player.flags.obliviarchDestroyed = true;
    state.player.flags.hasDoll = false;
    state.player.flags.dollInSack = false;
    removeItem("cracked doll");
    unlock("crownbreaker");
    writeKey("story.obliviarch_destroyed");
    orderEntersThroneRoom();
  }

  function orderEntersThroneRoom() {
    state.player.flags.orderObservedPlayer = true;
    writeKey("story.order_throne_room_arrival");
    if (state.player.flags.hasSilverMask && !state.player.flags.wearingSilverMask) {
      state.player.flags.hasSilverMask = false;
      removeItem("silver mask");
      writeKey("story.order_destroys_stored_mask");
    } else {
      writeKey("story.order_no_mask_comment");
    }
    writeKey("story.order_cleanses_throne_room");
    setChoices([choice(t("choice.leave_throne_room"), survivingRouteClosing)]);
  }

  function survivingRouteClosing() {
    writeKey("story.surviving_route_closing");
    recordEnding();
    writeCurrentScore();
    saveGame();
    setChoices([
      choice(ui.submitScore, submitScore),
      choice(ui.leaderboard, showLeaderboard),
      currentStatusChoice(),
      choice(t("choice.main_menu"), showStart)
    ]);
  }

  function complete(clear = false) {
    writeKey("story.complete", {}, clear);
    recordEnding();
    writeCurrentScore();
    saveGame();
    setChoices([
      choice(ui.submitScore, submitScore),
      choice(ui.leaderboard, showLeaderboard),
      currentStatusChoice(),
      choice(t("choice.main_menu"), showStart)
    ]);
  }

  function startCombat(enemyTypes, victoryKey, options = {}) {
    setMusic("combat", { volume: MUSIC_VOLUMES.combat });
    const typeCounts = {};
    const enemies = enemyTypes.map((type, index) => {
      const base = monsterStats[type];
      typeCounts[type] = (typeCounts[type] || 0) + 1;
      const typeTotal = enemyTypes.filter((enemyType) => enemyType === type).length;
      const name = typeTotal > 1 ? `${base.name} ${typeCounts[type]}` : base.name;
      return { ...base, type, id: index + 1, name, hp: base.hp, maxHp: base.hp };
    });
    state.combat = {
      enemies,
      victoryKey,
      attackersPerRound: options.attackersPerRound || 1,
      onWin: options.onWin || null,
      onRun: options.onRun || null,
      deathReason: options.deathReason || "combat",
      magistoneRescue: Boolean(options.magistoneRescue),
      guarding: false,
      playerEffects: {}
    };
    writeKey("ui.initiate_combat");
    showCombatChoices();
  }

  function showCombatChoices() {
    if (!state.combat) {
      return;
    }
    if (state.player.health <= 0) {
      finishCombatDeath();
      return;
    }
    const attackLabels = betaCombatActionLabels();
    const labels = [
      choice(attackLabels.attack, () => playerAttack(false), { detail: combatChoiceDetail(false) }),
      choice(attackLabels.heavy, () => playerAttack(true), { detail: combatChoiceDetail(true) }),
      choice(t("choice.dodge"), dodge, { detail: "Guard for the enemy turn, raising your AC before enemies attack." }),
      choice(t("choice.run"), runCombat, { detail: "Try to escape combat with a sneak roll." })
    ];
    if (hasManaAbilities()) {
      betaCombatChoices().forEach((betaChoice) => labels.splice(labels.length - 2, 0, betaChoice));
    }
    if (state.player.gear.includes("health potion")) {
      labels.push(choice(t("choice.health_potion"), drinkPotion, { detail: "Drink a health potion to heal 2d4 + 6 before enemies respond." }));
    }
    setChoices(labels);
  }

  function betaCombatChoices() {
    return (state.player.knownAbilities || [])
      .map((id) => betaPowers[id] ? choice(`${betaPowers[id].name} (${betaPowers[id].cost} Mana)`, () => useBetaPower(id), { detail: betaPowerSummary(id) }) : null)
      .filter(Boolean);
  }

  function betaCombatActionLabels() {
    return betaClassCombatLabels[state.player.class] || { attack: t("choice.attack"), heavy: t("choice.heavy_attack") };
  }

  function combatChoiceDetail(heavy) {
    const stats = combatStats();
    if (heavy) {
      return `One attack at d${stats.damageDie + 4} + ${stats.damageBonus} damage with ${stats.attackBonus - 1 >= 0 ? "+" : ""}${stats.attackBonus - 1} to hit.`;
    }
    if (state.player.class === "scholar") {
      return `${stats.attacks} Eldritch Blast beam${stats.attacks === 1 ? "" : "s"} at d${stats.damageDie} + ${stats.damageBonus} damage with ${stats.attackBonus >= 0 ? "+" : ""}${stats.attackBonus} to hit. Eldritch Blast fires 2 beams at level 5, 3 at level 11, and 4 at level 17.`;
    }
    return `${stats.attacks} attack${stats.attacks === 1 ? "" : "s"} at d${stats.damageDie} + ${stats.damageBonus} damage with ${stats.attackBonus >= 0 ? "+" : ""}${stats.attackBonus} to hit.`;
  }

  function playerAttack(heavy) {
    if (!state.combat || finishCombatDeath()) {
      return;
    }
    const stats = combatStats();
    const target = state.combat.enemies.find((enemy) => enemy.hp > 0);
    if (!target) {
      combatVictory();
      return;
    }
    const attacks = heavy ? 1 : stats.attacks;
    const damageDie = heavy ? stats.damageDie + 4 : stats.damageDie;
    const attackBonus = heavy ? stats.attackBonus - 1 : stats.attackBonus;
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
      if (natural === 1 && !isCheatActive("attack")) {
        writeKey("story.combat_miss");
      } else if (isCheatActive("attack") || natural === 20 || total >= currentTarget.ac) {
        const damageRoll = rollDie(damageDie);
        const critDamageRoll = natural === 20 ? rollDie(damageDie) : 0;
        let damage = damageRoll + stats.damageBonus + betaRageDamageBonus();
        if (natural === 20) {
          damage += critDamageRoll;
        }
        const damageDealt = Math.min(currentTarget.hp, damage);
        currentTarget.hp -= damage;
        writeKey("story.combat_hit", {
          enemy: currentTarget.name,
          damage,
          damage_dealt: damageDealt,
          damage_roll: damageRollText(damageDie, damageRoll, stats.damageBonus, critDamageRoll)
        });
        if (damageDealt > 20) {
          unlock("big_damage");
        }
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
    if (!finishCombatDeath()) {
      showCombatChoices();
    }
  }

  function useBetaPower(powerId) {
    if (!state.combat || finishCombatDeath()) {
      return;
    }
    const power = betaPowers[powerId];
    if (!power) {
      showCombatChoices();
      return;
    }
    if (!isCheatActive("mana") && (state.player.mana || 0) < power.cost) {
      write(`Not enough mana for ${power.name}.`);
      showCombatChoices();
      return;
    }
    if (!isCheatActive("mana")) {
      state.player.mana -= power.cost;
    }
    write(power.text);
    if (power.type === "buff") {
      state.combat.playerEffects.rageTurns = power.turns || 3;
      write(`${power.name} is active.`);
    } else if (power.type === "heal") {
      const healRoll = rollDie(power.healDie || 8);
      const healed = Math.min(state.player.maxHealth - state.player.health, healRoll + (power.healBonus || 0));
      state.player.health += healed;
      write(`${power.name} restores ${healed} HP.`);
    } else if (power.type === "restore") {
      const restored = Math.min(state.player.maxMana - state.player.mana, power.manaRestore || 0);
      state.player.mana += restored;
      write(`${power.name} restores ${restored} mana.`);
    } else if (power.type === "guard") {
      state.combat.guarding = true;
      state.combat.playerEffects.guardBonus = Math.max(state.combat.playerEffects.guardBonus || 0, power.acBonus || 0);
    } else {
      betaPowerAttack(power);
    }
    if (state.combat && state.combat.enemies.every((enemy) => enemy.hp <= 0)) {
      combatVictory();
      return;
    }
    enemyTurn();
    if (!finishCombatDeath()) {
      showCombatChoices();
    }
  }

  function betaPowerAttack(power) {
    const stats = combatStats();
    const target = state.combat.enemies.find((enemy) => enemy.hp > 0);
    if (!target) {
      return;
    }
    const damageDie = power.damageDie || stats.damageDie;
    const attackBonus = stats.attackBonus + (power.attackBonus || 0);
    const natural = d20();
    const total = natural + attackBonus;
    writeKey("story.combat_attack_roll", {
      attack_number: 1,
      natural,
      bonus: attackBonus,
      total,
      enemy: target.name,
      ac: target.ac
    });
    if (!isCheatActive("attack") && (natural === 1 || (natural !== 20 && total < target.ac))) {
      writeKey("story.combat_miss");
      return;
    }
    const damageRoll = rollDie(damageDie);
    const critDamageRoll = natural === 20 ? rollDie(damageDie) : 0;
    let damage = damageRoll + stats.damageBonus + (power.damageBonus || 0) + betaRageDamageBonus();
    if (natural === 20) {
      damage += critDamageRoll;
    }
    const damageDealt = Math.min(target.hp, damage);
    target.hp -= damage;
    writeKey("story.combat_hit", {
      enemy: target.name,
      damage,
      damage_dealt: damageDealt,
      damage_roll: damageRollText(damageDie, damageRoll, stats.damageBonus + (power.damageBonus || 0), critDamageRoll)
    });
    if (power.healHalf && damageDealt > 0) {
      const healed = Math.min(state.player.maxHealth - state.player.health, Math.ceil(damageDealt / 2));
      state.player.health += healed;
      write(`${power.name} restores ${healed} HP.`);
    }
    if (power.guard) {
      state.combat.guarding = true;
    }
    if (power.type === "cleave") {
      const secondTarget = state.combat.enemies.find((enemy) => enemy.hp > 0 && enemy !== target);
      if (secondTarget) {
        const cleaveDamage = Math.max(1, Math.floor(damage / 2));
        secondTarget.hp -= cleaveDamage;
        write(`${power.name} carries into ${secondTarget.name} for ${cleaveDamage} damage.`);
      }
    }
    if (damageDealt > 20) {
      unlock("big_damage");
    }
    state.combat.enemies.filter((enemy) => enemy.hp <= 0).forEach((enemy) => {
      if (!enemy.droppedLogged) {
        enemy.droppedLogged = true;
        writeKey("story.combat_enemy_drops", { enemy: enemy.name });
      }
    });
  }

  function betaRageDamageBonus() {
    return state.combat && state.combat.playerEffects && state.combat.playerEffects.rageTurns > 0 ? 2 : 0;
  }

  function dodge() {
    if (!state.combat || finishCombatDeath()) {
      return;
    }
    state.combat.guarding = true;
    writeKey("story.combat_dodge");
    enemyTurn();
    if (!finishCombatDeath()) {
      showCombatChoices();
    }
  }

  function runCombat() {
    if (!state.combat || finishCombatDeath()) {
      return;
    }
    if (state.player.class === "ranger" && useClassSave("Ren vanishes into the chaos before the enemy can close the gap. Once per run, Run succeeds automatically.")) {
      writeKey("story.combat_run_success");
      const onRun = state.combat.onRun;
      state.combat = null;
      restoreChapterMusic();
      if (onRun) {
        onRun();
      } else {
        goBridge();
      }
      return;
    }
    const roll = rollD20("sneak");
    if (roll >= 12) {
      writeKey("story.combat_run_success");
      const onRun = state.combat.onRun;
      state.combat = null;
      restoreChapterMusic();
      if (onRun) {
        onRun();
      } else {
        goBridge();
      }
    } else {
      writeKey("story.combat_run_fail");
      enemyTurn();
      if (!finishCombatDeath()) {
        showCombatChoices();
      }
    }
  }

  function drinkPotion() {
    if (!state.combat || finishCombatDeath()) {
      return;
    }
    removeItem("health potion");
    state.player.healthPotions = Math.max(0, state.player.healthPotions - 1);
    const healing = rollDie(4) + rollDie(4) + 6;
    state.player.health = Math.min(state.player.maxHealth, state.player.health + healing);
    writeKey("story.combat_potion", { healing });
    enemyTurn();
    if (!finishCombatDeath()) {
      showCombatChoices();
    }
  }

  function enemyTurn() {
    if (isCheatActive("health")) {
      write("Infinite Health absorbs the enemy turn.");
      state.combat.guarding = false;
      return;
    }
    const guardBonus = state.combat.playerEffects ? state.combat.playerEffects.guardBonus || 0 : 0;
    const playerAc = combatStats().ac + (state.combat.guarding ? 5 : 0) + guardBonus;
    const attackers = state.combat.enemies.filter((enemy) => enemy.hp > 0).slice(0, state.combat.attackersPerRound);
    let dwarvenGuardSaveActive = false;
    for (const enemy of attackers) {
      const natural = d20(false);
      const total = natural + enemy.attackBonus;
      if (natural === 1) {
        writeKey("story.enemy_miss", { enemy: enemy.name, natural, total, ac: playerAc });
      } else if (!isCheatActive("ac") && (natural === 20 || total >= playerAc)) {
        const damageRoll = rollDie(enemy.damageDie);
        const critDamageRoll = natural === 20 ? rollDie(enemy.damageDie) : 0;
        let damage = damageRoll + enemy.damageBonus;
        if (natural === 20) {
          damage += critDamageRoll;
        }
        if (
          state.player.class === "dwarf"
          && !state.player.flags.classSaveUsed
          && state.player.health - damage <= Math.ceil(state.player.maxHealth / 2)
        ) {
          useClassSave("Kili locks his shield and plants his feet. Incoming combat damage is halved for the rest of this enemy turn.");
          dwarvenGuardSaveActive = true;
        }
        if (dwarvenGuardSaveActive) {
          damage = Math.ceil(damage / 2);
        }
        state.player.health = Math.max(0, state.player.health - damage);
        writeKey("story.enemy_hit", {
          enemy: enemy.name,
          natural,
          total,
          ac: playerAc,
          damage,
          damage_roll: damageRollText(enemy.damageDie, damageRoll, enemy.damageBonus, critDamageRoll)
        });
      } else {
        writeKey("story.enemy_miss", { enemy: enemy.name, natural, total, ac: playerAc });
      }
      if (state.player.health <= 0) {
        break;
      }
    }
    state.combat.guarding = false;
    if (state.combat.playerEffects) {
      state.combat.playerEffects.guardBonus = 0;
      if (state.combat.playerEffects.rageTurns > 0) {
        state.combat.playerEffects.rageTurns -= 1;
      }
    }
    if (shouldTriggerMagistoneRescue()) {
      triggerMagistoneRescue();
      return;
    }
    finishCombatDeath();
  }

  function shouldTriggerMagistoneRescue() {
    if (!state.combat || !state.combat.magistoneRescue || !state.player || !state.player.flags) {
      return false;
    }
    if (!state.player.flags.hasMagistoneOrb || state.player.flags.magistoneOrbSpent) {
      return false;
    }
    return state.player.health <= 0 || state.player.health <= Math.ceil(state.player.maxHealth * 0.25);
  }

  function triggerMagistoneRescue() {
    const enemy = state.combat.enemies.find((currentEnemy) => currentEnemy.hp > 0) || state.combat.enemies[0];
    state.player.flags.magistoneOrbSpent = true;
    removeItem("magistone orb");
    state.player.health = state.player.maxHealth;
    restoreBetaMana();
    if (enemy) {
      enemy.name = "Wounded Obliviarch";
      enemy.ac = 16;
      enemy.attackBonus = 7;
      enemy.damageDie = 8;
      enemy.damageBonus = 5;
      enemy.hp = 50;
      enemy.maxHp = Math.max(enemy.maxHp || 0, 95);
    }
    state.combat.victoryKey = "story.obliviarch_phase_two_win";
    state.combat.onWin = finalStrikePrompt;
    state.combat.magistoneRescue = false;
    writeKey("story.magistone_orb_trigger");
    showCombatChoices();
  }

  function finishCombatDeath() {
    if (!state.combat || state.player.health > 0) {
      return false;
    }
    if (state.player.class === "warrior" && useClassSave("Cletus refuses to fall. Once per run, lethal combat damage leaves him at 1 HP instead.")) {
      state.player.health = 1;
      return false;
    }
    state.player.gameOverReason = state.combat.deathReason;
    state.combat = null;
    gameOver();
    return true;
  }

  function combatVictory() {
    const combat = state.combat;
    state.combat = null;
    restoreChapterMusic();
    writeKey(combat.victoryKey);
    ensureScoreState();
    state.player.score.fightsWon += 1;
    const xp = combat.enemies.reduce((total, enemy) => total + enemy.xp, 0);
    if (awardXp(xp, "combat", combat.onWin)) {
      return;
    }
    if (combat.onWin) {
      combat.onWin();
    }
  }

  function combatStats() {
    const applyCheatStats = (stats) => ({
      ...stats,
      ac: isCheatActive("ac") ? CHEAT_STAT_VALUE : stats.ac,
      attackBonus: isCheatActive("attack") ? CHEAT_STAT_VALUE : stats.attackBonus,
      damageBonus: isCheatActive("damage") ? CHEAT_STAT_VALUE : stats.damageBonus
    });
    if (state.player.betaCustom) {
      return applyCheatStats(betaCombatStats());
    }
    const base = classes[state.player.class];
    return applyCheatStats({
      ac: base.ac + state.player.upgrades.ac,
      attackBonus: base.attackBonus,
      damageDie: base.damageDie,
      damageBonus: base.damageBonus + state.player.upgrades.damage,
      attacks: state.player.class === "scholar" ? eldritchBlastBeamCount() : base.attacks
    });
  }

  function eldritchBlastBeamCount() {
    const level = state.player ? state.player.level : BASE_LEVEL;
    if (level >= 17) {
      return 4;
    }
    if (level >= 11) {
      return 3;
    }
    if (level >= 5) {
      return 2;
    }
    return 1;
  }

  function betaCombatStats() {
    const build = betaClassBuilds[state.player.class];
    const race = betaRaces[state.player.raceKey] || { bonuses: {} };
    const weapon = betaWeapons[state.player.weaponKey] || betaWeapons.greataxe;
    const attributes = state.player.attributes || {};
    const isWarlock = state.player.class === "scholar";
    const attackStat = isWarlock ? "cha" : weapon.attackStat || build.attackStat;
    const damageStat = isWarlock ? "cha" : weapon.damageStat || build.damageStat;
    return {
      ac: build.acBase + betaModifier(attributes.dex || 10) + (race.ac || 0) + (weapon.ac || 0) + state.player.upgrades.ac,
      attackBonus: 3 + betaModifier(attributes[attackStat] || 10) + (race.attackBonus || 0) + (isWarlock ? 0 : weapon.attackBonus || 0),
      damageDie: isWarlock ? 10 : weapon.damageDie,
      damageBonus: betaModifier(attributes[damageStat] || 10) + (isWarlock ? 0 : weapon.damageBonus || 0) + state.player.upgrades.damage,
      attacks: state.player.class === "scholar" ? eldritchBlastBeamCount() : Math.max(1, build.attacks + (weapon.attacks || 0))
    };
  }

  function checkStatAchievements() {
    if (!state.player || state.player.class === "dm") {
      return;
    }
    if (combatStats().ac > 20) {
      unlock("high_ac");
    }
    if (state.player.level >= 20) {
      unlock("maxed_out");
    }
  }

  function awardDecisionXp(reason) {
    if (state.player && !isPlayerDead()) {
      ensureScoreState();
      state.player.score.decisions += 1;
    }
    awardXp(decisionXp[reason] || 0, reason);
  }

  function awardXp(amount, reason, continuation = null) {
    if (!state.player || state.player.class === "dm" || amount <= 0 || isPlayerDead()) {
      return false;
    }
    state.player.experience += amount;
    writeKey("story.xp_gain", { amount, reason: xpReasons[reason] || reason });
    while (state.player.experience >= state.player.xpToNext) {
      state.player.experience -= state.player.xpToNext;
      state.player.level += 1;
      if (state.player.level >= 20) {
        unlock("maxed_out");
      }
      state.player.xpToNext = BASE_XP_TO_NEXT + Math.max(0, state.player.level - BASE_LEVEL) * XP_PER_LEVEL;
      state.player.maxHealth += 4;
      state.player.health += 4;
      if (hasManaAbilities()) {
        state.player.maxMana = (state.player.maxMana || 0) + 4;
        state.player.mana = Math.min(state.player.maxMana, (state.player.mana || 0) + 4);
      }
      state.pendingLevelContinuation = continuation;
      state.pendingChoices = null;
      showLevelUpChoices();
      return true;
    }
    return false;
  }

  function showLevelUpChoices() {
    if (isPlayerDead()) {
      clearLevelRewardState();
      gameOver();
      return;
    }
    state.awaitingLevelReward = true;
    const levelChoices = [
      choice(t("choice.level_hp"), () => {
        if (cancelLevelRewardIfDead()) {
          return;
        }
        state.player.maxHealth += 4;
        state.player.health += 4;
        writeKey("story.level_hp");
        continueAfterLevel();
      })
    ];
    if (hasManaAbilities()) {
      levelChoices.push(choice(t("choice.level_mana"), () => {
        if (cancelLevelRewardIfDead()) {
          return;
        }
        state.player.maxMana = (state.player.maxMana || 0) + 4;
        state.player.mana = Math.min(state.player.maxMana, (state.player.mana || 0) + 4);
        writeKey("story.level_mana");
        continueAfterLevel();
      }));
    }
    if (state.player.betaCustom) {
      levelChoices.push(choice(t("choice.level_attribute"), () => {
        if (cancelLevelRewardIfDead()) {
          return;
        }
        showAttributeLevelChoices();
      }));
    }
    levelChoices.push(
      choice(t("choice.level_ac"), () => {
        if (cancelLevelRewardIfDead()) {
          return;
        }
        state.player.upgrades.ac += 1;
        checkStatAchievements();
        writeKey("story.level_ac");
        continueAfterLevel();
      }),
      choice(t("choice.level_damage"), () => {
        if (cancelLevelRewardIfDead()) {
          return;
        }
        state.player.upgrades.damage += 2;
        writeKey("story.level_damage");
        continueAfterLevel();
      }),
      choice(t("choice.level_heal"), () => {
        if (cancelLevelRewardIfDead()) {
          return;
        }
        state.player.health = state.player.maxHealth;
        restoreBetaMana();
        writeKey("story.level_heal");
        continueAfterLevel();
      })
    );
    state.levelRewardChoices = levelChoices;
    render();
  }

  function showAttributeLevelChoices() {
    if (!state.player || !state.player.betaCustom) {
      writeKey("story.level_attribute_unavailable");
      continueAfterLevel();
      return;
    }
    state.awaitingLevelReward = true;
    state.levelRewardChoices = CUSTOM_ATTRIBUTES.map((attribute) => {
      const label = t(`choice.level_attribute_${attribute}`);
      const current = (state.player.attributes && state.player.attributes[attribute]) || 10;
      return choice(label, () => increaseLevelAttribute(attribute), {
        detail: `${label}: ${current} -> ${current + 1}`
      });
    });
    render();
  }

  function increaseLevelAttribute(attribute) {
    if (cancelLevelRewardIfDead()) {
      return;
    }
    if (!state.player.attributes) {
      state.player.attributes = {};
    }
    state.player.attributes[attribute] = (state.player.attributes[attribute] || 10) + 1;
    if (attribute === "con") {
      state.player.maxHealth += 3;
      state.player.health += 3;
    }
    writeKey("story.level_attribute", {
      attribute: t(`attribute.${attribute}`),
      value: state.player.attributes[attribute]
    });
    continueAfterLevel();
  }

  function continueAfterLevel() {
    if (isPlayerDead()) {
      clearLevelRewardState();
      gameOver();
      return;
    }
    const continuation = state.pendingLevelContinuation;
    const pendingChoices = state.pendingChoices;
    state.awaitingLevelReward = false;
    state.levelRewardChoices = [];
    state.pendingLevelContinuation = null;
    state.pendingChoices = null;
    if (continuation) {
      continuation();
    } else if (pendingChoices) {
      state.choices = pendingChoices;
      render();
    } else if (state.combat) {
      showCombatChoices();
    } else {
      render();
    }
  }

  function cancelLevelRewardIfDead() {
    if (!isPlayerDead()) {
      return false;
    }
    clearLevelRewardState();
    gameOver();
    return true;
  }

  function clearLevelRewardState() {
    state.awaitingLevelReward = false;
    state.levelRewardChoices = [];
    state.pendingLevelContinuation = null;
    state.pendingChoices = null;
  }

  function isPlayerDead() {
    return Boolean(state.player && (state.player.health <= 0 || (state.player.flags && state.player.flags.deathRecorded)));
  }

  function restoreBetaMana() {
    if (hasManaAbilities()) {
      state.player.mana = state.player.maxMana;
    }
  }

  function useClassSave(message) {
    if (!state.player || state.player.class === "dm" || state.player.flags.classSaveUsed) {
      return false;
    }
    state.player.flags.classSaveUsed = true;
    write(message);
    return true;
  }

  function tryWarlockHardSave(message) {
    if (!state.player || state.player.class !== "scholar") {
      return false;
    }
    if (!useClassSave(message)) {
      return false;
    }
    state.player.health = state.player.maxHealth;
    restoreBetaMana();
    return true;
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
    return randomInt(sides) + 1;
  }

  function randomInt(maxExclusive) {
    if (!Number.isInteger(maxExclusive) || maxExclusive <= 0) {
      return 0;
    }
    if (window.crypto && typeof window.crypto.getRandomValues === "function") {
      const maxUint = 0x100000000;
      const limit = maxUint - (maxUint % maxExclusive);
      const values = new Uint32Array(1);
      do {
        window.crypto.getRandomValues(values);
      } while (values[0] >= limit);
      return values[0] % maxExclusive;
    }
    return Math.floor(Math.random() * maxExclusive);
  }

  function damageRollText(damageDie, damageRoll, damageBonus, critDamageRoll) {
    if (critDamageRoll) {
      return `d${damageDie} roll ${damageRoll} + crit d${damageDie} roll ${critDamageRoll} + ${damageBonus}`;
    }
    return `d${damageDie} roll ${damageRoll} + ${damageBonus}`;
  }

  function addItem(item) {
    if (item === "health potion") {
      state.player.gear.push(item);
      state.player.healthPotions = (state.player.healthPotions || 0) + 1;
      return;
    }
    if (!state.player.gear.includes(item)) {
      state.player.gear.push(item);
    }
  }

  function addStackableItem(item, count) {
    for (let i = 0; i < count; i += 1) {
      state.player.gear.push(item);
    }
    if (item === "health potion") {
      state.player.healthPotions = (state.player.healthPotions || 0) + count;
    }
  }

  function removeItem(item) {
    const index = state.player.gear.indexOf(item);
    if (index >= 0) {
      state.player.gear.splice(index, 1);
    }
  }

  function unlock(id) {
    if (!state.stats._achievements) {
      state.stats._achievements = {};
    }
    if (!state.stats._achievements[id]) {
      state.stats._achievements[id] = true;
      saveStats();
      writeKey("ui.achievement_unlocked", { name: achievements[id] || id, description: "" });
    }
  }

  function checkOverprepared() {
    if (!state.player || !state.player.flags) {
      return;
    }
    const flags = state.player.flags;
    if (
      flags.hasThroneMap &&
      flags.hasMagistoneOrb &&
      (flags.hasDoll || flags.dollInSack) &&
      flags.hasSilverMask
    ) {
      unlock("overprepared");
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

  function writeCurrentScore() {
    if (!state.player) {
      return;
    }
    const achievementsUnlocked = Object.keys(state.stats._achievements || {}).filter((key) => state.stats._achievements[key]).length;
    const scoreDetails = scoreBreakdown(achievementsUnlocked);
    write(`${t("story.current_score", { score: scoreDetails.total })}\n\n${t("story.score_breakdown_heading")}\n${scoreDetails.lines.join("\n")}`);
  }

  function gameOver() {
    setMusic("mystery", { volume: MUSIC_VOLUMES.low });
    clearLevelRewardState();
    if (state.player && !state.player.flags.deathRecorded) {
      state.stats[state.player.class].died += 1;
      state.player.flags.deathRecorded = true;
      recordSpecialDeathAchievement(state.player.gameOverReason);
      checkDeathAchievements();
      saveStats();
    }
    state.showGameOverImage = false;
    setChoices([choice(ui.deathScorePrompt, showGameOverScores)]);
  }

  function checkDeathAchievements() {
    const totalDeaths = Object.keys(classes).reduce((total, key) => total + (state.stats[key] ? state.stats[key].died || 0 : 0), 0);
    if (totalDeaths > 20) {
      unlock("all_day");
    }
  }

  function recordSpecialDeathAchievement(reason) {
    if (!reason || reason === "default" || reason === "combat") {
      return;
    }
    if (!Array.isArray(state.stats._deathReasons)) {
      state.stats._deathReasons = [];
    }
    if (!state.stats._deathReasons.includes(reason)) {
      state.stats._deathReasons.push(reason);
    }
    if (state.stats._deathReasons.length >= 3) {
      unlock("bad_idea_connoisseur");
    }
  }

  function showGameOverScores() {
    const reason = state.player ? state.player.gameOverReason : "default";
    const achievementsUnlocked = Object.keys(state.stats._achievements).filter((key) => state.stats._achievements[key]).length;
    const scoreDetails = state.player ? scoreBreakdown(achievementsUnlocked) : { total: 0, lines: [] };
    write(`${t("story.game_over_header")}\n\n${t(`game_over.${reason}`)}\n\n${t("story.final_score", { score: scoreDetails.total })}\n\n${t("story.score_breakdown_heading")}\n${scoreDetails.lines.join("\n")}\n\n${t("story.game_over_footer")}`, true);
    state.gameOverImage = GAME_OVER_IMAGES[reason] || null;
    state.showGameOverImage = true;
    setChoices([
      choice(ui.submitScore, submitScore),
      choice(ui.leaderboard, showLeaderboard),
      choice(t("choice.new_game"), showCharacterSelect),
      choice(t("choice.main_menu"), showStart)
    ]);
  }

  async function showLeaderboard() {
    setMusic("epic", { volume: MUSIC_VOLUMES.low });
    write(ui.leaderboardLoading, true);
    setChoices([choice(t("choice.main_menu"), showStart)]);
    try {
      await refreshAccountSession();
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${LEADERBOARD_TABLE}?select=player_name,character_name,score,ending_reached,fights_won,achievements_unlocked,created_at&order=score.desc&limit=25`, {
        headers: supabaseHeaders(true)
      });
      if (!response.ok) {
        throw new Error(`Leaderboard request failed: ${response.status}`);
      }
      const scores = await response.json();
      if (!scores.length) {
        writeLeaderboard([ui.leaderboardEmpty]);
        return;
      }
      const lines = [];
      scores.forEach((score, index) => {
        lines.push(format(ui.leaderboardLine, {
          rank: index + 1,
          name: score.player_name,
          score: score.score,
          character: score.character_name
        }));
      });
      writeLeaderboard(lines);
    } catch {
      writeLeaderboard([ui.leaderboardFailed]);
    }
  }

  function writeLeaderboard(lines) {
    state.storyParts = [
      `<div class="leaderboard-view"><h2>${escapeHtml(ui.leaderboardHeader)}</h2><p class="leaderboard-warning">${escapeHtml(ui.leaderboardWarning)}</p><pre>${escapeHtml(lines.join("\n"))}</pre></div>`
    ];
    state.showGameOverImage = false;
    render();
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
    const confirmed = await confirmDialog(ui.submitScore, ui.submitScoreWarning, {
      confirmLabel: ui.submitScore
    });
    if (!confirmed) {
      return;
    }
    const previousName = preferredLeaderboardName();
    const playerName = await promptText(ui.playerNamePrompt, previousName, {
      title: ui.submitScore,
      ...namePromptOptions({ publicName: true })
    });
    if (!playerName) {
      return;
    }
    const cleanName = normalizeName(playerName);
    if (!cleanName) {
      return;
    }
    localStorage.setItem(`${storagePrefix}leaderboardName`, cleanName);
    const payload = leaderboardPayload(cleanName);
    try {
      await refreshAccountSession();
      let response = await postLeaderboardScore(payload);
      if (!response.ok && payload.user_id) {
        delete payload.user_id;
        response = await postLeaderboardScore(payload, true);
      }
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

  function postLeaderboardScore(payload, useAnonToken = false) {
    return fetch(`${SUPABASE_URL}/rest/v1/${LEADERBOARD_TABLE}`, {
      method: "POST",
      headers: {
        ...supabaseHeaders(useAnonToken),
        "Content-Type": "application/json",
        Prefer: "return=minimal"
      },
      body: JSON.stringify(payload)
    });
  }

  function leaderboardPayload(playerName) {
    ensureScoreState();
    const achievementsUnlocked = Object.keys(state.stats._achievements || {}).filter((key) => state.stats._achievements[key]).length;
    const characterClass = state.player.betaCustom
      ? `${state.player.race} ${state.player.title} (${state.player.weaponName})`
      : state.player.title;
    const payload = {
      player_name: playerName,
      character_name: state.player.name,
      character_class: characterClass,
      score: calculateScore(achievementsUnlocked),
      ending_reached: Boolean(state.player.flags.completedRecorded),
      fights_won: state.player.score.fightsWon,
      deaths: state.player.flags.deathRecorded ? 1 : 0,
      achievements_unlocked: achievementsUnlocked,
      forest_attempts: state.player.flags.forestAttempts || 0,
      route: scoreRoute(),
      language: lang
    };
    if (isCloudAccount()) {
      payload.user_id = state.account.id;
    }
    return payload;
  }

  function calculateScore(achievementsUnlocked) {
    return scoreBreakdown(achievementsUnlocked).total;
  }

  function scoreBreakdown(achievementsUnlocked) {
    const player = state.player;
    const lines = [];
    let rawScore = 0;
    const addLine = (labelKey, value, vars = {}) => {
      rawScore += value;
      lines.push(`${t(labelKey, vars)}: ${value >= 0 ? "+" : ""}${value}`);
    };
    addLine("score.level", player.level * 100, { level: player.level });
    addLine("score.experience", player.experience);
    addLine("score.fights_won", player.score.fightsWon * 75, { count: player.score.fightsWon });
    addLine("score.decisions", player.score.decisions * 15, { count: player.score.decisions });
    addLine("score.achievements", achievementsUnlocked * 50, { count: achievementsUnlocked });
    if (player.flags.completedRecorded) {
      addLine("score.current_ending", 1000);
    }
    if (player.flags.hasDoll) {
      addLine("score.cracked_doll", 100);
    }
    if (player.flags.hasMagistoneOrb) {
      addLine("score.magistone_orb", 150);
    }
    if (player.flags.hasSilverMask) {
      addLine(player.flags.wearingSilverMask ? "score.wore_silver_mask" : "score.stored_silver_mask", player.flags.wearingSilverMask ? 250 : 125);
    }
    if (player.flags.hasThroneMap) {
      addLine("score.throne_map", 150);
    } else if (player.flags.hasPartialMap) {
      addLine("score.partial_bridge_map", 75);
    }
    if (player.flags.deathRecorded) {
      addLine("score.death_penalty", -200);
    }
    const total = Math.max(0, Math.round(rawScore));
    lines.push(`${t("story.score_raw_total")}: ${Math.round(rawScore)}`);
    if (total !== Math.round(rawScore)) {
      lines.push(`${t("story.score_minimum")}: ${total}`);
    }
    return { total, lines };
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
    if (flags.wearingSilverMask) {
      pieces.push("wore silver mask");
    } else if (flags.hasSilverMask) {
      pieces.push("stored silver mask");
    }
    if (flags.girlHelped) {
      pieces.push("ghost ally");
    }
    return pieces.join(" | ");
  }

  function supabaseHeaders(useAnonToken = false) {
    return {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${useAnonToken ? SUPABASE_KEY : authToken()}`
    };
  }

  async function authRequest(path, body) {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/${path}`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.error_description || payload.msg || "Auth request failed");
    }
    return payload;
  }

  async function handleOAuthRedirect() {
    const hash = window.location.hash.startsWith("#") ? window.location.hash.slice(1) : "";
    if (!hash) {
      return;
    }
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    if (!accessToken) {
      return;
    }
    try {
      const user = await authUserRequest(accessToken);
      setAuthenticatedAccount({
        access_token: accessToken,
        refresh_token: params.get("refresh_token") || "",
        expires_in: Number(params.get("expires_in") || 0),
        user
      });
      await saveProfile();
      window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
    } catch {
      state.oauthLoginFailed = true;
      window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
    }
  }

  async function authUserRequest(accessToken) {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${accessToken}`
      }
    });
    const payload = await response.json();
    if (!response.ok) {
      throw new Error(payload.msg || "User request failed");
    }
    return payload;
  }

  function setAuthenticatedAccount(session, fallbackName = "") {
    const user = session.user || state.account || {};
    const metadataName = user.user_metadata ? user.user_metadata.display_name : "";
    const name = normalizeName(metadataName || fallbackName || state.account?.name || user.email || ui.guest).slice(0, NAME_MAX_LENGTH);
    state.account = {
      id: user.id || state.account?.id || "",
      email: user.email || state.account?.email || "",
      name,
      guest: false,
      accessToken: session.access_token || state.account?.accessToken || "",
      refreshToken: session.refresh_token || state.account?.refreshToken || "",
      expiresAt: session.expires_at ? session.expires_at * 1000 : Date.now() + (session.expires_in || 0) * 1000
    };
    localStorage.setItem(`${storagePrefix}account`, JSON.stringify(state.account));
    localStorage.setItem(`${storagePrefix}leaderboardName`, name);
  }

  function authToken() {
    return state.account && state.account.accessToken ? state.account.accessToken : SUPABASE_KEY;
  }

  function isCloudAccount() {
    return Boolean(state.account && !state.account.guest && state.account.accessToken && state.account.id);
  }

  function canEnterGame() {
    return true;
  }

  async function refreshAccountSession(force = false) {
    if (!state.account || state.account.guest || !state.account.refreshToken) {
      return false;
    }
    const expiresAt = state.account.expiresAt || 0;
    if (!force && expiresAt && expiresAt - Date.now() > 60000) {
      return true;
    }
    try {
      const session = await authRequest("token?grant_type=refresh_token", {
        refresh_token: state.account.refreshToken
      });
      setAuthenticatedAccount(session, state.account.name);
      return true;
    } catch {
      return false;
    }
  }

  async function saveProfile() {
    if (!isCloudAccount()) {
      return;
    }
    await refreshAccountSession();
    await fetch(`${SUPABASE_URL}/rest/v1/${PROFILE_TABLE}?on_conflict=user_id`, {
      method: "POST",
      headers: {
        ...supabaseHeaders(),
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: JSON.stringify({
        user_id: state.account.id,
        display_name: state.account.name,
        updated_at: new Date().toISOString()
      })
    });
  }

  async function loadCloudData() {
    if (!isCloudAccount()) {
      return;
    }
    try {
      await refreshAccountSession();
      const response = await fetch(`${SUPABASE_URL}/rest/v1/${GAME_DATA_TABLE}?select=stats,saved_game,settings&user_id=eq.${state.account.id}&limit=1`, {
        headers: supabaseHeaders()
      });
      if (!response.ok) {
        return;
      }
      const rows = await response.json();
      if (!rows.length) {
        return;
      }
      if (rows[0].stats) {
        state.stats = rows[0].stats;
        localStorage.setItem(`${storagePrefix}stats`, JSON.stringify(state.stats));
      }
      if (rows[0].saved_game) {
        localStorage.setItem(`${storagePrefix}${lang}.save`, JSON.stringify(rows[0].saved_game));
      }
    } catch {
      // Cloud sync is best-effort so the game stays playable offline.
    }
  }

  async function saveCloudData() {
    if (!isCloudAccount()) {
      return;
    }
    try {
      await refreshAccountSession();
      await fetch(`${SUPABASE_URL}/rest/v1/${GAME_DATA_TABLE}?on_conflict=user_id`, {
        method: "POST",
        headers: {
          ...supabaseHeaders(),
          "Content-Type": "application/json",
          Prefer: "resolution=merge-duplicates,return=minimal"
        },
        body: JSON.stringify({
          user_id: state.account.id,
          stats: state.stats,
          saved_game: state.player,
          settings: { language: lang },
          updated_at: new Date().toISOString()
        })
      });
    } catch {
      // Keep local saves working even if the network is unavailable.
    }
  }

  function loadAccount() {
    try {
      const saved = localStorage.getItem(`${storagePrefix}account`);
      const account = saved ? JSON.parse(saved) : null;
      return account;
    } catch {
      return null;
    }
  }

  function accountStatusText() {
    return state.account ? state.account.name : ui.login;
  }

  function preferredLeaderboardName() {
    if (state.account && !state.account.guest && state.account.name) {
      return state.account.name;
    }
    return localStorage.getItem(`${storagePrefix}leaderboardName`) || state.player.name;
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

  function ensurePlayerState() {
    ensureScoreState();
    state.player.cheats = state.player.cheats || {};
    if (state.player && state.player.class !== "dm" && betaClassBuilds[state.player.class]) {
      const classKey = state.player.class;
      const raceKey = state.player.raceKey || defaultRaceKeyByClass[classKey];
      const weaponKey = state.player.weaponKey || defaultWeaponKeyByClass[classKey];
      const build = betaClassBuilds[classKey];
      const race = betaRaces[raceKey] || {};
      const weapon = betaWeapons[weaponKey] || {};
      state.player.raceKey = raceKey;
      state.player.weaponKey = weaponKey;
      state.player.weaponName = state.player.weaponName || weapon.name;
      state.player.knownAbilities = state.player.knownAbilities || [...new Set([...build.abilities, race.ability, weapon.skill].filter(Boolean))];
      if (state.player.maxMana === undefined) {
        const levelMana = Math.max(0, (state.player.level || BASE_LEVEL) - BASE_LEVEL) * 4;
        state.player.maxMana = Math.max(0, build.manaBase + (race.mana || 0) + levelMana);
      }
      if (state.player.mana === undefined) {
        state.player.mana = state.player.maxMana;
      }
    }
    if (state.player.betaCustom) {
      const build = betaClassBuilds[state.player.class];
      const race = betaRaces[state.player.raceKey];
      const weapon = betaWeapons[state.player.weaponKey];
      if (build && race && weapon) {
        state.player.schemaVersion = state.player.schemaVersion || CUSTOM_CHARACTER_SCHEMA_VERSION;
        state.player.weaponName = state.player.weaponName || weapon.name;
        state.player.knownAbilities = state.player.knownAbilities || [...new Set([...build.abilities, race.ability, weapon.skill].filter(Boolean))];
        state.player.maxMana = state.player.maxMana || Math.max(0, build.manaBase + betaModifier((state.player.attributes || {})[build.damageStat] || 10) + (race.mana || 0));
        if (state.player.mana === undefined) {
          state.player.mana = state.player.maxMana;
        }
      }
    }
    if (!state.player.flags) {
      state.player.flags = {};
    }
    if (state.player.flags.hasSilverMask === undefined) {
      state.player.flags.hasSilverMask = state.player.gear ? state.player.gear.includes("silver mask") : false;
    }
    if (state.player.flags.hasDoll === undefined) {
      state.player.flags.hasDoll = state.player.gear ? state.player.gear.includes("cracked doll") : false;
    }
    if (state.player.flags.pickedUpDoll === undefined) {
      state.player.flags.pickedUpDoll = state.player.flags.hasDoll;
    }
    if (state.player.flags.dollInSack === undefined) {
      state.player.flags.dollInSack = state.player.flags.hasDoll;
    }
    if (state.player.flags.dollRevealed === undefined) {
      state.player.flags.dollRevealed = false;
    }
    if (state.player.flags.wearingSilverMask === undefined) {
      state.player.flags.wearingSilverMask = false;
    }
    if (state.player.flags.maskPowerClaimed === undefined) {
      state.player.flags.maskPowerClaimed = state.player.flags.wearingSilverMask;
    }
    if (!state.player.flags.warehouseStage) {
      state.player.flags.warehouseStage = "not_started";
    }
    if (state.player.flags.warehouseRested === undefined) {
      state.player.flags.warehouseRested = false;
    }
    if (state.player.flags.bridgeEndMaskResolved === undefined) {
      state.player.flags.bridgeEndMaskResolved = false;
    }
    if (state.player.flags.maskCorruption === undefined) {
      state.player.flags.maskCorruption = 0;
    }
    if (state.player.flags.playerSuccumbedToMask === undefined) {
      state.player.flags.playerSuccumbedToMask = false;
    }
    if (state.player.flags.magistoneOrbSpent === undefined) {
      state.player.flags.magistoneOrbSpent = false;
    }
    if (state.player.flags.crownDestroyed === undefined) {
      state.player.flags.crownDestroyed = false;
    }
    if (state.player.flags.dollDestroyed === undefined) {
      state.player.flags.dollDestroyed = false;
    }
    if (state.player.flags.obliviarchDestroyed === undefined) {
      state.player.flags.obliviarchDestroyed = false;
    }
    if (state.player.flags.orderObservedPlayer === undefined) {
      state.player.flags.orderObservedPlayer = false;
    }
    if (!Array.isArray(state.player.flags.orderQuestionsAsked)) {
      state.player.flags.orderQuestionsAsked = [];
    }
    if (state.player.flags.bridgeEndRested === undefined) {
      state.player.flags.bridgeEndRested = false;
    }
    if (state.player.flags.castleSideRested === undefined) {
      state.player.flags.castleSideRested = false;
    }
    if (state.player.flags.hasCastleSupplies === undefined) {
      state.player.flags.hasCastleSupplies = false;
    }
    if (state.player.flags.servantAmbushCleared === undefined) {
      state.player.flags.servantAmbushCleared = false;
    }
    if (state.player.flags.orcCampOuterResolved === undefined) {
      state.player.flags.orcCampOuterResolved = false;
    }
    if (state.player.flags.orcCampPartyResolved === undefined) {
      state.player.flags.orcCampPartyResolved = false;
    }
    if (state.player.flags.aleBarrelUsed === undefined) {
      state.player.flags.aleBarrelUsed = false;
    }
    if (state.player.flags.partyRockTried === undefined) {
      state.player.flags.partyRockTried = false;
    }
    if (state.player.flags.bridgeWrongTurns === undefined) {
      state.player.flags.bridgeWrongTurns = 0;
    }
    if (state.player.flags.classSaveUsed === undefined) {
      state.player.flags.classSaveUsed = false;
    }
    if (state.player.flags.rescuedWazetax === undefined) {
      state.player.flags.rescuedWazetax = false;
    }
    if (state.player.flags.wazetaxHidden === undefined) {
      state.player.flags.wazetaxHidden = false;
    }
    if (!Array.isArray(state.player.flags.wazetaxQuestionsAsked)) {
      state.player.flags.wazetaxQuestionsAsked = [];
    }
    if (state.player.flags.bridgeXpAwarded === undefined) {
      state.player.flags.bridgeXpAwarded = false;
    }
    if (state.player.flags.districtsRested === undefined) {
      state.player.flags.districtsRested = false;
    }
    if (state.player.flags.cleanGetawayDistrict === undefined) {
      state.player.flags.cleanGetawayDistrict = false;
    }
    if (state.player.flags.largeManorCleared === undefined) {
      state.player.flags.largeManorCleared = false;
    }
    if (state.player.flags.mimicHouseCleared === undefined) {
      state.player.flags.mimicHouseCleared = false;
    }
    if (state.player.flags.smallShackCleared === undefined) {
      state.player.flags.smallShackCleared = false;
    }
    if (!isValidBridgeRoute(state.player.flags.bridgeRoute)) {
      state.player.flags.bridgeRoute = randomBridgeRoute();
    }
    if (state.player.flags.bridgeNavigationStep === undefined) {
      state.player.flags.bridgeNavigationStep = 0;
    }
    if (!state.player.upgrades) {
      state.player.upgrades = { ac: 0, damage: 0 };
    }
    if (state.player.healthPotions === undefined) {
      state.player.healthPotions = state.player.gear ? state.player.gear.filter((item) => item === "health potion").length : 0;
    }
    if (state.player.upgrades.ac === undefined) {
      state.player.upgrades.ac = 0;
    }
    if (state.player.upgrades.damage === undefined) {
      state.player.upgrades.damage = 0;
    }
  }

  function hasManaAbilities(player = state.player) {
    return Boolean(player && player.class !== "dm" && betaClassBuilds[player.class] && player.maxMana !== undefined);
  }

  function saveGame() {
    if (state.player) {
      localStorage.setItem(`${storagePrefix}${lang}.save`, JSON.stringify(state.player));
      saveCloudData();
      showNotice(t("ui.game_saved"));
    }
  }

  function showNotice(message) {
    state.notice = message;
    if (state.noticeTimer) {
      window.clearTimeout(state.noticeTimer);
    }
    state.noticeTimer = window.setTimeout(() => {
      state.notice = "";
      state.noticeTimer = null;
      render();
    }, 2400);
    render();
  }

  function loadGame() {
    const saved = localStorage.getItem(`${storagePrefix}${lang}.save`);
    if (!saved) {
      writeKey("ui.no_saved_game");
      return;
    }
    try {
      state.player = JSON.parse(saved);
      ensurePlayerState();
      checkStatAchievements();
      writeKey("ui.loaded_game", {}, true);
      continueChapter(state.player.chapter || "caravan");
    } catch {
      writeKey("ui.save_read_error");
    }
  }

  function defaultStats() {
    const stats = { _achievements: {}, _deathReasons: [] };
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
    saveCloudData();
  }

  function promptText(message, fallback = "", options = {}) {
    return new Promise((resolve) => {
      state.promptDialog = {
        title: options.title || message,
        body: options.body || "",
        input: true,
        password: Boolean(options.password),
        value: fallback || "",
        placeholder: options.placeholder || "",
        maxLength: options.maxLength || null,
        normalize: options.normalize || null,
        validate: options.validate || null,
        error: "",
        confirmLabel: options.confirmLabel || ui.promptContinue,
        cancelLabel: options.cancelLabel || ui.promptCancel,
        resolve
      };
      render();
    });
  }

  function confirmDialog(title, body, options = {}) {
    return new Promise((resolve) => {
      state.promptDialog = {
        title,
        body,
        input: false,
        confirmLabel: options.confirmLabel || ui.promptConfirm,
        cancelLabel: options.cancelLabel || ui.promptCancel,
        resolve
      };
      render();
    });
  }

  function namePromptOptions(options = {}) {
    return {
      maxLength: NAME_MAX_LENGTH,
      normalize: normalizeName,
      validate: (value) => validateName(value, options)
    };
  }

  function normalizeName(value) {
    return String(value || "").replace(/\s+/g, " ").trim();
  }

  function validateName(value, options = {}) {
    const cleanName = normalizeName(value);
    if (!cleanName) {
      return ui.nameRequired;
    }
    if (cleanName.length > NAME_MAX_LENGTH) {
      return format(ui.nameTooLong, { max: NAME_MAX_LENGTH });
    }
    if (options.publicName && isBlockedPublicName(cleanName)) {
      return ui.nameBlocked;
    }
    return "";
  }

  function isBlockedPublicName(value) {
    const normalized = normalizeName(value).toLowerCase().replace(/[^a-z0-9]/g, "");
    return PUBLIC_NAME_DENYLIST.some((blocked) => normalized.includes(blocked));
  }

  function loadJson(key, fallback) {
    try {
      return JSON.parse(localStorage.getItem(`${storagePrefix}${key}`)) || fallback;
    } catch {
      return fallback;
    }
  }

  function loadMusicEnabled() {
    try {
      const saved = localStorage.getItem(`${storagePrefix}musicEnabled`);
      return saved === null ? true : JSON.parse(saved) !== false;
    } catch {
      return true;
    }
  }

  function loadMusicVolume() {
    try {
      const saved = Number(localStorage.getItem(`${storagePrefix}musicVolume`));
      if (!Number.isFinite(saved)) {
        return 1;
      }
      return Math.max(0, Math.min(100, saved)) / 100;
    } catch {
      return 1;
    }
  }

  function statusText() {
    if (!state.player) {
      return "";
    }
    if (hasManaAbilities()) {
      return `${state.player.name} the ${state.player.race} ${state.player.title}   HP: ${state.player.health}/${state.player.maxHealth}   Mana: ${state.player.mana}/${state.player.maxMana}   Weapon: ${state.player.weaponName}`;
    }
    return `${state.player.name} the ${state.player.title}   Health: ${state.player.health}/${state.player.maxHealth}   Gold: ${state.player.gold}   Supplies: ${state.player.supplies}   Gear: ${state.player.gear.join(", ") || t("ui.none")}`;
  }

  function sheetText() {
    if (!state.player) {
      return ui.noCharacter;
    }
    const stats = combatStats();
    const lines = [
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
    ];
    if (hasManaAbilities()) {
      lines.push(
        `${"Mana".padEnd(18)}${state.player.mana}/${state.player.maxMana}`,
        `${"Weapon".padEnd(18)}${state.player.weaponName}`,
      );
      if (state.player.betaCustom) {
        lines.push(
          "",
          "Attributes",
          "------------------------------",
          betaAttributeLine(state.player.attributes),
        );
      }
      lines.push(
        "",
        "Powers",
        "------------------------------",
        (state.player.knownAbilities || []).map((id) => betaPowers[id] ? `${betaPowers[id].name} (${betaPowers[id].cost} mana)` : id).join("\n") || t("ui.none")
      );
    }
    lines.push(
      "",
      ui.equipment,
      "------------------------------",
      state.player.gear.join("\n") || t("ui.none"),
      enemyHpText()
    );
    return lines.join("\n");
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
    const nameWidth = Math.max(...state.combat.enemies.map((enemy) => enemy.name.length)) + 2;
    state.combat.enemies.forEach((enemy) => {
      lines.push(`${enemy.name.padEnd(nameWidth)}${Math.max(0, enemy.hp)}/${enemy.maxHp}`);
    });
    return lines.join("\n");
  }

  function plotText() {
    const lines = [t("ui.stats_heading")];
    Object.keys(classes).forEach((key) => {
      const stats = state.stats[key];
      lines.push(`${stats.name}: Runs ${stats.runs} | Endings ${stats.reached_end} | Deaths ${stats.died} | Forest attempts ${stats.forest_attempts}`);
    });
    lines.push("", ...achievementLines());
    return lines.join("\n");
  }

  function achievementsText() {
    return achievementLines().join("\n");
  }

  function achievementLines() {
    const lines = [t("ui.achievements_heading")];
    const unlocked = Object.keys(achievements).filter((key) => state.stats._achievements[key]);
    lines.push(t("ui.achievements_progress", { unlocked: unlocked.length, total: Object.keys(achievements).length }));
    if (!unlocked.length) {
      lines.push(t("ui.no_achievements"));
    } else {
      unlocked.forEach((id) => lines.push(achievements[id]));
    }
    return lines;
  }

  function choice(label, action, options = {}) {
    return { label, action, ...options };
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
