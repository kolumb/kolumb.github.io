'use strict';

function Vector(x,y) {
	this.x = x
	this.y = y
}
;(function(){
	this.add = function (v) {
		this.x += v.x
		this.y += v.y
	}
	this.mult = function(multiplicator) {
		this.x *= multiplicator
		this.y *= multiplicator
	}
	this.length = function() {
		return Math.sqrt(this.x*this.x + this.y*this.y)
	}
	this.normalize = function(len) {
		this.x/=len
		this.y/=len
		return this
	}
}).call(Vector.prototype)

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
;(function() {
		var lastTime = 0;
		var vendors = ['ms', 'moz', 'webkit', 'o'];
		for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
				window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
				window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
																	 || window[vendors[x]+'CancelRequestAnimationFrame'];
		}
 
		if (!window.requestAnimationFrame)
				window.requestAnimationFrame = function(callback, element) {
						var currTime = new Date().getTime();
						var timeToCall = Math.max(0, 16 - (currTime - lastTime));
						var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
							timeToCall);
						lastTime = currTime + timeToCall;
						return id;
				};
 
		if (!window.cancelAnimationFrame)
				window.cancelAnimationFrame = function(id) {
						clearTimeout(id);
				};
}());

// @license http://opensource.org/licenses/MIT
// copyright Paul Irish 2015
;(function(){
	if ("performance" in window == false) {
			window.performance = {};
	}
	Date.now = (Date.now || function () {  // thanks IE8
		return new Date().getTime();
	});
	if ("now" in window.performance == false){
		var nowOffset = Date.now();
		if (performance.timing && performance.timing.navigationStart){
			nowOffset = performance.timing.navigationStart
		}
		window.performance.now = function now(){
			return Date.now() - nowOffset;
		}
	}
})();

//=========================================

var Particle = function() {
	this.pos = new Vector(Math.random()*width, Math.random()*height)
	this.vel = new Vector(0,0)
	this.prev = new Vector(0,0)
}
Particle.prototype.move = function(){
	var x = 0|this.pos.x/cellSize
	var y = 0|this.pos.y/cellSize
	var angle = flowfield[x+y*cols]
	this.vel.x += acc*Math.cos(angle)
	this.vel.y += acc*Math.sin(angle)
	//this.vel.add(this.acc)
	var speed = this.vel.length()
	if(speed > maxSpeed) {
		this.vel.x *= maxSpeed /speed
		this.vel.y *= maxSpeed /speed
		//this.vel.normalize(speed).mult(maxSpeed)
	}
	this.prev.x = this.pos.x
	this.prev.y = this.pos.y
	this.pos.x += this.vel.x
	this.pos.y += this.vel.y
	if(this.pos.x < 0) {
		this.prev.x = this.pos.x = width - maxSpeed
	} else if(this.pos.x > width){
		this.prev.x = this.pos.x = maxSpeed
	}
	if(this.pos.y < 0) {
		this.prev.y = this.pos.y = height - maxSpeed
	} else if(this.pos.y > height){
		this.prev.y = this.pos.y = maxSpeed
	}
}

//=========================================

var buffer = document.createElement('canvas'); 
var bufctx = buffer.getContext('2d');
var width
var height
var ctx = canvas.getContext('2d')

var flowfield = []
var pixelsPerCell = 15
var cols
var rows
var index = 0
var cells
var cellSize

var generator = new SimplexNoise()
var noiseScale = 1.8
var t = 100*Math.random()
var timeFlow = .002
var lineLength = 7
var lineWidth = 1
var hair = true
var hairer = true

var acc = 0.06
var particles = []
var maxParticles = 2048
var radius = 2
var maxSpeed = 1.4
var maxFPS = 30
var darker = false
var dark = darker
var bg = dark?'rgb(23,23,23)':'#ffffff' // NEW

//=========================================

