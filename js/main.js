import makeWario from "./wario.js";
import makePlatform from "./platform.js";
import generateWorld from "./worldGen.js";
import makeText from "./levelText.js";

var bodyDiv = document.getElementsByClassName('bodyDiv')[0];
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var scaleFactor = 1;

resize();
window.addEventListener("resize", resize);
function resize() {
	canvas.width = bodyDiv.offsetWidth;
	canvas.height = bodyDiv.offsetHeight;
}

var gg = false;
var num = 0;
var ticksSpent = 0;
var timeSpent = 0;
var fps = 60;
var dt = 1;
var previousTime = 0;
var backgroundBrightness = 220;

var wario = makeWario(50, canvas.height-50, 50);
var entities = [];
entities.push(wario);

//Floor 1
var worldHeight = canvas.height;
var levelAmount = 40;
for (var level = 0; level < levelAmount; level++) {
	if (level != 0) {
		entities.push(makeText(canvas.width/2-100, worldHeight - 50, "level " + level, 0));
	}
	if (((level/10) % 1 === 0)&&(level != 0)) {
		entities.push(makePlatform(0, worldHeight-10, canvas.width, 10, "platform"));
		//makeRandomPowerup(canvas.width/2, worldHeight-30, entities, (level/10)-1);
	}
	worldHeight = generateWorld(worldHeight, entities, level);
	if (level == levelAmount-1) {
		entities.push(makeText(30, worldHeight - 50, "You won! But sadly the princess is in another castle :(", 0));
	}
}
var height = Math.round(worldHeight);

requestAnimationFrame(runGame);

function runGame(currentTime) {
	dt = (currentTime - previousTime)/(1000/60);
	previousTime = currentTime;
	if (dt > 3) {
		//console.log(Math.round(dt*100)/100)
		dt = 1;
	}
	ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//background
	var g = Math.round(255/height*(height-(wario.y-canvas.height))
				+((backgroundBrightness*Math.round(255/height*(wario.y-canvas.height))/255)));
	var r = Math.round(255/height*(wario.y-canvas.height)
				+((backgroundBrightness*Math.round(255/height*(height-(wario.y-canvas.height)))/255)));
	ctx.fillStyle = "rgb("+r+", "+g+", "+backgroundBrightness+")";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	//timer
	ticksSpent += 1;
	timeSpent = (Math.round((ticksSpent/60)*10))/10;
	ctx.font = '30px serif';
	ctx.fillStyle = "rgb(50, 50, 50)";
	ctx.fillText("Time " + timeSpent, 0, 50);
	//fps
	if (ticksSpent % 5	 === 0) {
		fps = Math.round(60/dt);
	}
	ctx.font = '30px serif';
	ctx.fillStyle = "rgb(50, 50, 50)";
	ctx.fillText(fps + " fps", canvas.width-100, 50);
	//translate and stuff
	ctx.translate(0, -(wario.y+wario.width/2) * scaleFactor + canvas.height / 2);
	ctx.scale(scaleFactor, scaleFactor);
	//Updates entities
	for (var i in entities) {
		if (entities[i].y >=  wario.y-canvas.height*2 && entities[i].y <=  wario.y+canvas.height*2) {
			entities[i].update(entities, ctx, dt);
			entities[i].draw(ctx, dt);
		}
		if (entities[i].dead == true) {
			entities[i].onDeath(entities);
			if (entities[i].type == "wario") {
				gg = true
			}
			entities.splice(i, 1);
		}
	}
	//gg plz re
	if (gg == true) {
		ctx.beginPath();
		num += 1
		var b = Math.floor(Math.abs(Math.sin(num/40)) * 255);
		ctx.fillStyle = "rgb("+b+", 0, 0)";
		ctx.font = "30px sans-serif";
		ctx.fillText("You are dead, respawn by pressing ctrl + r", canvas.width/2-300, wario.y);
	}
	//Black box of doom
	ctx.beginPath();
	ctx.rect(0, canvas.height, canvas.width, 500);
	ctx.fillStyle = "rgb(0, 0, 0)";
	ctx.fill();
	requestAnimationFrame(runGame);
}

window.addEventListener('keydown', function (e) {
	wario.keys = (wario.keys || {});
	wario.keys[e.code] = true;
});
window.addEventListener('keyup', function (e) {
	wario.keys[e.code] = false;
});
