;'use strict';
let context
if (typeof window.AudioContext !== "undefined") {
	context = new window.AudioContext();
} else if (typeof window.webkitAudioContext !== "undefined") {
	context = new webkitAudioContext();
} else if (typeof window.mozAudioContext !== "undefined") {
	context = new mozAudioContext();
}
let gainNode
if(context) {
	gainNode = context.createGain();
	gainNode.connect(context.destination);
	gainNode.gain.value = 0.04;			
}
const ctx = Canvas.getContext('2d')
const width = Canvas.width = innerWidth
const height = Canvas.height = innerHeight
ctx.scale(1,-1)

const generator = new SimplexNoise()
let requested = false
const multiplier = Math.pow(2, 1 / 12)
const frequencies = []
const maxNotes = 100
const notes = []
const plaingNotes = []

let oscillator

frequencies[0] = 0;
frequencies[1] = 27.5;
for (var i = 2; i < maxNotes; i++) {
	frequencies[i] = frequencies[i-1] * multiplier;
}
for (i = 1; i < maxNotes; i++) {
	plaingNotes[i] = false
	notes[i] = {
		number: i,
		frequency: frequencies[i],
		octave: Math.floor((i + 8) / 12),
		octaveKey: (i + 8) % 12,
		dies: false,
		plaing: false,
		shift: Math.round(((i + 8) % 12 + 1.5) * .54545454) / 2,
		/*play: function(){
			if(oscillator){
				oscillator.frequency.value = this.frequency;
			} else {
				if(context) {
					oscillator = context.createOscillator();
					oscillator.type = 'sawtooth';
					oscillator.connect(gainNode);
					oscillator.frequency.value = this.frequency;
					oscillator.start(0);
				}
			}
		}*/
		play: function() {
			if (!this.plaing) {
				//console.log('plaing', this.number)
				this.plaing = true;
				if(context) {
					this.oscillator = context.createOscillator();
					this.oscillator.type = 'sawtooth';
					this.oscillator.connect(gainNode);
					this.oscillator.frequency.value = this.frequency;
					this.oscillator.start(0);
				}
			}
		},
		stop: function() {
			if (this.plaing) {
				//console.log('stopped', this.number)
				this.plaing = false;
				if(this.oscillator) this.oscillator.disconnect();
			}
		}/*
		, stop: function() {
			if(oscillator) {
				oscillator.disconnect();
				oscillator = undefined
			}
		}*/
	};
	switch (notes[i].octaveKey) {
		case 1:	case 3:	case 6:	case 8:	case 10:
			notes[i].dies = true;
			break;
		default:
			notes[i].dies = false;
	}

}

requestAnimationFrame(frame)
let scale = 10
let melody = [28,5]
let keys = [23,25,27,28,30,32,33,35,37,39,40,42,44,45,47,49,51,52,54,56,57]
const melodyLength = 80
let duration
let durationLenght = 0
let total
function frame(){
	let note
	let duration = 0
	for(let i = 2; i < melodyLength+2; i++){
 
		note = generator.noise(i/scale, 5) + 0.5*generator.noise(i/(2*scale), 150)
		//note = Math.floor(note*4+ 4)
		note = Math.abs(note)
		note = Math.floor(note*12	)
		note = keys[note] ||23
		duration = Math.floor(2*generator.noise(i/(0.1*scale), 50) 
			+ generator.noise(i/(0.2*scale), 150) 
			+ 2+1)
		if(duration<=0){duration = 1}
		melody.push(note)
		melody.push(duration)
	}
	melody.push(28)
	melody.push(5)
	let x = 0
	total = 0
	ctx.beginPath()
	for(let i = 0; i < melodyLength+2; i++){
		total+=melody[i*2+1]
	}
	durationLenght = 1000/total
	for(let i = 0; i < melodyLength+2; i++){		
		let note = melody[i*2]
		let duration = melody[i*2+1]
		ctx.fillRect(x-1,note*10-1-500, 3,3)
		ctx.moveTo(x, note*10+.5-500)
		x += duration*durationLenght
		ctx.lineTo(x, note*10+.5-500)
	}
	ctx.stroke()
	console.log(melody)
	let i = 0.5
	if(requested){
		requestAnimationFrame(frame)
	}
}
let index = 0
let note = 0
x = 0
function nextNote(){
	ctx.fillStyle = '#e4f'
	if(!melody[index+1]){
		//notes[note].stop()
		return
	}
	note = melody[index]
	index++
	duration = melody[index]
	index++
	ctx.fillRect(x-3,note*10-3-500, 7,7)
	x += duration*durationLenght
	//gainNode.gain.value = 0.04
	//if(note === 33||note ===37) gainNode.gain.value = 0.0
	//note+=20
	//console.log('starting', note, x-2, note*10-2)
	notes[note+12].play()
	setTimeout(pause,duration*100)
}
function pause(){
	if(notes[note])
		notes[note+12].stop()
	setTimeout(nextNote,duration*25)

}
setTimeout(nextNote,100)
/*addEventListener('keydown', e=>{

	e.code
	if(!requested) {
		requestAnimationFrame(frame)
	}
})*/