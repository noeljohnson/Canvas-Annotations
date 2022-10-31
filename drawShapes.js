//GTG

class StrictShape extends Shape{
  className = "StrictShape";
  constructor(){
    super();
    this.genPoints = [];
    this.delta = undefined;
  }

  getArr(){
    return (this.genPoints);
  }

  setDelta(length){
    this.delta = 1/(length * 320);
  }

}

class Line extends StrictShape{
  className = "Line";
  constructor(){
    super();
  }
  
  getPoints(){
    if (this.arr.length == 2){ 
      this.draw();
      this.generatePts();
      return true;
    }
    else{
      return false;
    }
  }

  generatePts(){
    let p1 = {x:this.arr[0].x, y:this.arr[0].y},
      p2 = {x:this.arr[1].x, y:this.arr[1].y},
      index = 0;

    this.setDelta(relLength(p1, p2));
    addLinePoints(this.genPoints, p1, p2, this.delta);
  }

  draw(){
    let res = transformPt(this.arr, this.offset, this.dim);
    this.drawTrace(res[0], res[1]);
  }
}

class Circle extends StrictShape{
  className = "Circle";
  constructor(){
    super();
    this.r = undefined; 
  }

  getPoints(){
    if (this.arr.length == 2){
      this.draw();
      this.generatePts();
      return true;
    }
    else{
      return false;
    }
  }

  generatePts(){
    let rc = Math.PI * 2 * relLength(this.arr[0], this.arr[1]),
      c = transformPt([this.arr[0]], this.offset, this.dim)[0],
      index = 0,
      angle = 0;

    this.setDelta(rc);
    while (index < 1 / this.delta){
      this.genPoints.push(
        {x : (this.r * Math.cos(angle) + c.x) / this.dim.width, 
          y: (this.r * Math.sin(angle) + c.y) / this.dim.height}
      );
      angle += 2 * this.delta * Math.PI;
      index++;
    }
  
  }

  draw(){
    let res = transformPt(this.arr, this.offset, this.dim),
      c = res[0];
    this.r = ((res[1].x - res[0].x) ** 2 + (res[1].y - res[0].y) ** 2) ** 0.5;
    this.ctx.strokeStyle = this.color;
    this.ctx.lineWidth = this.lineWidth;
    this.ctx.beginPath();
    this.ctx.arc(c.x, c.y, this.r, 0, 2 * Math.PI);
    this.ctx.stroke();
  }
}

class Rectangle extends StrictShape{
  className = "Rectangle";
  constructor(){
    super();
  }

  getPoints(){
    if(this.arr.length == 2){
      this.draw();
      this.generatePts();
      return true;
    }else {
      return false;
    }
  }

  draw(){
    let s1 = new StrictShape(),
      res = transformPt(this.arr, this.offset, this.dim);
    s1.setColor(this.color);
    s1.setCtx(this.ctx);
    s1.setLineWidth(this.lineWidth);
    s1.setDim(this.dim);
    let p1 = res[0], 
      p2 = {x:res[1].x, y:res[0].y},
      p3 = res[1],
      p4 = {x:res[0].x, y:res[1].y};

    s1.drawTrace(p1, p2);
    s1.drawTrace(p2, {x:p2.x + this.lineWidth/2, y:p2.y});
    s1.drawTrace(p2, p3);
    s1.drawTrace(p3, {x:p3.x,  y:p3.y + this.lineWidth/2});
    s1.drawTrace(p3, p4);
    s1.drawTrace(p4, {x:p4.x - this.lineWidth/2, y:p4.y});
    s1.drawTrace(p4, p1);
    s1.drawTrace(p1, {x:p1.x,  y:p1.y - this.lineWidth/2});

  }

  generatePts(){
    let p1 = this.arr[0],
      p2 = {x: this.arr[1].x, y: this.arr[0].y},
      p3 = this.arr[1],
      p4 = {x: this.arr[0].x, y: this.arr[1].y};

    this.setDelta(relLength(p1, p2));
    addLinePoints(this.genPoints, p1, p2, this.delta);

    this.setDelta(relLength(p2, p3));
    addLinePoints(this.genPoints, p2, p3, this.delta);

    this.setDelta(relLength(p3, p4));
    addLinePoints(this.genPoints, p3, p4, this.delta);

    this.setDelta(relLength(p4, p1));
    addLinePoints(this.genPoints, p4, p1, this.delta);

  }
}

//TYJC
