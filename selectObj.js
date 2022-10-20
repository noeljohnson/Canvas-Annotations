//GTG

class Select{
  
  constructor(){

  }

}

class BoxSelect{
  
  constructor(){
    this.arr = [];
    this.bpb = undefined;
    this.allObj = undefined;
    this.selObj = [];
    this.dim = undefined;
    this.ctx = undefined;
    this.offset = {x: 0, y:0};
    this.boolObjInd = [];
    this.isColorChanged = false;
    this.isSizeChanged = false;
  }

  setBpb(bpb){
    this.bpb = bpb;
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

  initObj(bpb, allObj, dim, ctx){
    this.setBpb(bpb);
    this.setAllObj(allObj);
    this.setDim(dim);
    this.setCtx(ctx);
    
    for (let i = 0; i < allObj.length; i++){
      this.boolObjInd.push(false);
    }
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
    let np = this.bpb.numParts, 
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
        
        objIndices = this.bpb.part[x][y]; 

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
    for (let i = 0, objIndex; i < this.selObj.length; i++){
      objIndex = this.selObj[i];
      if (this.allObj[objIndex] !== null){
        this.bpb.delPartObj(objIndex);
        this.allObj[objIndex].setOffset(
          addPts(this.allObj[objIndex].offset, this.offset)
        );
        this.bpb.addPartObj(objIndex);
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
      if (this.boolObjInd[i] === false){
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

//TYJC
