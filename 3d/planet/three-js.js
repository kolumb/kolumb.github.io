;'use strict';
// var stats = new Stats();
// stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
// document.body.appendChild( stats.dom );

// const debugDisplay = document.createElement('span')
// debugDisplay.textContent = 'qwe'
// debugDisplay.style.position = 'absolute'
// debugDisplay.style.backgroundColor = 'white'
// debugDisplay.style.top = 0
// document.documentElement.appendChild(debugDisplay)


var canvas = document.getElementById('myCanvas')
var width = window.innerWidth
var height = window.innerHeight

var scene = new THREE.Scene()
// scene.background = new THREE.Color().setHSL( 0.51, 0.4, 0.01 );
scene.fog = new THREE.Fog( new THREE.Color().setHSL( 0.51, 0.4, 0.01 ), 100, 800 );
var camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 3000)
camera.position.set(0, -210, 100)
camera.rotation.set(Math.PI/3/.8,0,0)

var renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true, alpha: true})
renderer.setClearColor(0x2277FF)//2277FF)
renderer.setSize(width, height)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
				renderer.gammaInput = true;
				renderer.gammaOutput = true;
// renderer.shadowMap.autoUpdate = false;
// renderer.shadowMap.needsUpdate = true;


const planetRadius = 500
var geometryLand = new THREE.IcosahedronBufferGeometry(planetRadius,2);
var materialLand = new THREE.MeshPhongMaterial({color: 0xF3EFB2, wireframe: false})
var meshLand = new THREE.Mesh(geometryLand, materialLand)
meshLand.matrixAutoUpdate = false
meshLand.updateMatrix()
meshLand.castShadow = true
meshLand.receiveShadow = true
const planetPivot = new THREE.Object3D()
planetPivot.quaternion.setFromAxisAngle( new THREE.Vector3(-1,0,0), 1.6 )
planetPivot.quaternion.multiply((new THREE.Quaternion()).setFromEuler(new THREE.Euler(0, 0, Math.PI*7/8)))


const carWidth = 20
const carHeight = 20
const carLength = 40
const car = new THREE.Mesh
	( new THREE.BoxBufferGeometry(carWidth,carLength,carHeight)
	, new THREE.MeshPhongMaterial({color: 0x3355EE})
	)
car.position.z = planetRadius+carHeight/3
car.castShadow = true
car.receiveShadow = true
let keyForward = true, keyRight = false, keyBackward = false, keyLeft = false, keyUp = false, keyDown = false, keyTurnLeft = false, keyTurnRight = false, keyTurnUp = false, keyTurnDown = false
let carSpeed = 0.01
const moveRight = (new THREE.Quaternion())
	.setFromEuler(new THREE.Euler(0, carSpeed, 0))
const moveLeft = (new THREE.Quaternion())
	.setFromEuler(new THREE.Euler(0, -carSpeed, 0))
const moveForvard = (new THREE.Quaternion())
	.setFromEuler(new THREE.Euler(carSpeed, 0, 0))
const moveBackward = (new THREE.Quaternion())
	.setFromEuler(new THREE.Euler(-carSpeed, 0, 0))
const turnLeft = (new THREE.Quaternion())
	.setFromEuler(new THREE.Euler(0, 0, carSpeed))
const turnRight = (new THREE.Quaternion())
	.setFromEuler(new THREE.Euler(0, 0, -carSpeed))
// const verticalRotateLeft = (new THREE.Quaternion()).setFromAxisAngle( new THREE.Vector3(0,0,1), -carSpeed )

const headlightLeft = new THREE.SpotLight(0xffffff, .2)
headlightLeft.target.position.set(0, 4000, -1000)
headlightLeft.position.set(0, carLength, -carHeight/3)
headlightLeft.distance = 600
headlightLeft.angle = 0.4
headlightLeft.penumbra = 0.2
headlightLeft.intensity = 0
// headlightLeft.castShadow = true
// headlightLeft.shadow.mapSize.width = 256
// headlightLeft.shadow.mapSize.height = 256


// const sun = new THREE.Mesh
// 	( new THREE.SphereBufferGeometry(50)
// 	, new THREE.MeshBasicMaterial({color: 0xFF6600, fog: false})
// 	)
// sun.position.set(0, 0, 1300)
// sun.renderOrder = 3


const moon = new THREE.Mesh
	( new THREE.SphereBufferGeometry(30)
	, new THREE.MeshBasicMaterial({color: 0xb8b8b8, fog: false})
	)
