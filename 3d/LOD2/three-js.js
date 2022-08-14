'use strict'
var stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
console.log(stats.domElement)
FPSmeter.appendChild( stats.domElement )
const width = window.innerWidth
const height = window.innerHeight
const canvas = document.getElementById('myCanvas')

var renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true})
renderer.setClearColor(0xF3EFB2	)//2277FF)
renderer.setSize(width, height)
// renderer.shadowMap.enabled = true
// renderer.shadowMap.type = THREE.PCFSoftShadowMap

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 4096)
camera.position.set(-40, 0, 20)
camera.rotation.set(0,-.1-Math.PI/2.5,-Math.PI/2)



let playerTurnSpeed = 0.02
const turnLeft = new THREE.Quaternion()
turnLeft.setFromEuler(new THREE.Euler(0, 0, playerTurnSpeed))
const turnRight = new THREE.Quaternion()
turnRight.setFromEuler(new THREE.Euler(0, 0, -playerTurnSpeed))

const turnUp = new THREE.Quaternion()
turnUp.setFromEuler(new THREE.Euler(playerTurnSpeed, 0, 0))
const turnDown = new THREE.Quaternion()
turnDown.setFromEuler(new THREE.Euler(-playerTurnSpeed, 0, 0))

let keyForward = false, keyRight = false, keyBackward = false, keyLeft = false, keyUp = false, keyDown = false, keyTurnLeft = false, keyTurnRight = false, keyTurnUp = false, keyTurnDown = false


const player = new THREE.Mesh(
	new THREE.BoxGeometry(1.75, 1.75, 1.75)
	, new THREE.MeshLambertMaterial({color: 0x778899})
)
player.position.z = 40.5
player.rotation.z = 1
player.castShadow = true
player.receiveShadow = true
player.add(camera)
scene.add(player)


const landArr = []

const resol = 40//20 // 10
const spacing = 12//200
let cellSize = resol * spacing - spacing
let viewDist = 7
let squaredVievDist = Math.pow(cellSize*viewDist, 2)
scene.fog = new THREE.Fog( 0xF3EFB2, cellSize*viewDist*.6, cellSize*viewDist*1.05 )
let playerSpeed = cellSize/40
/*
20	1
40	2
*/

const noiseScale = 0.2/resol//0.4/resol//0.02 //0.01
const noiseScale2 = noiseScale*4
const noiseScale4 = noiseScale2*2
const noiseScale8 = noiseScale4*2
const noiseAmp = spacing/2*5*resol/10//spacing/2*5*resol/20//500
const noiseAmp2 = noiseAmp/8
const noiseAmp4 = noiseAmp2/8
const noiseAmp8 = noiseAmp4

