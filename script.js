// GTG

const dcb = document.getElementById("draw-circle"), //draw circle button
  dlb = document.getElementById("draw-line"), // draw line button
  drb = document.getElementById("draw-rect"), //draw rectangle button
  bsb = document.getElementById("b-select"), //used for box select
  ssb = document.getElementById("s-select"), //used for stoke select
  csb = document.getElementById("c-select"), //used to copy selection
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
  currSel = undefined; // stores the current type of selection object
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
  bSel: select in box mode
  bSelOp: operation mode after box is selected
  sSel: select in stroke mode
  sSelInter: intermediate state after making the stroke and before sSelOp
  sSelOp: operation mode after stroke selection is done
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
      currSel.arr.push(new Object);
      Object.assign(currSel.arr[currSel.arr.length - 1], mouse);
      if (currSel.getPoints()){
        currMode = "bSelOp";
      }
      break;
    case "sSelInter":
      if (currSel.setSel()){
        currMode = "sSelOp";
      }else{
        currMode = "dFCurve";
      }
 
      currMode = "sSelOp";
      break;
    case "sSelOp":
    case "bSelOp":
      if (!currSel.inBox(mouse)){
        currSel.updBoard();
        updSelObj(currSel);
        drawAllObj();
        currSel = undefined;
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
  currSel = new BoxSelect() ;
  currSel.initObj(allObj, dim, ctx, bpb, spb);
});

//event listener for stroke select
ssb.addEventListener("click", function(){
  currMode = "sSel";
  currSel =  new StrokeSelect() ;
  currSel.initObj(allObj, dim, ctx, bpb, spb);
});

//event listener for copy selection
csb.addEventListener("click", function(){
  switch (currMode){
    case "bSelOp":
    case "sSelOp":
      let offset = JSON.parse(JSON.stringify(
        currSel.offset
      )); 
      for (let i = 0, obj; i < currSel.selObj.length; i++){
        
        obj = getObj(allObj[currSel.selObj[i]]);
        obj.setOffset(offset);
        allObj.push(obj);
        setBoard(allObj.length - 1);
      }
      break;
  }
})

//event listener for deleting selection
dsb.addEventListener("click", function(){
  switch (currMode){
    case "sSelOp":
    case "bSelOp":
      for (let i = 0, objInd; i < currSel.selObj.length; i++){
        objInd = currSel.selObj[i];
        if (allObj[objInd] != null){
          bpb.delPartObj(objInd);
          spb.delPartObj(objInd);
          allObj[objInd] = null;
        }
      }
      break;
  }
  
  drawAllObj();
  currMode = "dFCurve";
});

//event listener to clear canvas
ccb.addEventListener("click", function(){
  allObj.splice(0, allObj.length);
  currSel = undefined;
  bpb = new BoxPartBoard(allObj);
  spb = new StrokePartBoard(allObj);
  bpb.setNumParts(numParts);
  spb.setNumParts(numParts);
  currMode = "dFCurve";
  clearCanvas();
});

//event listener for color picker
cci.addEventListener("click", function(event){
 
  switch(currMode){
    case "sSelOp":
    case "bSelOp":
      currSel.isColorChanged = true;
      break;
  }
})

//event listener for color picker
cci.addEventListener("change", function(event){
  objColor = event.target.value;
  switch(currMode){
    case "sSelOp":
    case "bSelOp":
      currSel.isColorChanged = true;
      break;
  }  
});

//event listener for stroke size change
sss.addEventListener("change", function(){
  let i = sss.options.selectedIndex;
  objLineWidth = Math.round(4 * parseFloat(sss.options[i].value));
  switch(currMode){
    case "sSelOp":
    case "bSelOp":
      currSel.isSizeChanged = true;
      break;
  }
});

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
      case "sSel":
        currSel.getPoints(mouse);
        break;
      case "sSelOp":
      case "bSelOp":
        if (currSel.inBox(mouse)){
          currSel.moveSelObj(mouse);
        }
        break;
    }
  }

});

//responsive canvas sizing
window.addEventListener("resize", function(){
  resizeCanvas();
});

//to resize the canvas
function resizeCanvas(){
  canvas.width = window.innerWidth * 0.95;
  canvas.height = window.innerHeight * 0.90;
  dim.width = canvas.width;
  dim.height = canvas.height;

  //redraw all objects
  drawAllObj();
}

//method to make free line possible

canvas.addEventListener("mousedown", function(event){
  fMode = true;
  switch (currMode){
    case "dFCurve":
      allObj.push(initObj(new FreeLine()));
      break;
  }
});

canvas.addEventListener("mouseup", function(event){
  if (fMode){
    switch (currMode){
      case "dFCurve":
        setBoard(allObj.length - 1);
        break;
      case "sSel":
        currMode = "sSelInter";
        break;
    }
    fMode = false;
  }
});

resizeCanvas();
spb.setNumParts(numParts);
bpb.setNumParts(numParts);
// TYJC
