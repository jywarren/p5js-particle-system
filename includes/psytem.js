//*****************************
// Emitters
//*****************************
var emitters = [];
//*****************************
// Mouse
//*****************************
var mouse = {x:0,y:0}
var mouseRadius = 90; //Repelling radius
//*****************************
// Canvas
//*****************************
var debug   = true;
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


// Emitters


//*****************************
function Emitter( data ){
  // Emitter type
  this.type = data.type ? data.type : "radial"; //type: linear or radial(default)
  // Emitter position
  this.pX = data.x ? data.x : 0;
  this.pY = data.y ? data.y : 0;
  this.pZ = data.z ? data.z : 0;
  //Emitter direction
  this.direction = data.direction ? data.direction : 0;
  //Stroke size
  this.stroke = data.stroke ? data.stroke : 2;
  //Velocity x and y
  this.vx = data.vx ? data.vx : 5;
  this.vy = data.vy ? data.vy : 5;
  //Friction
  this.friction = Math.random() * 0.05 + data.friction ? data.friction : 0.90;
  //Particle colors
  this.color = data.color ? data.color : "random";
  //Particles styles
  this.style = data.style ? data.style : "random";
  //Particles can rotate/float
  this.rotate = data.rotate != null ? data.rotate : true;
  //Particles rotation velocity
  this.vrx = data.vrx ? data.vrx : 10;
  this.vry = data.vry ? data.vry : 10;
  this.vrz = data.vrz ? data.vrz : 10;
  this.vrr = rand(70) + 50;

  //Size variation
  this.variation = data.size ? data.size : 50.;
  //Z Depth
  this.depht = data.depth ? data.depth : 35;
  //Particle count
  this.count = data.count ? data.count : 10;
  //Particles container
  this.particles = [];

  this.framecount = 0;

  this.delay = data.delay ? data.delay : 0;
}
//Cast and hold all particles
Emitter.prototype.cast = function(){
  for(var i = 0; i < this.count; i++){
    var triangle = new Triangle( this );
    this.particles.push( triangle );
  }
}
//Render particles
Emitter.prototype.render = function(){


  //Emitter - Create new object
  push();
    //Change emitter position
    translate(this.pX,this.pY,this.pZ);
    //Change emitter direction
    rotateZ( toRadian( this.direction ) );

    push();//Open particle container

      if(debug){ //If debugable, show emitter plane
        ambientMaterial("#00ff00");
        plane(30);
      }

      //Render casted particles
      for(var i in this.particles){
        //Get current triangle
        var trangle = this.particles[i];
        trangle.react(); //Call mouse reaction
        trangle.enter(); //Call entry function
        push();
          trangle.render(); //Render triangle
        pop();
      }

    pop();//Close particle container

  //Emitter - Close object
  pop();
}

