/*
 *  Generate information to show
 *  TextType = JavaScript
 */
"use strict";

function SHOW_INFORMATION()
{
  this.str;
  this.number;
  this.color;
}

function InformationMaker()
{
  this.dummy = 0;

}

/**
 * getLifeColor
 * Called: ViewMain at each (x, y)
 * @param {UInt32Array} info: life information
 * @param {Object} analInfo: analysis information
 * @param {Uint32} time
 * @returns {String} color
 */
InformationMaker.prototype.getLifeColor = function(info, analInfo, time)
{
  /*
  var ret = "#888888";
  return ret;
  */
  console.log("unable to call this function");
  return null;
};

/**
 * getShowInformation
 * Called: ViewMessage at each frame
 * @param {UInt32Array} lifeMatrix: life matrix
 * @param {Object} analInfo: analysis information
 * @param {Uint32} time
 * @returns {ObjectArray} information to show
 */
InformationMaker.prototype.getShowInformation = function()
{
  /*
  var ret = new Array(4);
  ret[0] = new SHOW_INFORMATION();
  ret[1] = new SHOW_INFORMATION();
  ret[2] = new SHOW_INFORMATION();
  ret[3] = new SHOW_INFORMATION();
  return ret;
  */
  
  console.log("unable to call this function");
  return null;
};
