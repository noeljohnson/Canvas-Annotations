// GTG

const dcb = document.getElementById("draw-circle"), //draw circle button
  dlb = document.getElementById("draw-line"), // draw line button
  drb = document.getElementById("draw-rect"), //draw rectangle button
  bsb = document.getElementById("b-select"), //used for box select
  ssb = document.getElementById("s-select"), //used for stoke select
  dsb = document.getElementById("del-sel"), //used to delete selections
  ccb = document.getElementById("clr-canvas"), //used to clear canvas button
  cci = document.getElementById("col-choice"), //get the color
  sss = document.getElementById("ssize-choice"), //get relative stroke size
  canvas = document.getElementById("canvas1"), // canvas element
  ctx = canvas.getContext("2d"), // canvas context
  dim = {width: canvas.width, height: canvas.height}, //stores the dimensions of the canvas
  mouse = {x: undefined, y : undefined}, // stores mouse position in the canvas
  allObj = [], // will store all objects
  numParts = 32; //number of partitions

let currMode = "dFCurve", //will store the current mode being used
  fMode = false, // stores if in free mode or not 
  objColor = "#000000", // global variable for object color
  objLineWidth = 4, // global variable for object line width
  boxSel = undefined, // global variable for box select
  strokeSel = undefined, // global variable for stroke select
  bpb = new BoxPartBoard(allObj), // will be used for box based partition
  spb = new StrokePartBoard(allObj); // partition board for partition based searching;


// sets the objects to global defaults
function initObj(obj){
  obj.setCtx(ctx);
  obj.setDim(dim);
  obj.setColor(objColor);
  obj.setLineWidth(objLineWidth);
  return(obj);
}

function updColor(obj){
  obj.setColor(objColor);
}

function updLineWidth(obj){
  obj.setLineWidth(objLineWidth);
}

// update selected objects using index
function updSelObj(sel){
  let selObjIndices = sel.selObj,
    uc = sel.isColorChanged,
    us = sel.isSizeChanged;
  for (let i = 0, objIndex; i < selObjIndices.length; i++){
    objIndex = selObjIndices[i];
    if (allObj[objIndex] != null){
      if (uc){
        updColor(allObj[objIndex]); 
      }
      if (us){
        updLineWidth(allObj[objIndex]);
      }
    }
  }
}

// sets the boards appropriately
function setBoard(objIndex){
  let obj = allObj[objIndex];
  obj.setBoard(bpb, spb, objIndex);
}

function clearCanvas(){
  ctx.clearRect(0, 0, dim.width, dim.height);
}

// draw all objects
function drawAllObj(){
  clearCanvas();
  for (let i = 0; i < allObj.length; i++){
    if (allObj[i] != null){
      allObj[i].draw();
    }
  }
}


/*

  Following are the list of modes:
  dCircle: drawing circle
  dLine: draw line
  dRect: draw Rectangle
  dFCurve: draw a free curve
  bSel: selet in box mode
  bSelOp: operation mode after box is selected
*/

// handler for drawing shapes
canvas.addEventListener("click", function(){
  let currObj = allObj[allObj.length - 1];
  
  switch(currMode){
    case "dCircle":
    case "dLine":
    case "dRect":
      currObj.arr.push(new Object());
      Object.assign(currObj.arr[currObj.arr.length - 1], mouse);
      if (currObj.getPoints()){
        currMode = "dFCurve";
        setBoard(allObj.length - 1);
      }
      break;
    case "bSel":
      boxSel.arr.push(new Object);
      Object.assign(boxSel.arr[boxSel.arr.length - 1], mouse);
      if (boxSel.getPoints()){
        currMode = "bSelOp";
      }
      break;
    case "bSelOp":
      if (!boxSel.inBox(mouse)){
        boxSel.updBoard();
        updSelObj(boxSel);
        drawAllObj();
        boxSel = undefined;
        currMode = "dFCurve";
      }
      break;
    case "dFCurve":
      break;
    default:
      console.log(currMode);
      break;
  }
});

//event listener for draw line 
dlb.addEventListener("click", function(){
  currMode = "dLine";
  allObj.push(initObj(new Line()));
});

//event listener for draw circle
dcb.addEventListener("click", function(){
  currMode = "dCircle";
  allObj.push(initObj(new Circle()));
});

//event listener for draw rectangle
drb.addEventListener("click", function(){
  currMode = "dRect";
  allObj.push(initObj(new Rectangle()));
});

//event listener for box select
bsb.addEventListener("click", function(){
  currMode = "bSel";
  boxSel = new BoxSelect() ;
  boxSel.initObj(bpb, allObj, dim, ctx);
});

//event listener for deleting selection
dsb.addEventListener("click", function(){
  if (currMode == "bSelOp"){
    for (let i = 0, objInd; i < boxSel.selObj.length; i++){
      objInd = boxSel.selObj[i];
      if (allObj[objInd] != null){
        bpb.delPartObj(objInd);
        spb.delPartObj(objInd);
        allObj[objInd] = null;
      }
    }
  }
  
  drawAllObj();
  currMode = "dFCurve";
}),

//event listener to clear canvas
ccb.addEventListener("click", function(){
  allObj.splice(0, allObj.length);
  boxSel = undefined;
  strokeSel = undefined;
  bpb = new BoxPartBoard(allObj);
  spb = new StrokePartBoard(allObj);
  bpb.setNumParts(numParts);
  spb.setNumParts(numParts);
  clearCanvas();
})

//event listener for color picker
cci.addEventListener("change", function(event){
  objColor = event.target.value;
  switch(currMode){
    case "bSelOp":
      boxSel.isColorChanged = true;
      break;
  }  
});

//event listener for stroke size change
sss.addEventListener("change", function(){
  let i = sss.options.selectedIndex;
  objLineWidth = Math.round(4 * parseFloat(sss.options[i].value));
  switch(currMode){
    case "bSelOp":
      boxSel.isSizeChanged = true;
      break;
  }
})

//marks the mouse movement
canvas.addEventListener("mousemove", function(event){
  mouse.x = (event.x - canvas.getBoundingClientRect().x) / dim.width;
  mouse.y = (event.y - canvas.getBoundingClientRect().y) / dim.height;
  if (fMode){
    switch(currMode){
      case "dFCurve":
        let currObj = allObj[allObj.length - 1];
        currObj.arr.push(new Object());
        Object.assign(currObj.arr[currObj.arr.length - 1], mouse);
        currObj.getPoints();
        break;
      case "bSelOp":
        if (boxSel.inBox(mouse)){
          boxSel.moveSelObj(mouse);
        }
        break;
    }
  }

})

//responsive canvas sizing
window.addEventListener("resize", function(){
  resizeCanvas();
})

//to resize the canvas
function resizeCanvas(){
  canvas.width = window.innerWidth * 0.90;
  canvas.height = window.innerHeight * 0.90;
  dim.width = canvas.width;
  dim.height = canvas.height;

  //redraw all objects
  drawAllObj();
}

//method to make free line possible

canvas.addEventListener("mousedown", function(event){
  fMode = true;
  if (currMode == "dFCurve"){
    allObj.push(initObj(new FreeLine()));
  }
});

canvas.addEventListener("mouseup", function(event){
  if (fMode){
    if (currMode == "dFCurve"){
      setBoard(allObj.length - 1);
    }
    fMode = false;
  }
})

resizeCanvas();
spb.setNumParts(numParts);
bpb.setNumParts(numParts);
// TYJC
