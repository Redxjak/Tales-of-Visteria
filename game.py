import json
import random
import sys
import tkinter as tk
from pathlib import Path
from tkinter import messagebox, simpledialog


def resource_path(filename):
    if hasattr(sys, "_MEIPASS"):
        return Path(sys._MEIPASS) / filename
    return Path(filename)


SAVE_FILE = Path("savegame.json")
STATS_FILE = Path("player_stats.json")
MONSTER_FILE = resource_path("monster_stats.json")
GAME_OVER_IMAGE = resource_path("game_over_party.png")
TEXT_FILE = resource_path("translations/en.json")
APP_VERSION = "0.7.5"

CLASSES = {
    "warrior": {
        "name": "Cletus",
        "title": "Barbarian",
        "health": 55,
        "gold": 6,
        "supplies": 2,
        "gear": ["greataxe", "travel cloak"],
        "bonus": "combat",
        "description": "A Goliath Barbarian with high health and brutal melee attacks.",
    },
    "ranger": {
        "name": "Ren",
        "title": "Ranger",
        "health": 44,
        "gold": 8,
        "supplies": 3,
        "gear": ["longbow", "short blade"],
        "bonus": "sneak",
        "description": "An Elven Ranger with strong accuracy and two attacks.",
    },
    "scholar": {
        "name": "Cal",
        "title": "Warlock",
        "health": 45,
        "gold": 10,
        "supplies": 2,
        "gear": ["old journal", "silver charm", "eldritch focus"],
        "bonus": "persuasion",
        "description": "A Human Warlock with eldritch power and persuasion.",
    },
    "dwarf": {
        "name": "Kili",
        "title": "Fighter",
        "health": 49,
        "gold": 7,
        "supplies": 3,
        "gear": ["battleaxe", "stone token"],
        "bonus": "lore",
        "description": "A Dwarven Fighter with armor, stamina, and two attacks.",
    },
    "dm": {
        "name": "Jon",
        "title": "DM",
        "health": 69,
        "gold": 420,
        "supplies": 0,
        "gear": ["DM screen", "loaded d20"],
        "bonus": "fate",
        "description": "A nicotine addicted God controlling the story from above.",
    },
}

PLAYER_COMBAT_STATS = {
    "warrior": {"ac": 15, "attack_bonus": 6, "damage_die": 12, "damage_bonus": 4, "attacks": 2},
    "ranger": {"ac": 15, "attack_bonus": 7, "damage_die": 8, "damage_bonus": 4, "attacks": 2},
    "scholar": {"ac": 14, "attack_bonus": 7, "damage_die": 10, "damage_bonus": 4, "attacks": 2},
    "dwarf": {"ac": 16, "attack_bonus": 7, "damage_die": 8, "damage_bonus": 4, "attacks": 2},
    "dm": {"ac": 99, "attack_bonus": 99, "damage_die": 20, "damage_bonus": 99, "attacks": 1},
}

MONSTER_ATTACKS = {
    "orc": {"attack_bonus": 5, "damage_die": 12, "damage_bonus": 3},
    "goblin": {"attack_bonus": 4, "damage_die": 6, "damage_bonus": 2},
    "ghoul": {"attack_bonus": 4, "damage_die": 6, "damage_bonus": 2},
    "gremlin": {"attack_bonus": 4, "damage_die": 6, "damage_bonus": 1},
    "mimic": {"attack_bonus": 5, "damage_die": 8, "damage_bonus": 3},
}

THRONE_MAP_DIRECTIONS = ["left", "up", "right", "down"]
BASE_LEVEL = 5
BASE_XP_TO_NEXT = 100
XP_PER_LEVEL = 50

MONSTER_XP = {
    "goblin": 20,
    "orc": 35,
    "ghoul": 25,
    "gremlin": 20,
    "mimic": 45,
}

MAJOR_DECISION_XP = {
    "caravan_run": 20,
    "forest_attempt": 10,
    "choose_cave": 20,
    "go_deeper": 15,
    "ghost_choice": 20,
    "doll_choice": 15,
    "district_choice": 20,
    "search": 15,
    "residential_choice": 20,
    "loot": 20,
    "bridge": 25,
}

ACHIEVEMENTS = {
    "first_fight": {
        "name": "First Blood",
        "description": "Win your first real fight.",
    },
    "ghost_ally": {
        "name": "Tiny Terror",
        "description": "Convince the ghost girl to fight for you.",
    },
    "group_kill": {
        "name": "Crowd Control",
        "description": "Achieve a group kill before the enemies can react.",
    },
    "lucky": {
        "name": "Lucky",
        "description": "Roll a natural 20.",
    },
    "unlucky": {
        "name": "Unlucky",
        "description": "Roll a natural 1.",
    },
    "forest_mind_break": {
        "name": "Dazed and Confused",
        "description": "Lose yourself by choosing the forest too many times.",
    },
    "ghost_slayer": {
        "name": "Ghost Slayer",
        "description": "Successfully drive off the ghost girl in a fight.",
    },
    "ghost_kiss": {
        "name": "Not Your Goth Baddie",
        "description": "Try to kiss the ghost girl.",
    },
    "pyromaniac": {
        "name": "Pyromaniac",
        "description": "Burn the suspiciously perfect house.",
    },
    "send_hydra": {
        "name": "Fuck Dem Kids",
        "description": "Send the hydra.",
    },
    "correct_chest_key": {
        "name": "Keyed In",
        "description": "Choose the correct key for the trapped chest.",
    },
    "trap_dodger": {
        "name": "Light Feet",
        "description": "Successfully avoid the bridge traps.",
    },
    "mimic_nap": {
        "name": "Sleep Tight",
        "description": "Choose to sleep in the mimic house.",
    },
    "played_everyone": {
        "name": "Full Party",
        "description": "Play each character once.",
    },
}

