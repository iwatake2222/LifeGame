/*
 *  LifeAlgorithm
 *  interface of algorithm
 *  TextType = JavaScript
 */
"use strict";


function LifeAlgorithm(algorithmType)
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
LifeAlgorithm.prototype.createLife = function(group)
{
  //var info = new Uint32Array(NUM_INFO);
  //return info;
  
  console.log("unable to call this function");
  return null;
};

/**
 * setParam
 * Called: from lifeWorld to create parameter send to thread
 * @returns {object} prm
 */
LifeAlgorithm.prototype.setParam = function()
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
LifeAlgorithm.prototype.lifeCheck = function(lifeMatrix, lifeMatrixNew, x0, y0, analInfo)
{
  console.log("unable to call this function");
  return null;
};
