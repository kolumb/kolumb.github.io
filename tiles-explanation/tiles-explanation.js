'use strict';
const ctx = Canvas.getContext('2d')
const width = Canvas.width = innerWidth
const height = Canvas.height = innerHeight
//ctx.imageSmoothingEnabled = false

const tileSize = 64//4
let cameraX = 0
let cameraY = 0
let cameraStartX = 0
let cameraStartY = 0
let cameraEndX = 0
let cameraEndY = 0

let realCameraX = 0
let realCameraY = 0
let realCameraStartX = 0
let realCameraStartY = 0
let realCameraEndX = 0
let realCameraEndY = 0

let tilesShift = 3

let cameraSpeed = 3//25//1000/tileSize
const cameraWidth = Math.floor(width/tileSize)
const cameraHeight = Math.floor(height/tileSize)
let realCameraWidth = Math.floor(width/tileSize-tilesShift*2)
let realCameraHeight = Math.floor(height/tileSize-tilesShift*2)

let left = false
let right = false
let up = false
let down = false

let tile
let map = []
for(let j = 0; j <= cameraHeight+3; j++){
	map[j] = []
}

let requested = false
const jbefore = document.getElementById('var-j-before')
const jafter = document.getElementById('var-j-after')
const ibefore = document.getElementById('var-i-before')
const iafter = document.getElementById('var-i-after')
let index = -1
let substep = 0
function step(){
	index++
	console.log(index, realCameraEndX -  realCameraStartX, realCameraWidth)	
	let x = index%(realCameraEndX - realCameraStartX)
	let y = (index-x)/(realCameraEndX - realCameraStartX)

	
	// substep++
	// if (substep >=2) {
	// 	substep = 0
	// }
	if(x === 0){
		jbefore.textContent = y
		jafter.textContent = y
		jbefore.classList.toggle('attention')
		jafter.classList.toggle('attention')
	}
	// switch(substep){
		// case 0: 
			ibefore.textContent = x
			iafter.textContent = x
			ibefore.classList.toggle('attention')
			iafter.classList.toggle('attention')
			// break
			
		// case 1: 
	// ibefore.textContent = index
	// iafter.textContent = index
			// ibefore.classList.remove('attention')
	/*		break

	}*/
}

function generateMap(cameraStartX,cameraStartY,cameraEndX,cameraEndY){
	for (let j = cameraStartY; j < cameraEndY; j++) {
		for (let i = cameraStartX; i < cameraEndX; i++) {
			
		}
	}
}
function drawTiles(cameraStartX,cameraStartY,cameraEndX,cameraEndY){
	ctx.strokeStyle = '#ccc'
	ctx.beginPath()
	for (let j = cameraStartY; j < cameraEndY; j++) {
		for (let i = cameraStartX; i < cameraEndX; i++) {
			let tileNumber = 0
			let x = i - cameraStartX+1
			let y = j - cameraStartY+1
			let tile = map[y][x]
			x = cameraX + i*tileSize //cameraX%tileSize+(i - cameraStartX)*tileSize
			y = cameraY + j*tileSize //%tileSize+(j - cameraStartY)*tileSize
			drawTile(0, x, y, tile,tileNumber)
		}
	}
	ctx.stroke()
	ctx.strokeStyle = 'black'

	let realIndex = 0
	for (let j = realCameraStartY+tilesShift; j < realCameraEndY+tilesShift-1; j++) {
		for (let i = realCameraStartX+tilesShift; i < realCameraEndX+tilesShift; i++) {
			if(realIndex>index) return;
			ctx.fillRect(realCameraX +i*tileSize+4, realCameraY +j*tileSize+4, tileSize-8, tileSize-8)
			ctx.strokeText(realIndex, realCameraX +i*tileSize+tileSize*.3, realCameraY +j*tileSize+tileSize*.6)
			realIndex++
		}
	}
}
function frame(){
	ctx.clearRect(0, 0, width, height)
	cameraStartX = Math.floor(-cameraX/tileSize)
	cameraStartY = Math.floor(-cameraY/tileSize)

	cameraEndX = cameraStartX + cameraWidth+2
	cameraEndY = cameraStartY + cameraHeight+3

	realCameraStartX = Math.floor(-realCameraX/tileSize)
	realCameraStartY = Math.floor(-realCameraY/tileSize)

	realCameraEndX = realCameraStartX + realCameraWidth+2-1
	realCameraEndY = realCameraStartY + realCameraHeight+3-1

	generateMap(cameraStartX,cameraStartY,cameraEndX+1,cameraEndY+1)
	drawTiles(cameraStartX,cameraStartY,cameraEndX-1,cameraEndY-1)
	ctx.save()
	ctx.beginPath()
	let shift = tilesShift*tileSize
	ctx.rect(shift, shift, width-shift*2, height-shift*2)
	ctx.strokeStyle	= 'black'
	ctx.stroke()
	ctx.restore()
	if(left) { cameraX += cameraSpeed }
	if(right) { cameraX -= cameraSpeed }
	if(up) { cameraY += cameraSpeed }
	if(down) { cameraY -= cameraSpeed }
	realCameraX = cameraX + tilesShift*tileSize
	realCameraY = cameraY + tilesShift*tileSize
	if(left||right||up||down){
		requestAnimationFrame(frame)
	} else {
		requested = false
	}
}
requestAnimationFrame(frame)
ctx.font = 'bold 25px Arial'
ctx.fillStyle = '#cccccc'
function drawTile(tile, x, y, landHeight, tileNumber){
	let sx = tile%6 
	let sy = (tile - sx)/6
//	ctx.fillStyle = colors[landHeight]
	//ctx.fillStyle = 'rgb('+ landHeight + ','+Math.abs(landHeight-128)+','+(255-landHeight)+')'
	ctx.rect(x+2,y+2,tileSize-4,tileSize-4)
	// ctx.drawImage(image, sx*32,sy*32,32,32, x,y,tileSize,tileSize)
	// ctx.fillText(landHeight, x,y+30)
	// ctx.strokeText(tileNumber, x+tileSize-30,y+30)
}
addEventListener('keydown', e=>{

	switch(e.code){
		case 'ArrowLeft':
			left = true
			break
		case 'ArrowRight':
			right = true
			break
		case 'ArrowUp':
			up = true
			break
		case 'ArrowDown':
			down = true
			break
		case 'Enter':
			index = (realCameraWidth+1) * (realCameraHeight+1)-2
		case 'Space':
			step()
			setTimeout(frame, 1000)
			return
			// stop = true
			// ctx.clearRect(0,0,width,height)
			break

		case 'NumpadSubtract':
			tilesShift++
			realCameraWidth = Math.floor(width/tileSize-tilesShift*2)
			realCameraHeight = Math.floor(height/tileSize-tilesShift*2)
			cameraSpeed *=0.8
			break
		case 'NumpadAdd':
			tilesShift--
			realCameraHeight = Math.floor(height/tileSize-tilesShift*2)
			realCameraWidth = Math.floor(width/tileSize-tilesShift*2)
			cameraSpeed *=1.25
			break
		// default: console.log(e)
	}
	if(!requested) {
		requested = true
		requestAnimationFrame(frame)
	}
})
addEventListener('keyup', e=>{
	switch(e.code){
		case 'ArrowLeft':
			left = false
			break
		case 'ArrowRight':
			right = false
			break
		case 'ArrowUp':
			up = false
			break
		case 'ArrowDown':
			down = false
			break
	}
})
