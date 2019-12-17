export default makePlatform;
function makePlatform(x, y, width, height, type, moveDistance, moveSpeed) {
var platform = new Object();
	platform.x = x;
	platform.y = y;
	platform.width = width;
	platform.height = height;
	platform.platformType = type;
	platform.type = "platform";
	platform.dead = false;
	platform.color = "rgb(0, 0, 0)";
	platform.moveDistance = moveDistance;
	platform.moveSpeed = moveSpeed;
	platform.extraX = 0;
	platform.extraY = 0;
	platform.hasReachedRight = false
	platform.hasReachedTop = false;

	platform.draw = function (ctx) {
		if (this.platformType == "slider") {
			//Fnancy mooverliner
			ctx.beginPath();
			ctx.moveTo(x + this.width/2 - this.moveDistance, this.y + this.height/2);
			ctx.lineTo(x + this.width/2 + this.moveDistance, this.y + this.height/2)
			ctx.lineWidth = 2;
			ctx.closePath();
			ctx.stroke();
		}
		if (this.platformType == "elevator") {
			//Fnancy mooverliner
			ctx.beginPath();
			ctx.moveTo(x + this.width/2, y + this.height/2 - this.moveDistance);
			ctx.lineTo(x + this.width/2, y + this.height/2)
			ctx.lineWidth = 2;
			ctx.closePath();
			ctx.stroke();
		}
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x + this.width, this.y);
		ctx.lineTo(this.x+this.width, this.y + this.height);
		ctx.lineTo(this.x, this.y + this.height);
		ctx.lineTo(this.x, this.y);
		ctx.fillStyle = this.color;
		ctx.fill();
	}

	platform.update = function(entities, ctx, dt) {
		platform.colorize();
		if (this.platformType == "slider" || this.platformType == "elevator") {
			platform.moove(ctx, dt);
		}
		platform.variables();
	}

	platform.variables = function() {
		this.leftX = this.x;
		this.rightX = this.x + this.width;
		this.bottomY = this.y + this.height;
		this.topY = this.y;
	}

	platform.colorize = function() {
		if (this.platformType == "floor") {
			this.color = "rgb(80, 244, 66)"
		}
		if (this.platformType == "platform") {
			this.color = "rgb(47, 62, 63)"
		}
		if (this.platformType == "slider") {
			this.color = "rgb(237, 237, 9)"
		}
		if (this.platformType == "elevator") {
			this.color = "rgb(18, 158, 151)"
		}
		if (this.platformType == "dangerZone") {
			this.color = "rgb(219, 8, 39)"
		}
		if (this.platformType == "launcher") {
			this.color = "rgb(255, 89, 0)"
		}
		if (this.platformType == "disappearingPlatform") {
			this.color = "rgb(155, 124, 31)"
		}
	}

	platform.moove = function(ctx, dt) {
		if (this.platformType == "slider") {
			if ((this.extraX < this.moveDistance/2) && this.hasReachedRight == false) {
				this.extraX += this.moveSpeed;
			}
			if (this.extraX == this.moveDistance/2) {
				this.hasReachedRight = true;
			}
			if ((this.extraX > -this.moveDistance/2) && this.hasReachedRight == true) {
				this.extraX -= this.moveSpeed;
			}
			if (this.extraX == -this.moveDistance/2) {
				this.hasReachedRight = false;
			}
			this.x = x + this.extraX;

		}
		if (this.platformType == "elevator") {
			if ((this.extraY > -this.moveDistance) && this.hasReachedTop == false) {
				this.extraY -= this.moveSpeed;
			}
			if (this.extraY == -this.moveDistance) {
				this.hasReachedTop = true;
			}
			if ((this.extraY < 0) && this.hasReachedTop == true) {
				this.extraY += this.moveSpeed;
			}
			if (this.extraY == 0) {
				this.hasReachedTop = false;
			}
			this.y = y + this.extraY;
		}
	}
	platform.onDeath = function() {

	}
	return platform;
}
