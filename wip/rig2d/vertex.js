class Vertex {
	static radius = new Vector(3, 3)
	static diameter = Vertex.radius.scale(2)
	color = "black"
	constructor(pos) {
		this.pos = pos
	}
}