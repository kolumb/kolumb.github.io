class Chunk {
    static size = 20;
    static cellSize = 32;
    map = new Array(Chunk.size * Chunk.size);

    constructor(id) {
        this.id = id;
        const [x, y] = id.split(":").map(x => parseInt(x))
        this.pos = new Vector(x, y)
        this.map = this.map.fill(0).map(cell => Math.random() < 0.5);
    }

    render() {
        // for (let y = 0; y < Chunk.size; y++) {
        //     for (let x = 0; x < Chunk.size; x++) {
        //         const index = y * Chunk.size + x;
        //         const cell = this.map[index]
        //         if ((x % 2 === 1 ^ y % 2 === 1)) {
        //             ctx.fillStyle = cell ? "#0507" : "#5003";
        //             ctx.fillRect(x * Chunk.cellSize - Chunk.cellSize / 4, y * Chunk.cellSize - Chunk.cellSize / 4, Chunk.cellSize, Chunk.cellSize);
        //         }
        //     }
        // }
        for (let y = 1; y < Chunk.size; y+=2) {
            for (let x = 1; x < Chunk.size; x+=2) {
                const posX = (this.pos.x * Chunk.size + x - 1) * Chunk.cellSize
                const posY = (this.pos.y * Chunk.size + y - 1) * Chunk.cellSize
                let neighborUp = this.map[(y - 1) * Chunk.size + x];
                let neighborLeft = this.map[y * Chunk.size + x - 1];
                const textureX = +neighborUp
                const textureY = +neighborLeft
                ctx.drawImage(walls.texture, textureX * 8, textureY * 8, 8, 8, posX, posY, Chunk.cellSize * 2, Chunk.cellSize * 2);
            }
        }
    }
    log() {
        const result = []
        for (let y = 0; y < Chunk.size; y++) {
            result.push(this.map.slice(y * Chunk.size, y * Chunk.size + Chunk.size).map((v, x) => (x % 2 === 1 ^ y % 2 === 1) ? (v === false ? (y % 2 ? "|" : "—") : " ") : false == (x % 2 && y % 2) ? "." : " ").join(" "))
        }
        console.log(result.join("\n"))
    }
}
