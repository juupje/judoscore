var ippons = []; // holds ippon points
var wazaris = []; // holds wazari points
var yukos = []; // holds wazari points
var shidos = []; // holds shido points
var fightActive; // true, if fight clock is running
var osaeActive; // true, if osaekomi clock is running
var goldenScoreActive; // true, if golden score mode is active
var bellActive; // true, during playback of bell sound
var fightTimeSec; // fight clock (sec)
var osaeTimeSec; // osaekomi clock (sec)

var matConf; // mat number 
var fightTimeSecConf; // default fight time limit
var osaeTimeSecConf; // default osaekomi time limit
var goldenScoreTimeSecConf; // golden score time limit (0=endless with incrementing fight clock)
var bellNumConf; // index of bell sound type

var updateTimer; // timer for updating clocks

var ippon_divs = [];
var wazari_divs = [];
var yuko_divs = [];
var shido_divs = [];
var fightTime_div;
var osaeTime_div;
var fightTime_startstop;
var oaseTime_startstop;

var goldenScore_div;
var menuBtn_div;
var menu_div;
var menuBtnClose;

var spectatorscreenBtn_div;

var sound_audio = [];

var shidoImgs = ["resources/shido0.png","resources/shido1.png", "resources/shido2.png", "resources/shido3.png"];

var spectatorScreen = null;
    
/*
* Start fight counter
*/
function hajime() {
    if(fightActive)
        return;
    
    if(fightTimeSec == 0 && !isEndlessGoldenScore())
        return;
    
    updateTimer = window.setInterval(updateTimes, 1000);
    fightActive = true;
    
    drawTimes();
}

/*
* Stop fight counter
*/
function mate() {
    if(updateTimer)
        clearInterval(updateTimer);
    if(fightActive == false)
        return;
    fightActive = false;
    
    drawTimes();
}

/*
* Start or stop fight counter
*/
function hajimeOrMate() {
    if(fightActive)
        mate();
    else
        hajime();
}

/*
* Start Osaekomi timer
*/
function osaekomi() {
    osaeTimeSec = 0;
    osaeActive = true;
    
    drawTimes();
}

/*
* Stop Osaekomi timer
*/
function toketa() {
    osaeActive = false;
    
    drawTimes();
}

/*
* Toggle Osaekomi timer
*/
function osaekomiOrToketa() {
    if(osaeActive)
        toketa();
    else
        osaekomi();
}

/*
* Fight time limit hit
*/
function fightTimeOver() {
    mate();
    bell();
}

/*
* Osaekomi time limit hit
*/
function osaeTimeOver() {
    toketa();
    mate();
    bell();
}

/*
* Toggle golden score mode
*/
function goldenScore() {
    
    // safety check
    if(fightActive && !confirm("Start Golden Score?")) return;
    
    goldenScoreActive = !goldenScoreActive;
    
    if(goldenScoreActive) {
        if(goldenScoreTimeSecConf > 0)
            fightTimeSec = goldenScoreTimeSecConf;
        else
            fightTimeSec = 0;
    }
    
    drawTimes();
}

/*
* Play selected bell sound
*/
function bell() {
    if(bellActive == false && bellNumConf > 0) {
        bellActive = true;
        sound_audio[bellNumConf].play();
        bellActive = false;
    }
        
}

/*
* Increment scores
* called by user event
*/
function increment(color, which) {
    var whiteBlue = (color == "white") ? 0 : 1;
    switch(which) {
        case "ippon":
            ippons[whiteBlue] = Math.min(ippons[whiteBlue] + 1, 9);
            break;
        case "wazari":
            wazaris[whiteBlue] = Math.min(wazaris[whiteBlue] + 1, 9);
            break;
        case "yuko":
            yukos[whiteBlue] = Math.min(yukos[whiteBlue] + 1, 99);
            break;
        case "shido":
            shidos[whiteBlue] = Math.min(shidos[whiteBlue] + 1, 3);
            break;
    }
    drawPoints();
}

/*
* Decrement scores
* called by user event
*/
function decrement(color, which) {
    var whiteBlue = (color == "white") ? 0 : 1;
    switch(which) {
        case "ippon":
            ippons[whiteBlue] = Math.max(ippons[whiteBlue] - 1, 0);
            break;
        case "wazari":
            wazaris[whiteBlue] = Math.max(wazaris[whiteBlue] - 1, 0);
            break;
        case "yuko":
            yukos[whiteBlue] = Math.max(yukos[whiteBlue] - 1, 0);
            break;
        case "shido":
            shidos[whiteBlue] = Math.max(shidos[whiteBlue] - 1, 0);
            break;
    }
    drawPoints(); 
}

