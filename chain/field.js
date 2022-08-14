function Field(levelArg) {
	var level = levelArg
	var width
	var height
	var max
	var nextStep
	var sizeOfExplosion = 0
	this.explodedCells = []
	this.color = '#000000'//'#ffffff'//
	this.resize = function(){
		Canvas.width = field.width = width = window.innerWidth
		Canvas.height = field.height = width = window.innerHeight
		buffer.width = Canvas.width; 
		buffer.height = Canvas.height; 
		ctx.globalCompositeOperation = "lighter"
		ctx.font = "bold 2em Georgia, Garamond, Times New Roman,serif"
		field.vertical = field.width < field.height
		field.cellSize = 
		field.vertical ? field.width/field.size.x : field.height/field.size.y
		if(field.vertical) {
			field.fix = (field.height - field.cellSize*field.size.y)/2
		} else {
			field.fix = (field.width - field.cellSize*field.size.x)/2
		}
		placeCells()
		field.redraw()
	}
	this.create = function() {
		Canvas.width = this.width = width = window.innerWidth
		Canvas.height = this.height = height = window.innerHeight
		buffer.width = Canvas.width; 
		buffer.height = Canvas.height; 
		this.vertical = width < height
		ctx.globalCompositeOperation = "lighter"
		this.cellSize = (this.vertical ? width : height)/level
		this.size = new Vector(0|(width/this.cellSize), 0|(height/this.cellSize))
		if(this.vertical) {
			this.fix = (height - this.cellSize*this.size.y)/2
		} else {
			this.fix = (width - this.cellSize*this.size.x)/2
		}
		max = this.size.x*this.size.y
		this.max = max	
		this.values = [max]
		nextStep = [max]
		explodedCells = [max]
		this.changed = [max]
		this.ceils = [max]
		this.owners = [max]
		this.neighbors = [max]
		for (var i = 0; i < max; i++) {
			this.values[i] = 0
			nextStep[i] = 0
			explodedCells[i] = 0
			this.changed[i] = false
			this.ceils[i] = 4
			this.owners[i] = 0
			this.neighbors[i] = []
		}
		this.setCeils()
	}
	this.setCeils = function() {
		var i = 0
		var near
		var width = this.size.x
		var height = this.size.y
		for (var y = 0; y < height; y++){
			for (var x = 0; x < width; x++){
				near = this.neighbors[i]
				if(x === 0) {
					near.push(1+y*width)
					this.ceils[i]--
				} else if(x === width-1) {
					near.push(width-2 + y*width)
					this.ceils[i]--
				} else {
					near.push(x-1+y*width)
					near.push(x+1+y*width)
				}

				if(y === 0) {
					near.push(x+1*width)
					this.ceils[i]--
				} else if(y === height-1) {
					near.push(x+(height-2)*width)
					this.ceils[i]--
				} else {
					near.push(x+(y+1)*width)
					near.push(x+(y-1)*width)
				}
				i++
			}
		}
	}
	this.update = function() {
		explosion = 0
		sizeOfExplosion = 0
		for (var i = 0; i < field.max; i++) {
			field.changed[i] = false
			field.values[i] = nextStep[i]
			sizeOfExplosion += field.explodedCells[i]
			if(field.values[i] === 0) {
				field.owners[i] = 0
			}
		}
		for (var i = 0; i < field.max; i++) {
			if(field.values[i] >= field.ceils[i]) {
				field.changed[i] = true
				field.pop(i)
				if(!mute) pops.play()
			}
		}
		if (sizeOfExplosion === field.max) {
			//console.log('Infinite!')
			if(!end) {
				end = true
				if(!mute) {infiniteSound.play()
				pops.volume = .3}
				//field.color = '#191919'
			}
		}
		if(explosion) {
			setTimeout(field.update, logicFPS)
		} else {
			if(plaing){
				plaing = false
				if(!mute) {pops.pause()
				pops.currentTime = 0}
				if(sizeOfExplosion>3 && speech) {
					if(synth.speaking) synth.cancel()
					synth.speak(
						winUtter[
							Math.floor(
								Math.random()*winPhrases.length
							)
						]
					)
				}
			}
			unstable = false
			if(++player > maxPlayers) { player = 1}
			if(synth.speaking && sizeOfExplosion<4) synth.cancel()
			if(speech) synth.speak(
				utterThis[
					Math.floor(
						phrases.length*Math.random()
					) + (player-1)*phrases.length
				]
			)
			var canMove = false
			for (var i = 0; i < field.max; i++) {
				field.explodedCells[i] = 0
				if(!canMove) {
					if(field.owners[i] === player || field.owners[i] === 0) {
						canMove = true
					}
				}
			}
			if(!canMove) {
				setTimeout(field.update, logicFPS)
			}
		}
		field.redraw()
	}
	this.redraw = function(now) {
		/*if(now - before < FPS) {
			before = now
			requestAnimationFrame(field.redraw)
			return
		}
		before = now*/
		ctx.clearRect(0,0,width, height)
		//Canvas.width = width
		//Canvas.height = height
		//ctx.globalCompositeOperation = "lighter"
		ctx.fillStyle = field.color
		ctx.fillRect(0,0, width,height)
		for (var i = 0; i < max; i++){
			cells[i].draw()
		}
		if(error) {
			ctx.beginPath()
			ctx.fillStyle = colors[player]
			ctx.arc(error.x, error.y, field.cellSize/2, 0, Math.PI*2, false)
			ctx.arc(error.x, error.y, field.cellSize/3, 0, Math.PI*2, true)
			ctx.fill()
			error = null
		}
		ctx.fillStyle = colors[player]
		ctx.beginPath()
		ctx.moveTo(field.cellSize/3,0)
		ctx.lineTo(0, field.cellSize/3)
		ctx.lineTo(0,0)
		ctx.closePath()
		ctx.moveTo(width-field.cellSize/3,0)
		ctx.lineTo(width, field.cellSize/3)
		ctx.lineTo(width,0)
		ctx.closePath()
		ctx.moveTo(field.cellSize/3, height)
		ctx.lineTo(0, height - field.cellSize/3)
		ctx.lineTo(0,height)
		ctx.closePath()
		ctx.moveTo(width-field.cellSize/3, height)
		ctx.lineTo(width, height - field.cellSize/3)
		ctx.lineTo(width,height)

		ctx.fill()
		//ctx.fillRect(0, 0, level*10, height)
		//requestAnimationFrame(field.redraw)
	}
	this.add = function(cell) {
		nextStep[cell]++
		this.owners[cell] = player
		//this.changed[cell] = true
	}
	this.pop = function(cell) {
		explosion++
		field.explodedCells[cell] = 1
		nextStep[cell] -= this.ceils[cell]
		
		for (var i = 0; i < this.neighbors[cell].length; i++) {
			this.add(this.neighbors[cell][i])
		}
	}
	this.create()
}