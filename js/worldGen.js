import makePlatform from "./platform.js";
import makeWoomba from "./woomba.js";
import makePowerup from "./powerup.js";
import makeWoopa from "./woopa.js";
import makeWoopaShell from "./woopaShell.js";
import {getRandomIntRange, getRandomInt} from "./utils.js"

export default generateWorld;
function generateWorld(worldHeight, entities, level) {
	var difficulty = level;
	var currentHeight = worldHeight
	if (worldHeight == canvas.height) {
		var jumpHeight = getRandomIntRange(140, 150);
		entities.push(makePlatform(0, canvas.height-10, canvas.width, 10, "floor"));
		entities.push(makePowerup(300, canvas.height-40, "HPup"))
		currentHeight -= 10*2 + jumpHeight;
	}
	else {
		var level = getRandomIntRange(1, 4)
		if (level == 1) {
			currentHeight = platformingLevel(currentHeight, entities);
		}
		if (level == 2) {
			currentHeight = respawnLevel(currentHeight, entities);
		}
		if (level == 3) {
			currentHeight = goliathLevel(currentHeight, entities, difficulty);
		}
		if (level == 4) {
			currentHeight = flyingWoopaLevel(currentHeight, entities, difficulty);
		}
	}
	return currentHeight;
}
function platformingLevel(currentHeight, entities) {
	for (var i = 0; i < 15; i++) {
		var platType = getRandomIntRange(1, 5)
		if (platType == 1 || platType == 4 || platType == 5) {
			platType = "platform"
			var slideLength = 0;
			var slideSpeed = 0;
		}
		if (platType == 2) {
			platType = "slider"
			var slideLength = getRandomIntRange(50, 500);
			var slideSpeed = getRandomIntRange(0.5, 5);
			while ((slideLength/slideSpeed) % 1 !== 0) {
				slideLength = getRandomIntRange(10, 500);
				slideSpeed = getRandomIntRange(0.5, 5);
			}
			if ((platWidth + platX + slideLength/2) > canvas.width) {
				slideLength = (canvas.width - platWidth - platX)*2;
			}
		}
		if (platType == 3) {
			platType = "elevator"
			var slideLength = getRandomIntRange(10, 500);
			var slideSpeed = getRandomIntRange(2, 10);
			while ((slideLength/slideSpeed) % 1 !== 0) {
				slideLength = getRandomIntRange(10, 500);
				slideSpeed = getRandomIntRange(2, 10);
			}
		}
		var platX = getRandomInt(canvas.width);
		var platY = currentHeight;
		var platWidth = getRandomIntRange(100, 500);
		if ((platWidth + platX) > canvas.width) {
			platX = canvas.width - platWidth;
		}
		var platHeight = getRandomIntRange(5, 20);
		var jumpHeight = getRandomIntRange(100, 140);
		entities.push(makePlatform(platX, platY, platWidth, platHeight, platType, slideLength, slideSpeed));
		if (platType == "elevator") {
			currentHeight -= platHeight + slideLength + jumpHeight/2;
		}
		else {
			currentHeight -= platHeight + jumpHeight;
		}
	}
	return currentHeight;
}

function respawnLevel(currentHeight, entities) {
	entities.push(makePlatform(0, currentHeight-10, canvas.width, 10, "dangerZone"));
	entities.push(makeWoomba(800, currentHeight-70, "respawnWoomba"));
	entities.push(makePlatform(300, currentHeight-250, 500, 10, "slider", 400, 2));
	var slideLength = getRandomIntRange(100, 500);
	var slideSpeed = getRandomIntRange(2, 10);
	while ((slideLength/slideSpeed) % 1 !== 0) {
		slideLength = getRandomIntRange(100, 500);
		slideSpeed = getRandomIntRange(1, 10);
	}
	entities.push(makePlatform(30, currentHeight-250, 50, 10, "elevator", slideLength, slideSpeed));
	return currentHeight-250-slideLength-70;
}

function goliathLevel(currentHeight, entities, difficulty) {
	var jumpHeight = getRandomIntRange(100, 140);
	var launchPower = getRandomIntRange(5000, 10000);
	entities.push(makePlatform(0, currentHeight-10, canvas.width, 10, "dangerZone"));
	entities.push(makeWoomba(700, currentHeight-130, "goliathWoomba", difficulty, 0, launchPower));
	return currentHeight-130-200-launchPower-jumpHeight
}

function flyingWoopaLevel(currentHeight, entities, difficulty) {
	var bounceHeight = getRandomIntRange(70, 80);
	entities.push(makePlatform(0, currentHeight, canvas.width, 10, "dangerZone"));
	currentHeight -= getRandomIntRange(150, 160);
	entities.push(makePlatform(0, currentHeight, 100, 10, "platform"));
	for (var i = 1; i < 5; i++) {
		currentHeight -= bounceHeight;
		entities.push(makeWoopa(100+(200*i), currentHeight, "flyingWoopa", 40, 200));
	}
	currentHeight -= getRandomIntRange(100, 110);
	entities.push(makePlatform(canvas.width-100, currentHeight, 100, 10, "platform"));
	entities.push(makePlatform(0, currentHeight, 100, 10, "platform"));
	if (difficulty >= 20 ) {
		for (var i = 1; i < 5; i++) {
			currentHeight -= bounceHeight;
			entities.push(makeWoopa(canvas.width-100-(200*i), currentHeight, "flyingWoopa", 40, 200));
		}
		currentHeight -= getRandomIntRange(100, 110);
		entities.push(makePlatform(0, currentHeight, 100, 10, "platform"));
		entities.push(makePlatform(canvas.width-100, currentHeight, 100, 10, "platform"));
	}
	currentHeight -= getRandomIntRange(150, 160);
	return currentHeight;
}
