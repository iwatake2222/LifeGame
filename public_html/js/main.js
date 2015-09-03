/***
 * main.js
 * html control wrappers
 */
"use strict";

/*** Global Variables ***/
/** Field Size. unit = block (not pixel) **/
var FIELD_WIDTH = 400;  //1920;
var FIELD_HEIGHT = 400; //1080;

/** STATUS("STOP", "RUN") **/
var STATUS = "STOP";

/** Components **/
var g_lifeWorld = new LifeWorld();
var g_viewMain = new ViewMain();
var g_viewMessage = new ViewMessage();
var g_controllerMain = new ControllerMain(g_viewMain);

/** for Chrome App **/
var isChromeApp = false;

/*** Global functions ***/
/**
 * init
 * Called: at onload
 */
function init()
{
  g_viewMain.init();
  g_viewMessage.init();
  g_controllerMain.init();
  g_lifeWorld.init();
  menuInit();
    
  writeFooter(1, "W/H = " + FIELD_WIDTH + "/" + FIELD_HEIGHT);
  
  /* todo. check if chrome App using initial window size*/
  if(window.outerHeight < 50) {
    window.resizeTo(720, 480);
    isChromeApp = true;
  }
  //window.resizeTo(960, 600);
  resize();
  
}

/**
 * resize
 * Called: at window resizes
 */
function resize()
{
  /* call view directly (not via controller) */
  g_viewMain.resize();
  g_viewMessage.resize();
}


/**
 * allocateLife
 * Called: at controller clicked
 * Action: allocate lives on focused area. Keep other field status
 * @param {int} prm: density[%]
 */
function allocateLife(prm)
{
  stopLife();
  var x0 = g_viewMain.focusedAreaX0;
  var x1 = g_viewMain.focusedAreaX1;
  var y0 = g_viewMain.focusedAreaY0;
  var y1 = g_viewMain.focusedAreaY1;
  g_lifeWorld.makeMatrixRandom(parseFloat(prm/100), x0, y0, x1, y1);
}

/**
 * clearLife
 * Called: at controller clicked
 * Action: clear all lives. Initialize time and analysis Info
 */
function clearLife()
{
  stopLife();
  g_viewMessage.clearGraph();
  g_lifeWorld.init();
  writeFooter(1, "W/H = " + FIELD_WIDTH + "/" + FIELD_HEIGHT);
}

/**
 * startLife
 * memo: keep field status like time
 */
function startLife()
{
  if(STATUS != "STOP") return;
  STATUS ="START";
  var btn_start = document.getElementById("btn_start");
  btn_start.value = "STOP";
  g_lifeWorld.startThread(true);
}

/**
 * stopLife
 * memo: keep field status like time
 */
function stopLife()
{
  if(STATUS != "START") return;
  STATUS ="STOP";
  var btn_start = document.getElementById("btn_start");
  btn_start.value = "START";
  g_lifeWorld.stopThread();
}

/**
 * latchLife
 */
function latchLife()
{
  if(STATUS == "STOP"){
    startLife();
  } else {
    stopLife();
  }
}


function writeInfo(pos, str, color)
{
  var color = color || "#FFFFFF";
  var footer = document.getElementById("info_" + pos);
  footer.style.color = color;
  footer.innerHTML = str;

}
function writeFooter(pos, str)
{
  var footer = document.getElementById("footer_" + pos);
  footer.innerHTML = str + " | ";

}

function writeFooterRight(pos, str)
{
  var footer = document.getElementById("footer_right" + pos);
  footer.innerHTML = str + " | ";
}

function getWaitTime()
{
  return parseInt(document.getElementById("range_wait").value);
}


/*** html elements wrappers ***/
/** Window control handlers **/
window.onload = function() {
  assignHtmlEvents();
  init();
};

window.onresize = function() {
  resize();
};

/** assignHtmlEvents (for chrome app) **/
function assignHtmlEvents() {
  /* menu */
  document.getElementById("size").onclick = menuFieldSize;
  document.getElementById("save").onclick = menuSave;
  document.getElementById("load").onclick = menuLoad;
  document.getElementById("grid").onclick = menuViewGrid;
  document.getElementById("viewNoColor").onclick = menuViewNoColor;
  document.getElementById("viewAge").onclick = menuViewAge;
  document.getElementById("viewGroup").onclick = menuViewGroup;
  document.getElementById("viewType").onclick = menuViewType;
  document.getElementById("decimation").onclick = menuViewDecimation;
  
  document.getElementById("algoNormal").onclick = menuAlgoNormal;
  document.getElementById("algoCo_Ex").onclick = menuAlgoCo_Ex;
  document.getElementById("algoMove").onclick = menuAlgoMove;
  
  document.getElementById("version").onclick = menuVersion;
  
  /* controls */
  document.getElementById("btn_start").onclick = btn_start_click;
  document.getElementById("range_wait").oninput = range_wait_change;
  document.getElementById("range_wait").onchange = range_wait_change;
  document.getElementById("btn_allocLife").onclick = btn_allocLife_click;
  document.getElementById("btn_clearLife").onclick = btn_clearLife_click;
  document.getElementById("range_allocLifeDensity").oninput = range_allocLifeDensity_change;
  document.getElementById("range_allocLifeDensity").onchange = range_allocLifeDensity_change;
  document.getElementById("range_prm0").oninput = range_prm0_change;
  document.getElementById("range_prm0").onchange = range_prm0_change;
  document.getElementById("range_prm1").oninput = range_prm1_change;
  document.getElementById("range_prm1").onchange = range_prm1_change;
  document.getElementById("range_prm2").oninput = range_prm2_change;
  document.getElementById("range_prm2").onchange = range_prm2_change;
  document.getElementById("range_prm3").oninput = range_prm3_change;
  document.getElementById("range_prm3").onchange = range_prm3_change;
}

/** html element handlers (events) **/
function btn_start_click()
{
  latchLife();
}

function btn_allocLife_click()
{
  var lifeDensity = document.getElementById("range_allocLifeDensity");
  allocateLife(lifeDensity.value);
}
function btn_clearLife_click()
{
  clearLife();
}

/*** html element handlers (parameters) ***/
function range_wait_change()
{
  var wait = document.getElementById("range_wait");
  document.getElementById("num_range_wait").value = wait.value;
}

function range_allocLifeDensity_change()
{
  var lifeDensity = document.getElementById("range_allocLifeDensity");
  document.getElementById("num_range_allocLifeDensity").value = lifeDensity.value;
}

function range_prm0_change()
{
  var prm = document.getElementById("range_prm0");
  document.getElementById("num_range_prm0").value = prm.value;
}

function range_prm1_change()
{
  var prm = document.getElementById("range_prm1");
  document.getElementById("num_range_prm1").value = prm.value;
}

 function range_prm2_change()
{
  var prm = document.getElementById("range_prm2");
  document.getElementById("num_range_prm2").value = prm.value;
}

function range_prm3_change()
{
  var prm = document.getElementById("range_prm3");
  document.getElementById("num_range_prm3").value = prm.value;
}
