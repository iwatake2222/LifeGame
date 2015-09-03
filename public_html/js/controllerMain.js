/*
 *  Class to controll Main Canvas
 *  controller of view Main (main canvas)
 *  TextType = JavaScript
 */
"use strict";


function ControllerMain(view)
{
  this.view = view;
  this.initialized = false;  // to avoid duplicate event listener
}

/**
 * init
 * Called: at onload (only once)
 */
ControllerMain.prototype.init = function()
{
  if(this.initialized)return;
  this.initialized = true;
  this.setMouseEventListener();
  this.setKeyEvents();
};


/**
 * setMouseEventListener
 * Called: at onload
 * Action: left click = check block
 *         left drag  = check blocks
 *         right drag = posX/Y move
 *         scroll     = posZ move
 */
ControllerMain.prototype.setMouseEventListener = function()
{
  var view = this.view;
  var cnvMain = view.cnvMain;
  
  /* Disable Right Click Context menu */
  document.body.oncontextmenu = function(){return false;};

  /* left click = check block */
  /*  -> do this at mouse down */
  cnvMain.addEventListener("click", function(e){
    if(e.button === 0){ /* left Click */
      //checkBlock(e, true);
    }
  });
  
  /* scroll = posZ */
  cnvMain.addEventListener("mousewheel" , function(e){
    var delta = (-e.wheelDelta / 60);
    view.changeZdelta(delta);
  });
  // for FireFox
  cnvMain.addEventListener("DOMMouseScroll" , function(e){
    var delta = (e.detail*2);
    view.changeZdelta(delta);
  });
  /*
   * left drag  = check blocks
   * right drag = position move
   */
  var mouseLeftPrePosX = -1;
  var mouseLeftPrePosY = -1;
  var mouseRightPrePosX = -1;
  var mouseRightPrePosY = -1;
  cnvMain.addEventListener("mousedown", function(e){
    if(e.button === 0){  /* left Click */
      stopLife();
      checkBlock(e, true);
      mouseLeftPrePosX = -1;
      mouseLeftPrePosX = -1;
      cnvMain.addEventListener("mousemove", cbDragCheckBlocks);
    } else if(e.button === 2){  /* right Click */
      mouseRightPrePosX = -1;
      mouseRightPrePosY = -1;
      cnvMain.addEventListener("mousemove", cbDragPosition);
    }
  });
  
  /* removeListenr when drag stop */
  cnvMain.addEventListener("mouseup", function(e){
    if(e.button === 0){  /* left Click */
      cnvMain.removeEventListener("mousemove", cbDragCheckBlocks);
    } else if(e.button === 2){  /* right Click */
      cnvMain.removeEventListener("mousemove", cbDragPosition);
    }
  });
  
  /* removeListenr when off focuse during drag */
  cnvMain.addEventListener("mouseout", function(e){
    cnvMain.removeEventListener("mousemove", cbDragCheckBlocks);
    cnvMain.removeEventListener("mousemove", cbDragPosition);
  });

  /**
   * Called at drag for position change
   */
  function cbDragPosition(e)
  {
    var canvasRect = e.target.getBoundingClientRect();
    var mouseX = Math.floor(e.clientX - canvasRect.left);
    var mouseY = Math.floor(e.clientY - canvasRect.top);

    if(mouseRightPrePosX === -1){
      mouseRightPrePosX = mouseX;
      mouseRightPrePosY = mouseY;
    } else {
      var dx = mouseX - mouseRightPrePosX;
      var dy = mouseY - mouseRightPrePosY;
      if(Math.abs(dx) > view.getMoveScale()){
        mouseRightPrePosX = mouseX;
        dx = Math.floor(dx/view.getMoveScale());
      } else {
        dx = 0;
      }
      if(Math.abs(dy) > view.getMoveScale()){
        mouseRightPrePosY = mouseY;
        dy = Math.floor(dy/view.getMoveScale());
      } else {
        dy = 0;
      }
      view.changePos(-dx, -dy);
      //console.log(dx + " " + dy);
    }
  }
  
  /**
   * Called at drag for check blocks
   */
  function cbDragCheckBlocks(e)
  {
    checkBlock(e, false);
  }
  
  function checkBlock(e, convert){
      var canvasRect = e.target.getBoundingClientRect();
      var mouseX = Math.floor(e.clientX - canvasRect.left);
      var mouseY = Math.floor(e.clientY - canvasRect.top);
      var pointsArray = view.convertCanvasToField(mouseX, mouseY);
      //var pointsArray = new Array(0, 1, 2, 3);
      for(var i=0; i < pointsArray.length; i+=2) {
        g_lifeWorld.checkBlock(pointsArray[i], pointsArray[i+1], convert);
      }
      
  }
};

/**
 * setKeyEvents
 * Called: at onload
 * Action: p       = pause
 *         s       = step
 *         cursors = position move
 *         z/x     = posZ move
 */
ControllerMain.prototype.setKeyEvents = function()
{
  var view = this.view
  document.onkeydown = function (e) {
    switch (e.keyCode) {
      case 80:  //P
        latchLife();
        break;
      case 83:  //S
        g_lifeWorld.startThread(false);
        break;
      case 88:  //X
        view.changeZdelta(2);
        break;
      case 90:  //Z
        view.changeZdelta(-2);
        break;
      case 37:  //<-
        view.changePos(-view.getMoveScaleKey(), 0);
        break;
      case 38:  //^
        view.changePos(0, -view.getMoveScaleKey());
        break;
      case 39:  //->
        view.changePos(view.getMoveScaleKey(), 0);
        break;
      case 40:  //under arrow
        view.changePos(0, view.getMoveScaleKey());
        break;
      default:
        break;
    }
    
  };
};


