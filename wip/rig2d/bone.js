class Bone {
	color = randomColor()
	angle = 0
	relativeAngle = 0
	length = 0
	constructor(size = new Vector(), parent) {
		this.parent = parent
		if (parent) {
			this.size = size
			this.pos = parent.pos.add(size)
			this.angle = size.angle()
			this.relativeAngle = normalizeAngle(this.angle - parent.angle)
			this.length = size.length()
		} else {
			this.size = new Vector()
			this.pos = size
		}
		this.vertices = new Array(vertices.length).fill(0)
	}
	update() {
		if (this.parent) {
			const newAngle = this.parent.angle + this.relativeAngle
			const angleDiff = normalizeAngle(newAngle - this.angle)
			this.angle = newAngle
			this.size = Vector.fromAngle(this.angle).scale(this.length)
			const newPos = this.parent.pos.add(this.size)
			const shift = newPos.sub(this.pos)
			vertices.forEach((vertex, i) => {
				vertex.pos.addMut(shift.scale(this.vertices[i]))
				vertex.pos.setFrom(vertex.pos.sub(this.pos).rotate(angleDiff * this.vertices[i]).add(this.pos))
			})
			this.pos.setFrom(newPos)
		}
	}
	render() {
		this.size.scale(-1).drawFrom(this.pos)
		Ctx.fillStyle(this.color)
		Ctx.beginPath()
		Ctx.arc(this.pos, 5, 0, Math.PI * 2)
		Ctx.fill()
		Ctx.fillStyle("black")
		Ctx.fillText((this.relativeAngle * 180 / Math.PI).toFixed(0), this.pos)
	}
}
