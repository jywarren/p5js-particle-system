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