/*
* Set ippon
* called by user event
*/
function ippon(e) {     
    var whiteBlue = (this.id == "white_ippon") ? 0 : 1;
    
    switch(e.button) {
    case 0: // left mouse btn
        ippons[whiteBlue] = Math.min(ippons[whiteBlue] + 1, 9);
    break;
    
    case 2: // right mouse btn
        ippons[whiteBlue] = Math.max(ippons[whiteBlue] - 1, 0);               
    break;
    }
    drawPoints();
}

/*
* Set wazari
* called by user event
*/
function wazari(e) {
    var whiteBlue = (this.id == "white_wazari") ? 0 : 1;
    
    switch(e.button) {
        case 0: // left mouse btn
            wazaris[whiteBlue] = Math.min(wazaris[whiteBlue] + 1, 9);
        break;
        
        case 2: // right mouse btn
            wazaris[whiteBlue] = Math.max(wazaris[whiteBlue] - 1, 0);               
        break;
    }
    drawPoints();
}

/*
* Set yuko
* called by user event
*/
function yuko(e) {
    var whiteBlue = (this.id == "white_yuko") ? 0 : 1;
    
    switch(e.button) {
        case 0: // left mouse btn
            yukos[whiteBlue] = Math.min(yukos[whiteBlue] + 1, 99);
        break;
        
        case 2: // right mouse btn
        yukos[whiteBlue] = Math.max(yukos[whiteBlue] - 1, 0);               
        break;
    }
    drawPoints();
}

/*
* Set shido
* called by user event
*/
function shido(e) {
    var whiteBlue = (this.id == "white_shido") ? 0 : 1;
    
    switch(e.button) {
        case 0: // left mouse btn
            shidos[whiteBlue] = Math.min(shidos[whiteBlue] + 1, 3);
        break;
        
        case 2: // right mouse btn
            shidos[whiteBlue] = Math.max(shidos[whiteBlue] - 1, 0);               
        break;
    }
    drawPoints();
}

/*
* Special golden score mode
*/
function isEndlessGoldenScore() {
    return (goldenScoreActive && goldenScoreTimeSecConf == 0);
}

/*
* Periodic function to update displayed times
*/
function updateTimes() {
    if(isEndlessGoldenScore()) // increment fight time
        fightTimeSec = Math.max(fightTimeSec + 1, 0);
    else // decrement fight time
        fightTimeSec = fightTimeSec = Math.max(fightTimeSec - 1, 0);
        
    if(osaeActive) // increment osaekomi time
        osaeTimeSec++;
    
    drawTimes();
    
    if(osaeActive && osaeTimeSec >= osaeTimeSecConf) 
        osaeTimeOver();
    
    if(fightActive && !isEndlessGoldenScore() && fightTimeSec == 0) 
        fightTimeOver();
}

/*
* Refresh displayed points and times
*/
function draw() {
    drawPoints();
    drawTimes();
}

/*
* Refresh displayed points
*/
function drawPoints() {
    transmitPoints();
    for(var i = 0; i < 2; i++) {
        ippon_divs[i].innerHTML = ippons[i];
        wazari_divs[i].innerHTML = wazaris[i];
        yuko_divs[i].innerHTML = yukos[i];
        shido_divs[i].src = shidoImgs[shidos[i]];
    }
}

/*
* Refresh displayed times
*/
function drawTimes() {
    transmitTimes();
    fightTime_div.style.color = (fightActive) ? "#00cc00" : "#cc0000";
    osaeTime_div.style.color = (osaeActive) ? "#ff88ff" : "#8888ff";
    fightTime_startstop.innerHTML = fightActive ? "&#9208;" : "&#9205;";
    oaseTime_startstop.innerHTML = osaeActive ? "&#9208;" : "&#9205;";

    fightTime_div.innerText = parseInt(fightTimeSec/60) + ":" + ("0" + (fightTimeSec%60)).slice(-2);
    osaeTime_div.innerHTML = osaeTimeSec;
    
    if(goldenScoreActive)
        goldenScore_div.style.display = "block";
    else
        goldenScore_div.style.display = "none";
}

function transmitTimes() {
    if(spectatorScreen) {
        message = {"type": "time", "fighttime": fightTimeSec, "fightActive": fightActive,
                "osaeTime": osaeTimeSec, "osaeActive": osaeActive,
                "goldenScoreActive": goldenScoreActive};
        spectatorScreen.postMessage(message, '*');
    }
}

