// This is the class meta, can be used for copying and generating object
let classMeta = {}, parentClass;

classMeta["obj"] = undefined;
classMeta["Shape"] = {
  instVarsC : ["color", "lineWidth", "arr", "offset", "minP", "maxP", "isAllSet"],
  instVarsR : ["ctx", "dim"],
  setObj : function(){
    let newObj = new Shape();
    setInstVarsCopy(classMeta["obj"], newObj, this.instVarsC);
    setInstVarsRef(classMeta["obj"], newObj, this.instVarsR);
    return (newObj);
  } 
};

parentClass = "Shape",
classMeta["FreeLine"] = {
  parentClass,
  instVarsC : (classMeta[parentClass].instVarsC).concat(["index"]),
  instVarsR : classMeta[parentClass].instVarsR,
  setObj : function(){
    let newObj = new FreeLine();
    setInstVarsCopy(classMeta["obj"], newObj, this.instVarsC);
    setInstVarsRef(classMeta["obj"], newObj, this.instVarsR);
    return (newObj);
  } 
};

classMeta["StrictShape"] = {
  parentClass,
  instVarsC : (classMeta[parentClass].instVarsC).concat(["genPoints", "delta"]),
  instVarsR : classMeta[parentClass].instVarsR,
  setObj : function(){
    let newObj = new StrictShape();
    setInstVarsCopy(classMeta["obj"], newObj, this.instVarsC);
    setInstVarsRef(classMeta["obj"], newObj, this.instVarsR);
    return (newObj);
  } 
};

parentClass = "StrictShape";
classMeta["Line"] = {
  parentClass,
  instVarsC : classMeta[parentClass].instVarsC,
  instVarsR : classMeta[parentClass].instVarsR,
  setObj : function(){
    let newObj = new Line();
    setInstVarsCopy(classMeta["obj"], newObj, this.instVarsC);
    setInstVarsRef(classMeta["obj"], newObj, this.instVarsR);
    return (newObj);
  } 
};

classMeta["Circle"] = {
  parentClass,
  instVarsC : classMeta[parentClass].instVarsC,
  instVarsR : classMeta[parentClass].instVarsR,
  setObj : function(){
    let newObj = new Circle();
    setInstVarsCopy(classMeta["obj"], newObj, this.instVarsC);
    setInstVarsRef(classMeta["obj"], newObj, this.instVarsR);
    return (newObj);
  } 
};

classMeta["Rectangle"] = {
  parentClass,
  instVarsC : classMeta[parentClass].instVarsC,
  instVarsR : classMeta[parentClass].instVarsR,
  setObj : function(){
    let newObj = new Rectangle();
    setInstVarsCopy(classMeta["obj"], newObj, this.instVarsC);
    setInstVarsRef(classMeta["obj"], newObj, this.instVarsR);
    return (newObj);
  } 
};

//End of class meta

function transformPt(arr, offset, dim){
  let res = [];
  for(let i = 0; i < arr.length; i++){
    res.push({x: Math.round((arr[i].x + offset.x) * dim.width),
      y: Math.round((arr[i].y + offset.y) * dim.height)});
  }
  return res;
}

function addPts(p1, p2){
  return ({x:(p1.x + p2.x), y: (p1.y + p2.y)});
}

function scalePt(scale, p){
  return({x: p.x * scale, y: p.y * scale});
}

function relLength(p1, p2){
  return ((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2 ) ** 0.5;
}

function addLinePoints(arr, p1, p2, delta){
  let index = 0, 
    deltaVec = scalePt(delta, addPts(scalePt(-1, p1), p2));
  while (index < 1/delta){
    arr.push(addPts(p1, scalePt(index, deltaVec)));
    index++;
  }
}

function rectLess(p1, p2){
  if (p1.x < p2.x){
    if (p1.y < p2.y){
      return true;
    }
  }

  return false;
}

function rectMore(p1, p2){
  if (p1.x > p2.x){
    if (p1.y > p2.y){
      return true;
    }
  }

  return false;
}

function getIndex(arr, elem, f){
  if (f === undefined){
    f = (elem) => {return elem};
  }

  for (let i = 0; i < arr.length; i++){
    if (f(arr[i]) == elem){
      return (i);
    }
  }

  return (-1);
}

function manip(val, offset){
  let res = val;
  if (offset > 0){
    if (val + offset < 1){
        res = (val + offset);
    }
  }else{
    if (val > offset){
      res = (val + offset);
    }
  }
  return (res);
}

function getTime(){
  return ((new Date()).getTime());
}


function setInstVarsCopy(oldObj, newObj, instVarNames){
  for (let i = 0, instVarName; i < instVarNames.length; i++){
    instVarName = instVarNames[i];
    newObj[instVarName] = JSON.parse(
      JSON.stringify(oldObj[instVarName])
    );
  }

  return (newObj);
}

function setInstVarsRef(oldObj, newObj, instVarNames){
  for (let i = 0, instVarName; i < instVarNames.length; i++){
    instVarName = instVarNames[i];
    newObj[instVarName] = oldObj[instVarName];
  }

  return (newObj);
}

function getObj(obj){
  classMeta["obj"] = obj;
  return (classMeta[obj.className].setObj());
}
