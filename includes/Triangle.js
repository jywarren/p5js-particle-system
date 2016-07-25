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
  this.pZ = randWithNegative(this.emitter.depht);

  //Hold position - triangle will keep trying to go back to this position
  this.dest = { x : this.pX, y: this.pY };
  this.vx = this.vy = 0;

  this.accX = this.accY = 0;

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
        if( distance < (mouseRadius) ){
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
