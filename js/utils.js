import makePowerup from "./powerup.js";

export function getRandomIntRange(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomInt(max) {
	return Math.floor(Math.random() * Math.floor(max));
}

export function makeRandomPowerup(x, y, entities, i) {
	switch (0) {
		case 0:
			entities.push(makePowerup(x, y, "fireBall"));
			break;
	}
}

export function entitiesCollide(
	ent1topY, ent1bottomY, ent1leftX, ent1rightX,
	ent2topY, ent2bottomY, ent2leftX, ent2rightX
) {
	if (((ent1topY < ent2bottomY)
	&& (ent1bottomY > ent2topY))
	&& ((ent1rightX > ent2leftX)
	&& (ent1leftX < ent2rightX))) {
		return true;
	}
}