function R(h) {
		var W = 0.4	; // width of terracing bands
		var k = Math.floor(h / W);
		var f = (h - k*W) / W;
		var s = Math.min(2 * f, 1.0);
		return (k+s) * W;
}
const materialLand = new THREE.MeshLambertMaterial({color: 0xF3EFB2,	 wireframe:false})//, side:THREE.DoubleSide})
function Land(n, m){
	const xx = n*resol
	const yy = m*resol
	const verticesArray = []
	const indices = new Uint16Array(resol*resol*6)
	let tempArr = []
	let checkered = Math.abs(n%2) ^ Math.abs(m%2)
	for(let j = 0; j<resol; j++){
		checkered = !checkered

		let jj = j + yy-m
		for(let i = 0; i<resol; i++){		
			let ii = i + xx-n
			const tempMainNoise = Math.min(noise.simplex2(ii*noiseScale, jj*noiseScale), noise.simplex2(ii*noiseScale+100, jj*noiseScale+100))
			tempArr[i] = noiseAmp*tempMainNoise*tempMainNoise//*tempMainNoise
				- Math.abs(noiseAmp2*noise.simplex2(ii*noiseScale2, jj*noiseScale2)) //- noiseAmp2/2
				+ noiseAmp4*noise.simplex2(ii*noiseScale4, jj*noiseScale4)
				+ noiseAmp8*noise.simplex2(ii*noiseScale8, jj*noiseScale8)

		}
		for(let i = 0; i<resol; i++){
			checkered = !checkered
			let x = i * spacing
			let y = j * spacing
			verticesArray.push(x); verticesArray.push(y); if(tempArr[i]<0){verticesArray.push(0)} else {verticesArray.push(tempArr[i])}
			if(i === resol-1 || j === resol-1){
				continue
			}
			let cur = (j*resol + i)*6

			if(checkered){
				indices[cur] = j*resol + i
				indices[cur+1] = j*resol + i+1
				indices[cur+2] = (j+1)*resol + i+1
				indices[cur+3] = j*resol + i
				indices[cur+4] = (j+1)*resol + i+1
				indices[cur+5] = (j+1)*resol + i
			} else {
				indices[cur] = j*resol + i
				indices[cur+1] = j*resol + i+1
				indices[cur+2] = (j+1)*resol + i
				indices[cur+3] = j*resol + i+1
				indices[cur+4] = (j+1)*resol + i+1
				indices[cur+5] = (j+1)*resol + i				
			}
		}
	}
	const geometryLand = new THREE.BufferGeometry()
	const vertices = new Float32Array( verticesArray )
	geometryLand.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )
	// geometryLand.setIndex([0,1,2, 2,3,0])
	geometryLand.setIndex(new THREE.BufferAttribute(indices, 1))
	// geometryLand.mergeVertices()
	geometryLand.computeFaceNormals()
	geometryLand.computeVertexNormals(true)
	const meshLand = new THREE.Mesh(geometryLand, materialLand)
	meshLand.castShadow = true
	meshLand.receiveShadow = true
	scene.add(meshLand)
	return meshLand
}
const materialLand2 = new THREE.MeshLambertMaterial({color: 0xd3EFB2,	 wireframe:false})
function Land2(n, m, u, v, resol){
	const xx = n*resol
	const yy = m*resol
	const verticesArray = []
	const indices = new Uint16Array(resol*resol*6)
	let tempArr = []
	//let checkered = Math.abs(n%2) ^ Math.abs(m%2)
	for(let j = 0; j<resol; j++){
		//checkered = !checkered

		let jj = j + yy-m
		for(let i = 0; i<resol; i++){		
			let ii = i + xx-n
			const tempMainNoise = Math.min(noise.simplex2(ii*noiseScale, jj*noiseScale), noise.simplex2(ii*noiseScale+100, jj*noiseScale+100))
			tempArr[i] = noiseAmp*tempMainNoise*tempMainNoise//*tempMainNoise
				- Math.abs(noiseAmp2*noise.simplex2(ii*noiseScale2, jj*noiseScale2)) //- noiseAmp2/2
				+ noiseAmp4*noise.simplex2(ii*noiseScale4, jj*noiseScale4)

		}
		for(let i = 0; i<resol; i++){
			//checkered = !checkered
			let x = i * spacing
			let y = j * spacing
			verticesArray.push(x); verticesArray.push(y); if(tempArr[i]<0){verticesArray.push(0)} else {verticesArray.push(tempArr[i])}
			if(i === resol-1 || j === resol-1){
				continue
			}
			let cur = (j*resol + i)*6

			//if(checkered){
				indices[cur] = j*resol + i
				indices[cur+1] = j*resol + i+1
				indices[cur+2] = (j+1)*resol + i+1
				indices[cur+3] = j*resol + i
				indices[cur+4] = (j+1)*resol + i+1
				indices[cur+5] = (j+1)*resol + i
			/*} else {
				indices[cur] = j*resol + i
				indices[cur+1] = j*resol + i+1
				indices[cur+2] = (j+1)*resol + i
				indices[cur+3] = j*resol + i+1
				indices[cur+4] = (j+1)*resol + i+1
				indices[cur+5] = (j+1)*resol + i				
			}*/
		}
	}
	const geometryLand = new THREE.BufferGeometry()
	const vertices = new Float32Array( verticesArray )
	geometryLand.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) )
	// geometryLand.setIndex([0,1,2, 2,3,0])
	geometryLand.setIndex(new THREE.BufferAttribute(indices, 1))
	// geometryLand.mergeVertices()
	geometryLand.computeFaceNormals()
	geometryLand.computeVertexNormals(true)
	const meshLand = new THREE.Mesh(geometryLand, materialLand2)
	meshLand.castShadow = true
	meshLand.receiveShadow = true
	scene.add(meshLand)
	return meshLand
}





var lightAmbient = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(lightAmbient)

var light = new THREE.DirectionalLight(0xffffff, 0.5)
light.position.set(-100, 0, 100)
light.rotation.set(-Math.PI/2,-Math.PI/3,0)	

// light.rotation.set(0,Math.PI/3, 0)
// light.position.z = 500
// light.position.x = 300
// light.position.y = -200
// light.target = mesh
// light.castShadow = true
// light.shadow = new THREE.LightShadow(new THREE.OrthographicCamera(-64, 64, 64, -64, 1, 1024))
// light.shadow.bias = 0.0001
// light.shadow.mapSize.width = 512
// light.shadow.mapSize.height = 512
scene.add(light)


