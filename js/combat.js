var HEALING_TIMER;
var HEALING_ANIMATION;

const HEALING = function () {
    if (Game.Enemy[1] >= 5) APP.NextHeal = 3; else APP.NextHeal = 5;
    let CONFIG = {
        HEALS: [[65, 85]],
        DEFAULT: [40, 65],
        TEXT: "",
    };

    if (Game.isInFight != 1) Game.isInFight = 1;
    if (APP.CoreLife < APP.CoreBaseLife) {
        let LUCK = _.random(1, 100);
        if (_.inRange(LUCK, 0, 16)) CONFIG.DEFAULT = CONFIG.HEALS[0];
        let HEAL_VALUE = random((APP.WeaponsPower * CONFIG.DEFAULT[0]), (APP.WeaponsPower * CONFIG.DEFAULT[1])) / 100;
        APP.CoreLife = Math.round(APP.CoreLife + HEAL_VALUE);
        CONFIG.TEXT = HEAL_VALUE > 65 ?  `+ <span class="pw green">${fix(HEAL_VALUE, 0)}</span>` : `+ ${fix(HEAL_VALUE, 0)}`;
        if (HEAL_VALUE < 1) CONFIG.TEXT = "MISSED";
    }
    $("#EnemyDamage").html("").hide();
    $("#PlayerDamage").html(CONFIG.TEXT).show();
    if (APP.CoreLife >= APP.CoreBaseLife) {
        APP.CoreLife = APP.CoreBaseLife;
        ClearProtect();
    }
    UpdateGame();
};

const HEALING_TEXT = function () {
    $("#cover-btn").html(`Recovering... (<span class='pw yellow'>${APP.NextHeal}s</span>)`);
    if (APP.NextHeal > 0) APP.NextHeal--;
};

const Protect = function () {
    if (!APP.isCovered && APP.CoreLife < APP.CoreBaseLife && APP.LastCover == 0) {
        APP.isCovered = true;
        $("#attack-btn").hide();
        $("#emp-btn").hide();
        HEALING();
        HEALING_TEXT();
        let HEALING_TIME = Game.Enemy[1] >= 5 ? 3000 : 5000;
        HEALING_TIMER = setInterval(HEALING, HEALING_TIME);
        HEALING_ANIMATION = setInterval(HEALING_TEXT, 1000);
    } else { ClearProtect(); }
};

const ClearProtect = function () {
    if (APP.isCovered) {
        APP.isCovered = false;
        APP.LastCover = 5;
        clearInterval(HEALING_TIMER);
        clearInterval(HEALING_ANIMATION);
        $("#attack-btn").show();
        $("#emp-btn").show();
        $("#PlayerDamage").html("").hide();
        $("#cover-btn").html("<i class='fas fa-shield'></i> Take Cover");
    }
};

function Attack() {
    CHECK_MAX_LIFE();
    if (Game.isInFight != 1) Game.isInFight = 1;
    var luck = random(1, 100);
    var rPlayerPower = random((APP.WeaponsPower * 85), APP.WeaponsPower * 100) / 100;
    if (luck <= random(6, 10)) rPlayerPower = APP.WeaponsPower * 1.15;
    var EDamage = "-" + fix(Math.round(rPlayerPower), 1);
    Game.Enemy[5] = Math.floor(Game.Enemy[5] - rPlayerPower);
    var rEnemyPower = random((Game.Enemy[3] * 65), Game.Enemy[3] * 100) / 100;
    if (luck >= 90) rEnemyPower = 0;
    var DAMAGES = rEnemyPower > 0 ? "-" + fix(Math.round(rEnemyPower), 1) : "MISSED";
    APP.CoreLife -= rEnemyPower;
    $("#EnemyDamage").html(EDamage).show();
    $("#PlayerDamage").html(DAMAGES).show();
    if (Game.isInFight == 1 && APP.CoreLife <= 0) LoseFight(); else if (Game.isInFight == 1 && Game.Enemy[5] <= 0) WinFight();
    UpdateGame();
}