//***************************************************
//Public setup functions
//***************************************************
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
Emitter.prototype.setDepht = function(depht){
  if(!depht){return;}
  this.depht = depht;
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
Emitter.prototype.setDelay = function(delay){
  if(delay == null){return;}
  this.delay = delay;
}






/*    C = cX,cY
     /\
  cW/  \bW
  A/____\B = bX,bY
     aW*/
// Triangle
//*****************************
function Triangle( emitter ){

  //Hold the emitter data for furder calculations
  this.emitter = emitter;
  //Se color and shape type
  this.shape = this.emitter.style == "random" ? randomStyle().shape : this.emitter.style;
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
  this.cX = rand(ratio) - this.aX
  this.cY = rand(ratio) - this.aY;
  this.aX = this.aY = 0;

  var center = {x:(this.aX + this.bX + this.cX)/3, y:(this.aY + this.bY + this.cY)/3 };
  this.aX -= center.x;
  this.aY -= center.y;
  this.bX -= center.x;
  this.bY -= center.y;
  this.cX -= center.x;
  this.cY -= center.y;

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
  //
  this.vr = {x:this.vrx, y:this.vry, z:this.vrz };

  this.rx = this.ry = this.rz = 0;

  //Initial position - dynamic
  this.pX =
  this.pY = 0;
  this.pZ = rand(this.emitter.depht);

  //Hold position - triangle will keep trying to go back to this position
  this.dest = { x : this.pX, y: this.pY };
  this.vx = this.vy = 0;
  //
  this.accX = this.accY = 0;
}

//Triangle
function debugPoints(t){return;
  if(!debug){return;}
  var rdius = 5;
  var mA  = middlePoint(t.aX,t.aY,t.bX,t.bY);
  var mB  = middlePoint(t.bX,t.bY,t.cX,t.cY);
  var mC  = middlePoint(t.aX,t.aY,t.cX,t.cY);
  // if(debug){
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

    push();
      ambientMaterial("#0000ff");
      sphere(rdius/2);
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

    push();
      var center = {x:(t.aX + t.bX + t.cX)/3, y:(t.aY + t.bY + t.cY)/3 };
      translate(center.x,center.y, 0);
      sphere(rdius*2);
    pop();
    //Finish points
  // }
}
//** Outline triangle
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
    debugPoints(t);
    push();
      ambientMaterial(t.color);
      // rotateY( toRadian( mouse.x ) );
      // rotateX( toRadian( mouse.y ) );
      // rotateZ( toRadian( mouse.x ) );
      triangle(t.aX, t.aY, t.bX, t.bY, t.cX, t.cY);
    pop();
  pop();
}
//Render triangle
Triangle.prototype.render = function(){
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
  if( (this.emitter.delay * fps) > frameCount ){ return; }
  if(this.canReact){ return; }

  this.eavx *= this.emitter.friction;
  this.eavy *= this.emitter.friction;
  this.pX += this.eavx;
  this.pY += this.eavy;

  if(this.eavx < .3 && this.eavy < .3){
    this.dest = { x : this.pX, y: this.pY };
    this.canReact = true;
  }
}
//Float around it's center
Triangle.prototype.float = function(){
  if(this.emitter.rotate==false){ return; }

  var ratio = 10;
  this.rx += (this.vrx/ratio);
  this.ry += (this.vry/ratio);
  this.rz += (this.vrz/ratio);

  rotateX( toRadian( this.rx ) % 360  );
  rotateY( toRadian( this.ry ) % 360  );
  rotateZ( toRadian( this.rz ) % 360  );
}
//React to mouse position
Triangle.prototype.react = function(){
    if(!this.canReact){return;} //Check if can react

    //Get acceleration
    this.accX = (this.dest.x - this.pX) / 100;
    this.accY = (this.dest.y - this.pY) / 100;
    // Increase velocity
    this.vx += this.accX;
    this.vy += this.accY;
    //Add friction to "stop moving"
    this.vx *= this.emitter.friction;
    this.vy *= this.emitter.friction;
    //Change position
    this.pX += this.vx;
    this.pY += this.vy;


    //MOUSE REPELENT
    //Compensate emitter position to be affected in the word
    var mX = mouse.x - this.emitter.pX;
    var mY = mouse.y - this.emitter.pY;

    //Check position related to mouse
    var a = this.pX - mX;
    var b = this.pY - mY;
    var distance = Math.sqrt( a*a + b*b );
    if( distance < (mouseRadius) ){

      this.accX = (this.pX - mX) / 250;
      this.accY = (this.pY - mY) / 250;

      this.vx += this.accX;
      this.vy += this.accY;

      this.vrx = this.vr.x + this.emitter.vrr;
      this.vry = this.vr.y + this.emitter.vrr;
      this.vrz = this.vr.z + this.emitter.vrr;

    }else{
      var fric = 0.90;
      this.vrx *= fric;//this.emitter.friction;
      this.vry *= fric;//this.emitter.friction;
      this.vrz *= fric;//this.emitter.friction;

      var varratio = 100;
      this.vrx = this.vrx <= this.vr.x ? this.vr.x : this.vrx;// - (this.emitter.vrr / varratio);
      this.vry = this.vry <= this.vr.y ? this.vr.y : this.vry;// - (this.emitter.vrr / varratio);
      this.vrz = this.vrz <= this.vr.z ? this.vr.z : this.vrz;// - (this.emitter.vrr / varratio);
    }

}
// Style
//*****************************
// //Get random style and color
function randomStyle(){
  var shape = dice(2) == 1 ? "stroke" : "fill";
  var color = dice(2) == 1 ? "#fff" : "#0097cf";
  return { "shape": shape , "color" : color };
}




//*****************************
// helpers
//*****************************
function debugHelpers(){
  if(!debug){return;}

  push();
  translate(mouse.x, mouse.y,0);
  ambientMaterial("#ff0000");
  sphere(mouseRadius);
  pop();

  push();
    ambientMaterial("#ff0000");
    sphere(5);
  pop();
}
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
    mouse.x = e.clientX - $("#canvasHolder").offset().left - (cnvasW/2);
    mouse.y = e.clientY - $("#canvasHolder").offset().top - (cnvasH/2);
  }else{
    mouse.x = e.clientX - (cnvasW/2);
    mouse.y = e.clientY - (cnvasH/2);
  }
}
window.addEventListener("mousemove",  PSonMouseMove);
window.addEventListener("touchmove",  PSonTouchMove);
