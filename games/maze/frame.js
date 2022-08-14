"use strict";
const TARGET_FPS = 60;
const SECOND = 1000;
let lastMove = 0;
const DELAY = 10;
let nextMove = DELAY;

function tick(dt) {
    lastMove += dt;
    if ((Input.left || Input.right || Input.up || Input.down) && lastMove > nextMove) {
        window.playerChunk = player.scale(1 / Chunk.size / Chunk.cellSize).floor()
        const currentChunkID = `${playerChunk.x}:${playerChunk.y}`;
        const upChunkID = `${playerChunk.x}:${playerChunk.y - 1}`;
        const rightChunkID = `${playerChunk.x + 1}:${playerChunk.y}`;
        const downChunkID = `${playerChunk.x}:${playerChunk.y + 1}`;
        const leftChunkID = `${playerChunk.x - 1}:${playerChunk.y}`;
        let chunk = chunks[currentChunkID];
        window.chunk = chunk
        nextMove = lastMove + DELAY;
        let x = (player.x / Chunk.cellSize % Chunk.size + Chunk.size) % Chunk.size;
        let y = (player.y / Chunk.cellSize % Chunk.size + Chunk.size) % Chunk.size;
        if (Input.up) {
            // if (y === 1) {
            //     chunk = chunks[upChunkID];
            //     y = Chunk.size - 1;
            // }
            const neighborUp = chunk.map[(y - 1) * Chunk.size + x];
            if (neighborUp || fly) {
                player.y -= Chunk.cellSize * 2;
            }
        }
        if (Input.right) {
            let neighborRight
            if (x === Chunk.size - 1) {
                chunk = chunks[rightChunkID];
                x = 1;
                neighborRight = chunk.map[y * Chunk.size + x - 1];
            } else {
                neighborRight = chunk.map[y * Chunk.size + x + 1];
            }
            if (neighborRight || fly) {
                player.x += Chunk.cellSize * 2;
            }
        }
        if (Input.down) {
            let neighborDown
            if (y === Chunk.size - 1) {
                chunk = chunks[downChunkID];
                y = 1;
                neighborDown = chunk.map[(y - 1) * Chunk.size + x];
            } else {
                neighborDown = chunk.map[(y + 1) * Chunk.size + x];
            }
            if (neighborDown || fly) {
                player.y += Chunk.cellSize * 2;
            }
        }
        if (Input.left) {
            // if (x === 1) {
            //     chunk = chunks[leftChunkID];
            //     x = Chunk.size - 1;
            // }
            const neighborLeft = chunk.map[y * Chunk.size + x - 1];
            if (neighborLeft || fly) {
                player.x -= Chunk.cellSize * 2;
            }
        }
        window.x = x
        window.y = y
    }
    camera.addMut(player.sub(camera).scale(1 / 10));
}
function render() {
    ctx.save();
    const translation = new Vector(Math.floor(width / 2 - camera.x - Chunk.cellSize / 4), Math.floor(height / 2 - camera.y - Chunk.cellSize / 4))
    ctx.translate(translation.x, translation.y);
    ctx.fillStyle = pause ? "rgb(200,200,200)" : "rgb(240,240,240)";
    ctx.fillRect(-translation.x, -translation.y, width, height);

    window.cameraTopLeftChunk = translation.scale(-1 / Chunk.size / Chunk.cellSize).floor()
    window.cameraBottomRightChunk = camera.add(new Vector(width / 2 + Chunk.cellSize / 4, height / 2 + Chunk.cellSize / 4)).scale(1 / Chunk.size / Chunk.cellSize).ceil()
    for (let y = cameraTopLeftChunk.y; y < cameraBottomRightChunk.y; y++) {
        for (let x = cameraTopLeftChunk.x; x < cameraBottomRightChunk.x; x++) {
            ctx.fillStyle = `rgb(${(x * 30 + 256) % 256}, ${(y * 30 + 256) % 256}, 128)`
            const chunkSize = Chunk.cellSize * Chunk.size
            const chunkX = x * chunkSize
            const chunkY = y * chunkSize
            ctx.fillRect(chunkX, chunkY, chunkSize, chunkSize)
            const chunkID = `${x}:${y}`
            ctx.fillStyle = "white"
            ctx.fillText(chunkID, chunkX + chunkSize / 2, chunkY + chunkSize / 2)
            if (!chunks[chunkID]) {
                chunks[chunkID] = new Chunk(chunkID)
            }
            chunks[chunkID].render()
        }
    }

    // chunks.forEach(chunk => chunk.render());
    ctx.fillStyle = pause ? "grey" : "green";
    if (fly && !pause) ctx.fillStyle = "orange";
    ctx.fillRect(player.x - Chunk.cellSize / 2, player.y - Chunk.cellSize / 2, Chunk.cellSize * 1.5, Chunk.cellSize * 1.5);
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
