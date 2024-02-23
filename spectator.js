var ippons = []; // holds ippon points
var wazaris = []; // holds wazari points
var yukos = []; // holds yuko points
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
var goldenScore_div;
var menuBtn_div;
var menu_div;
var menuBtnClose;

var sound_audio = [];

var shidoImgs = ["resources/shido0.png","resources/shido1.png", "resources/shido2.png", "resources/shido3.png"];

var fightInfoJsonServerUrl = "";

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
    for(var i = 0; i < 2; i++) {
        ippon_divs[i].innerHTML = (ippons[i] > 0) ? ippons[i] : "&nbsp;";
        wazari_divs[i].innerHTML = wazaris[i];
        yuko_divs[i].innerHTML = yukos[i];
        shido_divs[i].src = shidoImgs[shidos[i]];
    }
}

/*
* Refresh displayed times
*/
function drawTimes() {
    fightTime_div.style.color = (fightActive) ? "#00cc00" : "#cc0000";
    osaeTime_div.style.color = (osaeActive) ? "#ff88ff" : "#8888ff";
    
    fightTime_div.innerText = parseInt(fightTimeSec/60) + ":" + ("0" + (fightTimeSec%60)).slice(-2);
    osaeTime_div.innerHTML = osaeTimeSec;
    
    if(goldenScoreActive)
        goldenScore_div.style.display = "block";
    else
        goldenScore_div.style.display = "none";
}

/*
* Init local variables and event handlers
*/
function init() {
    // add event handler
    ippon_divs[0] = document.getElementById("white_ippon");
    ippon_divs[1] = document.getElementById("blue_ippon");
    
    wazari_divs[0] = document.getElementById("white_wazari");
    wazari_divs[1] = document.getElementById("blue_wazari");
    
    yuko_divs[0] = document.getElementById("white_yuko");
    yuko_divs[1] = document.getElementById("blue_yuko");

    shido_divs[0] = document.getElementById("white_shido");
    shido_divs[1] = document.getElementById("blue_shido");

    fightTime_div = document.getElementById("fighttime");
    osaeTime_div = document.getElementById("osaetime");

    goldenScore_div = document.getElementById("goldenscore");
    
    menuBtn_div = document.getElementById("menubtn");
    menu_div = document.getElementById("menu");
    menuBtnClose =  document.getElementById("menubtnclose");

    window.addEventListener("message", receiveMessage, false);
    window.opener.postMessage("requestConfig", '*');
    window.addEventListener("resize", resizeText, false);
    reset();
    resizeText();
}

function receiveMessage(event) {
    console.log("Received message!", event)
    if (event.origin !== window.location.origin && event.origin != "null") {
        return;
    }
    const message = event.data;
    switch(message["type"]) {
        case "config":
            parseFightInfo(message);
            break;
        case "time":
            parseTimeUpdate(message);
            break;
        case "points":
            parsePointsUpdate(message);
            break;
    }
}

function parsePointsUpdate(data) {
    if("ippons" in data) ippons = data["ippons"];
    if("wazaris" in data) wazaris = data["wazaris"];
    if("yukos" in data) yukos = data["yukos"];
    if("shidos" in data) shidos = data["shidos"];
    drawPoints();
}

function parseTimeUpdate(data) {
    if("fighttime" in data) fightTimeSec = data["fighttime"];
    if("fightActive" in data) fightActive = data["fightActive"];
    if("osaeTime" in data) osaeTimeSec = data["osaeTime"];
    if("osaeActive" in data) osaeActive = data["osaeActive"];
    if("goldenScoreActive" in data) goldenScoreActive = data["goldenScoreActive"];
    drawTimes();
}

function parseFightInfo(data) {            
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

function reset() {
    ippons = [0,0];
    wazaris = [0,0];
    yukos = [0,0];
    shidos = [0,0];
    fightActive = false;
    osaeActive = false;
    goldenScoreActive = false;
    bellActive = false;
    draw();
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

function resizeText() {
    var containerWidth = document.getElementById('fighttime_container').offsetWidth;
    var textElement = document.getElementById('fighttime');
    var fontSize = 1; // Start with the smallest font size
    
    textElement.style.fontSize = fontSize + 'px';
    // Increment font size until the text fits within the container width
    while (textElement.offsetWidth < containerWidth) {
        fontSize++;
        textElement.style.fontSize = fontSize + 'px';
    }
    
    // Decrement font size if the last increment caused the text to overflow
    while (textElement.offsetWidth > containerWidth) {
        fontSize--;
        textElement.style.fontSize = fontSize + 'px';
    }
}