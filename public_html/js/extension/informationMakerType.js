/*
 *  Generate information to show
 *  TextType = JavaScript
 */
"use strict";


function InformationMakerType()
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
InformationMakerType.prototype.getLifeColor = function(info, analInfo, time)
{
  return this.getColorFromType(info[ID_TYPE]);
};

/**
 * getShowInformation
 * Called: ViewMessage at each frame
 * @param {UInt32Array} lifeMatrix: life matrix
 * @param {Object} analInfo: analysis information
 * @param {Uint32} time
 * @returns {ObjectArray} information to show
 */
InformationMakerType.prototype.getShowInformation = function()
{
  var typeArray = new Uint32Array(2);
  for(var y = 0; y < FIELD_HEIGHT; y++){
    for(var x = 0; x < FIELD_WIDTH; x++){
      if(g_lifeWorld.getLifeInfo(x, y, ID_ALIVE)){
        var type = g_lifeWorld.getLifeInfo(x, y, ID_TYPE);
        typeArray[type]++;
      }
    }
  }
  
  var ret = new Array(2);
  for(var i = 0; i < ret.length; i++){
    ret[i] = new SHOW_INFORMATION();
  }
  for(var i = 0; i < ret.length; i++){
    ret[i].str = "Type " + i +": " + typeArray[i];
    ret[i].number = typeArray[i];
    ret[i].color = this.getColorFromType(i);
  }

  return ret;

};


InformationMakerType.prototype.getColorFromType = function(type)
{
  switch(type){
    case 0:
      return "#FF8888";
    case 1:
      return "#8888FF";
    default:
      return "#FFFFFF";
  }
};