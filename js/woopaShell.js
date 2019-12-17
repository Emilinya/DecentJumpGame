import makeWoopa from "./woopa.js";

export default makeWoopaShell;
function makeWoopaShell(x, y, type, direction, oldX, oldY, oldType, oldWobbleHeight, oldWobbleWidth) {
var woopaShell = new Object();
	woopaShell.x = x;
	woopaShell.y = y;
	woopaShell.woopaShellType = type;
	woopaShell.goingLeft = direction;
	woopaShell.velx = 0;
	woopaShell.vely = 0;
	woopaShell.speed = 10;
	woopaShell.type = "woopaShell";
	woopaShell.size = 40;
	woopaShell.dead = false;
	woopaShell.color = "rgb(0, 196, 0)"
	woopaShell.onplatform = false;
	woopaShell.booped = false;
	woopaShell.boopedLength = 0;

	woopaShell.draw = function (ctx) {
		//test
		/*ctx.beginPath();
		ctx.moveTo(this.leftX, this.bottomY);
		ctx.lineTo(this.rightX, this.bottomY);
		ctx.lineTo(this.rightX, this.topY);
		ctx.lineTo(this.leftX, this.topY);
		ctx.lineTo(this.leftX, this.bottomY);
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.fill();*/
		//Bode
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + this.size, this.y);
		ctx.lineTo(this.x + this.size, this.y + this.size/2);
		ctx.lineTo(this.x, this.y + this.size/2);
		ctx.lineTo(this.x, this.y);
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	woopaShell.update = function(entities, ctx, dt) {
		woopaShell.variables(entities);
		woopaShell.colorize();
		woopaShell.collision(entities);
		if (this.booped == false) {
			woopaShell.movement(dt);
		}
		woopaShell.ai();
		woopaShell.onplatform = false;
	}

	woopaShell.variables =  function(entities) {
		if (this.booped == true) {
			this.boopedLength += 1;
		}
		if (this.boopedLength > 100) {
			entities.push(makeWoopa(oldX, oldY, oldType, oldWobbleHeight, oldWobbleWidth));
			this.dead = true;
		}
	}

	woopaShell.ai =  function() {
	}

	woopaShell.movement = function(dt) {
		//gravity
		this.vely+= 0.2 * dt;
		//Air resistance
		if (this.velx < 0) {this.velx += (((Math.round(-this.velx*0.008*1000))/1000)+0.08) * dt; }
		if (this.velx > 0) {this.velx -= (((Math.round(this.velx*0.008*1000))/1000)+0.08) * dt; }
		//moove
		this.y += Math.round(this.vely) * dt;
		this.x += Math.round(this.velx) * dt;
		//moooove
		if (this.goingLeft == false) {
			this.x += this.speed * dt;
		} else {
			this.x -= this.speed * dt;
		}
		if (this.x < 0) {
			this.x = 1;
			this.goingLeft = false;
		}
		if (this.x+this.size > canvas.width) {
			this.x = canvas.width-1-this.size;;
			this.goingLeft = true;
		}
	}

	woopaShell.collision = function(entities) {
		//platform
		for (var i in entities) {
			if (entities[i].type == "platform") {
				if (((this.y + this.size/2 > entities[i].y)
				&& (this.y < entities[i].y-entities[i].height))
				&& ((this.x + this.size > entities[i].x)
				&& (this.x < entities[i].x+entities[i].width))) {
					this.y = entities[i].y-this.size/2+1;
					this.vely = this.vely*-0.3;
				}
			}
			if (entities[i].type == "wario" || entities[i].type == "woomba") {
				if (((this.y+this.size > entities[i].y)
				&& (this.y < entities[i].y+entities[i].size))
				&& ((this.x+this.size/2 > entities[i].x)
				&& (this.x < entities[i].x+entities[i].size))) {
					if (entities[i].type == "wario") {
						if (entities[i].vely > 2 && this.booped == false) {
							entities[i].y = this.y-entities[i].width-entities[i].borderSize-1;
							this.booped = true;
							entities[i].vely = -8;
						}
						else if (entities[i].vely > 2 && this.booped == true) {
							entities[i].y = this.y-entities[i].width-entities[i].borderSize-1;
							this.booped = false;
							this.boopedLength = 0;
							entities[i].vely = -8;
						}
						else if (entities[i].invinsible == false){
							entities[i].hp = entities[i].hp -1;
							entities[i].invinsible = true;
						}
					}
					else {
						entities[i].dead = true;
					}
				}
			}
		}
	}

	woopaShell.colorize = function() {
	}

	woopaShell.move = function() {
	}

	woopaShell.onDeath = function() {

	}
	function getRandomInt(max) {
		return Math.floor(Math.random() * Math.floor(max));
	}

	return woopaShell;
}