function LaunchEMP() {
    CHECK_MAX_LIFE();
    if (Game.isInFight != 1) Game.isInFight = 1;
    if (Game.Emp > 0 && !$("#emp-btn").hasClass("transparent")) {
        Game.Emp--;
        var luck = random(0, 100);
        var POWERRANGES = [0.75, 1];
        if (luck <= 10) POWERRANGES = [1, 1.5];
        var rPlayerPower = random(APP.SpecialPower * POWERRANGES[0], APP.SpecialPower * POWERRANGES[1]);
        Game.Enemy[5] = Math.floor(Game.Enemy[5] - rPlayerPower);
        var rEnemyPower = random(0, Game.Enemy[3]);
        APP.CoreLife -= rEnemyPower;
        $("#EnemyDamage").html("-" + fix(Math.round(rPlayerPower), "auto")).show();
        $("#PlayerDamage").html("-" + fix(Math.round(rEnemyPower), "auto")).show();
    }
    if (Game.isInFight == 1 && APP.CoreLife <= 0) LoseFight(); else if (Game.isInFight == 1 && Game.Enemy[5] <= 0) WinFight();
    UpdateGame();
}

function RunAway() {
    if (Game.LastEscape == 0) {
        Game.LastEscape = 45;
        if (Game.Level <= 25) Game.LastEscape = 35;
        if (Game.Level <= 20) Game.LastEscape = 30;
        if (Game.Level <= 15) Game.LastEscape = 25;
        if (Game.Level <= 10) Game.LastEscape = 20;
        if (Game.Level <= 5) Game.LastEscape = 15;
        APP.CoreLife = APP.CoreBaseLife;
        Game.isInFight = 0;
        if (Game.isInFight == 1 && APP.CoreLife <= 0) LoseFight(); else if (Game.isInFight == 1 && Game.Enemy[5] <= 0) WinFight();
        UpdateGame();
    }
}

