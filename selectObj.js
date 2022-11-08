//GTG

class SelectObj{
  
  constructor(){
    this.rcr = 8;
    this.sl = 15;
    this.arr = [];
    this.board = undefined;
    this.allObj = undefined;
    this.selObj = [];
    this.dim = undefined;
    this.ctx = undefined;
    this.offset = {x: 0, y:0};
    this.boolObjInd = [];
    this.isColorChanged = false;
    this.isSizeChanged = false;
    this.bpb = undefined;
    this.spb = undefined;
    this.rightCenter = undefined;
    this.downCenter = undefined;
    this.deltaX = undefined;
    this.deltaY = undefined;
    this.min = {x: undefined, y: undefined};
    this.max = {x: undefined, y: undefined};
  }


  setResizeLimits(){
    
    let maxX = 0.5,
      maxY = 0.5,
      minX = 1.5,
      minY = 1.5;

    for (let i = 0, obj; i < this.selObj.length; i++){
      obj = this.allObj[this.selObj[i]];
      if (obj !== null){
        if (maxX < obj.scale.x){
          maxX = obj.scale.x;
        } else if (minX > obj.scale.x){
          minX = obj.scale.x;
        }

        if (maxY < obj.scale.y){
          maxY = obj.scale.y;
        } else if (minY > obj.scale.y){
          minY = obj.scale.y;
        }
      }
    }

    this.max.x = 1.5 / maxX;
    this.max.y = 1.5 / maxY;
    this.min.x = 0.5 / minX;
    this.min.y = 0.5 / minY;

  }

  setDeltas(){
    this.deltaX = this.arr[1].x - this.arr[0].x;
    this.deltaY = this.arr[1].y - this.arr[0].y;
  }

  getRC(){
    this.rightCenter = {x: this.arr[1].x, y: (this.arr[0].y + this.arr[1].y)/2};
    return (addPts(this.rightCenter, this.offset));
  }

  getDC(){
    this.downCenter = {x: (this.arr[0].x + this.arr[1].x)/2, y: this.arr[1].y};
    return (addPts(this.downCenter, this.offset));
  }
  
  setBoard(board){
    this.board = board;
  }

  setAllObj(allObj){
    this.allObj = allObj;
  }

  setDim(dim){
    this.dim = dim;
  }

  setCtx(ctx){
    this.ctx = ctx;
  }

  setBpb(bpb){
    this.bpb = bpb;
  }

  setSpb(spb){
    this.spb = spb;
  }

  initObj(allObj, dim, ctx, bpb, spb){
    this.setAllObj(allObj);
    this.setDim(dim);
    this.setCtx(ctx);
    this.setBpb(bpb);
    this.setSpb(spb);
    
    for (let i = 0; i < allObj.length; i++){
      this.boolObjInd.push(false);
    }
  }

  highlightSelected(){
    for (let i = 0, objIndex; i < this.selObj.length; i++){
      objIndex = this.selObj[i];
      this.allObj[objIndex].highlight();
    }
  }
  

  drawSelBox(clrRight = "red", clrDown = "red"){
    let res = transformPt(this.arr, this.offset, this.dim),
      line = new Shape(),
      p1 = {x : (res[0].x + res[1].x) / 2, y : res[1].y},
      p2 = {x : res[1].x, y : (res[0].y + res[1].y) / 2};

    this.ctx.fillStyle = "rgba(0,0,255,0.2)";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;
    this.ctx.rect(res[0].x, res[0].y, res[1].x - res[0].x, res[1].y - res[0].y); 
    this.ctx.fill();
    this.ctx.stroke();
    line.initObj("black", this.ctx, 2, this.dim);
    line.drawTrace(
      p1,
      addPts(p1, {x:0, y: this.sl})
    );
    drawFilledCircle(
      addPts(p1, {x:0, y: this.sl}),
      this.rcr, this.ctx, "black"
    );
    drawFilledCircle(
      addPts(p1, {x:0, y: this.sl}),
      this.rcr - 2, this.ctx, clrDown
    );
    line.drawTrace(
      p2,
      addPts(p2, {x: this.sl, y:0})
    );
    drawFilledCircle(
      addPts(p2, {x: this.sl, y:0}),
      this.rcr, this.ctx, "black"
    );
    drawFilledCircle(
      addPts(p2, {x: this.sl, y:0}),
      this.rcr - 2, this.ctx, clrRight
    );
  }

  updBoard(){
    let boards = [this.bpb, this.spb];
   
    for (let i = 0, objIndex; i < this.selObj.length; i++){
      objIndex = this.selObj[i];
      for (let j = 0; j < boards.length; j++){
        boards[j].delPartObj(objIndex);
      }
      this.allObj[objIndex].setOffset(
        addPts(this.allObj[objIndex].offset, this.offset)
      );

      for (let j = 0; j < boards.length; j++){
        boards[j].addPartObj(objIndex);
      } 
 
    }
  }
 
