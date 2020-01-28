export default makePowerup;
function makePowerup(x, y, type) {
	var powerup = new Object();
	powerup.x = x;
	powerup.y = y;
	powerup.size = 20;
	powerup.powerupType = type;
	powerup.velx = 0;
	powerup.vely = 0;
	powerup.type = "powerup";
	powerup.dead = false;
	powerup.goingLeft = true;
	var grad = 0;

	powerup.draw = function (ctx) {
		if (this.powerupType == "HPup") {
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);
			ctx.lineTo(this.x + this.size, this.y);
			ctx.lineTo(this.x + this.size, this.y + this.size);
			ctx.lineTo(this.x, this.y + this.size);
			ctx.moveTo(this.x, this.y);
			ctx.fillStyle = "rgb(255, 224, 144)";
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(this.x + this.size*1.5, this.y + this.size*-0.5);
			ctx.lineTo(this.x + this.size*1.5, this.y);
			ctx.lineTo(this.x + this.size*-0.5, this.y);
			ctx.lineTo(this.x + this.size*-0.5, this.y + this.size*-0.5);
			ctx.lineTo(this.x + this.size*-0.5, this.y + this.size*-0.5);
			ctx.fillStyle = "rgb(254, 0, 0)";
			ctx.fill();
		}
		if (this.powerupType == "fireBall") {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
			grad = ctx.createRadialGradient(this.x, this.y, this.size/8, this.x, this.y, this.size);
			grad.addColorStop(0,"rgb(255, 0, 0)");
			grad.addColorStop(1,"rgb(239, 173, 19)");
			ctx.fillStyle = grad;
			ctx.fill();
		}
		if (this.powerupType == "fireBoom") {
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI);
			grad = ctx.createRadialGradient(this.x, this.y, this.size/8, this.x, this.y, this.size*1.6);
			grad.addColorStop(0,"rgb(255, 0, 0)");
			grad.addColorStop(1,"rgb(239, 173, 19)");
			ctx.fillStyle = grad;
			ctx.fill();
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size*1.6, 1.5*Math.PI-0.5, 0.5);
			ctx.fill();
			ctx.beginPath();
			ctx.arc(this.x, this.y, this.size*1.6, Math.PI-0.5, 1.5*Math.PI+0.5);
			ctx.fill();
		}
	}

	powerup.update = function(entities, ctx, dt) {
		this.width = -this.size*2;
		this.height = this.size*1.5;
		powerup.movement(dt);
		powerup.collision(entities);
	}

	powerup.movement = function(dt) {
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
			this.x += 2 * dt;
		} else {
			this.x -= 2 * dt;
		}
		if (this.x-this.size*0.5 < 0) {
			this.x = 0+3+this.size*0.5;
			this.goingLeft = false;
		}
		if (this.x+this.size*1.5 > canvas.width) {
			this.x = canvas.width-this.size*1.5-3;
			this.goingLeft = true;
		}
	}

	powerup.collision = function(entities) {
		//platform
		for (var i in entities) {
			if (entities[i].type == "platform") {
				if (((this.y+this.size > entities[i].y)
				&& (this.y < entities[i].y-entities[i].height))
				&& ((this.x+this.size > entities[i].x)
				&& (this.x < entities[i].x+entities[i].width))) {
					this.y = entities[i].y-this.size+1;
					this.vely = this.vely*-0.3;
				}
			}
		}
	}

	powerup.onDeath = function() {
	}
	return powerup;
}