function transmitPoints() {
    if(spectatorScreen) {
        message = {"type": "points", "ippons": ippons, "wazaris": wazaris, "yukos": yukos,
                   "shidos": shidos};
        spectatorScreen.postMessage(message, '*');
    }
}

function transmitNames() {
    message = createFightInfo();
    message["type"] = "config";
    console.log(message);
    spectatorScreen.postMessage(message, '*');
}

/*
* Init local variables and event handlers
*/
function init() {
    // add event handler
    ippon_divs[0] = document.getElementById("white_ippon");
    ippon_divs[1] = document.getElementById("blue_ippon");
    ippon_divs[0].addEventListener("mousedown", ippon);
    ippon_divs[1].addEventListener("mousedown", ippon);
    
    wazari_divs[0] = document.getElementById("white_wazari");
    wazari_divs[1] = document.getElementById("blue_wazari");
    wazari_divs[0].addEventListener("mousedown", wazari);
    wazari_divs[1].addEventListener("mousedown", wazari);

    yuko_divs[0] = document.getElementById("white_yuko");
    yuko_divs[1] = document.getElementById("blue_yuko");
    yuko_divs[0].addEventListener("mousedown", yuko);
    yuko_divs[1].addEventListener("mousedown", yuko);
    
    shido_divs[0] = document.getElementById("white_shido");
    shido_divs[1] = document.getElementById("blue_shido");
    shido_divs[0].addEventListener("mousedown", shido);
    shido_divs[1].addEventListener("mousedown", shido);
    
    fightTime_div = document.getElementById("fighttime");
    fightTime_div.addEventListener("click", hajimeOrMate);
    fightTime_div.addEventListener("dblclick", resetFightTime);
    osaeTime_div = document.getElementById("osaetime");
    osaeTime_div.addEventListener("click", osaekomiOrToketa);
    osaeTime_div.addEventListener("dblclick", resetOsaeTime);
    
    fightTime_startstop = document.getElementById("fight_startstop");
    oaseTime_startstop = document.getElementById("osae_startstop");

    goldenScore_div = document.getElementById("goldenscore");
    
    menuBtn_div = document.getElementById("menubtn");
    menuBtn_div.addEventListener("click", toggleMenu);
    menu_div = document.getElementById("menu");
    menuBtnClose =  document.getElementById("menubtnclose");
    menuBtnClose.addEventListener("click", toggleMenu);

    spectatorscreenBtn_div = document.getElementById("spectatorviewbtn");
    spectatorscreenBtn_div.addEventListener("click", toggleSpectatorScreen);
    
    for(const x of ["whitename_input", "bluename_input", "groupname_input", "round_input"]) {
        document.getElementById(x).addEventListener("change", transmitNames);
    }

    sound_audio[0] = null;
    sound_audio[1] = document.getElementById("sound1");
    sound_audio[2] = document.getElementById("sound2");
    sound_audio[3] = document.getElementById("sound3");
    sound_audio[4] = document.getElementById("sound4");
    
    window.addEventListener("message", receiveMessage, false);

    reset();
}

function receiveMessage(event) {
    if(event.data == "requestConfig") {
        if(spectatorScreen) {
            transmitNames();
            transmitPoints();
            transmitTimes();
        }
    }
}

/*
* Reset score panel, times and tries to load fight info 
*/
function reset() {
    ippons = [0,0];
    wazaris = [0,0];
    yukos = [0,0];
    shidos = [0,0];
    fightActive = false;
    osaeActive = false;
    goldenScoreActive = false;
    bellActive = false;
            
    loadConfig();
    
    resetFightTime();
    resetOsaeTime();
    
    draw();
}

/*
* Reset fight time
*/
function resetFightTime() {
    fightTimeSec = fightTimeSecConf;
    mate();
}

/*
* Reset Osaekomi time
*/
function resetOsaeTime() {
    osaeTimeSec = 0;
    toketa();
}

function toggleSpectatorScreen() {
    if(spectatorScreen == null) {
        spectatorScreen = window.open("spectator.html", "Spectator Window", "width=800,height=600");
        spectatorscreenBtn_div.innerHTML = "&#9632;";
        draw();
    } else {
        spectatorScreen.close()
        spectatorscreenBtn_div.innerHTML = "&#10064;";
        spectatorScreen = null;
    }
}