moon.matrixAutoUpdate = false
moon.position.set(0, 0, -1300)
// moon.position.set(0, 0, -1800)
moon.updateMatrix()


var ambientLight = new THREE.AmbientLight(0xffffff, 0.05)


const sunPivot = new THREE.Object3D()
const sunLight = new THREE.DirectionalLight(0xfffff9, .9)
sunLight.color.setHSL(.2, 1, .9 );
sunLight.castShadow = true
// sunLight.shadow = new THREE.LightShadow(new THREE.OrthographicCamera(-400, 400, 400, -400, 1, 3000))
sunLight.shadow.camera.left = -400
sunLight.shadow.camera.right = 400
sunLight.shadow.camera.top = 400
sunLight.shadow.camera.bottom = -400
sunLight.shadow.camera.near = 1
sunLight.shadow.camera.far = 3000
// const helper = new THREE.CameraHelper(sunLight.shadow.camera)
// scene.add(helper)
sunLight.shadow.bias = 0.0001
sunLight.shadow.mapSize.width = 1024
sunLight.shadow.mapSize.height = 1024
sunLight.position.set(0, 0, 1200)
sunLight.target = car //scene.add(new THREE.Object3D())
	const textureLoader = new THREE.TextureLoader()
	const textureFlare0 = textureLoader.load( 'lensflare0.png' );
	const textureFlare3 = textureLoader.load( 'lensflare3.png' );
	const lensflare = new THREE.Lensflare()
	lensflare.addElement( new THREE.LensflareElement( textureFlare0, 400, 0, sunLight.color) );
// lensflare.addElement( new THREE.LensflareElement( textureFlare3, 60, 0.6 ) );
// lensflare.addElement( new THREE.LensflareElement( textureFlare3, 70, 0.7 ) );
// lensflare.addElement( new THREE.LensflareElement( textureFlare3, 120, 0.9 ) );
// lensflare.addElement( new THREE.LensflareElement( textureFlare3, 70, 1 ) );


// lensflare.addElement( new THREE.LensflareElement( textureFlare0, 700, 0) );

const moonLight = new THREE.DirectionalLight(0xffffff, .05)
moonLight.position.set(0, 0, -1600)
moonLight.target = car //scene.add(new THREE.Object3D())


// var helper = new THREE.CameraHelper( sunLight.shadow.camera )
// scene.add( helper )

// const shadowMapViewer = new THREE.ShadowMapViewer(sunLight)
// shadowMapViewer.position.x = 10
// shadowMapViewer.position.y = 10
// shadowMapViewer.size.width = 256
// shadowMapViewer.size.height = 256
// shadowMapViewer.update()
const trunkHeight = 50//80
const branchesSize = 30//50
const trunkGeometry = new THREE.CylinderBufferGeometry(branchesSize/10, branchesSize/12, trunkHeight, 4, 1, true)
const trunkMaterial = new THREE.MeshPhongMaterial({color: 0x776622, wireframe: false})
const branchesGeometry = new THREE.IcosahedronBufferGeometry(branchesSize,0)
const branchesMaterial = new THREE.MeshPhongMaterial({color: 0x33EE88, wireframe: false})
// https://threejs.org/examples/webgl_shaders_sky.html
// https://threejs.org/examples/webgl_loader_mmd.html
const brachGeometries = []
const trunkGeometries = []
const tempTarget = new THREE.Vector3(500,500,0)
for(let i = 0; i< 300; i++){
	const meshScale = Math.random()*.8+.2
	const heightVariation = Math.random()*.7+.3
	let vector = new THREE.Vector3(Math.random()-.5, Math.random()-.5, Math.random()-.5)

	const trunkMesh = trunkGeometry.clone()
	trunkMesh.scale(meshScale, (1+branchesSize*meshScale/trunkHeight)*heightVariation, meshScale)
	vector.normalize()
		.multiplyScalar(planetRadius+(trunkHeight*(1+branchesSize*meshScale/trunkHeight)*heightVariation)/2-branchesSize*meshScale/2)
	trunkMesh.rotateX(Math.PI/2)
	trunkMesh.applyMatrix(new THREE.Matrix4().lookAt(vector, meshLand.position, new THREE.Vector3(0,0,1)))
	// trunkMesh.lookAt(tempTarget)
	trunkMesh.translate(vector.x, vector.y, vector.z)
	trunkGeometries.push(trunkMesh)



	const branchesMesh = branchesGeometry.clone()//new THREE.Mesh(branchesGeometry, branchesMaterial)
	branchesMesh.scale(meshScale,meshScale,meshScale)
	// branchesMesh.position.copy(vector.normalize()
	vector.normalize()
		.multiplyScalar(planetRadius+
			(trunkHeight*(1+branchesSize*meshScale/trunkHeight))
		*heightVariation)
	branchesMesh.rotateX(Math.random()*Math.PI)
	branchesMesh.rotateY(Math.random()*Math.PI)
	branchesMesh.rotateZ(Math.random()*Math.PI)
	branchesMesh.translate(vector.x, vector.y, vector.z)
	brachGeometries.push(branchesMesh)
}
const trunksGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries(trunkGeometries)
trunksGeometry.computeBoundingSphere()

