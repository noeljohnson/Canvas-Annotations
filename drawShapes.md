<!--GTG-->
### <a href="./drawShapes.js" title="link to drawShapes.js">drawShapes</a>

**`StrictShape`** is class used for drawing regular shapes which is a subclass of `Shape`

Following are the  additional instance variables of `StrictShape`

* `genPoints` : will store the points used to define the regular shape, using these points we can draw the regular shape using FreeLine, this will be used in stroke select.

* `delta` : the distance between the two points when generating the points for `genPoints`

Following are the additional methods for `StrictShape`

* `getArr()` : modified to return `genPoints`

* `setDelta()` : used to set the value for delta, based on the perimiter of the shape

**`Line`** class is used to draw lines, this is a subclass of `StrictShape`

Following are the additional methods of `Line`

* `getPoints()` : after obtaining the two points, the start and the end point, draw a line between them and generate the points, return `true` once done else `false`

* `generatePts()` : generate all points between the two points in `arr`

* `draw()` : draws a line between the given points, this method will also be used when the objects need to be redrawn

**`Circle`** class is used to draw circles and is a subclass of `strictShape`

Following are the additional instance variables of `Circle`

* `r` : will store the raduis of the circle

Following are the additional methods of `Circle`

* `getPoints()` : if two points entered, the first point is the center and the next point is the point on the circumfrence on the circle, the circle is drawn, the points are generated and then `true` is returned else return `false`

* `setRadius()` : used to set the actual value of the radius

* `generatePts()` : generates all the points on the circle's circumfrence, using paramtric circle terms

* `draw()` : draws the circle, will be used when to be redrawn

**`Rectangle`** class is used to draw the rectangular shape, which is a subclass of `StrictShape`

Following are the additional methods of `Rectangle`

* `getPoints()` : if two points are there in arr, then the first point is the top vertex, the other point is in the diagonal opposite vertex. These points are used to draw the rectangle. The points in the perimeter will be generated, after which `true` is returned else `false`

* `draw()` : draws the rectangle, will be used while redrawing the object

* generatePts() : generate all points in the rectangle
<!--TYJC-->
