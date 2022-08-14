'use strict'
const stats = new Stats();
stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
FPSmeter.appendChild( stats.domElement )
const clamp = n => n > 0 ? n : 0
const maxProp = (arr, prop) => arr.reduce((max, o) => max > o[prop] ? max : o[prop], 0)
const minProp = (arr, prop) => arr.reduce((min, o) => min < o[prop] ? min : o[prop], 0)
const width = window.innerWidth
const height = window.innerHeight
const canvas = document.getElementById('myCanvas')

const renderer = new THREE.WebGLRenderer({canvas: canvas, antialias: true})
// renderer.setClearColor(0xF3EFB2	)//2277FF)
renderer.setSize(width, height)
				renderer.gammaInput = true;
				renderer.gammaOutput = true;
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
// renderer.shadowMap.autoUpdate = false;
// setTimeout(e => renderer.shadowMap.needsUpdate = true, 1000)

const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 4096)
camera.position.set(2, 4, 4)
// camera.rotation.set(0,-.1-Math.PI/2.5,-Math.PI/2)
const controls = new THREE.OrbitControls( camera )
controls.keys.UP = 87
controls.keys.RIGHT = 68
controls.keys.BOTTOM = 83
controls.keys.LEFT = 65
controls.target.set(0, 1, 0)
controls.update()

const lightAmbient = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(lightAmbient)

const light = new THREE.SpotLight(0xffffff, 0.5)
light.position.set(-10, 10, 10)
light.rotation.set(-Math.PI/2,-Math.PI/3,0)	
light.angle = .5	
// light.lookAt(new THREE.Vector3())
scene.add(light)
light.castShadow = true
// light.shadow.camera.fov = 3
light.shadow.mapSize.width = 1024;  // default
light.shadow.mapSize.height = 1024; // default

// light.shadow.camera.near = 0.5;    // default
light.shadow.camera.far = 25
// var helper = new THREE.CameraHelper( light.shadow.camera );
// scene.add( helper )

const floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(10, 10), new THREE.MeshLambertMaterial({color: 0xffe5f0}))
floor.rotation.x = -Math.PI/2
scene.add(floor)
floor.receiveShadow = true

const graberPivot = new THREE.Object3D()
const graber = new THREE.Mesh( 
	(new THREE.BoxBufferGeometry(.35, .35, .15)).applyMatrix(new THREE.Matrix4().makeTranslation(0, .05, 0)), new THREE.MeshLambertMaterial({color: 0x5c2189}))
const barNumber = 4
const barFactor = 2 // from 1 to infinity.. 100
const barsLength = 5
const barEqual = barsLength / barNumber
const barStart = barFactor*2*barEqual/(barFactor + 1)
const barEnd = barStart/barFactor
const barSpan = barStart - barEnd
const bars = []
const measures = []
const lastMeasures = []
const  changes = []
const barsGradient = tinygradient([
  {color: '#d1803a', pos: 0}
  , {color: '5c2189', pos: 1}
])
const colors = [0xd1803a, 0xc17346, 0xaa6054, 0x985261, 0x803e70, 0x70317b, 0x5c2189]
const POSITIVE = 1
const NEGATIVE = -1
for (let i = 0; i < barNumber; i++){
	let barsLength = barSpan*(1-i/(barNumber-1)) + barEnd
	let barShift = barSpan*(1-(i-1)/(barNumber-1)) + barEnd
	let barThickness = .05*(1-i/(barNumber-1))+.1
	let barGeometry = new THREE.BoxBufferGeometry(barThickness, barsLength, barThickness*.6)
	barGeometry.applyMatrix( new THREE.Matrix4().makeTranslation(0, barsLength/2, 0) )
	bars[i] = new THREE.Mesh( barGeometry, new THREE.MeshLambertMaterial({color: barsGradient.rgbAt(i/(barNumber-1)).toRgbString()}))
	bars[i].castShadow = true
	measures[i] = {}
	changes[i] = {diffX: 0, diffZ: 0, signX: POSITIVE, signZ: POSITIVE}
	if (i === 0){
		scene.add(bars[i])
	// } else if (i === 6){

	} else {
		bars[i].position.y = barShift
		bars[i].rotation.x = Math.PI/2
		bars[i-1].add(bars[i])
	}
}
bars[barNumber-1].add(graberPivot)
graberPivot.position.y = barEnd
graberPivot.add(graber)
graber.castShadow = true

