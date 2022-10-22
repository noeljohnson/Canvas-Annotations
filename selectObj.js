//GTG

class SelectObj{
  
  constructor(){
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

  drawSelBox(){
    let res = transformPt(this.arr, this.offset, this.dim);
    this.ctx.fillStyle = "rgba(0,0,255,0.2)";
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 2;
    this.ctx.rect(res[0].x, res[0].y, res[1].x - res[0].x, res[1].y - res[0].y); 
    this.ctx.fill();
    this.ctx.stroke();
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

  moveSelObj(p){
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
      this.drawSelBox();
      this.highlightSelected();
      return true;
    }else{
      false;
    }
  }

  correctArr(){
    if (rectMore(this.arr[0], this.arr[1])){
      let c = this.arr[0];
      this.arr[0] = this.arr[1];
      this.arr[1] = c;
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
      return true;
    }
    
    return false;

  }

}

//TYJC
