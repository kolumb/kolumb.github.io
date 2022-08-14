"use strict";

function Planet(
  x = 0,
  y = 0,
  r = 1,
  color = `rgb(${(Math.random() * 255) | 0}, ${(Math.random() * 255) |
    0}, ${(Math.random() * 255) | 0})`
) {
  this.pos = new Vector(x, y);
  this.radius = r;
  this.color = color;
}

Planet.prototype.draw = function() {
  ctx.beginPath();
  ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2);
  ctx.save();
  ctx.fillStyle = this.color;
  ctx.fill();
  ctx.restore();
};