class TalesOfVisteriaApp:
    def __init__(self, root):
        self.root = root
        self.root.title(f"Tales of Visteria v{APP_VERSION}")
        self.root.geometry("1180x720")
        self.root.minsize(960, 560)
        self.player = None
        self.pending_bridge = False
        self.pending_level_callback = None
        self.combat = None
        self.game_over_image = None
        self.monsters = self.load_monsters()
        self.text_content = self.load_text_content()
        self.stats = self.load_stats()
        self.account_name = self.text("ui.guest")

        self.root.configure(bg="#141414")
        self.root.grid_rowconfigure(2, weight=1)
        self.root.grid_columnconfigure(0, weight=1)

        self.title_label = tk.Label(
            root,
            text="Tales of Visteria",
            bg="#141414",
            fg="#f2e6c9",
            font=("Georgia", 26, "bold"),
            pady=16,
        )
        self.title_label.grid(row=0, column=0, sticky="ew")

        self.status_var = tk.StringVar(value="")
        self.status_label = tk.Label(
            root,
            textvariable=self.status_var,
            bg="#24211d",
            fg="#e7d7b4",
            font=("Segoe UI", 11),
            anchor="w",
            padx=14,
            pady=8,
        )
        self.status_label.grid(row=1, column=0, sticky="ew", padx=18)

        content_frame = tk.Frame(root, bg="#141414")
        content_frame.grid(row=2, column=0, sticky="nsew", padx=18, pady=14)
        content_frame.grid_rowconfigure(0, weight=1)
        content_frame.grid_columnconfigure(1, weight=1)

        self.character_panel = self.create_info_panel(content_frame, "Character Sheet", width=30)
        self.character_panel.grid(row=0, column=0, sticky="ns", padx=(0, 12))

        story_frame = tk.Frame(content_frame, bg="#141414")
        story_frame.grid(row=0, column=1, sticky="nsew")
        story_frame.grid_rowconfigure(0, weight=1)
        story_frame.grid_columnconfigure(0, weight=1)

        self.story_text = tk.Text(
            story_frame,
            wrap="word",
            bg="#1d1b18",
            fg="#f5ead2",
            insertbackground="#f5ead2",
            selectbackground="#4b352a",
            selectforeground="#fff5dd",
            relief="flat",
            padx=18,
            pady=18,
            font=("Georgia", 14),
            spacing1=4,
            spacing3=10,
            borderwidth=0,
            highlightthickness=1,
            highlightbackground="#342b24",
            highlightcolor="#6f2d2d",
            cursor="arrow",
            takefocus=0,
        )
        self.story_text.grid(row=0, column=0, sticky="nsew")
        self.story_text.tag_configure("story_center", justify="center")
        self.story_text.configure(state="disabled")

        scrollbar = tk.Scrollbar(story_frame, command=self.story_text.yview)
        scrollbar.grid(row=0, column=1, sticky="ns")
        self.story_text.configure(yscrollcommand=scrollbar.set)

        self.progress_panel = self.create_info_panel(content_frame, "Plot Development", width=34)
        self.progress_panel.grid(row=0, column=2, sticky="ns", padx=(12, 0))

        self.choice_frame = tk.Frame(root, bg="#141414")
        self.choice_frame.grid(row=3, column=0, sticky="ew", padx=18, pady=(0, 18))

        self.show_login_screen()

    def create_info_panel(self, parent, title, width):
        panel = tk.Frame(parent, bg="#1d1b18", highlightthickness=1, highlightbackground="#342b24")
        label = tk.Label(
            panel,
            text=title,
            bg="#24211d",
            fg="#f2e6c9",
            font=("Segoe UI", 11, "bold"),
            anchor="w",
            padx=10,
            pady=6,
        )
        label.pack(fill="x")

        text = tk.Text(
            panel,
            width=width,
            wrap="word",
            bg="#1d1b18",
            fg="#f5ead2",
            relief="flat",
            padx=10,
            pady=10,
            font=("Consolas", 10),
            borderwidth=0,
            highlightthickness=0,
            cursor="arrow",
            takefocus=0,
        )
        text.pack(fill="both", expand=True)
        text.configure(state="disabled")
        panel.text_widget = text
        return panel

    def set_panel_text(self, panel, text):
        widget = panel.text_widget
        widget.configure(state="normal")
        widget.delete("1.0", "end")
        widget.insert("end", text)
        widget.configure(state="disabled")

    def load_monsters(self):
        if not MONSTER_FILE.exists():
            return {}
        try:
            return json.loads(MONSTER_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return {}

    def load_text_content(self):
        if not TEXT_FILE.exists():
            return {}
        try:
            content = json.loads(TEXT_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return {}
        return content if isinstance(content, dict) else {}

    def text(self, key, **values):
        template = self.text_content.get(key, key)
        if not values:
            return template
        try:
            return template.format(**values)
        except (KeyError, ValueError):
            return template

    def write_text(self, key, clear=False, **values):
        self.write(self.text(key, **values), clear=clear)

    def default_stats(self):
        stats = {
            key: {
                "name": data["name"],
                "runs": 0,
                "reached_end": 0,
                "died": 0,
                "forest_attempts": 0,
            }
            for key, data in CLASSES.items()
        }
        stats["_achievements"] = {}
        return stats

    def load_stats(self):
        stats = self.default_stats()
        if STATS_FILE.exists():
            try:
                saved_stats = json.loads(STATS_FILE.read_text(encoding="utf-8"))
            except json.JSONDecodeError:
                saved_stats = {}
            for key, values in saved_stats.items():
                if key in stats and isinstance(values, dict):
                    stats[key].update(values)
            achievements = saved_stats.get("_achievements", {})
            if isinstance(achievements, dict):
                stats["_achievements"].update(achievements)
        return stats

    def save_stats(self):
        STATS_FILE.write_text(json.dumps(self.stats, indent=2), encoding="utf-8")

    def record_stat(self, stat_name):
        if not self.player:
            return
        character_class = self.player["class"]
        if character_class not in self.stats:
            return
        self.stats[character_class][stat_name] += 1
        self.save_stats()

    def unlock_achievement(self, achievement_id):
        if achievement_id not in ACHIEVEMENTS:
            return
        unlocked = self.stats.setdefault("_achievements", {})
        if achievement_id in unlocked:
            return

        unlocked[achievement_id] = True
        self.save_stats()
        achievement = ACHIEVEMENTS[achievement_id]
        self.write_text(
            "ui.achievement_unlocked",
            name=achievement["name"],
            description=achievement["description"],
        )
        self.refresh_side_panels()

    def check_played_everyone_achievement(self):
        if all(self.stats.get(character_class, {}).get("runs", 0) > 0 for character_class in CLASSES):
            self.unlock_achievement("played_everyone")

    def achievements_summary(self):
        lines = [self.text("ui.achievements_heading")]
        unlocked = self.stats.get("_achievements", {})
        visible = [achievement_id for achievement_id in ACHIEVEMENTS if unlocked.get(achievement_id)]
        lines.append(
            self.text(
                "ui.achievements_progress",
                unlocked=len(visible),
                total=len(ACHIEVEMENTS),
            )
        )
        if not visible:
            lines.append(self.text("ui.no_achievements"))
            return lines

        for achievement_id in visible:
            achievement = ACHIEVEMENTS[achievement_id]
            lines.append(
                self.text(
                    "ui.achievement_line",
                    name=achievement["name"],
                    description=achievement["description"],
                )
            )
        return lines

    def stats_summary(self):
        lines = [self.text("ui.stats_heading")]
        for key, data in CLASSES.items():
            stats = self.stats.get(key, {})
            lines.append(
                self.text(
                    "ui.stats_line",
                    name=data["name"],
                    runs=stats.get("runs", 0),
                    endings=stats.get("reached_end", 0),
                    deaths=stats.get("died", 0),
                    forest_attempts=stats.get("forest_attempts", 0),
                )
            )
        lines.extend(["", *self.achievements_summary()])
        return "\n".join(lines)

    def character_sheet_text(self):
        if not self.player:
            return "No character selected.\n\nStart a new game or load a save."

        stats = self.player_combat_stats()
        xp = self.player.get("experience", 0)
        xp_to_next = self.player.get("xp_to_next", BASE_XP_TO_NEXT)
        filled = 0 if xp_to_next <= 0 else min(20, int((xp / xp_to_next) * 20))
        xp_bar = "[" + "#" * filled + "-" * (20 - filled) + "]"
        lines = [
            "Trait              Value",
            "-" * 30,
            f"Name               {self.player['name']}",
            f"Class              {self.player['title']}",
            f"Level              {self.player.get('level', BASE_LEVEL)}" if self.player["class"] != "dm" else "Level              DM",
            f"Experience         {xp}/{xp_to_next}",
            f"XP Progress        {xp_bar}",
            f"HP                 {self.player['health']}/{self.player['max_health']}",
            f"AC                 {stats['ac']}",
            f"Attack Bonus       +{stats['attack_bonus']}",
            f"Damage             d{stats['damage_die']} + {stats['damage_bonus']}",
            f"Attacks            {stats.get('attacks', 1)}",
            f"Gold               {self.player['gold']}",
            f"Supplies           {self.player['supplies']}",
            "",
            "Equipment",
            "-" * 30,
        ]
        lines.extend(f"- {item}" for item in self.player["gear"])
        if not self.player["gear"]:
            lines.append("- none")

        inventory = []
        for item in (
            "health potion",
            "cracked doll",
            "throne room map",
            "torn bridge map",
            "dwarven ale",
            "unmarked keys",
            "small black chest",
            "magistone orb",
        ):
            if item in self.player["gear"]:
                inventory.append(item)
        if not inventory:
            inventory.append("none")

        lines.extend(["", "Inventory", "-" * 30])
        lines.extend(f"- {item}" for item in inventory)
        return "\n".join(lines)

    def progress_text(self):
        if not self.player:
            return self.stats_summary()

        flags = self.player["flags"]
        chapter = self.player["chapter"]
        chapter_order = [
            "caravan",
            "escape",
            "cave",
            "ghost",
            "districts",
            "residential",
            "bridge",
            "production",
            "complete",
        ]
        current_index = chapter_order.index(chapter) if chapter in chapter_order else -1

        def checked(label, done):
            return f"[{'x' if done else ' '}] {label}"

        lines = [
            "Plot Development",
            "-" * 30,
            checked("Caravan attack", current_index >= 1 or self.player["class"] == "dm"),
            checked("Escaped to the cave", current_index >= 2),
            checked("Met the pale girl", current_index >= 3),
            checked("Reached the road sign", current_index >= 4),
            checked("Explored a district", current_index >= 5),
            checked("Reached residential area", current_index >= 6),
            checked("Reached the bridge", current_index >= 7 or flags.get("bridge_crossed")),
            checked("Escaped the buried city", chapter == "complete"),
            "",
            "Quests",
            "-" * 30,
            checked("Survive Visteria", chapter == "complete"),
            checked("Find the throne map", flags.get("has_throne_map", False)),
            checked("Find partial bridge directions", flags.get("has_partial_map", False)),
            checked("Remember bridge directions", flags.get("has_throne_map", False)),
            checked("Carry the cracked doll", flags.get("has_doll", False)),
            checked("Recover the magistone orb", flags.get("has_magistone_orb", False)),
            "",
            "Session Notes",
            "-" * 30,
            f"Forest attempts: {flags.get('forest_attempts', 0)}/5",
        ]
        if flags.get("girl_hint") == "merchant_glowy_ball":
            lines.append('Girl hint: "fun glowy ball" in the merchant district')
        elif flags.get("girl_hint"):
            lines.append("Girl hint: barracks / merchant district")
        if flags.get("monsters_scattered"):
            lines.append("Orcs and goblins scattered by the pale girl")
        lines.extend(["", *self.achievements_summary()])
        return "\n".join(lines)

    def refresh_side_panels(self):
        if hasattr(self, "character_panel"):
            self.set_panel_text(self.character_panel, self.character_sheet_text())
        if hasattr(self, "progress_panel"):
            self.set_panel_text(self.progress_panel, self.progress_text())

    def write(self, text, clear=False):
        self.story_text.configure(state="normal")
        if clear:
            self.story_text.delete("1.0", "end")
        elif self.story_text.get("1.0", "end-1c").strip():
            self.story_text.insert("end", "------------------------------\n\n", "story_center")
        self.story_text.insert("end", text.strip() + "\n\n", "story_center")
        self.story_text.see("end")
        self.story_text.configure(state="disabled")

    def show_story_image(self, image_path, subsample=3):
        if not image_path.exists():
            return

        image = tk.PhotoImage(file=str(image_path))
        if subsample > 1:
            image = image.subsample(subsample, subsample)

        self.game_over_image = image
        self.story_text.configure(state="normal")
        self.story_text.image_create("end", image=self.game_over_image)
        self.story_text.insert("end", "\n\n")
        self.story_text.see("end")
        self.story_text.configure(state="disabled")

    def monster_line(self, name):
        monster = self.monsters.get(name.lower())
        if not monster:
            return ""
        return self.text(
            "ui.monster_stats",
            name=monster["name"],
            cr=monster["cr"],
            ac=monster["ac"],
            hp=monster["hp"],
            strength=monster["str"],
            dexterity=monster["dex"],
            constitution=monster["con"],
        )

    def show_monsters(self, names):
        lines = [self.monster_line(name) for name in names]
        lines = [line for line in lines if line]
        if lines:
            self.write(self.text("ui.monster_reference") + "\n" + "\n".join(lines))

    def set_choices(self, choices):
        for child in self.choice_frame.winfo_children():
            child.destroy()

        max_columns = 4
        columns = min(max_columns, max(1, len(choices)))
        for column in range(columns):
            self.choice_frame.grid_columnconfigure(column, weight=1, uniform="choices")

        for index, (label, command) in enumerate(choices):
            button = tk.Button(
                self.choice_frame,
                text=label,
                command=command,
                bg="#6f2d2d",
                fg="#fff5dd",
                activebackground="#8c3a38",
                activeforeground="#fff5dd",
                relief="flat",
                padx=14,
                pady=10,
                font=("Segoe UI", 11, "bold"),
                cursor="hand2",
                borderwidth=0,
                highlightthickness=1,
                highlightbackground="#9a6b47",
                highlightcolor="#d8b36a",
                takefocus=1,
            )
            row = index // max_columns
            column = index % max_columns
            button.grid(row=row, column=column, sticky="ew", padx=5, pady=5)

    def update_status(self):
        if not self.player:
            self.status_var.set(self.text("choice.main_menu"))
            self.refresh_side_panels()
            return

        gear = ", ".join(self.player["gear"]) if self.player["gear"] else self.text("ui.none")
        title = self.player.get("title", CLASSES[self.player["class"]]["title"])
        self.status_var.set(
            self.text(
                "ui.status",
                name=self.player["name"],
                title=title,
                health=self.player["health"],
                max_health=self.player["max_health"],
                gold=self.player["gold"],
                supplies=self.player["supplies"],
                gear=gear,
            )
        )
        self.refresh_side_panels()

    def new_player(self, character_class):
        template = CLASSES[character_class]
        self.player = {
            "name": template["name"],
            "class": character_class,
            "title": template["title"],
            "health": template["health"],
            "max_health": template["health"],
            "gold": template["gold"],
            "supplies": template["supplies"],
            "gear": list(template["gear"]),
            "bonus": template["bonus"],
            "level": BASE_LEVEL,
            "experience": 0,
            "xp_to_next": BASE_XP_TO_NEXT,
            "upgrades": {
                "ac": 0,
                "damage": 0,
            },
            "chapter": "dm_intro" if character_class == "dm" else "caravan",
            "flags": {
                "forest_attempts": 0,
                "girl_helped": False,
                "girl_angry": False,
                "bridge_crossed": False,
                "has_doll": False,
                "girl_hint": "",
                "monsters_scattered": False,
                "has_throne_map": False,
                "has_partial_map": False,
                "has_dwarven_ale": False,
                "has_manor_keys": False,
                "has_black_chest": False,
                "has_magistone_orb": False,
                "death_recorded": False,
                "completed_recorded": False,
            },
        }
        self.record_stat("runs")
        self.update_status()
        self.continue_chapter(clear=True)
        self.check_played_everyone_achievement()

    def ensure_player_defaults(self, player):
        if player.get("class") in CLASSES:
            player["title"] = CLASSES[player["class"]]["title"]
            player.setdefault("max_health", CLASSES[player["class"]]["health"])
        player.setdefault("level", BASE_LEVEL)
        player.setdefault("experience", 0)
        player.setdefault("xp_to_next", BASE_XP_TO_NEXT + max(0, player["level"] - BASE_LEVEL) * XP_PER_LEVEL)
        upgrades = player.setdefault("upgrades", {})
        upgrades.setdefault("ac", 0)
        upgrades.setdefault("damage", 0)
        flags = player.setdefault("flags", {})
        flags.setdefault("forest_attempts", 0)
        flags.setdefault("girl_helped", False)
        flags.setdefault("girl_angry", False)
        flags.setdefault("bridge_crossed", False)
        flags.setdefault("has_doll", False)
        flags.setdefault("girl_hint", "")
        flags.setdefault("monsters_scattered", False)
        flags.setdefault("has_throne_map", False)
        flags.setdefault("has_partial_map", False)
        flags.setdefault("has_dwarven_ale", False)
        flags.setdefault("has_manor_keys", False)
        flags.setdefault("has_black_chest", False)
        flags.setdefault("has_magistone_orb", False)
        flags.setdefault("death_recorded", False)
        flags.setdefault("completed_recorded", False)

    def save_game(self):
        if not self.player:
            return
        SAVE_FILE.write_text(json.dumps(self.player, indent=2), encoding="utf-8")
        self.write_text("ui.game_saved")

    def load_game(self):
        if not SAVE_FILE.exists():
            messagebox.showinfo(self.text("ui.load_game_title"), self.text("ui.no_saved_game"))
            return
        try:
            self.player = json.loads(SAVE_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            messagebox.showerror(self.text("ui.load_game_title"), self.text("ui.save_read_error"))
            return

        self.ensure_player_defaults(self.player)
        self.update_status()
        self.write_text("ui.loaded_game", clear=True)
        self.continue_chapter()

    def add_item(self, item):
        if item not in self.player["gear"]:
            self.player["gear"].append(item)
            self.update_status()

    def remove_item(self, item):
        if item in self.player["gear"]:
            self.player["gear"].remove(item)
            self.update_status()

    def roll_d20(self, skill):
        bonus = 2 if self.player["bonus"] == skill else 0
        natural = random.randint(1, 20)
        self.track_natural_roll(natural)
        result = natural + bonus
        self.write_text("ui.roll", result=result)
        return result

    def track_natural_roll(self, natural):
        if natural == 20:
            self.unlock_achievement("lucky")
        elif natural == 1:
            self.unlock_achievement("unlucky")

    def roll(self, skill, difficulty):
        result = self.roll_d20(skill)
        self.write_text("ui.difficulty", difficulty=difficulty)
        return result >= difficulty

    def check_death(self):
        self.update_status()
        if self.player and self.player["health"] <= 0:
            self.game_over()
            return True
        return False

    def set_game_over_reason(self, reason):
        if self.player:
            self.player["game_over_reason"] = reason

    def show_login_screen(self):
        self.player = None
        self.update_status()
        self.write_text("story.login", clear=True)
        self.set_choices(
            [
                (self.text("choice.login"), self.login),
                (self.text("choice.play_as_guest"), self.play_as_guest),
            ]
        )

    def login(self):
        account_name = simpledialog.askstring(
            self.text("choice.login"),
            self.text("ui.login_prompt"),
            parent=self.root,
        )
        if not account_name:
            return
        self.account_name = account_name.strip()[:32] or self.text("ui.guest")
        self.show_start_screen()

    def play_as_guest(self):
        self.account_name = self.text("ui.guest")
        self.show_start_screen()

    def show_start_screen(self):
        self.player = None
        self.update_status()
        self.write_text("story.start", stats=self.stats_summary(), clear=True)
        self.set_choices(
            [
                (self.text("choice.new_game"), self.show_character_select),
                (self.text("choice.load_game"), self.load_game),
                (self.text("choice.quit"), self.root.destroy),
            ]
        )

    def show_character_select(self):
        lines = [self.text("story.character_select")]
        for key, data in CLASSES.items():
            lines.append(f"{data['name']} the {data['title']}: {data['description']}")
        self.write("\n".join(lines), clear=True)
        self.set_choices(
            [
                ("Cletus", lambda: self.new_player("warrior")),
                ("Ren", lambda: self.new_player("ranger")),
                ("Cal", lambda: self.new_player("scholar")),
                ("Kili", lambda: self.new_player("dwarf")),
                ("Jon the DM", lambda: self.new_player("dm")),
                (self.text("choice.back"), self.show_start_screen),
            ]
        )

    def continue_chapter(self, clear=False):
        if self.check_death():
            return

        chapter = self.player["chapter"]
        if chapter == "dm_intro":
            self.dm_intro(clear)
        elif chapter == "dm_ghost":
            self.dm_ghost(clear)
        elif chapter == "dm_districts":
            self.dm_districts(clear)
        elif chapter == "caravan":
            self.caravan(clear)
        elif chapter == "escape":
            self.escape(clear)
        elif chapter == "cave":
            self.cave(clear)
        elif chapter == "ghost":
            self.ghost_girl(clear)
        elif chapter == "districts":
            self.districts(clear)
        elif chapter == "residential":
            self.residential_area(clear)
        elif chapter == "bridge":
            self.bridge_prompt(clear)
        elif chapter == "production":
            self.production_area(clear)
        elif chapter == "complete":
            self.complete(clear)
        else:
            self.write_text("ui.unknown_chapter", clear=clear)
            self.set_choices([(self.text("choice.main_menu"), self.show_start_screen)])

    def dm_intro(self, clear=False):
        self.write_text("story.dm_intro", clear=clear)
        self.set_choices(
            [
                (self.text("choice.dm_orcs"),
                 lambda: self.dm_send_trouble("orcs")),
                (self.text("choice.dm_hydra"),
                 lambda: self.dm_send_trouble("hydra")),
                (self.text("choice.save"), self.save_game),
                (self.text("choice.main_menu"), self.show_start_screen),
            ]
        )

    def dm_send_trouble(self, choice):
        if choice == "hydra":
            self.show_monsters(["Hydra"])
            self.write_text("story.dm_send_hydra")
            self.unlock_achievement("send_hydra")
            self.set_game_over_reason("hydra")
            self.player["health"] = 0
            self.check_death()
            return

        self.show_monsters(["Orc", "Goblin"])
        self.write_text("story.dm_send_orcs")
        self.set_choices(
            [
                (self.text("choice.caves"), lambda: self.dm_choose_route("caves")),
                (self.text("choice.forest"), lambda: self.dm_choose_route("forest")),
            ]
        )

    def dm_choose_route(self, choice):
        if choice == "forest":
            self.write_text("story.dm_choose_forest")
        else:
            self.write_text("story.dm_choose_caves")
        self.player["chapter"] = "dm_ghost"
        self.continue_chapter()

    def dm_ghost(self, clear=False):
        self.write_text("story.dm_ghost", clear=clear)
        self.set_choices(
            [
                ("Cletus", lambda: self.dm_watch("cletus")),
                ("Cal", lambda: self.dm_watch("cal")),
                ("Ren", lambda: self.dm_watch("ren")),
                ("Kili", lambda: self.dm_watch("kili")),
            ]
        )

    def dm_watch(self, choice):
        roll = random.randint(1, 20)
        self.track_natural_roll(roll)
        result_key = "low" if roll <= 10 else "high"
        self.write_text("story.dm_watch_result", roll=roll, result=self.text(f"story.dm_watch_{choice}_{result_key}"))
        self.write_text("story.dm_watch_continue")
        self.player["chapter"] = "dm_districts"
        self.set_choices([(self.text("choice.keep_watching"), self.dm_districts)])

    def dm_districts(self, clear=False):
        self.write_text("story.dm_districts", clear=clear)
        self.set_choices(
            [
                (self.text("choice.dm_barracks"), self.dm_barracks),
                (self.text("choice.dm_merchant"), self.dm_merchant),
            ]
        )

    def dm_barracks(self):
        self.write_text("story.dm_barracks")
        self.set_choices(
            [
                (self.text("choice.dm_barracks_armory"), self.dm_barracks_armory),
                (self.text("choice.dm_barracks_quarters"), self.dm_barracks_quarters),
                (self.text("choice.dm_barracks_combat"), self.dm_barracks_combat),
            ]
        )

    def dm_barracks_armory(self):
        roll = random.randint(1, 20)
        self.track_natural_roll(roll)
        result_key = "low" if roll <= 10 else "high"
        self.write_text("story.dm_barracks_armory", roll=roll, result=self.text(f"story.dm_barracks_armory_{result_key}"))
        self.set_choices([(self.text("choice.roll_loot"), self.dm_barracks_loot)])

    def dm_barracks_quarters(self):
        roll = random.randint(1, 20)
        self.track_natural_roll(roll)
        result_key = "low" if roll <= 10 else "high"
        self.write_text("story.dm_barracks_quarters", roll=roll, result=self.text(f"story.dm_barracks_quarters_{result_key}"))
        self.set_choices([(self.text("choice.roll_loot"), self.dm_barracks_loot)])

    def dm_barracks_combat(self):
        self.write_text("story.dm_barracks_combat")
        self.set_choices([(self.text("choice.loot_bodies"), self.dm_barracks_map)])

    def dm_barracks_loot(self):
        roll = random.randint(1, 20)
        self.track_natural_roll(roll)
        if roll <= 7:
            result_key = "low"
        elif roll <= 14:
            result_key = "mid"
        else:
            result_key = "high"
        self.write_text("story.dm_barracks_loot", roll=roll, result=self.text(f"story.dm_barracks_loot_{result_key}"))
        if roll > 14:
            self.set_choices([(self.text("choice.read_map"), self.dm_barracks_map)])
        else:
            self.set_choices([(self.text("choice.move_houses"), self.dm_residential)])

    def dm_barracks_map(self):
        self.write_text("story.dm_barracks_map")
        self.set_choices([(self.text("choice.move_houses"), self.dm_residential)])

    def dm_merchant(self):
        self.write_text("story.dm_merchant")
        self.set_choices(
            [
                (self.text("choice.dm_merchant_shop"), self.dm_merchant_shop),
                (self.text("choice.dm_merchant_sneak"), self.dm_merchant_sneak),
                (self.text("choice.dm_merchant_combat"), self.dm_merchant_combat),
            ]
        )

    def dm_merchant_shop(self):
        roll = random.randint(1, 20)
        self.track_natural_roll(roll)
        result_key = "low" if roll <= 10 else "high"
        self.write_text("story.dm_merchant_shop", roll=roll, result=self.text(f"story.dm_merchant_shop_{result_key}"))
        if roll <= 10:
            self.set_choices([(self.text("choice.make_fight"), self.dm_merchant_combat)])
        else:
            self.set_choices([(self.text("choice.roll_loot"), self.dm_merchant_loot)])

    def dm_merchant_sneak(self):
        roll = random.randint(1, 20)
        self.track_natural_roll(roll)
        result_key = "low" if roll <= 16 else "high"
        self.write_text("story.dm_merchant_sneak", roll=roll, result=self.text(f"story.dm_merchant_sneak_{result_key}"))
        if roll <= 16:
            self.set_choices([(self.text("choice.make_fight"), self.dm_merchant_combat)])
        else:
            self.set_choices([(self.text("choice.move_houses"), self.dm_residential)])

    def dm_merchant_combat(self):
        self.write_text("story.dm_merchant_combat")
        self.set_choices([(self.text("choice.loot_bodies"), self.dm_merchant_map)])

    def dm_merchant_loot(self):
        roll = random.randint(1, 20)
        self.track_natural_roll(roll)
        if roll <= 7:
            result_key = "low"
        elif roll <= 14:
            result_key = "mid"
        else:
            result_key = "high"
        self.write_text("story.dm_merchant_loot", roll=roll, result=self.text(f"story.dm_merchant_loot_{result_key}"))
        if roll > 14:
            self.set_choices([(self.text("choice.read_map"), self.dm_merchant_map)])
        else:
            self.set_choices([(self.text("choice.move_houses"), self.dm_residential)])

    def dm_merchant_map(self):
        self.write_text("story.dm_merchant_map")
        self.set_choices([(self.text("choice.move_houses"), self.dm_residential)])

    def dm_residential(self):
        self.write_text("story.dm_residential")
        self.set_choices(
            [
                (self.text("choice.dm_manor"), self.dm_manor),
                (self.text("choice.dm_shack"), self.dm_shack),
                (self.text("choice.dm_mimic_house"), self.dm_mimic_house),
                (self.text("choice.dm_bridge"), self.dm_bridge),
            ]
        )

    def dm_manor(self):
        self.write_text("story.dm_manor")
        self.set_choices(
            [
                (self.text("choice.dm_manor_orb"), self.dm_manor_orb),
                (self.text("choice.dm_manor_boom"), self.dm_manor_boom),
                (self.text("choice.dm_bridge"), self.dm_bridge),
            ]
        )

    def dm_manor_orb(self):
        self.write_text("story.dm_manor_orb")
        self.set_choices([(self.text("choice.move_bridge"), self.dm_bridge)])

    def dm_manor_boom(self):
        self.write_text("story.dm_manor_boom")
        self.set_choices([(self.text("choice.rewind"), self.dm_residential)])

    def dm_shack(self):
        self.write_text("story.dm_shack")
        self.set_choices([(self.text("choice.move_bridge"), self.dm_bridge)])

    def dm_mimic_house(self):
        self.write_text("story.dm_mimic_house")
        self.set_choices(
            [
                (self.text("choice.dm_mimic_burn"), self.dm_mimic_burn),
                (self.text("choice.dm_bridge"), self.dm_bridge),
                (self.text("choice.dm_mimic_loot"), self.dm_mimic_loot),
                (self.text("choice.dm_mimic_rest"), self.dm_mimic_rest),
            ]
        )

    def dm_mimic_burn(self):
        self.write_text("story.dm_mimic_burn")
        self.set_choices([(self.text("choice.move_bridge"), self.dm_bridge)])

    def dm_mimic_loot(self):
        self.write_text("story.dm_mimic_loot")
        self.set_choices([(self.text("choice.drag_out"), self.dm_bridge)])

    def dm_mimic_rest(self):
        self.write_text("story.dm_mimic_rest")
        self.set_choices([(self.text("choice.rewind"), self.dm_mimic_house)])

    def dm_bridge(self):
        self.write_text("story.dm_bridge")
        self.player["chapter"] = "complete"
        self.set_choices([(self.text("choice.chapter_complete"), self.complete)])

    def caravan(self, clear=False):
        self.write_text("story.caravan", clear=clear)
        self.show_monsters(["Goblin", "Orc"])
        self.set_choices(
            [
                (self.text("choice.fight"), lambda: self.caravan_choice("fight")),
                (self.text("choice.run"), lambda: self.caravan_choice("run")),
                (self.text("choice.save"), self.save_game),
                (self.text("choice.main_menu"), self.show_start_screen),
            ]
        )

    def caravan_choice(self, choice):
        if choice == "fight":
            self.write_text("story.caravan_fight")
            self.start_combat(
                ["orc", "goblin", "goblin"],
                "story.caravan_combat_victory",
                attackers_per_round=2,
                victory_callback=self.caravan_combat_done,
                run_callback=self.caravan_combat_run,
                award_map=False,
            )
            return
        else:
            self.write_text("story.caravan_run")
            self.player["supplies"] += 1

        if self.check_death():
            return
        if self.award_decision_experience("caravan_run", self.caravan_escape_done):
            return
        self.caravan_escape_done()

    def caravan_escape_done(self):
        self.write_text("story.caravan_overrun")
        self.player["chapter"] = "escape"
        self.continue_chapter()

    def caravan_combat_done(self):
        self.unlock_achievement("first_fight")
        self.add_item("notched axe")
        self.write_text("story.caravan_overrun")
        self.player["chapter"] = "escape"
        self.continue_chapter()

    def caravan_combat_run(self):
        self.write_text("story.caravan_run")
        self.player["supplies"] += 1
        self.write_text("story.caravan_overrun")
        self.player["chapter"] = "escape"
        self.continue_chapter()

    def escape(self, clear=False):
        self.write_text("story.escape", clear=clear)
        self.set_choices(
            [
                (self.text("choice.forest"), lambda: self.escape_choice("forest")),
                (self.text("choice.cave"), lambda: self.escape_choice("cave")),
                (self.text("choice.save"), self.save_game),
                (self.text("choice.main_menu"), self.show_start_screen),
            ]
        )

    def escape_choice(self, choice):
        if choice == "forest":
            self.player["flags"]["forest_attempts"] += 1
            self.record_stat("forest_attempts")
            self.write_text("story.escape_forest")
            if self.player["flags"]["forest_attempts"] > 5:
                self.unlock_achievement("forest_mind_break")
                self.set_game_over_reason("forest_mind_break")
                self.player["health"] = 0
                self.check_death()
                return
            if self.player["flags"]["forest_attempts"] >= 2:
                self.write_text("story.escape_forest_repeat")
            if self.award_decision_experience("forest_attempt", self.escape):
                return
            self.escape()
            return

        self.write_text("story.escape_cave")
        if self.award_decision_experience("choose_cave", self.enter_cave):
            return
        self.enter_cave()

    def enter_cave(self):
        self.player["chapter"] = "cave"
        self.continue_chapter()

    def cave(self, clear=False):
        self.write_text("story.cave", clear=clear)
        self.show_monsters(["Goblin"])
        self.set_choices(
            [
                (self.text("choice.fight"), lambda: self.cave_choice("fight")),
                (self.text("choice.go_deeper"), lambda: self.cave_choice("deeper")),
            ]
        )

    def cave_choice(self, choice):
        if choice == "fight":
            self.write_text("story.cave_fight_start")
            self.start_combat(
                ["goblin", "goblin"],
                "story.cave_fight_success",
                attackers_per_round=2,
                victory_callback=self.cave_combat_done,
                run_callback=self.cave_combat_run,
                award_map=False,
            )
            return
        else:
            self.write_text("story.cave_deeper")

        if self.check_death():
            return
        if self.award_decision_experience("go_deeper", self.enter_ghost):
            return
        self.enter_ghost()

    def enter_ghost(self):
        self.player["chapter"] = "ghost"
        self.continue_chapter()

    def cave_combat_done(self):
        self.player["gold"] += 4
        self.player["chapter"] = "ghost"
        self.continue_chapter()

    def cave_combat_run(self):
        self.write_text("story.cave_deeper")
        self.player["chapter"] = "ghost"
        self.continue_chapter()

    def ghost_girl(self, clear=False):
        self.write_text("story.ghost_girl", clear=clear)
        self.show_monsters(["Ghost"])
        self.set_choices(
            [
                (self.text("choice.persuade"), lambda: self.ghost_choice("persuade")),
                (self.text("choice.fight"), lambda: self.ghost_choice("fight")),
                (self.text("choice.sneak_past"), lambda: self.ghost_choice("sneak")),
            ]
        )

    def ghost_choice(self, choice):
        if choice == "persuade":
            next_step = self.persuade_girl()
        elif choice == "fight":
            next_step = self.fight_girl()
        else:
            next_step = self.sneak_past_girl()

        if self.check_death():
            return
        if self.award_decision_experience("ghost_choice", lambda: self.finish_ghost_choice(next_step)):
            return
        self.finish_ghost_choice(next_step)

    def finish_ghost_choice(self, next_step):
        if next_step == "districts":
            self.player["chapter"] = "districts"
            self.continue_chapter()
        elif next_step == "doll" and not self.player["flags"]["has_doll"]:
            self.doll_choice()
        else:
            self.player["chapter"] = "districts"
            self.continue_chapter()

    def persuade_girl(self):
        result = self.roll_d20("persuasion")

        if result <= 7:
            self.write_text("story.persuade_low")
            return "doll"
        elif result <= 15:
            self.write_text("story.persuade_mid")
            self.player["flags"]["girl_helped"] = True
            self.player["flags"]["girl_hint"] = "merchant_glowy_ball"
            return "doll"

        self.write_text("story.persuade_high")
        self.player["flags"]["girl_helped"] = True
        self.player["flags"]["monsters_scattered"] = True
        self.unlock_achievement("ghost_ally")
        return "districts"

    def ghost_black_pits_death(self):
        self.write_text("story.ghost_black_pits_death")
        self.set_game_over_reason("ghost_black_pits")
        self.player["health"] = 0
        self.player["flags"]["girl_angry"] = True
        return "death"

    def ghost_black_miasma(self):
        self.write_text("story.ghost_black_miasma")
        self.player["flags"]["girl_helped"] = True
        return "doll"

    def ghost_play_death(self):
        self.write_text("story.ghost_play")
        return self.ghost_black_pits_death()

    def fight_girl(self):
        character_class = self.player["class"]
        if character_class == "warrior":
            self.write_text("story.fight_girl_warrior")
            return self.ghost_play_death()
        elif character_class == "scholar":
            self.write_text("story.fight_girl_scholar")
            self.player["health"] -= 3
            self.unlock_achievement("ghost_slayer")
            return self.ghost_black_miasma()
        elif character_class == "ranger":
            self.write_text("story.fight_girl_ranger")
            return self.ghost_play_death()

        elif character_class == "dwarf":
            self.write_text("story.fight_girl_dwarf")
            self.unlock_achievement("ghost_kiss")
            return self.ghost_black_pits_death()

        return self.ghost_black_miasma()

    def sneak_past_girl(self):
        self.write_text("story.sneak_past_girl_start")
        self.write_text("story.sneak_past_girl_result")
        return self.ghost_black_miasma()

    def doll_choice(self):
        self.write_text("story.doll_choice")
        self.set_choices(
            [
                (self.text("choice.grab_doll"), lambda: self.doll_result("grab")),
                (self.text("choice.leave_doll"), lambda: self.doll_result("leave")),
            ]
        )

    def doll_result(self, choice):
        if choice == "grab":
            self.write_text("story.doll_grab")
            self.add_item("cracked doll")
            self.player["flags"]["has_doll"] = True
        else:
            self.write_text("story.doll_leave")
            self.add_item("cracked doll")
            self.player["flags"]["has_doll"] = True
        if self.award_decision_experience("doll_choice", self.enter_districts):
            return
        self.enter_districts()

    def enter_districts(self):
        self.player["chapter"] = "districts"
        self.continue_chapter()

    def loot(self, table):
        item = random.choice(table)
        if item == "gold":
            amount = random.randint(5, 15)
            self.player["gold"] += amount
            self.write_text("story.loot_gold", amount=amount)
        elif item == "supplies":
            amount = random.randint(1, 3)
            self.player["supplies"] += amount
            self.write_text("story.loot_supplies", amount=amount)
        else:
            self.add_item(item)
            self.write_text("story.loot_item", item=item)

    def search_area_loot(self, area):
        roll = self.roll_d20("lore")
        if roll <= 7:
            if area == "city":
                self.write_text("story.search_city_low")
                self.player["gold"] += 3
                self.player["flags"]["has_dwarven_ale"] = True
                self.add_item("dwarven ale")
            else:
                self.write_text("story.search_empty")
        elif roll <= 14:
            self.write_text("story.search_potion")
            self.add_item("health potion")
        else:
            self.award_throne_map()
        self.update_status()
        if self.award_decision_experience("search", self.route_choice_done):
            return
        self.route_choice_done()

    def award_throne_map(self):
        directions = ", ".join(direction.upper() for direction in THRONE_MAP_DIRECTIONS)
        self.write_text("story.throne_map", directions=directions)
        self.add_item("throne room map")
        self.player["flags"]["has_throne_map"] = True

    def monster_attack_stats(self, monster_name):
        return MONSTER_ATTACKS.get(
            monster_name.lower(),
            {"attack_bonus": 3, "damage_die": 6, "damage_bonus": 1},
        )

    def make_enemy(self, monster_name, number):
        monster = self.monsters.get(monster_name.lower(), {})
        return {
            "name": f"{monster.get('name', monster_name)} {number}",
            "base_name": monster_name.lower(),
            "ac": int(monster.get("ac", 10)),
            "hp": int(monster.get("hp", 6)),
        }

    def start_combat(
        self,
        enemies,
        victory_text,
        attackers_per_round=1,
        victory_callback=None,
        run_callback=None,
        award_map=True,
        death_reason="combat",
        xp_reward=None,
    ):
        if xp_reward is None:
            xp_reward = sum(MONSTER_XP.get(enemy.lower(), 15) for enemy in enemies)
        self.combat = {
            "enemies": [
                self.make_enemy(monster_name, index + 1)
                for index, monster_name in enumerate(enemies)
            ],
            "victory_text": victory_text,
            "guarding": False,
            "attackers_per_round": attackers_per_round,
            "victory_callback": victory_callback,
            "run_callback": run_callback,
            "award_map": award_map,
            "death_reason": death_reason,
            "xp_reward": xp_reward,
        }
        self.write_text("ui.initiate_combat")
        self.show_monsters(sorted(set(enemies)))
        self.show_combat_choices()

    def living_enemies(self):
        if not self.combat:
            return []
        return [enemy for enemy in self.combat["enemies"] if enemy["hp"] > 0]

    def combat_summary(self):
        enemies = self.living_enemies()
        if not enemies:
            return self.text("ui.no_enemies")
        return self.text("ui.enemies") + " " + ", ".join(
            f"{enemy['name']} HP {enemy['hp']}/AC {enemy['ac']}" for enemy in enemies
        )

    def show_combat_choices(self):
        self.update_status()
        self.write(self.combat_summary())
        choices = [
            (self.text("choice.attack"), lambda: self.combat_action("attack")),
            (self.text("choice.heavy_attack"), lambda: self.combat_action("heavy")),
            (self.text("choice.dodge"), lambda: self.combat_action("dodge")),
            (self.text("choice.run"), lambda: self.combat_action("run")),
        ]
        if "health potion" in self.player["gear"]:
            choices.append((self.text("choice.health_potion"), lambda: self.combat_action("potion")))
        self.set_choices(choices)

    def player_combat_stats(self):
        stats = dict(PLAYER_COMBAT_STATS[self.player["class"]])
        upgrades = self.player.get("upgrades", {})
        stats["ac"] += upgrades.get("ac", 0)
        stats["damage_bonus"] += upgrades.get("damage", 0)
        return stats

    def next_xp_threshold(self, level):
        return BASE_XP_TO_NEXT + max(0, level - BASE_LEVEL) * XP_PER_LEVEL

    def award_experience(self, amount, reason_key, after_level_callback=None):
        if not self.player or self.player["class"] == "dm" or amount <= 0:
            return False

        self.player["experience"] = self.player.get("experience", 0) + amount
        self.write_text("story.xp_gain", amount=amount, reason=self.text(reason_key))
        self.update_status()

        if self.player["experience"] >= self.player.get("xp_to_next", BASE_XP_TO_NEXT):
            self.pending_level_callback = after_level_callback
            self.show_level_up_choices()
            return True
        return False

    def award_decision_experience(self, decision_key, after_level_callback=None):
        return self.award_experience(
            MAJOR_DECISION_XP.get(decision_key, 10),
            f"xp.reason.{decision_key}",
            after_level_callback,
        )

    def show_level_up_choices(self):
        self.write_text("story.level_up", level=self.player.get("level", BASE_LEVEL) + 1)
        self.set_choices(
            [
                (self.text("choice.level_hp"), lambda: self.apply_level_choice("hp")),
                (self.text("choice.level_ac"), lambda: self.apply_level_choice("ac")),
                (self.text("choice.level_damage"), lambda: self.apply_level_choice("damage")),
                (self.text("choice.level_heal"), lambda: self.apply_level_choice("heal")),
            ]
        )

    def apply_level_choice(self, choice):
        current_threshold = self.player.get("xp_to_next", BASE_XP_TO_NEXT)
        self.player["experience"] = max(0, self.player.get("experience", 0) - current_threshold)
        self.player["level"] = self.player.get("level", BASE_LEVEL) + 1
        self.player["xp_to_next"] = self.next_xp_threshold(self.player["level"])
        self.player["max_health"] += 2
        self.player["health"] += 2

        if choice == "hp":
            self.player["max_health"] += 8
            self.player["health"] += 8
            self.write_text("story.level_hp")
        elif choice == "ac":
            self.player.setdefault("upgrades", {}).setdefault("ac", 0)
            self.player["upgrades"]["ac"] += 1
            self.write_text("story.level_ac")
        elif choice == "damage":
            self.player.setdefault("upgrades", {}).setdefault("damage", 0)
            self.player["upgrades"]["damage"] += 1
            self.write_text("story.level_damage")
        else:
            self.player["health"] = self.player["max_health"]
            self.write_text("story.level_heal")

        self.update_status()
        callback = self.pending_level_callback
        self.pending_level_callback = None

        if self.player["experience"] >= self.player["xp_to_next"]:
            self.pending_level_callback = callback
            self.show_level_up_choices()
            return

        if callback:
            callback()

    def combat_action(self, action):
        if action == "potion":
            self.remove_item("health potion")
            healing = random.randint(1, 4) + random.randint(1, 4) + 6
            old_health = self.player["health"]
            self.player["health"] = min(self.player["max_health"], self.player["health"] + healing)
            actual_healing = self.player["health"] - old_health
            self.write_text("story.combat_potion", healing=actual_healing)
            self.enemy_combat_turn()
            return

        if action == "run":
            roll = self.roll_d20("sneak")
            if roll >= 12:
                self.write_text("story.combat_run_success")
                run_callback = self.combat.get("run_callback")
                self.combat = None
                if run_callback:
                    run_callback()
                else:
                    self.route_choice_done()
                return
            self.write_text("story.combat_run_fail")
            self.enemy_combat_turn()
            return

        stats = self.player_combat_stats()
        attack_bonus = stats["attack_bonus"]
        damage_die = stats["damage_die"]
        damage_bonus = stats["damage_bonus"]
        attacks = stats.get("attacks", 1)
        self.combat["guarding"] = action == "dodge"

        if action == "dodge":
            self.write_text("story.combat_dodge")
            self.enemy_combat_turn()
            return

        if action == "heavy":
            attack_bonus -= 2
            damage_die += 4

        for attack_number in range(1, attacks + 1):
            living = self.living_enemies()
            if not living:
                break

            enemy = living[0]
            attack_roll = random.randint(1, 20)
            self.track_natural_roll(attack_roll)
            total = attack_roll + attack_bonus
            self.write_text(
                "story.combat_attack_roll",
                attack_number=attack_number,
                natural=attack_roll,
                bonus=attack_bonus,
                total=total,
                enemy=enemy["name"],
                ac=enemy["ac"],
            )

            if attack_roll == 1:
                self.write_text("story.combat_miss")
            elif attack_roll == 20 or total >= enemy["ac"]:
                damage = random.randint(1, damage_die) + damage_bonus
                if attack_roll == 20:
                    damage += random.randint(1, damage_die)
                enemy["hp"] -= damage
                self.write_text("story.combat_hit", enemy=enemy["name"], damage=damage)
                if enemy["hp"] <= 0:
                    self.write_text("story.combat_enemy_drops", enemy=enemy["name"])
            else:
                self.write_text("story.combat_miss")

        if not self.living_enemies():
            self.win_combat()
            return
        self.enemy_combat_turn()

    def enemy_combat_turn(self):
        if not self.combat:
            return

        player_ac = self.player_combat_stats()["ac"]
        if self.combat["guarding"]:
            player_ac += 5

        attackers = self.living_enemies()[: self.combat.get("attackers_per_round", 1)]
        for enemy in attackers:
            attack = self.monster_attack_stats(enemy["base_name"])
            roll = random.randint(1, 20)
            total = roll + attack["attack_bonus"]
            if roll == 1:
                self.write_text("story.enemy_miss", enemy=enemy["name"], natural=roll, total=total, ac=player_ac)
            elif roll == 20 or total >= player_ac:
                damage = random.randint(1, attack["damage_die"]) + attack["damage_bonus"]
                if roll == 20:
                    damage += random.randint(1, attack["damage_die"])
                self.player["health"] -= damage
                self.write_text("story.enemy_hit", enemy=enemy["name"], natural=roll, total=total, ac=player_ac, damage=damage)
            else:
                self.write_text("story.enemy_miss", enemy=enemy["name"], natural=roll, total=total, ac=player_ac)

        self.combat["guarding"] = False
        if self.player["health"] <= 0:
            self.set_game_over_reason(self.combat.get("death_reason", "combat"))
        if self.check_death():
            self.combat = None
            return
        self.show_combat_choices()

    def win_combat(self):
        victory_text = self.combat["victory_text"]
        victory_callback = self.combat.get("victory_callback")
        award_map = self.combat.get("award_map", True)
        xp_reward = self.combat.get("xp_reward", 0)
        self.combat = None
        self.write_text(victory_text)
        after_xp = victory_callback or (lambda: self.combat_default_victory_done(award_map=award_map))
        if self.award_experience(xp_reward, "xp.reason.combat", after_xp):
            return
        if victory_callback:
            victory_callback()
            return
        self.combat_default_victory_done(award_map=award_map)

    def combat_default_victory_done(self, award_map=True):
        if award_map:
            self.write_text("story.combat_loot_map")
            self.award_throne_map()
        self.update_status()
        self.route_choice_done()

    def districts(self, clear=False):
        self.write_text("story.districts", clear=clear)
        self.set_choices(
            [
                (self.text("choice.barracks"), self.barracks),
                (self.text("choice.merchant_district"), self.city_district),
                (self.text("choice.rest"), self.rest_at_districts),
                (self.text("choice.save"), self.save_game),
                (self.text("choice.main_menu"), self.show_start_screen),
            ]
        )

    def rest_at_districts(self):
        self.player["health"] = self.player["max_health"]
        self.write_text("story.districts_rest")
        self.update_status()
        self.districts()

    def city_district(self, award=True):
        if award and self.award_decision_experience("district_choice", lambda: self.city_district(award=False)):
            return
        self.write_text("story.city_enter")
        if self.player["flags"]["girl_hint"] in ("barracks_city", "merchant_glowy_ball"):
            self.write_text("story.city_girl_hint")
        self.write_text("story.city_description")
        self.show_monsters(["Orc", "Goblin"])
        self.set_choices(
            [
                (self.text("choice.sneak_shop"), lambda: self.city_result("shop")),
                (self.text("choice.assault_monsters"), lambda: self.city_result("assault")),
                (self.text("choice.sneak_past_monsters"), lambda: self.city_result("sneak")),
            ]
        )

    def city_result(self, choice):
        if choice == "shop":
            self.write_text("story.city_shop")
            roll = self.roll_d20("sneak")
            if roll <= 10:
                self.write_text("story.city_shop_fail")
                self.city_combat()
            else:
                self.write_text("story.city_shop_success")
                self.search_area_loot("city")
        elif choice == "assault":
            self.write_text("story.city_assault")
            self.city_combat()
        else:
            self.write_text("story.city_sneak")
            roll = self.roll_d20("sneak")
            if roll <= 16:
                self.write_text("story.city_sneak_fail")
                self.city_combat()
            else:
                self.write_text("story.city_sneak_success")
                self.route_choice_done()

    def city_combat(self):
        self.start_combat(
            ["goblin", "goblin", "goblin", "goblin", "goblin", "orc", "orc"],
            "story.city_combat_victory",
            attackers_per_round=1,
        )

    def barracks(self, award=True):
        if award and self.award_decision_experience("district_choice", lambda: self.barracks(award=False)):
            return
        self.write_text("story.barracks_enter")
        if self.player["flags"]["girl_hint"] == "barracks_city":
            self.write_text("story.barracks_girl_hint")
        self.write_text("story.barracks_description")
        self.show_monsters(["Orc"])
        self.set_choices(
            [
                (self.text("choice.sneak_armory"), lambda: self.barracks_result("armory")),
                (self.text("choice.center_ring"), lambda: self.barracks_result("fight")),
                (self.text("choice.sneak_quarters"), lambda: self.barracks_result("quarters")),
            ]
        )

    def barracks_result(self, choice):
        if choice == "armory":
            self.write_text("story.barracks_armory")
            roll = self.roll_d20("sneak")
            if roll <= 10:
                self.write_text("story.barracks_armory_fail")
                self.barracks_combat()
            else:
                self.write_text("story.barracks_armory_success")
                self.search_area_loot("barracks")
        elif choice == "fight":
            self.write_text("story.barracks_fight")
            self.barracks_combat()
        else:
            self.write_text("story.barracks_quarters")
            roll = self.roll_d20("sneak")
            if roll <= 10:
                self.write_text("story.barracks_quarters_fail")
                self.barracks_combat()
            else:
                self.write_text("story.barracks_quarters_success")
                self.search_area_loot("barracks")

    def barracks_combat(self):
        self.start_combat(
            ["orc", "orc", "orc"],
            "story.barracks_combat_victory",
            attackers_per_round=1,
        )

    def route_choice_done(self):
        if self.check_death():
            return
        self.player["chapter"] = "residential"
        self.continue_chapter()

    def residential_area(self, clear=False):
        self.write_text("story.residential_enter", clear=clear)
        self.write_text("story.residential")
        self.set_choices(
            [
                (self.text("choice.large_manor"), self.large_manor),
                (self.text("choice.small_shack"), self.small_shack),
                (self.text("choice.large_house"), self.mimic_house),
                (self.text("choice.proceed_bridge"), self.go_to_bridge),
            ]
        )

    def go_to_bridge(self, award=True):
        if award and self.award_decision_experience("bridge", lambda: self.go_to_bridge(award=False)):
            return
        self.player["chapter"] = "bridge"
        self.continue_chapter()

    def large_manor(self, award=True):
        if award and self.award_decision_experience("residential_choice", lambda: self.large_manor(award=False)):
            return
        self.write_text("story.large_manor")
        roll = self.roll_d20("sneak")
        if roll <= 14:
            self.write_text("story.large_manor_seen")
            self.manor_combat()
        elif roll <= 19:
            self.write_text("story.large_manor_unseen")
            self.set_choices(
                [
                    (self.text("choice.attack_them"), self.manor_combat),
                    (self.text("choice.sneak_past"), self.manor_sneak),
                    (self.text("choice.proceed_bridge"), self.go_to_bridge),
                ]
            )
        else:
            self.write_text("story.large_manor_grouped")
            self.set_choices([(self.text("choice.take_them_out"), self.manor_group_kill)])

    def manor_sneak(self):
        self.write_text("story.manor_sneak")
        self.set_choices(
            [
                (self.text("choice.attack_them"), self.manor_combat),
                (self.text("choice.loot_manor"), self.manor_loot),
                (self.text("choice.proceed_bridge"), self.go_to_bridge),
            ]
        )

    def manor_group_kill(self):
        self.write_text(f"story.manor_group_kill_{self.player['class']}")
        self.unlock_achievement("group_kill")
        xp_reward = (MONSTER_XP["goblin"] * 5) + (MONSTER_XP["orc"] * 2)
        if self.award_experience(xp_reward, "xp.reason.combat", self.manor_win):
            return
        self.manor_win()

    def manor_combat(self):
        self.show_monsters(["Orc", "Goblin"])
        self.start_combat(
            ["goblin", "goblin", "goblin", "goblin", "goblin", "orc", "orc"],
            "story.manor_combat_victory",
            attackers_per_round=1,
            victory_callback=self.manor_win,
            award_map=False,
        )

    def manor_win(self):
        self.write_text("story.manor_win")
        self.set_choices([(self.text("choice.loot_manor"), self.manor_loot)])

    def manor_loot(self):
        self.write_text("story.manor_loot")
        self.set_choices(
            [
                (self.text("choice.use_keys_chest"), self.manor_chest_keys),
                (self.text("choice.leave_found"), self.go_to_bridge),
                (self.text("choice.store_keys_chest"), self.manor_store_chest),
            ]
        )

    def manor_store_chest(self):
        self.player["flags"]["has_manor_keys"] = True
        self.player["flags"]["has_black_chest"] = True
        self.add_item("unmarked keys")
        self.add_item("small black chest")
        self.write_text("story.manor_store_chest")
        self.set_choices([(self.text("choice.leave_house"), self.go_to_bridge)])

    def manor_chest_keys(self):
        self.write_text("story.manor_chest_keys")
        self.set_choices(
            [
                (self.text("choice.blue_key"), lambda: self.manor_chest_result("blue")),
                (self.text("choice.yellow_key"), lambda: self.manor_chest_result("yellow")),
                (self.text("choice.red_key"), lambda: self.manor_chest_result("red")),
                (self.text("choice.black_key"), lambda: self.manor_chest_result("black")),
                (self.text("choice.iron_key"), lambda: self.manor_chest_result("iron")),
                (self.text("choice.gold_key"), lambda: self.manor_chest_result("gold")),
                (self.text("choice.silver_key"), lambda: self.manor_chest_result("silver")),
                (self.text("choice.green_key"), lambda: self.manor_chest_result("green")),
            ]
        )

    def manor_chest_result(self, key):
        if key != "red":
            self.write_text("story.manor_chest_trap")
            self.set_game_over_reason("manor_chest")
            self.player["health"] = 0
            self.check_death()
            return

        self.write_text("story.manor_chest_unlock")
        self.unlock_achievement("correct_chest_key")
        self.set_choices([(self.text("choice.open_chest"), self.manor_magistone_orb)])

    def manor_magistone_orb(self):
        self.player["flags"]["has_magistone_orb"] = True
        self.add_item("magistone orb")
        self.write_text("story.manor_magistone_orb")
        self.set_choices([(self.text("choice.leave_house"), self.go_to_bridge)])

    def small_shack(self, award=True):
        if award and self.award_decision_experience("residential_choice", lambda: self.small_shack(award=False)):
            return
        self.write_text("story.small_shack")
        self.show_monsters(["Gremlin", "Ghoul"])
        self.start_combat(
            ["gremlin", "ghoul"],
            "story.small_shack_win",
            attackers_per_round=2,
            victory_callback=self.small_shack_win,
            award_map=False,
        )

    def small_shack_win(self):
        self.set_choices(
            [
                (self.text("choice.return_street"), lambda: self.residential_area(clear=True)),
                (self.text("choice.proceed_bridge"), self.go_to_bridge),
            ]
        )

    def mimic_house(self, award=True):
        if award and self.award_decision_experience("residential_choice", lambda: self.mimic_house(award=False)):
            return
        self.write_text("story.mimic_house")
        self.set_choices(
            [
                (self.text("choice.burn_house"), self.mimic_house_burn),
                (self.text("choice.leave_immediately"), self.mimic_house_leave),
                (self.text("choice.loot_chests"), self.mimic_house_loot),
                (self.text("choice.rest_here"), self.mimic_house_rest),
            ]
        )

    def mimic_house_burn(self):
        self.write_text("story.mimic_house_burn")
        self.unlock_achievement("pyromaniac")
        self.set_choices([(self.text("choice.leave_house"), self.go_to_bridge)])

    def mimic_house_leave(self):
        self.write_text("story.mimic_house_leave")
        self.go_to_bridge()

    def mimic_house_loot(self):
        self.show_monsters(["Mimic"])
        self.write_text("story.mimic_house_loot")
        self.write_text("story.mimic_house_loot_clear")
        self.mimic_house_fight_one()

    def mimic_house_rest(self):
        self.write_text("story.mimic_house_rest")
        self.unlock_achievement("mimic_nap")
        self.mimic_game_over()

    def mimic_house_fight_one(self):
        self.show_monsters(["Mimic"])
        self.start_combat(
            ["mimic"],
            "story.mimic_house_fight_one_win",
            attackers_per_round=1,
            victory_callback=self.mimic_house_second_wave,
            award_map=False,
            death_reason="mimic",
        )

    def mimic_house_second_wave(self):
        self.write_text("story.mimic_house_second_wave")
        self.set_choices(
            [
                (self.text("choice.fight"), self.mimic_house_fight_two),
                (self.text("choice.flee"), self.mimic_house_flee),
            ]
        )

    def mimic_house_fight_two(self):
        self.show_monsters(["Mimic"])
        self.start_combat(
            ["mimic", "mimic"],
            "story.mimic_house_fight_two_win",
            attackers_per_round=2,
            victory_callback=self.mimic_house_escape,
            award_map=False,
            death_reason="mimic",
        )

    def mimic_house_escape(self):
        if not self.player["flags"]["has_partial_map"]:
            self.player["flags"]["has_partial_map"] = True
            self.add_item("torn bridge map")
        self.player["flags"]["has_magistone_orb"] = True
        self.add_item("magistone orb")
        self.write_text("story.mimic_house_escape")
        self.set_choices([(self.text("choice.proceed_bridge"), self.go_to_bridge)])

    def mimic_house_flee(self):
        self.write_text("story.mimic_house_flee")
        choices = [
            (self.text("choice.black_hole"), self.mimic_house_black_hole),
            (self.text("choice.cast_fire"), self.mimic_house_fire),
            (self.text("choice.attack_walls"), self.mimic_house_walls),
        ]
        if self.player["flags"].get("has_dwarven_ale") or "dwarven ale" in self.player["gear"]:
            choices.append((self.text("choice.pour_ale"), self.mimic_house_ale))
        self.set_choices(choices)

    def mimic_house_black_hole(self):
        self.write_text("story.mimic_house_black_hole")
        self.mimic_game_over()

    def mimic_house_fire(self):
        self.write_text("story.mimic_house_fire")
        self.set_choices([(self.text("choice.proceed_bridge"), self.go_to_bridge)])

    def mimic_house_walls(self):
        self.write_text("story.mimic_house_walls")
        self.mimic_game_over()

    def mimic_house_ale(self):
        self.remove_item("dwarven ale")
        self.write_text("story.mimic_house_ale")
        self.set_choices([(self.text("choice.proceed_bridge"), self.go_to_bridge)])

    def mimic_game_over(self):
        self.set_game_over_reason("mimic")
        self.player["health"] = 0
        self.check_death()

    def bridge_prompt(self, clear=False):
        text = self.text("story.bridge")
        if self.player["flags"].get("has_throne_map"):
            text += self.text("story.bridge_has_map")
        elif self.player["flags"].get("has_partial_map"):
            text += self.text("story.bridge_partial_map")
        else:
            text += self.text("story.bridge_no_map")
        text += self.text("story.bridge_temp_end")
        self.write(text, clear=clear)

        if not self.player["flags"].get("completed_recorded"):
            self.record_stat("reached_end")
            self.player["flags"]["completed_recorded"] = True
        self.save_game()

        self.set_choices(
            [
                (self.text("choice.main_menu"), self.show_start_screen),
                (self.text("choice.quit"), self.root.destroy),
            ]
        )

    def cross_bridge(self, choice):
        if choice == "prepare":
            if self.player["supplies"] > 0:
                self.player["supplies"] -= 1
                self.player["health"] += 2
                self.write_text("story.bridge_prepare_success")
            else:
                self.write_text("story.bridge_prepare_fail")
            self.update_status()
            self.bridge_prompt()
            return

        self.write_text("story.warehouse_enter")
        if self.player["flags"]["girl_helped"]:
            self.write_text("story.warehouse_girl_helped")
        elif self.player["flags"].get("has_magistone_orb"):
            self.write_text("story.warehouse_magistone_orb")
        else:
            self.write_text("story.warehouse_no_help")

        if self.roll("combat", 15) or self.player["flags"]["girl_helped"] or self.player["flags"].get("has_magistone_orb"):
            self.write_text("story.warehouse_success")
            self.player["flags"]["bridge_crossed"] = True
            self.player["chapter"] = "production"
            self.continue_chapter()
        else:
            self.write_text("story.warehouse_fail")
            self.set_game_over_reason("warehouse")
            self.player["health"] = 0
            self.check_death()

    def start_bridge_navigation(self):
        self.bridge_path = []
        self.write_text("story.bridge_navigation_start")
        self.bridge_navigation_step()

    def bridge_navigation_step(self):
        step_names = ["first", "second", "third", "fourth"]
        step = step_names[len(self.bridge_path)]
        self.write_text("story.bridge_navigation_step", step=step)
        self.set_choices(
            [
                (self.text("choice.left"), lambda: self.bridge_navigation_choice("left")),
                (self.text("choice.right"), lambda: self.bridge_navigation_choice("right")),
                (self.text("choice.up"), lambda: self.bridge_navigation_choice("up")),
                (self.text("choice.down"), lambda: self.bridge_navigation_choice("down")),
            ]
        )

    def bridge_navigation_choice(self, choice):
        expected = THRONE_MAP_DIRECTIONS[len(self.bridge_path)]
        self.bridge_path.append(choice)

        if choice != expected:
            self.write_text("story.bridge_wrong")
            self.set_game_over_reason("bridge_trap")
            self.player["health"] = 0
            self.check_death()
            return

        if len(self.bridge_path) < len(THRONE_MAP_DIRECTIONS):
            self.write_text("story.bridge_quiet")
            self.bridge_navigation_step()
            return

        self.write_text("story.bridge_success")
        self.unlock_achievement("trap_dodger")
        self.cross_bridge("cross")

    def production_area(self, clear=False):
        self.production_path = []
        self.write_text("story.production", clear=clear)
        self.production_step()

    def production_step(self):
        step_names = ["first", "second", "third"]
        step = step_names[len(self.production_path)]
        self.write_text("story.production_step", step=step)
        self.set_choices(
            [
                (self.text("choice.left"), lambda: self.production_choice("left")),
                (self.text("choice.center"), lambda: self.production_choice("center")),
                (self.text("choice.right"), lambda: self.production_choice("right")),
            ]
        )

    def production_choice(self, choice):
        self.production_path.append(choice)
        if len(self.production_path) < 3:
            self.production_step()
            return

        if self.production_path == ["left", "right", "center"]:
            self.write_text("story.production_success")
            self.player["chapter"] = "complete"
            self.continue_chapter()
        else:
            self.write_text("story.production_fail")
            self.set_game_over_reason("production")
            self.player["health"] = 0
            self.check_death()

    def complete(self, clear=False):
        self.write_text("story.complete", clear=clear)
        if not self.player["flags"].get("completed_recorded"):
            self.record_stat("reached_end")
            self.player["flags"]["completed_recorded"] = True
        self.save_game()
        self.set_choices(
            [
                (self.text("choice.main_menu"), self.show_start_screen),
                (self.text("choice.quit"), self.root.destroy),
            ]
        )

    def game_over(self):
        reason = "default"
        if self.player:
            reason = self.player.get("game_over_reason", "default")
            if not self.player["flags"].get("death_recorded"):
                self.record_stat("died")
                self.player["flags"]["death_recorded"] = True
        message = self.text(f"game_over.{reason}")
        if message == f"game_over.{reason}":
            message = self.text("game_over.default")
        self.write(
            f"{self.text('story.game_over_header')}\n"
            f"{message}\n\n"
            f"{self.text('story.game_over_footer')}"
        )
        self.show_story_image(GAME_OVER_IMAGE)
        self.set_choices(
            [
                (self.text("choice.new_game"), self.show_character_select),
                (self.text("choice.load_game"), self.load_game),
                (self.text("choice.main_menu"), self.show_start_screen),
                (self.text("choice.quit"), self.root.destroy),
            ]
        )


def main():
    root = tk.Tk()
    TalesOfVisteriaApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
