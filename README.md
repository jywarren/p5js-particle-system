# P5js particle system
Particle emitters using P5js WEBGL canvas.

## Dependencies
This project was build under P5js lib.

For more: [P5js website](http://p5js.org)

##Configuration
Add the following to the file scripts section:

```<script src="http://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.2/p5.js"></script>```



Copy the `psystem.js` file, located inside the `includes` folder, to you project.

```<script src="./includes/psystem.js"></script>```



Add an array variable called `emittersSetup` to the file script section:

```<script type="text/javascript">var emittersSetup = [ ];</script>```



##Usage
**1** - Add a dictionary to `emittersSetup` for each emitter needed.
```javascript
//Add an 10 triangle emitter to x:10px y:10px
var emittersSetup =
[
    {x: 10, y: 10, count: 10},
];
```

**2** - Once all code is loaded, call the `canvasSetup()` function to create the canvas.

**3** - Call `castEmitters()` to insert all emitters to your canvas.

**4** - Call `startEmitters()` to start all emitters or `emitters[n].start();` to start a single emitter;

`stopEmitters()` will stop rendering;

`restartEmitters()` will restart rendering;



###Options
The list below shows all possible configurations:

`float` `x:` and `y:` - Emitter position from canvas center

`int` `count:` - Particles number

`float` `size:` - Size variation range for particles

`string` `type:` - "radial"_(default)_ or "linear"

`float` `direction:` - Direction (in degrees) of the particles entrance

`float` `vx:` and `vy:` - Diretional velocity range

`float` `vrx:`, `vry:` and `vrz:` - Rotation velocity

`float` `stroke:` - Stroke thickness

`string` `color:` - **random** _(default)_ or color EG:**#ff0000** - Particle color

`string` `style:` - **random** _(default)_, **fill** or **stroke** - Particle fill mode
