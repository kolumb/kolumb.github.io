'use strict';
const ctx = Canvas.getContext('2d')
const width = Canvas.width = innerWidth
const height = Canvas.height = innerHeight
ctx.imageSmoothingEnabled = false

// const generator = new SimplexNoise()
noise.seed(12)
const image = new Image()
image.src = 'tilesMy.png'
// image.src = 'tilesMyDebug.png'
image.onload = frame
let stop = false
const tileSize = 64//4
let cameraX = 0
let cameraY = 0
let cameraStartX = 0
let cameraStartY = 0
let cameraEndX = 0
let cameraEndY = 0
let cameraSpeed = 10//25//1000/tileSize
const cameraWidth = Math.floor(width/tileSize)
const cameraHeight = Math.floor(height/tileSize)

let left = false
let right = false
let up = false
let down = false
let amp1 = 1.3575684423767507//0.8429431933839281
let amp2 = 0.8685518813225763//0.26063974576578103
let amp3 = 1.1681121965556835//0.07363710208586136
let mainScale = 0.1//12//0.1
let scale1 = 50.6//116 * mainScale//50
let scale2 = 19.4//16 * mainScale
let scale3 = 8.4//6 * mainScale
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

colors[1+8] = '#1E4615'
colors[1+16] = '#FF0000'
colors[1+32] = '#1B8333'
colors[2+8] = '#7EFF00'
colors[2+16] = '#FF9E2B'
colors[2+32] = '#001EFF'
colors[4+8] = '#7E00FF'
colors[4+16] = '#924705'
colors[4+32] = '#FFFFFF'

/*
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
*/
/*
7	3	11	
5	15	10	1	2
13	12	14	4	8	0

0	1	2
6	7	8	9	10
12	13	14	15	16	17


00	00	00
01	11	10

01	11	10	 	11	11
01	11	10 		10	01

01	11	10 		10	01	 	00
00	00	00 		11	11 		00


1	3	2
5	15	10		14	13
4	12	8		11	7		0

0,  1,  2, 			 				3,  4,  5,
6,  7,  8,  	9, 10,						11,
12, 13, 14, 	15, 16, 	17
	*/
			// 0, 1, 2,  3,  4, 5, 6,  7,  8, 9,10,11, 12, 13,14,15, 16, 17
const tiles = [17, 0, 2, 1, 12, 6, 3, 16, 14, 4, 8,15, 13, 10, 9, 7, -1, -1,
			   35, 18,20,19,30,24,21, 34, 32,22,26,33, 31, 28,27,35, -1, -1]

//const tiles = [17, 9, 15, 7, 15, 6, -1, 0, 10, -1, 8, 11, 13, 12, 14, 1, -1, -1]
let tile
let map = []
for(let j = 0; j <= cameraHeight+3; j++){
	map[j] = []
}
let fix = false
const fixContrast = function(i,j){
	let x = i - cameraStartX+1
	let y = j - cameraStartY+1
	if(!map[y]||!map[y-1]||!map[y+1]) return
	let tile = map[y][x]
	let leftTile = map[y][x-1] - tile
	let rightTile = map[y][x+1] - tile
	let bottomTile = map[y+1][x] - tile
	let topTile = map[y-1][x] - tile
	let topRightTile = map[y-1][x+1] - tile
	let bottomRightTile = map[y+1][x+1] - tile
	let bottomLeftTile = map[y+1][x-1] - tile
	let topLeftTile = map[y-1][x-1] - tile
	let min = Math.min(leftTile,rightTile,bottomTile,topTile,
		topRightTile,bottomRightTile,bottomLeftTile,topLeftTile)
	if(min<-1){
		map[y][x]+=min+1
		//drawTile(5, cameraX + i*tileSize, cameraY + j*tileSize, map[y][x],0)
		fixContrast(i-1,j)
		fixContrast(i+1,j)
		fixContrast(i,j-1)
		fixContrast(i,j+1)
		fixContrast(i+1,j-1)
		fixContrast(i+1,j+1)
		fixContrast(i-1,j+1)
		fixContrast(i-1,j-1)
	}
}

