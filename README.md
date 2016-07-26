# P5js particle system
Particle emitters using P5js WEBGL canvas.

## Dependencies
This project was build under P5js lib.

For more: [P5js website](http://p5js.org)

##Configuration
Add the following to the file scripts section:

```<script src="http://cdnjs.cloudflare.com/ajax/libs/p5.js/0.5.2/p5.js"></script>```



Copy the `psystem.js` file to you project folder.

```<script src="psystem.js"></script>```



Add an array variable called `emittersSetup` to the file script section:

```<script type="text/javascript">var emittersSetup = [ ];</script>```


##Usage
Add a dictionary to `emittersSetup` for each emitter needed.
```javascript
//Add an 10 triangle emitter to x:10px y:10px
var emittersSetup =
[
    {x: 10, y: 10, count: 10},
];
```

