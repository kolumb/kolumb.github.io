"use strict";
function tick(dt) {
    const playerChunk = player.divide(Chunk.size * Chunk.tileSize).floor()

    const chunkIndexX = (playerChunk.x % Chunk.limit.x + Chunk.limit.x) % Chunk.limit.x
    const chunkIndexY = (playerChunk.y % Chunk.limit.y + Chunk.limit.y) % Chunk.limit.y
    const chunkIndex = chunkIndexY * (Chunk.limit.x) + chunkIndexX

    if (chunks[chunkIndex]) {
        chunks[chunkIndex].ctx.fillStyle = "#ff23"
        const markPos = player.sub(chunks[chunkIndex].pos.scale(Chunk.size * Chunk.tileSize))
        chunks[chunkIndex].ctx.fillRect(markPos.x + 20 * Math.random() - 10, markPos.y + 20 * Math.random() - 10, 10, 10)
    }
    if (Input.up || Input.downState && Input.pointer.y < Screen.size.y / 3) {
        player.y -= Chunk.tileSize * 0.05 * dt;
    }
    if (Input.right || Input.downState && Input.pointer.x > Screen.size.x * 2 / 3) {
        player.x += Chunk.tileSize * 0.05 * dt;
    }
    if (Input.down || Input.downState && Input.pointer.y > Screen.size.y * 2 / 3) {
        player.y += Chunk.tileSize * 0.05 * dt;
    }
    if (Input.left || Input.downState && Input.pointer.x < Screen.size.x / 3) {
        player.x -= Chunk.tileSize * 0.05 * dt;
    }
    camera.addMut(player.sub(camera).divide(10));
}
function render() {
    ctx.save();
    const translation = Screen.center.sub(camera).floor()
    ctx.translate(translation.x, translation.y);

    const chunkSize = Chunk.tileSize * Chunk.size
    const cameraTopLeftChunk = camera.sub(Screen.center).divide(chunkSize).floor()
    const cameraBottomRightChunk = camera.add(Screen.center).divide(chunkSize).ceil()
    for (let y = cameraTopLeftChunk.y; y < cameraBottomRightChunk.y; y++) {
        for (let x = cameraTopLeftChunk.x; x < cameraBottomRightChunk.x; x++) {
            const chunkID = `${x}:${y}`
            const chunkIndexX = (x % Chunk.limit.x + Chunk.limit.x) % Chunk.limit.x
            const chunkIndexY = (y % Chunk.limit.y + Chunk.limit.y) % Chunk.limit.y
            const chunkIndex = chunkIndexY * (Chunk.limit.x) + chunkIndexX
            if (!chunks[chunkIndex]) {
                chunks[chunkIndex] = new Chunk(chunkID)
            } else if (chunks[chunkIndex].id !== chunkID) {
                chunks[chunkIndex].generate(chunkID)
            }
        }
    }
    chunks.forEach(chunk => chunk.render())

    /*  Player  */
    ctx.fillStyle = pause ? "grey" : "orange";
    ctx.fillRect(player.x - Chunk.tileSize / 2, player.y - Chunk.tileSize / 2, Chunk.tileSize, Chunk.tileSize);
    ctx.fillStyle = "white"
    ctx.fillText(`${player.x.toFixed(0)}, ${player.y.toFixed(0)}`, player.x - Chunk.tileSize / 2, player.y - Chunk.tileSize / 2)
    ctx.fillText(`${Math.floor(player.x / chunkSize)}, ${Math.floor(player.y / chunkSize)}`, player.x - Chunk.tileSize / 2, player.y)
    chunks.forEach(chunk => chunk.renderTV())
    chunks.forEach(chunk => chunk.renderRoof())
    ctx.restore();

    /*  UI  */
    ctx.fillStyle = "black"
    const text = chunks.map(c => c.id).reduce((acc, id, i) => {
            let addition = i % Chunk.limit.x === 0 ? "\n" : ""
            return acc + addition + String(id).padStart(8, " ")
        }, "").slice(1)
    ctx.fillText("   Cached chunks:", 15, 15)
    text.split("\n").forEach((t, i) => {
        ctx.fillText(t, 15, 20 + 15 * (i + 1))
    })
    if (pause) {
        ctx.fillStyle = "red"
        ctx.fillText("Pause", Screen.center.x, Screen.center.y)
    }
}
let lastFrameTime = 0;
function frame(timestamp = 0) {
    const dt = clamp(timestamp - lastFrameTime, 1000);
    lastFrameTime = timestamp;
    tick(dt)
    render();

    if (pause === false) {
        requestAnimationFrame(frame);
    }
}
