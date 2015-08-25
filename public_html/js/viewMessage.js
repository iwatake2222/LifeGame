/*
 *  Class to draw message Canvas
 *  TextType = JavaScript
 */
 
"use strict";

function ViewMessage()
{
  /*** Const Variables ***/
  /* Margin between canvas and frame */
  this.MARGIN_CANVAS = 2;

  /* Adjust scale when line reaches the edge */
  this.graphScaleX = 1;
  this.graphScaleY = 0.001;    // Y data might be cery small, so start from small scale
  
  /* when clicked, adjust Y scale based on current Y */
  this.lastGraphX = 1; // need to remember current X;
  this.lastGraphY = 1; // need to remember current Y;
  this.offsetX=0;  // to restart graph, start count x from 0;
  

  /** Canvas Context**/
  this.cnvMessage;
  this.ctxMessage;
}

/*** Public Methods ***/
/**
 * init
 * Called: at onload
 */
ViewMessage.prototype.init = function()
{
  this.cnvMessage = document.getElementById("cnv_message");
  this.ctxMessage = this.cnvMessage.getContext('2d');
  
  this.cnvMessage.style.margin = this.MARGIN_CANVAS + "px";

  /* left click = Adjust Graph Size */
  var obj = this;
  this.cnvMessage.addEventListener("click", function(e){
    if(e.button === 0){ /* left Click */
      obj.clearGraph();
      /* Adjust Y scale */
      if(obj.lastGraphY<0.001)obj.lastGraphY=1;
      obj.graphScaleY = (obj.lastGraphY*2)/obj.cnvMessage.height;
      obj.offsetX = obj.lastGraphX;
    }
  });


  setTimeout(function() {
    obj.timerHandlerDraw();}, 100
  );
  
};

/**
 * resize
 * Called: at window resize
 * Write: Canvas Size
 * Action: resize canvas size
 *         begin to draw graph from canvasX=0
 */
ViewMessage.prototype.resize = function()
{
  var div_message = document.getElementById("div_messageCanvas");
  this.cnvMessage.width = div_message.offsetWidth - this.MARGIN_CANVAS*2;
  this.cnvMessage.height = div_message.offsetHeight - this.MARGIN_CANVAS*2;
  this.clearGraph();
  if(g_lifeWorld.time != 0){
    this.offsetX = this.lastGraphX;
  }
};

/**
 * _timerHandlerDraw
 * Called: timer
 * Action: Draw AnalysisInfo
 */
ViewMessage.prototype.timerHandlerDraw = function()
{
  /* Show Time */
  writeFooter(3, "time = " + g_lifeWorld.time);
  
  /* Show Fps */
  var fps = (1000/g_lifeWorld.calcTime).toFixed(2);
  var fpsStr = "000" + fps.toString();
  fpsStr = fpsStr.substr(fpsStr.length-6);
  writeFooter(4, "fps = " + fpsStr);
  
  /* Show Analysis Info */
  this.showAnalysisInfo();
  
  /* Restart Timer for next analysis (predict next time by current fps) */
  var obj = this;
  setTimeout(function() {
    obj.timerHandlerDraw();}, g_lifeWorld.calcTime
  );
};



/**
 * drawGraph
 * Called: from timerHandler
 * Action: DrawGraph. convert x, y into values on graph
 * @param {int} x = time (absolute value)
 * @param {int} y = any data (absolute value)
 * @param {string} color = "rgb(0,255,0)"
 */
ViewMessage.prototype.drawGraph = function(x, y, color)
{
  this.lastGraphX = x;
  this.lastGraphY = y;
  x -= this.offsetX;   // after ajusted Y (clicked), offset can be set 

  /* when reach right edge, stretch 1/2 and change scale */
  if(x > this.cnvMessage.width * this.graphScaleX) {
    this.stretchCanvasX(0.5);
    this.graphScaleX *= 2;
  }
  x /= this.graphScaleX;
  
  /* when reach top edge, stretch 1/2 and change scale */
  if(y > this.cnvMessage.height * this.graphScaleY) {
    this.stretchCanvasY(0.5);
    this.graphScaleY *= 2;
  }
  y = this.cnvMessage.height - y/this.graphScaleY - 1;

  var preFillStyle = this.ctxMessage.fillStyle;
  this.ctxMessage.fillStyle = color;
  this.ctxMessage.fillRect(x, y, 1, 1);
  this.ctxMessage.fillStyle = preFillStyle;
};

ViewMessage.prototype.clearGraph = function()
{
  this.graphScaleX = 1;
  this.graphScaleY = 0.01;
  this.offsetX = 0;
  this.ctxMessage.fillRect(0, 0, this.cnvMessage.width, this.cnvMessage.height);
};

ViewMessage.prototype.stretchCanvasY = function(scale)
{ 
  var imageData = this.ctxMessage.getImageData(0, 0, this.cnvMessage.width, this.cnvMessage.height);
  var newCanvas = document.createElement("canvas");
  newCanvas.setAttribute("width",imageData.width);
  newCanvas.setAttribute("height",imageData.height);
  newCanvas.getContext("2d").putImageData(imageData, 0, 0);
  this.ctxMessage.fillRect(0, 0, this.cnvMessage.width, this.cnvMessage.height);
  this.ctxMessage.drawImage(newCanvas, 0, this.cnvMessage.height*scale, this.cnvMessage.width, this.cnvMessage.height*scale);
};

ViewMessage.prototype.stretchCanvasX = function(scale)
{ 
  var imageData = this.ctxMessage.getImageData(0, 0, this.cnvMessage.width, this.cnvMessage.height);
  var newCanvas = document.createElement("canvas");
  newCanvas.setAttribute("width",imageData.width);
  newCanvas.setAttribute("height",imageData.height);
  newCanvas.getContext("2d").putImageData(imageData, 0, 0);
  this.ctxMessage.fillRect(0, 0, this.cnvMessage.width, this.cnvMessage.height);
  this.ctxMessage.drawImage(newCanvas, 0, 0, this.cnvMessage.width*scale, this.cnvMessage.height);
};


/**
 * showAnalysisInfo
 * memo: modify here to change how to show information
 */
ViewMessage.prototype.showAnalysisInfo = function()
{
  /* Show Life Count */
  writeFooterRight(0, " Life = " + g_lifeWorld.analInfo.numLife);
  this.drawGraph(g_lifeWorld.time, g_lifeWorld.analInfo.numLife, "rgb(255,255,255)");
  writeFooterRight(3, " Birth = " + g_lifeWorld.analInfo.numBirth);
  //this.drawGraph(g_time, g_lifeWorld.analInfo.numBirth, "rgb(255,255,0)");
  writeFooterRight(4, " Death = " + g_lifeWorld.analInfo.numDeath);
  //this.drawGraph(g_time, g_lifeWorld.analInfo.numDeath, "rgb(0,255,255)");
  
  /* Show Age */
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
  writeInfo(0, "age/time = <br>0-29: " + ageArray[0], "#FF0000");
  this.drawGraph(g_lifeWorld.time, ageArray[0], "#FF0000");
  writeInfo(1, "30-59: " + ageArray[1], "#00FF00");
  this.drawGraph(g_lifeWorld.time, ageArray[1], "#00FF00");
  writeInfo(2, "60-89: " + ageArray[2], "#0000FF");
  this.drawGraph(g_lifeWorld.time, ageArray[2], "#0000FF");
  writeInfo(3, "90-100: " + ageArray[3], "#FF00FF");
  this.drawGraph(g_lifeWorld.time, ageArray[3], "#FF00FF");
  
};
