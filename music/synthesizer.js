//var listOfModules = ['keyboard', 'options', 'stave', 'guitar', 'wave'];
function updateModules(event) {
		console.log(event.target);
	if(event.target.checked){
		var module = event.target.id;
	}
}
function PlayEvent(noteNumber){
	document.dispatchEvent(new CustomEvent("note", {detail: {note: noteNumber}}));
}


var core = {
	context: null,
	gainNode: null,
	oscillator: null,
	oscillator2: null,
	oscillator3: null,
	cursorClick: 0,
	plaingNotes: [],
	frequencies: [],
	multiplier: Math.pow(2, 1 / 12),
	maxNotes: 100,
	notes: [],
	init: function(){
		this.context = new AudioContext(),
		this.gainNode = this.context.createGain();
		this.gainNode.connect(this.context.destination);
		this.gainNode.gain.value = 0.04;
		this.frequencies[0] = 0;
		this.frequencies[1] = 27.5;
		for (var i = 2; i < this.maxNotes; i++) {
			this.frequencies[i] = this.frequencies[i-1] * this.multiplier;
		}
		for (i = 1; i < this.maxNotes; i++) {
			this.plaingNotes[i] = false;
			this.notes[i] = {
				number: i,
				frequency: core.frequencies[i],
				octave: Math.floor((i + 8) / 12),
				octaveKey: (i + 8) % 12,
				dies: false,
				plaing: false,
				button: document.getElementById(i),
				shift: Math.round(((i + 8) % 12 + 1.5) * .54545454) / 2,
				play: function() {
					if (!this.plaing) {
						this.oscillator = core.context.createOscillator();
						this.plaing = true;
						this.oscillator.type = 0;
						this.oscillator.connect(core.gainNode);
						this.oscillator.frequency.value = this.frequency;
						this.oscillator.start(0);
						this.button.classList.add("pressed");
					}
				},
				stop: function() {
					if (this.plaing) {
						this.plaing = false;
						this.button.classList.remove("pressed");
						this.oscillator.disconnect();
					}
				}
			};
			switch (this.notes[i].octaveKey) {
				case 1:	case 3:	case 6:	case 8:	case 10:
					this.notes[i].dies = true;
					break;
				default:
					this.notes[i].dies = false;
			}
		}
		window.addEventListener('load', function(e) {
			var decodeMessage, midiMessageReceived, synth;
			decodeMessage = function(msg) {
				var channel, cmd, note, vel;
				cmd = msg.data[0] >> 4;
				channel = msg.data[0] & 0xf;
				note = msg.data[1];
				vel = msg.data[2];
				minorChord.checked = msg.shiftKey ? true : false;
				minor = msg.shiftKey ? -1 : 0;
				if (cmd === 9) {
					stave.noteCarret += 3;
					core.play(null, note - 32);
				}
				if (cmd === 8) {

					return core.stop(null, note - 32);
				}
			};
			midiMessageReceived = function(msgs) {
				var msg, _i, _len, _results;
				_results = [];
				for (_i = 0, _len = msgs.length; _i < _len; _i++) {
					msg = msgs[_i];
					_results.push(decodeMessage(msg));
				}
				return _results;
			};
			return MIDIKeys.onmessage = midiMessageReceived;
		});
	},
	play: function(event, keynumber) {
		if (event) {
			stave.noteCarret += 3;
			core.cursorClick = keynumber = Number(event.target.id);
			if (isNaN(keynumber)) return;
			minorChord.checked = event.shiftKey ? true : false;
			minor = event.shiftKey ? -1 : 0;
		}
		var note = core.notes[keynumber];
		PlayEvent(keynumber);
		if (note === undefined) return;
		note.play();
		stave.graphNotes(note);
		core.plaingNotes[keynumber] = true;

		frequencyDisplay.value = note.frequency.toFixed(4);
		frequencyRange.value = note.frequency;
		core.gainNode.gain.value = volumeRange.value / 100;

		if (majorThird.checked) {
			core.notes[keynumber + 4 + minor].play();
			stave.graphNotes(core.notes[keynumber + 4 + minor]);
			core.plaingNotes[keynumber + 4 + minor] = true;
		}

		if (perfectFifth.checked) {
			core.notes[keynumber + 7].play();
			stave.graphNotes(core.notes[keynumber + 7]);
			core.plaingNotes[keynumber + 7] = true;
		}

		wave.drawSin();
	},
	stop: function(event, note) {
		if (event !== null) {
			note = core.cursorClick;
		}
		if (note) {
			core.plaingNotes[note] = false;
			core.notes[note].stop();
			if (majorThird.checked) {
				core.notes[note + 4 + minor].stop();
				core.plaingNotes[note + 4 + minor] = false;
			}
			if (perfectFifth.checked) {
				core.notes[note + 7].stop();
				core.plaingNotes[note + 7] = false;
			}
		}
		guitar.circles[0].hide();
		guitar.circles[1].hide();
		guitar.circles[2].hide();
		guitar.circles[3].hide();
	}

}
core.init();

