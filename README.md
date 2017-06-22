# Exporting After Effects Motion Data for Development!

### Currently has two different export modes: 
* Motion Guidelines
* Tracking Data 


## MOTION GUIDELINES

#### Perfect for exporting your motion mocks from AE to a guideline that Developers can work with!!

* Will export AE comps into motion guidelines for developers to use.
* Exports to 1000ms timings.
* Works best if your comps are 50fps so the ms timings are not fractional.
* Will output AE graph to Bezier curves.
* ms timings, follwed by attribute, then value.

*Works well for Opacity, Position, Rotation, Scale.*

**Currently will not output shape/mask path data as the don't contain values that can translate to CSS.**

*Will eventually expand to convert path data to SVG data.*




## TRACKING DATA

#### Perfect for if you are exporting an image sequence for web, and want to have UI elements tracked to the sequence.

* Will export all keyframed data into a JSON file. 
* Each AE Layer Property has it's own object ordered by frame number.

*Currently works best if every frame is keyed, for example if you have tracked a null to a point in a video, or using 3D nulls from Cinema4D.*

