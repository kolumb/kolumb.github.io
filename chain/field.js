function Field() {
	/*this.explode = function(cell){
		cells[cell].n
	}*/
	this.nextStep
	this.max
	this.explodedCells = []
	this.totalCeil = 0
	this.create()
}


Field.prototype.move = function(p, x, y){
	var cell = x + y*this.size.x
	if(unstable || this.owners[cell] !== 0 || this.owners[cell] !== p) {
		//cells[x + y*this.w].explode()
		wrongMoveSound()
		return
	}
	if(debug){
		console.log('====== move ======')
		console.log('unstable', unstable)
		console.log('cell', cell)
		console.log('this.owners[cell]', this.owners[cell])
	}
}

Field.prototype.create = function() {
	this.size = new Vector(
		Math.floor((width/cellSize))
		, Math.floor((height/cellSize))
	)
	this.max = this.size.x*this.size.y
	this.values = new Array(this.max)
	this.nextStep = new Array(this.max)
	this.explodedCells = new Array(this.max)
	this.changed = new Array(this.max)
	this.ceils = new Array(this.max)
	this.owners = new Array(this.max)
	this.neighbors = new Array(this.max)
	for (var i = 0; i < this.max; i++) {
		this.values[i] = 0
		this.nextStep[i] = 0
		this.explodedCells[i] = 0
		this.changed[i] = false
		this.ceils[i] = 4
		this.owners[i] = 0
		this.neighbors[i] = []
	}
	if(debug){
		console.log('====== Field.create ======')
		console.log('this.size.x', this.size.x)
		console.log('this.size.y', this.size.y)
		console.log('this.max', this.max)
	}
	this.setCeils()
}

Field.prototype.setCeils = function() {
	var cell = 0
	, neighbors
	, ceil
	, width = this.size.x
	, height = this.size.y
	for (var y = 0; y < height; y++){
		for (var x = 0; x < width; x++){
			neighbors = this.neighbors[cell]
			ceil = this.ceils[cell]
			if(x === 0) {
				neighbors.push(1+y*width)
				ceil--
			} else if(x === width-1) {
				neighbors.push(width-2 + y*width)
				ceil--
			} else {
				neighbors.push(x-1+y*width)
				neighbors.push(x+1+y*width)
			}

			if(y === 0) {
				neighbors.push(x+1*width)
				ceil--
			} else if(y === height-1) {
				neighbors.push(x+(height-2)*width)
				ceil--
			} else {
				neighbors.push(x+(y+1)*width)
				neighbors.push(x+(y-1)*width)
			}
			this.totalCeil += ceil
			this.ceils[cell] = ceil
			cell++
		}
	}
	if(debug){
		console.log('=== Field set Ceils ===')
		console.log('neighbors.length', neighbors.length)
		if(detailed) {
			console.log('field.ceils', this.ceils)
			console.log('field.neighbors', this.neighbors)
		}
		console.log('ceil', ceil)
		console.log('this.totalCeil', this.totalCeil)
	}
}

Field.prototype.update = function() { // No this. because I call it from setTimeout - window
	exploding = false
	sizeOfExplosion = 0
	for (var i = 0; i < field.max; i++) {
		field.changed[i] = false // reset changed state of cells
		field.values[i] = field.nextStep[i] // apply new state of field
		sizeOfExplosion += field.explodedCells[i] // if exploded is true then add one
		if(field.values[i] === 0) {
			field.owners[i] = 0
		}
	}
	for (var i = 0; i < field.max; i++) {
		if(field.values[i] >= field.ceils[i]) {
			field.changed[i] = true
			field.pop(i)
			if(!mute) pops.play()
			//console.log('1', performance.now())
		}
	}
	if (sizeOfExplosion === field.max) {
		//console.log('Infinite!')
		if(!end) {
			end = true
			victorySound()
			//background = '#191919'
		}
	}
	if(exploding) {
		setTimeout(field.update, logicFPS)
	} else {
		finishExplosionSound(sizeOfExplosion)
		unstable = false
		nextPlayer()
		sayWhoIsNext(player)
		var canHeMove = false
	}
	for (var i = 0; i < field.max; i++) {
		field.explodedCells[i] = 0 // reset orange cells
		if(canHeMove === false) { // once
			if(field.owners[i] === player/*his*/ || field.owners[i] === 0 /*empty*/) {
				canHeMove = true
			}
		}
	}
	if(canHeMove === false) { // skip turn
		setTimeout(field.update, logicFPS)
	}
	//console.log(target)
	//setTargets()
	redrawCircles()
	if(debug){
		console.log('=== Field update ===')
		console.log('exploding', exploding)
		console.log('sizeOfExplosion', sizeOfExplosion)
		console.log('end', end)
		console.log('player', player)
		console.log('canHeMove', canHeMove)
		console.log('field.values', field.values)
		console.log('field.ceils', field.ceils)
	}
}
var nextPlayer = function(){
	if(++player > maxPlayers) { player = 1}
}
Field.prototype.add = function(cell) {
	this.nextStep[cell]++
	this.owners[cell] = player
	//this.changed[cell] = true
}
Field.prototype.pop = function(cell) {
	exploding = true
	this.explodedCells[cell] = 1
	this.nextStep[cell] -= this.ceils[cell]
	
	for (var i = 0; i < this.neighbors[cell].length; i++) {
		this.add(this.neighbors[cell][i])
		var thisCell = cell
		var thisValue = i
		var thisFlock = cell*4 + i + 1
		var thatCell = this.neighbors[cell][i]
		var thatValue = this.nextStep[thatCell]
		var thatFlock = thatCell*4 + thatValue + 1


	}
	if(debug){
		console.log('=== Field pop ===')
	}
}