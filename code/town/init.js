"use strict";

const canvas = document.querySelector("#Canvas");

let width = (canvas.width = window.innerWidth);
let height = (canvas.height = window.innerHeight);

const ctx = canvas.getContext("2d");
let pause = false;
let mouseDownState = false;
let mouseDrag = false;
const mouseDownPos = new Vector(0, 0);
let lastMousePos = new Vector();

function randomColor() {
    const r = Math.round(Math.random() * 255);
    const g = Math.round(Math.random() * 255);
    const b = Math.round(Math.random() * 255);
    return `rgb(${r},${g},${b},1)`;
}
function clamp(n, limit) {
    let lim = Math.abs(limit);
    if (n < 0) {
        if (Math.abs(n) > lim) {
            return -lim;
        }
    } else {
        if (Math.abs(n) > lim) {
            return lim;
        }
    }
    return n;
}

const entities = [];
for (let i = 0; i < 140; i++) {
    entities.push(new Person(new Vector(width / 2, height / 2)));
}

function tick() {
    entities.map((it) => it.update());
}
function render() {
    ctx.fillStyle = pause ? "rgba(200,200,180,0.5)" : "rgba(200,200,200,0.1)";
    ctx.fillRect(0, 0, width, height);
    ctx.fillStyle = "black";

    entities.map((it) => it.draw());
}

function frame() {
    tick();
    render();

    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
frame();

const keydownHandler = function(e) {
    if (e.code === "Space") {
        pause = !pause;
        mouseDrag = false;
        mouseDownState = false;
        if (pause === false) {
            frame();
        }
    }
};

const mouseDownHandler = function(e) {
    mouseDownState = true;
    mouseDownPos.set(e.pageX, e.pageY);
    if (e.button === 2) return;
};
const mouseMoveHandler = function(e) {
    lastMousePos.set(e.pageX, e.pageY);
};

window.addEventListener("keydown", keydownHandler);
window.addEventListener("mousedown", mouseDownHandler);
window.addEventListener("mousemove", mouseMoveHandler);
