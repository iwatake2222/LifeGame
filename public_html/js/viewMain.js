/*
 *  Class to draw main Canvas
 *  TextType = JavaScript
 */
 
"use strict";

function ViewMain()
{
  /*** Const Variables ***/
  /* Margin between canvas and frame (px)*/
  this.MARGIN_CANVAS = 10;
  /* Minimum size to show. unit = block (not pixel) */
  this.FOCUSED_SIZE_MIN = 10;
  
  /*** Private Variables ***/
  /** Position on Field. unit = block (not pixel) **/
  this.posX = Math.floor(FIELD_WIDTH/2 - 0.1);
  this.posY = Math.floor(FIELD_HEIGHT/2 - 0.1);
  /* 100% = same range as field
   * 1%   = the range which can contain FOCUSED_SIZE_MIN */
  this.posZ = 100;

  /** Focused area size and position. unit = block (not pixel) */
  this.focusedWidth = 64;
  this.focusedHeight = 48;
  this.focusedAreaX0 = FIELD_WIDTH/2 - Math.floor(this.focusedWidth/2);
  this.focusedAreaX1 = FIELD_WIDTH/2 + Math.floor(this.focusedWidth/2);
  this.focusedAreaY0 = FIELD_HEIGHT/2 - Math.floor(this.focusedHeight/2);
  this.focusedAreaY1 = FIELD_HEIGHT/2 + Math.floor(this.focusedHeight/2);
  
  /** canvas / focusedArea **/
  this.drawScale = 10;

  /** Canvas Context**/
  this.cnvMain;
  this.ctxMain;
  
  /* Skip draw to make the process light (esp. field size = big) */
  this.drawInterval = 0;
  
  /* Flag to draw grid line */
  this.drawGrid = true;

  /* Use Color to draw life */
  this.useColor = false;

}

/**
 * init
 * Called: at onload
 */
ViewMain.prototype.init = function()
{
  this.cnvMain = document.getElementById("cnv_main");
  this.ctxMain = this.cnvMain.getContext('2d');
  
  this.cnvMain.style.margin = this.MARGIN_CANVAS + "px";
  
  this.initPosition();
  
  var obj = this;
  setTimeout(function() {
    obj.timerHandlerDraw();}, 100
  );

};


ViewMain.prototype.initPosition = function()
{
  this.posX = Math.floor(FIELD_WIDTH/2 - 0.1);
  this.posY = Math.floor(FIELD_HEIGHT/2 - 0.1);
  this.posZ = 5;
  this.changeFocusedAreaSize();
};

/**
 * changeFocusedAreaSize
 * Called: at mouse scroll(posZ change), window resize)
 * Write: focusedWidth/Height, drawScale, focusedArea
 * Action: none (draw at timerHandler)
 */
ViewMain.prototype.changeFocusedAreaSize = function()
{
  var aspectField = FIELD_WIDTH / FIELD_HEIGHT;
  var aspectCanvas = this.cnvMain.width / this.cnvMain.height;
  if (aspectField > aspectCanvas){
    var b = FIELD_WIDTH - (FIELD_WIDTH - this.FOCUSED_SIZE_MIN) / (100 - 1) * 100; // y = ax + b -> b = y - ax (at x=100%)
    this.focusedWidth = Math.floor((FIELD_WIDTH - this.FOCUSED_SIZE_MIN) / (100 - 1) * this.posZ + b);
    this.focusedHeight = Math.floor(this.focusedWidth * this.cnvMain.height / this.cnvMain.width);
  } else {
    var b = FIELD_HEIGHT - (FIELD_HEIGHT - this.FOCUSED_SIZE_MIN) / (100 - 1) * 100; // y = ax + b -> b = y - ax (at x=100%)
    this.focusedHeight = Math.floor((FIELD_HEIGHT - this.FOCUSED_SIZE_MIN) / (100 - 1) * this.posZ + b);
    this.focusedWidth = Math.floor(this.focusedHeight * this.cnvMain.width / this.cnvMain.height);
  }
  //console.log("visible W:H = " + _focusedWidth + ", " + _focusedHeight);

  /* Don't care height b/c aspect is the same */
  this.drawScale = this.cnvMain.width / this.focusedWidth;
  //console.log(_focusedWidth);

  this.changeFocusecAreaRect();
};

/**
 * changeFocusecAreaRect
 * Called: at mouse drag, from changeFocusedAreaSize
 * Write: focusedArea
 * Action: none (draw at timerHandler)
 */
