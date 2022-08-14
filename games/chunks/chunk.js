class Chunk {
    static size = 9;
    static tileSize = 32;
    static limit = new Vector();

    constructor(id) {
        const chunkSize = Chunk.size * Chunk.tileSize
        this.canvas = document.createElement("canvas")
        this.canvas.width = chunkSize
        this.canvas.height = chunkSize
        this.ctx = this.canvas.getContext("2d")
        this.ctx.font = "15px sans-serif"
        this.generate(id)
    }
    generate(id) {
        const chunkSize = Chunk.size * Chunk.tileSize
        this.id = id;
        const [posX, posY] = id.split(":").map(x => parseInt(x))
        this.pos = new Vector(posX, posY)
        this.ctx.fillStyle = `#0${(posX%10 + 10) % 10}${(posY%10 + 10) % 10}`
        this.ctx.fillRect(0, 0, chunkSize, chunkSize)
        for (let y = 0; y < Chunk.size; y++) {
            for (let x = 0; x < Chunk.size; x++) {
                if (x % 2 === 1 ^ y % 2 === 1) {
                    this.ctx.fillStyle = x % 2 === 1 ? `#0${posX % 10}07` : "#5003";
                    const visualX = x * Chunk.tileSize + 8 * Math.random() - 4
                    const visualY = y * Chunk.tileSize + 8 * Math.random() - 4
                    this.ctx.fillRect(visualX, visualY
                        , Chunk.tileSize + Chunk.tileSize * Math.random()
                        , Chunk.tileSize + Chunk.tileSize * Math.random());
                }
            }
        }
        const chunkID = `${posX}:${posY}`
        this.ctx.fillStyle = "white"
        this.ctx.fillText(chunkID, Chunk.tileSize, Chunk.tileSize)
        this.ctx.fillStyle = "white"
        this.ctx.fillText(`${this.pos.x * chunkSize} ${this.pos.y * chunkSize}`, Chunk.tileSize, Chunk.tileSize * 2)
        this.roof = undefined
        this.TV = undefined
        if (Math.random() < 0.1) {
            this.roof = new Vector(Math.random(), Math.random()).add(this.pos).scale(chunkSize)//this.pos.x * chunkSize + chunkSize * Math.random(), this.pos.y * chunkSize + chunkSize * Math.random())
        } else if (Math.random() > 0.98) {
            this.TV = this.pos.scale(chunkSize)
        }
    }

    render() {
        const chunkSize = Chunk.size * Chunk.tileSize
        ctx.drawImage(this.canvas, this.pos.x * chunkSize, this.pos.y * chunkSize)
    }

    renderRoof() {
        if (this.roof) {
            ctx.beginPath()
            ctx.arc(this.roof.x, this.roof.y, Chunk.tileSize, 0, Math.PI * 2)
            ctx.fillStyle = "#632"
            ctx.fill()
            ctx.beginPath()
            ctx.arc(this.roof.x, this.roof.y, Chunk.size * Chunk.tileSize, 0, Math.PI * 2)
            ctx.fillStyle = "#264d"
            ctx.fill()
        }
    }

    renderTV() {
        if (this.TV) {
            ctx.beginPath()
            ctx.moveTo(Screen.size.x / 20 + this.TV.x-50, Screen.size.y / 15 + this.TV.y+50)
            ctx.lineTo(Screen.size.x / 20 + this.TV.x, Screen.size.y / 15 + this.TV.y)
            ctx.lineTo(Screen.size.x / 20 + this.TV.x+50, Screen.size.y / 15 + this.TV.y+50)
            ctx.rect(this.TV.x, this.TV.y, Screen.size.x / 10, Screen.size.y / 10)
            ctx.lineWidth = 10
            ctx.strokeStyle = "orange"
            ctx.stroke()
            ctx.drawImage(canvas, this.TV.x, this.TV.y, Screen.size.x / 10, Screen.size.y / 10)
        }
    }
}
