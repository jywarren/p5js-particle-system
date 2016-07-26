
//*****************************
// Emitters
//*****************************
var emittersSetup =[
{x:-420, y:-280, count:40, size:35, vx:30, vy:5, type:"linear", direction:-25, delay:1},
{x:-120, y:-310, count:30, size:20,vx:16,vy:1, type:"linear"},
// {x:220, y:-200, count:40, size:30,vx:16,vy:1, type:"linear",direction:-16},
// {x:420, y:100, count:30, size:40,vx:16,vy:10, type:"linear",direction:-5},
];


//Hold created emitters
var emitters = [];

//*****************************
// Mouse
//*****************************
var mouse = {x:0,y:0}
var mouseRadius = 90; //Repeling radius

//*****************************
// Canvas
//*****************************
var fps     = 60;//Framerate
var aspect  = 1.6;  //Aspect ratio based on 1280/800
var cnvasW  = 1280; //Canvas width
var cnvasH  = cnvasW / aspect;
function setup(){
  //Current aspect ratio
  var stage = createCanvas(cnvasW, cnvasH, WEBGL).parent("canvasHolder");
  perspective(60 / 180 * PI, aspect, 0.1, 1000);
  //
  pixelDensity(1.5);
  //Frames per second
  frameRate(fps);
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
// Emitters
//*****************************
//Create all emitters
function castEmitters(){
  for(var i in emittersSetup){
    //Create new emitter. Pass
    var emitter = new Emitter( emittersSetup[i] );
    emitters.push( emitter ); //Push in to the collection
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
// Listeners
//*****************************
function PSonTouchMove(e){
    if(e.touches.length > 0 ){
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }
}
function PSonMouseMove(e){
  if(window.jQuery){
    mouse.x = e.clientX - $("#canvasHolder canvas").offset().left - (cnvasW/2);
    mouse.y = e.clientY - $("#canvasHolder canvas").offset().top - (cnvasH/2);
  }else{
    mouse.x = e.clientX - (cnvasW/2);
    mouse.y = e.clientY - (cnvasH/2);
  }
}
window.addEventListener("mousemove",  PSonMouseMove);
window.addEventListener("touchmove",  PSonTouchMove);
