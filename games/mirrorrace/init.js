"use strict";
const canvas = document.querySelector("#Canvas");
const ctx = canvas.getContext("2d", { alpha: false });
let pause = false;
let lastFrameTime = 0;

let width;
let height;
let lesser;
let bigger;
Screen.updateSize();

const camera = new Vector(width / 2, height / 2);
const trees = [];
for (let i = 0; i < 100; i++) trees.push(new Tree(Vector.random().scale(2000 * Math.random())));
const car = new Car(new Vector(0, 0));

frame();

window.addEventListener(EVENT.resize, Screen.resizeHandler);
canvas.addEventListener(EVENT.pointerdown, Input.pointerdownHandler);
canvas.addEventListener(EVENT.pointermove, Input.pointermoveHandler);
window.addEventListener(EVENT.pointerup, Input.pointerupHandler);
window.addEventListener(EVENT.keydown, Input.keydownHandler);
window.addEventListener(EVENT.keyup, Input.keyupHandler);