const target = new THREE.Mesh( new THREE.BoxBufferGeometry(.2, .2, .2), new THREE.MeshLambertMaterial({color: 0x7dd8f6}))
target.position.y = .1
scene.add(target)
target.castShadow = true
const turnSpeed = .003
let time = 0
let percent
function render () {
  	stats.begin()
  	time+=.02
  	target.position.x = 2*Math.cos(time) - Math.sin(time*.4)
  	target.position.y = 2+1*Math.cos(time*1.2)
  	target.position.z = 2*Math.sin(time) - Math.cos(time*.7)
  	let distance0 = graberPivot.localToWorld(graberPivot.position.clone()).distanceTo(target.position)
  	if (distance0 > .1) {
  		for (let i = 1; i < barNumber; i++) {
  			let bar = bars[i]
  			let measure = measures[i]
									  		bar.rotation.x += turnSpeed
									  		bar.updateMatrixWorld()
	  		let distance1 = graberPivot.localToWorld(graberPivot.position.clone()).distanceTo(target.position)
	  		measure.diff = distance0 - distance1
					  		if(measure.diff < 0){
					  			measure.diff = 0//.000001
					  		}
	  		measure.sign = POSITIVE
	  		measure.axis = 'x'
									  		bar.rotation.x -= turnSpeed*2
									  		bar.updateMatrixWorld()
	  		let distance2 = graberPivot.localToWorld(graberPivot.position.clone()).distanceTo(target.position)
	  		if (measure.diff < distance0 - distance2) {
	  			measure.diff = distance0 - distance2
	  										measure.sign = NEGATIVE
	  		}
					  		if(measure.diff < 0){
					  			measure.diff = 0//.000001
					  		}
	  										bar.rotation.x += turnSpeed
									  		bar.rotation.z += turnSpeed
									  		bar.updateMatrixWorld()
	  		distance1 = graberPivot.localToWorld(graberPivot.position.clone()).distanceTo(target.position)
	  		if (measure.diff < distance0 - distance1) {
	  			measure.diff = distance0 - distance1
								  			measure.sign = POSITIVE
								  			measure.axis = 'z'
	  		}
					  		if(measure.diff < 0){
					  			measure.diff = 0//.000001
					  		}
									  		bar.rotation.z -= turnSpeed*2
									  		bar.updateMatrixWorld()
	  		distance2 = graberPivot.localToWorld(graberPivot.position.clone()).distanceTo(target.position)
	  		if (measure.diff < distance0 - distance2) {
	  			measure.diff = distance0 - distance2
								  			measure.sign = NEGATIVE
								  			measure.axis = 'z'
	  		}
					  		if(measure.diff < 0){
					  			measure.diff = 0//.000001
					  		}
	  										bar.rotation.z += turnSpeed
	  	}
	  	let maxDiff = maxProp(measures, 'diff')
	  	let minDiff = minProp(measures, 'diff')
	  	let span = maxDiff - minDiff
	  	span = span < 0.1 ? .1 : span
	  	// percent = (span / (minDiff+.0001)) > 1 ? 1 : span / (minDiff +.0001)
	  	for (let i = 1; i < barNumber; i++) {
	  		let measure = measures[i]
	  		let change = changes[i]
	  		let newVal = measure.diff*measure.sign/span/span*distance0
  			if (measure.axis === 'x') {
  				change.diffX += newVal
  				change.diffZ *= .9
				if(change.diffX > 1) {
					change.diff = 1
				} else if(change.diffX < -1) {
					change.diff = -1
				}
  			} else {
  				change.diffX *=.9
  				change.diffZ += newVal
				if(change.diffZ > 1) {
					change.diff = 1
				} else if(change.diffZ < -1) {
					change.diff = -1
				}
  			}
  			//(measure.diff - minDiff) / span// * percent
	  	}
	  	// console.table(measures)
	  	// console.table(sortedMeasures)
	  	// console.table(changes)
	  	// console.log(maxDiff, minDiff,'maxDiff, minDiff')
	  	for (let i = 1; i < barNumber; i++) {
	  		let measure = measures[i]
	  		let change = changes[i]
	  		let bar = bars[i]
	  		bar.rotation.x += change.diffX*turnSpeed
	  		bar.rotation.z += change.diffZ*turnSpeed
	  	}
  	}
  	graber.lookAt(target.position)
	renderer.render(scene, camera)
	if (!stop) requestAnimationFrame(render)
  	stats.end()
}
let stop = false
render()
addEventListener('keydown', e => {
	if(e.code === 'Space'){
		stop = !stop
		if (stop){
			console.table(measures)
		} else {
			render()
		}
	}
})
