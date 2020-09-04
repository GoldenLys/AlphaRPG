/*

  TODO LIST :
    • Adding the RGB picker
    • Bug testing

*/

var APP = {
  WelcomeData: [1, "Neo", "None"],
  code: {},
  WeaponsPower: 10,
  SpecialPower: 20,
  Ranking: 0,
  PowerMult: 1,
  LifeMult: 1,
  lastCloudSave: 0,
  NewArmorID: 0,
  CoreLife: 100,
  CoreBaseLife: 100,
  Leader: 0,
  MaxLevel: 35,
  MaxScore: 35,
  TotalMissions: 0,
  LastMission: 0,
  ScoreModeEnabled: 0,
  LoggedIn: 0,
  ToDelete: "none",
  ToAdd: ["", ""],
  Email: "none",
  GOT_REWARDS: 0,
  LastId: 0,
  LeaderFilter: 0,
  LEADERBOARD: { PAGE: 0, RANGES: [1, 10] },
  isCovered: false,
  LastCover: 0,
  NextHeal: 5,
};

$(document).ready(function(){
  if (location.href.match(/(192.168.1.141).*/)) GLOBALS.VERSION = "dev";
  document.title = GLOBALS.NAME;
  $("#site-name").html(GLOBALS.NAME + "<span class='sub'>" + GLOBALS.VERSION + "</span>");
  if (location.href.match(/(goldenlys.github.io).*/)) window.oncontextmenu = (e) => { e.preventDefault(); };
  ResetTheme(0);
  if (localStorage.getItem("Alpha") != null) load();
  if (Game.username != "Default" && APP.LoggedIn == 0 && APP.Email != "DoNotLogin" && !$("#LOGIN-NOTICE").hasClass("active")) LOGIN("RETURN");
  if (Game.username != "Default") {
    $("#GAME").show();
    $("#INTRODUCTION").hide();
    $(".footer").show();
    UpdateGame();
    GenMissions();
  }
  Game.isInFight = 0;
  GenEnemy();
  setInterval(UpdateEngine, 1000);
  Game.xp[1] = CalcEXP(Game.Level);
  CompleteMission();
  DYNAMICS();
  filter(0);

  $('.pw.checkbox').each(function () {
    if ($(this).attr("data-id") < 5) {
      let TOGGLE = Game.config[$(this).attr("data-id")] == 1 ? "checked" : "unchecked";
      $(this).attr("data-check", TOGGLE);
    } else {
      let TOGGLE = Game.AutoRemove[$(this).attr("data-id") - 5] == 1 ? "checked" : "unchecked";
      $(this).attr("data-check", TOGGLE);
    }
  });
  $("#VERSION_TEXT").html("AlphaRPG v" + GLOBALS.VERSION);
  $("#VERSION_TEXT2").html("AlphaRPG v" + GLOBALS.VERSION);
  ResetLeaderBoard();
  CLOSE_MENUS();
  UpdateUI();
});

