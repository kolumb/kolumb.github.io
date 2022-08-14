"use strict";
function Vector(x, y) {
  this.x = x || 0;
  this.y = y || 0;
}
Vector.fromAngle = function(angle = 0, amplitude = 1) {
  return new Vector(Math.cos(angle) * amplitude, Math.sin(angle) * amplitude);
};
Vector.prototype.add = function(v) {
  return new Vector(this.x + v.x, this.y + v.y);
};
Vector.prototype.sub = function(v) {
  return new Vector(this.x - v.x, this.y - v.y);
};
Vector.prototype.scale = function(f) {
  return new Vector(this.x * f, this.y * f);
};
Vector.prototype.squareDist = function(v) {
  return (this.x - v.x) ** 2 + (this.y - v.y) ** 2;
};
Vector.prototype.dist = function(v) {
  return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
};
Vector.prototype.squaredLength = function() {
  return this.x ** 2 + this.y ** 2;
};
Vector.prototype.clamp = function(max) {
  if (this.x * this.x + this.y * this.y > max * max) {
    // console.log(1)
    // ctx.fillStyle = 'red'
    let angle = Math.atan2(this.y, this.x);
    let newX = Math.cos(angle) * max;
    let newY = Math.sin(angle) * max;
    return new Vector(newX, newY);
  }
  //if(this.x > max) this.x = max
  //if(this.y > max) this.y = max
  //if(this.x < -max) this.x = -max
  //if(this.y < -max) this.y = -max
  return this;
};
Vector.prototype.drawTo = function(v) {
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(v.x, v.y);
  ctx.stroke();
};