var time=0,thisFrameTime=0,lastLoop=0,frameTime=0//,fps=0,smoothing=1
var tick = function () {
	time = performance.now();
	thisFrameTime = time - lastLoop;
	frameTime += (thisFrameTime - frameTime)/20// / smoothing;
	//console.log((1000/frameTime).toFixed(0)) //fps = 1000 / frameTime
	lastLoop = time
	return 1000/frameTime
};

var frameCounter = 0 // NEW


//=========================================

var stop = false
var stoper = false
var fps = 100
var frame = function(){
	if(hair) {
		fps = tick()
		if(fps > maxFPS){
			for(var i = 0; i < 128; i++) particles.push(new Particle())
			maxParticles = particles.length
			ctx.clearRect(0,0,40,14)
			ctx.fillStyle = 'black'
			ctx.fillText(maxParticles,5,10)
		} else if (fps < maxFPS*.6){
			for(var i = 0; i < 64; i++) particles.pop()
			maxParticles = particles.length
			ctx.clearRect(0,0,40,14)
			ctx.fillStyle = 'black'
			ctx.fillText(maxParticles,5,10)
		}
	}
	t+=timeFlow
	index = 0
	for(var i = 0; i < rows; i++) {
		for(var j = 0; j < cols; j++){
			flowfield[index] = 6.28*generator.noise3d(noiseScale*i/cols,noiseScale*j/rows,noiseScale*t)
			index++
		}
	}

	if(hair) {
		ctx.lineWidth = lineWidth
		ctx.strokeStyle = 'rgba(' + Math.floor((flowfield[5]+5.70074)*22.365)
		  + ',' + Math.floor((flowfield[cols]+5.70074)*22.365)
		  + ',' + Math.floor((flowfield[(cols-1)*(rows-1)]+5.70074)*22.365)
		  + ',' + (dark ? '0.02' : '1') + ')'
	} else { //=========================== DrawLines
		ctx.clearRect(0,0,width,height)
		ctx.lineWidth = 1
		index = 0
		ctx.beginPath()
		for(var i = 0; i < rows; i++) {
			for(var j = 0; j < cols; j++){
				var x = j*cellSize
				var y = i*cellSize
				ctx.moveTo(x, y)
				x+=lineLength*Math.cos(flowfield[index])
				y+=lineLength*Math.sin(flowfield[index])
				ctx.lineTo(x,y)
				index++
			}
		}
		ctx.stroke()
	}

	for(var i = 0; i < maxParticles; i++) {
		particles[i].move()
	}
	if(hair){
		ctx.beginPath()
		for(var i = 0; i < maxParticles; i++) {
				ctx.moveTo(particles[i].prev.x, particles[i].prev.y)
				ctx.lineTo(particles[i].pos.x, particles[i].pos.y)
		} 
		ctx.stroke()

		if(dark && frameCounter++%15 ===0 && (frameCounter/1000|0%4) === 1){ // NEW
			console.log((frameCounter/1000|0%4) === 1)
			ctx.save()
			ctx.globalCompositeOperation = "darken"//source-over"
			ctx.fillStyle = 'rgba(0, 0, 0, 0.03)'
			ctx.fillRect(0,0,width, height)
			ctx.restore()
		}
	} else {
		for(var i = 0; i < maxParticles; i++) {
			ctx.fillRect(particles[i].pos.x, particles[i].pos.y,1,1)
		}
	}
	if(!stop) requestAnimationFrame(frame)
}


