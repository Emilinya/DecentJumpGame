import {entitiesCollide} from "./utils.js";
export default makeBulletWill;
function makeBulletWill(x, y, size, speed, originVelx, originVely, boomRadius) {
	var bulletWill = new Object();
	bulletWill.x = x;
	bulletWill.y = y;
	bulletWill.velx = originVelx+speed;
	bulletWill.vely = originVely+speed/2;
	bulletWill.size = size;
	bulletWill.boomRadius = boomRadius;
	bulletWill.dead = false;
	bulletWill.leftX = 0;
	bulletWill.rightX = 0;
	bulletWill.bottomY = 0;
	bulletWill.topY = 0;
	bulletWill.isExploding = false;
	bulletWill.deathClock = 0;

	bulletWill.draw = function (ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 1.5*Math.PI, 0.5*Math.PI);
		ctx.fillStyle = "rgb(200, 0, 0)";
		ctx.fill();
		ctx.fillRect(1+this.x-this.size*1.5, this.y-this.size, this.size*1.5, this.size*2)
	}

	bulletWill.variables = function() {
		bulletWill.leftX = 1+this.x-this.size*1.5;
		bulletWill.rightX = this.x + this.size;
		bulletWill.bottomY = this.y+this.size;
		bulletWill.topY = this.y-this.size;
		bulletWill.midX = this.leftX+(this.rightX-this.leftX)/2;
		bulletWill.midY = this.topY+(this.bottomY-this.topY)/2;
	}

	bulletWill.update = function(entities, ctx, dt) {
		bulletWill.movement(dt);
		bulletWill.collision(entities, ctx);
		bulletWill.variables();
		if (this.isExploding) {
			bulletWill.explode(ctx, entities);
		}
	}

	bulletWill.movement = function(dt) {
		//moove
		this.y += Math.round(this.vely*100)/100 * dt;
		this.x += Math.round(this.velx*100)/100 * dt;
		//die
		if (this.leftX > canvas.width) {
			this.dead = true;
		}
	}

	bulletWill.collision = function(entities, ctx) {
		//platform
		for (var i in entities) {
			if (entities[i].type == "platform") {
				if (entitiesCollide(this.topY, this.bottomY, this.leftX, this.rightX,
					 									entities[i].topY, entities[i].bottomY, entities[i].leftX, entities[i].rightX)) {
					this.isExploding = true;
				}
			}
			if (entities[i].type == "woomba") {
				if (entitiesCollide(this.topY, this.bottomY, this.leftX, this.rightX,
														entities[i].topY, entities[i].bottomY, entities[i].leftX, entities[i].rightX)) {
					entities[i].dead = true;
					this.isExploding = true;
				}
			}
		}
	}
	bulletWill.explode = function(ctx, entities) {
		this.velx = 0;
		this.vely = 0;
		//boomBox
		ctx.beginPath();
		ctx.moveTo(this.midX-this.boomRadius, this.midY-this.boomRadius);
		ctx.lineTo(this.midX+this.boomRadius, this.midY-this.boomRadius);
		ctx.lineTo(this.midX+this.boomRadius, this.midY+this.boomRadius);
		ctx.lineTo(this.midX-this.boomRadius, this.midY+this.boomRadius);
		ctx.lineTo(this.midX-this.boomRadius, this.midY-this.boomRadius);
		ctx.fillStyle = "rgb(0, 0, 0)";
		ctx.fill();
		for (var i in entities) {
			if (entities[i].type == "woomba") {
				if (entitiesCollide(this.midY-this.boomRadius, this.midY+this.boomRadius, this.midX-this.boomRadius, this.midX+this.boomRadius,
														entities[i].topY, entities[i].bottomY, entities[i].leftX, entities[i].rightX)) {
					entities[i].dead = true;
				}
			}
		}
		if (this.deathClock > 5) {
			this.dead = true;
		}
		this.deathClock += 1;
	}

	bulletWill.onDeath = function() {

	}
	return bulletWill;
}
