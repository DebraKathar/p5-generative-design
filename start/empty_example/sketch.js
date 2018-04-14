
function setup(){
  createCanvas(710, 400, WEBGL);
}

function draw(){
  background(100);

  var radius = width * 1.5;
  
  //drag to move the world.
  orbitControl();

  
  translate(0, 0, -600);
  for(var i = 0; i <= 12; i++){
    for(var j = 0; j <= 12; j++){
      push();
      var a = j/12 * PI;
      var b = i/12 * PI;
      translate(sin(2 * a) * radius * sin(b), cos(b) * radius / 2 , cos(2 * a) * radius * sin(b));    
    
      pop();
    }
  }

  noFill();
  stroke(255);
  push();
  translate(0, 0);
  box(200,200,200);
  pop();
}

  