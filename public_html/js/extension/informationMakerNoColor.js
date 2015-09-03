/*
 *  Generate information to show
 *  TextType = JavaScript
 */
"use strict";

function InformationMakerNoColor()
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
InformationMakerNoColor.prototype.getLifeColor = function(info, analInfo, time)
{
  return "#FFFFFF";

};

/**
 * getShowInformation
 * Called: ViewMessage at each frame
 * @param {UInt32Array} lifeMatrix: life matrix
 * @param {Object} analInfo: analysis information
 * @param {Uint32} time
 * @returns {ObjectArray} information to show
 */
InformationMakerNoColor.prototype.getShowInformation = function()
{
    writeFooterRight(3, " Birth = " + g_lifeWorld.analInfo.numBirth);
  writeFooterRight(4, " Death = " + g_lifeWorld.analInfo.numDeath);
  
  var ret = new Array(3);
  ret[0] = new SHOW_INFORMATION();
  ret[1] = new SHOW_INFORMATION();
  ret[2] = new SHOW_INFORMATION();
  
  ret[0].str = " Life = " + g_lifeWorld.analInfo.numLife;
  ret[0].number = g_lifeWorld.analInfo.numLife;
  ret[0].color = "#FFFFFF";
  ret[1].str = " Birth = " + g_lifeWorld.analInfo.numBirth;
  ret[1].number = g_lifeWorld.analInfo.numBirth;
  ret[1].color = "#00FF00";
  ret[2].str = " Death = " + g_lifeWorld.analInfo.numDeath;
  ret[2].number = g_lifeWorld.analInfo.numDeath;
  ret[2].color = "#FF0000";
  
  return ret;
};
