// GTG

class PartBoard{
  
  constructor(allObj){
    this.allObj = allObj;
    this.numParts = undefined;
    this.part = [];
  }

  setNumParts(num){
    this.numParts = 2 ** Math.round(Math.log2(num));
    for(let x = 0; x < this.numParts; x++){
      this.part[x] = [];
      for (let y = 0; y < this.numParts; y++){
        this.part[x][y] = null;
      }
    }
  }
  
  getPart(point, offset){
    let p = addPts(point, offset),
    x = parseInt(p.x * this.numParts),
    y = parseInt(p.y * this.numParts);
    return {x, y};
  }

}

class BoxPartBoard extends PartBoard{
  
  constructor(allObj){
    super(allObj);
  }

  addPartObj(objIndex){
    let minP = this.allObj[objIndex].minP,
      partObj = this.getPart(minP, this.allObj[objIndex].offset),
      x = partObj.x,
      y = partObj.y;

    if (this.part[x][y] == null){
      this.part[x][y] = [objIndex];
    }else{
      this.part[x][y].push(objIndex);
    }
  }

  delPartObj(objIndex){
    if (this.allObj[objIndex] != null){
      let partObj = this.getPart(this.allObj[objIndex].minP, this.allObj[objIndex].offset),
        x = partObj.x,
        y = partObj.y,
        partObjIndex = getIndex(this.part[x][y], objIndex);

      if (partObjIndex != -1){
        this.part[x][y].splice(partObjIndex, 1);
      }
    }
  }

}

class StrokePartBoard extends PartBoard{

  constructor(allObj){
    super(allObj);
  }
  
  addPartObj(objIndex){
    let p_, partObj, x, y, index = objIndex;
    
    for (let pIndex = 0; pIndex < this.allObj[index].getArr().length; pIndex++){
      p_ = this.allObj[index].getArr()[pIndex];
      partObj = this.getPart(p_, this.allObj[index].offset);
      x = partObj.x;
      y = partObj.y;
    
      if (this.part[x][y] == null){
        let popl = new PartObjPointLink();
        this.part[x][y] = [popl.initObj(index, pIndex)];
      }else{
      
        let partObjIndex = getIndex(this.part[x][y], index, (elem) => {return elem.objIndex});
        
        if (partObjIndex == -1){
          let popl = new PartObjPointLink();
          this.part[x][y].push(popl.initObj(index, pIndex));
        }else{
          this.part[x][y][partObjIndex].addPointIndex(pIndex);
        }
      
      }
   
    }
  
 }

  delPartObj(objIndex){
    if (this.allObj[objIndex] != null){
      let obj = this.allObj[objIndex], 
        minPart = this.getPart(obj.minP, obj.offset),
        maxPart = this.getPart(obj.maxP, obj.offset),
        xs = minPart.x,
        ys = minPart.y,
        xe = maxPart.x,
        ye = maxPart.y,
        partObjIndex;

      for (let x = xs; x <= xe; x++){
        for (let y = ys; y <= ye; y++){
          if (this.part[x][y] != null){
            partObjIndex = getIndex(this.part[x][y], objIndex, (elem) => {return elem.objIndex});
            if (partObjIndex != -1){
              this.part[x][y].splice(partObjIndex, 1);
            }
          }
        }
      }
        
    }
    
  }

}

class PartObjPointLink{
  constructor(){
    
    this.objIndex = undefined; // index of the object in allObj
    this.objPointsIndex = []; // those points in the object that is present in the given partition
  }

  initObj(index, pIndex){
    this.setObjIndex(index);
    this.addPointIndex(pIndex);
    return(this);
  }

  setObjIndex(index){
    this.objIndex = index;
  }

  setObjPointsIndex(pIndex){
    this.objectPointsIndex = [pIndex]; 
  }

  addPointIndex(pIndex){
    this.objPointsIndex.push(pIndex);
  }
}

//TYJC
