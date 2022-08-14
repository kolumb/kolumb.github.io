class Commit {
    constructor(parent) {
        this.parent = parent || {pos: new Vector(width / 2, 7 * height / 8)}
        this.radius = 3
        this.pos = this.parent.pos.add(new Vector(Math.random()*20-10, -this.radius * 15))
        this.vel = new Vector(0, 0)
        this.hash = parent ? randomHash() : 'root'
    }
    update() {
        const dx = this.parent.pos.x - this.pos.x
        const dy = this.parent.pos.y - this.pos.y
        const d = dx*dx+dy*dy
        let fx = attrForce*dx/(d)-repForce*dx/(d*d)
        let fy = attrForce*dy/(d)-repForce*dy/(d*d)
        clamp(fx, maxSpeed)
        clamp(fx, maxSpeed)

        this.vel.x += fx
        this.vel.y += fy - antyGravity
        this.vel = this.vel.scale(0.99)
        this.pos.addMut(this.vel)
    }
    draw() {
        ctx.save()
        ctx.beginPath()
        ctx.arc(this.pos.x, this.pos.y, this.radius, 0, Math.PI * 2)
        ctx.fillStyle = "#222"
        ctx.fill()
        ctx.stroke()
        ctx.fillStyle = "white"
        ctx.textAlign = "center"
        ctx.font = "12px sans-serif"
        ctx.fillText(this.hash, this.pos.x, this.pos.y - 6)
        ctx.restore()
    }
    drawConnection() {
        ctx.save()
        ctx.beginPath()
        ctx.moveTo(this.parent.pos.x, this.parent.pos.y)
        ctx.lineTo(this.pos.x, this.pos.y)
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.restore()
    }
}
