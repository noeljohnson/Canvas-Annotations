<!--GTG-->

### <a href="./partBoard.js" title="link to partBoard.js">partBoard</a>

**`PartBoard`** is the parent class behind stroke board and box board. A board is used primarily for quicker search of drawing object, this achieved by diving the canvas background into recatngular partitions and noting down which object lies in each of these partitions

Following are the instance variables for `PartBoard`

* `allObj` : a reference to the allObj array used in `script.js`

* `numParts` : this parameter is used to decide the number of paritions to be set on the canvas board, totally there will be numParts<sup>2</sup> rectangles in the board

* `part` : a 2d array that will stores the draw object information in the board

Following are the methods for `PartBoard`
* `setNumParts(num)` : use to set the value for `numParts`, currently they are set in such a way that it stores the closest value for an integral power of 2. Also the `part` array is initialized with null values. 

* `getPart(point, offset)` : given a point *p* (obtained from the addition of *point* and *offset*) in the board, it returns the rectangular parition for which *p* belongs to.

**`BoxPartBoard`** class is a subclass of `PartBoard`, this board only keeps a note of minimum points of the drawing object.

Following are the  additional methods of `BoxPartBoard`

* `addPartObj(objIndex)` : adds the `allObj[objIndex]` object to the board

* `delPartObj(objIndex)` : deletes the `allObj[objIndex]` object from the board  

**`StrokePartBoard`** class is a subclass of `PartBoard`, this board keeps a note of all points returned by the drawing objects `getArr()` method.

Following are the additional methods of `StrokePartBoard`

* `addPartObj(objIndex)` : adds the `allObj[objIndex]` object to the board, iterating through points in it and adding accordingly to the `StrokePartBoard`

* `delPartObj(objIndex)` : deletes the `allObj[objIndex]` object from the `StrokePartBoard`  

**`PartObjPointLink`** : This class is used for encapsulating Object point relation in the `part` for `StrokePartBoard`

Following are the instance variables for `PartObjPointLink`

* `objIndex` : contains the index corresponding the drawing object in `allObj`

* `objPointsIndex` : contains the index of the points in `getArr()` of the object, that belongs to a given partition

Following are the methods for `PartObjPointLink`

* `initObj(index, pIndex)` : initializes the `PartObjPointLink` object by setting the `objIndex` and adding the first element in `objPointsIndex`

* `setObjIndex(index)` : sets `objIndex`

* `addPointIndex(pIndex)` : adds index values to `objPointsIndex` 

<!--TYJC-->
