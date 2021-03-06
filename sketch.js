
let pulses = [];
let collition_map;
let noice = 0; //0.01

function preload() {
  collition_map = loadImage('uk_map.png');
}

function setup() {
  // put setup code here  
  createCanvas(collition_map.width, collition_map.height);
  angleMode(DEGREES);
  collition_map.loadPixels();
  background("black");
}

function draw() {
  background(0, 15, 0, 80);
  for (let pulse in pulses) {
    pulses[pulse].update();
    pulses[pulse].draw();
  }
}

function removePulse(pulseToRemove){
	for (let pulse in pulses) {
		if(pulses[pulse] == pulseToRemove){
			 this.pulses.splice(pulse, 1);
			break;
		}
	}
}

/**
 * Create new Pulse when the mouse is pressed
 */
function mousePressed() {
  pulses.push(new Pulse(mouseX, mouseY));
}

/**
 * 
 */
class Pulse {

  /**
   * Create a new pulse at specified x and y coordintates
   * @param {float} _x 
   * @param {float} _y 
   */
  constructor(_x, _y) {
    this.pos = createVector(_x, _y);
    this.maxParticles = 100;              // Total number of particles in the pulse
    this.particles = [];                  // Array to hold all particles

	//check if pulse collids instantly
	//find index of pixel on collition_map under particle
    let pix = 4 * ((round(this.pos.y) * width) + round(this.pos.x));

	//if pixel is white, particle has collided ( or random noice)
	if (collition_map.pixels[pix] == "255") {
		removePulse();
	}else{
		
		for (let i = 0; i < this.maxParticles; i++) {

		  // Evenly spread initial direction of particles 
		  let angle = (360 / this.maxParticles) * i;
		  let dir = createVector(0, 1);
		  dir.rotate(angle);

		  // Make copy of Pulse position for each particle
		  let posCopy = this.pos.copy();

		  //create new particle and put it in array
		  this.particles.push(new Particle(posCopy, dir, this));
		}
	}
	
	
  }

  /**
   * Update all elements of the pulse
   */
  update() {
    for (let particle in this.particles) {
      this.particles[particle].update();
    }
  }

  /**
   * Draw all elements of the pulse to screen
   */
  draw() {
    for (let particle in this.particles) {
      this.particles[particle].draw();
    }
  }

  /**
   * Remove particle from pulse
   * @param {Particle} particleToRemove 
   */
  removeParticle(particleToRemove) {
    for (let particle in this.particles) {
      if (this.particles[particle] == particleToRemove) {
        this.particles.splice(particle, 1);
        break;
      }
    }
	
	if(this.particles.length <= 0){
		removePulse();
	}
  }
  
  removePulse(){
	removePulse(this);
  }

}

class Particle {

  /**
   * Create a new particle at position coordinates
   * 
   * @param {p5.Vector} _pos   Initial position of particle
   * @param {p5.Vector} _dir   Initial direction of particle 
   * @param {Pulse} _pulse     Reference to parent pulse
   */
  constructor(_pos, _dir, _pulse) {
    this.position = _pos;
    this.direction = _dir;
    this.pulse = _pulse;

    this.hit = false; // Flag when particle collides with anything
    this.life = 500;  // How long the particle lives ( frames)
    this.speed = 5; // initial speed of the particle
  }

  /**
   * Update particle
   */
  update() {

    //set the speed of the particle
    this.direction.setMag(this.speed);

    if (!this.hit) {

      //find index of pixel on collition_map under particle
      let pix = 4 * ((round(this.position.y) * width) + round(this.position.x));

      //if pixel is white, particle has collided ( or random noice)
      if ((collition_map.pixels[pix] == "255") || (random() < noice)) {
        this.hit = true;
      }

      //update position of particle
      this.position.add(this.direction);
    }

    //reduce lifespan
    this.life--;

    //delete particle if no life left
    if (this.life <= 0) {
      this.pulse.removeParticle(this);
    }else if(this.position.y <0 || this.position.x < 0 || this.position.y > height || this.position.x > width){ //check if left canvas
		this.pulse.removeParticle(this);
	}
	
  }

  /**
   * Draw particle to screen
   */
  draw() {
    if (this.hit) {
      stroke(50, 255, 50, this.life / 5);
      strokeWeight(3); // Make the points 10 pixels in size
    } else {
      stroke(255, 255, 255, 100);
      strokeWeight(3); // Make the points 10 pixels in size
    }

    point(this.position.x, this.position.y);

  }

}