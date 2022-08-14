'use strict'
var canvas = document.getElementById('myCanvas')
var options = {canvas: canvas, antialias: true}

var renderer = new THREE.WebGLRenderer(options)

renderer.setClearColor(0x000000)//2277FF)

var width = window.innerWidth
var height = window.innerHeight
renderer.setSize(width, height)

var scene = new THREE.Scene()
var camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 3000)
camera.position.set(0, -1000, 500)
camera.rotation.set(Math.PI/3,0,0)

const turnLeft = new THREE.Quaternion()
turnLeft.setFromEuler(new THREE.Euler(0, .01, 0))
const turnRight = new THREE.Quaternion()
turnRight.setFromEuler(new THREE.Euler(0, -.01, 0))

const turnUp = new THREE.Quaternion()
turnUp.setFromEuler(new THREE.Euler(.01, 0, 0))
const turnDown = new THREE.Quaternion()
turnDown.setFromEuler(new THREE.Euler(-.01, 0, 0))

renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFShadowMap

// noise.seed(12)

let keyForward = false, keyRight = false, keyBackward = false, keyLeft = false, keyUp = false, keyDown = false, keyTurnLeft = false, keyTurnRight = false, keyTurnUp = false, keyTurnDown = false


let seaLevel = 20

const verticesArray = []
const indices = new Uint16Array(100*100*6);

const noiseScale = 0.05
const noiseScale2 = noiseScale*2
const noiseScale4 = noiseScale2*2
const noiseAmp = 20
const noiseAmp2 = noiseAmp/2
const noiseAmp4 = noiseAmp2/2
const perfMark = performance.now()
let tempArr = []
let nextTempArr = []
for(let i = 0; i<101; i++){		
	nextTempArr[i] = noiseAmp*noise.simplex2(i*noiseScale, 0)
}	
for(let j = 0; j<100; j++){
	tempArr = nextTempArr
	nextTempArr = []
	for(let i = 0; i<101; i++){		
		nextTempArr[i] = noiseAmp*noise.simplex2(i*noiseScale, j*noiseScale)
			+ noiseAmp2*noise.simplex2(i*noiseScale2, j*noiseScale2)
			+ noiseAmp4*noise.simplex2(i*noiseScale4, j*noiseScale4)

	}
	for(let i = 0; i<100; i++){
		let x = i << 3
		let y = j << 3
		let xx = i*noiseScale
		let yy = (j+1)*noiseScale
		verticesArray.push(x); verticesArray.push(y); verticesArray.push(tempArr[i])
		if(i === 99 || j === 99){
			continue
		}
		let cur = (j*100 + i)*6

		indices[cur] = j*100 + i
		indices[cur+1] = j*100 + i+1
		indices[cur+2] = (j+1)*100 + i+1
		indices[cur+3] = j*100 + i
		indices[cur+4] = (j+1)*100 + i+1
		indices[cur+5] = (j+1)*100 + i
		// verticesArray.push(x); verticesArray.push(y); verticesArray.push(tempArr[i])
		// verticesArray.push(x+8); verticesArray.push(y); verticesArray.push(tempArr[i+1])
		// verticesArray.push(x+8); verticesArray.push(y+8); 
		// verticesArray.push(nextTempArr[i+1])

		// verticesArray.push(x); verticesArray.push(y); verticesArray.push(tempArr[i])
		// verticesArray.push(x+8); verticesArray.push(y+8); verticesArray.push(nextTempArr[i+1])
		// verticesArray.push(x); verticesArray.push(y+8);
		// verticesArray.push(nextTempArr[i])
	}
}
console.log(Math.floor(performance.now() - perfMark)/1000)

var geometryLand = new THREE.BufferGeometry();
// console.log(verticesArray)
// create a simple square shape. We duplicate the top left and bottom right
// vertices because each vertex needs to appear once per triangle.
var vertices = new Float32Array( verticesArray );

// itemSize = 3 because there are 3 values (components) per vertex
geometryLand.addAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
// geometryLand.setIndex([0,1,2, 2,3,0]);
geometryLand.setIndex(new THREE.BufferAttribute(indices, 1));
// geometryLand.mergeVertices()
geometryLand.computeFaceNormals();
geometryLand.computeVertexNormals(true);

var materialLand = new THREE.MeshLambertMaterial({color: 0xF3EFB2})
// materialLand.side = THREE.DoubleSide

var meshLand = new THREE.Mesh(geometryLand, materialLand)
// meshLand.material.shading = THREE.SmoothShading
meshLand.position.set(-400,-400,10)
meshLand.castShadow = true
meshLand.receiveShadow = true
// meshLand.position.set(0, 0, 0)
scene.add(meshLand)



