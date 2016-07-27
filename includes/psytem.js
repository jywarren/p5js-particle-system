var debug   = false;//Will show the emitters position, canvas center and mouse position

//Mouse interaction
var mouseRadius = 90; //Repelling radius
var friction = Math.random() * 0.05 + 0.90;
//System variables
var emitters = [];  //Hold created emitters
var fps     = 60;   //Framerate
var far     = 500;  //Camera distance
var aspect  = 1;    //Aspect ratio for height calculation
var cnvasW  = 1400; //Canvas width
var cnvasH  = cnvasW / aspect;
window.setup = function(){
  //Current aspect ratio
  var stage = createCanvas(cnvasW, cnvasH, WEBGL).parent("canvasHolder");
  var vpoint = 1.43;
  ortho(-width/vpoint, width/vpoint, -height/vpoint, height/vpoint, 0.1, far);
  //
  pixelDensity(1.5);//Improve render quality
  frameRate(fps);   //Change the FPS

  castEmitters();//Create particle emiters
}
window.draw = function(){
  ambientLight(255); //Max light to keep materials with original color
  renderEmitters();  //Render emitters
  //Render helpers
  debugHelpers();
}
//*****************************
// Emitters
function castEmitters(){
  //Create emitters
  for(var i in emittersSetup){
    var emitter = new Emitter( emittersSetup[i] );
    emitters.push( emitter ); //Push in to the collection
    emitter.cast(); //Cast triangles
  }
}
//Start all emitters
function startEmitters(){
  for(var i in emitters){
    emitters[i].start();
  }
}
//Draw emitters and particles
function renderEmitters(){
  for(var i in emitters){
    emitters[i].render();
  }
}

//*****************************
// Emitter CLASS
//*****************************
function Emitter( data ){
  //Emitter hold particles entrance
  this.didStart     = false;
  // Emitter type
  this.type = data.type ? data.type : "radial"; //type: linear or radial(default)
  // Emitter position
  this.pX = data.x ? data.x : 0;
  this.pY = data.y ? data.y : 0;
  //Emitter direction
  this.direction = data.direction ? data.direction : 0;
  //Stroke size
  this.stroke = data.stroke ? data.stroke : 2;
  //Velocity x and y
  this.vx = data.vx ? data.vx : 5;
  this.vy = data.vy ? data.vy : 5;
  //Particle colors
  this.color = data.color ? data.color : "random";
  //Particles styles
  this.style = data.style ? data.style : "random";
  //Particles rotation velocity
  var defaultRV = 25;
  this.vrx = data.vrx ? data.vrx : defaultRV;
  this.vry = data.vry ? data.vry : defaultRV;
  this.vrz = data.vrz ? data.vrz : defaultRV;
  this.vrr = rand(50) + 50;
  //Size variation
  this.variation = data.size ? data.size : 50.;
  //Particle count
  this.count = data.count ? data.count : 10;
  //Particles container
  this.particles = [];
  this.waitingParticles = 0; //particles waiting to enter

  //debug
  this.debugcolor = debug == true ? "#00ff00" : "rgba(0,0,0,0)";
}
//Cast and hold all particles
Emitter.prototype.cast = function(){
  for(var i = 0; i < this.count; i++){
    var triangle = new Triangle( this );
    this.particles.push( triangle );
    this.waitingParticles++;
  }
}
//Render particles
Emitter.prototype.render = function(){
  //Emitter - Create new object
  push();
    //Change emitter position
    translate(this.pX,this.pY,0);
    //Change emitter direction
    rotateZ( toRadian( this.direction ) );

    push();//Open particle container

      //Debug marker
      ambientMaterial(this.debugcolor);
      plane(30);

      //
      if( this.waitingParticles > 0 ){
        for(var i in this.particles){//Render and enter casted particles
          var trangle = this.particles[i];//Get current triangle
          trangle.enter(); //Call entry function
          push();
            trangle.render(); //Render triangle
          pop();
        }
      }else{
        for(var i in this.particles){//Render and react casted particles
          var trangle = this.particles[i];//Get current triangle
          trangle.react(); //Call mouse reaction
          push();
            trangle.render(); //Render triangle
          pop();
        }
      }

    pop();//Close particle container
  //Emitter - Close object
  pop();
}
//
Emitter.prototype.start = function(){
  this.didStart = true;
}

