var mass = 1000
, inertia = 1/mass

, dotsPerSpawn = 1
, maxDots

, flocks
, dots = 0
, showDots
, position
, velocity
, figures
, target
, sectors

, forseDetalisation = 7//per cell
, explosion
, perlin


, dist = function(x1,y1,x2,y2){
	return Math.sqrt(Math.pow(x2-x1,2)+Math.pow(y2-y1,2))
}
, initForceFields = function(field){
	/*explosion = [forseDetalisation*forseDetalisation]
	for (var i = 0; i < forseDetalisation; i++) {
		for (var j = 0; j < forseDetalisation; j++) {
			spot = i + j*forseDetalisation
			//spotWidth = 
			explosion[spot] = Math.random()-0.5//dist()
		}
	}*/

	flocks = []
	perlin = [] // x*y*forseDetalisation*forseDetalisation
	maxDots = field.totalCeil * dotsPerSpawn
	showDots = [] // maxDots
	figures = [] // maxDots*2
	target = [] // maxDots*2
	sectors = []
	velocity = [] // maxDots*2
	position = [] // maxDots*2
}
, setFigures = function() {
	for (var i = 0; i<field.size.x; i++){
		for (var j = 0; j<field.size.y; j++){
			//hords[j*field.size.x+i] = []
			var cell = cells[j*field.size.x+i]
			initFigure(cell.i, 4*dotsPerSpawn, cell.pos.x, cell.pos.y)
		}
	}
}
, initFigure = function(cell, addingDots, startX, startY){
	var x = 0
	, y = 0
	, rotation = 0
	, turn = 0 // r
	, t = 0 // k
	, bias = Math.random() * 3 + 0.05 // koef
	, turnAmplitude = Math.random() * 3 + 0.1 // ko
	, speedOfTime = Math.random() * 3 + 0.1 // kko
	, xmax = 0
	, xmin = 0
	, ymax = 0
	, ymin = 0
	, targw = cellSize*.7
	, targh = cellSize*.7
	, shift = cell*addingDots

	for (var i = 0; i <= addingDots; i+=2) {
		x += Math.cos(turn)
		y += Math.sin(turn)
		figures[shift+i] = x
		figures[shift+i+1] = y
		turn += turnAmplitude * (Math.sin(t) + bias)
		t += speedOfTime
		if (x > xmax) xmax = x
		if (x < xmin) xmin = x
		if (y > ymax) ymax = y
		if (y < ymin) ymin = y

	}
	x = targw / (xmax - xmin)
	y = targh / (ymax - ymin)
	if (x < y) {
		zoom = x
	} else {
		zoom = y
	}
	x = (xmax + xmin) / 2
	y = (ymax + ymin) / 2
	for (var i = 0; i <= addingDots; i+=2) {
		figures[shift+i] = startX + (figures[shift+i] - x) * zoom
		figures[shift+i+1] = startY + (figures[shift+i+1] - y) * zoom
	}
}
, redrawDots = function(){
	recalculateDots()
	ctx.drawImage(buffer, 0, 0)
	var i = 0
	, x
	, y
	ctx.fillStyle = colors[1]
	ctx.beginPath()
	while(i<maxDots){
		x = figures[i*2]
		y = figures[i*2+1]
		ctx.moveTo(x,y)
		ctx.arc(x,y,2,0,Math.PI*2,true)
		i++
	}
	ctx.fill()
	//requestAnimationFrame(redrawDots)
}
, recalculateDots = function(){
	var x
	, y
	, f
	, s
	//console.log('position',position)
	//console.log('target',target)
	
	while(i<dots){
		f = i*2
		s = f+1
		velocity[f] += (position[f] - target[f])*.1
		velocity[s] += (position[s] - target[s])*.1
		x = position[f] + velocity[f]
		y = position[s] + velocity[s]
		i++
	}
	//console.log(f)
	//console.log(s)
}
, Hord = function(cell) {
	this.owner = cell
	this.index = cell*dotsPerSpawn*2
	var added = 0
	cell = cells[cell]
	while(added < dotsPerSpawn){
		position.push(cell.pos.x)
		position.push(cell.pos.y)
		dots++
		added++
	}
}

Hord.prototype.reassine = function(cell){
	this.owner = cell
	this.index = cell*dotsPerSpawn*2
	var i = 0
	while(i<dotsPerSpawn*2){
		target[this.index+i] = figures[this.index+i]
		i++
	}
}