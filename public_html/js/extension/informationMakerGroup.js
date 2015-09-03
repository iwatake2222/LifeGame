/*
 *  Generate information to show
 *  TextType = JavaScript
 */
"use strict";


function InformationMakerGroup()
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
InformationMakerGroup.prototype.getLifeColor = function(info, analInfo, time)
{
  return this.getColorFromGroup(info[ID_GROUP]);
};

/**
 * getShowInformation
 * Called: ViewMessage at each frame
 * @param {UInt32Array} lifeMatrix: life matrix
 * @param {Object} analInfo: analysis information
 * @param {Uint32} time
 * @returns {ObjectArray} information to show
 */
InformationMakerGroup.prototype.getShowInformation = function()
{
  var groupArray = new Uint32Array(10);
  for(var y = 0; y < FIELD_HEIGHT; y++){
    for(var x = 0; x < FIELD_WIDTH; x++){
      if(g_lifeWorld.getLifeInfo(x, y, ID_ALIVE)){
        var group = g_lifeWorld.getLifeInfo(x, y, ID_GROUP);
        groupArray[group]++;
      }
    }
  }
  
  var ret = new Array(10);
  for(var i = 0; i < ret.length; i++){
    ret[i] = new SHOW_INFORMATION();
  }
  for(var i = 0; i < ret.length; i++){
    ret[i].str = "Group " + i +": " + groupArray[i];
    ret[i].number = groupArray[i];
    ret[i].color = this.getColorFromGroup(i);
  }

  return ret;

};


InformationMakerGroup.prototype.getColorFromGroup = function(group)
{
  switch(group){
    case 0:
      return "#FF0000";
    case 1:
      return "#00FF00";
    case 2:
      return "#0000FF";
    case 3:
      return "#00FFFF";
    case 4:
      return "#FF00FF";
    case 5:
      return "#FFFF00";
    case 6:
      return "#8888FF";
    case 7:
      return "#88FF88";
    case 8:
      return "#FF8888";
    default:
      return "#FFFFFF";
  }
};