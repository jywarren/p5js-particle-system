
//Canvas properties
var w = 2000;
var h = 1000;
var tempRotation = false;
//If mouse should repel particles
var repel = false;
var mouseRadius = 90; //Repeling radius
//Mouse init position
var mouse = {x:0,y:0}

var v = 20;
//Temporary rotation velocity
var emittersSetup =
[
  // { x:-10, y:0, count:1, size:300, vx:20, vy:20, style:"stroke", depht:1, rotate:true},

// { x:10, y:0, count:1, size:300, vx:20, vy:20, depht:1, rotate:true},
// {x:-420, y:-280, count:1, size:100,vx:30,vy:5, type:"linear",direction:-25, vrx:v,vry:v,vrz:v,depht:1000},

{x:-420, y:-280, count:40, size:35,vx:30,vy:5, type:"linear",direction:-25, vrx:v,vry:v,vrz:v,depht:1000},
// {x:-120, y:-310, count:30, size:20,vx:16,vy:1, type:"linear", vrx:v,vry:v,vrz:v},
// {x:220, y:-200, count:40, size:30,vx:16,vy:1, type:"linear", vrx:v,vry:v,vrz:v,direction:-16},
// {x:420, y:100, count:30, size:40,vx:16,vy:10, type:"linear", vrx:v,vry:v,vrz:v,direction:-5},

];
//Hold created emitters
var emitters = [];

//*****************************
// Canvas
//*****************************
function setup(){
  //Current aspect ratio


  mouse = {x:w,y:h}
  var stage = createCanvas(w, h, WEBGL).parent("canvasHolder");
  perspective(60 / 180 * PI, 1.6, 0.1, 1000);

  // ortho(-width, width, height, -height/2, 0.1, 100);



  pixelDensity(3.0);
  //Frames per second
  frameRate(60);
  //Create emiters
  castEmitters();
}
function draw(){ background(120);
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

    emitter.cast(); //Cast triangles
  }
}
//Draw emitters and particles
function renderEmitters(){ //This can be cast at different times
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
  tempRotation = tempRotation ? false : true;
}
window.addEventListener("mousemove", onMouseMove);
window.addEventListener("touchmove", onTouchMove);
window.addEventListener("click", onMouseClick);