// stave
var stave = {
	graphNote: [],
	graphDies: [],
	lastNote: 2,
	noteCarret: 8,
	init: function() {
		for (var i = 0; i < 7; i++) {
			this.graphNote[i] = document.getElementById('note' + (i + 1));
			this.graphDies[i] = document.getElementById('dies' + (i + 1));
		}
	},
	graphNotes: function(note) {
		var alteration;
		if (++this.lastNote == this.graphNote.length) this.lastNote = 0;
		//this.graphNote[this.lastNote].style.left = (note.octave * 10.5 + note.octaveKey * .86) - 7.5 + 'em';
		//this.noteCarret += 3;
		if (this.noteCarret > 92) this.noteCarret = 8;
		this.graphNote[this.lastNote].style.left = this.noteCarret + '%';
		if (note.octave > 5) {
			alteration = 3.5 * (note.octave - 5);
		} else if (note.octave < 2) {
			alteration = -3.5 * (2 - note.octave);
		} else {
			alteration = 0
		}
		this.graphNote[this.lastNote].style.top = (20 - note.octave * 3.5 - note.shift + alteration) + 'em';
		if (note.dies) {
			this.graphDies[this.lastNote].style.visibility = "visible";
			//this.graphDies[this.lastNote].style.left = (note.octave * 10.5 + note.octaveKey * .86) - 8.1 + 'em';

			this.graphDies[this.lastNote].style.left = (this.noteCarret - .8) + '%';
			this.graphDies[this.lastNote].style.top = (22.6 - note.octave * 3.5 - note.shift + alteration) + 'em';
		} else {
			this.graphDies[this.lastNote].style.visibility = "hidden";
		}
	// guitar
		var i = note.number - 32;
		var j = 0;
		if (i >= 0 && i < 38) {
			if (i > 18) {
				j = 1
			};
			guitar.circles[0].show();
			guitar.circles[0].attr({
				cx: 10 + i * 50 - j * 950,
				cy: 165 - j * 120
			});
		}
		j = 0;
		if (i > 4 && i < 43) {
			if (i > 23) {
				j = 1
			};
			guitar.circles[1].show();
			guitar.circles[1].attr({
				cx: i * 50 - 240 - j * 950,
				cy: 135 - j * 120
			});
		}
		j = 0;
		if (i > 9 && i < 29) {
			guitar.circles[2].show();
			guitar.circles[2].attr({
				cx: i * 50 - 490,
				cy: 105
			});
		}
		j = 0;
		if (i > 14 && i < 34) {
			guitar.circles[3].show();
			guitar.circles[3].attr({
				cx: i * 50 - 740 - j * 600,
				cy: 75 - j * 90
			});
		}
	}

}
stave.init();