const trunks = new THREE.Mesh(trunksGeometry, trunkMaterial)
trunks.castShadow = true
trunks.receiveShadow = true
trunks.matrixAutoUpdate = false
trunks.updateMatrix()
scene.add(trunks)

const brachesGeometry = THREE.BufferGeometryUtils.mergeBufferGeometries( brachGeometries )
brachesGeometry.computeBoundingSphere()

const branches = new THREE.Mesh(brachesGeometry, branchesMaterial)
branches.castShadow = true
branches.receiveShadow = true
branches.matrixAutoUpdate = false
branches.updateMatrix()
scene.add(branches)


let cameraSpeed = 10

let changed = false
let requested = false
let maxRotation = 0

const skyGradient = tinygradient([
  {color: '#27F', pos: 0}
  , {color: '#779ab5', pos: 0.44}
  , {color: '#cbbfaa', pos: 0.49}
  , {color: '#eab87a', pos: 0.54}
  , {color: '#ab878b', pos: 0.59}
  , {color: '#0f3c62', pos: 0.64}
  , {color: '#00234e', pos: 1}
])

scene.add(meshLand)
scene.add(ambientLight)
scene.add(moon)
scene.add(moonLight)

scene.add(planetPivot)
planetPivot.add(car)
car.add(camera)
car.add(headlightLeft)
car.add(headlightLeft.target)
// car.add(headlightRight)
// car.add(headlightRight.target)
car.add(sunPivot)
sunPivot.add(sunLight)
sunPivot.add(moon)
// sunPivot.add(sun)
	sunLight.add(lensflare)

let before = 0
let lastMaxRotation = 0
function render (now) {
	let dt = (now - before)/40 // 20 ~ 60
	before = now
	// stats.begin();
	if (keyForward){
		planetPivot.quaternion.multiply(moveBackward)
	}
	if (keyRight){
		planetPivot.quaternion.multiply(moveRight)
	}
	if (keyBackward){
		planetPivot.quaternion.multiply(moveForvard)
	}
	if (keyLeft){
		planetPivot.quaternion.multiply(moveLeft)
	}
	if (keyUp){
		camera.position.z += cameraSpeed
	}
	if (keyDown){
		camera.position.z -= cameraSpeed
	}
	if (keyTurnLeft){
		if(keyBackward){
			planetPivot.quaternion.multiply(turnRight)
		} else {
			planetPivot.quaternion.multiply(turnLeft)
		}
	}
	if (keyTurnRight){
		if(keyBackward){
			planetPivot.quaternion.multiply(turnLeft)
		} else {
			planetPivot.quaternion.multiply(turnRight)
		}
	}
	sunPivot.quaternion.copy(planetPivot.quaternion.clone().inverse())	
	maxRotation = Math.max(Math.abs(sunPivot.rotation.x), Math.abs(sunPivot.rotation.y))
	if(maxRotation > 2 && lastMaxRotation<=2) {
		headlightLeft.intensity = 1
	} else if(maxRotation<2 && lastMaxRotation >=2){
		headlightLeft.intensity = 0
	}
	lastMaxRotation = maxRotation
	// debugDisplay.textContent = dt//(maxRotation/Math.PI).toFixed(2)
	let skyColor = skyGradient.rgbAt(maxRotation/Math.PI).toRgbString()
	renderer.setClearColor(skyColor)	
	scene.fog.color.setStyle(skyColor)
	renderer.render(scene, camera)
	// renderer.info.render.calls
	// shadowMapViewer.render(renderer)
	// stats.end();
	if (keyForward || keyRight || keyBackward || keyLeft || keyUp || keyDown ||
		keyTurnLeft || keyTurnRight || keyTurnUp || keyTurnDown){
		dt = requestAnimationFrame(render)
	} else {
		requested = false
	}
}

render()
setTimeout(render, 100)

addEventListener('keydown', (e) => {
	switch (e.code) {
	case 'KeyP':
		sunLight.position.y += cameraSpeed
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
