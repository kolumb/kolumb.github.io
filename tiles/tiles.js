'use strict';
const ctx = Canvas.getContext('2d')
const width = Canvas.width = innerWidth
const height = Canvas.height = innerHeight

const generator = new SimplexNoise()
const image = new Image()
image.src = 'tiles.png'
image.onload = frame
let stop = false
let t = 5
const tileSize = 16
let cameraX = 0
let cameraY = 0
let cameraStartX = 0
let cameraStartY = 0
let cameraEndX = 0
let cameraEndY = 0
let cameraSpeed = 25
const cameraWidth = Math.floor(width/tileSize)
const cameraHeight = Math.floor(height/tileSize)
let left = false
let right = false
let up = false
let down = false
let amp1 = 0.8429431933839281
let amp2 = 0.26063974576578103
let amp3 = 0.07363710208586136 //0.07363710208586136
let scale1 = 116
let scale2 = 16
let scale3 = 6
let seaLevel = 100
let forest = 0
let flat = 0
//window.setInterval(frame,1000)
//setTimeout(frame,100)
let requested = false

requestAnimationFrame(frame)
function frame(){
	requested = false
	//console.log('q')
	if(stop) {return}
	
	//t+=0.005
	cameraStartX = Math.floor(-cameraX/tileSize)
	cameraStartY = Math.floor(-cameraY/tileSize)
	cameraEndX = cameraStartX + cameraWidth+1
	cameraEndY = cameraStartY + cameraHeight+1
	for (var j = cameraStartY; j < cameraEndY; j++) {
		for (var i = cameraStartX; i < cameraEndX; i++) {
			//let tile = i*30+j

			let tile = generator.noise(i/scale1, j/scale1)
					//generator.noise(i/40, j/40)
			tile = (amp1*tile
				+
				amp2*generator.noise(i/scale2, j/scale2)
				+
				amp3*generator.noise(i/scale3, j/scale3))*Math.abs(tile)


			// if(generator.noise(i/116, j/116)<0.4){
					//tile =Math.abs(generator.noise(i/116, j/116))
			// }
			tile = Math.floor(128*tile+128)
			forest = 0
			if(tile<seaLevel){
				tile = 0
			} else if(tile> 200) {
				tile = 255
			} else if(generator.noise(i/60,j/60)+0.8*generator.noise(i/20,j/20)>0.25){
				forest = 200
			}

			let x = cameraX + i*tileSize //cameraX%tileSize+(i - cameraStartX)*tileSize
			let y = cameraY + j*tileSize //%tileSize+(j - cameraStartY)*tileSize
			drawTile(tile, x, y)
			
		}
	}
	//requestAnimationFrame(frame)
	if(left) {
		cameraX += cameraSpeed
		if(!requested){
			requested = true
		}
	}
	if(right) {
		cameraX -= cameraSpeed
		if(!requested){
			requested = true
		}
	}
	if(up) {
		cameraY += cameraSpeed
		if(!requested){
			requested = true
		}
	}
	if(down) {
		cameraY -= cameraSpeed
		if(!requested){
			requested = true
		}
	}
	if(requested){
		requestAnimationFrame(frame)
	}
}
function drawTile(tile, x, y){
	//let sy = tile%30
	//let sx = (tile - sy)/30
	ctx.fillStyle = 'rgb('+ tile + ','+forest+','+tile+')'
	ctx.fillRect(x,y,tileSize,tileSize)
	//ctx.drawImage(image, sx*32,sy*32,32,32, x,y,32,32)
}
window.addEventListener('click', function(){
	stop = !stop
	frame()
})
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
		case 'Space':
			stop = true
			ctx.clearRect(0,0,width,height)
			break
		case 'KeyQ':
			amp1 *=1.1
			break
		case 'KeyW':
			amp1 *=0.9
			break
		case 'KeyE':
			scale1++
			break
		case 'KeyR':
			scale1--
			break

		case 'KeyA':
			amp2 *=1.1
			break
		case 'KeyS':
			amp2 *=0.9
			break
		case 'KeyD':
			scale2++
			break
		case 'KeyF':
			scale2--
			break

		case 'KeyZ':
			amp3 *=1.1
			break
		case 'KeyX':
			amp3 *=0.9
			break
		case 'KeyC':
			scale3++
			break
		case 'KeyV':
			scale3--
			break

		case 'KeyT':
			seaLevel++
			break
		case 'KeyY':
			seaLevel--
			break

		case 'NumpadSubtract':
			cameraSpeed *=0.8
			break
		case 'NumpadAdd':
			cameraSpeed *=1.25
			break
		// default: console.log(e)
	}
	if(!requested) {
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