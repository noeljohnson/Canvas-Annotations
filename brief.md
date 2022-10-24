This file contains a brief description of the contents of each js file.

### [drawObjFunc](./drawObjFunc.md "Supporting MD file")

This file contains all major functions that will be used by other classes and other `script.js`, the functions listed here will not mostly use any global variables directly.


### [drawFLine](./drawFLine.md "Supporting MD file")

This file contains the Shape *(parent class to all other drawing object)* and the free stroke class.

### [drawShapes](./drawShapes.md "Supporting MD file")

This file contains the StrictShape class and those regular shapes like Circle and Rectangle. It also contains the Line class.

### [partBoard](./partBoard.md "supporting MD file")

The board *(refers to the background to draw upon)* is divided to many rectangles, this is done so as to make object detection faster. This file contains PartBoard class *(parent to both boards)*, BoxPartBoard and StrokePartBoard.

### [selectObj](./selectObj.md "supproting MD file")

This file contains classes used for implementing box select and stroke select.

### [script](./script.md "supporitng MD file")

This file handles all the events of the index file and acts like the integrating units between the various objects from the classes mentioned above