let changed = false
let requested = false
function render () {
  stats.begin()
	if (keyForward){
		player.position.y += playerSpeed*Math.sin(player.rotation._z)
		player.position.x += playerSpeed*Math.cos(player.rotation._z)
	}
	if (keyRight){
		player.position.y += playerSpeed*Math.sin(player.rotation._z-Math.PI/2)
		player.position.x += playerSpeed*Math.cos(player.rotation._z-Math.PI/2)
	}
	if (keyBackward){
		player.position.y -= playerSpeed*Math.sin(player.rotation._z)
		player.position.x -= playerSpeed*Math.cos(player.rotation._z)
	}
	if (keyLeft){
		player.position.y += playerSpeed*Math.sin(player.rotation._z+Math.PI/2)
		player.position.x += playerSpeed*Math.cos(player.rotation._z+Math.PI/2)
	}
	if (keyUp){
		player.position.z += playerSpeed
	}
	if (keyDown){
		player.position.z -= playerSpeed
	}
	if (keyTurnLeft){
		player.rotation._z += playerTurnSpeed
		player.rotation.onChangeCallback()
	}
	if (keyTurnRight){
		player.rotation._z -= playerTurnSpeed
		player.rotation.onChangeCallback()
	}
	let x = Math.floor(player.position.x/cellSize)
	let y = Math.floor(player.position.y/cellSize)
	
	for(let i = x - viewDist; i <= x + viewDist; i++){
		for(let j = y - viewDist; j <= y + viewDist; j++){
			let landPiece = landArr[i + ',' + j]
			if(!landPiece){
				const cellX = i*cellSize - player.position.x
				const cellY = j*cellSize - player.position.y
				if(cellX*cellX + cellY*cellY<squaredVievDist){
					landPiece = new Land(i, j)
					landArr[i + ',' + j] = landPiece
					landPiece.position.set(i*cellSize, j*cellSize, 0)
				} else {
					continue
				}
			}			
			if(player.position.distanceTo(landPiece.position) < 2*cellSize){
				landPiece.material = materialLand2
				//landPiece = new Land(i, j)
				//landArr[i + ',' + j] = landPiece
				//landPiece.position.set(i*cellSize, j*cellSize, 0)
			}
			
		}
	}
	renderer.render(scene, camera)
	if (keyForward || keyRight || keyBackward || keyLeft || keyUp || keyDown ||
		keyTurnLeft || keyTurnRight || keyTurnUp || keyTurnDown){
		requestAnimationFrame(render)
	} else {
		requested = false
	}
  stats.end()
}

render()

setInterval(()=>{
	let x = Math.floor(player.position.x/cellSize)
	let y = Math.floor(player.position.y/cellSize)
	// console.log(x,y)
	Object.keys(landArr).forEach(key => {
		let landPiece = landArr[key]
		let lx = Math.floor(landPiece.position.x/cellSize)
		let ly = Math.floor(landPiece.position.y/cellSize)
		if(lx < x - viewDist-1 ||
			lx > x + viewDist+1 ||
			ly < y - viewDist-1 ||
			ly > y + viewDist+1){
			scene.remove(landPiece)
			delete landArr[key]
			//landPiece.position.z += 1
			//console.log('deleted ' + key)
		}
	})
}, 1000)

addEventListener('keydown', (e) => {
	switch (e.code) {
	case 'KeyP':
		light.position.y += cameraSpeed
		break
	case 'KeyT':
		keyTurnUp = true
		break
	case 'KeyG':
		keyTurnDown = true
		break
	case 'KeyQ':
		keyLeft = true
		break
	case 'KeyE':
		keyRight = true
		break
	case 'KeyR': // up
		keyUp = true
		break
	case 'KeyF': // down
		keyDown = true
		break

	case 'KeyW':
	case 'ArrowUp':
		keyForward = true
		break
	case 'KeyD':
	case 'ArrowRight':
		keyTurnRight = true
		break
	case 'KeyS':
	case 'ArrowDown':
		keyBackward = true
		break
	case 'KeyA':
	case 'ArrowLeft':
		keyTurnLeft = true
		break
	}
	if(!requested){
		requested = true
		requestAnimationFrame(render)
	}
})
addEventListener('keyup', (e) => {
	switch (e.code) {
	case 'KeyT':
		keyTurnUp = false
		break
	case 'KeyG':
		keyTurnDown = false
		break
	case 'KeyQ':
		keyLeft = false
		break
	case 'KeyE':
		keyRight = false
		break
	case 'KeyR': // up
		keyUp = false
		break
	case 'KeyF': // down
		keyDown = false
		break

	case 'KeyW':
	case 'ArrowUp':
		keyForward = false
		break
	case 'KeyD':
	case 'ArrowRight':
		keyTurnRight = false
		break
	case 'KeyS':
	case 'ArrowDown':
		keyBackward = false
		break
	case 'KeyA':
	case 'ArrowLeft':
		keyTurnLeft = false
		break
	}
	if(!requested){
		requested = true
		requestAnimationFrame(render)
	}
})