  drawUnselected(){
    
    this.ctx.clearRect(0, 0, this.dim.width, this.dim.height);
    
    for (let i = 0; i < this.allObj.length; i++){
      if (i >= this.boolObjInd.length){
        this.allObj[i].draw();
      }else if(this.boolObjInd[i] === false){
        if (this.allObj[i] != null){
          this.allObj[i].draw();
        }
      }
    }
  }

  inBox(p){
    let p1 = addPts(this.arr[0], this.offset),
      p2 = addPts(this.arr[1], this.offset);

    if (rectLess(p1, p)){
      if (rectMore(p2, p)){
        return true;
      }
    }

    return false;
  }
  
  resize(){
    let fracX = (this.arr[1].x - this.arr[0].x) / this.deltaX,
      fracY = (this.arr[1].y - this.arr[0].y) / this.deltaY,
      up = addPts(this.arr[0], this.offset);
    

    for (let i = 0, objIndex, obj, totOffset; i < this.selObj.length; i++){
      objIndex = this.selObj[i];
      obj = allObj[objIndex];

      if (obj !== null){
        
        this.bpb.delPartObj(objIndex);
        this.spb.delPartObj(objIndex);
        
        totOffset = addPts(obj.offset, this.offset);
        for (let j = 0, res; j < obj.arr.length; j++){
          res = addPts(obj.arr[j], totOffset);
          obj.arr[j].x = fracX * res.x + (1 - fracX) * up.x - totOffset.x;
          obj.arr[j].y = fracY * res.y + (1 - fracY) * up.y - totOffset.y;
        }
        
        obj.scale.x *= Math.abs(fracX);
        obj.scale.y *= Math.abs(fracY);
        obj.isAllSet = false;
        obj.setBoard(this.bpb, this.spb, objIndex);
      }

    }
    
    this.setDeltas();
    this.setResizeLimits();

  }

  inRightResize(p){
    let p1 = addPts({x : this.sl/this.dim.width, y:0}, this.getRC()), 
      fieldRadius = this.rcr / Math.min(this.dim.width, this.dim.height);
    
    if (relLength(p1, p) <= fieldRadius){
      return true;
    }

    return false;
  }
  
  rightResizeDraw(p){
    let delX = addPts(
      scalePt(-1,
        addPts({x : this.sl/this.dim.width, y:0}, this.getRC())
      ),
      p
    ), fracX;
    delX.y = 0;
    fracX = (delX.x + this.arr[1].x - this.arr[0].x) / (this.deltaX);
    if (fracX >= this.min.x && fracX <= this.max.x){
      this.arr[1] = addPts(this.arr[1], delX);
      this.drawUnselected();
      this.drawSelBox();
    }else{
      this.drawUnselected();
      this.drawSelBox("white", "red");
    }
  }
  
  inDownResize(p){
    let p1 = addPts({x:0, y: this.sl/this.dim.height}, this.getDC()),
      fieldRadius = this.rcr / Math.min(this.dim.width, this.dim.height);
    
    if (relLength(p1, p) <= fieldRadius){
      return true;
    }

    return false;
  }

  downResizeDraw(p){
    let delY = addPts(
      scalePt(-1,
        addPts({x:0, y: this.sl/this.dim.height}, this.getDC())
      ),
      p
    ),
    fracY;
    delY.x = 0;
    fracY = (delY.y + this.arr[1].y - this.arr[0].y) / (this.deltaY);
    if (fracY>= this.min.y && fracY <= this.max.y){
      this.arr[1] = addPts(this.arr[1], delY);
      this.drawUnselected();
      this.drawSelBox();
    }else{
      this.drawUnselected();
      this.drawSelBox("red", "white");
    }
  }


  moveSelObj(p){

    this.drawUnselected();

    this.offset.x = p.x - (this.arr[0].x + this.arr[1].x) / 2;
    this.offset.y = p.y - (this.arr[0].y + this.arr[1].y) / 2;
    
    this.drawSelBox();
    
    for (let i = 0, objIndex; i < this.selObj.length; i++){
      objIndex = this.selObj[i];
      this.allObj[objIndex].setOffset(
        addPts(this.offset, this.allObj[objIndex].offset)
      );
    }
    
    this.highlightSelected();

    for (let i = 0, objIndex; i < this.selObj.length; i++){
      objIndex = this.selObj[i];
      this.allObj[objIndex].setOffset(
        addPts(scalePt(-1, this.offset), this.allObj[objIndex].offset)
      );
    }
   }
}

class BoxSelect extends SelectObj{
  
  constructor(){
    super();
  }
  