const UpdateEngine = function() {
  UpdateGame();
  Game.PlayTime++;
  if (Game.Level >= APP.MaxLevel && APP.LastMission >= APP.TotalMissions) APP.ScoreModeEnabled = 1; else APP.ScoreModeEnabled = 0;
  if (typeof (GLOBALS.ENEMIES_NAMES[Game.Location][Game.Enemy[0]]) === 'undefined') Game.Enemy[0] = 0;
  if (Game.Level == 1 && !Game.MissionStarted[0] && Game.MissionsCompleted[0] == 0 && Game.config[3] == 1 && $("#INTRODUCTION").is(":hidden") && !$("#LOGIN-NOTICE").hasClass("active")) mission(0);
  if (Game.isInFight == 1) $("#EnemySprite").html("<img class='pw medium image' src='images/Monsters/" + Game.Location + "-" + Game.Enemy[0] + ".png'>");
  if (APP.CoreLife > APP.CoreBaseLife) {
    APP.CoreLife = APP.CoreBaseLife;
    UpdateUI();
  }
  if (Game.isInFight != 2 && APP.CoreLife == null || Game.Enemy[5] == null || Game.Enemy[5] == 0) {
    Game.isInFight = 0;
    UpdateGame();
  }
  if (Game.MissionStarted[0] && GLOBALS.MISSIONS[Game.MissionStarted[1]][3] != 2 && Game.Level > GLOBALS.LOCATIONS[GLOBALS.MISSIONS[Game.MissionStarted[1]][8]][2]) {
    Game.Level = GLOBALS.LOCATIONS[GLOBALS.MISSIONS[Game.MissionStarted[1]][8]][2];
    UpdateGame();
  }
  if (APP.lastCloudSave < 180) APP.lastCloudSave++; else SendStats();
  if (Game.LastEscape > 0) { Game.LastEscape--; $("#NextRetreat").html(`Next retreat in ${toHHMMSS(Game.LastEscape)}.`); }
  else { $("#NextRetreat").html(""); }

  if (APP.LastCover > 0) { $("#NextCover").html(`Next cover in ${toHHMMSS(APP.LastCover)}.`); APP.LastCover--; }
  else { $("#NextCover").html(""); }
  if (Game.xp[0] < 0) Game.xp[0] = 0;
  for (let UPC = 0; UPC < 4; UPC++) {
    if (typeof (Game.MaxUPC[UPC]) === 'undefined') Game.MaxUPC[UPC] = 0;
  }
  if (Game.username == null || Game.username == "" || Game.username == " " || Game.username == "_" || Game.username.length < 3) {
    localStorage.clear();
    Backup = "Default";
    Game.username = Backup;
  }
  else { Game.username = Game.username.replace(/[^a-zA-Z0-9]/g, '_'); }
  if (Backup != "Default" && Backup != Game.username) Game.username = Backup;
  if (typeof (Game.xp[2]) === 'undefined') Game.xp[2] = 1;
  let LEVEL = APP.ScoreModeEnabled == 0 ? "Level " + fix(Game.Level, 0) : "Score <i class='fad fa-dice-d20'></i> " + fix(APP.Ranking, 0);
  let SCORE = APP.ScoreModeEnabled == 0 ? "Level " + fix(APP.Ranking / 10, 0) : "Score <i class='fad fa-dice-d20'></i>" + fix(APP.Ranking, 0);
  if (Game.Level < 1) {
    Game.Level = 1;
    Game.xp[0] = 0;
  }
  if (APP.ScoreModeEnabled == 0 && Game.Level < APP.MaxLevel) {
    if (Game.xp[0] >= Game.xp[1]) {
      Game.Level++;
      Game.xp[1] = CalcEXP(Game.Level);
    } else {
      if (Game.xp[0] > Game.xp[1] && Game.Level == GLOBALS.LOCATIONS[Game.Location][2]) { Game.xp[0] = CalcEXP(Game.Level - 1); }
      if (Game.xp[0] < CalcEXP(Game.Level - 1) && Game.Level > 1) { Game.xp[0] = CalcEXP(Game.Level - 1); }
    }
  }
  if (Game.Level > APP.MaxLevel) {
    Game.Level = APP.MaxLevel;
    if (APP.ScoreModeEnabled == 0 && Game.Level > GLOBALS.MISSIONS[APP.LastMission][2]) {
      Game.Level = GLOBALS.MISSIONS[APP.LastMission][2];
      if (Game.Level > GLOBALS.LOCATIONS[Game.Location][2]) Game.Level = GLOBALS.LOCATIONS[Game.Location][2];
    }
  }
  if (Game.Emp > 50) Game.Emp = 50;
  Game.Shards = Math.round(Game.Shards);
  let ONLINEICON = "<i class='pw red far fa-circle'></i>";
  if (Game.username != "Default" && location.href.match(/(goldenlys.github.io).*/) && Game.username != "Default" && Game.username != null && APP.LoggedIn == 1 && APP.Email != "none") ONLINEICON = "<i class='pw alpha fas fa-circle'></i>";
  $("#Equipment-Title").html("Equipment " + SCORE);
  $("#PlayerID").html("<div class='pw alpha'>" + ONLINEICON + Game.username + " <span class='pw white inline label'>" + LEVEL + "</span></div>");
  $("#PlayerSprite").html("<img class='pw small image' src='images/avatars/avatar" + Game.Avatar + ".jpg'>");
  $("#avatar2").attr("src", `images/avatars/avatar${Game.Avatar}.jpg`);
  $("#avatar3").attr("src", `images/avatars/avatar${Game.Avatar}.jpg`);
  if (APP.ScoreModeEnabled == 0) {
    for (let ARMOR in Game.Armors) { if (Game.Armors[ARMOR] > Game.Level) { console.log("ERROR 001"); ErrorArmor(ARMOR); } }
    if (Game.Weapons.Main[3] > Game.Level) { console.log("ERROR 002"); ErrorArmor(5); }
    if (Game.Weapons.Special[3] > Game.Level) { console.log("ERROR 003"); ErrorArmor(6); }
  } else {
    for (let ARMOR in Game.Armors) { if (Game.Armors[ARMOR] > APP.MaxScore) { console.log("ERROR 004"); ErrorArmor(ARMOR); } }
    if (Game.Weapons.Main[3] > APP.MaxScore) { console.log("ERROR 005"); ErrorArmor(5); }
    if (Game.Weapons.Special[3] > APP.MaxScore) {console.log("ERROR 006"); ErrorArmor(6); }
  }
  if (Game.Level >= 10) Game.Armors[2][0] = true; else Game.Armors[2][0] = false;
  if (Game.Level >= 20) Game.Armors[3][0] = true; else Game.Armors[3][0] = false;
  if (Game.Level >= 30) Game.Armors[4][0] = true; else Game.Armors[4][0] = false;
  if (Game.isInFight == 1 && APP.CoreLife <= 0) LoseFight(); else if (Game.isInFight == 1 && Game.Enemy[5] <= 0) WinFight();
  for (var I in Game.inventory) {
    if (I > Game.MaxInv) Game.inventory.splice(I, 1);
    else if (APP.ScoreModeEnabled == 0) {
      if (Game.inventory[I].level > Game.Level) Game.inventory.splice(I, 1);
    }
  }
  for (var IV2 in Game.inventory) {
    if (typeof (Game.inventory[IV2]) !== 'undefined' && Game.inventory[I].id == 1 || Game.inventory[I].id == 3) {
      if (Game.inventory[I].life == Game.inventory[IV2].life && Game.inventory[I].power == Game.inventory[IV2].power && IV2 != I && Game.inventory[I].name == Game.inventory[IV2].name && Game.inventory[I].id != 3) {
        Game.inventory.splice(I, 1);
      }
    }
  }
};

