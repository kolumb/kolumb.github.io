"use strict";

const clamp = (n, lim) => (n < 0 ? (n < -lim ? lim : n) : n > lim ? lim : n);

const TWO_PI = Math.PI * 2;
const Input = {
  pos: new Vector(),
  up: false,
  down: false,
  left: false,
  right: false
};
const ANGLESPEED = 0.05;
const MAXSPEED = 5;
const THRUST = 0.05;
const DRAG = 0.95;

const ATTRACTION_FORCE = 0.03; //5;
const INTERACTION_DISTANCE = 20 ** 2;
const REPULSION_IMPULSE = 0.1;
const REPULSION_LIMIT = 0.1;

const CELLNUMBERA = 40;
const NUMBER_OF_SHIPS = 100;
const NUMBER_OF_PLANETS = 5;
const ATMOSPHERE = 50 ** 2;

const Canvas = document.getElementById("Canvas");
// TODO: onresize
let width = (Canvas.width = innerWidth);
let height = (Canvas.height = innerHeight);
const ctx = Canvas.getContext("2d");
ctx.fillStyle = "#191919";
ctx.fillRect(0, 0, width, height);
ctx.strokeStyle = "#222";
ctx.lineWidth = 0.5;
let horizontal = width > height;
let maxSide = horizontal ? width : height;
let minSide = horizontal ? height : width;

let cellSize = Math.ceil(maxSide / CELLNUMBERA);
let cellNumberB = Math.ceil(minSide / cellSize);
let cellNumberX = horizontal ? CELLNUMBERA : cellNumberB;
let cellNumberY = horizontal ? cellNumberB : CELLNUMBERA;
const cells = [];
for (let i = cellNumberX * cellNumberY - 1; i >= 0; i--) {
  cells[i] = 0;
}
const reg = [];
for (let i = cellNumberX * cellNumberY - 1; i >= 0; i--) {
  reg[i] = [];
}
//TODO: re-register ships onresize, refactor ship registration.

const planets = [];
for (let i = 0; i < NUMBER_OF_PLANETS; i++) {
  planets.push(
    new Planet(
      Math.random() * width,
      Math.random() * height,
      10 + Math.random() * 50
    )
  );
}

const ship = new Ship({
  pos: new Vector(width / 5, (height / 3) * 2),
  speed: new Vector(5, -1.5)
});
ship.input = Input;
ship.preUpdate = function() {
  if (this.input.up)
    this.speed = this.speed
      .add(Vector.fromAngle(this.angle, THRUST))
      .clamp(MAXSPEED);
};
ship.postUpdate = function() {
  if (this.input.left) this.angle -= ANGLESPEED;
  if (this.input.right) this.angle += ANGLESPEED;
  ctx.beginPath();
  ctx.fillStyle = "rgba(50,50,60,.5)";
  ctx.arc(this.pos.x, this.pos.y, Math.sqrt(INTERACTION_DISTANCE), 0, TWO_PI);
  ctx.fill();
};

const ships = [];
const createShip = pos => {
  let pl = planets[(NUMBER_OF_PLANETS * Math.random()) | 0];
  ships.push(
    new Ship({
      pos: pos,
      speed: new Vector(Math.random() * 0.2 - 0.1, Math.random() * 0.2 - 0.1),
      dest: 0,
      destDist: pl.radius ** 2 + ATMOSPHERE
    })
  );
};
for (let i = 0; i < 10; i++) {
  createShip(
    planets[(NUMBER_OF_PLANETS * Math.random()) | 0].pos.add(
      new Vector(Math.random() * 80 - 40, Math.random() * 80 - 40)
    )
  );
}
let lastTimeStamp = 0;
let frameTimes = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let frameTimesIndex = 0;
