var buffer = document.createElement('canvas')
, bufctx = buffer.getContext('2d')
, ctx = Canvas.getContext('2d')

, width
, height
, vertical
, cellSize
, fixCentering

, background = '#000000'//'#ffffff'//

, initCanvas = function(){
	buffer.width = Canvas.width = width = window.innerWidth
	buffer.height = Canvas.height = height = window.innerHeight
	ctx.font = "bold 2em Georgia, Garamond, Times New Roman,serif"
	ctx.fillStyle = 'white'
	bufctx.globalCompositeOperation = "lighter"
	vertical = width < height
	if(vertical) {
		cellSize = width / level
		fixCentering = (height % cellSize) / 2
	} else {
		cellSize = height / level
		fixCentering = (width % cellSize) / 2
	}
	if(debug) {
		console.log('====== initCanvas ======')
		console.log('width', width)
		console.log('height', height)
		console.log('cellSize', cellSize)
		console.log('fixCentering', fixCentering)
	}
}
, resize = function(){
	initCanvas()
	if(vertical) {
		cellSize = width/field.size.x
		fixCentering = (height - cellSize*field.size.y)/2
	} else {
		cellSize = height/field.size.y
		fixCentering = (width - cellSize*field.size.x)/2
	}
	if(debug) {
		console.log('====== resize ======')
		console.log('field.size.x', field.size.x)
		console.log('field.size.y', field.size.y)
		console.log('New cellSize', cellSize)
		console.log('New fixCentering', fixCentering)
	}
	placeCells()
	redrawCircles()
}
, redrawCircles = function(now) {
	/*if(now - before < FPS) {
		before = now
		requestAnimationFrame(field.redraw)
		return
	}
	before = now*/
	bufctx.clearRect(0,0,width, height)
	//Canvas.width = width
	//Canvas.height = height
	//ctx.globalCompositeOperation = "lighter"
	bufctx.fillStyle = background
	bufctx.fillRect(0,0, width,height)
	for (var i = 0; i < field.max; i++){
		cells[i].draw()
	}
	if(debug){
		var date = new Date()
		console.log('=== redrawCircles ===', 'time is', Math.floor(performance.now()))//date.getSeconds() ,date.getMilliseconds())
		console.log('field.max', field.max)
		console.log('cells.length', cells.length)
		console.log('mistake', mistake)
		console.log('player', player)
	}
	if(mistake) {
		bufctx.beginPath()
		bufctx.fillStyle = colors[player]
		bufctx.arc(mistake.x, mistake.y, cellSize/2, 0, Math.PI*2, false)
		bufctx.arc(mistake.x, mistake.y, cellSize/3, 0, Math.PI*2, true)
		bufctx.fill()
		mistake = null
	}
	// tip player color
	bufctx.fillStyle = colors[player]
	bufctx.beginPath()
	bufctx.moveTo(cellSize/3,0)
	bufctx.lineTo(0, cellSize/3)
	bufctx.lineTo(0,0)
	bufctx.closePath()
	bufctx.moveTo(width-cellSize/3,0)
	bufctx.lineTo(width, cellSize/3)
	bufctx.lineTo(width,0)
	bufctx.closePath()
	bufctx.moveTo(cellSize/3, height)
	bufctx.lineTo(0, height - cellSize/3)
	bufctx.lineTo(0,height)
	bufctx.closePath()
	bufctx.moveTo(width-cellSize/3, height)
	bufctx.lineTo(width, height - cellSize/3)
	bufctx.lineTo(width,height)
	bufctx.fill()

	ctx.drawImage(buffer, 0, 0)
	redrawDots()
	//ctx.fillRect(0, 0, level*10, height)
}