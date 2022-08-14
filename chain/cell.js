function Cell(number) {
	this.stage = 0
	this.max = 4
	this.owner = 0
	this.i = number
	this.move
	this.vel
	this.place = function(x,y) {
		this.pos = new Vector(
		x*field.cellSize + field.cellSize/2 + !field.vertical*field.fix,
		y*field.cellSize + field.cellSize/2 + field.vertical*field.fix	)
	}
	this.draw = function() {
		if(field.changed[this.i]) {			
			ctx.fillStyle = '#ff7722'
		} else {
			ctx.fillStyle = colors[field.owners[this.i]]
		}
		ctx.beginPath()
		var size = stages[field.values[this.i]]*field.cellSize
		ctx.arc(this.pos.x, this.pos.y, size/2, 0, Math.PI*2)
		ctx.fill()
		if(field.values[this.i]) {
			ctx.font = size*.7 + 'px Cambria, serif'
			ctx.fillStyle = '#333'
			ctx.fillText(field.values[this.i], 
				this.pos.x - size*.185, 
				this.pos.y + size*.22)
		}
	}
}