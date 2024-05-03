"use strict";
const TARGET_FPS = 60;
const SECOND = 1000;
const CAMERA_FRICTION = 0.2;
const ROAD_SCALE = 10;
const ROAD_TENSION_LIMIT = 400;
const ROAD_LENGTH = 50 * 4; // Must be divisible by 4
const FRICTION = 0.01;
const SIDE_FRICTION = 0.1;
const OFFROAD_FRICTION = 0.98;
const ENGINE_POWER = 0.15;
const TURNING_FORSE = 0.04;
const TURNING_FRICTION = 0.1;
const OFFSET = -12;
const MAX_TURNING_SPEED = 0.008;
const GOAL_POINT_SKIP_DISTANCE = 300;
const MINIMAP_SCALE = 300
const MINIMAP_POINT_SIZE = 2
const VEHICLES_COUNT = 20
const canvas = document.querySelector("#Canvas");
const ctx = canvas.getContext("2d", { alpha: false });
let pause = false;
let lastFrameTime = 0;
let playerMoved = 0;
let lowGraphics = JSON.parse(localStorage.getItem("lowGraphicsSetting") || "false")
const graphicsSettingsInput = document.querySelector("#low-graphics")
if (graphicsSettingsInput && lowGraphics) graphicsSettingsInput.checked = true

let width;
let height;
let lesser;
let bigger;
Screen.updateSize();

const camera = new Vector(width / 2, height / 2);
const car = new Car(new Vector(0, 0));
let cameraTarget = car

const roadPoints = [];
let totalFix = 500
let attempts = 0;
while (totalFix > ROAD_TENSION_LIMIT && attempts < 100) {
	roadPoints.length = 0;
	roadPoints.push(new Vector(-3, 80))
	roadPoints.push(new Vector(-4, 60))
	roadPoints.push(new Vector(-6, 40))
	roadPoints.push(new Vector(-5, 30))
	totalFix = 0;
	generateRoad(roadPoints, ROAD_LENGTH)
	console.log(totalFix.toFixed(0))
	attempts++
}

const mapBorders = roadPoints.reduce((borders, p) => {
    borders.min.x = Math.min(p.x, borders.min.x)
    borders.min.y = Math.min(p.y, borders.min.y)
    borders.max.x = Math.max(p.x, borders.max.x)
    borders.max.y = Math.max(p.y, borders.max.y)
    return borders
}, {min: new Vector(Infinity, Infinity), max: new Vector(-Infinity, -Infinity)})
mapBorders.size = new Vector(mapBorders.max.x - mapBorders.min.x, mapBorders.max.y - mapBorders.min.y)
mapBorders.factor = mapBorders.size.divide(new Vector(mapBorders.size.max(), mapBorders.size.max()))
const minimapPoints = roadPoints.map(p => {
	return p.sub(mapBorders.min).divide(mapBorders.size).mult(mapBorders.factor).scale(MINIMAP_SCALE).add(new Vector(10 - MINIMAP_POINT_SIZE, 10 - MINIMAP_POINT_SIZE))
})

function generateRoad(arr, limit) {
	const roadDrawer = new Vector(0, -10);
	let roadAngle = -Math.PI / 2;
	for (let i = 0; i < limit; i++) {
		const newPoint = roadDrawer.copy()
		const fix = arr.reduce((acc, point, i) => {
			const dist = point.dist(newPoint);
			return acc.add(newPoint.sub(point).normalized().scale(1000000.1*clamp(Math.max(arr.length - i - 10, 0.01), 5) / dist**4))
		}, new Vector());
		arr.push(newPoint);
		totalFix += fix.length()

		roadDrawer.addMut(Vector.fromAngle(roadAngle).scale(10 * Math.random() + 10).add(fix.clamp(20)));
		roadAngle += i < limit - 8 - 8 ? Math.PI / 2 * (Math.random() - 0.5) : 0
	}
}
const trees = [];
for (let i = 0; i < roadPoints.length; i++) trees.push(new Tree(roadPoints[i].scale(ROAD_SCALE).add(Vector.random().scale(1000 * Math.random()))));
const vehicles = [];
for (let i = 0; i < VEHICLES_COUNT; i++) {
	vehicles.push(new Vehicle(new Vector(160 * Math.random() - 80, 0)))
}
const winners = []
const participants = vehicles.concat(car)

frame();

window.addEventListener(EVENT.resize, Screen.resizeHandler);
canvas.addEventListener(EVENT.pointerdown, Input.pointerdownHandler);
canvas.addEventListener(EVENT.pointermove, Input.pointermoveHandler);
window.addEventListener(EVENT.pointerup, Input.pointerupHandler);
window.addEventListener(EVENT.keydown, Input.keydownHandler);
window.addEventListener(EVENT.keyup, Input.keyupHandler);
graphicsSettingsInput?.addEventListener("change", Input.graphicsToggle)
document.querySelector("#follow-looser").addEventListener(EVENT.click, Vehicle.followLooser)
document.querySelector("#follow-leader").addEventListener(EVENT.click, Vehicle.followLeader)
document.querySelector("#toggle-helicopter").addEventListener(EVENT.click, car.toggleHelicopter)
document.querySelector("#restart-game").addEventListener(EVENT.click, e => {
	location.reload()
})
