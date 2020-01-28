import makeWoopaShell from "./woopaShell.js";
export default makeWoopa;
function makeWoopa(x, y, type, wobbleHeight, wobbleWidth) {
	var woopa = new Object();
	woopa.x = x;
	woopa.y = y;
	woopa.woopaType = type;
	woopa.velx = 0;
	woopa.vely = 0;
	woopa.type = "woopa";
	woopa.size = 40;
	woopa.dead = false;
	woopa.BodyColor = "rgb(158, 74, 10)";
	woopa.HeadColor = "rgb(250, 134, 0)";
	woopa.ShellColor = "rgb(0, 196, 0)"
	woopa.onplatform = false;
	woopa.goingLeft = false;
	woopa.flipDirection = 1;
	woopa.wobbleUp = true;
	woopa.wobbleHeight = wobbleHeight;
	woopa.wobbleWidth = wobbleWidth;
	woopa.wobbledY = 0;
	woopa.draw = function (ctx) {
		//Bode
		ctx.beginPath();
		ctx.moveTo(this.x, this.y-this.size*0.5);
		ctx.lineTo(this.x + (this.size)*this.flipDirection, this.y-this.size*0.5);
		ctx.lineTo(this.x + (this.size)*this.flipDirection, this.y + this.size);
		ctx.lineTo(this.x, this.y + this.size);
		ctx.lineTo(this.x, this.y);
		ctx.fillStyle = this.BodyColor;
		ctx.fill();
		//Head
		ctx.beginPath();
		ctx.moveTo(this.x + (this.size/4)*this.flipDirection, this.y - this.size*0.5);
		ctx.lineTo(this.x + (this.size/4)*this.flipDirection, this.y - this.size);
		ctx.lineTo(this.x + (this.size/4+this.size/2)*this.flipDirection, this.y - this.size);
		ctx.lineTo(this.x + (this.size/4+this.size/2)*this.flipDirection, this.y - this.size*0.5);
		ctx.lineTo(this.x + (this.size/4)*this.flipDirection, this.y - this.size*0.5);
		ctx.fillStyle = this.HeadColor;
		ctx.fill();
		//Shell
		ctx.beginPath();
		ctx.moveTo(this.x, this.y - this.size/4);
		ctx.lineTo(this.x - (this.size/3)*this.flipDirection, this.y - this.size/4);
		ctx.lineTo(this.x - (this.size/3)*this.flipDirection, this.y + this.size - this.size/4);
		ctx.lineTo(this.x, this.y + this.size - this.size/4);
		ctx.lineTo(this.x, this.y - this.size/4);
		ctx.fillStyle = this.ShellColor;
		ctx.fill();
	}

	woopa.update = function(entities, ctx, dt) {
		woopa.variables();
		woopa.colorize();
		woopa.collision(entities);
		woopa.movement(dt);
		woopa.ai();
		woopa.onplatform = false;
	}

	woopa.variables =  function() {
		this.width = (((this.size/3)*this.flipDirection) + ((this.size)*this.flipDirection));
		this.height = -(-this.size/2-this.size*0.5) + (this.size);
		if (this.goingLeft == false) {
			this.leftX = Math.round(this.x - this.size);
			this.rightX = Math.round(this.x + this.size);
		}
		else {
			this.leftX = Math.round(this.x - this.size);
			this.rightX = Math.round(this.x + this.size);
		}
		this.bottomY = Math.round(this.y + this.size);
		this.topY = Math.round(this.y - this.size);
	}

	woopa.ai =  function() {
	}

	woopa.movement = function(dt) {
		//gravity
		if (this.woopaType != "flyingWoopa") {
			this.vely+= 0.2 * dt;
		}
		//Air resistance
		if (this.velx < 0) {this.velx += (((Math.round(-this.velx*0.008*1000))/1000)+0.08) * dt; }
		if (this.velx > 0) {this.velx -= (((Math.round(this.velx*0.008*1000))/1000)+0.08) * dt; }
		//move
		this.y += Math.round(this.vely) * dt;
		this.x += Math.round(this.velx) * dt;
		//specialMove
		if (this.woopaType == "flyingWoopa") {
			if (this.goingLeft == false) {
				this.x += 2 * dt;
			} else {
				this.x -= 2 * dt;
			}
			if (this.x < x-this.wobbleWidth/2) {
				this.x = x-this.wobbleWidth/2;
				this.goingLeft = false;
			}
			if (this.x > x+this.wobbleWidth/2) {
				this.x = x+this.wobbleWidth/2;
				this.goingLeft = true;
			}
		}
		else {
			if (this.goingLeft == false) {
				this.x += 2 * dt;
			} else if (this.goingLeft == true) {
				this.x -= 2 * dt;
			}
			if (this.goingLeft == true && this.onplatform == false) {
				this.goingLeft = false;
				this.onplatform = true;
			}
			if (this.goingLeft == false && this.onplatform == false) {
				this.goingLeft = true;
				this.onplatform = true;
			}
		}
		if (this.goingLeft == true) {
			this.flipDirection = -1;
		}
		else {
			this.flipDirection = 1;
		}
		//Wobble
		if (this.woopaType == "flyingWoopa") {
			if (this.wobbleUp == false) {
				this.vely -= 0.2 *dt;
			} else if (this.wobbleUp == true) {
				this.vely += 0.2 *dt;
			}
			if (this.y-y > this.wobbleHeight/2 && this.wobbleUp == true) {
				this.wobbleUp = false;
				this.vely = 4;
			}
			if (this.y-y < -this.wobbleHeight/2 && this.wobbleUp == false) {
				this.wobbleUp = true;
				this.vely = -4;
			}
		}
	}

	woopa.collision = function(entities) {
		//platform
		if (this.woopaType != "flyingWoopa") {
			for (var i in entities) {
				if (entities[i].type == "platform") {
					if (((this.bottomY > entities[i].y)
					&& (this.topY < entities[i].y-entities[i].height))
					&& ((this.rightX > entities[i].x)
					&& (this.leftX < entities[i].x+entities[i].width))) {
						woopa.onplatform = true;
						this.y = entities[i].y-this.size+1;
						this.vely = this.vely*-0.3;
					}
				}
			}
		}
	}

	woopa.colorize = function() {
	}

	woopa.move = function() {
		this.randNum = getRandomInt(2);
		if (this.randNum == 0) {
			this.velx += 4;
		}
		if (this.randNum == 1) {
			this.velx -= 4;
		}
	}

	woopa.onDeath = function(entities) {
		entities.push(makeWoopaShell(this.x, this.y, "greenShell", this.goingLeft, x, y, type, wobbleHeight, wobbleWidth))
	}

	function getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}

	return woopa;
}
