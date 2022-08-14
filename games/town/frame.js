"use strict";
function tick(dt) {
    frames += dt
    people.forEach(person => person.update())
    people.sort((p1, p2) => p1.pos.y - p2.pos.y)
    const randomPos = new Vector(Math.random() * width, Math.random() * height).scale(1 / pixelSize).floor()

    const p = bgCtx.getImageData(randomPos.x, randomPos.y, 1, 1).data
    let hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    if (dirtColors.indexOf(hex) > -1 || sandColors.indexOf(hex) > -1) {
        bgCtx.fillStyle = grassColors[Math.floor(Math.random() * dirtColors.length)]
        bgCtx.fillRect(randomPos.x, randomPos.y, 1, 1)
    }
}
function render() {
    ctx.fillStyle = pause ? "rgb(200,200,200)" : "rgb(68,68,68)";
    ctx.fillRect(0, 0, width, height);
    ctx.drawImage(bgCanvas, 0, 0, bgCanvas.width * pixelSize, bgCanvas.height * pixelSize);
    people.forEach(person => person.draw())
}

function frame(timestamp) {
    const dt = timestamp - lastFrameTime;
    lastFrameTime = timestamp;

    if (dt < 1000) tick(dt * 0.06);
    render();
    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
