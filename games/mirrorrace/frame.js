"use strict";
const TARGET_FPS = 60;
const SECOND = 1000;
const CAMERA_FRICTION = 0.2;

function tick(dt) {
    car.update(dt);
    camera.addMut(new Vector(width / 2, height / 2)
        .sub(camera)
        .sub(car.pos)
        .scale(dt * CAMERA_FRICTION)
    );

}
function render() {
    ctx.save()
    ctx.fillStyle = pause ? "rgb(200,200,200)" : "rgb(240,240,240)";
    ctx.fillRect(0, 0, width, height);
    ctx.translate(camera.x, camera.y);
    car.trails.filter(trail => trail.age < 100).forEach(trail => {
        ctx.fillStyle = "rgba(120, 120, 100," + (1 - trail.age / 100) + ")"
        ctx.fillRect(trail.pos.x, trail.pos.y, 5, 5)
    });
    trees.forEach(tree => tree.render())
    car.render();
    ctx.restore();
}

function frame(timestamp) {
    const dt = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    if (dt < SECOND) tick(dt * TARGET_FPS / SECOND);
    render();
    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
