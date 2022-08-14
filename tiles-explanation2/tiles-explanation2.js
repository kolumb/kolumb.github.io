'use strict';
const ctx = Canvas.getContext('2d')
const width = Canvas.width = innerWidth
const height = Canvas.height = innerHeight
//ctx.imageSmoothingEnabled = false

const tileSize = 64//4
let tilesShift = 3
let cameraX = -tilesShift*tileSize
let cameraY = -tilesShift*tileSize
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

const cameraSX = document.getElementById('cameraSX')
const cameraSY = document.getElementById('cameraSY')
const cameraEX = document.getElementById('cameraEX')
const cameraEXY = document.getElementById('cameraEY')

let index = -1
let substep = 0
function step(){
	let x = index%(realCameraEndX - realCameraStartX)
	let y = (index-x)/(realCameraEndX - realCameraStartX)

	if(index<0){
		jbefore.textContent = jafter.textContent = cameraStartY-tilesShift
		ibefore.textContent = iafter.textContent = cameraStartX-tilesShift

	} else {
		jbefore.textContent = jafter.textContent = y+cameraStartY-tilesShift
		ibefore.textContent = iafter.textContent = x+cameraStartX-tilesShift
	}
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
			let x = cameraX + i*tileSize //cameraX%tileSize+(i - cameraStartX)*tileSize
			let y = cameraY + j*tileSize //%tileSize+(j - cameraStartY)*tileSize
			drawTile(0, x, y, tile,0)
		}
	}
	ctx.stroke()
	ctx.strokeStyle = 'black'

	if(index < 0) return;
	let realIndex = 0
	for (let j = realCameraStartY+tilesShift; j < realCameraEndY+tilesShift-1; j++) {
		for (let i = realCameraStartX+tilesShift; i < realCameraEndX+tilesShift; i++) {
			if(realIndex>index) return;
			ctx.fillStyle = '#ccc'
			ctx.fillRect(realCameraX +i*tileSize+4, realCameraY +j*tileSize+4, tileSize-8, tileSize-8)
			ctx.fillStyle = '#07b'
			ctx.fillText((i-tilesShift), realCameraX +i*tileSize+tileSize*.1, realCameraY +j*tileSize+tileSize*.6)
			ctx.fillStyle = '#5a7'
			ctx.fillText((j-tilesShift), realCameraX +i*tileSize+tileSize*.6, realCameraY +j*tileSize+tileSize*.6)
			realIndex++
		}
	}
}
function frame(){
			step()

	ctx.clearRect(0, 0, width, height)
	cameraStartX = Math.floor(-cameraX/tileSize)
	cameraStartY = Math.floor(-cameraY/tileSize)

	cameraEndX = cameraStartX + cameraWidth+2
	cameraEndY = cameraStartY + cameraHeight+3

	realCameraStartX = Math.floor(-realCameraX/tileSize)
	realCameraStartY = Math.floor(-realCameraY/tileSize)
	cameraSX.textContent = realCameraStartX
	cameraSY.textContent = realCameraStartY

	realCameraEndX = realCameraStartX + realCameraWidth+2-1
	realCameraEndY = realCameraStartY + realCameraHeight+3-1
	cameraEX.textContent = realCameraEndX
	cameraEY.textContent = realCameraEndY

	generateMap(cameraStartX,cameraStartY,cameraEndX+1,cameraEndY+1)
	drawTiles(cameraStartX,cameraStartY,cameraEndX-1,cameraEndY-1)
	ctx.save()
	ctx.beginPath()
	let shift = tilesShift*tileSize
	ctx.rect(shift, shift, realCameraWidth*tileSize, realCameraHeight*tileSize)
	ctx.strokeStyle	= 'black'
	ctx.moveTo(cameraX+6*tilesShift*tileSize-tileSize,cameraY+2*tilesShift*tileSize-0.5*tileSize)
	ctx.lineTo(cameraX+6*tilesShift*tileSize,cameraY+2*tilesShift*tileSize)
	ctx.lineTo(cameraX+6*tilesShift*tileSize-tileSize,cameraY+2*tilesShift*tileSize+0.5*tileSize)
	ctx.moveTo(cameraX+6*tilesShift*tileSize,cameraY+2*tilesShift*tileSize)
	ctx.lineTo(cameraX+2*tilesShift*tileSize,cameraY+2*tilesShift*tileSize)
	ctx.lineTo(cameraX+2*tilesShift*tileSize,cameraY+4*tilesShift*tileSize)
	ctx.lineTo(cameraX+2*tilesShift*tileSize-0.5*tileSize,cameraY+4*tilesShift*tileSize-tileSize)
	ctx.moveTo(cameraX+2*tilesShift*tileSize,cameraY+4*tilesShift*tileSize)
	ctx.lineTo(cameraX+2*tilesShift*tileSize+0.5*tileSize,cameraY+4*tilesShift*tileSize-tileSize)
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
setTimeout(frame, 10)
ctx.font = 'bold 20px Arial'
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
			index = -2
			document.body.classList.toggle('enabled')
			setTimeout(()=>document.body.classList.toggle('enabled'),10)
			
		case 'Space':
			if(index === (realCameraWidth+1) * (realCameraHeight+1)-1) return;
			index++
			if(e.shiftKey) index = (realCameraWidth+1) * (realCameraHeight+1)-1
			break

		case 'NumpadSubtract':
			if(e.shiftKey){
				cameraSpeed *=0.8
			} else {
				tilesShift++
				realCameraWidth = Math.floor(width/tileSize-tilesShift*2)
				realCameraHeight = Math.floor(height/tileSize-tilesShift*2)
			}
			break
		case 'NumpadAdd':
			if(e.shiftKey){
				cameraSpeed *=1.25
			} else {
				tilesShift--
				realCameraWidth = Math.floor(width/tileSize-tilesShift*2)
				realCameraHeight = Math.floor(height/tileSize-tilesShift*2)
			}
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
