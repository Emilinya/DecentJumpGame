import makePlatform from "./platform.js";
import makePowerup from "./powerup.js";
import {getRandomIntRange, getRandomInt} from "./utils.js"
export default makeWoomba;
function makeWoomba(x, y, type, spawnAmount, spawnedBy, launchPower) {
	var woomba = new Object();
	woomba.x = x;
	woomba.y = y;
	woomba.woombaType = type;
	woomba.velx = 0;
	woomba.vely = 0;
	woomba.type = "woomba";
	woomba.dead = false;
	woomba.color = "rgb(136, 8, 165)";
	woomba.livingSpawn = spawnAmount;
	woomba.spawnedBy = spawnedBy;
	if (woomba.woombaType == "goliathWoomba") {
		woomba.size = 120;
		woomba.speed = 0.75;
	}
	else if (woomba.woombaType == "miniWoomba") {
		woomba.size = 30;
		woomba.speed = 1.25;
	}
	else {
		woomba.size = 60;
		woomba.speed = 1;
	}
	woomba.onplatform = false;

	woomba.draw = function (ctx) {
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + this.size, this.y);
		ctx.lineTo(this.x+this.size, this.y + this.size);
		ctx.lineTo(this.x, this.y + this.size);
		ctx.lineTo(this.x, this.y);
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	woomba.update = function(entities, ctx, dt) {
		woomba.collision(entities);
		woomba.colorize();
		woomba.movement(dt);
		woomba.ai();
		woomba.variables();
		woomba.onplatform = false;
	}

	woomba.variables = function() {
		this.leftX = this.x;
		this.rightX = this.x + this.size;
		this.bottomY = this.y + this.size;
		this.topY = this.y;
	}

	woomba.ai =  function() {
		this.randNum = getRandomInt(300*(2-this.speed));
		if (this.randNum == 6) {
			if (this.woombaType != "noJumpWoomba") {
				woomba.jump();
			}
		}
		this.randNum = getRandomInt(100*(2-this.speed));
		if (this.randNum == 5) {
			woomba.move();
		}
	}

	woomba.movement = function(dt) {
		//gravity
		this.vely+= 0.2 * dt;
		//Air resistance
		if (this.velx < 0) {this.velx += (((Math.round(-this.velx*0.008*1000))/1000)+0.08) * dt; }
		if (this.velx > 0) {this.velx -= (((Math.round(this.velx*0.008*1000))/1000)+0.08) * dt; }
		//moove
		this.y += Math.round(this.vely) * dt;
		this.x += Math.round(this.velx) * dt;
		//warp
		if (this.x < 0) {
			this.x = canvas.width-(this.size);
		}
		if (this.x+this.size > canvas.width) {
			this.x = 0;
		}
	}

	woomba.collision = function(entities) {
		//platform
		for (var i in entities) {
			if (entities[i].type == "platform") {
				if (((this.y+this.size > entities[i].y)
				&& (this.y < entities[i].y-entities[i].height))
				&& ((this.x+this.size > entities[i].x)
				&& (this.x < entities[i].x+entities[i].width))) {
					woomba.onplatform = true;
					this.y = entities[i].y-this.size+1;
					this.vely = this.vely*-0.3;
				}
			}
		}
	}

	woomba.colorize = function() {
		if (this.woombaType == "normalWoomba") {
			this.color = "rgb(142, 8, 165)"
		}
		if (this.woombaType == "respawnWoomba") {
			this.color = "rgb(136, 8, 165)"
		}
		if (this.woombaType == "goliathWoomba") {
			this.color = "rgb(130, 8, 165)"
		}
		if (this.woombaType == "noJumpWoomba") {
			this.color = "rgb(124, 8, 165)"
		}
	}

	woomba.jump = function() {
		if (this.onplatform == true) {
			this.y = this.y-2;
			this.vely = -8*this.speed;
		}
	}

	woomba.move = function() {
		this.randNum = getRandomInt(2);
		if (this.randNum == 0) {
			this.velx += 4*this.speed;
		}
		if (this.randNum == 1) {
			this.velx -= 4*this.speed;
		}
	}

	woomba.makeDeathPlatform = function(entities, launchPower) {
		this.livingSpawn -= 1;
		if (this.livingSpawn == 0) {
			entities.push(makePlatform(canvas.width/2-300, y-50, 600, 10, "platform"));
			entities.push(makePlatform(canvas.width/2-100, y-200, 200, 10, "launcher", launchPower));
			entities.push(makePlatform(canvas.width/2-300, y-200-launchPower, 600, 10, "platform"));
			entities.push(makePowerup(canvas.width/2, y, "HPup"));
		}
	}
	woomba.onDeath = function(entities) {
		if (this.woombaType == "respawnWoomba") {
			setTimeout(function(i) { entities.push(makeWoomba(this.x, this.y, this.woombaType))
			}.
			bind(this), 1500);
		}
		if (this.woombaType == "goliathWoomba") {
			for (var n = 0; n < this.livingSpawn; n++) {
				var bonusWidth = getRandomIntRange(-50, 50);
				entities.push(makeWoomba(this.x+bonusWidth, this.y, "miniWoomba", 0, this, launchPower));
			}
		}
		if (this.woombaType == "miniWoomba") {
			this.spawnedBy.makeDeathPlatform(entities, launchPower);
		}
	}

	return woomba;
}
