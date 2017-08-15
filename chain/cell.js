function createCells(i) {
	cells.push( new Cell(i) )
	//cells[i].initFigure(10, cells[i].pos.x, cells[i].pos.y)
}

function placeCells() {
	for (var i = 0; i<field.size.x; i++){
		for (var j = 0; j<field.size.y; j++){
			cells[j*field.size.x+i].place(i,j)
		}
	}
}


function Cell(number) {
	this.points = []
	this.stage = 0



// old
	this.max = 4
	this.owner = 0
	this.i = number
	this.move
	this.vel
}
/*
	var added = 0
	while(added < dotsPerSpawn){
		this.points.push(dots)
		position.push(this.pos.x)
		position.push(this.pos.y)
		dots++
		added++
	}
*/
Cell.prototype.place = function(x,y) {
	this.pos = new Vector(
		x*cellSize + cellSize/2 + !vertical*fixCentering
		, y*cellSize + cellSize/2 + vertical*fixCentering	
	)
}
Cell.prototype.draw = function() {
	var value = field.values[this.i]
	if(field.changed[this.i]) {			
		bufctx.fillStyle = '#ff7722'
	} else {
		bufctx.strokeStyle = colors[field.owners[this.i]]
	}
	bufctx.beginPath()
	var size = stages[value]*cellSize
	bufctx.arc(this.pos.x, this.pos.y, size/2, 0, Math.PI*2)
	bufctx.stroke()
	if(value) { // sign non empty cells
		bufctx.font = size*.7 + 'px Cambria, serif'
		bufctx.fillStyle = '#333'
		bufctx.fillText(
			value
			, this.pos.x - size*.185
			, this.pos.y + size*.22
		)
	}
	if(debug && detailed){
		console.log('=== Cell draw ===')
		console.log('value', value)
		console.log('size', size)
	}
}