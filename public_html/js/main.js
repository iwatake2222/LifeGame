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


/*** Wrappers from html, global functions ***/
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
  
  writeFooter(1, "W/H = " + FIELD_WIDTH + "/" + FIELD_HEIGHT);
  //window.resizeTo(854,480);
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


/*** Wrappers to html elements ***/
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


