export default makeText;
function makeText(x, y, textTexst, lifespan) {
var text = new Object();
	text.y = y;
	text.lifespan = lifespan;
	text.livedSpan = 0;
	text.dead = false

	text.draw = function (ctx) {
		ctx.font = '48px serif';
		ctx.fillStyle = "rgb(50, 50, 50)";
		ctx.fillText(textTexst, x, y);
	}

	text.update = function (entities, ctx) {
		if (this.lifespan != 0) {
			if (this.livedSpan < this.lifespan) {
				this.livedSpan += 1;
			}
			else {
				this.dead = true;
			}
		}
	}
	text.onDeath = function() {

	}
	return text;
}
//26/04/18-1420 kodelinjer