//WIN OR LOSE FIGHT
function WinFight() {
    if (Game.MissionStarted[4] == 0 && Game.isInFight == 1) {
        let LOOT_RATES = [50, 15, 45];
        if (Game.MissionStarted[0]) LOOT_RATES = GLOBALS.MISSIONS[Game.MissionStarted[1]][3] == 1 ? [5, 7.5, 10] : [40, 20, 30];
        let MIN_LOOT_QUALITY = ["", "Normal", "Common", "Uncommon", "Rare", "Epic", "Exotic", "Divine"];
        let COUNTED_LOOTS = 0;
        let LOOTS = "";
        let EMP = "";
        let LEVELUP = "";

        if (!Game.MissionStarted[0]) {
            expGain = (Game.Enemy[1] * Game.Enemy[2]) * 10 + (Game.Level * 2.5) * Game.xp[2];
            expGain = _.random(expGain * 0.85, expGain);
        } else {
            expGain = Game.Enemy[2] + Game.Level * 15 * Game.xp[2];
            if (GLOBALS.MISSIONS[Game.MissionStarted[1]][3] == 2) expGain = _.random(expGain * 0.9, expGain * 1.2);
            else expGain = _.random(expGain * 0.9, expGain);
        }
        if (Game.MissionStarted[0] && Game.Level >= GLOBALS.LOCATIONS[GLOBALS.MISSIONS[Game.MissionStarted[1]][8]][2]) expGain = 0;
        Game.Wins++;
        Game.Defeated[Game.Enemy[1]]++;
        Game.DefeatedByLocation[Game.Location]++;
        if (Game.MissionStarted[0]) Game.MissionStarted[2]++;
        if (Game.Level >= GLOBALS.LOCATIONS[Game.Location][2]) expGain = 0;
        Game.xp[0] += Math.round(expGain);
        if (Game.Level < APP.MaxLevel) {
            Game.xp[0] += Math.round(expGain);
            if (Game.xp[0] >= Game.xp[1]) {
                Game.Level++;
                LEVELUP = "<div class='pw inline blue label'>LEVEL UP (" + Game.Level + ")</div>";
            }
            UpdateGame();
        }
        //EMP LOOT CHANCE
        var ELOOTCHANCE = random(1, 100);
        let MINIMALRATE_EMP = Game.MissionStarted[0] ? 55 : 25;
        let EMPCount = _.random(1, 3);
        if (Game.MissionStarted[0] && GLOBALS.MISSIONS[Game.MissionStarted[1]][3] == 2) EMPCount = _.random(2, 4);
        let EMP_DROPS = (Game.Emp + EMPCount) > 50 ? (50 - Game.Emp) : EMPCount;
        if (ELOOTCHANCE <= MINIMALRATE_EMP && Game.Emp < 50) { Game.Emp += EMP_DROPS; EMP = "<div class='pw inline yellow label'><i class='pw yellow fas fa-swords'></i>" + EMP_DROPS + " Special Attack(s)</div>"; }

        if (Game.Enemy[1] >= 6 && !Game.MissionStarted[0]) LOOT_RATES[0] = 1;

        //CORE LOOT CHANCE
        var LOOTCHANCE1 = random(1, 100);
        if (LOOTCHANCE1 > 0 && LOOTCHANCE1 <= LOOT_RATES[0] && Game.isInFight != 2) {
            COUNTED_LOOTS++;
            if (APP.ScoreModeEnabled == 0) {
                if (Game.Level >= APP.Ranking) {
                    let LOOT_LEVEL = [random(Game.Level - 5, Game.Level + 1), random(Game.Level - 4, Game.Level + 2), random(Game.Level - 3, Game.Level + 2), random(Game.Level - 2, Game.Level + 3), random(Game.Level - 1, Game.Level + 4), Game.Level, Game.Level];
                    newItem(0, LOOT_LEVEL[Game.Enemy[1]], MIN_LOOT_QUALITY[Game.Enemy[1]]);
                }
                else newItem(0, random(APP.Ranking, APP.Ranking + 2), "Normal");
            } else {
                if (GLOBALS.MISSIONS[Game.MissionStarted[1]][3] == 2) {
                    if (Game.Enemy[1] >= 1) {
                        if (Game.Enemy[1] == 7) newItem(0, random((APP.Ranking - 10) + Game.Enemy[1], (APP.Ranking + 5) + Game.Enemy[1]), "Divine");
                        else newItem(0, random((APP.Ranking - 10) + Game.Enemy[1], (APP.Ranking + 5) + Game.Enemy[1]), "Exotic");
                    }
                } else {
                    if (Game.Enemy[1] < 5) newItem(0, random((APP.Ranking - 10) + Game.Enemy[1], (APP.Ranking + 5) + Game.Enemy[1]), "Rare");
                    else newItem(0, random((APP.Ranking - 10) + Game.Enemy[1], (APP.Ranking + 5) + Game.Enemy[1]), MIN_LOOT_QUALITY[Game.Enemy[1]]);
                }
            }
            let ITEMID = (Game.inventory.length - 1) < Game.MaxInv ? (Game.inventory.length - 1) : Game.MaxInv;
            let TIER = APP.ScoreModeEnabled == 0 ? "Level" : "Score";
            let TIERRANK = APP.ScoreModeEnabled == 0 ? Game.inventory[ITEMID].level : "<i class='fad fa-dice-d20'></i>" + Math.floor(Game.inventory[ITEMID].level * 10);

            var UPS = Game.inventory[ITEMID].ups > 0 ? "" + Game.inventory[ITEMID].ups + "<i class='pw orange fad fa-gem revertmargin'></i>" : "";
            var LOOTCONTENT = Game.inventory[ITEMID].id == 4 ? "<i class='pw blue fas fa-sword revertmargin'></i>" + fix(Game.inventory[ITEMID].power, "auto") : "<i class='pw red fas fa-heart revertmargin'></i>" + fix(Game.inventory[ITEMID].life, "auto");
            if (ITEMID < Game.MaxInv) LOOTS = LOOTS + "<div class='pw segments'><div class='pw segment " + Game.inventory[ITEMID].class + "'><div class='pw inline label'>" + TIER + " " + TIERRANK + "</div>" + Game.inventory[ITEMID].name + "<span class='" + Game.inventory[ITEMID].class + "'> " + UPS + "</span><br><span class='" + Game.inventory[ITEMID].class + "'> " + Game.inventory[ITEMID].class + " </span><br>" + LOOTCONTENT + "</div></div>";
        }

        //RELIC LOOT CHANCE
        var LOOTCHANCE2 = _.random(0, 100);
        if (LOOTCHANCE2 > 0 && LOOTCHANCE2 <= LOOT_RATES[1] && Game.isInFight != 2) {
            COUNTED_LOOTS++;
            if (APP.ScoreModeEnabled == 0) {
                if (Game.Level > APP.Ranking) newItem("Relic", null, MIN_LOOT_QUALITY[Game.Enemy[1]]);
                else newItem("Relic", null, "Normal");
            } else {
                if (GLOBALS.MISSIONS[Game.MissionStarted[1]][3] == 2) {
                    if (Game.Enemy[1] == 7) newItem("Relic", null, "Divine");
                    else newItem("Relic", null, "Exotic");
                } else {
                    if (Game.Enemy[1] <= 4) newItem("Relic", null, "Rare");
                    else newItem("Relic", null, MIN_LOOT_QUALITY[Game.Enemy[1]]);
                }
            }
            let ITEMID = (Game.inventory.length - 1) < Game.MaxInv ? (Game.inventory.length - 1) : Game.MaxInv;
            let DESCRIPTIONS = ["-", "Power bonus of " + fix(Game.inventory[ITEMID].bonus, 2), "Life bonus of " + fix(Game.inventory[ITEMID].bonus, 2), "Max Score +" + fix(Game.inventory[ITEMID].bonus, 1), "Minimal drop quality <span class='" + Game.inventory[ITEMID].bonus + "'>" + Game.inventory[ITEMID].bonus + "</span>"];
            if (ITEMID < Game.MaxInv) LOOTS = LOOTS + "<div class='pw segments'><div class='pw segment " + Game.inventory[ITEMID].class + "'>" + Game.inventory[ITEMID].name + "<br><span class='" + Game.inventory[ITEMID].class + "'>" + Game.inventory[ITEMID].class + "</span><br>" + DESCRIPTIONS[Game.inventory[ITEMID].object] + "</div></div>";
        }
        //KEY LOOT CHANCE
        var LOOTCHANCE3 = random(0, 100);
        if (LOOTCHANCE3 > 0 && LOOTCHANCE3 <= LOOT_RATES[2] && Game.Level >= 10 && Game.isInFight != 2) {
            COUNTED_LOOTS++;
            if (APP.ScoreModeEnabled == 0) {
                newItem("Gem", null, MIN_LOOT_QUALITY[Game.Enemy[1]]);
            } else {
                if (GLOBALS.MISSIONS[Game.MissionStarted[1]][3] == 2) {
                    if (Game.Enemy[1] >= 1) {
                        if (Game.Enemy[1] == 7) newItem("Gem", null, "Divine");
                        else newItem("Gem", null, "Exotic");
                    }
                } else {
                    if (Game.Enemy[1] <= 3) newItem("Gem", null, "Uncommon");
                    else newItem("Gem", null, MIN_LOOT_QUALITY[Game.Enemy[1]]);
                }
            }
            let ITEMID = (Game.inventory.length - 1) < Game.MaxInv ? (Game.inventory.length - 1) : Game.MaxInv;

            if (Game.inventory[ITEMID].object > 0 && Game.inventory[ITEMID].object < 3) {
                if (Game.inventory[ITEMID].object == 1) descitem = "+<i class='pw red fas fa-heart nomargin'></i>" + fix(Game.inventory[ITEMID].life, "auto") + "<br>";
                if (Game.inventory[ITEMID].object == 2) descitem = "+<i class='pw blue fas fa-sword nomargin'></i>" + fix(Game.inventory[ITEMID].power, "auto") + "<br>";
                if (ITEMID < Game.MaxInv) LOOTS = LOOTS + "<div class='pw segments'><div class='pw segment " + Game.inventory[ITEMID].class + "'>" + Game.inventory[ITEMID].name + "<br><span class='" + Game.inventory[ITEMID].class + "'>" + Game.inventory[ITEMID].class + "</span><br>" + descitem + "</div></div>";
            }
        }
        let INVENTORYFULL = (Game.inventory.length - 1) < Game.MaxInv ? "" : "<div>Inventory full, you can\'t recover any new item.</div>";
        LOOTS = LOOTS + INVENTORYFULL;
        if (COUNTED_LOOTS == 0) LOOTS = "<br>" + INVENTORYFULL;
        Game.isInFight = 2;
        var ToAddCash = Math.floor(random(1 * (Game.Enemy[2] - 5), Game.Enemy[1] * Game.Enemy[2]));
        if (ToAddCash < 1) ToAddCash = 1;
        Game.Cash += ToAddCash;

        let THREATS = ["", "NORMAL", "ADVANCED", "SUPERIOR", "VETERAN", "ELITE", "BOSS", "GOD"];
        let ThreatLevel = THREATS[Game.Enemy[1]];
        let DEATHS = Game.Loses == 0 ? 1 : Game.Loses;
        let EXP_TEXT = APP.ScoreModeEnabled == 0 ? "<div class='pw inline alpha label'>" + fix(Math.floor(expGain), "auto") + " EXP</div>" : "";
        if (Game.Level >= GLOBALS.LOCATIONS[Game.Location][2] || Game.MissionStarted[0] && Game.Level >= GLOBALS.LOCATIONS[GLOBALS.MISSIONS[Game.MissionStarted[1]][8]][2]) EXP_TEXT = "";
        if (Game.config[2] == 0) {
            POPUP("<span class='pw alpha'> " + GLOBALS.ENEMIES_NAMES[Game.Location][Game.Enemy[0]] + " defeated !</span>",
                "You have defeated " + fix(Game.Defeated[Game.Enemy[1]], 1) + " <span class='Enemy" + Game.Enemy[1] + "'>" + ThreatLevel + "</span> enemies.<br>Current Ratio " + fix(Game.Wins / DEATHS, 4) + "<br><br>" + EXP_TEXT + LEVELUP + EMP + "<div class='pw inline green label'><i class='fas fa-dollar-sign pw green'></i>" + ToAddCash + "</div>" + LOOTS, 0);
        } else { hideRewards(); }
    }
}


