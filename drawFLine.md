### <a href="./drawFLine.js" title="sepcification file for drawFline.js">drawFLine</a>

`Shape` : This class is the parent class for all drawing objects

Following are the instance variables for `Shape`
* `color` : Stores the color of the drawing object
* `ctx` : Stores the canvas context in which the object should be drawn
* `lineWidth` : Stores the line width of the drawing object
* `arr` : Stores the points required to draw the object
* `offset` : Stores the offset which will be used when translating the object
* `dim` : Stores the dimenions of the canvas, which will be used to place a point on the canvas context
* `minP` : Contains the minimum x and minimum y value as extracted from `arr`
* `maxP` : Contains the maximum x and maximum y value as extracted from `arr`
* isAllSet : Contains a boolean, this is used so that minP and maxP arent computed repeatedly

Following are some methods for `Shape`
* `setColor(color)` : Used to set the color for the drawing object

* `setCtx()` : Used to set the canvas context to draw the object

* `setDim(dim)` : Used during the coversion of point information to actual `ctx` points. This also helps in quick resizing. `dim` contains canvas width and height information

* `setLineWidth()` : Set the line width of the drawing object

* `getArr()` : returns array information of the drawing object

* `drawTrace(p1, p2)` : draws a line from *p1* (Canvas Point) and *p2 (Canvas Point)*

* `setBoard(boxB, strokeB, objIndex)` : after setting the minP and maxP for the drawing object, the boxB and strokeB of the drawing object are set.

* `draw()` : will be used to draw the object.

* `highlight()` : highlights the drawing object, will be used while selecting

`FreeLine` This class is used to free drawing objects, it is a subclass of `Shape`

Following are the instance variables of the `FreeLine` class

* `index` : used while drawing the bezier curve of the given `arr`

Following are the methods of `FreeLine` class

* `getPoints()` : based on `index` values, the bezier curve is drawn between the points, this is a cubic bezier curve and the last two points of the previous points of the previous curve, will be used in the new curve generated, `index` variable reflects the same

* `draw()` : used when the object is needed to be redrawn 
