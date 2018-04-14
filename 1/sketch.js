var system;
var frameA = 0;
var birthRate = 20;
var startHeight = 0;
var startCount = 0;
var xLineCoordinates = [];
var yLineCoordinates = [];
var zLineCoordinates = [];
var currentRotY = 0;
var currentRotX = -0.31;
var globalRotY = 0.02;
var shapeArray = [3, 4, 66];
var shapeArrayRes = [3, 4, 33];
var shapeIndex = 2;

var dragged = false;

var coordMin = -1000;
var coordMax = 1000;

var initialMouseX = 0;
var initialMouseY = 0;
var initialRotX = 0;
var initialRotY = 0;


//Setup Window
function setup() {
	var canvas = createCanvas(windowWidth, windowHeight, WEBGL);
	canvas.parent("#sketch");

	document.getElementById('sketch').addEventListener('touchmove', function(e) {

		e.preventDefault();

	}, false);

	n = new Date();
	y = n.getFullYear();
	m = n.getMonth() + 1;
	d = n.getDate();
	var months = ["January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	document.getElementById("subDate").innerHTML = months[m - 1] + " " + d;

	var start = new Date(n.getFullYear(), 0, 0);
	var diff = n - start;
	var oneDay = 1000 * 60 * 60 * 24;
	var day = Math.floor(diff / oneDay);
	document.getElementById("dayOfYear").innerHTML = "Day " + day;

	var fov = 60 / 180 * PI;
	var cameraZ = (height / 2.0) / tan(fov / 2.0);
	perspective(60 / 180 * PI, width / height, cameraZ * 0.1, cameraZ * 10);

	system = new ParticleSystem(createVector(windowWidth / 2, startHeight));
	system.addParticle();

	for (var i = 0; i < 1000; i++) {
		xLineCoordinates.push(random(coordMin, coordMax));
		yLineCoordinates.push(random(coordMin, coordMax));
		zLineCoordinates.push(random(coordMin, coordMax));
	}

	frameRate(60);
}

//Primary Drawing Function (Every 1/60th of a second)
function draw() {
	background(0);

	rotateX(currentRotX + radians(-rotationX));
	rotateY(currentRotY + globalRotY + radians(-rotationZ));

	for (var i = 0; i < xLineCoordinates.length; i++) {
		push();
		translate(xLineCoordinates[i], yLineCoordinates[i], zLineCoordinates[i]);
		normalMaterial();
		fill(255);
		sphere(1);
		pop();
	}

	if (!mouseIsPressed) {
		globalRotY += 0.002;
	}

	directionalLight(253, 73, 113, 1.5, 0, 0.2);
	directionalLight(58, 251, 255, -1, 0, 0.2);


	system.run();
	everyAFrames();
}

//A timing function to control the generation speed of balls
function everyAFrames() {

	if (frameA < birthRate) {
		frameA++;
	} else {
		system.addParticle();
		frameA = 0;
	}
}

//Taking Care of a better orbit control, one that doesn't reset.  Adapted from the orbitControl() function
function mousePressed() {
	initialMouseX = this.mouseX;
	initialMouseY = this.mouseY;
	initialRotX = currentRotX;
	initialRotY = currentRotY;
	dragged = false;

}

function mouseDragged() {
	dragged = true;
	currentRotY = initialRotY + ((this.mouseX - initialMouseX) * 2) / (this.width / 2);
	currentRotX = initialRotX + ((this.mouseY - initialMouseY) * 2) / (this.width / 2);
}

function mouseReleased() {
	if (!dragged) {
		if (shapeIndex < shapeArray.length - 1) {
			shapeIndex++;
		} else {
			shapeIndex = 0;
		}
	}
}


var Particle = function(position) {
	this.velocity = createVector(0, 2);
	this.position = position.copy();
	this.position.y = -(windowHeight / 2) - 350;
	this.position.x = random(-windowWidth / 2, windowWidth / 2);
	this.position.z = random(600, -600);
	this.rotationSpeedX = random(0, 0.02);
	this.rotationSpeedY = random(0, 0.02);
	this.rotationSpeedZ = random(0, 0.02);
	this.lifespan = 800.0;
};

Particle.prototype.run = function() {
	this.update();
	this.display();
};

Particle.prototype.update = function() {
	this.position.add(this.velocity);
	this.lifespan -= 1;
};

Particle.prototype.display = function() {
	noStroke();

	fill(255);

	var newY = animateCircle(this.position.y, this.velocity.y)[0];
	this.velocity.y = animateCircle(this.position.y, this.velocity.y)[1];

	if (this.lifespan > 800 - 255) {
		ambientMaterial(abs((this.lifespan * -1) + 800));
	} else {
		ambientMaterial(this.lifespan);
	}

	push();
	translate(this.position.x, this.position.y, this.position.z);
	rotateZ(frameCount * this.rotationSpeedZ);
	rotateX(frameCount * this.rotationSpeedX);
	rotateY(frameCount * this.rotationSpeedY);
	torus(50, 20, shapeArray[shapeIndex], shapeArrayRes[shapeIndex]);
	pop();
};

// Is the particle still useful?
Particle.prototype.isDead = function() {
	if (this.lifespan < 0) {
		return true;
	} else {
		return false;
	}
};

var ParticleSystem = function(position) {
	this.origin = position.copy();
	this.particles = [];
};

ParticleSystem.prototype.addParticle = function() {
	this.particles.push(new Particle(this.origin));
};

ParticleSystem.prototype.run = function() {
	for (var i = this.particles.length - 1; i >= 0; i--) {
		var p = this.particles[i];
		p.run();
		if (p.isDead()) {
			this.particles.splice(i, 1);
		}
	}
};

function animateCircle(circleY, yVel) {

	circleY += yVel;

	return [circleY, yVel];
}

//Window scales up or down, just resizes canvas to fit
function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}