ViewMain.prototype.changeFocusecAreaRect = function()
{
  /*
   * ex. _posX=6
   *   when w = 3, x0 = 5, x1 = 7
   *   when w = 4, x0 = 5, x1 = 8
   */
  this.focusedAreaX0 = this.posX - Math.floor(this.focusedWidth/2 - 0.1);
  this.focusedAreaX1 = this.posX + Math.floor(this.focusedWidth/2);
  this.focusedAreaY0 = this.posY - Math.floor(this.focusedHeight/2 - 0.1);
  this.focusedAreaY1 = this.posY + Math.floor(this.focusedHeight/2);
  //console.log("visibleRect = " + this.focusedAreaX0 + "-" + this.focusedAreaX1 + " ," + this.focusedAreaY0 + "-" + this.focusedAreaY1);
  
  writeFooter(0, "X = " + this.posX + ", Y = " + this.posY + ", Z = " + this.posZ);
};



/**
 * _drawGridLines
 * Called: from timerHandler
 * Action: Draw Grid Line
 */
ViewMain.prototype.drawGridLines = function()
{
  /* Glid Line interval depends on scale */
  var interval = this.getGridInterval(this.drawScale);

  var preFillStyle = this.ctxMain.fillStyle;
  this.ctxMain.strokeStyle = 'rgb(50,50,50)';
  this.ctxMain.beginPath();
  for ( var x = this.focusedAreaX0; x <= this.focusedAreaX1+1; x += interval ){
    if( x < 0 || x > FIELD_WIDTH )continue;
    //this.ctxMain.moveTo(this.drawScale*(x-this.focusedAreaX0 + this.focusedAreaX0%(interval+2)), 0);
    this.ctxMain.moveTo(this.drawScale*(x-this.focusedAreaX0), 0);
    this.ctxMain.lineTo(this.drawScale*(x-this.focusedAreaX0), this.cnvMain.height);
  }

  for ( var y = this.focusedAreaY0; y <= this.focusedAreaY1 + 1; y += interval ){
    if( y < 0 || y > FIELD_HEIGHT )continue;
    this.ctxMain.moveTo(0, this.drawScale*(y-this.focusedAreaY0));
    this.ctxMain.lineTo(this.cnvMain.width, this.drawScale*(y-this.focusedAreaY0));
  }
  this.ctxMain.stroke();
  
  this.ctxMain.strokeStyle = preFillStyle;
};


/**
 * getGridInterval
 * Called: from drawField
 * Action: Calc Glid Line Interval
 *         When there are a few blocks on canvas, try to draw grids b/w each blocks.
 *         When there are many blocks on canvas, try to thin-out.
 *         When there are too many blocks on canvas, do not draw grid line.
 * @param {double} scale: canvasSize/focusedSize = reverse of the number of blocks on canvas
 * @returns {int} interval
 */
ViewMain.prototype.getGridInterval = function(scale)
{
  var interval = 1;
  if(scale >= 10) {
    interval = 1;
  } else if(scale >= 2.5) {
    interval = 4;
  } else if(scale >= 1) {
    interval = 10;
  } else {
    interval = 99999;
  }
  return interval;
};

/**
 * resize
 * Called: at window resize
 * Write: Canvas Size
 * Action: resize canvas size
 *         recalc focused area size
 */
ViewMain.prototype.resize = function()
{
  var div_main = document.getElementById("div_main");
  this.cnvMain.width = div_main.offsetWidth - this.MARGIN_CANVAS*2;
  this.cnvMain.height = div_main.offsetHeight - this.MARGIN_CANVAS*2;
  this.ctxMain.fillRect(0, 0, this.cnvMain.width, this.cnvMain.height);
  
  this.changeFocusedAreaSize();
};

/**
 * changePos
 * Called: at mouse drag
 * Write: posX/Y
 * Action: recalc focused area
 */
ViewMain.prototype.changePos = function(dx, dy)
{
  var testPosX = this.posX + dx;
  var testPosY = this.posY + dy;
  if(testPosX>=0 && testPosX < FIELD_WIDTH) {
    this.posX = testPosX;
  }
  if(testPosY>=0 && testPosY < FIELD_HEIGHT) {
    this.posY = testPosY;
  }
  this.changeFocusecAreaRect();
};

/**
 * setDecimationDraw
 */
ViewMain.prototype.setDecimationDraw = function(interval)
{
  this.drawInterval = interval;
};

/**
 * setGridDraw
 */
ViewMain.prototype.setGridDraw = function(on)
{
  this.drawGrid = on;
};

/**
 * setUseColor
 */
ViewMain.prototype.setUseColor = function(on)
{
  this.useColor = on;
};


/**
 * getMoveScale
 * called: from controllerMain to adjust move (mouse)
 *         dx(on field) = mouseDx / getMoveScale, 
 * @returns {int} 
 */
ViewMain.prototype.getMoveScale = function()
{
  return this.drawScale;
};

