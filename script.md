<!--GTG-->

### <a href="./script.js" title="link to script.js">script</a>

Following are the functions in `script.js`

* `function initObj(obj)` : initializes the drawing object by setting the instance variables to current parameters

* `function updColor(obj)` : to update the color of an object, primarliy used after selecting objects

* `function updLineWidth(obj)` : to update the linewidth of the object, primarily used after selecting objects

* `function updSelObj(sel)` : to update the selected objects color, linewidth, if needed.

* `function setBoard(objIndex)` : adds `allObj[objIndex]` to the boards

* `function clearCanvas()` : clears the canvas

* `function drawAllObj()` : draws all objects present in the canvas, useful while resizing and after translation

* `function resizeCanvas()` : sets the canvas width and the canvas height, set dim and redraws all objects



### Modes in Script

Modes are used to keep track of the operation/action currently undertaken. Following are the diffrent types of mode that the canvas can be in.

* `dCircle` : mode to draw circle
* `dLine` : mode to draw line
* `dRect` : mode to draw Rectangle
* `dFCurve` : mode to draw a free curve
* `bSel` : mode to select in box mode
* `sSel` : mode to select in stroke mode
* `sSelInter` : intermediate state after making the stroke and before sSelOp
* `selOp` : operation mode after selection is done

* `resize` : in this mode if one of the resize button is pressed

* `resizeOp` : once the resizing operation is done, this mode is set, over here all the objects which are selected are resized

`currMode` variable stores the current mode 

<!--TYJC-->
