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

// to check if p1 is before p2 in a rectangular sense
function rectLess(p1, p2){
  if (p1.x < p2.x){
    if (p1.y < p2.y){
      return true;
    }
  }

  return false;
}

// to check if p1 is after p2 in a rectangular sense
function rectMore(p1, p2){
  if (p1.x > p2.x){
    if (p1.y > p2.y){
      return true;
    }
  }

  return false;
}

// to find the first occurence of a given element
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