// Triangle
//*****************************
function Triangle( emitter ){
  //Hold the emitter data for furder calculations
  this.emitter = emitter;
  //Se color and shape type
  this.shape = this.emitter.style == "random" ? randomStyle().shape : this.emitter.style;
  this.color = this.emitter.color == "random" ? randomStyle().color : this.emitter.color;
  this.bkColor = this.color;
  //Prevent mouse interaction
  this.canReact = false;

  //Points
  var ratio = emitter.variation;
  this.aX = rand(ratio);
  this.aY = rand(ratio);
  this.bX = rand(ratio) - this.aX;
  this.bY = rand(ratio) - this.aY;
  this.cX = rand(ratio) - this.aX
  this.cY = rand(ratio) - this.aY;
  this.aX = this.aY = 0;
  //Move to center
  var center = {x:(this.aX + this.bX + this.cX)/3, y:(this.aY + this.bY + this.cY)/3 };
  this.aX -= center.x;
  this.aY -= center.y;
  this.bX -= center.x;
  this.bY -= center.y;
  this.cX -= center.x;
  this.cY -= center.y;
  //Sides sizes
  this.aW = distance(this.aX,this.aY,this.bX,this.bY);
  this.bW = distance(this.bX,this.bY,this.cX,this.cY);
  this.cW = distance(this.aX,this.aY,this.cX,this.cY);
  //Midd points
  this.mA  = middlePoint(this.aX,this.aY,this.bX,this.bY);
  this.mB  = middlePoint(this.bX,this.bY,this.cX,this.cY);
  this.mC  = middlePoint(this.aX,this.aY,this.cX,this.cY);
  //Angles, in radians
  this.aR = getAngle(this.aX,this.aY,this.bX,this.bY);
  this.bR = getAngle(this.bX,this.bY,this.cX,this.cY);
  this.cR = getAngle(this.aX,this.aY,this.cX,this.cY);
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
  this.pX = 10;
  this.pY = 0;
  this.pZ = rand(far);

  //Hold position - triangle will keep trying to go back to this position
  this.dest = { x : this.pX, y: this.pY };
  this.vx = this.vy = 0;
  //
  this.accX = this.accY = 0;
}

//Triangle
//** Outline triangle
function outlineTriangle(t){
  push();
    t.float();
    //
    var strokeW = t.emitter.stroke;
    //Init sides
    push();
      ambientMaterial(t.color);
      //Bottom - A -> B
      push();
          translate(t.mA.x,t.mA.y, 0);
          rotateZ( t.aR );
          plane(t.aW,strokeW);
      pop();
      //Right - B -> C
      push();
          translate(t.mB.x,t.mB.y, 0);
          rotateZ( t.bR );
          plane(t.bW,strokeW);
      pop();
      //Left - A -> C
      push();
          translate(t.mC.x,t.mC.y, 0);
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
  //Prevent entrance before start call
  if( !this.emitter.didStart ){
    this.setColor("rgba(0,0,0,0)"); //Change triangle color
    return;
  }
  //Set correct color
  this.setColor(this.bkColor);
  //
  if(this.canReact){ return; }

  this.eavx *= friction;//this.emitter.friction;
  this.eavy *= friction;//this.emitter.friction;
  this.pX += this.eavx;
  this.pY += this.eavy;

  if(this.eavx < .3 && this.eavy < .3){
    this.dest = { x : this.pX, y: this.pY };
    this.canReact = true;
    this.emitter.waitingParticles --;
  }
}
//Float around it's center
Triangle.prototype.float = function(){
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
    //Get acceleration
    this.accX = (this.dest.x - this.pX) / 100;
    this.accY = (this.dest.y - this.pY) / 100;
    // Increase velocity
    this.vx += this.accX;
    this.vy += this.accY;
    //Add friction to "stop moving"
    this.vx *= friction;//this.emitter.friction;
    this.vy *= friction;//this.emitter.friction;
    //Change position
    this.pX += this.vx;
    this.pY += this.vy;


    //MOUSE REPELENT
    //Compensate emitter position to be affected in the word
    var mX = currentMouseX() - this.emitter.pX;
    var mY = currentMouseY() - this.emitter.pY;

    //Calculate the triangle point according to emitter rotation
    var rotatedX = this.pX * Math.cos( toRadian( 360 - this.emitter.direction  ) );
    var rotatedY = this.pX * Math.sin( toRadian( 360 - this.emitter.direction  ) );

    //Get the distance between
    var a = rotatedX - mX;
    var b = rotatedY - mY;
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
      this.vrx *= fric;
      this.vry *= fric;
      this.vrz *= fric;

      var varratio = 100;
      this.vrx = this.vrx <= this.vr.x ? this.vr.x : this.vrx;
      this.vry = this.vry <= this.vr.y ? this.vr.y : this.vry;
      this.vrz = this.vrz <= this.vr.z ? this.vr.z : this.vrz;
    }

}
//Change triangle color
Triangle.prototype.setColor = function(color){
  this.color = color;
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
function currentMouseX(){
  return mouseX - width/2;
}
function currentMouseY(){
  return mouseY - height/2;
}


function debugHelpers(){
  if(!debug){return;}

  push();
  translate(currentMouseX(), currentMouseY(),0);

  // var wS = width/2;
  // var hS = height/2;
  // // var xteste = 0.08;

  // var tmX = (mouseX - wS);// - (mouseX * xteste);
  // var tmY = (mouseY - hS);

  // translate(tmX, tmY, 0);


  // console.log(width, height, tmX, tmY,mouseX * xteste, xteste);


  ambientMaterial("#ff0000");
  plane(mouseRadius);
  ambientMaterial("#00ff00");
  plane(4);
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