/*
* Open and close menu, sets config on close
*/
function toggleMenu() {
    if(menu_div.style.display == "block") { // close menu
        // save config
        matConf = Math.max(1, parseInt(document.getElementById("menu_mat").value));
        fightTimeSecConf = Math.max(1, parseInt(document.getElementById("menu_fighttime").value)); 
        osaeTimeSecConf = Math.max(1, parseInt(document.getElementById("menu_osaetime").value));
        goldenScoreTimeSecConf = Math.max(0, parseInt(document.getElementById("menu_goldenScoretime").value));
        bellNumConf = Math.max(0, Math.min(7, parseInt(document.getElementById("menu_bellnum").value)));
        
        saveConfig();
        menu_div.style.display = "none";
        
    } else { // open menu
        // populate inputs
        document.getElementById("menu_mat").value = matConf;
        document.getElementById("menu_fighttime").value = fightTimeSecConf; 
        document.getElementById("menu_osaetime").value = osaeTimeSecConf;
        document.getElementById("menu_goldenScoretime").value = goldenScoreTimeSecConf;
        document.getElementById("menu_bellnum").value = bellNumConf;
        
        document.getElementById("menu_fighttimecorrect").value = fightTimeSec; 
        document.getElementById("menu_osaetimecorrect").value = osaeTimeSec;
        
        menu_div.style.display = "block";
    }
}

/*
* Manual time correction by user from menu 
*/
function correctTimes() {
    fightTimeSec = Math.max(0, parseInt(document.getElementById("menu_fighttimecorrect").value)); 
    osaeTimeSec = Math.max(0, parseInt(document.getElementById("menu_osaetimecorrect").value));
    drawTimes();
}

/*
* key bindings
*/
document.onkeypress = function(e) {      
    if(e.key.length !== 1)
        return;
    if(e.target.nodeName === "INPUT" || e.target.nodeName === "BUTTON")
        return;
    switch(e.key) {
    case ' ':
        hajimeOrMate();
    break;
    
    case 'h':
        hajime();
    break;
    
    case 'm':
        mate();
    break;
    
    case 'o':
        osaekomiOrToketa();
    break;
            
    case 't':
        toketa();
    break;
    
    case 'g':
        goldenScore();
    break;
    
    case 'b':
        bell();
    break;
    
    case 'c':
        toggleMenu();
    break;
        
    case 'r':
        reset();
    break;
    
    }
};

/*
* Load config from local storage
* If no config found, open menu to set values
*/
function loadConfig() {
    var value = localStorage.getItem("judoscoreboardconfig");
    if(value) {
        var config = value.split('|');
        if(config.length == 5) {
            matConf = parseInt(config[0]);
            fightTimeSecConf = parseInt(config[1]);
            osaeTimeSecConf = parseInt(config[2]);
            goldenScoreTimeSecConf = parseInt(config[3]);
            bellNumConf = parseInt(config[4]);
            return;
        }
    }
    
    // no config? set default values and open menu
    matConf = 1;
    fightTimeSecConf = 5*60;
    osaeTimeSecConf = 20;
    goldenScoreTimeSecConf = 0;
    bellNumConf = 1;
    
    toggleMenu();
}

/*
* Save config varaibles to local storage
*/
function saveConfig() {
    var config = [matConf, fightTimeSecConf, osaeTimeSecConf, goldenScoreTimeSecConf, bellNumConf];
    if(localStorage)
        localStorage.setItem("judoscoreboardconfig", config.join("|"));
}

function createFightInfo() {
    message = {"whitename": document.getElementById("whitename_input").value,
               "bluename": document.getElementById("bluename_input").value,
               "groupname": document.getElementById("groupname_input").value,
               "roundname": document.getElementById("round_input").value};
    return message;
}

function parseFightInfo(response) {
    var data = JSON.parse(response);
            
    if(data.hasOwnProperty("whitename")) {
        document.getElementById("whitename").innerHTML = data.whitename;
    } else {
        document.getElementById("whitename").innerHTML = " ";
    }
    if(data.hasOwnProperty("bluename")) {
        document.getElementById("bluename").innerHTML = data.bluename;
    } else {
        document.getElementById("bluename").innerHTML = " ";
    }
    if(data.hasOwnProperty("groupname")) {
        document.getElementById("group").innerHTML = data.groupname;
    } else {
        document.getElementById("group").innerHTML = " ";
    }
    if(data.hasOwnProperty("roundname")) {
        document.getElementById("round").innerHTML = data.roundname;
    } else {
        document.getElementById("round").innerHTML = " ";
    }
}
    
/*
* disable right mouse context menu
*/
document.oncontextmenu = function () { // IE8
    return false;
};
window.addEventListener('contextmenu', function (e) { // Not compatible with IE < 9
    e.preventDefault();
}, false);