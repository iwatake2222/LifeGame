/*
 *  life World thread
 *  TextType = JavaScript
 */
"use strict";

var width = 0;
var height = 0;;


/**
 * Structure of Life Info Matrix
 * memo: the same as lifeWorld
 */
var NUM_INFO = 10;
var ID_ALIVE = 0;
var ID_SEX = 1;
var ID_AGE = 2;
var ID_POWER = 3;
var ID_GROUP = 4;
var ID_INFO0 = 5;
var ID_INFO1 = 6;
var ID_INFO2 = 7;
var ID_INFO3 = 8;
var ID_INFO4 = 9;


/**
 * Receiver from main thread
 */
self.addEventListener("message", function(e) {
  var data = e.data;
  switch (data.cmd) {
    case "start":
      width = data.width;
      height = data.height;
      setTimeout(lifeWorldThreadMain(data.lifeMatrix, true, Math.floor(data.timeout)), Math.floor(data.timeout));
      break;
    case "startOnce":
      width = data.width;
      height = data.height;
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
        lifeCheck(lifeMatrix, lifeMatrixNew, x, y, analInfo);
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
 * lifeCheck
 * Called:  each block. (width*height) times / one calc
 * Memo: modify here to change algorithm
 * @param {Uint32Array} lifeMatrix
 * @param {Uint32Array} lifeMatrixNew
 * @param {int} x0: currentX
 * @param {int} y0: currentY
 * @param {obj} analInfo
 */
function lifeCheck(lifeMatrix, lifeMatrixNew, x0, y0, analInfo)
{
  var yStart = y0-1;
  var yEnd = y0+1;
  var xStart = x0-1;
  var xEnd = x0+1;
  if(yStart < 0) yStart = 0;
  if(yEnd >= height) yEnd = height-1;
  if(xStart < 0) xStart = 0;
  if(xEnd >= width) xEnd = width-1;
  
  var cnt = 0;
  for(var y = yStart; y <= yEnd; y++){
    for(var x = xStart; x <= xEnd; x++){
      if(getLifeInfo(lifeMatrix, x, y, ID_ALIVE) != 0) cnt++;
    }
  }
 
  if(getLifeInfo(lifeMatrix, x0, y0, ID_ALIVE) == 0){
    if(cnt == 3) {
      setLifeInfo(lifeMatrixNew, x0, y0, ID_ALIVE, 1000);
      analInfo.numBirth++;
      analInfo.numLife++;
      setLifeInfo(lifeMatrixNew, x0, y0, ID_AGE, 0);
    } else {
      /* keep die */
      setLifeInfo(lifeMatrixNew, x0, y0, ID_ALIVE, 0);
    }
  } else {
    if(cnt<=2 || cnt>=5) {
      setLifeInfo(lifeMatrixNew, x0, y0, ID_ALIVE, 0);
      analInfo.numDeath++;
      setLifeInfo(lifeMatrixNew, x0, y0, ID_AGE, 0);
    } else {
      /* keep live*/
      analInfo.numLife++;
      setLifeInfo(lifeMatrixNew, x0, y0, ID_ALIVE, 1000);
      setLifeInfo(lifeMatrixNew, x0, y0, ID_AGE, getLifeInfo(lifeMatrix, x0, y0, ID_AGE)+1);
    }
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
};
