//Emitters configurations
/*************************************************************
           x,y: emitter position
         count: number of particles
          size: size variation for particles
          type: "radial"(default) or "linear"
         vx,vy: diretional velocity
      friction: velocity decrease ammount
        stroke: stroke thickness
        rotate: true(defaul) or false : to allow particles to keep floating
  vrx,vry,vrz : Rotation velocity - default = 10
        color : "random"(default) or color EG:"#ff0000"
        style : "random"(default), "fill" or "stroke"
    direction : [only for linear] degrees
         depht: Z variable depth
*************************************************************/
//Canvas properties
var w = 1000;
var h = 800;
//If mouse should repel particles
var repel = true;
var mouseRadius = 60; //Repeling radius
//Mouse init position
var mouse = {x:0,y:0}
//Temporary rotation velocity
var v = 10;
var emittersSetup =
[
  { x:-420,
    y:-280,
    count:50,
    size:35,
    vx:30,
    vy:5,
    type:"linear",
    direction:-25,
    vrx:v,vry:v,vrz:v,
    depht:35},
];

//Hold created emitters
var emitters = [];

//*****************************
// Canvas
//*****************************
function setup(){  mouse = {x:w,y:h}
  var stage = createCanvas(w, h, WEBGL).parent("canvasHolder");
  // perspective(1, 1, 0.1, 100);
  // ortho(-width, width, height, -height/2, 0.1, 100);

  //Create emiters
  castEmitters();
}
function draw(){
  ambientLight(255); //Max light to keep materials with original color

  //Render emitters
  renderEmitters();
  //Render helpers
  debugHelpers();
}


//*****************************
// helpers
//*****************************
//Return a number btween 1 and sides
function dice(sides){
  return Math.floor( Math.random() * sides ) + 1;
}
//Return random value
function rand(value,value2){
  if(value2){
    return (Math.random() * value2) + value;
  }
  return Math.random() * value;
}
function randWithNegative(value){
  return (Math.random() * ((value*2)+1) ) - value;
}
//Calculate the distance btween two points
function distance(x1, y1, x2, y2){
  return Math.sqrt(((x2-x1)*(x2-x1)) + ((y2-y1)*(y2-y1)));
}
//Return the mddlepoint
function middlePoint( x1, y1, x2, y2 ){
  return { "x": (x1 +x2)/2 , "y": (y1+y2)/2 };
}
//Return the angle btween two points
function getAngle(x1, y1, x2, y2){
  return - Math.atan2(y1 - y2, x1 - x2);
}
//Deegree to radians
function toRadian(degrees){
  return degrees * Math.PI / 180;
}

//*****************************
// Emitter
//*****************************
//Create all emitters
function castEmitters(){
  for(var i in emittersSetup){
    //Create new emitter
    var emitter = new Emitter( emittersSetup[i].count );
    emitters.push( emitter ); //Push in to the collection

    //Set emitter type
    emitter.setType(emittersSetup[i].type);
    //Set emitter position
    emitter.setPosition(emittersSetup[i].x,emittersSetup[i].y,0);
    //set stroke size
    emitter.setStroke(emittersSetup[i].stroke);
    //Set it's velocity
    emitter.setVelocity(emittersSetup[i].vx,emittersSetup[i].vy);
    //Set emitter friction
    emitter.setFriction(emittersSetup[i].friction);
    //Set size variation
    emitter.setSize(emittersSetup[i].size);
    //Set color
    emitter.setColor(emittersSetup[i].color);
    //Set style
    emitter.setStyle(emittersSetup[i].style);
    //Set rotation permition
    emitter.setRotate(emittersSetup[i].rotate);
    //Set direction permition
    emitter.setDirection(emittersSetup[i].direction);
    //Set rotation permition
    emitter.setRotation(emittersSetup[i].vrx,emittersSetup[i].vry,emittersSetup[i].vrz);
    //
    //Set direction permition
    emitter.setDepth(emittersSetup[i].depth);
    //Cast triangles
    emitter.cast();
  }
}
//Draw emitters and particles
function renderEmitters(){
  for(var i in emitters){
    emitters[i].render();
  }
}
//*****************************

//*****************************




function onTouchMove(e){
    if(e.touches.length > 0 ){
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
}
function onMouseMove(e){
        mouse.x = e.clientX - (w/2);
        mouse.y = e.clientY - (h/2);
}
function onMouseClick(e){
  repel = repel ? false : true;
}
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("click", onMouseClick);