var RESPAWN_TIMER = [];
const LoseFight = function () {
    UpdateCombat();
    Game.isInFight = 2;
    Game.Loses++;
    let THREATS = ["", "NORMAL", "ADVANCED", "SUPERIOR", "VETERAN", "ELITE", "BOSS", "GOD"];
    let DEATHS = Game.Loses == 0 ? 1 : Game.Loses;
    let EXP_DESC = APP.ScoreModeEnabled == 0 ? "You lost a part of your EXP.<br>" : "";
    Game.xp[0] = CalcEXP(Game.Level - 1);
    if (Game.MissionStarted[0] && GLOBALS.MISSIONS[Game.MissionStarted[1]][3] == 2) {
        Game.MissionStarted = [false, 0, 0, 0, 0];
        NOTICE("<span class='pw red'>MISSION FAILED</span>", "You failed to clear the fortress, now returning outside of it.");
        Game.Location = 0;
    } else {
        NOTICE(`You were defeated by the <span class="Enemy${Game.Enemy[1]}">${THREATS[Game.Enemy[1]]} ${GLOBALS.ENEMIES_NAMES[Game.Location][Game.Enemy[0]]}</span> !`,
            EXP_DESC + "Current Ratio <span class='pw red'>" + fix(Game.Wins / DEATHS, "auto"));
    }
    $("#BUTTONS_COMBAT").hide();
    $("#RESPAWNING").show();
    RESPAWN_TIMER = [5, setInterval(RESPAWN_TIMING, 1000)];
    RESPAWN_TIMING();
};

