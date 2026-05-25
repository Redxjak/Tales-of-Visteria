import json
import random
import sys
import tkinter as tk
from pathlib import Path
from tkinter import messagebox


def resource_path(filename):
    if hasattr(sys, "_MEIPASS"):
        return Path(sys._MEIPASS) / filename
    return Path(filename)


SAVE_FILE = Path("savegame.json")
MONSTER_FILE = resource_path("monster_stats.json")
GAME_OVER_IMAGE = resource_path("game_over_party.png")

CLASSES = {
    "warrior": {
        "name": "Cletus",
        "title": "Barbarian",
        "health": 55,
        "gold": 6,
        "supplies": 2,
        "gear": ["greataxe", "travel cloak"],
        "bonus": "combat",
        "description": "Level 5 bruiser with high health and brutal melee attacks.",
    },
    "ranger": {
        "name": "Ren",
        "title": "Ranger",
        "health": 44,
        "gold": 8,
        "supplies": 3,
        "gear": ["longbow", "short blade"],
        "bonus": "sneak",
        "description": "Level 5 scout with strong accuracy and two attacks.",
    },
    "scholar": {
        "name": "Cal",
        "title": "Warlock",
        "health": 45,
        "gold": 10,
        "supplies": 2,
        "gear": ["old journal", "silver charm", "eldritch focus"],
        "bonus": "persuasion",
        "description": "Level 5 spellcaster with eldritch power and persuasion.",
    },
    "dwarf": {
        "name": "Kili",
        "title": "Fighter",
        "health": 49,
        "gold": 7,
        "supplies": 3,
        "gear": ["battleaxe", "stone token"],
        "bonus": "lore",
        "description": "Level 5 fighter with armor, stamina, and two attacks.",
    },
    "dm": {
        "name": "Jon",
        "title": "DM",
        "health": 69,
        "gold": 0,
        "supplies": 0,
        "gear": ["DM screen", "loaded d20"],
        "bonus": "fate",
        "description": "Control the opening from above.",
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
}

THRONE_MAP_DIRECTIONS = ["left", "up", "right", "down"]


class TalesOfVisteriaApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Tales of Visteria")
        self.root.geometry("900x650")
        self.root.minsize(720, 520)
        self.player = None
        self.pending_bridge = False
        self.combat = None
        self.game_over_image = None
        self.monsters = self.load_monsters()

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

        story_frame = tk.Frame(root, bg="#141414")
        story_frame.grid(row=2, column=0, sticky="nsew", padx=18, pady=14)
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
        self.story_text.configure(state="disabled")

        scrollbar = tk.Scrollbar(story_frame, command=self.story_text.yview)
        scrollbar.grid(row=0, column=1, sticky="ns")
        self.story_text.configure(yscrollcommand=scrollbar.set)

        self.choice_frame = tk.Frame(root, bg="#141414")
        self.choice_frame.grid(row=3, column=0, sticky="ew", padx=18, pady=(0, 18))

        self.show_start_screen()

    def load_monsters(self):
        if not MONSTER_FILE.exists():
            return {}
        try:
            return json.loads(MONSTER_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            return {}

    def write(self, text, clear=False):
        self.story_text.configure(state="normal")
        if clear:
            self.story_text.delete("1.0", "end")
        self.story_text.insert("end", text.strip() + "\n\n")
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
        return (
            f"{monster['name']} Stats: CR {monster['cr']} | AC {monster['ac']} | "
            f"HP {monster['hp']} | STR {monster['str']} | DEX {monster['dex']} | "
            f"CON {monster['con']}"
        )

    def show_monsters(self, names):
        lines = [self.monster_line(name) for name in names]
        lines = [line for line in lines if line]
        if lines:
            self.write("Monster Reference\n" + "\n".join(lines))

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
            self.status_var.set("Main Menu")
            return

        gear = ", ".join(self.player["gear"]) if self.player["gear"] else "none"
        title = self.player.get("title", CLASSES[self.player["class"]]["title"])
        self.status_var.set(
            f"{self.player['name']} the {title}   "
            f"Health: {self.player['health']}/{self.player['max_health']}   Gold: {self.player['gold']}   "
            f"Supplies: {self.player['supplies']}   Gear: {gear}"
        )

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
            },
        }
        self.update_status()
        self.continue_chapter(clear=True)

    def ensure_player_defaults(self, player):
        if player.get("class") in CLASSES:
            player["title"] = CLASSES[player["class"]]["title"]
            player.setdefault("max_health", CLASSES[player["class"]]["health"])
        flags = player.setdefault("flags", {})
        flags.setdefault("forest_attempts", 0)
        flags.setdefault("girl_helped", False)
        flags.setdefault("girl_angry", False)
        flags.setdefault("bridge_crossed", False)
        flags.setdefault("has_doll", False)
        flags.setdefault("girl_hint", "")
        flags.setdefault("monsters_scattered", False)
        flags.setdefault("has_throne_map", False)

    def save_game(self):
        if not self.player:
            return
        SAVE_FILE.write_text(json.dumps(self.player, indent=2), encoding="utf-8")
        self.write("Game saved.")

    def load_game(self):
        if not SAVE_FILE.exists():
            messagebox.showinfo("Load Game", "No saved game found.")
            return
        try:
            self.player = json.loads(SAVE_FILE.read_text(encoding="utf-8"))
        except json.JSONDecodeError:
            messagebox.showerror("Load Game", "The save file could not be read.")
            return

        self.ensure_player_defaults(self.player)
        self.update_status()
        self.write("Loaded saved game.", clear=True)
        self.continue_chapter()

    def add_item(self, item):
        if item not in self.player["gear"]:
            self.player["gear"].append(item)

    def remove_item(self, item):
        if item in self.player["gear"]:
            self.player["gear"].remove(item)

    def roll_d20(self, skill):
        bonus = 2 if self.player["bonus"] == skill else 0
        result = random.randint(1, 20) + bonus
        self.write(f"Roll: {result}")
        return result

    def roll(self, skill, difficulty):
        result = self.roll_d20(skill)
        self.write(f"Difficulty: {difficulty}")
        return result >= difficulty

    def check_death(self):
        self.update_status()
        if self.player and self.player["health"] <= 0:
            self.game_over()
            return True
        return False

    def show_start_screen(self):
        self.player = None
        self.update_status()
        self.write(
            "Welcome to Tales of Visteria.\n\n"
            "A story DM'd by Jubikino\n"
            "An adaption made by Redxjak\n\n"
            "Choose New Game to begin, or Load Game to continue a saved journey.",
            clear=True,
        )
        self.set_choices(
            [
                ("New Game", self.show_character_select),
                ("Load Game", self.load_game),
                ("Quit", self.root.destroy),
            ]
        )

    def show_character_select(self):
        lines = ["Choose your character."]
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
                ("Back", self.show_start_screen),
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
            self.write("Your save is at an unknown chapter.", clear=clear)
            self.set_choices([("Main Menu", self.show_start_screen)])

    def dm_intro(self, clear=False):
        self.write(
            "You look down from above at the puny mortals of Visteria.\n"
            "Their caravan crawls along the road, quiet and terribly untested.\n\n"
            "What trouble do you send?",
            clear=clear,
        )
        self.set_choices(
            [
                ("Orcs and Goblins. \n"
                     "Let's see how they fare",
                 lambda: self.dm_send_trouble("orcs")),
                ("Fuck dem kids. \n "
                    "Send the Hydra",
                 lambda: self.dm_send_trouble("hydra")),
                ("Save", self.save_game),
                ("Main Menu", self.show_start_screen),
            ]
        )

    def dm_send_trouble(self, choice):
        if choice == "hydra":
            self.show_monsters(["Hydra"])
            self.write(
                "You send the hydra.\n\n"
                "Haha! Did you see the way their eyeballs popped from their skulls? \n"
                "Then the smell of their burning flesh, ah that was great... \n\n"
                "I should make some popcorn."
            )
            self.player["health"] = 0
            self.check_death()
            return

        self.show_monsters(["Orc", "Goblin"])
        self.write(
            "Wow. They ran like little bitches\n"
            "Fine. I guess that means I get to keep playing with their lives.\n\n"
            "Do I let them go to the Forest of life, and power, or the cave of darkness and despair?"
        )
        self.set_choices(
            [
                ("Caves", lambda: self.dm_choose_route("caves")),
                ("Forest", lambda: self.dm_choose_route("forest")),
            ]
        )

    def dm_choose_route(self, choice):
        if choice == "forest":
            self.write(
                "Like it was even a question. Of course, I want them to despair.\n"
                "Let's stay in these caves for months!"
            )
        else:
            self.write("Caves was always the option. The caves are really the whole story.")
        self.player["chapter"] = "dm_ghost"
        self.continue_chapter()

    def dm_ghost(self, clear=False):
        self.write(
            "Alright what are these fuck tards, sorry uh 'heroes' going to do now?\n"
            "Who do I want to creepily watch?",
            clear=clear,
        )
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
        outcomes = {
            "cletus": {
                "low": (
                    "Cletus doesn't think and just rushes to the ghost girl and tries to "
                    "swing his axe and falls on his ass. Hahahaha I can't believe he did that"
                ),
                "high": (
                    'Cletus is actually good with kids and convinced her to go "play" '
                    "with the orcs coming in. Oh boy, I did not expect that"
                ),
            },
            "cal": {
                "low": (
                    "Cal tried to sneak past her and tripped on his robe. Not that it "
                    "mattered, she knew you were there dude. Guess You're gonna have to fight."
                ),
                "high": (
                    "Way to take the initiative Cal! That magic missile to the chest "
                    "is a quick way to take out a ghost."
                ),
            },
            "ren": {
                "low": (
                    "Ren, you moron. You have the best eye sight and can see it's a ghost, "
                    "yet you decided to throw a fucking stick at it? Dude you're so dead."
                ),
                "high": (
                    "Well you definitely talked to her like a dad, so I guess that works. "
                    "I'm not sure how helpful it was for her to tell you about some \"pointy sticks\""
                ),
            },
            "kili": {
                "low": (
                    "Oh dwarf guy, Kili I think. I kinda forgot about you. Let's see what "
                    "you d.... dude no fucking way. Did you really try to kiss the ghost. "
                    "That is not your goth baddie!"
                ),
                "high": (
                    "You are the only one who could have recognized that she was a 200 year "
                    "old princess, and promised to save her kingdom. Nice work dude."
                ),
            },
        }
        result_key = "low" if roll <= 10 else "high"
        self.write(f"Roll D20: {roll}\n\n{outcomes[choice][result_key]}")
        self.player["chapter"] = "complete"
        self.continue_chapter()

    def caravan(self, clear=False):
        self.write(
            "Your caravan crawls through the dusk road to Visteria.\n"
            "Then horns split the air. Goblins rush from the brush. Orcs break the line.\n"
            "You fight beside the wagons until the guards are scattered and the road is lost.\n\n"
            "Do you stand and fight, or run for the ravine?",
            clear=clear,
        )
        self.show_monsters(["Goblin", "Orc"])
        self.set_choices(
            [
                ("Fight", lambda: self.caravan_choice("fight")),
                ("Run", lambda: self.caravan_choice("run")),
                ("Save", self.save_game),
                ("Main Menu", self.show_start_screen),
            ]
        )

    def caravan_choice(self, choice):
        if choice == "fight":
            self.write("You cut down two attackers, but more pour in from the smoke.")
            self.player["health"] -= 3
            self.add_item("notched axe")
        else:
            self.write("You dive through the burning canvas and sprint toward the ravine.")
            self.player["supplies"] += 1

        if self.check_death():
            return
        self.write("The caravan is overrun. Escape is the only thing left.")
        self.player["chapter"] = "escape"
        self.continue_chapter()

    def escape(self, clear=False):
        self.write(
            "You are still being chased.\n"
            "Ahead stands a faded signpost, its words scraped away by time.\n\n"
            "One path leads into a forest with gray miasma. The other drops into a cave.",
            clear=clear,
        )
        self.set_choices(
            [
                ("Forest", lambda: self.escape_choice("forest")),
                ("Cave", lambda: self.escape_choice("cave")),
                ("Save", self.save_game),
                ("Main Menu", self.show_start_screen),
            ]
        )

    def escape_choice(self, choice):
        if choice == "forest":
            self.player["flags"]["forest_attempts"] += 1
            self.write(
                "The forest breathes a gray miasma.\n"
                "Your thoughts loosen. Branches bend into familiar shapes.\n"
                "After hours, you stagger back to the same blood-stained road, still being chased, as if no time passed."
            )
            if self.player["flags"]["forest_attempts"] >= 2:
                self.write("The forest will not let you pass. The cave waits like a mouth.")
            self.escape()
            return

        self.write("You slip into the cave as shouts rise behind you.")
        self.player["chapter"] = "cave"
        self.continue_chapter()

    def cave(self, clear=False):
        self.write(
            "The cave descends into an ancient buried city. Everything here is dead.\n"
            "Behind you, goblin voices echo closer.\n\n"
            "Do you fight them, or go deeper?",
            clear=clear,
        )
        self.show_monsters(["Goblin"])
        self.set_choices(
            [
                ("Fight", lambda: self.cave_choice("fight")),
                ("Go Deeper", lambda: self.cave_choice("deeper")),
            ]
        )

    def cave_choice(self, choice):
        if choice == "fight":
            if self.roll("combat", 13):
                self.write("You hold the narrow passage and drive them back.")
                self.player["gold"] += 4
            else:
                self.write("They overwhelm your guard before fleeing from something farther below.")
                self.player["health"] -= 4
        else:
            self.write("You hurry deeper until the voices fade.")

        if self.check_death():
            return
        self.player["chapter"] = "ghost"
        self.continue_chapter()

    def ghost_girl(self, clear=False):
        self.write(
            "Little girl with white face and black hair standing in the corridor.\n\n"
            "What do you do?",
            clear=clear,
        )
        self.show_monsters(["Ghost"])
        self.set_choices(
            [
                ("Persuade", lambda: self.ghost_choice("persuade")),
                ("Fight", lambda: self.ghost_choice("fight")),
                ("Sneak Past", lambda: self.ghost_choice("sneak")),
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
            self.write("Drops doll and disappears")
            return "doll"
        elif result <= 15:
            self.write(
                "Help - points to barracks and says there are pointy sticks. "
                "Points to city and says there is shinny stuff. Leaves and drops doll"
            )
            self.player["flags"]["girl_helped"] = True
            self.player["flags"]["girl_hint"] = "barracks_city"
            return "doll"

        self.write(
            "You tell her you are being chased and ask for her help. She disappears and drops a doll. "
            "You hear terrified screams of orcs and goblins.\n\n"
            "You carefully, but swiftly, walk deeper, unwilling to turn back to the horrors you can only "
            "imagine going on to the monsters behind you."
        )
        self.player["flags"]["girl_helped"] = True
        self.player["flags"]["monsters_scattered"] = True
        return "districts"

    def ghost_black_pits_death(self):
        self.write(
            "Her eyes turn to black empty pits of despair. You feel as if you are staring into a black "
            "hole that sucks you in. Nothing matters to you. Soon you lose your sense of self. "
            "You lose your life."
        )
        self.player["health"] = 0
        self.player["flags"]["girl_angry"] = True
        return "death"

    def ghost_black_miasma(self):
        self.write(
            "Black miasma like smoke pours from her and she disappears into it. "
            "Before long that disappears as well."
        )
        self.player["flags"]["girl_helped"] = True
        return "doll"

    def ghost_play_death(self):
        self.write('She looks at you and giggles "Play?"')
        return self.ghost_black_pits_death()

    def fight_girl(self):
        character_class = self.player["class"]
        if character_class == "warrior":
            self.write(
                "You let out a mighty war cry, raise your axe and run at the apparition, with the "
                "knowledge that nothing can stop you.\n\n"
                "You aimed for the head and swung through it like an axe through air, and keep going. "
                "You pass completely through her and fall to the ground. Yup you were right, nothing "
                "could stop you."
            )
            return self.ghost_play_death()
        elif character_class == "scholar":
            self.write(
                "You feel for the swirling core of potential in your soul and feel the power there. "
                "With an extension of your will, of manifest it in blast of power and hurl it at the "
                "unknown spectre in front of you.\n\n"
                "She lets out an ear piercing screen that disorients you. You feel blood coming out of "
                "your ears and have the worst headache of your life."
            )
            self.player["health"] -= 3
            return self.ghost_black_miasma()
        elif character_class == "ranger":
            self.write(
                "You knock and arrow and pull back on the bow string. You aim carefully at the little "
                "girl with the precision of a hunter and release the string.\n\n"
                "Your arrow passes through her as if nothing was there. Your keen eyes notice a slight "
                "distortion where the arrow flew through."
            )
            return self.ghost_play_death()

        self.write(
            "Damn, is that my goth baddie? I'm gonna give her a kiss.\n\n"
            "You run as fast as your short legs can take you to your 17.50"
        )
        return self.ghost_black_pits_death()

    def sneak_past_girl(self):
        self.write("You try to slip past her without drawing attention.")
        self.write(
            "She turns her head and watches you, even through walls. Once you get to a point past her, "
            "she instantly appears in front of you."
        )
        return self.ghost_black_miasma()

    def doll_choice(self):
        self.write("You hear the monsters getting closer. Do you grab the doll, or just run?")
        self.set_choices(
            [
                ("Grab the Doll", lambda: self.doll_result("grab")),
                ("Leave the doll and run", lambda: self.doll_result("leave")),
            ]
        )

    def doll_result(self, choice):
        if choice == "grab":
            self.write("You quickly grab the doll and start running.")
            self.add_item("cracked doll")
            self.player["flags"]["has_doll"] = True
        else:
            self.write(
                "You turn away from the doll and run. You feel a shiver and sneak a quick glance back. "
                "The doll is gone."
            )
        self.player["chapter"] = "districts"
        self.continue_chapter()

    def loot(self, table):
        item = random.choice(table)
        if item == "gold":
            amount = random.randint(5, 15)
            self.player["gold"] += amount
            self.write(f"You find {amount} gold.")
        elif item == "supplies":
            amount = random.randint(1, 3)
            self.player["supplies"] += amount
            self.write(f"You recover {amount} supplies.")
        else:
            self.add_item(item)
            self.write(f"You find {item}.")

    def search_area_loot(self, area):
        roll = self.roll_d20("lore")
        if roll <= 7:
            if area == "city":
                self.write("You found a few gold coins, some rotten fruit, and a used bandage. Gross.")
                self.player["gold"] += 3
            else:
                self.write("Everything has been picked clean, there is nothing here.")
        elif roll <= 14:
            self.write("A health potion")
            self.add_item("health potion")
        else:
            self.award_throne_map()
        self.update_status()
        self.route_choice_done()

    def award_throne_map(self):
        directions = ", ".join(direction.upper() for direction in THRONE_MAP_DIRECTIONS)
        self.write(
            "Map showing the direct route to the throne room, with instructions on how to avoid the traps.\n\n"
            f"The safe bridge path is: {directions}.\n"
            "Remember it or write it down. The map is too brittle to keep checking later."
        )
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

    def start_combat(self, enemies, victory_text, attackers_per_round=1):
        self.combat = {
            "enemies": [
                self.make_enemy(monster_name, index + 1)
                for index, monster_name in enumerate(enemies)
            ],
            "victory_text": victory_text,
            "guarding": False,
            "attackers_per_round": attackers_per_round,
        }
        self.write("Initiate combat.")
        self.show_monsters(sorted(set(enemies)))
        self.show_combat_choices()

    def living_enemies(self):
        if not self.combat:
            return []
        return [enemy for enemy in self.combat["enemies"] if enemy["hp"] > 0]

    def combat_summary(self):
        enemies = self.living_enemies()
        if not enemies:
            return "No enemies standing."
        return "Enemies: " + ", ".join(
            f"{enemy['name']} HP {enemy['hp']}/AC {enemy['ac']}" for enemy in enemies
        )

    def show_combat_choices(self):
        self.update_status()
        self.write(self.combat_summary())
        choices = [
            ("Attack", lambda: self.combat_action("attack")),
            ("Heavy Attack", lambda: self.combat_action("heavy")),
            ("Dodge", lambda: self.combat_action("dodge")),
            ("Run", lambda: self.combat_action("run")),
        ]
        if "health potion" in self.player["gear"]:
            choices.append(("Health Potion", lambda: self.combat_action("potion")))
        self.set_choices(choices)

    def player_combat_stats(self):
        return PLAYER_COMBAT_STATS[self.player["class"]]

    def combat_action(self, action):
        if action == "potion":
            self.remove_item("health potion")
            healing = random.randint(1, 4) + random.randint(1, 4) + 6
            old_health = self.player["health"]
            self.player["health"] = min(self.player["max_health"], self.player["health"] + healing)
            actual_healing = self.player["health"] - old_health
            self.write(f"You drink a health potion and regain {actual_healing} health.")
            self.enemy_combat_turn()
            return

        if action == "run":
            roll = self.roll_d20("sneak")
            if roll >= 12:
                self.write("You break away from the fight and keep moving.")
                self.combat = None
                self.route_choice_done()
                return
            self.write("You try to run, but the monsters cut off your escape.")
            self.enemy_combat_turn()
            return

        stats = self.player_combat_stats()
        attack_bonus = stats["attack_bonus"]
        damage_die = stats["damage_die"]
        damage_bonus = stats["damage_bonus"]
        attacks = stats.get("attacks", 1)
        self.combat["guarding"] = action == "dodge"

        if action == "dodge":
            self.write("You focus on defense and try to avoid the next blow.")
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
            total = attack_roll + attack_bonus
            self.write(f"Attack {attack_number}: you roll {total} to hit {enemy['name']} AC {enemy['ac']}.")

            if attack_roll == 20 or total >= enemy["ac"]:
                damage = random.randint(1, damage_die) + damage_bonus
                if attack_roll == 20:
                    damage += random.randint(1, damage_die)
                enemy["hp"] -= damage
                self.write(f"You hit {enemy['name']} for {damage} damage.")
                if enemy["hp"] <= 0:
                    self.write(f"{enemy['name']} drops.")
            else:
                self.write("You miss.")

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
            if roll == 20 or total >= player_ac:
                damage = random.randint(1, attack["damage_die"]) + attack["damage_bonus"]
                if roll == 20:
                    damage += random.randint(1, attack["damage_die"])
                self.player["health"] -= damage
                self.write(f"{enemy['name']} hits you for {damage} damage.")
            else:
                self.write(f"{enemy['name']} misses.")

        self.combat["guarding"] = False
        if self.check_death():
            self.combat = None
            return
        self.show_combat_choices()

    def win_combat(self):
        victory_text = self.combat["victory_text"]
        self.combat = None
        self.write(victory_text)
        self.write("Loot bodies to find a map.")
        self.award_throne_map()
        self.update_status()
        self.route_choice_done()

    def districts(self, clear=False):
        self.write(
            "You get to the end of the road.\n"
            "The sign points left to Barracks and right to the Merchant district.\n\n"
            "Which route do you take?",
            clear=clear,
        )
        self.set_choices(
            [
                ("Barracks", self.barracks),
                ("Merchant District", self.city_district),
                ("Save", self.save_game),
                ("Main Menu", self.show_start_screen),
            ]
        )

    def city_district(self):
        self.write("You turn right toward the city district.")
        if self.player["flags"]["girl_hint"] == "barracks_city":
            self.write("Shiny stuff. The girl's whisper follows you between the old market stalls.")
        self.write(
            "You enter the city gates and find your self in a market area, with some buildings "
            "that look like homes down further\n\n"
            "There is a band of 5 goblins and 2 orcs roaming around."
        )
        self.show_monsters(["Orc", "Goblin"])
        self.set_choices(
            [
                ("Sneak Into Shop", lambda: self.city_result("shop")),
                ("Assault Monsters", lambda: self.city_result("assault")),
                ("Sneak Past", lambda: self.city_result("sneak")),
            ]
        )

    def city_result(self, choice):
        if choice == "shop":
            self.write("You try to stay to the shadows and sneak into one of the open shops.")
            roll = self.roll_d20("sneak")
            if roll <= 10:
                self.write("You reach for the door handle and push it open. A loud squeek echos out to the city.")
                self.city_combat()
            else:
                self.write(
                    "You reach for the door handle and slowly push it open. "
                    "It looks like the owner kept it well oiled. Nice."
                )
                self.search_area_loot("city")
        elif choice == "assault":
            self.write("You are immediately seen. Prepare for a fight.")
            self.city_combat()
        else:
            self.write("You try to sneak past the monsters.")
            roll = self.roll_d20("sneak")
            if roll <= 16:
                self.write("You hear a war horn sound. You have been spotted.")
                self.city_combat()
            else:
                self.write("You successfully avoid their gaze and sneak past them.")
                self.route_choice_done()

    def city_combat(self):
        self.start_combat(
            ["goblin", "goblin", "goblin", "goblin", "goblin", "orc", "orc"],
            "The last monster falls in the ruined market.",
            attackers_per_round=1,
        )

    def barracks(self):
        self.write("You turn left toward the barracks.")
        if self.player["flags"]["girl_hint"] == "barracks_city":
            self.write("Pointy sticks. The girl's whisper lingers in your head.")
        self.write(
            "You make your way into the barracks. In is shaped like a colosseum. Outer ring "
            "holds an armory and living quarters, with a fighting pit in the center right. "
            "There are three orcs in the inter ring."
        )
        self.show_monsters(["Orc"])
        self.set_choices(
            [
                ("Sneak to Armory", lambda: self.barracks_result("armory")),
                ("Head to Center Ring", lambda: self.barracks_result("fight")),
                ("Sneak to Quarters", lambda: self.barracks_result("quarters")),
            ]
        )

    def barracks_result(self, choice):
        if choice == "armory":
            self.write("You try to sneak to the armory.")
            roll = self.roll_d20("sneak")
            if roll <= 10:
                self.write("You tripped over a left over shield. Prepare to fight.")
                self.barracks_combat()
            else:
                self.write("You sucessfully made it to the armory.")
                self.search_area_loot("barracks")
        elif choice == "fight":
            self.write("The orcs immidiately notice you and prepare to fight. Good luck.")
            self.barracks_combat()
        else:
            self.write("You try to sneak to the living quarters.")
            roll = self.roll_d20("sneak")
            if roll <= 10:
                self.write(
                    "When you open the door to the first living area, you find a goblin in a dress. "
                    "He screams and alerts the orcs."
                )
                self.barracks_combat()
            else:
                self.write("You open the door and find it empty. You search around for anything useful.")
                self.search_area_loot("barracks")

    def barracks_combat(self):
        self.start_combat(
            ["orc", "orc", "orc"],
            "The last orc falls in the fighting pit.",
            attackers_per_round=1,
        )

    def route_choice_done(self):
        if self.check_death():
            return
        self.player["chapter"] = "residential"
        self.continue_chapter()

    def residential_area(self, clear=False):
        self.write(
            "Both routes narrow into the residential quarter.\n\n"
            "Chests sit beside rotted clothes. Painted walls show Visteria before the fall.\n\n"
            "Do you open chests, or study the rooms?",
            clear=clear,
        )
        self.set_choices(
            [
                ("Open Chests", lambda: self.residential_result("chests")),
                ("Study Rooms", lambda: self.residential_result("study")),
            ]
        )

    def residential_result(self, choice):
        if choice == "chests":
            if random.randint(1, 6) <= 2:
                self.show_monsters(["Mimic"])
                self.write("The chest opens its own teeth. Mimic.")
                self.player["health"] -= 4
            else:
                self.loot(["gold", "supplies", "precious gems", "silver ring"])
        else:
            self.write("You learn that the buried city was sealed after an eldritch ritual failed.")
            self.add_item("city lore")

        if self.check_death():
            return
        self.player["chapter"] = "bridge"
        self.continue_chapter()

    def bridge_prompt(self, clear=False):
        text = (
            "The bridge crosses a black canal beneath the city.\n"
            "On the far side, a warehouse burns with violet light.\n"
            "Behind the walls, old city defenses grind awake."
        )
        if self.player["flags"].get("has_throne_map"):
            text += (
                "\n\nThe old map showed a safe route through the bridge traps, "
                "but the parchment has crumbled from being handled too much.\n"
                "You will need to follow the directions from memory."
            )
        else:
            text += (
                "\n\nWithout a map or memorized directions, it may be impossible to safely cross.\n"
                "Do you cross anyway, or prepare first?"
            )
        self.write(text, clear=clear)

        if self.player["flags"].get("has_throne_map"):
            self.set_choices(
                [
                    ("Navigate Bridge", self.start_bridge_navigation),
                    ("Prepare", lambda: self.cross_bridge("prepare")),
                    ("Save", self.save_game),
                    ("Main Menu", self.show_start_screen),
                ]
            )
            return

        self.set_choices(
            [
                ("Cross", lambda: self.cross_bridge("cross")),
                ("Prepare", lambda: self.cross_bridge("prepare")),
                ("Save", self.save_game),
                ("Main Menu", self.show_start_screen),
            ]
        )

    def cross_bridge(self, choice):
        if choice == "prepare":
            if self.player["supplies"] > 0:
                self.player["supplies"] -= 1
                self.player["health"] += 2
                self.write("You bind wounds and steady your hands.")
            else:
                self.write("You have no supplies left.")
            self.update_status()
            self.bridge_prompt()
            return

        self.write("Inside the warehouse, robed figures circle an eldritch ritual.")
        if self.player["flags"]["girl_helped"]:
            self.write("The cracked doll drops from your pack. The air turns cold.\nThe pale girl appears among them, and the ritual falters.")
        else:
            self.write("The ritual notices you. That is the only way to describe it.")

        if self.roll("combat", 15) or self.player["flags"]["girl_helped"]:
            self.write("You survive the warehouse battle and flee into the production tunnels.")
            self.player["flags"]["bridge_crossed"] = True
            self.player["chapter"] = "production"
            self.continue_chapter()
        else:
            self.write("The battle breaks you against the warehouse floor.")
            self.player["health"] = 0
            self.check_death()

    def start_bridge_navigation(self):
        self.bridge_path = []
        self.write("You step onto the trapped bridge. Choose the first direction.")
        self.bridge_navigation_step()

    def bridge_navigation_step(self):
        step_names = ["first", "second", "third", "fourth"]
        step = step_names[len(self.bridge_path)]
        self.write(f"Choose the {step} direction.")
        self.set_choices(
            [
                ("Left", lambda: self.bridge_navigation_choice("left")),
                ("Right", lambda: self.bridge_navigation_choice("right")),
                ("Up", lambda: self.bridge_navigation_choice("up")),
                ("Down", lambda: self.bridge_navigation_choice("down")),
            ]
        )

    def bridge_navigation_choice(self, choice):
        expected = THRONE_MAP_DIRECTIONS[len(self.bridge_path)]
        self.bridge_path.append(choice)

        if choice != expected:
            self.write(
                "The stone under your foot sinks with a hollow click.\n"
                "The bridge trap opens beneath you."
            )
            self.player["health"] = 0
            self.check_death()
            return

        if len(self.bridge_path) < len(THRONE_MAP_DIRECTIONS):
            self.write("The bridge stays quiet.")
            self.bridge_navigation_step()
            return

        self.write("You follow the final direction and reach the far side without waking the traps.")
        self.cross_bridge("cross")

    def production_area(self, clear=False):
        self.production_path = []
        self.write(
            "The production area is a maze of chains, hooks, furnaces, and dead machines.\n"
            "One wrong turn will end you.\n\n"
            "Choose the first path.",
            clear=clear,
        )
        self.production_step()

    def production_step(self):
        step_names = ["first", "second", "third"]
        step = step_names[len(self.production_path)]
        self.write(f"Choose the {step} path.")
        self.set_choices(
            [
                ("Left", lambda: self.production_choice("left")),
                ("Center", lambda: self.production_choice("center")),
                ("Right", lambda: self.production_choice("right")),
            ]
        )

    def production_choice(self, choice):
        self.production_path.append(choice)
        if len(self.production_path) < 3:
            self.production_step()
            return

        if self.production_path == ["left", "right", "center"]:
            self.write(
                "You find the hidden maintenance lift and ride it toward moonlight.\n"
                "Chapter complete. You have escaped the buried city of Visteria."
            )
            self.player["chapter"] = "complete"
            self.continue_chapter()
        else:
            self.write("The floor gives way beneath you. The production area keeps its secrets.")
            self.player["health"] = 0
            self.check_death()

    def complete(self, clear=False):
        self.write("You have completed this playable chapter of Tales of Visteria.", clear=clear)
        self.save_game()
        self.set_choices(
            [
                ("Main Menu", self.show_start_screen),
                ("Quit", self.root.destroy),
            ]
        )

    def game_over(self):
        self.write(
            "==================================\n"
            "             GAME OVER\n"
            "==================================\n"
            "You fall in the dark beneath Visteria.\n"
            "Start a new game to try another route.\n\n"
            "Thanks for playing.\n"
            "This was made in memory of a DnD session with friends."
        )
        self.show_story_image(GAME_OVER_IMAGE)
        self.set_choices(
            [
                ("New Game", self.show_character_select),
                ("Load Game", self.load_game),
                ("Main Menu", self.show_start_screen),
                ("Quit", self.root.destroy),
            ]
        )


def main():
    root = tk.Tk()
    TalesOfVisteriaApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
