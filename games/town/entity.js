const Items = Enum(["nothing", "grass", "dirt", "sand", "stone"])

let putDistance = 25000

class Entity {
    angle = Math.random() * Math.PI * 2
    speed = 1
    animationStart = frames - Math.floor(Math.random() * 40)
    standing = 0
    walking = Math.floor(Math.random() * 4)
    bringing = Math.floor(Math.random() * 4)
    repelling = false
    holding = [Items.nothing, Items.nothing, Items.nothing, Items.nothing]
    holdingColors = []
    constructor(texture, pos = new Vector()) {
        console.assert(texture)
        this.texture = texture
        this.pos = pos
    }
    update(dt) {
        if (this.repelling === false) {
            people.forEach(person => {
                if (person == this) return
                const dist = this.pos.distEuclidean(person.pos)
                if (dist < 2000) {
                    const dt = this.pos.sub(person.pos)
                    let len = dt.length()
                    if (len < 1) {
                        len = 1
                    }
                    this.pos.addMut(dt.scale(2 / len))
                }
            })
        }
        this.angle = Math.PI - (this.pos.angleTo(Input.pointer) + (this.repelling ? Math.PI : 0) + Math.PI / 2 - Math.PI / 8)
        if (this.angle < 0) this.angle += Math.PI * 2
        if (this.pos.distEuclidean(Input.pointer) < 900) {
            if (this.repelling === false) {
                const pitPos = Input.pointer.scale(1 / pixelSize).floor()
                const p4 = bgCtx.getImageData(pitPos.x, pitPos.y, 2, 2).data;
                for (let i = 0; i < 4; i++) {
                    const index = i * 4
                    let hex = "#" + ("000000" + rgbToHex(p4[index + 0], p4[index + 1], p4[index + 2])).slice(-6);
                    if (p4[index + 0] + p4[index + 1] + p4[index + 2] === 0) {
                        hex = rockColors[0]
                    }
                    let palette = grassColors
                    if (grassColors.indexOf(hex) > -1) {
                        palette = dirtColors
                        this.holding[i] = Items.grass
                    } else if (dirtColors.indexOf(hex) > -1) {
                        palette = sandColors
                        this.holding[i] = Items.dirt
                    } else if (sandColors.indexOf(hex) > -1) {
                        palette = rockColors
                        this.holding[i] = Items.sand
                    } else {
                        palette = rockColors
                        this.holding[i] = Items.stone
                    }
                    this.holdingColors[i] = hex
                    bgCtx.fillStyle = palette[Math.floor(Math.random() * dirtColors.length)]
                    bgCtx.fillRect(pitPos.x + i % 2, pitPos.y + i / 2 | 0, 1, 1)
                }
            }
            this.repelling = true
            Input.pointer.x += Math.random() * 6 - 3
            Input.pointer.y += Math.random() * 6 - 3
        } else if (this.pos.distEuclidean(Input.pointer) > putDistance) {
            if (this.repelling) {
                const pilePos = this.pos.add(Vector.fromAngle(Math.PI / 2 - this.angle).scale(pixelSize)).scale(1 / pixelSize).floor()
                for (let i = 0; i < 4; i++) {
                    bgCtx.fillStyle = this.holdingColors[i]
                    bgCtx.fillRect(pilePos.x + i % 2, pilePos.y + i / 2 | 0, 1, 1)
                    this.holding[i] = Items.nothing
                }
                this.repelling = false
            }
        }
        if (Math.random() < 0.01) {
            const stepPos = this.pos.add(new Vector(0, pixelSize * 2)).scale(1 / pixelSize).floor()
            const p = bgCtx.getImageData(stepPos.x, stepPos.y, 1, 1).data;
            let hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
            if (grassColors.indexOf(hex) > -1) {
                bgCtx.fillStyle = sandColors[Math.floor(Math.random() * dirtColors.length)]
                bgCtx.fillRect(stepPos.x, stepPos.y, 1, 1)
            }
        }
        this.pos.addMut(Vector.fromAngle(Math.PI / 2 - this.angle))
        if (frames - this.animationStart > 10) {
            this.animationStart += 10
            this.walking = (this.walking + 1) % 4
        }
    }
    draw() {
        let indexByAngle = Math.floor(8 * this.angle / (Math.PI * 2))

        const itemPos = this.pos.add(Vector.fromAngle(Math.PI / 2 - this.angle).scale(pixelSize))
        if (this.repelling && (indexByAngle >= 2 && indexByAngle <= 6)) {
            ctx.fillStyle = "#333"
            ctx.fillRect(itemPos.x - pixelSize - 1, itemPos.y - pixelSize - 1, pixelSize * 2 + 2, pixelSize * 2 + 2)
            for (let i = 0; i < 4; i++) {
                ctx.fillStyle = this.holdingColors[i]
                ctx.fillRect(itemPos.x - pixelSize + pixelSize * (i % 2), itemPos.y - pixelSize + pixelSize * (i / 2 | 0), pixelSize, pixelSize)
            }
        }

        const spriteWidth = this.texture.specification.size.x * pixelSize
        const spriteHeight = this.texture.specification.size.y * pixelSize
        let sprites = this.repelling ? this.texture.specification.bringings : this.texture.specification.walkings
        ctx.drawImage(this.texture.image,
            sprites[indexByAngle].start.x + this.walking * this.texture.specification.size.x, sprites[indexByAngle].start.y,
            this.texture.specification.size.x, this.texture.specification.size.y,

            this.pos.x - spriteWidth / 2, this.pos.y - spriteHeight / 2,
            spriteWidth, spriteHeight)
        // this.pos.sub(Input.pointer).scale(-1).drawFrom(this.pos)
        // ctx.fillText(this.angle.toFixed(2), this.pos.x + 20, this.pos.y - 20)
        // ctx.fillText(this.holding, this.pos.x + 20, this.pos.y - 20)
        if (this.repelling && (indexByAngle < 2 || indexByAngle > 6)) {
            ctx.fillStyle = "#333"
            ctx.fillRect(itemPos.x - pixelSize - 1, itemPos.y - pixelSize - 1, pixelSize * 2 + 2, pixelSize * 2 + 2)
            for (let i = 0; i < 4; i++) {
                ctx.fillStyle = this.holdingColors[i]
                ctx.fillRect(itemPos.x - pixelSize + pixelSize * (i % 2), itemPos.y - pixelSize + pixelSize * (i / 2 | 0), pixelSize, pixelSize)
            }
        }
    }
}