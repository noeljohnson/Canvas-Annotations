//GTG

class Shape{
  className = "Shape";
  constructor(){
    this.color = undefined;
    this.ctx = undefined;
    this.lineWidth = undefined;
    this.arr = [];
    this.offset = {x:0, y:0};
    this.dim = undefined;
    this.minP = {x: undefined, y:undefined};
    this.maxP = {x: undefined, y:undefined};
    this.isAllSet = false;
    this.scale = {x : 1, y: 1}
  }

  initObj(color, ctx, lineWidth, dim){
    this.color = color;
    this.ctx = ctx;
    this.lineWidth = lineWidth;
    this.dim = dim;
  }

  setColor(color){
    this.color = color;
  }

  setCtx(ctx){
    this.ctx = ctx;
  }

  setDim(dim){
    this.dim = dim;
  }

  setLineWidth(lineWidth){
    this.lineWidth = lineWidth;
  }

  setOffset(offset){
    this.offset = offset;
  }

  getArr(){
    return (this.arr);
  }

  drawTrace(p1, p2){
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.beginPath();
    this.ctx.moveTo(p1.x, p1.y);
    this.ctx.lineTo(p2.x, p2.y);
    this.ctx.stroke();
  }

  setBoard(boxB, strokeB, objIndex){

    if (!this.isAllSet){
      if (this.getArr().length > 0){
        this.minP.x = this.maxP.x = this.getArr()[0].x;
        this.minP.y = this.maxP.y = this.getArr()[0].y;
     
      }


     for (let i = 0, p; i < this.getArr().length; i++){
        p = this.getArr()[i];
        if (this.minP.x > p.x){
          this.minP.x = p.x;
        }
        if (this.maxP.x < p.x){
          this.maxP.x = p.x;
        }
        if (this.minP.y > p.y){
          this.minP.y = p.y;
        }
        if (this.maxP.y < p.y){
          this.maxP.y = p.y;
        }
      }
      

      this.isAllSet = true;
    }
    strokeB.addPartObj(objIndex);
    boxB.addPartObj(objIndex);
  }
  
  draw(){
    // will be implemented by actual classes
  }

  highlight(){
    let lw = this.lineWidth, 
      color = this.color;
    this.setLineWidth(lw + 2);
    this.setColor("black");
    this.draw();
    this.setLineWidth(lw);
    this.setColor("white");
    this.draw();
    this.setColor(color);
  }
}

class FreeLine extends Shape{
  className = "FreeLine";

  constructor(){
    super();
    this.index = 0;
  }

  getPoints(){

    if ((this.arr.length - this.index) >= 4){
      
      let res = transformPt(this.arr.slice(this.index, this.index + 4), this.offset, this.dim);
      
      if (this.index != 0){
        let p2 = res[0],
          p3 = res[1],
          frac = 0.9;
        res[1] = addPts(
          scalePt(2, p3),
          scalePt(-1, p2)
        );
        res[0] = addPts(
          scalePt(frac, p3),
          scalePt(1 - frac, p2)
        );
      }
      
      this.ctx.strokeStyle = this.color;
      this.ctx.lineWidth = this.lineWidth;
      this.ctx.beginPath();
      this.ctx.moveTo(res[0].x, res[0].y);
      this.ctx.bezierCurveTo(res[1].x, res[1].y, res[2].x, res[2].y, res[3].x, res[3].y);
      this.ctx.stroke();
      this.index += 2;

      return true;
    }else {
      return false;
    }
  
  }
  
  draw(){
    this.index = 0;
    while (this.getPoints()){;}
  }
}

//TYJC