  initObj(allObj, dim, ctx, bpb, spb){
    super.initObj(allObj, dim, ctx, bpb, spb);
    this.setBoard(bpb);
  }
  
  getPoints(){
    if (this.arr.length == 2){
      this.correctArr();
      this.detectObjects();
      if (this.selObj.length > 0){
        this.drawSelBox();
        this.highlightSelected();
        this.setDeltas();
        this.setResizeLimits();
      }
      return true;
    }else{
      return false;
    }
  }

  correctArr(){
    if (rectLess(this.arr[0], this.arr[1])){
      return;
    }else if (rectMore(this.arr[0], this.arr[1])){
      let c = this.arr[0];
      this.arr[0] = this.arr[1];
      this.arr[1] = c;
      return;
    }else{
      let x2 = this.arr[0].x,
        x4 = this.arr[1].x;

      this.arr[0].x = x4;
      this.arr[1].x = x2;
      this.correctArr();
    }
  }

  detectObjects(){
    let np = this.board.numParts, 
      xs = parseInt(this.arr[0].x * np),
      ys = parseInt(this.arr[0].y * np),
      xe = parseInt(this.arr[1].x * np),
      ye = parseInt(this.arr[1].y * np),
      objIndices = null,
      objIndex = null,
      obj = null,
      p = null;
    
    for (let x = xs; x <= xe; x++){
      for (let y = ys; y <= ye; y++){
        
        objIndices = this.board.part[x][y]; 

        if (objIndices != null){
          for (let i = 0; i < objIndices.length; i++){

            objIndex = objIndices[i];
            obj = this.allObj[objIndex];
            
            if (obj != null){
              p = addPts(obj.minP, obj.offset);
            
              if (rectLess(this.arr[0], p)){
                p = addPts(obj.maxP, obj.offset);
              
                if (rectMore(this.arr[1], p)){
                  this.selObj.push(objIndex);
                  this.boolObjInd[objIndex] = true;
                }

              }

            }

          }

        }

      }

    }


  }
 
}

class StrokeSelect extends SelectObj{

  constructor(){
    super();
  }

  initObj(allObj, dim, ctx, bpb, spb){
    super.initObj(allObj, dim, ctx, bpb, spb);
    this.setBoard(spb);
  }

  isClose(popl, p){
    let obj = this.allObj[popl.objIndex],
      fieldRadius = obj.lineWidth / Math.min(obj.dim.width, obj.dim.height) / 2,
      dist,
      pIndex;

    for (let i = 0; i < popl.objPointsIndex.length; i++){
      pIndex = popl.objPointsIndex[i];
      dist = relLength(addPts(obj.getArr()[pIndex], obj.offset), p);

      if (dist <= fieldRadius){
        return true;
      }

    }

    return false;
  }

  getPoints(p){
    let partObj = this.board.getPart(p, {x:0, y:0}),
      x = partObj.x,
      y = partObj.y,
      part = this.board.part[x][y];

    if (part != null){
      for (let i = 0, objInd; i < part.length; i++){
        objInd = part[i].objIndex
        if (this.boolObjInd[objInd] == false && this.allObj[objInd] != null){
          if (this.isClose(part[i], p)){
            this.allObj[objInd].highlight();
            this.boolObjInd[objInd] = true;
            this.selObj.push(objInd);
          }
        }
      }
    }
  }

  setSel(){
    if (this.selObj.length > 0){
      this.arr.push({x: undefined, y:undefined});
      this.arr.push({x: undefined, y:undefined});

      for (let i = 0, objIndex, minP, maxP; i < this.selObj.length; i++){

        objIndex = this.selObj[i];
        minP = addPts(this.allObj[objIndex].minP, 
          this.allObj[objIndex].offset);
        maxP = addPts(this.allObj[objIndex].maxP,
          this.allObj[objIndex].offset);

        if (i == 0){
          Object.assign(this.arr[0], minP);
          Object.assign(this.arr[1], maxP);
        }else{
          this.arr[0].x = (this.arr[0].x > minP.x ? minP.x : this.arr[0].x);
          this.arr[0].y = (this.arr[0].y > minP.y ? minP.y : this.arr[0].y);
          this.arr[1].x = (this.arr[1].x < maxP.x ? maxP.x : this.arr[1].x);
          this.arr[1].y = (this.arr[1].y < maxP.y ? maxP.y : this.arr[1].y);
        }        
      }
      
      let offset = 0.02;
      

      this.arr[0].x = manip(this.arr[0].x, -offset);
      this.arr[0].y = manip(this.arr[0].y, -offset);

      this.arr[1].x = manip(this.arr[1].x, offset);
      this.arr[1].y = manip(this.arr[1].y, offset);

      this.drawSelBox();
      this.highlightSelected();
      this.setDeltas();
      this.setResizeLimits();
      return true;
    }
    
    return false;

  }

}

//TYJC