const RESPAWN_TIMING = function () {
    let TEXT = RESPAWN_TIMER[0] > 1 ? `Respawning in ${RESPAWN_TIMER[0]} seconds.` : `Respawning in ${RESPAWN_TIMER[0]} second.`;
    $("#RESPAWN_TEXT").html(`${TEXT}`);
    if (RESPAWN_TIMER[0] > 0) RESPAWN_TIMER[0]--;
    else {
        clearInterval(RESPAWN_TIMER[1]);
        $("#BUTTONS_COMBAT").show();
        $("#RESPAWNING").hide();
        hideRewards();
    }
};


function UpdateCombat() {
    let THREATS = ["", "NORMAL", "ADVANCED", "SUPERIOR", "VETERAN", "ELITE", "BOSS", "GOD"];
    var PLAYER_LIFE_COLOR = APP.CoreLife <= APP.CoreBaseLife / 2 ? "pw orange" : " pw green";
    if (APP.CoreLife <= Game.Enemy[3]) PLAYER_LIFE_COLOR = " pw red";
    var ENEMY_LIFE_COLOR = Game.Enemy[5] < Game.Enemy[4] / 2 ? "pw orange" : " pw green";
    if (Game.Enemy[5] < Game.Enemy[4] / 3) ENEMY_LIFE_COLOR = " pw red";
    let TLC = "<span class='Enemy" + Game.Enemy[1] + "'>";
    var LVLTEXT = APP.ScoreModeEnabled == 0 ? " Level " : " Score <i class='fad fa-dice-d20'></i>";
    var TIERTEXT = APP.ScoreModeEnabled == 0 ? Math.round(Game.Enemy[2]) : Math.floor(Game.Enemy[2] * 10);
    var EnemyName = Game.Enemy[1] > 5 ? GLOBALS.BOSSES_NAMES[Game.Location] : GLOBALS.ENEMIES_NAMES[Game.Location][Game.Enemy[0]];
    $("#EnemyTitle").html("" + TLC + THREATS[Game.Enemy[1]] + " " + EnemyName + "</span><span class='pw white inline label'>" + LVLTEXT + fix(TIERTEXT, 0) + "</span>");
    $("#EnemyPower").html("<i class='pw blue fas fa-sword'></i> " + fix(Game.Enemy[3], "auto"));
    $("#EnemyLife").html("<i class='pw red fas fa-heart'></i> <span class='" + ENEMY_LIFE_COLOR + "'>" + fix(Game.Enemy[5], "auto") + "</span>");
    $("#PlayerLife").html("<i class='pw red fas fa-heart'></i> <span class='" + PLAYER_LIFE_COLOR + "'>" + fix(APP.CoreLife, "auto") + "</span>/" + fix(APP.CoreBaseLife, "auto") + " ");
    $("#PlayerPower").html("<i class='pw blue fas fa-sword'></i> " + fix(APP.WeaponsPower, "auto") + " <span class='sub'>(<i class='pw yellow fas fa-swords'></i> " + fix(APP.SpecialPower, "auto") + ")</span>");
    $("#emp-btn").html("<i class='fas fa-swords'></i> " + fix(Game.Emp, 0) + " Special Attack");
    if (Game.Emp < 1 || Game.MissionStarted[0] && GLOBALS.MISSIONS[Game.MissionStarted[1]][3] == 2) $("#emp-btn").attr("class", "pw darkgrey button transparent");
    else $("#emp-btn").attr("class", "pw yellow button");
    $("#PLAYER_PERCENT").attr("style", "stroke-dashoffset: calc(455 - (455 * " + GetPlayerHPPercent() + ") / 100)");
    $("#ENEMY_PERCENT").attr("style", "stroke-dashoffset: calc(455 - (455 * " + GetEnemyHPPercent() + ") / 100)");
    $("#PlayerSprite+h2").html(fix(GetPlayerHPPercent(), 1) + "<span>%</span>");
    $("#EnemySprite+h2").html(fix(GetEnemyHPPercent(), 1) + "<span>%</span>");
    $("#PlayerSprite+h2").attr("class", PLAYER_LIFE_COLOR);
    $("#EnemySprite+h2").attr("class", ENEMY_LIFE_COLOR);
}

