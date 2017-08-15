
var logicFPS = 1000/7
, FPS = 1000/24
//, before = 0

, field
, fieldSize
, maxCells
, cells = []
, stages = [.1, .3, .7, 1.2, 1.6, 2, 2.4, 2.8]
, unstable = false
, explosion = 0
, sizeOfExplosion

, player = 1
, lightColors = ['#cccccc', '#92D169', '#B880FF', '#FF6060', '#80E3FF', '#FFAA80', '#FF80FB', '#FFF080', '#80A6FF', '#80FFB4', '#FF80A6']

, darkColors = ['#bbbbbb', '#FF8080', '#78BEF0', '#DED16F', '#CC66C9', '#5DBAAC', '#F2A279', '#7182E3', '#92D169', '#BF607C', '#81DCE4']
, colors = lightColors


, mistake

function Vector(x,y) {
	this.x = x
	this.y = y
}
(function(){
	this.add = function (v) {
		return new Vector(this.x + v.x, this.y + v.y)
	}
	this.mult = function(multiplicator) {
		return new Vector(this.x * multiplicator, this.y * multiplicator)
	}
	this.length = function() {
		return Math.sqrt(this.x*this.x + this.y*this.y)
	}
}).call(Vector.prototype)

function loop(o){
	for (var i = o.from; i < o.to; i++){
		o.do(i)
	}
}

function clickHandler(event) {
	// var x = Math.floor((event.layerX - !vertical*fixCentering)/cellSize)
	// var y = Math.floor((event.layerY - vertical*fixCentering)/cellSize)
	// field.move(player, x, y)

	/*position.push(event.layerX - !vertical*fixCentering)
	position.push(event.layerY - vertical*fixCentering)

	showDots.push(false)
	showDots.push(false)*/


	if(unstable) {
		mistake = new Vector(event.layerX, event.layerY)
		if(!mute) errSound.play()
		setTimeout(redrawCircles, logicFPS*2)
		return
	}
	var x = Math.floor((event.layerX - !vertical*fixCentering)/cellSize)
	var y = Math.floor((event.layerY - vertical*fixCentering)/cellSize)
	var cell = y*field.size.x + x
	if(!field.owners[cell]/*empty*/ || field.owners[cell] === player/*my*/) {
		//cells[cell].addDots()
		field.add(cell)
		/*var hord = new Hord(cell)
		hords[cell].push(hord)
		hord.reassine(cell)*/
		unstable = true
		setTimeout(field.update, logicFPS)
		if(!mute) pop[player].play()
	} else {
		mistake = new Vector(event.layerX, event.layerY)
		if(!mute) errSound.play()
		setTimeout(redrawCircles, logicFPS*2)
	}
	redrawCircles()
}

function frame(stamp) {
	/*for(var i = 0; i < field.max; i++) {
		cells[i].draw()
	}*/
	redrawDots()
	/*setTargets()
	for(var i = 0; i < maxDots * 2; i++) {
		position[i] += velocity[i]
	}
	for(var i = 0; i < maxDots * 2; i++) {
		velocity[i] = (target[i] - position[i]) * inertia
	}
	for(var i = 0; i < maxDots * 2; i+=2) {
		ctx.save()
		ctx.fillStyle = '#fff'
		ctx.beginPath()
		ctx.arc(position[i], position[i+1], 5, 0, Math.PI*2)
		ctx.fill()
		ctx.restore()
	}*/
	//console.log('target in each frame', target)
}
document.addEventListener('keypress', frame)

function startGame() {
	initCanvas()
	field = new Field()
	initForceFields(field)
	loop({from: 0, to: field.max, do: createCells}) //createCells()
	placeCells()
	setFigures()

	//setTimeout(field.update, logicFPS)
	//setTargets()
	redrawCircles()
	redrawDots()

	window.addEventListener('resize', resize)
	Canvas.addEventListener('click', clickHandler)
}
window.addEventListener('load', startGame)	




function Debug(){
	console.clear()
	console.log('unstable ', unstable)
	console.log('plaing ', plaing)
}