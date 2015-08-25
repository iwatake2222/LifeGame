/*
 *  Class for life game
 *  TextType = JavaScript
 */
"use strict";

/**
 * Structure of Life Info Matrix
 * memo: the same as lifeWorldThread
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


function LifeWorld()
{
  this.lifeMatrix;  // FIELD_WIDTH x FIELD_HEIGHT x NUM_INFO
  this.worker;   // thread
  this.analInfo = {numLife: 0, numDeath: 0, numBirth: 0}; //Analysis Information
  this.time = 0;
  this.calcTime = 1;
}

/**
 * init
 * Called: clearLife. must be called when field size changed
 * Action: Allocate Matrix
 */
LifeWorld.prototype.init = function()
{
  this.stopThread();
  this.time = 0;
  this.calcTime = 1;
  this.lifeMatrix = new Uint32Array(FIELD_WIDTH*FIELD_HEIGHT*NUM_INFO);
  for(var y = 0; y < FIELD_HEIGHT; y++){
    for(var x = 0; x < FIELD_WIDTH; x++){
      //setLifeInfo(x, y, ID_ALIVE, 0);
      for(var i = 0; i < NUM_INFO; i++){
        this.lifeMatrix[(y*FIELD_WIDTH + x)*NUM_INFO + i] = 0;
      }
    }
  }
};

/**
 * startThread
 * Called: at  press[p], press[s]
 * Action: Create and Start thread
 * @param {bool} continuous in thread: true = do loop forever, false = do loop once
 */
LifeWorld.prototype.startThread = function(continuous)
{
  if (this.worker != null) return;
  
  this.worker = new Worker("./js/lifeWorldThread.js");
  var obj = this;
  this.worker.addEventListener("message", function(e) {
    switch(e.data.type){
      case "comp":
        /* when Start once, comp returns before notify */
        obj.worker = null;
        obj.stopThread();
        break;
      case "notify":
        /* Worker Thread send modified Matrix each after calculation */
        obj.lifeMatrix = e.data.lifeMatrix;
        obj.analInfo = e.data.analInfo;
        obj.time++;
        /* measure performance */
        var endTime = new Date();
        obj.calcTime = endTime - fpsTimePrevious + 1; // to avoid 0 div
        fpsTimePrevious = endTime;
        break;
    }
    
  }, false);
  
  var fpsTimePrevious = new Date();
  if(continuous) {
    this.worker.postMessage({"cmd": "start", "width": FIELD_WIDTH, "height": FIELD_HEIGHT, "lifeMatrix": this.lifeMatrix, "timeout": getWaitTime()});
  } else {
    this.worker.postMessage({"cmd": "startOnce", "width": FIELD_WIDTH, "height": FIELD_HEIGHT, "lifeMatrix": this.lifeMatrix, "timeout": 0});
  }
};

/**
 * stopThread
 * Called: at press[p], mouseClick
 * Action: Stop and Eliminate thread
 */
LifeWorld.prototype.stopThread = function()
{
  if (this.worker == null) return;
  this.worker.terminate();
  this.worker = null;
   writeFooter(3, "fps = ---.--");
};


/**
 * makeMatrixRandom
 * Write : lifeMatrix
 * Action: InitializeMatrix at random
 * @param {double} threashold (0 - 1.0)
 */
LifeWorld.prototype.makeMatrixRandom = function(threashold, x0, y0, x1, y1)
{
  if(x0<0)x0=0;
  if(x1>=FIELD_WIDTH)x1=FIELD_WIDTH-1;
  if(y0<0)y0=0;
  if(y1>=FIELD_HEIGHT)y1=FIELD_HEIGHT-1;
  for(var y = y0; y <= y1; y++){
      for(var x = x0; x <= x1; x++){
        if(Math.random() <= threashold){
          this.setLifeInfo(x, y, ID_ALIVE, 1000);
        } else {
          this.setLifeInfo(x, y, ID_ALIVE, 0);
        }
      }
  }
};

/**
 * clearMatrix
 * Write : lifeMatrix
 * Action: All 0
 */
LifeWorld.prototype.clearMatrix = function()
{
  this.stopThread();
  for(var y = 0; y < FIELD_HEIGHT; y++){
      for(var x = 0; x < FIELD_WIDTH; x++){
        //this.setLifeInfo(x, y, ID_ALIVE, 0);
        for(var i = 0; i < NUM_INFO; i++){
          this.lifeMatrix[(y*FIELD_WIDTH + x)*NUM_INFO + i] = 0;
        }
      }
  }
};

/**
 * setLifeInfo
 * @param {int} x
 * @param {int} y
 * @param {int} id: e.g. ID_AGE
 * @param {int} data
 */
LifeWorld.prototype.setLifeInfo = function( x, y, id, data)
{
  this.lifeMatrix[(y*FIELD_WIDTH + x)*NUM_INFO + id] = data;
};

/**
 * setLifeInfoAll
 * @param {int} x
 * @param {int} y
 * @param {int} id: e.g. ID_AGE
 * @param {int[NUM_INFO]} info
 */
LifeWorld.prototype.setLifeInfoAll = function(x, y, info)
{
  if(info.length != NUM_INFO)return;
  for(var i = 0; i < NUM_INFO; i++){
    this.setLifeInfo(x, y, i, info[i]);
  }
};


/**
 * getLifeInfo
 * @param {int} x
 * @param {int} y
 * @param {int} id: e.g. ID_AGE
 * @returns {int} data
 */
LifeWorld.prototype.getLifeInfo = function( x, y, id)
{
  return this.lifeMatrix[(y*FIELD_WIDTH + x)*NUM_INFO + id];
};

/**
 * getLifeInfoAll
 * @param {int} x
 * @param {int} y
 * @returns {Uint32Array}
 */
LifeWorld.prototype.getLifeInfoAll = function(x, y)
{
  var info = new Uint32Array(NUM_INFO);
  for( var i = 0; i < NUM_INFO; i++){
    info[i] = this.getLifeInfo(x, y, i);
  }
  return info;
};

/**
 * checkBlock
 * Called: at mouse click
 * Write: lifeMatrix as alive
 */
LifeWorld.prototype.checkBlock = function(x, y, data, invert)
{
  if(invert) {
    if(this.getLifeInfo(x, y, ID_ALIVE) == 0) {
      this.setLifeInfo(x, y, ID_ALIVE, 1000);
    } else {
      this.setLifeInfo(x, y, ID_ALIVE, 0);
    }
  } else {
    this.setLifeInfo(x, y, ID_ALIVE, data);
  }
};