var wave = {
	cnv: document.getElementById('cnv'),
	rangeOscillator: null,
	waveDuration: this.cnv.width * 0.00003, //canvas seconds
	ctx: this.cnv.getContext('2d'), //canvas waveTable
	amplitude: 0,
	divider: 0, //canvas wave components count
	result: 27.5,
	wavetable: [],
	init: function () {
		cnv.width = document.body.clientWidth - 90;
		cnv.height = 256;
	},	
	drawSin: function () {
		this.amplitude = this.cnv.height / 2;
		this.divider = 0;
		this.ctx.clearRect(0, 0, this.cnv.width, this.cnv.height);

		for (var j = 1; j < core.maxNotes; j++) {
			if (core.plaingNotes[j]) {
				this.divider++;
			}
		}
		if (this.divider > 1) {
			for (i = 0; i <= this.cnv.width; i++) {
				this.wavetable[i] = 0;
			}
		}
		for (var j = 1; j < core.maxNotes; j++) {
			if (core.plaingNotes[j]) {
				this.ctx.strokeStyle = "rgba(0,0," + Math.floor(j * 2 + 50) + ",1)";
				this.ctx.beginPath();
				this.ctx.moveTo(0, this.amplitude);
				var r1 = Math.PI * 2 * core.notes[j].frequency * this.waveDuration / this.cnv.width;
				for (i = 0; i <= this.cnv.width; i++) {
					this.result = Math.sin(r1 * i);
					if (this.divider > 1) {
						this.wavetable[i] += this.result;
					}
					this.ctx.lineTo(i, (1 - this.result / this.divider) * this.amplitude);
				}
				this.ctx.stroke();
			}
		}
		if (this.divider > 1) {
			this.ctx.strokeStyle = "rgba(200,0,50,1)";
			this.ctx.beginPath();
			this.ctx.moveTo(0, this.amplitude);
			for (i = 0; i <= this.cnv.width; i++) {
				this.ctx.lineTo(i, (1 - this.wavetable[i] / this.divider) * this.amplitude);
			}
			this.ctx.stroke();
		}
	},
	playRange: function(event) {
		if (!wave.rangeOscillator) {
			wave.rangeOscillator = core.context.createOscillator();
			wave.rangeOscillator.type = 3;
			wave.rangeOscillator.connect(core.gainNode);
			wave.rangeOscillator.start(0);
		}
		if (event.target.type === "range") {
			wave.rangeOscillator.frequency.value = frequencyRange.value;
			frequencyDisplay.value = frequencyRange.value + " Гц";
		} else {
			wave.rangeOscillator.frequency.value = parseFloat(frequencyDisplay.value);
			frequencyRange.value = parseFloat(frequencyDisplay.value);
		}
	},
	stopRange: function(event) {
		wave.rangeOscillator.disconnect();
		wave.rangeOscillator = null;
	}
}
wave.init();


//options
var minor = 0;


var guitar = {
	paper: Raphael("guitarneck", 920, 180),
	circles: [],
	init: function() {
		var numberOfStrings = 6;
		for (var i = 0; i < numberOfStrings; i++) {
			this.paper.path("M35 " + (15.5 + i * 30) + "L935 " + (15.5 + i * 30));
		}
		var numberOfFrets = 18;
		this.paper.path("M40 15L40 165");
		for (var i = 0; i < numberOfFrets; i++) {
			this.paper.path("M" + (35 + i * 50) + " 15L" + (35 + i * 50) + " 165");
		}
		this.paper.circle(160, 90, 6);
		this.paper.circle(260, 90, 6);
		this.paper.circle(360, 90, 6);
		this.paper.circle(460, 90, 6);
		this.paper.circle(610, 30, 6);
		this.paper.circle(610, 150, 6);
		this.paper.circle(760, 90, 6);
		this.paper.circle(860, 90, 6);
		for (var i = 0; i < numberOfStrings; i++) {
			this.circles[i] = this.paper.circle(50, 15.5 + i * 30, 8).attr({
				fill: "#666"
			}).hide();
		}
		this.circles[0].attr({
			fill: "#F7F73E"
		});
		this.circles[1].attr({
			fill: "#1bc2ff"
		});
		this.circles[2].attr({
			fill: "#FAA341"
		});
		this.circles[3].attr({
			fill: "#b6effb"
		});
	}	
	
}
guitar.init();



tools.addEventListener('mousedown', updateModules, false);


keyboard.addEventListener('mousedown', core.play, false);


keyboard.addEventListener('touchstart', function(e) {
	e.preventDefault();
	var clkEvt = document.createEvent('MouseEvent');
	clkEvt.initMouseEvent('mousedown', true, true, window, e.detail,
		e.touches[0].screenX, e.touches[0].screenY,
		e.touches[0].clientX, e.touches[0].clientY,
		false, false, false, false,
		0, null);
	e.target.dispatchEvent(clkEvt);
}, false);


keyboard.addEventListener('mouseup', core.stop, false);


keyboard.addEventListener('touchend', function(e) {
	e.preventDefault();
	var clkEvt = document.createEvent('MouseEvent');
	clkEvt.initMouseEvent('mouseup', true, true, window, e.detail,
		e.changedTouches[0].screenX, e.changedTouches[0].screenY,
		e.changedTouches[0].clientX, e.changedTouches[0].clientY,
		false, false, false, false,
		0, null);
	e.target.dispatchEvent(clkEvt);
}, false);


frequencyRange.addEventListener('change', wave.playRange, false);

buttonStart.addEventListener('click', wave.playRange, false);
buttonStop.addEventListener('click', wave.stopRange, false);
volumeRange.addEventListener('change', function() {
	core.gainNode.gain.value = volumeRange.value / 100;
}, false);


document.addEventListener('note', playNote, false);
function playNote(event) {
	//console.log(event.detail.note);
}
PlayEvent(69);