let geometrySea = new THREE.BoxGeometry(800, 800,1)
let materialSea = new THREE.MeshLambertMaterial({color: 0x005FB2, transparent: true, opacity: 0.7})
let meshSea = new THREE.Mesh(geometrySea, materialSea)
meshSea.position.set(0,0,10)
meshSea.castShadow = true
meshSea.receiveShadow = true
// meshSea.transparent = true
// meshSea.opacity = .5
scene.add(meshSea)



/*const geometry2 = new THREE.ConeGeometry(50, 100, 24)
const material2 = new THREE.MeshLambertMaterial({color: 0xbb3355})
const mesh2 = new THREE.Mesh(geometry2, material2)
mesh2.position.set(-100, 0, 100)
mesh2.rotation.set(0,-0, Math.PI/2)	
// mesh2.castShadow = true
scene.add(mesh2)*/

var light1 = new THREE.SpotLight(0xffffff, 0.5, 3000)

var light = new THREE.AmbientLight(0xffffff, 0.5)
light1.add(light)
light.position.set(10, 0, -10)
light1.target = light

light1.position.set(-1000, -500, 400)
light1.rotation.set(0,-Math.PI/3,0)	

// light1.rotation.set(0,Math.PI/3, 0)
// light1.position.z = 500
// light1.position.x = 300
// light1.position.y = -200
// light1.target = mesh
light1.castShadow = true
light1.shadow = new THREE.LightShadow(new THREE.PerspectiveCamera(100, 1, 500, 3000))
light1.shadow.bias = 0.0001
light1.shadow.mapSize.width = 1024
light1.shadow.mapSize.height = 1024
scene.add(light1)

// const shadowMapViewer = new THREE.ShadowMapViewer(light1)
// shadowMapViewer.position.x = 10
// shadowMapViewer.position.y = 10
// shadowMapViewer.size.width = 256
// shadowMapViewer.size.height = 256
// shadowMapViewer.update()


let cameraSpeed = 10

let changed = false
let requested = false
var time = 0
function render () {
	time+=0.01
	// light1.rotation.set(-Math.PI/2 + time, 0, 0)
	// light1.position.z += 0.1
	// geometry.vertices[0].x = -100 + 50*Math.sin(time)
	// geometry.verticesNeedUpdate = true
	if (keyForward){
		camera.position.y += cameraSpeed
	}
	if (keyRight){
		camera.position.x += cameraSpeed
	}
	if (keyBackward){
		camera.position.y -= cameraSpeed
	}
	if (keyLeft){
		camera.position.x -= cameraSpeed
	}
	if (keyUp){
		camera.position.z += cameraSpeed
	}
	if (keyDown){
		camera.position.z -= cameraSpeed
	}
	if (keyTurnUp){
		camera.quaternion.multiply(turnUp)
	}
	if (keyTurnDown){
		camera.quaternion.multiply(turnDown)
	}
	if (keyTurnLeft){
		camera.quaternion.multiply(turnLeft)
	}
	if (keyTurnRight){
		camera.quaternion.multiply(turnRight)
	}
	// light1.position.y +=10
	renderer.render(scene, camera)
	// shadowMapViewer.render(renderer)
	if (keyForward || keyRight || keyBackward || keyLeft || keyUp || keyDown ||
		keyTurnLeft || keyTurnRight || keyTurnUp || keyTurnDown){
		requestAnimationFrame(render)
	} else {
		requested = false
	}
}

render()

addEventListener('keydown', (e) => {
	switch (e.code) {
	case 'KeyP':
		light1.position.y += cameraSpeed
		break
	case 'KeyT':
		keyTurnUp = true
		break
	case 'KeyG':
		keyTurnDown = true
		break
	case 'KeyQ':
		keyTurnLeft = true
		break
	case 'KeyE':
		keyTurnRight = true
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
		keyRight = true
		break
	case 'KeyS':
	case 'ArrowDown':
		keyBackward = true
		break
	case 'KeyA':
	case 'ArrowLeft':
		keyLeft = true
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
		keyTurnLeft = false
		break
	case 'KeyE':
		keyTurnRight = false
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
		keyRight = false
		break
	case 'KeyS':
	case 'ArrowDown':
		keyBackward = false
		break
	case 'KeyA':
	case 'ArrowLeft':
		keyLeft = false
		break
	}
	if(!requested){
		requested = true
		requestAnimationFrame(render)
	}
})