const UpdateGame = function() {
  let counter = 0;
  for (var M in GLOBALS.MISSIONS) { if (GLOBALS.MISSIONS[M][3] != 2) counter++; }
  APP.TotalMissions = counter;
  if (Game.Simulation > 50) Game.Simulation = 50;
  let divisor = 0;
  APP.MaxLevel = 35;
  APP.MaxScore = (APP.MaxLevel + (Game.Simulation * 5) - 5);
  for (var D = 1; D < 7; D++) {
    if (Game.Defeated[D] == null) Game.Defeated[D] = 0;
  }
  Game.DIMENSION_MULTIPLIERS[0] = 0;
  Game.DIMENSION_MULTIPLIERS[1] = 0;
  for (let R in Game.RELICS) {
    if (Game.RELICS[R][1] == 1) { Game.DIMENSION_MULTIPLIERS[0] += Game.RELICS[R][2]; }
    else { Game.DIMENSION_MULTIPLIERS[0] += 0; }
    if (Game.RELICS[R][1] == 2) { Game.DIMENSION_MULTIPLIERS[1] += Game.RELICS[R][2]; }
    else { Game.DIMENSION_MULTIPLIERS[1] += 0; }
    if (Game.RELICS[R][1] == 3) { APP.MaxScore += (Game.RELICS[R][2] / 10); }
  }
  if (Game.isInFight == 1 && Game.class == "none") {
    Game.username = "Default";
    Backup = "Default";
    ResetTheme(1);
    save();
  }
  Game.DIMENSION_MULTIPLIERS[2] = (Game.Simulation * 0.03) - 0.03; //EXPMULT
  Game.DIMENSION_MULTIPLIERS[3] = (Game.Simulation * 0.05) + 0.95; //DIFFICULTYMULT
  Backup = Game.username;
  Game.xp[2] = Game.Upgrades[0] * 0.01 + 1;
  APP.PowerMult = Game.Upgrades[1] * 0.01 + 1;
  APP.LifeMult = Game.Upgrades[2] * 0.01 + 1;
  Game.MaxInv = (Game.Simulation * 2) + 18 + (Game.Upgrades[3] * 1);
  if (typeof (Game.MissionStarted[4]) === 'undefined') Game.MissionStarted[4] = 0;
  if (Game.isInFight == 0) { APP.CoreLife = APP.CoreBaseLife; GenEnemy(); }
  APP.CoreBaseLife = 0;
  APP.Ranking = 0;
  APP.Ranking += Game.Weapons.Main[3];
  APP.Ranking += Game.Weapons.Special[3];
  divisor = 2;
  for (let armor = 1; armor < 5; armor++) {
    if (Game.Armors[armor][0]) {
      APP.CoreBaseLife += Game.Armors[armor][3];
      APP.Ranking += Game.Armors[armor][4];
      divisor++;
      if (typeof (Game.Armors[armor][5]) === 'undefined') Game.Armors[armor][5] = 0;
    }
  }
  if (LATEST_LOCATION_UNLOCKED() !== "none") if (APP.ScoreModeEnabled == 0 && !Game.MissionStarted[0] && Game.Level >= GLOBALS.LOCATIONS[LATEST_LOCATION_UNLOCKED()][2] && Game.username != "Default" && Game.isInFight == 1) {
    for (M in GLOBALS.MISSIONS) {
      if (Game.MissionsCompleted[M] == 0 && Game.MissionsCompleted[GLOBALS.MISSIONS[M][9]] == 1 && GLOBALS.MISSIONS[M][3] != 2 && Game.Level >= GLOBALS.MISSIONS[M][2]) {
        GenMissions();
        if (Game.config[3] == 1 && !$("#POPUP").hasClass("active")) mission(M);
      }
    }
  }
  APP.CoreBaseLife = Math.round(APP.CoreBaseLife * (APP.LifeMult + Game.DIMENSION_MULTIPLIERS[1]));
  APP.WeaponsPower = Math.round(Game.Weapons.Main[4] * (APP.PowerMult + Game.DIMENSION_MULTIPLIERS[0]));
  APP.SpecialPower = Math.round((Game.Weapons.Main[4] + Game.Weapons.Special[4]) * (APP.PowerMult + Game.DIMENSION_MULTIPLIERS[0]));
  APP.Ranking = Math.floor((APP.Ranking / divisor) * 10);
  for (var M2 in GLOBALS.MISSIONS) { if (Game.MissionsCompleted[M2] == null) Game.MissionsCompleted[M2] = 0; }
  if (Game.MissionStarted[0]) { Game.Location = GLOBALS.MISSIONS[Game.MissionStarted[1]][8]; }
  for (var IV in Game.inventory) {
    if (typeof Game.inventory[IV].name === "undefined" || typeof Game.inventory[IV].class === "undefined"|| typeof Game.inventory[IV].id === "undefined" || typeof Game.inventory[IV].object === "undefined") RemoveItem(IV);
    if (Game.Level < 10 && Game.inventory[IV].class == 'Uncommon')  RemoveItem(IV); 
    if (Game.Level < 15 && Game.inventory[IV].class == 'Rare')  RemoveItem(IV); 
    if (Game.Level < 20 && Game.inventory[IV].class == 'Epic') RemoveItem(IV); 
    if (Game.Level < 30 && Game.inventory[IV].class == 'Exotic' || Game.inventory[IV].class == 'Divine') RemoveItem(IV); 
    if (Game.inventory[IV].id == 0) RemoveItem(IV);
    if (IV >= Game.MaxInv) RemoveItem(IV);
    if (typeof Game.inventory[IV] !== 'undefined') {
      if (Game.AutoRemove[0] == 1 && Game.inventory[IV].class == "Normal") RemoveItem(IV);
      else if (Game.AutoRemove[1] == 1 && Game.inventory[IV].class == "Common") RemoveItem(IV);
      else if (Game.AutoRemove[2] == 1 && Game.inventory[IV].class == "Uncommon") RemoveItem(IV);
      else if (Game.AutoRemove[3] == 1 && Game.inventory[IV].class == "Rare") RemoveItem(IV);
      else if (Game.AutoRemove[4] == 1 && Game.inventory[IV].class == "Epic") RemoveItem(IV);
      else if (Game.AutoRemove[5] == 1 && Game.inventory[IV].class == "Exotic") RemoveItem(IV);
    }
  }
  if (!Game.MissionStarted[0]) {
    if (Game.Location == 11 || Game.Location == 17) { Game.Location--; }
  }
  UpdateUI();
  save();
};