function generateMap(cameraStartX,cameraStartY,cameraEndX,cameraEndY){
	for (let j = cameraStartY; j < cameraEndY; j++) {
		for (let i = cameraStartX; i < cameraEndX; i++) {
			//let tile = i*30+j
			// g1 = generator.noise(i/scale4, j/scale4)
			// g2 = generator.noise((i+1000)/scale3, j/scale3)
			// g3 = generator.noise(i/scale2, (j+1000)/scale2)
			// g4 = generator.noise((i+1000)/scale1, (j+1000)/scale1)
			// g1 = noise.simplex2(i/scale4, j/scale4)
			// g2 = noise.simplex2((i+1000)/scale3, j/scale3)
			// g3 = noise.simplex2(i/scale2, (j+1000)/scale2)
			// g4 = noise.simplex2((i+1000)/scale1, (j+1000)/scale1)
			//let max = g1>g2 ? g1:g2
			//	max = max>g3 ? max:g3
	/*		if(g1>g2){
				if(g1>g3){
					max = 1
				} else {
					max = 4
				}
			} else {
				if(g2>g3){
					max = 2
				} else {
					max = 1
				}
			}
			if(g1<g2){
				if(g1<g3){
					min = 8
				} else {
					min = 32
				}

			} else {
				if(g2>g3){
					min = 16
				} else {
					min = 32
				}
			}
	*/
	/*		if(g1>g2){
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
	*/
	//		tile = (min + max)//48
	

			tile = noise.simplex2(i/scale1, j/scale1)
					//generator.noise(i/40, j/40)
			tile = (amp1*tile
				+
				amp2*noise.simplex2(i/scale2, j/scale2)
				+
				amp3*noise.simplex2(i/scale3, j/scale3))*Math.abs(tile)
	

			// if(generator.noise(i/116, j/116)<0.4){
					//tile =Math.abs(generator.noise(i/116, j/116))
			// }
			tile = Math.floor(tile*3+2	)
			map[j - cameraStartY][i - cameraStartX] = tile
		
	//		map[j - cameraStartY][i - cameraStartX] = tile
		//	tile = tiles[tile]
			//tile = colors[tile]
			//tile = Math.floor(128*tile+128)
			/*forest = 0
			if(tile<seaLevel){
				tile = 0
			} else if(tile> 200) {
				tile = 255
			} else if(generator.noise(i/60,j/60)+0.8*generator.noise(i/20,j/20)>0.25){
				forest = 200
			}*/
			
		}
	}
}
function fixTiles(cameraStartX,cameraStartY,cameraEndX,cameraEndY){
	for (let j = cameraStartY; j < cameraEndY; j++) {
		for (let i = cameraStartX; i < cameraEndX; i++) {
			fixContrast(i,j)
		}
	}
}
function drawTiles(cameraStartX,cameraStartY,cameraEndX,cameraEndY){
	for (let j = cameraStartY; j < cameraEndY; j++) {
		for (let i = cameraStartX; i < cameraEndX; i++) {
			let tileNumber = 0
			let x = i - cameraStartX+1
			let y = j - cameraStartY+1
			let tile = map[y][x]
			let leftTile = map[y][x-1]
			let rightTile = map[y][x+1]
			let bottomTile = map[y+1][x]
			let topTile = map[y-1][x]
			let topRightTile = map[y-1][x+1]
			let bottomRightTile = map[y+1][x+1]
			let bottomLeftTile = map[y+1][x-1]
			let topLeftTile = map[y-1][x-1]
			if(leftTile>=tile){
				if(topTile>=tile){
					if(topLeftTile>=tile){
						tileNumber += 8
					}
				}
				if(bottomTile>=tile){
					if(bottomLeftTile>=tile){
						tileNumber += 2
					}
				}
			}
			if(rightTile>=tile){
				if(topTile>=tile){
					if(topRightTile>=tile){
						tileNumber += 4
					}
				}
				if(bottomTile>=tile){
					if(bottomRightTile>=tile){
						tileNumber += 1
					}
				}
			}

			//console.log(tileNumber,i,j)
			x = cameraX + i*tileSize //cameraX%tileSize+(i - cameraStartX)*tileSize
			y = cameraY + j*tileSize //%tileSize+(j - cameraStartY)*tileSize
			//console.log(tiles[tileNumber],x,y)
			//console.log(tileNumber)
			if(tile<2){
				tileNumber+=18
				//tile = 1
			}
			drawTile(tiles[tileNumber], x, y, tile,tileNumber)
		}
	}
}
function frame(){
	//requested = false
	//if(stop) {return}
	cameraStartX = Math.floor(-cameraX/tileSize)
	cameraStartY = Math.floor(-cameraY/tileSize)

	cameraEndX = cameraStartX + cameraWidth+2
	cameraEndY = cameraStartY + cameraHeight+3
	if(fix){
		fix = false
		generateMap(cameraStartX,cameraStartY,cameraEndX+1,cameraEndY+1)
		drawTiles(cameraStartX,cameraStartY,cameraEndX-1,cameraEndY-1)
	} else {
		generateMap(cameraStartX,cameraStartY,cameraEndX+1,cameraEndY+1)
		fixTiles(cameraStartX,cameraStartY,cameraEndX-1,cameraEndY-1)
		drawTiles(cameraStartX,cameraStartY,cameraEndX-1,cameraEndY-1)
	}
	
	if(left) { cameraX += cameraSpeed }
	if(right) { cameraX -= cameraSpeed }
	if(up) { cameraY += cameraSpeed }
	if(down) { cameraY -= cameraSpeed }
	if(left||right||up||down){
		requestAnimationFrame(frame)
	} else {
		requested = false
	}
}
requestAnimationFrame(frame)
ctx.font = 'bold 25px Arial'
ctx.fillStyle = 'magenta'
function drawTile(tile, x, y, landHeight, tileNumber){
	if(landHeight ===1 && tileNumber === 33){
		tile = 17
	} else if(landHeight < 1) {
		tile = 35
	} else if(landHeight > 2) {
		tile = 7
	}
	let sx = tile%6 
	let sy = (tile - sx)/6
//	ctx.fillStyle = colors[landHeight]
	//ctx.fillStyle = 'rgb('+ landHeight + ','+Math.abs(landHeight-128)+','+(255-landHeight)+')'
//	ctx.fillRect(x,y,tileSize,tileSize)
	ctx.drawImage(image, sx*32,sy*32,32,32, x,y,tileSize,tileSize)
	// ctx.fillText(landHeight, x,y+30)
	// ctx.strokeText(tileNumber, x+tileSize-30,y+30)
}
/*
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
*/
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
			fix = true
			// stop = true
			// ctx.clearRect(0,0,width,height)
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


/*
perlin.js
3050.9999999776483 "ended"
2807.0000000298023 "ended"
2794.999999925494 "ended"
3286.0000000800937 "ended"
2940.999999875203 "ended"

perlin-noise.js
2854.9999999813735 "ended"
2647.0000001136214 "ended"
2729.0000000502914 "ended"
2702.000000048429 "ended"
2887.000000104308 "ended"
2790.999999968335 "ended"​
	without breacking the loop
3095.9999999031425 "ended"
2913.99999987334 "ended"
3054.0000000037253 "ended"
*/