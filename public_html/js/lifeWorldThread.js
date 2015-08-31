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
var ID_DIRECTION_X = 4; // 0-2
var ID_DIRECTION_Y = 5; // 0-2
var ID_FAMILY = 6;
var ID_MOTHER = 7;
var ID_ID = 8;
var ID_INFO4 = 9;

function InnerMatInfo()
{
  this.previousX;
  this.previousY;
}
var innerMatInfo;

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

  innerMatInfo = new Array(height);
  for(var y=0; y<height; y++){
    innerMatInfo[y] = new Array(width);
  }
  for(var y=0; y<height; y++){
    for(var x=0; x<width; x++){
      innerMatInfo[y][x] = new InnerMatInfo();
    }
  }
  
  for(var y = 0; y < height; y++){
    for(var x = 0; x < width; x++){
      lifeCheck(lifeMatrix, lifeMatrixNew, x, y, analInfo);
    }
  }
  for(var y = 0; y < height; y++){
    for(var x = 0; x < width; x++){
      if(getLifeInfo(lifeMatrixNew, x, y, ID_ALIVE)>0){
        analInfo.numLife++;
      }
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
  if(getLifeInfo(lifeMatrix, x0, y0, ID_ALIVE) == 0){
    return
  }
  
  

  move(lifeMatrix, lifeMatrixNew, x0, y0, analInfo);
  

  
}

function move(lifeMatrix, lifeMatrixNew, x0, y0, analInfo)
{
  var info = getLifeInfoAll(lifeMatrix,x0,y0);
  info[ID_AGE]++;
  
//  if(info[ID_AGE] > Math.floor( Math.random() * 50) + 200) {
//    /* natural death */
//    info[ID_ALIVE]=0;
//    setLifeInfoAll(lifeMatrixNew, x0, y0, info);
//    analInfo.numDeath++;
//    return;
//  }
  
      
  var moveX = Math.floor( Math.random() * 6 );
  var moveY = Math.floor( Math.random() * 6 );
  if(moveX > 2) moveX = info[ID_DIRECTION_X];
  if(moveY > 2) moveY = info[ID_DIRECTION_Y];
  var movePosX = moveX+x0-1;
  var movePosY = moveY+y0-1;
  if(movePosX < 0) movePosX = width + movePosX;
  if(movePosX >= width) movePosX = movePosX - width;
  if(movePosY < 0) movePosY = height + movePosY;
  if(movePosY >= height) movePosY = movePosY - height;
  
  if(getLifeInfo(lifeMatrix, movePosX, movePosY, ID_ALIVE) != 0){
    /* keep current position */
    setLifeInfoAll(lifeMatrixNew, x0, y0, info);
  } else {
    if(getLifeInfo(lifeMatrixNew, movePosX, movePosY, ID_ALIVE) == 0){
      /* able to move */
      setLifeInfoAll(lifeMatrixNew, movePosX, movePosY, info);
      innerMatInfo[movePosY][movePosX].previousX = x0;
      innerMatInfo[movePosY][movePosX].previousY = y0;
    } else {
      /* Conflict */
      var enemyInfo = getLifeInfoAll(lifeMatrixNew, movePosX, movePosY);
      if( getFamilyId(info[ID_FAMILY]) == getFamilyId(enemyInfo[ID_FAMILY]) ){
        /* do not move */
        setLifeInfo(lifeMatrixNew, movePosX, movePosY, ID_ALIVE, 0);
        setLifeInfoAll(lifeMatrixNew, innerMatInfo[movePosY][movePosX].previousX, innerMatInfo[movePosY][movePosX].previousY, enemyInfo);
        innerMatInfo[innerMatInfo[movePosY][movePosX].previousY][innerMatInfo[movePosY][movePosX].previousX].previousX = innerMatInfo[movePosY][movePosX].previousX;
        innerMatInfo[innerMatInfo[movePosY][movePosX].previousY][innerMatInfo[movePosY][movePosX].previousX].previousY = innerMatInfo[movePosY][movePosX].previousY;
        setLifeInfoAll(lifeMatrixNew, x0, y0, info);
        innerMatInfo[y0][x0].previousX = x0;
        innerMatInfo[y0][x0].previousY = y0;
        if( (info[ID_FAMILY] == enemyInfo[ID_FAMILY]) && Math.floor( Math.random() * 100 ) > 0 ){
          /* make a child */
          info[ID_ALIVE] = Math.floor( Math.random() * 1000 ) + 100;
          info[ID_SEX] = Math.floor( Math.random() * 2 );
          info[ID_DIRECTION_X] = Math.floor( Math.random() * 3 );
          info[ID_DIRECTION_Y] = Math.floor( Math.random() * 3 );
          info[ID_POWER] = Math.floor( Math.random() * 100 ) + 10;
          info[ID_AGE] = 0;
          info[ID_FAMILY] = getFamilyId(info[ID_FAMILY]) + Math.floor( Math.random() * 100 ) + 1;
          setLifeInfoAll(lifeMatrixNew, movePosX, movePosY, info);
          setLifeInfoAll(lifeMatrix, movePosX, movePosY, info);
          analInfo.numBirth++;
        }
      } else if( (info[ID_SEX] != enemyInfo[ID_SEX]) && (Math.abs(info[ID_AGE] - enemyInfo[ID_AGE]) < 80) && (Math.floor( Math.random() * 100 ) > 0)){
        /* become a couple */
        var familyId = makeFamilyId(info[ID_FAMILY], enemyInfo[ID_FAMILY]);
        info[ID_FAMILY] = familyId;
        enemyInfo[ID_FAMILY] = familyId;
        enemyInfo[ID_DIRECTION_X] = info[ID_DIRECTION_X];
        enemyInfo[ID_DIRECTION_Y] = info[ID_DIRECTION_Y];
        setLifeInfoAll(lifeMatrixNew, innerMatInfo[movePosY][movePosX].previousX, innerMatInfo[movePosY][movePosX].previousY, enemyInfo);
        innerMatInfo[innerMatInfo[movePosY][movePosX].previousY][innerMatInfo[movePosY][movePosX].previousX].previousX = innerMatInfo[movePosY][movePosX].previousX;
        innerMatInfo[innerMatInfo[movePosY][movePosX].previousY][innerMatInfo[movePosY][movePosX].previousX].previousY = innerMatInfo[movePosY][movePosX].previousY;
        setLifeInfoAll(lifeMatrixNew, x0, y0, info);
        innerMatInfo[y0][x0].previousX = x0;
        innerMatInfo[y0][x0].previousY = y0;
      } else {
        /* fight */
        info[ID_ALIVE] = (info[ID_ALIVE] < enemyInfo[ID_POWER]) ? 0: (info[ID_ALIVE] - enemyInfo[ID_POWER]);
        enemyInfo[ID_ALIVE] = (enemyInfo[ID_ALIVE] < info[ID_POWER]) ? 0: (enemyInfo[ID_ALIVE] - info[ID_POWER]);
        if(info[ID_ALIVE]==0)analInfo.numDeath++;
        if(enemyInfo[ID_ALIVE]==0)analInfo.numDeath++;
        
        
        if(info[ID_POWER] > enemyInfo[ID_POWER]){
          /* win: move to new position */
          setLifeInfoAll(lifeMatrixNew, innerMatInfo[movePosY][movePosX].previousX, innerMatInfo[movePosY][movePosX].previousY, enemyInfo);
          setLifeInfoAll(lifeMatrixNew, movePosX, movePosY, info);
          if(info[ID_ALIVE]){
            innerMatInfo[movePosY][movePosX].previousX = x0;
            innerMatInfo[movePosY][movePosX].previousY = y0;
          }
        } else {
          /* lose: keep current position */
          info[ID_DIRECTION_X] = Math.floor( Math.random() * 3 );
          info[ID_DIRECTION_Y] = Math.floor( Math.random() * 3 );
          setLifeInfoAll(lifeMatrixNew, x0, y0, info);
        } 
      }
    }
  }
}

function makeFamilyId(id1, id2){
  id1 /= 100;
  id1 %= 10;
  id2 /= 100;
  id2 %= 10;
  return Math.floor((id1+id2)*100/2)
}

function getFamilyId(id)
{
  id /= 100;
  id %= 10;
  id *= 100;
  return id;
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
}

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
