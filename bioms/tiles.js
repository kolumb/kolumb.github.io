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
const tileSize = 2
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
let mainScale = 12
let scale1 = 50 * mainScale//116
let scale2 = 16 * mainScale
let scale3 = 6 * mainScale
let scale4 = 3 * mainScale
let seaLevel = 100
let forest = 200
let flat = 0
//window.setInterval(frame,1000)
//setTimeout(frame,100)
let requested = false
let max
let min
let g1
let g2
let g3
let g4
const colors = [0]
const part = 255/12

colors[1+32] = '#1E4615'//part*0 Blue 	0 1 2 черный
colors[1+64] = '#7A0000'//part*1		1 1 3 бордовый
colors[1+128] = '#FF0000'//part*2		2 1 4 красный 		горячий

colors[2+16] = '#1B8333'//part*3		3 2 1 оранжевый(желтый)
colors[2+64] = '#7EFF00' //part*4 mid	4 2 3 салатовый
colors[2+128] = '#FF9E2B'//part*5		5 2 4 голубой		горячий

colors[4+16] = '#001EFF'//part*6		6 3 1 синий
colors[4+32] = '#7E00FF'//part*7		7 3 2 фиолетовый
colors[4+128] = '#924705'//part*8 Red	8 3 4 лиловый		горячий

colors[8+16] = '#515151'//part*9		9 4 1 светлосерый	берег к синему
colors[8+32] = '#A4A4A4'//part*10 mid	а 4 2 темносерый	холодный
colors[8+64] = '#FFFFFF'//part*11		б 4 3 белый			холодный

/*369
3685
67a9
9ab
01b9
14b
34b9
345
1254
258
01ba
07a
012
0287
3586
678*/
let tile

requestAnimationFrame(frame)
function frame(){
	requested = false
	//console.log('q')
	//if(stop) {return}
	//t+=0.005
	cameraStartX = Math.floor(-cameraX/tileSize)
	cameraStartY = Math.floor(-cameraY/tileSize)
	cameraEndX = cameraStartX + cameraWidth+1
	cameraEndY = cameraStartY + cameraHeight+1
	for (let j = cameraStartY; j < cameraEndY; j++) {
		for (let i = cameraStartX; i < cameraEndX; i++) {
			//let tile = i*30+j
			g1 = generator.noise(i/scale4, j/scale4)
			g2 = generator.noise((i+1000)/scale3, j/scale3)
			g3 = generator.noise(i/scale2, (j+1000)/scale2)
			g4 = generator.noise((i+1000)/scale1, (j+1000)/scale1)
			//let max = g1>g2 ? g1:g2
			//	max = max>g3 ? max:g3
			if(g1>g2){
				if(g1>g3){
					if(g1>g4){
						max = 1
					} else {
						max = 8
					}
				} else {
					if(g3>g4){
						max = 4
					} else {
						max = 8
					}
				}
			} else {
				if(g2>g3){
					if(g2>g4){
						max = 2
					} else {
						max = 8
					}
				} else {
					if(g3>g4){
						max = 4
					} else {
						max = 8
					}
				}
			}
			//let min = g1<g2 ? g1:g2
			//	min = min<g3 ? min:g3
			if(g1<g2){
				if(g1<g3){
					if(g1<g4){
						min = 16
					} else {
						min = 128
					}
				} else {
					if(g3<g4){
						min = 64
					} else {
						min = 128
					}
				}
			} else {
				if(g2<g3){
					if(g2<g4){
						min = 32
					} else {
						min = 128
					}
				} else {
					if(g3<g4){
						min = 64
					} else {
						min = 128
					}
				}
			}
				
			tile = (min + max)//48
/*
			let tile = generator.noise(i/scale1, j/scale1)
					//generator.noise(i/40, j/40)
			tile = (amp1*tile
				+
				amp2*generator.noise(i/scale2, j/scale2)
				+
				amp3*generator.noise(i/scale3, j/scale3))*Math.abs(tile)
*/

			// if(generator.noise(i/116, j/116)<0.4){
					//tile =Math.abs(generator.noise(i/116, j/116))
			// }
			tile = colors[tile]//Math.floor(128*tile+128)
			/*forest = 0
			if(tile<seaLevel){
				tile = 0
			} else if(tile> 200) {
				tile = 255
			} else if(generator.noise(i/60,j/60)+0.8*generator.noise(i/20,j/20)>0.25){
				forest = 200
			}*/

			let x = cameraX + i*tileSize //cameraX%tileSize+(i - cameraStartX)*tileSize
			let y = cameraY + j*tileSize //%tileSize+(j - cameraStartY)*tileSize
			drawTile(tile, x, y)
			
		}
	}
	//console.log(min + max)
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
	ctx.fillStyle = tile
	//ctx.fillStyle = 'rgb('+ tile + ','+Math.abs(tile-128)+','+(255-tile)+')'
	ctx.fillRect(x,y,tileSize,tileSize)
	//ctx.drawImage(image, sx*32,sy*32,32,32, x,y,32,32)
}
window.addEventListener('click', e=>{
	let i = (e.clientX - e.clientX%tileSize)/tileSize
	let j = (e.clientY - e.clientY%tileSize)/tileSize
	g1 = generator.noise(i/scale3, j/scale3)
			g2 = generator.noise((i+1000)/scale2, j/scale2)
			g3 = generator.noise(i/scale1, (j+1000)/scale1)
			g4 = generator.noise((i+1000)/scale1, (j+1000)/scale1)
	console.log(g1.toFixed(3),g2.toFixed(3),g3.toFixed(3),g4.toFixed(3))
	//stop = !stop
	//frame()
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
/*		case 'Space':
			stop = true
			ctx.clearRect(0,0,width,height)
			break*/
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