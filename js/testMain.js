import wario from "./wario.js";
import makePlatform from "./platform.js";
import makeWoomba from "./woomba.js";
import makePowerup from "./powerup.js";
import makeWoopa from "./woopa.js";
import makeWoopaShell from "./woopaShell.js";
import makeBulletWill from "./bulletWill.js";
import {getRandomIntRange, getRandomInt} from "./utils.js"

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var scaleFactor = 1;
var gg = false;
var num = 0;
var dt = 1;
var previousTime = 0;
var ticksSpent = 0;
var timeSpent = 0;
var fps = 60;


var entities = [];
entities.push(wario);
//Floor 1
entities.push(makePlatform(0, canvas.height-10, canvas.width, 10, "floor"));
entities.push(makeWoopa(canvas.width-200, 300, "flyingWoopa", 200, 200));


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
	ctx.rect(0, canvas.height, canvas.width, 5000);
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
