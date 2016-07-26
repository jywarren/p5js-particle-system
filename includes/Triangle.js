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
    //Add debugging points
    debugPoints(t);

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
    debugPoints(t);
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
      this.vrx = this.vrx <= this.vr.x ? this.vr.x : this.vrx *= fric;
      this.vry = this.vry <= this.vr.y ? this.vr.y : this.vry *= fric;
      this.vrz = this.vrz <= this.vr.z ? this.vr.z : this.vrz *= fric;
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

