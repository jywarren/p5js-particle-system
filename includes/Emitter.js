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
//Emitter class
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


