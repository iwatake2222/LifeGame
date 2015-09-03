/*
 *  Generate information to show
 *  TextType = JavaScript
 */
"use strict";


function InformationMakerAge()
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
InformationMakerAge.prototype.getLifeColor = function(info, analInfo, time)
{
  if(true) {
    var age = info[ID_AGE]/time;
    if(age<0.3) {
      return "#FF0000";
    } else if(age<0.6) {
      return "#00FF00";
    } else if(age<0.9) {
      return "#0000FF";
    } else {
      return "#FF00FF";
    }
  }

};

/**
 * getShowInformation
 * Called: ViewMessage at each frame
 * @param {UInt32Array} lifeMatrix: life matrix
 * @param {Object} analInfo: analysis information
 * @param {Uint32} time
 * @returns {ObjectArray} information to show
 */
InformationMakerAge.prototype.getShowInformation = function()
{
  var cnt=0;
  var ageArray = new Uint32Array(Math.ceil(100/30));
  for(var y = 0; y < FIELD_HEIGHT; y++){
    for(var x = 0; x < FIELD_WIDTH; x++){
      if(g_lifeWorld.getLifeInfo(x, y, ID_ALIVE)){
        var age = g_lifeWorld.getLifeInfo(x, y, ID_AGE);
        age = Math.floor(age/g_lifeWorld.time*100);
        age = Math.floor(age/30);
        ageArray[age] += 1;
        cnt++;
      }
    }
  }
  
  var ret = new Array(4);
  ret[0] = new SHOW_INFORMATION();
  ret[1] = new SHOW_INFORMATION();
  ret[2] = new SHOW_INFORMATION();
  ret[3] = new SHOW_INFORMATION();
  ret[0].str = "age/time = <br>0-29: " + ageArray[0];
  ret[0].number = ageArray[0];
  ret[0].color = "#FF0000";
  ret[1].str = "30-59: " + ageArray[1];
  ret[1].number = ageArray[1];
  ret[1].color = "#00FF00";
  ret[2].str = "60-89: " + ageArray[2];
  ret[2].number = ageArray[2];
  ret[2].color = "#0000FF";
  ret[3].str = "90-100: " + ageArray[3];
  ret[3].number = ageArray[3];
  ret[3].color = "#FF00FF";
  
  return ret;

};
