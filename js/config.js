const GLOBALS = {
    NAME: "AlphaRPG",
    VERSION: "3.0 BETA8",
    RELICS_NAMES: ["Ares Relic", "Yggdrasil Relic", "Vulcan Relic", "Recon Relic", "No Relic"],
    ARMORS_NAMES:
    {
        Normal: ['Tiny', 'Cursed', 'Ruined', 'Damaged', 'Unusable', 'Rusty', 'Weakened', 'Broken'],
        Common: ['Cheap', 'Small', 'Fragile', 'Chipped', 'Weak', 'Used', 'Battered', 'Basic'],
        Uncommon: ['Acceptable', 'Big', 'Expensive', 'Light', 'Undamaged', 'Clean', 'Worn', 'Fresh'],
        Rare: ['Nice', 'Good', 'Premium', 'Hard', 'Strong', 'Durable', 'Polished', 'Powerful'],
        Epic: ['Master', 'Expert', 'Guardian', 'Perfect', 'Balanced', 'Epic', 'Advanced', 'Shiny'],
        Exotic: ['Exotic', 'Magic', 'Sacred', 'Blessed', 'Relic', 'Alpha', 'Destiny', 'Deca'],
        Divine: ['Unreal', 'Paradise', 'Divine', 'Godly', 'Holy', 'Heavenly', 'Fairy', 'Fantasm'],
    },
    ARMORS_TYPE: ["", "Helmet", "Armor", "Shield", "Boots"],
    WEAPONS_TYPE: ["Main", "Special"],
    MISSIONS:
    {
        //   0           1           2          3               4             5                 6                  7                8                    9
        //NAME, DESC, LEVEL, TYPE, REQ KILLS, EXP, REWARD TYPE, QUALITY, LOCATION, REQ MISSION
        0: ["White Light", 'You wake up in an unknown place where a white light dazzles you..<br> You can see the exit in the distance... Make it quick, this place seems weird.', 1, 1, 10, 200, 0, "Normal", 0, -1],
        1: ["Shadow Forest", `You are now in a forest.. a dark and creepy forest.<br> You decide to move from here since at this rate you could die in that lost place.`, 4, 1, 10, 250, 0, "Common", 1, 0],
        2: ["Lost Path", 'You arrive at the end of the forest and discovered a little path hidden behind a big tree.<br>There seems to be a light in the distance and finally some answers ..?', 7, 1, 10, 500, 0, "Common", 2, 1],
        3: ["Galarius City", `You're reaching a city with a lot of peoples which seems to be from a lot different races like humans, dwarves and even elves.<br>Seems like you could be able to find some help there.. or maybe just someone who can tell you how to get back to your world.`, 9, 1, 10, 750, 0, "Uncommon", 3, 2],
        4: ["Endless mountain", 'One of the locals advise you to go north and reach the royal capital through the mountains..<br> So here you are in the so called endless mountain.', 12, 1, 10, 1000, 0, "Uncommon", 4, 3],
        5: ["Dark Cave", 'You arrive at the entrance of a dark cave,<br> it seems narrow but it is much faster and less dangerous than the mountain.', 15, 1, 10, 1500, 0, "Rare", 5, 4],
        6: ["Empire Road", 'You finally reached the end of this cave, tired but in one piece,<br> you can already see a big city at the end of the road..', 19, 1, 10, 2500, 0, "Rare", 6, 5],
        7: ["Imperium City", 'You\'re now in the Capital, the king heard about your story and asked for an immediate hearing.', 22, 1, 10, 3000, 0, "Rare", 7, 6],
        8: ["Central V", 'You discuss with the king to find a way to return to your world..<br>He tells you that the only way is the Red Portal but suddenly..<br> The city is attacked by the demon army, you need to get out of here quick.', 25, 1, 10, 5000, 0, "Epic", 8, 7],
        9: ["The Red Portal", 'The red portal is near and it seems that the portal is really hot.. Burning like the hells gate. But you do not really have any other choice.', 27, 1, 10, 7500, 0, "Epic", 9, 8],
        10: ["Corrupted World", 'You have successfully passed the portal.. but where are you now ?', 29, 1, 10, 10000, 0, "Epic", 10, 9],
        11: ["Corrupted Fortress", 'You see a huge fortress with nothing good inside, you must clean this place.', 30, 2, 10, 0, 0, "Exotic", 11, 10],
        12: ["Corrupted Fortress - Basement", 'There is a door in the fortress which leads to another level, clean this place too.', 30, 2, 25, 0, 2, "Exotic", 11, 11],
        13: ["Corrupted Fortress - Core", 'This is the last floor, the core of the Fortress, where the corruption started.. Destroy it.', 30, 2, 50, 1, 0, "Exotic", 11, 12],
        14: ["The Black Portal", 'Just after you destroyed the fortress core, another portal appeared..<br><br> A new story begins.', 30, 1, 10, 15000, 0, "Exotic", 12, 11],
        15: ["The Black Portal II", 'The passage becomes darker and darker, you keep moving forward and perceive a light in the distance..', 30, 1, 10, 20000, 0, "Exotic", 12, 14],
        16: ["Light of Elysia", 'You\'ve just landed in a new world, in the city of Elysia. This world seems really beautiful, and so you decide to explore it.', 31, 1, 10, 25000, 0, "Exotic", 13, 15],
        17: ["Red Moon at Elysia", 'The city really is lively and in this world there are only humans and so far peace reigns, you decide to visit a bit the city this night, after all ..<br> This city is really big. Suddenly you hear a cry, you go to that shout and in the shadow of an alley you see a man sucking the blood of a woman.. a vampire is right there.', 31, 1, 10, 50000, 0, "Exotic", 13, 16],
        18: ["Vampire Manor", 'One of the vampires to confess the location of a vampire hideout, you will surely find informations there.', 32, 1, 10, 75000, 0, "Exotic", 14, 17],
        19: ["Funeral Chamber of the Manor", 'It seems to be the right place, it\'s full of vampires and one of them emits a strong power.', 32, 1, 10, 100000, 0, "Exotic", 14, 18],
        20: ["The New World", 'The city is now in peace, you follow the Red River to continue the exploration of this new world.', 33, 1, 10, 125000, 0, "Exotic", 15, 19],
        21: ["The Red River", 'During your daily hunt you find a merchant who keeps saying that the vampire attack in the city was only the beginning.<br> He also tells you that a rumor says that the castle is hidden in the mountains.<br> You will investigate on the spot to finally lead a quiet life', 33, 1, 10, 150000, 0, "Exotic", 15, 20],
        22: ["The mountains", "After searching for 5 days in the mountains, you find a bridge filled with corpses ..<br>Without any hesitation you enter the territory of vampires.", 34, 1, 10, 175000, 0, "Exotic", 16, 21],
        23: ["The Immortal Bridge", "These vampires seems a more difficult to kill than the ones in the city but you keep fighting and see a huge castle at the end of the bridge.", 34, 1, 10, 175000, 0, "Exotic", 16, 22],
        24: ["Vampire Castle", 'This is it. The Vampire Castle.<br>Now that you have arrived here you take on the opportunity to clean this filthy place.', 35, 2, 10, 0, 0, "Exotic", 17, 23],
        25: ["Vampire Castle - Tower", 'You discover that one of the tower in the castle hides many powerful vampires, you may head there and clean this up.', 35, 2, 25, 1, 2, "Divine", 17, 24],
        26: ["Vampire Castle - Core", 'You have reached the heart of the castle, by destroying the heart, the world will finally be at peace.<br> But before this happy end, you will need to kill the remaining vampires.', 35, 2, 50, 2, 0, "Divine", 17, 25],
    },
    BOSSES_NAMES:
        [
            'Pure Soul',
            'Fairy Queen',
            'Alpha Wolf',
            'Huge Rat',
            'Poison Golem',
            'Pink Slime',
            'Albino Spider',
            'Black Mage',
            'Ghoul',
            'Poltergeist',
            'Knight Commander',
            'Demon Lord',
            'Powerful Skeleton',
            "Jack-o'-lantern",
            'Vampire Lord',
            'Big Fish-Man',
            'Noble Vampire',
            'Vampire King',
        ],
    ENEMIES_NAMES:
        [
            ["Kind Soul", "Evil Soul"],
            ["Fire Fairy", "Water Fairy", "Grass Fairy"],
            ["Wolf", " White Wolf", "African Wolf"],
            ["Grey Rat", "Brown Rat"],
            ["Stone Golem", "Water Golem"],
            ["Blue Slime", "Black Slime", "Yellow Slime"],
            ["Black Spider", "Red Spider"],
            ["Fire Mage", "Water Mage"],
            ["Zombie", "Burning Zombie"],
            ["Ghost", "Crying Ghost"],
            ["White Knight", "Red Knight"],
            ["Minor Rank Demon", "Middle Rank Demon", "Higher Rank Demon"],
            ["Skeleton", "Decrepit Skeleton", "Burnt Skeleton"],
            ["Jack-o'-lantern", "Jack-o'-lantern"],
            ["Vampire"],
            ["Fish-Man", "Fish-Man", "Fish-Man"],
            ["Vampire Lord", "Vampire"],
            ["Vampire Lord", "Noble Vampire"],
        ],
    LOCATIONS: {
        //    0             1                   2                            3                                    4                           5
        //NAME, MIN-LEVEL, MAX-LEVEL, MAX DROP QUALITY, MISSION REQUIRED, LOOTS (WIP)
        0: ["The White Light", 1, 4, 0, 0, { lootables: ["Truc", "Potion"], }],
        1: ["The Shadow Forest", 4, 7, 1, 1, { lootables: ["Truc", "Potion"], }],
        2: ["The Lost Path", 7, 9, 1, 2, { lootables: ["Truc", "Potion"], }],
        3: ["Galarius City", 9, 12, 2, 3, { lootables: ["Truc", "Potion"], }],
        4: ["The Endless Mountain", 12, 15, 2, 4, { lootables: ["Truc", "Potion"], }],
        5: ["The Dark Cave", 15, 19, 3, 5, { lootables: ["Truc", "Potion"], }],
        6: ["Empire Road", 19, 22, 3, 6, { lootables: ["Truc", "Potion"], }],
        7: ["Imperium City", 22, 25, 3, 7, { lootables: ["Truc", "Potion"], }],
        8: ["Central V", 25, 27, 4, 8, { lootables: ["Truc", "Potion"], }],
        9: ["The Red Portal", 27, 29, 4, 9, { lootables: ["Truc", "Potion"], }],
        10: ["The Corrupted World", 29, 30, 4, 10, { lootables: ["Truc", "Potion"], }],
        11: ["The Corrupted Fortress", 29, 30, 5, 10, { lootables: ["Truc", "Potion"], }],
        12: ["The Black Portal", 30, 31, 5, 14, { lootables: ["Truc", "Potion"], }],
        13: ["Elysia City", 31, 32, 5, 14, { lootables: ["Truc", "Potion"], }],
        14: ["Vampire Manor", 32, 33, 5, 20, { lootables: ["Truc", "Potion"], }],
        15: ["The Red River", 33, 34, 5, 20, { lootables: ["Truc", "Potion"], }],
        16: ["The Immortal Bridge", 34, 35, 5, 20, { lootables: ["Truc", "Potion"], }],
        17: ["Vampire Castle", 35, 35, 5, 20, { lootables: ["Truc", "Potion"], }],
    }
};
var Backup = "Default";
var Game = {
    username: "Default",
    Armors: [
        //       0             1           2            3            4           5
        //  STATUS, NAME, CLASS, ARMOR, LEVEL, GEMS
        [],
        [true, "Basic Armor", "Normal", 100, 1, 0],
        [false, "Basic Armor", "Normal", 100, 1, 0],
        [false, "Basic Armor", "Normal", 100, 1, 0],
        [false, "Basic Armor", "Normal", 100, 1, 0],
    ],
    Weapons: {
        //     0           1           2           3             4
        // NAME, CLASS, GEMS, LEVEL, POWER
        Main: ["Training Sword", "Normal", 0, 1, 10],
        Special: ["Training Dagger", "Normal", 0, 1, 10],
    },
    RELICS: [
        //          0                 1           2          3
        // RELIC NAME, CLASS, TYPE, VALUE
        [],
        ["Normal", 5, 0],
        ["Normal", 5, 0],
        ["Normal", 5, 0],
        ["Normal", 5, 0],
    ],
    ArmorUpgrades: [null, 0, 0, 0, 0],
    MaxUPC: [0, 0, 0, 0, 0, 0],
    xp: [0, 100, 1],
    Level: 1,
    Enemy: [], //NAME, CLASS, LEVEL, POWER, LIFE, CURRENTLIFE
    Loses: 0,
    Wins: 0,
    Cash: 0,
    isInFight: 3,
    Emp: 0,
    Shards: 0,
    Defeated: [null, 0, 0, 0, 0, 0, 0, 0],
    inventory: [],
    MaxInv: 20,
    Theme: "",
    Upgrades: [0, 0, 0, 0],
    Simulation: 1,
    DIMENSION_MULTIPLIERS: [0, 0, 0, 1], //POWER, LIFE, XP, DIFFICULTY
    Avatar: random(1, 50),
    config: [1, 1, 0, 1, 0],
    LastEscape: 0,
    Sprite: 0,
    MissionsCompleted: [],
    Location: 0,
    PlayTime: 0,
    MissionStarted: [false, 0, 0, 0, 0], //TOGGLE, MISSION ID, PROGRESSION, OBTAINED REWARD, LOCK WIN
    DefeatedByLocation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    FortressesCleared: 0,
    AutoRemove: [0, 0, 0, 0, 0, 0],
    TotalMissions: 0,
    class: "none",
};