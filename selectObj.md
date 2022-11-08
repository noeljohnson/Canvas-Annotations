<!--GTG-->

### <a href="./selectObj.js" title="link to selectObj.js">selectObj</a>

**`SelectObj`** class is used to implement the selection of objects, with the graphical rectangular box display

Following are the instance variables for `SelectObj` 
* `rcr`: stores the actual radius of the resize circle

* `arr` : contains the points that will be used todraw the rectangular selection

* `board` : the board that will be used for selection

* `allObj` : reference to the `allObj` array of `script.js`

* `selObj` : contains the indices corresponding to allObj of objects selected.

* `dim` : contains the reference to the dimensions of the canvas

* `ctx` : contains the reference to the canvas context

* `offset` : stores the offset value of the rectangular select when moved.

* `boolObjInd` : contains a boolean arrays corresponding to allObj, if the object is selected, then set to true else set to false

* `isColorChanged` : set to true if the color option was set/changed after selection or remains false

* `isSizeChanged` : set to true if the size was changed after selection or remains false

* `bpb` : reference to the `BoxPartitionBoard` object 

* `spb ` : reference to the `StrokePartitionBoard` object

* `rightCenter` : stores the position of the right center of the selection box

* `downCenter` : stores the bottom center of the selection box

* `deltaX` : stores the width of the selection box

* `deltaY` : stores the height of the selection box

* `min` : stores the minimum resize factor the selection can take

* `max` : stores the maximum resize factor the selection can take

Following are the methods of `SelectObj`

* `setResizeLimits()` : sets the value for `min` and `max`, max resizing limit is set to 0.5 and max limit is set to 1.5

* `setDeltas()` : sets the values for `deltaX` and `deltaY`

* `getRC()` : gets the value of the right center of the selection box, offset value included

* `getDC()` : gets the value of the down center of the selection box, offset value included

* `setBoard(board)` : to set the board

* `setAllObj(allObj)` : to set `allObj` reference

* `setDim(dim)` : to set canvas dimension reference

* `setCtx(ctx)` : to set canvas context reference

* `setSpb(spb)` : to set `BoardPartitionBoard` object reference

* `initObj(allObj, dim, ctx, bpb, spb)` : sets the `allObj`, `ctx`, `bpb`, `spb`. Also initializes the `boolObjInd` arr to `false`

* `highlightSelected()` : highlight the objects that are selected

* `drawSelBox()` : based on the array points and the offset, a rectangular selection box is drawn, along with the resizing circles

* `updBoard()` : once the translation of the selected objects are done, the boards have to reflect the new positions, this method updates the objects offsets and their new board positions

* `drawUnselected()` : redraws all the unselected objects, useful feature when resizing or moving operations 

* `inBox(p)` : this method will decide if the mouse is inside the selection box or not, if out the selection process is done.

* `resize()` : does the resize operation to all the selected objects

* `inRightResize(p)` : if the point *p* lies in the right resize circle, returns `true` else `false`

* `rightResizeDraw(p)` : makes the selection box increase width as propotionate to the movement from the center of the right circle to *p*.

* `inDownResize(p)` : if the point *p* lies in the down resize circle, returns `true` else `false`

* `downResizeDraw(p)` : makes the selection box increase height as propotionate to the movement from the center of the down circle to *p*.

* `moveSelObj(p)` : moves the selected objects to a point *p*, such that the centroid of the selection box will coincide with *p*. Also the selected objects are highlighted while moving

**`BoxSelect`** class is a subclass of `SelectObj` and is used for selection using the Box Select option.

Following are the additional methods of `BoxSelect`

* `initObj(allObj, dim, ctx, bpb, spb)` : calls the `initObj` of `SelectObj` but sets the board to `BoxPartitionBoard` object to `board`.

* `getPoints()` : If two points are selected, denoting the start and the end point of the rectangle, then `arr` is corrected such that the first point is always rectangularly less than the second point. Then those objects that lie in the bix are detected, a selection box is drawn over them and the selected objects are highlighted.

* `correctArr()` : This method corrects `arrr` in such a way that the arr is always rectangularly sorted in an ascending order.

* `detectObjects()` : The selection is done here based on whether the object lies in the selection box or not.

**`StrokeSelect`** is a subclass of `SelectObj` and is used to implement stroke based selection.

Following are the additional methods of `StrokeSelect`

* `initObj(allObj, dim, ctx, bpb, spb)` : calls the `initObj` of `SelectObj` but sets the board to `StrokePartBoard` object to `board`.

* `isClose(popl, p)` : checks if PartObjPointLink *)popl)* object is close to the point p. This will be used for detecting the selected objects.

* `getPoints(p)` : since the selection is done stroke wise, so for each point *p* in the stroke, it is checked if any object is selected in the process, `selObj` and `boolObjInd` are set appropriately  

* `setSel()` : After the objects are selected, `arr` is set in such a way that the selection box contains all the selection objects. The selection box is drawn and the selected objects are highlighted.

<!--TYJC-->
