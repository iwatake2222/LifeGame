/*
 *  LifeAlgorithmNormal
 *  implementation of algorithm
 *  TextType = JavaScript
 */
"use strict";


function LifeAlgorithmNormal(algorithmType)
{
  this.dummy = 0;
  this.cntLife = 0;
  this.algorithmType = algorithmType;
}

/**
 * createLife
 * Called: from lifeWorld to locate lives at random
 * @param {Uint32} group
 * @returns {Uint32Array(NUM_INFO)} info
 */
LifeAlgorithmNormal.prototype.createLife = function(group)
{
  //var info = new Uint32Array(NUM_INFO);
  //return info;
  
  var info = new Uint32Array(NUM_INFO);
  info[ID_ALIVE] = 1000;
  info[ID_AGE] = 0;
  info[ID_GROUP] = group;
  info[ID_ID] = this.cntLife;
  this.cntLife++;
  return info;
  
  console.log("unable to call this function");
  return null;
};

/**
 * setParam
 * Called: from lifeWorld to create parameter send to thread
 * @returns {object} prm
 */
LifeAlgorithmNormal.prototype.setParam = function()
{
  var prm = new Object();
  return prm;
};

/**
 * lifeCheck
 * Called:  from lifeWorldThread at each block. (width*height) times / one calc
 * Memo: Able to refer function and variables in "lifeWorldThread.js"
 * @param {Uint32Array} lifeMatrix
 * @param {Uint32Array} lifeMatrixNew
 * @param {int} x0: currentX
 * @param {int} y0: currentY
 * @param {obj} analInfo
 */
LifeAlgorithmNormal.prototype.lifeCheck = function(lifeMatrix, lifeMatrixNew, x0, y0, analInfo)
{
  var yStart = y0-1;
  var yEnd = y0+1;
  var xStart = x0-1;
  var xEnd = x0+1;
  //if(yStart < 0) yStart = 0;
  //if(yEnd >= height) yEnd = height-1;
  //if(xStart < 0) xStart = 0;
  //if(xEnd >= width) xEnd = width-1;
  xStart += width;
  xEnd += width;
  yStart += height;
  yEnd += height;
  
  var cnt = 0;
  var info = null;
  for(var yy = yStart; yy <= yEnd; yy++){
    var y = yy % height;
    for(var xx = xStart; xx <= xEnd; xx++){
      var x = xx % width;
      if(getLifeInfo(lifeMatrix, x, y, ID_ALIVE) != 0) {
        cnt++;
        info = getLifeInfoAll(lifeMatrix, x, y);
      }
    }
  }
 
  if(getLifeInfo(lifeMatrix, x0, y0, ID_ALIVE) == 0){
    if(cnt == 3) {
      setLifeInfoAll(lifeMatrixNew, x0, y0, info);
      setLifeInfo(lifeMatrixNew, x0, y0, ID_AGE, 0);
      analInfo.numBirth++;
      analInfo.numLife++;
      
    } else {
      /* keep die */
      setLifeInfo(lifeMatrixNew, x0, y0, ID_ALIVE, 0);
    }
  } else {
    if(cnt<=2 || cnt>=5) {
      setLifeInfo(lifeMatrixNew, x0, y0, ID_ALIVE, 0);
      setLifeInfo(lifeMatrixNew, x0, y0, ID_AGE, 0);
      analInfo.numDeath++;
    } else {
      /* keep live*/
      analInfo.numLife++;
      setLifeInfoAll(lifeMatrixNew, x0, y0, getLifeInfoAll(lifeMatrix, x0, y0));
      setLifeInfo(lifeMatrixNew, x0, y0, ID_AGE, getLifeInfo(lifeMatrix, x0, y0, ID_AGE)+1);
    }
  }
};
