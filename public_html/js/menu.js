/***
 * menu.js
 * html menu wrappers
 */
"use strict";

var VERSION = "1.1.0";

function menuInit()
{
  menuViewGroup();
  menuAlgoCo_Ex();
}


function menuFieldSize()
{
  stopLife();
  if (isChromeApp) {  // for Chrome App
    var notification = new Notification("Sorry", {
      body: "This function is not supported on Chrome App",
    });
    return;
  } 
  
  var fieldSize = window.prompt("FieldSize (width height)", FIELD_WIDTH + " " + FIELD_HEIGHT);
  fieldSize = fieldSize.replace(/[\,, ,\/]/g, "-|-");
  fieldSize = fieldSize.split("-|-");
  var width = parseInt(fieldSize[0]);
  var height = parseInt(fieldSize[1]);
  if(isNaN(width) || isNaN(height))return;

  FIELD_WIDTH = width;
  FIELD_HEIGHT = height;
  clearLife();
  g_viewMain.initPosition();
}

function menuSave()
{
  stopLife();
  saveFile();
}

function menuLoad()
{
  stopLife();
  loadFile();
}

function menuViewGrid()
{
  var elem = document.getElementById("grid");
  if (elem.innerHTML == "Grid(OFF)"){
    g_viewMain.setGridDraw(true);
    elem.innerHTML = "Grid(ON)";
  } else {
    g_viewMain.setGridDraw(false);
    elem.innerHTML = "Grid(OFF)";
  }
}

function menuViewDecimation()
{
  var elem = document.getElementById("decimation");
  if (elem.innerHTML == "Decimation(OFF)"){
    g_viewMain.setDecimationDraw(3);
    elem.innerHTML = "Decimation(ON)";
  } else {
    g_viewMain.setDecimationDraw(0);
    elem.innerHTML = "Decimation(OFF)";
  }
}

function menuViewNoColor()
{
  var elem = document.getElementById("viewNoColor");
  if (elem.text == "* NO_COLOR"){
    return;
  } else {
    var otherElems = document.getElementsByClassName("viewInfo");
    for(var i = 0; i < otherElems.length ; i++){
      otherElems[i].text = otherElems[i].text.replace("*", "");
    }
    elem.text = "* NO_COLOR";
    g_viewMain.setShowInformation("NO_COLOR");
    g_viewMessage.setShowInformation("NO_COLOR");
  }
}

function menuViewAge()
{
  var elem = document.getElementById("viewAge");
  if (elem.text == "* AGE"){
    return;
  } else {
    var otherElems = document.getElementsByClassName("viewInfo");
    for(var i = 0; i < otherElems.length ; i++){
      otherElems[i].text = otherElems[i].text.replace("*", "");
    }
    elem.text = "* AGE";
    g_viewMain.setShowInformation("AGE");
    g_viewMessage.setShowInformation("AGE");
  }
}


function menuViewGroup()
{
  var elem = document.getElementById("viewGroup");
  if (elem.text == "* GROUP"){
    return;
  } else {
    var otherElems = document.getElementsByClassName("viewInfo");
    for(var i = 0; i < otherElems.length ; i++){
      otherElems[i].text = otherElems[i].text.replace("*", "");
    }
    elem.text = "* GROUP";
    g_viewMain.setShowInformation("GROUP");
    g_viewMessage.setShowInformation("GROUP");
  }
}

function menuViewType()
{
  var elem = document.getElementById("viewType");
  if (elem.text == "* TYPE"){
    return;
  } else {
    var otherElems = document.getElementsByClassName("viewInfo");
    for(var i = 0; i < otherElems.length ; i++){
      otherElems[i].text = otherElems[i].text.replace("*", "");
    }
    elem.text = "* TYPE";
    g_viewMain.setShowInformation("TYPE");
    g_viewMessage.setShowInformation("TYPE");
  }
}

function menuAlgoNormal()
{
  clearLife();
  var elem = document.getElementById("algoNormal");
  if (elem.text == "* NORMAL"){
    return;
  } else {
    var otherElems = document.getElementsByClassName("algorithm");
    for(var i = 0; i < otherElems.length ; i++){
      otherElems[i].text = otherElems[i].text.replace("*", "");
    }
    elem.text = "* NORMAL";
    g_lifeWorld.setAlgorithm("NORMAL");
    
    document.getElementById("txt_prm0").innerText="reserved";
    document.getElementById("txt_prm1").innerText="reserved";
    document.getElementById("txt_prm2").innerText="reserved";
    document.getElementById("txt_prm3").innerText="reserved";
  }
}

