var debug = false;

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

//Triangle
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