//ENEMY GENERATION FUNCTION
function GenEnemy() {
    let EnemyLevel = 1;
    let EnemyLifeMult = 1;
    let EnemyPowerMult = 1;
    var BasePower = APP.WeaponsPower / (APP.PowerMult + Game.DIMENSION_MULTIPLIERS[0]);

    let ENEMY_LIFE_MULT = [1.5, 2, 2.5, 3.5, 5, 6, 6.5];
    let ENEMY_POWER_MULT = [0.95, 1, 1, 1, 1, 1, 1];
    var ENEMY_POWER_MAXMULT = [1.1, 1.25, 1.35, 1.5, 1.75, 2, 2.5];
    if (APP.ScoreModeEnabled == 0) {
        if (Game.Level < 30) {
            ENEMY_LIFE_MULT = [1.5, 2, 2.5, 3.5, 5, 6, 6.5];
            ENEMY_POWER_MULT = [0.75, 0.85, 1, 1, 1, 1, 1];
            ENEMY_POWER_MAXMULT = [0.85, 1, 1, 1.10, 1.15, 1.15, 1.15];
        }
        if (GLOBALS.MISSIONS[Game.MissionStarted[1]][3] == 2) {
            ENEMY_LIFE_MULT = [0, 0, 6, 7, 8, 15, random(15, 20)];
            ENEMY_POWER_MULT = [1, 1, 1, 1, 1, 1, 1];
            ENEMY_POWER_MAXMULT = [1, 1, 1.1, 1.15, 1.2, 1.25, 1.5];
        }
    } else {
        ENEMY_LIFE_MULT = [2, 2.75, 3.5, 4, 6, 10, 15];
        ENEMY_POWER_MULT = [1, 1, 1, 1, 1, 1, 1];
        ENEMY_POWER_MAXMULT = [1, 1, 1.10, 1.15, 1.20, 1.25, 1.5];
    }

    TIER = APP.Ranking;
    EChance = random(0, 700);
    if (APP.ScoreModeEnabled == 1) EChance = random(300, 700);
    if (GLOBALS.MISSIONS[Game.MissionStarted[1]][3] == 2 && EChance < 600) EChance = 600;
    if (Game.isInFight == 0) {
        APP.CoreLife = APP.CoreBaseLife;
        $("#EnemyDesc").html("<br><br>");

        //CLASS NORMAL
        if (EChance >= 0 && EChance < 300) {
            Game.Enemy[1] = 1;
            EnemyLifeMult = ENEMY_LIFE_MULT[0];
            EnemyPowerMult = ENEMY_POWER_MULT[0];
            EnemyPowerMultMax = ENEMY_POWER_MAXMULT[0];
            if (APP.Ranking > 0) EnemyLevel = random((APP.Ranking * 0.85), APP.Ranking);
            if (APP.ScoreModeEnabled == 1) EnemyLevel = random(TIER - 5, TIER);
        }

        //CLASS ADVANCED
        if (EChance >= 300 && EChance < 450) {
            Game.Enemy[1] = 2;
            EnemyLifeMult = ENEMY_LIFE_MULT[1];
            EnemyPowerMult = ENEMY_POWER_MULT[1];
            EnemyPowerMultMax = ENEMY_POWER_MAXMULT[1];
            if (APP.Ranking > 0) EnemyLevel = APP.Ranking;
            if (APP.Ranking > 1) EnemyLevel = random((APP.Ranking * 0.95), APP.Ranking);
            if (APP.ScoreModeEnabled == 1) EnemyLevel = random(TIER - 2, TIER + 5);
        }

        //CLASS SUPERIOR
        if (EChance >= 450 && EChance < 600) {
            Game.Enemy[1] = 3;
            EnemyLifeMult = ENEMY_LIFE_MULT[2];
            EnemyPowerMult = ENEMY_POWER_MULT[2];
            EnemyPowerMultMax = ENEMY_POWER_MAXMULT[2];
            if (APP.Ranking > 0) EnemyLevel = APP.Ranking;
            if (APP.Ranking > 1) EnemyLevel = random(APP.Ranking, APP.Ranking + 1);
            if (APP.ScoreModeEnabled == 1) EnemyLevel = random(TIER - 1, TIER + 10);
        }

        //CLASS VETERAN
        if (EChance >= 600 && EChance < 650) {
            Game.Enemy[1] = 4;
            EnemyLifeMult = ENEMY_LIFE_MULT[3];
            EnemyPowerMult = ENEMY_POWER_MULT[3];
            EnemyPowerMultMax = ENEMY_POWER_MAXMULT[3];
            if (APP.Ranking > 0) EnemyLevel = APP.Ranking;
            if (APP.Ranking > 1) EnemyLevel = random(APP.Ranking + 1, APP.Ranking + 2);
            if (APP.ScoreModeEnabled == 1) EnemyLevel = random(TIER + 5, TIER + 15);
            if (Game.Level < 10) EnemyPowerMult = ENEMY_POWER_MULT[2];
        }

        //CLASS ELITE
        if (EChance >= 650) {
            Game.Enemy[1] = 5;
            EnemyLifeMult = ENEMY_LIFE_MULT[4];
            EnemyPowerMult = ENEMY_POWER_MULT[4];
            EnemyPowerMultMax = ENEMY_POWER_MAXMULT[4];
            if (APP.Ranking > 0) EnemyLevel = APP.Ranking;
            if (APP.Ranking > 1) EnemyLevel = random(APP.Ranking + 2, APP.Ranking + 4);
            if (APP.ScoreModeEnabled == 1) EnemyLevel = random(TIER + 15, TIER + 30);
            if (Game.Level < 10) EnemyPowerMult = ENEMY_POWER_MULT[2];
        }

        if (Game.MissionStarted[2] == GLOBALS.MISSIONS[Game.MissionStarted[1]][4] - 1) EChance = 700;

        //CLASS BOSS OR 1:4 GOD
        if (EChance >= 685 && EChance <= 700 && Game.MissionStarted[0]) {
            if (GLOBALS.MISSIONS[Game.MissionStarted[1]][3] == 2 || Game.MissionStarted[2] > GLOBALS.MISSIONS[Game.MissionStarted[1]][4] - 2) {
                Game.Enemy[1] = 6;
                EnemyLifeMult = ENEMY_LIFE_MULT[5];
                EnemyPowerMult = ENEMY_POWER_MULT[5];
                EnemyPowerMultMax = ENEMY_POWER_MAXMULT[5];
                if (APP.Ranking > 0) EnemyLevel = APP.Ranking + 1;
                if (APP.Ranking > 1) EnemyLevel = random(APP.Ranking + 4, APP.Ranking + 6);
                if (Game.Level < 10) EnemyPowerMult = ENEMY_POWER_MULT[2];
                if (APP.ScoreModeEnabled == 1) {
                    EnemyLevel = random(TIER + 20, TIER + 40);
                    randomluck = random(1, 5);
                    if (randomluck >= 4) {
                        Game.Enemy[1] = 7;
                        EnemyLifeMult = ENEMY_LIFE_MULT[6];
                        EnemyPowerMult = ENEMY_POWER_MULT[6];
                        EnemyPowerMultMax = ENEMY_POWER_MAXMULT[6];
                    }
                }
            }
        }
        if (EnemyLevel < 1) EnemyLevel = 1;
        if (APP.ScoreModeEnabled == 1) {
            EnemyLevel = EnemyLevel / 10;
            if (EnemyLevel > Game.Level + 20) EnemyLevel = Game.Level + 20;
        } else {
            EnemyLevel = EnemyLevel / 10;
            if (EnemyLevel < GLOBALS.LOCATIONS[Game.Location][1]) EnemyLevel = GLOBALS.LOCATIONS[Game.Location][1];
            if (EnemyLevel > GLOBALS.LOCATIONS[Game.Location][2]) EnemyLevel = GLOBALS.LOCATIONS[Game.Location][2];
        }
        Game.Enemy[2] = EnemyLevel;
        Game.isInFight = 1;
        Game.Enemy[3] = 0;
        Game.Enemy[4] = 0;
        if (Game.Armors[1][0] == 1) Game.Enemy[4] += Math.floor(random((EnemyLevel * 10) * (EnemyLifeMult * 0.5) + 100, (EnemyLevel * 10) * (EnemyLifeMult * 1) + 100));
        if (Game.Armors[2][0] == 1 && EnemyLevel > 9) Game.Enemy[4] += Math.floor(random((EnemyLevel * 10) * (EnemyLifeMult * 0.5) + 100, (EnemyLevel * 10) * (EnemyLifeMult * 1) + 100));
        if (Game.Armors[3][0] == 1 && EnemyLevel > 19) Game.Enemy[4] += Math.floor(random((EnemyLevel * 10) * (EnemyLifeMult * 0.5) + 100, (EnemyLevel * 10) * (EnemyLifeMult * 1) + 100));
        if (Game.Armors[4][0] == 1 && EnemyLevel > 29) Game.Enemy[4] += Math.floor(random((EnemyLevel * 10) * (EnemyLifeMult * 0.5) + 100, (EnemyLevel * 10) * (EnemyLifeMult * 1) + 100));
        Game.Enemy[3] = random(BasePower * EnemyPowerMult, BasePower * EnemyPowerMultMax);
        Game.Enemy[4] *= Game.DIMENSION_MULTIPLIERS[3];
        Game.Enemy[5] = Game.Enemy[4];
        if (Game.Enemy[1] >= 6) Game.Enemy[0] = "boss"; else Game.Enemy[0] = Math.floor(Math.random() * GLOBALS.ENEMIES_NAMES[Game.Location].length);
        if (typeof (GLOBALS.ENEMIES_NAMES[Game.Location][Game.Enemy[0]]) === 'undefined') Game.Enemy[0] = 0;
        $("#EnemyDamage").html("").hide();
        $("#PlayerDamage").html("").hide();
        UpdateGame();
    }
}