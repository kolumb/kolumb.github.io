"use strict";

Ship.prototype.draw = function() {
  ctx.save();

  ctx.fillStyle = this.color;
  ctx.translate(this.pos.x, this.pos.y);
  ctx.rotate(this.angle);
  ctx.beginPath();
  ctx.moveTo(10, 0);
  ctx.lineTo(-5, 5);
  ctx.lineTo(0, 0);
  ctx.lineTo(-5, -5);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
  // let arrow = planets[this.dest].pos.sub(this.pos).clamp(15);
  // ctx.fillStyle = "rgba(40,80,60, .4)";

  // ctx.fillRect(this.pos.x + arrow.x, this.pos.y + arrow.y, 3, 3);
};
