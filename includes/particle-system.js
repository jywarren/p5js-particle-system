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
*************************************************************/
var v = 10;
var emittersSetup = [
  {x:-420, y:-280, count:50, size:35,vx:30,vy:5, type:"linear",direction:-25, vrx:v,vry:v,vrz:v},


{x:-120, y:-310, count:30, size:20,vx:16,vy:1, type:"linear", vrx:v,vry:v,vrz:v},


{x:220, y:-200, count:40, size:30,vx:16,vy:1, type:"linear", vrx:v,vry:v,vrz:v,direction:-16},

{x:420, y:100, count:40, size:40,vx:16,vy:10, type:"linear", vrx:v,vry:v,vrz:v,direction:-5},
  // { x:0, y:0, size:40, count:20, vx:20, vy:10, type:"linear" }, //emitter 2
];

var debug = false;
var w = 1000;
var h = 800;
var repel = true;

//Hold created emitters
var emitters = [];
var mouse = {x:0,y:0}
var depht = 35;
var mouseRadius = 1;

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
    emitter.setFriction(emittersSetup[i].friction); //!!!NEEDED
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
//Emitter class
function Emitter( particlesCount ){
  this.type = "radial"; //type: linear or radial(default)
  this.pX = this.pY = this.pZ = 0;//Init position
  this.direction = 0;
  this.stroke = 2;//Stroke size
  this.vx = this.vy = 5.;  //Velocity x and y
  this.friction = Math.random() * 0.05 + 0.90;  //Set friction
  this.color = "random";
  this.style = "random";
  this.rotate = true;
  this.vrx=this.vry=this.vrz = 10;
  this.variation = 50.;
  this.count = particlesCount;
  this.particles = [];//Create and hold particles
}
//
Emitter.prototype.setType = function(type){
  if(!type){return;}
  this.type = type;
}
Emitter.prototype.setPosition = function(x,y,z){
   this.pX = x; this.pY = y; this.pZ = z;
}
Emitter.prototype.setDirection = function(degrees){
  if(!degrees){return;}
  this.direction = degrees;
}
Emitter.prototype.setStroke = function(stroke){
  if(!stroke){return;}
  this.stroke = stroke;
}
Emitter.prototype.setVelocity = function(vx,vy){
  if(vx){ this.vx = vx; }
  if(vy){ this.vy = vy; }
}
Emitter.prototype.setFriction = function(friction){
  if(!friction){return;}
  this.friction = Math.random() * 0.05 + friction;
}
Emitter.prototype.setSize = function(size){
  if(!size){return;}
  this.variation = size;
}
Emitter.prototype.setColor = function(color){
  if(!color){return;}
  this.color = color;
}
Emitter.prototype.setStyle = function(style){
  if(!style){return;}
  this.style = style;
}
Emitter.prototype.setRotate = function(rotate){
  if(!rotate){return;}
  this.rotate = rotate;
}
Emitter.prototype.setRotation = function(vx,vy,vz){
  if(vx){this.vrx = vx;}
  if(vy){this.vrx = vy;}
  if(vz){this.vrx = vz;}
}
//Cast particles
Emitter.prototype.cast = function(){
  for(var i = 0; i < this.count; i++){
    var triangle = new Triangle( this );
    this.particles.push( triangle );
  }
}
//Render particles
Emitter.prototype.render = function(){
  push();

    translate(this.pX,this.pY,this.pZ);
    rotateZ( toRadian( this.direction ) );
    push();
      if(debug){
        ambientMaterial("#00ff00");
        plane(30);
      }
      //Cast particles
      for(var i in this.particles){
     //Get current triangle
        var t = this.particles[i];
        t.react(); //Mouse reaction
        t.enter();
        push();
          t.render(); //Print
        pop();
      }
    pop();
  pop();
}
//*****************************
// Triangle
//*****************************

