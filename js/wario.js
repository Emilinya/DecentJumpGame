import makeText from "./levelText.js";
import makeBulletWill from "./bulletWill.js";
export default makeWario;
function makeWario(x, y, size) {
	var wario = new Object();
	wario.x = x;
	wario.y = y;
	wario.velx = 0;
	wario.vely = 0;
	wario.size = size;
	wario.borderSize = 4;
	wario.keys = {};
	wario.type = "wario";
	wario.dead = false;
	wario.canShoot = true;
	wario.hp = 1;
	wario.invinsible = false;
	wario.a = 1;
	wario.maxHP = 2;
	wario.test = false;
	wario.isFireWario = false;
	wario.waitShoot = 0;
	wario.boomRadius = 0;

	wario.draw = function(ctx, dt) {
		if (this.invinsible == true) {
			if (this.a == 1) {
				this.a = 0.9;
			}
			else if (this.a == 0.9) {
				this.a = 0;
			}
			else if (this.a == 0) {
				this.a = 0.1;
			}
			else if (this.a == 0.1) {
				this.a = 1;
			}
		}
		else {
			this.a = 1;
		}
		this.y += this.vely * dt;
		this.x += this.velx * dt;
		//Border
		ctx.beginPath();
		ctx.moveTo(this.x-this.borderSize, this.y-this.borderSize);
		ctx.lineTo(this.x+this.size+this.borderSize, this.y-this.borderSize);
		ctx.lineTo(this.x+this.size+this.borderSize+this.velx, this.y+this.size+this.borderSize-this.vely);
		ctx.lineTo(this.x-this.borderSize+this.velx, this.y+this.size+this.borderSize-this.vely);
		ctx.lineTo(this.x-this.borderSize, this.y-this.borderSize);
		if (this.isFireWario) {
			ctx.fillStyle = "rgba(226, 50, 6, "+this.a+")";
		} else {
			ctx.fillStyle = "rgba(0, 0, 0, "+this.a+")";
		}
		ctx.fill();
		//Square
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x+this.size, this.y);
		ctx.lineTo(this.x+this.size+this.velx, this.y+this.size-this.vely);
		ctx.lineTo(this.x+this.velx, this.y+this.size-this.vely);
		ctx.lineTo(this.x, this.y);
		var b = Math.floor(Math.abs(Math.sin(this.x / 320)) * 255);
		var g = Math.floor(Math.abs(Math.sin(this.y / 200)) * 255);
		ctx.fillStyle = "rgba(0, "+g+", "+b+", "+this.a+")";
		ctx.fill();
	}

	wario.update = function(entities, ctx, dt) {
			wario.variables(dt);
			wario.movement(dt);
			wario.collision(entities);
			wario.jump();
			if (this.isFireWario == true) {
				wario.shoot(entities);
			}
			wario.onplatform = false;
	}

	wario.variables = function(dt) {
		this.width = this.size + this.borderSize;
		this.size = 20*this.hp + 10;
		this.leftX = this.x - this.borderSize;
		this.rightX = this.x + this.size + this.borderSize;
		this.bottomY = this.y + this.size + this.borderSize - this.vely;
		this.topY = this.y - this.borderSize;
		if (this.canShoot == false) {
			this.waitShoot += 1 * dt;
		}
		if (this.waitShoot >= 20) {
			this.canShoot = true;
			this.waitShoot = 0;
		}
		}

	wario.movement = function(dt) {
		//gravity
		this.vely += 0.2 * dt;
		//Air resistance
		if (this.velx < 0) {this.velx += ((((Math.round(-this.velx*0.008*1000))/1000)+0.08) * dt); }
		if (this.velx > 0) {this.velx -= ((((Math.round(this.velx*0.008*1000))/1000)+0.08) * dt); }
		if (this.velx > 0 && this.velx < 0.1) {this.velx = 0;}
		if (this.velx > -0.1 && this.velx < 0) {this.velx = 0;}
		//movement
		if (this.keys.KeyA) {
			if (this.velx > 2) {
				this.velx += -0.8 * dt;
			} else {this.velx += -0.4 * dt;}
		}
		if (this.keys.KeyD) {
			if (this.velx < -2) {
				this.velx += 0.8 * dt;
			} else {this.velx += 0.4 * dt;}
		}
		//warp
		if (this.x-this.borderSize < 0) {
			this.x = canvas.width-(this.size+this.borderSize);
		}
		if (this.x+this.size+this.borderSize > canvas.width) {
			this.x = 0+this.borderSize;
		}
		if (this.keys.KeyK && (this.test == true)) {
			this.test = false;
			var vel = 10;
			while (vel < 11) {
				var length = 0;
				console.log(vel);
				var changeVel = vel;
				while (changeVel > 0) {
					var changeVel = changeVel-0.2;
					length += changeVel;
				}
				console.log(Math.round(length*10)/10);
				vel += 1;
			}
		}
		if (this.keys.KeyN && (this.test == true)) {
			this.y = 400;
		}
	}

	wario.shoot = function(entities) {
		if ((this.keys.KeyQ || this.keys.Shift) && this.canShoot) {
			entities.push(makeBulletWill(this.x, this.y+this.size/2, 10, 20, this.velx, this.vely, this.boomRadius));
			this.canShoot = false;
		}
	}

	wario.jump = function() {
		if (wario.onplatform == true) {
			if (this.keys.Space || this.keys.KeyW) {
				this.y = this.y-2;
				this.vely = -8;
			}
		}
	}

	wario.collision = function(entities) {
		if (this.hp == 0) {
			this.dead = true;
		}
		if (this.invinsible == true) {
			setTimeout(function(i) {
				this.invinsible = false
			}.bind(this), 1000);
		}
		//platform
		for (var i in entities) {
			if (entities[i].type == "platform") {
				if (((this.y+this.width > entities[i].y)
				&& (this.y-this.borderSize < entities[i].y-entities[i].height))
				&& ((this.x+this.width > entities[i].x)
				&& (this.x-this.borderSize < entities[i].x+entities[i].width))) {
					if (entities[i].platformType != "launcher") {
						wario.onplatform = true;
					}
					if (entities[i].platformType == "slider") {
						if (this.vely < -0.5) {
							this.vely = this.vely-0.2;
						}
						else {
							this.y = entities[i].y-this.width+1;
							this.vely = this.vely*-0.2;
						}
						if (entities[i].hasReachedRight == false) {
							this.x = this.x + entities[i].moveSpeed;
						}
						if (entities[i].hasReachedRight == true) {
							this.x = this.x - entities[i].moveSpeed;
						}
					}
					if (entities[i].platformType == "elevator") {
						if (this.vely < -0.5) {
							this.vely = this.vely-0.2;
						}
						else {
							this.y = entities[i].y-this.width+1;
							this.vely = this.vely*-0.2;
						}
						if (entities[i].hasReachedTop == false) {
							this.y = this.y - entities[i].moveSpeed;
						}
						if (entities[i].hasReachedTop == true) {
							this.y = this.y + entities[i].moveSpeed;
						}
					}
					if (entities[i].platformType == "launcher") {
						this.vely = (-Math.sqrt(2500000*entities[i].moveDistance - 20212591) + 403) / 2500
					}
					if (entities[i].platformType == "disappearingPlatform") {
						entities[i].dead = true;
					}
					else {
						if (this.vely < -0.5) {
							this.vely = this.vely-0.2;
						}
						else {
							this.y = entities[i].y-this.width+1;
							this.vely = this.vely*-0.2;
						}
					}
				}
			}
			if (entities[i].type == "woomba") {
				if (((this.y+this.width > entities[i].y)
				&& (this.y-this.borderSize < entities[i].y+entities[i].size))
				&& ((this.x+this.width > entities[i].x)
				&& (this.x-this.borderSize < entities[i].x+entities[i].size))) {
					wario.onplatform = true;
					if (this.vely - entities[i].vely > 2) {
						this.y = entities[i].y-this.width-this.borderSize-1;
						this.vely = -8;
						entities[i].dead = true;
					}
					else if (this.invinsible == false){
						this.hp = this.hp -1;
						this.invinsible = true;
					}
				}
			}
			if (entities[i].type == "powerup") {
				if (((this.y+this.width > entities[i].y)
				&& (this.y-this.borderSize < entities[i].y+entities[i].size))
				&& ((this.x+this.width > entities[i].x)
				&& (this.x-this.borderSize < entities[i].x+entities[i].size))) {
					if (entities[i].powerupType == "permHPup") {
						this.maxHP += 1
						this.hp = this.maxHP;
						entities[i].dead = true;
					}
					else if (entities[i].powerupType == "fireBall") {
						this.isFireWario = true;
						entities[i].dead = true;
						if (!this.isFireWario) {
							entities.push(makeText((canvas.width/2)-200, this.y-canvas.height/3, "Press Q to shoot fireballs", 100));
						}
					}
					else if (entities[i].powerupType == "fireBoom" && this.isFireWario) {
						this.boomRadius = 40;
						entities[i].dead = true;
						entities.push(makeText((canvas.width/2)-200, this.y-canvas.height/3, "Now you make big boom", 100));
					}
					else if (this.hp < this.maxHP) {
						this.hp += 1;
						entities[i].dead = true;
					}
				}
			}
			if (entities[i].type == "woopa") {
				if (((this.y+this.width > entities[i].topY)
				&& (this.y-this.borderSize < entities[i].bottomY))
				&& ((this.x+this.width > entities[i].leftX)
				&& (this.x-this.borderSize < entities[i].rightX))) {
					wario.onplatform = true;
					if (this.vely - entities[i].vely > 0) {
						this.y = entities[i].topY-this.width-this.borderSize-1;
						this.vely = -8;
						entities[i].dead = true;
					}
					else if (this.invinsible == false){
						this.hp = this.hp -1;
						this.invinsible = true;
					}
				}
			}
		}
	}

	wario.getShot = function() {
	}

	wario.onDeath = function() {
	}

	return wario;
}
