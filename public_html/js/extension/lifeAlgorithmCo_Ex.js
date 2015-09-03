/*
 *  LifeAlgorithmNormal
 *  implementation of algorithm
 *  TextType = JavaScript
 */
"use strict";


function LifeAlgorithmCo_Ex(algorithmType)
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
LifeAlgorithmCo_Ex.prototype.createLife = function(group)
{
  //var info = new Uint32Array(NUM_INFO);
  //return info;
  
  var info = new Uint32Array(NUM_INFO);
  info[ID_ALIVE] = 1000;
  info[ID_AGE] = 0;
  info[ID_GROUP] = group;
  info[ID_ID] = this.cntLife;
  var cooperative = document.getElementById("range_prm0").value;  //todo: via wrapper
  info[ID_INFO1] = cooperative;

  if(Math.floor(Math.random()*100) < cooperative){
    info[ID_TYPE] = 0;  // 0 = cooperative
  } else {
    info[ID_TYPE] = 1;  // 1 = exclusive
  }
  
  //info[ID_GROUP] = info[ID_TYPE];
  
  this.cntLife++;
  this.cntLife %= 10;
  return info;
};

/**
 * setParam
 * Called: from lifeWorld to create parameter send to thread
 * @returns {object} prm
 */
LifeAlgorithmCo_Ex.prototype.setParam = function()
{
  var prm = new Object();
  var lifespan = document.getElementById("range_prm1").value;
  if(lifespan == 0)lifespan = 9999;
  prm.lifespan = lifespan;
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
LifeAlgorithmCo_Ex.prototype.lifeCheck = function(lifeMatrix, lifeMatrixNew, x0, y0, analInfo)
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

  var cnt = 0;//
  var info = null;//
  var infoArrayType0 = new Array();
  var infoArrayType1 = new Array();
  var isMixed = false
  var currentGroup = -1;
  var infoArray = new Array();
  for(var yy = yStart; yy <= yEnd; yy++){
    var y = yy % height;
    for(var xx = xStart; xx <= xEnd; xx++){
      var x = xx % width;
      if(getLifeInfo(lifeMatrix, x, y, ID_ALIVE) != 0) {
        cnt++;
        info = getLifeInfoAll(lifeMatrix, x, y);//
        infoArray.push(getLifeInfoAll(lifeMatrix, x, y));
        if(currentGroup == -1)currentGroup = info[ID_GROUP];
        if(currentGroup != info[ID_GROUP])isMixed = true;
        if(info[ID_TYPE] == 0){
          infoArrayType0.push(getLifeInfoAll(lifeMatrix, x, y));
        } else {
          infoArrayType1.push(getLifeInfoAll(lifeMatrix, x, y));
        }
      }
    }
  }

  if(getLifeInfo(lifeMatrix, x0, y0, ID_ALIVE) == 0){
    /* Now I'm dead */
    if(cnt >= 3) {
      var cntGroup = new Uint32Array(10);
      var cntGroup_type0 = new Uint32Array(10);
      var cntGroup_type1 = new Uint32Array(10);
      //for(var i = 0; i < infoArray.length; i++){
      for(var i = 0; i < infoArray.length; i++){
        var info = infoArray[i];
        if(info[ID_TYPE] == 0){
          cntGroup_type0[info[ID_GROUP]]++;
        } else {
          cntGroup_type1[info[ID_GROUP]]++;
        }
        cntGroup[info[ID_GROUP]]++;
      }
      var generateGroup = findIndexofArray(cntGroup, 3);    // todo : 2 hit
      
      if(generateGroup < 0) {
        /* keep die */
        //setLifeInfo(lifeMatrixNew, x0, y0, ID_ALIVE, 0);
      } else if ( ((cntGroup_type1[generateGroup] > 0) && (cnt == 3)) 
      //} else if ( ((cntGroup_type1[generateGroup] >=1 ) && (cnt == 3)) 
                || ((cntGroup_type1[generateGroup] == 0))){
        /* birth */
        var info;
        for(var i = 0; i < infoArray.length; i++){
          info = infoArray[i];
          if (info[ID_GROUP] == generateGroup)break;
        }
        var genType = 0;
        var coop = info[ID_INFO1];
        if(Math.floor(Math.random()*100) < coop){
          genType = 0;  // 0 = cooperative
        } else {
          genType = 1;  // 1 = exclusive
        }
        
        setLifeInfo(lifeMatrixNew, x0, y0, ID_ALIVE, 1000);
        setLifeInfo(lifeMatrixNew, x0, y0, ID_AGE, 0);
        setLifeInfo(lifeMatrixNew, x0, y0, ID_ID,  1000);  //todo
        setLifeInfo(lifeMatrixNew, x0, y0, ID_GROUP, generateGroup);
        setLifeInfo(lifeMatrixNew, x0, y0, ID_TYPE, genType);
        setLifeInfo(lifeMatrixNew, x0, y0, ID_INFO1, coop);
        analInfo.numBirth++;
        analInfo.numLife++;
      } else {
        /* keep die */
        //setLifeInfo(lifeMatrixNew, x0, y0, ID_ALIVE, 0);
      }
    } else {
      /* keep die */
      //setLifeInfo(lifeMatrixNew, x0, y0, ID_ALIVE, 0);
    }
  } else {
    /* Now I'm alive */
    var info = getLifeInfoAll(lifeMatrix, x0, y0);
    if(info[ID_TYPE] == 0){
      var cntAll = infoArray.length;
      var cntSame = 0;
      while(infoArrayType0.length>0){
        var otherInfo = infoArrayType0.pop();
        if(info[ID_GROUP] == otherInfo[ID_GROUP])cntSame++;
      }
      if( (cntAll <= 2) || (cntSame >= 5)) {
        /* Die */
        setLifeInfo(lifeMatrixNew, x0, y0, ID_ALIVE, 0);
        setLifeInfo(lifeMatrixNew, x0, y0, ID_AGE, 0);
        analInfo.numDeath++;
      } else {
        /* Keep alive */
        if(info[ID_AGE]++<prm.lifespan){
          setLifeInfoAll(lifeMatrixNew, x0, y0, info);
          analInfo.numLife++;
        } else {
          analInfo.numDeath++;
        }
      }
    } else {  // type 1
      if(isMixed || infoArray.length >= 5 ){
        /* Die */
        setLifeInfo(lifeMatrixNew, x0, y0, ID_ALIVE, 0);
        setLifeInfo(lifeMatrixNew, x0, y0, ID_AGE, 0);
        analInfo.numDeath++;
      } else {
        /* Keep alive */
        if(info[ID_AGE]++<prm.lifespan){
          setLifeInfoAll(lifeMatrixNew, x0, y0, info);
          analInfo.numLife++;
        } else {
          analInfo.numDeath++;
        }
      }
    }
  }


};

function findIndexofArray(array, num)
{
  for(var i = 0; i< array.length; i++){
    if(array[i]===num)return i;
  }
  return -1;
}