var init = function(){
	width = buffer.width = canvas.width = innerWidth || 200
	height = buffer.height = canvas.height = innerHeight || 200
	ctx.fillStyle = bg
	ctx.fillRect(0,0,width,height)
	if(dark)ctx.globalCompositeOperation = "lighter"
	cols = Math.ceil(width/pixelsPerCell)
	rows = Math.ceil(height/pixelsPerCell)
	cells = cols * rows
	cellSize = height/rows
	for(var i = 0; i < maxParticles; i++) {
		particles.push(new Particle())
	}
	frame()
	if(!dark) setBg()
}
window.addEventListener('load', function(){
	var gui = new dat.GUI()
	var f1 = gui.addFolder('Field')
	f1.add(window, 'noiseScale', 0.01, 10).name('Noise scale')
	f1.add(window, 'timeFlow', 0.0005, 0.05).name('Time flow')
	f1.add(window, 'acc', 0.001, 3).name('Noise influence')
	f1.add(window, 'maxSpeed', .1, 10).name('Max speed')
	var f2 = gui.addFolder('Graphics') 
	f2.add(window, 'hairer').name('Trace path [Enter]').onChange(toggleMode).listen()//onFinishChange
	f2.add(window, 'darker').name('Dark theme [N]').onChange(toggleTheme).listen()
	f2.add(window, 'lineWidth', 1, 20).name('Line width')
	f2.addColor(window, 'bg').name('Background [C]').onChange(changeBg)
	f2.add(window, 'maxFPS', 8, 120).name('Max FPS')
	f2.add(window, 'stoper').name('Pause [Space]').onChange(pause).listen()
	f2.open()
	gui.close()
	init()
})
var changeBg = function(){
	if(dark) ctx.globalCompositeOperation = "source-over"
	ctx.fillStyle = bg
	ctx.fillRect(0,0,width,height)
	if(dark) ctx.globalCompositeOperation = "lighter"
}
var toggleMode = function(){
	hair = !hair
	if(hair) {
		ctx.drawImage(buffer,0,0)
		if(dark) ctx.globalCompositeOperation = "lighter"
	} else {
		if(dark) ctx.globalCompositeOperation = "source-over"
		else ctx.fillStyle = 'black'
		bufctx.drawImage(canvas,0,0)
		if(stop) frame()
		ctx.strokeStyle = 'grey'
	}
}
var toggleTheme = function(){
	dark = !dark
	if(dark) {
		ctx.fillStyle = 'black'
		ctx.fillRect(0,0,width,height)
		ctx.globalCompositeOperation = "lighter"
	} else {
		//ctx.fillStyle = 'white'
		ctx.globalCompositeOperation = "source-over"
		//ctx.fillRect(0,0,width,height)
		setBg()
	}
}
var setBg = function(){  
		if(dark) ctx.globalCompositeOperation = "source-over"
		ctx.fillStyle = 'rgba(' + Math.floor((flowfield[5]+5.70074)*22.365)
			+ ',' + Math.floor((flowfield[cols]+5.70074)*22.365)
			+ ',' + Math.floor((flowfield[(cols-1)*(rows-1)]+5.70074)*22.365)
			+ ',' + '1)'
		ctx.fillRect(0,0,width,height)
		if(dark) ctx.globalCompositeOperation = "lighter"
}
var pause = function(){
	stop = !stop
	if(!stop) requestAnimationFrame(frame)
}

var teleport = 0
var displace = function(e){
	for(var i =0; i < Math.floor(maxParticles/200); i++){
		teleport++
		if(teleport>maxParticles-1) teleport=0
		if(e.button !== 2) {
			particles[teleport].vel.x = 0
			particles[teleport].vel.y = 0
		}
		particles[teleport].pos.x = e.pageX+Math.random()
		particles[teleport].pos.y = e.pageY+Math.random()
	}
}

canvas.addEventListener('mousedown', function(e){
	displace(e)
	canvas.addEventListener('mousemove', displace)
})
canvas.addEventListener('mouseup', function(e){
	canvas.removeEventListener('mousemove', displace)
})
canvas.addEventListener("touchstart", function(e){
	displace(e)
	canvas.addEventListener("touchmove", displace)
})
canvas.addEventListener("touchend", function(e){
	canvas.removeEventListener('touchmove', displace)
})
canvas.addEventListener("touchcancel", function(e){
	canvas.removeEventListener('touchmove', displace)
})


document.addEventListener('keyup', function(e) {
	if(e.which === 13) {
		toggleMode()
		hairer = !hairer
	} else if(e.which === 78){
		toggleTheme()
		darker = !darker
	} else if(e.which === 67){
		setBg()
	} else if(e.which === 32 || e.which === 75) {
		pause()
		stoper = !stoper
	}
})