/**
 * getMoveScaleKey
 * called: from controllerMain to get a move / 1 key down
 * @returns {int} 
 */
ViewMain.prototype.getMoveScaleKey = function()
{
  if(FIELD_WIDTH > FIELD_HEIGHT) {
    return Math.floor(1 + (FIELD_HEIGHT / 10) * (this.posZ-1)/100);
  } else {
    return Math.floor(1 + (FIELD_WIDTH / 10) * (this.posZ-1)/100);
  }
};

/**
 * changeZdelta
 * Called: at mouse scroll
 * Write: posZ
 * Action: recalc focused area Size
 */
ViewMain.prototype.changeZdelta = function(dz)
{
  var testPosZ = this.posZ + dz;
  if( testPosZ < 1 ) testPosZ = 1;
  if( testPosZ > 100 ) testPosZ = 100;
  this.posZ = testPosZ;
  this.changeFocusedAreaSize();
};

/**
 * changeZ
 * Called: at mouse scroll
 * Write: posZ
 * Action: recalc focused area Size
 */
ViewMain.prototype.changeZ = function(z)
{
  if( z < 1 ) z = 1;
  if( z > 100 ) z = 100;
  this.posZ = z;
  
  this.changeFocusedAreaSize();
};

/**
 * convertCanvasToField
 * called: from controllerMain
 *         dx(on field) = mouseDx / getMoveScale, 
 * @returns {array} positions(x0, y0, x1, y1, ...)
 */
ViewMain.prototype.convertCanvasToField = function(canvasX, canvasY)
{
  var blockX = this.focusedAreaX0 + Math.floor(canvasX/this.drawScale);
  var blockY = this.focusedAreaY0 + Math.floor(canvasY/this.drawScale);
  
  if( blockX < 0 ) blockX = 0;
  if( blockX >= FIELD_WIDTH ) blockX = FIELD_WIDTH;
  if( blockY < 0 ) blockY = 0;
  if( blockY >= FIELD_HEIGHT ) blockY = FIELD_HEIGHT;
  var array = new Array(blockX, blockY);
  return array;
};

/**
 * _timerHandlerDraw
 * Called: timer
 * Action: Draw Field and LifeMatrix
 */
ViewMain.prototype.timerHandlerDraw = function()
{
  var startTime = new Date();
  
  this.ctxMain.fillRect(0, 0, this.cnvMain.width, this.cnvMain.height);
  
  /* draw gridLine */
  if(this.drawGrid) {
    this.drawGridLines();
  }
  
  /* draw lifeMatrix */
  this.showLifeMatrix();
  
  /* measure performance */
  var endTime = new Date();
  var time = endTime - startTime;
  time += 50;
  var fps = (1000/time).toFixed(2);
  var fpsStr = "000" + fps.toString();
  fpsStr = fpsStr.substr(fpsStr.length-6);
  writeFooter(5, "fpsDraw = " + fpsStr);

  var obj = this;
  setTimeout(function() {
    obj.timerHandlerDraw();}, 50
  );
};


/**
 * showLifeMatrix
 * memo: modify here to change how to show life matrix
 */
ViewMain.prototype.showLifeMatrix = function()
{
  var preFillStyle = this.ctxMain.fillStyle;
  this.ctxMain.fillStyle = "#FFFFFF";
  
  for(var y = 0; y < FIELD_HEIGHT; y+=this.drawInterval+1){
    if( y < this.focusedAreaY0 || y > this.focusedAreaY1 )continue;
    for(var x = 0; x < FIELD_WIDTH; x+=this.drawInterval+1){
      if( x < this.focusedAreaX0 || x > this.focusedAreaX1 )continue;
      
      if( g_lifeWorld.getLifeInfo(x, y, ID_ALIVE) != 0){
        
        if(this.useColor) {
          var age = g_lifeWorld.getLifeInfo(x, y, ID_AGE)/g_lifeWorld.time;
          if(age<0.3) {
            this.ctxMain.fillStyle = "#FF0000";
          } else if(age<0.6) {
            this.ctxMain.fillStyle = "#00FF00";
          } else if(age<0.9) {
            this.ctxMain.fillStyle = "#0000FF";
          } else {
            this.ctxMain.fillStyle = "#FF00FF";
          }
        }
        this.ctxMain.fillRect(
          this.drawScale*(x-this.focusedAreaX0)+1, 
          this.drawScale*(y-this.focusedAreaY0)+1, 
          this.drawScale * (1+this.drawInterval),
          this.drawScale * (1+this.drawInterval));
        //console.log(mat[y][x]);
      }
    }
  }
  this.ctxMain.fillStyle = preFillStyle;

};