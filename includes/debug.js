var debug = true;

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