// Style
//*****************************
// //Get random style and color
function randomStyle(){
  var shape = dice(2) == 1 ? "stroke" : "fill";
  var color = dice(2) == 1 ? "#fff" : "#0097cf";
  return { "shape": shape , "color" : color };
}
// //Create triangle
// //Takes variation: handle variation when calculating points
function Triangle( emitter ){
  /*
      C = cX,cY
     /\
  cW/  \bW
  A/____\B = bX,bY
     aW
  */
  //Hold the emitter data for furder calculations
  this.emitter = emitter;
  //
  this.shape = this.emitter.style == "random" ?randomStyle().shape : this.emitter.style;
  this.color = this.emitter.color == "random" ? randomStyle().color : this.emitter.color;
  //Prevent mouse interaction
  this.canReact = false;
  //Prevent from rendering
  this.canRender = false;

  //Points
  var ratio = emitter.variation;
  this.aX = rand(ratio);
  this.aY = rand(ratio);
  this.bX = rand(ratio) - this.aX;
  this.bY = rand(ratio) - this.aY;
  this.cX = rand(ratio) - this.aX;
  this.cY = rand(ratio) - this.aY;
  this.aX = this.aY = 0;
  //Sides sizes
  this.aW = distance(this.aX, this.aY,this.bX, this.bY);
  this.bW = distance(this.bX, this.bY,this.cX, this.cY);
  this.cW = distance(this.aX, this.aY,this.cX, this.cY);
  //Angles, in radians
  this.aR = getAngle(this.aX, this.aY,this.bX, this.bY);
  this.bR = getAngle(this.bX, this.bY,this.cX, this.cY);
  this.cR = getAngle(this.aX, this.aY,this.cX, this.cY);

  //Entry velocity, acording to emitter type
  this.evx = emitter.type == "linear" ? rand(emitter.vx) : randWithNegative(emitter.vx);
  this.evy = emitter.type == "linear" ? rand(emitter.vy) : randWithNegative(emitter.vy);
  //Entry acctual velocity
  this.eavx = this.evx;
  this.eavy = this.evy;
  //Rotation velocity X
  this.vrx = rand(this.emitter.vrx);
  this.vry = rand(this.emitter.vrz);
  this.vrz = rand(this.emitter.vrz);

  //Initial position - dynamic
  this.pX = this.pY = 0;
  this.pZ = randWithNegative(depht);

  //Hold position - triangle will keep trying to go back to this position
  this.dest = { x : this.pX, y: this.pY };
    this.vx = this.vy = 0;

  this.accX = this.accY = 0;

}
//** Outline triangle
function debugPoints(t){
  var rdius = 2;
  var mA  = middlePoint(t.aX,t.aY,t.bX,t.bY);
  var mB  = middlePoint(t.bX,t.bY,t.cX,t.cY);
  var mC  = middlePoint(t.aX,t.aY,t.cX,t.cY);
  if(debug){
    //Init centers
    push();
      ambientMaterial("#ccc");
      push();
        translate(mA.x,mA.y, 0);
        sphere(rdius/2);
      pop();
      push();
        translate(mB.x,mB.y, 0);
        sphere(rdius/2);
      pop();
      push();
        translate(mC.x,mC.y, 0);
        sphere(rdius/2);
      pop();
    pop();
    //Finish centers
    //Init points
    push();
      push();
        ambientMaterial("#ff0000");
        translate(t.aX,t.aY, 0);
        sphere(rdius);
      pop();
      push();
        ambientMaterial("#00ff00");
        translate(t.bX,t.bY, 0);
        sphere(rdius);
      pop();
      push();
        ambientMaterial("#0000ff");
        translate(t.cX,t.cY, 0);
        sphere(rdius);
      pop();
    pop();
    //Finish points
  }
}
function outlineTriangle(t){
  push();
    t.float();
    var mA  = middlePoint(t.aX,t.aY,t.bX,t.bY);
    var mB  = middlePoint(t.bX,t.bY,t.cX,t.cY);
    var mC  = middlePoint(t.aX,t.aY,t.cX,t.cY);

    //Add debugging points
    debugPoints(t);

    var strokeW = t.emitter.stroke;

    //Init sides
    push();
      ambientMaterial(t.color);
      //Bottom - A -> B
      push();
          translate(mA.x,mA.y, 0);
          rotateZ( t.aR );
          plane(t.aW,strokeW);
      pop();
      //Right - B -> C
      push();
          translate(mB.x,mB.y, 0);
          rotateZ( t.bR );
          plane(t.bW,strokeW);
      pop();
      //Left - A -> C
      push();
          translate(mC.x,mC.y, 0);
          rotateZ( t.cR );
          plane(t.cW,strokeW);
      pop();
    pop();
    //Finish sides
  pop();
}
//** fullfill triangle
function fullTriangle(t){
  push();
    t.float();
    push();
      ambientMaterial(t.color);
      triangle(t.aX, t.aY, t.bX, t.bY, t.cX, t.cY);
    pop();
  pop();
}
//Render triangle
Triangle.prototype.render = function(){
  if(!this.canRender){return;} //If can not render, stop.

    translate(this.pX,this.pY,this.pZ);
    push();
       switch(this.shape){
         case "stroke":
           outlineTriangle(this);
         break;
         default:
           fullTriangle(this);
           break;
       }
    pop();
}
//Animate entrance
Triangle.prototype.enter = function(){
  if(this.canReact){ return; }
  this.canRender = true;

  this.eavx *= this.emitter.friction;
  this.eavy *= this.emitter.friction;
  this.pX += this.eavx;
  this.pY += this.eavy;

  if(this.eavx < .3 && this.eavy < .3){
    this.dest = { x : this.pX, y: this.pY };
    this.canReact = true;
  }

}
//React to mouse position
Triangle.prototype.react = function(){//return;
    if(!this.canReact || !repel){return;} //Check if can react

    //Get acceleration
        this.accX = (this.dest.x - this.pX) / 1000;
        this.accY = (this.dest.y - this.pY) / 1000;

    // Increase velocity
    this.vx += this.accX;
        this.vy += this.accY;

    //Add friction to "stop moving"
        this.vx *= this.emitter.friction;
        this.vy *= this.emitter.friction;

        //Change position
        this.pX += this.vx; //console.log(this.vx);
        this.pY += this.vy;


    //MOUSE REPELENT
    //Compensate emitter position to be affected in the word
    var mX = mouse.x - this.emitter.pX;
    var mY = mouse.y - this.emitter.pY;
    //Check position related to mouse
        var a = this.pX - mX;
        var b = this.pY - mY;
    var distance = Math.sqrt( a*a + b*b );
        if( distance < (mouseRadius * 70 ) ){
      this.accX = (this.pX - mX)/100;
            this.accY = (this.pY - mY)/100;
      this.vx += this.accX;
            this.vy += this.accY;
        }

}
//Float around it's center
Triangle.prototype.float = function(){
  if(this.emitter.rotate==false){ return; }
  var ratio = 1000;
  rotateX(frameCount * (this.vrx/ratio));
  rotateY(frameCount * (this.vry/ratio));
  rotateZ(frameCount * (this.vrz/ratio));
}



function debugHelpers(){
  if(!debug){return;}

  push();
  translate(mouse.x, mouse.y,0);
  ambientMaterial("#ff0000");
  sphere(mouseRadius * 70);
  pop();

  push();
    ambientMaterial("#ff0000");
    sphere(5);
  pop();
}
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