const UpdateUI = function() {
  if (((Game.xp[2] + Game.DIMENSION_MULTIPLIERS[2]) - Math.floor(Game.xp[2] + Game.DIMENSION_MULTIPLIERS[2])) < 1) $("#XPMULTVAL").html("+" + Game.Upgrades[0] + "%"); else $("#XPMULTVAL").html("+" + Game.Upgrades[0] + "%");
  if (((APP.PowerMult + Game.DIMENSION_MULTIPLIERS[0]) - Math.floor(APP.PowerMult + Game.DIMENSION_MULTIPLIERS[0])) < 1) $("#POWERMULTVAL").html("+" + Game.Upgrades[1] + "%"); else $("#POWERMULTVAL").html("+" + Game.Upgrades[1] + "%");
  if (((APP.LifeMult + Game.DIMENSION_MULTIPLIERS[1]) - Math.floor(APP.LifeMult + Game.DIMENSION_MULTIPLIERS[1])) < 1) $("#LIFEMULTVAL").html("+" + Game.Upgrades[2] + "%"); else $("#LIFEMULTVAL").html("+" + Game.Upgrades[2] + "%");
  $("#INVUPGVAL").html(Game.MaxInv);
  $("#ShardsNumber").html("<i class='pw blue fal fa-dna'></i>" + fix(Game.Shards, "auto") + "</span> Dimensional Fragments");
  if (Game.username == "Default") {
    $("#menu").hide();
    $("#GAME").hide();
    $("#INTRODUCTION").show();
    $(".footer").hide();
    Game.isInFight = 3;
  }
  $("#PlayerXP .progress-bar").attr("style", "max-width:" + GetEXPPercent() + "%;");
  var WTText = Game.Simulation > 1 ? "Dimension <i class='globe icon'></i> " + Game.Simulation + "<br>" : "";
  $("#LABEL_SHARDS").html(fix(Game.Shards, "auto"));
  if (APP.ScoreModeEnabled == 0) {
    $("#DimensionID").html(WTText);
    $("#PlayerXP").show();
    $("#LABEL_EXP").html("<span class='pw alpha bold'>" + fix(Game.xp[0], "auto") + "</span>/" + fix(Game.xp[1], "auto") + " EXP");
  } else $("#DimensionID").html(WTText);
  if (Game.Level >= APP.MaxLevel) {
    $("#PlayerXP").hide();
    $("#LABEL_EXP").html("Max Level");
  }
  if (Game.Level >= APP.MaxLevel && APP.Ranking >= (((30 + (Game.Simulation * 5)) * 10) - 5) && APP.LastMission >= APP.TotalMissions) {
    $("#WTBTN").show();
    $("#WTUNLOCK").html("<span class='pw alpha'>Dimensional Rift <i class='globe icon'></i>" + (Game.Simulation + 1) + " is opened.");
  } else {
    $("#WTBTN").hide();
    $("#WTUNLOCK").html("");
  }
  var shards = Game.Level < APP.MaxLevel ? "0" : Math.round(APP.Ranking / 50 - 6);
  var completedstory = APP.LastMission == APP.TotalMissions ? "<span class='pw alpha'>Yes</span>" : "<span class='pw red'>Not Yet</span>";
  $("#WTShards").html("Score Required : <span class='pw alpha'><i class='fad fa-dice-d20'></i>" + (((30 + (Game.Simulation * 5)) * 10) - 5) + "</span><br>Story completed : " + completedstory + "<br>Fragments reward : <span class='pw alpha'><i class='fal fa-dna'></i>" + shards + "</span>");
  $("#CurrWT").html("Current Dimension : <span class='pw alpha'><i class='globe icon'></i>" + Game.Simulation + "</span>");
  var XPMCOL = GetMultPrice(0) > Game.Shards ? "pw red" : "green";
  var POWMCOL = GetMultPrice(1) > Game.Shards ? "pw red" : "green";
  var LIFEMCOL = GetMultPrice(2) > Game.Shards ? "pw red" : "green";
  var INVCOL = GetMultPrice(3) > Game.Shards ? "pw red" : "green";
  let XP_UPG_TEXT = GetMultPrice(0) === Infinity ? "MAXED OUT" : `<i class='fal fa-dna'></i>${GetMultPrice(0)}`;
  let POWER_UPG_TEXT = GetMultPrice(1) === Infinity ? "MAXED OUT" : `<i class='fal fa-dna'></i>${GetMultPrice(1)}`;
  let LIFE_UPG_TEXT = GetMultPrice(2) === Infinity ? "MAXED OUT" : `<i class='fal fa-dna'></i>${GetMultPrice(2)}`;
  let INV_UPG_TEXT = GetMultPrice(3) === Infinity ? "MAXED OUT" : `<i class='fal fa-dna'></i>${GetMultPrice(3)}`;
  $("#XPMULTPRICE").html("<span class='" + XPMCOL + "'>" + XP_UPG_TEXT + "</span>");
  $("#POWERMULTPRICE").html("<span class='" + POWMCOL + "'>" + POWER_UPG_TEXT + "</span>");
  $("#LIFEMULTPRICE").html("<span class='" + LIFEMCOL + "'>" + LIFE_UPG_TEXT + "</span>");
  $("#INVUPGPRICE").html("<span class='" + INVCOL + "'>" + INV_UPG_TEXT + "</span>");
  $("#TOPNEXT").html((APP.LEADERBOARD.PAGE + 1) + " <i class='large arrow alternate circle right outline icon'></i>");
  $("#TOPPREVIOUS").html("<i class='large arrow alternate circle left outline icon'></i> " + (APP.LEADERBOARD.PAGE - 1));
  if (APP.LEADERBOARD.RANGES[1] + 1 <= APP.LastId) $("#TOPNEXT").attr('class', 'pw button'); else $("#TOPNEXT").attr('class', 'pw button disabled');
  if (APP.LEADERBOARD.PAGE == 1) $("#TOPPREVIOUS").attr('class', 'pw button disabled'); else $("#TOPPREVIOUS").attr('class', 'pw button');
  if (((Game.Level - 5) * 10) >= APP.Ranking) $("#LowScore").html("Using low level armor, upgrade your equipment."); else $("#LowScore").html("");
  var CompletedMissions = 0;
  for (var M in GLOBALS.MISSIONS) if (GLOBALS.MISSIONS[M][3] != 2 && Game.MissionsCompleted[M] == 1) CompletedMissions++;
  if (Game.isInFight != 2 || Game.isInFight != 3) APP.LastMission = CompletedMissions;
  if (Game.MissionStarted[0]) {
    if (GLOBALS.MISSIONS[Game.MissionStarted[1]][3] == 1) $("#PLAYER-ETA").html("<span class='bold'>Mission</span>Defeat " + (GLOBALS.MISSIONS[Game.MissionStarted[1]][4] - Game.MissionStarted[2]) + " enemies in <span class='bold'>" + GLOBALS.LOCATIONS[GLOBALS.MISSIONS[Game.MissionStarted[1]][8]][0] + "</span>.");
    if (GLOBALS.MISSIONS[Game.MissionStarted[1]][3] == 2) $("#PLAYER-ETA").html("<span class='bold'>Fortress</span>Clear " + GLOBALS.LOCATIONS[GLOBALS.MISSIONS[Game.MissionStarted[1]][8]][0] + " (" + (GLOBALS.MISSIONS[Game.MissionStarted[1]][4] - Game.MissionStarted[2]) + " left).");
  } else {
    $("#PLAYER-ETA").html("<span class='bold'>Exploration</span>of " + GLOBALS.LOCATIONS[Game.Location][0]);
  }
  if ($('#DIV-COMBAT').is(":visible")) $("#DIV-REWARDS").hide();
  $("#CloudTimer").html("Last cloud sync " + toHHMMSS(APP.lastCloudSave) + " ago, as <span class='pw alpha'>" + Game.username + "</span>.");
  $("#LABEL_INVENTORY").html("<i class='fas fa-sack'></i> " + (Game.inventory.length) + "/" + Game.MaxInv);
  $("#LABEL_CASH").html(fix(Game.Cash, 1));
  $("#mcount").html("Missions completed (" + CompletedMissions + "/" + APP.TotalMissions + ")");
  if (Game.Level >= GLOBALS.LOCATIONS[Game.Location][2] && APP.ScoreModeEnabled == 0 && !Game.MissionStarted[0]) $("#MaxGLOBALS.LOCATIONSLVL").html("You\'ve reached the maximum level for this area, check the available missions."); else $("#MaxGLOBALS.LOCATIONSLVL").html("");
  if ($('#DIV-INVENTORY').is(":visible")) {
    $("#DIV-REWARDS").hide();
    $("#DIV-COMBAT").hide();
  }
  if (Game.isInFight == 1) {
    $("#CLOSE_REWARDS").hide();
    $("#BUTTONS_COMBAT").show();
    UpdateCombat();
  }
  if ($('#DIV-STATS').is(":visible")) UPDATE_STATS();
  GenArmors();
  GenWeapons();
  ResetTheme(2);
};
