<!--GTG-->
### <a href="./drawShapes.js">drawShapes</a>

**`StrictShape`** is class used for drawing regular shapes which is a subclass of `Shape`

Following are the other instance variables of `StrictShape`

* `genPoints` : will store the points used to define the regular shape, using these points we can draw the regular shape using FreeLine, this will be used in stroke select.

* `delta` : the distance between the two points when generating the points for `genPoints`

Following are the methods for `StrictShape`

* `getArr()` : modified to return `genPoints`

* `setDelta()` : used to set the value for delta


