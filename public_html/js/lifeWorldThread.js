/*
 *  life World thread
 *  TextType = JavaScript
 */
"use strict";

var width = 0;
var height = 0;
var lifeAlgorithm = null;
var prm = null;

/**
 * Structure of Life Info Matrix
 * memo: the same as lifeWorld
 */
var NUM_INFO = 10;
var ID_ALIVE = 0;
var ID_ID = 1;
var ID_GROUP = 2;
var ID_AGE = 3;
var ID_SEX = 4;
var ID_POWER = 5;
var ID_DIRECTION_X = 6; // 0-2
var ID_DIRECTION_Y = 7; // 0-2
var ID_TYPE = 8;    // 0 = cooperative, 1 = exclusive
var ID_INFO1 = 9;

function loadSubScripts()
{
  importScripts('./extension/lifeAlgorithm.js');
  importScripts('./extension/lifeAlgorithmNormal.js');
  importScripts('./extension/lifeAlgorithmCo_Ex.js');
  importScripts('./extension/lifeAlgorithmMove.js');
}

function setAlgorithm(receivedLifeAlgorithm)
{
  switch (receivedLifeAlgorithm.algorithmType){
    default:
    case "NORMAL":
      lifeAlgorithm = new LifeAlgorithmNormal(receivedLifeAlgorithm.algorithmType);
      break;
    case "CO_EX":
      lifeAlgorithm = new LifeAlgorithmCo_Ex(receivedLifeAlgorithm.algorithmType);
      break;
    case "MOVE":
      lifeAlgorithm = new LifeAlgorithmMove(receivedLifeAlgorithm.algorithmType);
      break;
  }
}

/**
 * Receiver from main thread
 */
self.addEventListener("message", function(e) {
  loadSubScripts();
  var data = e.data;
  switch (data.cmd) {
    case "start":
      width = data.width;
      height = data.height;
      prm = data.prm;
      setAlgorithm(data.lifeAlgorithm);
      setTimeout(lifeWorldThreadMain(data.lifeMatrix, true, Math.floor(data.timeout)), Math.floor(data.timeout));
      break;
    case "startOnce":
      width = data.width;
      height = data.height;
      prm = data.prm;
      setAlgorithm(data.lifeAlgorithm);
      lifeWorldThreadMain(data.lifeMatrix, false, 0);
      break;
    default:
      console.error("unknown command" + data.cmd);
      //self.postMessage("unknown command: " + data.cmd);
      break;
  }

}, false);


/**
 * lifeWorldThreadMain
 * Called: by timer handler
 * Write:  Create New Matrix to write calclated lives
 * Action: Calculate Life Game, then post calculated matrix ans analysis info
 * @param {Uint32Array} lifeMatrix
 * @param {bool} continuous: do forever or once
 * @param {int} timeout: wait time
 */
function lifeWorldThreadMain(lifeMatrix, continuous, timeout)
{
  var lifeMatrixNew = new Uint32Array(width*height*NUM_INFO);
  var analInfo = {numLife: 0, numDeath: 0, numBirth: 0};
  for(var y = 0; y < height; y++){
      for(var x = 0; x < width; x++){
        lifeAlgorithm.lifeCheck(lifeMatrix, lifeMatrixNew, x, y, analInfo);
      }
  }

  self.postMessage({"type": "notify", "lifeMatrix": lifeMatrixNew, "analInfo": analInfo});

  if(continuous){
    setTimeout(function() {
      lifeWorldThreadMain(lifeMatrixNew, true, timeout);}, timeout
    );
  } else {
      self.postMessage({"type": "comp", "result": "ok"});
  }
}

/**
 * setLifeInfo
  * @param {Uint32Array} mat
 * @param {int} x
 * @param {int} y
 * @param {int} id: e.g. ID_AGE
 * @param {int} data
 */
function setLifeInfo (mat, x, y, id, data)
{
  mat[(y*width + x)*NUM_INFO + id] = data;
};
function setLifeInfoAll (mat, x, y, info)
{
  if(info.length != NUM_INFO)return;
  for(var i = 0; i < NUM_INFO; i++){
    setLifeInfo(mat, x, y, i, info[i]);
  }
};
/**
 * getLifeInfo
 * @param {Uint32Array} mat
 * @param {int} x
 * @param {int} y
 * @param {int} id: e.g. ID_AGE
 * @returns {int} data
 */
function getLifeInfo (mat, x, y, id)
{
  return mat[(y*width + x)*NUM_INFO + id];
}

function getLifeInfoAll(mat, x, y)
{
  var info = new Uint32Array(NUM_INFO);
  for( var i = 0; i < NUM_INFO; i++){
    info[i] = getLifeInfo(mat, x, y, i);
  }
  return info;
}