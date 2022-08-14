"use strict";

function Ship({
  pos = new Vector(width / 2, height / 2),
  speed = new Vector(),
  dest = 0,
  destDist = INTERACTION_DISTANCE ** 2
}) {
  this.pos = pos;

  if (this.pos.x > width) {
    this.pos.x = width;
  }
  if (this.pos.x < 0) {
    this.pos.x = 0;
  }
  if (this.pos.y > height) {
    this.pos.y = height;
  }
  if (this.pos.y < 0) {
    this.pos.y = 0;
  }
  this.speed = speed;
  this.angle = Math.atan2(speed.y, speed.x);
  this.dest = dest;
  this.destDist = destDist;

  //this.input = { up: false, left: false, right: false };
  this.color = `rgb(${(Math.random() * 255) | 0},${(Math.random() * 255) |
    0},${(Math.random() * 255) | 0})`;
  this.index =
    ((this.pos.y / cellSize) | 0) * cellNumberX + ((this.pos.x / cellSize) | 0);
  cells[this.index]++;
  reg[this.index].push(this);
}