function menuAlgoCo_Ex()
{
  clearLife();
  var elem = document.getElementById("algoCo_Ex");
  if (elem.text == "* CO-EX"){
    return;
  } else {
    var otherElems = document.getElementsByClassName("algorithm");
    for(var i = 0; i < otherElems.length ; i++){
      otherElems[i].text = otherElems[i].text.replace("*", "");
    }
    elem.text = "* CO-EX";
    
    document.getElementById("txt_prm0").innerText="Cooperative";
    document.getElementById("range_prm0").value = 100;
    document.getElementById("num_range_prm0").value = 100;
    
    document.getElementById("txt_prm1").innerText="Lifespan";
    document.getElementById("range_prm1").value = 0;
    document.getElementById("num_range_prm1").value = 0;
    document.getElementById("range_prm1").max = 500;
    
    document.getElementById("txt_prm2").innerText="reserved";
    document.getElementById("txt_prm3").innerText="reserved";
    
    g_lifeWorld.setAlgorithm("CO_EX");
  }
}

function menuAlgoMove()
{
  clearLife();
  var elem = document.getElementById("algoMove");
  if (elem.text == "* MOVE"){
    return;
  } else {
    var otherElems = document.getElementsByClassName("algorithm");
    for(var i = 0; i < otherElems.length ; i++){
      otherElems[i].text = otherElems[i].text.replace("*", "");
    }
    elem.text = "* MOVE";
    g_lifeWorld.setAlgorithm("MOVE");
    
    document.getElementById("txt_prm0").innerText="reserved";
    document.getElementById("txt_prm1").innerText="reserved";
    document.getElementById("txt_prm2").innerText="reserved";
    document.getElementById("txt_prm3").innerText="reserved";
  }
}

function menuVersion()
{
  stopLife();
  if (isChromeApp) {  // for Chrome App
    var notification = new Notification("About This App", {
      body: "Life Game\nVersion" + VERSION + "\n\ncreated by take-iwiw",
    });
    return;
  } 
  alert("Life Game\nVersion" + VERSION + "\n\ncreated by take-iwiw");

}



/**
 * saveFile
 * Action: Save Matrix as CSV
 */
function saveFile()
{
  /* make date to write */
  var str = FIELD_WIDTH + "," + FIELD_HEIGHT+"\n";
  for(var y = 0; y < FIELD_HEIGHT; y++){
    for(var x = 0; x < FIELD_WIDTH; x++){
      if(g_lifeWorld.getLifeInfo(x, y, ID_ALIVE) != 0){
        str += x + "," + y;
        var info = g_lifeWorld.getLifeInfoAll(x, y);
        for( var i = 0; i < info.length; i++){
          str += "," + info[i];
        }
        str += "\n";
      }
    }
  }
  
  /* Save */
  var blob = new Blob([str], {"type": "text/plain"});
  window.URL = window.URL || window.webkitURL;
  var saveElem = document.getElementById("save");
  saveElem.setAttribute("href", window.URL.createObjectURL(blob));
  saveElem.setAttribute("download", "LifeGame_" + new Date());
  return;
}


/**
 * loadFile
 * Action: ResetAll and Load CSV
 */
function loadFile()
{
  openFileDialog(function(files){
    /* after file selected */
    var reader = new FileReader();
    reader.readAsText(files[0]);
    reader.onload = function(ev){
      /* after file read */
      var result = reader.result;
      result = result.replace("\r","");
      result = result.split("\n");

      /* read Field Size (line 1) */
      /* format: Width,Height */
      var fieldSize = result[0].split(",");
      if (fieldSize.length != 2) return;
      FIELD_WIDTH = parseInt(fieldSize[0]);
      FIELD_HEIGHT = parseInt(fieldSize[1]);
      g_viewMain.initPosition();
      /* renew at new Field Size */
      clearLife();
      g_viewMain.initPosition();
      /* read matrix data (line 2 - ...) */
      /* format: X,Y,data */
      for(var line = 1; line<result.length; line++){
        var infoStr = result[line].split(",");
        if (infoStr.length < 3) continue;
        var info = new Uint32Array(infoStr.length - 2);
        var x = parseInt(infoStr[0]);
        var y = parseInt(infoStr[1]);
        for(var i = 0; i < infoStr.length-2; i++){
          info[i] = parseInt(infoStr[i+2]);
        }
        g_lifeWorld.setLifeInfoAll(x, y, info);
        
      }
    };
  });
}


function openFileDialog(cb)
{
  var fileDialog = document.createElement("input");
  fileDialog.setAttribute("type","file");
  fileDialog.addEventListener("change", function(evt){
    cb(evt.target.files);
  },false);
  document.body.appendChild(fileDialog);
  fileDialog.click();
}

