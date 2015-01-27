var l = console;
var context = new AudioContext();
var oscillator;
var oscillator2;
var oscillator3;
var gainNode = context.createGain();
gainNode.connect(context.destination);
gainNode.gain.value = 0.04;
var rangeOscillator;
var graphNote = [];
var graphDies = [];
var i = 0;
for (i = 0; i < 7; i++) {
	graphNote[i] = document.getElementById('note' + (i + 1));
	graphDies[i] = document.getElementById('dies' + (i + 1));
}
var cursorClick = 0;
var ctx = cnv.getContext('2d');
var minor = 0;
var waveDuration = 0.03; //canvas seconds;
var amplitude;
var divider;
var result = 27.5;
var plaingNotes = [];
var frequencies = [];
frequencies[0] = 0;
frequencies[1] = 27.5;
var multiplier = Math.pow(2, 1 / 12);
for (var i = 2; i < 100; i++) {
	result *= multiplier;
	frequencies[i] = result;
}
var notes = {};
var j = 0;
for (i = 1; i < 100; i++) {
	plaingNotes[i] = false;
	notes[i] = {
		number: i,
		frequency: frequencies[i],
		octave: Math.floor((i + 8) / 12),
		octaveKey: (i + 8) % 12,
		dies: false,
		plaing: false,
		button: document.getElementById(i),
		shift: Math.round(((i + 8) % 12 + 1.5) * .54545454) / 2,
		play: function() {
			if (!this.plaing) {
				this.oscillator = context.createOscillator();
				this.plaing = true;
				this.oscillator.type = 0;
				this.oscillator.connect(gainNode);
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
	if (notes[i].octaveKey === 1 ||
		notes[i].octaveKey === 3 ||
		notes[i].octaveKey === 6 ||
		notes[i].octaveKey === 8 ||
		notes[i].octaveKey === 10) {
		notes[i].dies = true;
	} else {
		notes[i].dies = false;
	}
}
var thread;
var note;
var lastNote = 2;
var noteCarret = 8;
var wavetable = [];
var minor;
var alteration;

var paper = Raphael("guitarneck", 935, 180);
for (i = 0; i < 6; i++) {
	paper.path("M35 " + (15.5 + i * 30) + "L935 " + (15.5 + i * 30));
}
paper.path("M40 15L40 165");
for (i = 0; i < 18; i++) {
	paper.path("M" + (35 + i * 50) + " 15L" + (35 + i * 50) + " 165");
}
paper.circle(160, 90, 6);
paper.circle(260, 90, 6);
paper.circle(360, 90, 6);
paper.circle(460, 90, 6);
paper.circle(610, 30, 6);
paper.circle(610, 150, 6);
paper.circle(760, 90, 6);
paper.circle(860, 90, 6);

var circles = [];
for (i = 0; i < 6; i++) {
	circles[i] = paper.circle(50, 15.5 + i * 30, 8).attr({
		fill: "#666"
	}).hide();
}
circles[0].attr({
	fill: "#F7F73E"
});
circles[1].attr({
	fill: "#1bc2ff"
});
circles[2].attr({
	fill: "#FAA341"
});
circles[3].attr({
	fill: "#b6effb"
});

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
			noteCarret += 3;
			play(null, note - 32);
		}
		if (cmd === 8) {

			return stop(null, note - 32);
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

function play(event, keynumber) {
	//l.log(event)
	if (event) {
		noteCarret += 3;
		cursorClick = keynumber = Number(event.target.dataset.key);
		if (isNaN(keynumber)) return;
		minorChord.checked = event.shiftKey ? true : false;
		minor = event.shiftKey ? -1 : 0;
	}
	note = notes[keynumber];
	//l.log(keynumber);
	if (note === undefined) return;
	l.log('   ' + note.button.innerText)
	note.play();
	graphNotes(note);
	plaingNotes[keynumber] = true;

	frequencyDisplay.value = note.frequency.toFixed(4);
	frequencyRange.value = note.frequency;
	gainNode.gain.value = volumeRange.value / 100;

	if (majorThird.checked) {
		notes[keynumber + 4 + minor].play();
		graphNotes(notes[keynumber + 4 + minor]);
		plaingNotes[keynumber + 4 + minor] = true;
	}

	if (perfectFifth.checked) {
		notes[keynumber + 7].play();
		graphNotes(notes[keynumber + 7]);
		plaingNotes[keynumber + 7] = true;
	}

	drawSin();
}

function graphNotes(note) {
	if (++lastNote == graphNote.length) lastNote = 0;
	//graphNote[lastNote].style.left = (note.octave * 10.5 + note.octaveKey * .86) - 7.5 + 'em';
	//noteCarret += 3;
	if (noteCarret > 92) noteCarret = 8;
	graphNote[lastNote].style.left = noteCarret + '%';
	if (note.octave > 5) {
		alteration = 3.5 * (note.octave - 5);
	} else if (note.octave < 2) {
		alteration = -3.5 * (2 - note.octave);
	} else {
		alteration = 0
	}
	graphNote[lastNote].style.top = (20 - note.octave * 3.5 - note.shift + alteration) + 'em';
	if (note.dies) {
		graphDies[lastNote].style.visibility = "visible";
		//graphDies[lastNote].style.left = (note.octave * 10.5 + note.octaveKey * .86) - 8.1 + 'em';

		graphDies[lastNote].style.left = (noteCarret - .8) + '%';
		graphDies[lastNote].style.top = (22.6 - note.octave * 3.5 - note.shift + alteration) + 'em';
	} else {
		graphDies[lastNote].style.visibility = "hidden";
	}

	i = note.number - 32;
	j = 0;
	if (i >= 0 && i < 38) {
		if (i > 18) {
			j = 1
		};
		circles[0].show();
		circles[0].attr({
			cx: 10 + i * 50 - j * 950,
			cy: 165 - j * 120
		});
	}
	j = 0;
	if (i > 4 && i < 43) {
		if (i > 23) {
			j = 1
		};
		circles[1].show();
		circles[1].attr({
			cx: i * 50 - 240 - j * 950,
			cy: 135 - j * 120
		});
	}
	j = 0;
	if (i > 9 && i < 29) {
		circles[2].show();
		circles[2].attr({
			cx: i * 50 - 490,
			cy: 105
		});
	}
	j = 0;
	if (i > 14 && i < 34) {
		circles[3].show();
		circles[3].attr({
			cx: i * 50 - 740 - j * 600,
			cy: 75 - j * 90
		});
	}
}

function stop(event, note) {
	if (event !== null) {
		note = cursorClick;
	}
	if (note) {
		plaingNotes[note] = false;
		notes[note].stop();
		if (majorThird.checked) {
			notes[note + 4 + minor].stop();
			plaingNotes[note + 4 + minor] = false;
		}
		if (perfectFifth.checked) {
			notes[note + 7].stop();
			plaingNotes[note + 7] = false;
		}
	}
	circles[0].hide();
	circles[1].hide();
	circles[2].hide();
	circles[3].hide();
}

function drawSin() {
	amplitude = cnv.height / 2;
	divider = 0;
	ctx.clearRect(0, 0, cnv.width, cnv.height);

	for (var j = 1; j < 100; j++) {
		if (plaingNotes[j]) {
			divider++;
		}
	}
	if (divider > 1) {
		for (i = 0; i <= cnv.width; i++) {
			wavetable[i] = 0;
		}
	}
	for (var j = 1; j < 100; j++) {
		if (plaingNotes[j]) {
			ctx.strokeStyle = "rgba(0,0," + Math.floor(j * 2 + 50) + ",1)";
			ctx.beginPath();
			ctx.moveTo(0, amplitude);
			r1 = Math.PI * 2 * notes[j].frequency * waveDuration / cnv.width;
			for (i = 0; i <= cnv.width; i++) {
				result = Math.sin(r1 * i);
				if (divider > 1) {
					wavetable[i] += result;
				}
				ctx.lineTo(i, (1 - result / divider) * amplitude);
			}
			ctx.stroke();
		}
	}
	if (divider > 1) {
		ctx.strokeStyle = "rgba(200,0,50,1)";
		ctx.beginPath();
		ctx.moveTo(0, amplitude);
		for (i = 0; i <= cnv.width; i++) {
			ctx.lineTo(i, (1 - wavetable[i] / divider) * amplitude);
		}
		ctx.stroke();
	}
}

function playRange(event) {
	if (!rangeOscillator) {
		rangeOscillator = context.createOscillator();
		rangeOscillator.type = 3;
		rangeOscillator.connect(gainNode);
		rangeOscillator.start(0);
	}
	if (event.target.type === "range") {
		rangeOscillator.frequency.value = frequencyRange.value;
		frequencyDisplay.value = frequencyRange.value + " Гц";
	} else {
		rangeOscillator.frequency.value = parseFloat(frequencyDisplay.value);
		frequencyRange.value = parseFloat(frequencyDisplay.value);
	}
}

function stopRange(event) {
	rangeOscillator.disconnect();
	rangeOscillator = null;
}

cnv.width = document.body.clientWidth - 20;
cnv.height = 256;
waveDuration = cnv.width * 0.00003;

keyboard.addEventListener('mousedown', play, false);
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
keyboard.addEventListener('mouseup', stop, false);
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
frequencyRange.addEventListener('change', playRange, false);
buttonStart.addEventListener('click', playRange, false);
buttonStop.addEventListener('click', stopRange, false);
volumeRange.addEventListener('change', function() {
	gainNode.gain.value = volumeRange.value / 100;
}, false);




//========================================================================
var nMelodyInterval;
var synchronizedTime = Date.now();
var nBeginMelody;
var bDrawedNote = false;
var durationTypes = {
	"1": 16,
	"2": 8,
	"3": 6,
	"4": 4,
	"6": 3,
	"8": 2,
	"12": 1.5,
	"16": 1
};
var tempo = 100;
var nMelodySize = durationTypes["1"] * tempo //16 *100 = 1600 4/4
var nMelodyPart;
buttonMelody.addEventListener('click', function() {
	nBeginMelody = Date.now();
	nMelodyPart = 0;
	for (thread = 0; thread < threads.length; thread++) {
		threads[thread].position = 0;
		threads[thread].getNextChange();
	};
	if (nMelodyInterval === undefined) {
		nMelodyInterval = setInterval(playMelody, tempo)
	} else {		
		clearInterval(nMelodyInterval);
		nMelodyInterval = undefined
		for (i = 1; i < 100; i++) {
			plaingNotes[i] = false;
			notes[i].stop();
		}
	}
}, false);
tempoRange.addEventListener('change', function() {
	tempo = 1000 - tempoRange.value;
}, false);

function Thread(record) {
	this.record = record;
	this.position = 0;
	//this.nextChage = synchronizedTime + 1000;
	this.nNextMelodyPart = undefined;
	//this.noteDuration = undefined;
	this.getNextChange = function() {
		if (this.record[this.position].length > 4) {
			this.nNextMelodyPart =  nMelodyPart + durationTypes[this.record[this.position].slice(4)]*2;

		} else {
			this.nNextMelodyPart =  nMelodyPart + durationTypes[this.record[this.position].slice(3)]*2;
		}
	}
	this.changeNote = function() {
		if (this.position !== 0) {
			if (this.record[this.position - 1][0] !== "P") {
				stop(null, noteIndex(this.record[this.position - 1]));
			}
		}
		if (this.position > this.record.length - 1) {
			clearInterval(nMelodyInterval);
			return;
		}
		if (this.record[this.position][0] !== "P") {
			bDrawedNote = true;
			l.log('bDrawedNote');
			if (!plaingNotes[noteIndex(this.record[this.position])]) play(null, noteIndex(this.record[this.position]));
		};
		this.position++;
	}
}

var threads = [];
threads[0] = new Thread('PA/4 G4/8 C5/8 D5/8 ' +
	'Eb5/3 D5/8 Eb5/2 ' +
	'Eb5/8 F5/8 D5/8 C5/8 D5/2 ' +
	'D5/8 Eb5/8 C5/8 Bb4/8 C5/3 Bb4/8 ' +
	
	'G4/2 PA/8 G4/8 C5/8 D5/8 ' +
	'Eb5/3 D5/8 Eb5/2 ' +
	'Eb5/8 F5/8 D5/8 C5/8 D5/2 ' +
	'D5/8 Eb5/8 C5/8 Bb4/8 C5/3 Bb4/8 ' +

	'C5/2 PA/8 G4/8 C5/8 D5/8 ' +
	'Eb5/3 D5/8 Eb5/2 ' +
	'Eb5/8 F5/8 D5/8 C5/8 D5/2 ' +
	'D5/8 Eb5/8 C5/8 Bb4/8 C5/3 Bb4/8 ' +
	'G4/2 PA/8 C5/8 D5/8 ' +
	'Eb5/3 D5/8 Eb5/2 ' +
	'Eb5/8 F5/8 D5/8 C5/8 D5/2 ' +
	'D5/8 Eb5/8 C5/8 Bb4/8 C5/3 Bb4/8 ' +
	'C5/2 PA/8 D5/8 Eb5/8 Bb5/8 ' +
	'Bb5/8 C6/4 C6/8 C6/8 D6/8 Bb5/8 Ab5/8 ' +
	'Bb5/16 Bb5/16 Bb5/3 F4/8 PA/8 D5/8 E5/8 G5/8 ' +
	'G5/8 Ab5/4 Ab/8 Ab/8 Bb/8 G5/8 F5/8 ' +
	'G5/2 PA/4 D5/8 Eb5/8 Bb5/8 ' +
	'C6/3 C6/8 C6/8 D6/8 Bb5/8 A5/8 ' +
	'Bb5/3 Bb5/8 Bb5/8 C6/8 Ab5/8 G5/8 ' +
	'Ab5/2 PA/8 Bb5/8 G5/8 F5/8 ' +
	'G5/2 G4/8 G4/8 C5/8 D5/8 ' +
	'Eb5/3 D5/8 Eb5/2 ' +
	'Eb5/8 F5/8 D5/8 C5/8 D5/2 ' +
	'D5/8 Eb5/8 C5/8 Bb4/8 C5/3 Bb/8 ' +
	'G4/2 PA/8 G4/8 C5/8 D5/8 ' +
	'Eb5/3 D5/8 Eb5/2 ' +
	'Eb5/8 F5/8 D5/8 C5/8 D5/2 ' +
	'D5/8 Eb5/8 C5/8 Bb4/8 C5/3 Bb4/8 ' +
	'C4/1' +
	'D5/8 Eb5/8 C5/8 Bb4/8 C5/3 Bb/8 ' +
	'C5/1'
);
threads[1] = new Thread('PA/4 PA/3 C3/8 G3/8 Eb4/4 F2/8 C3/8 Ab3/4 ' +
	'Bb2/8 F3/8 D4/4 Eb2/8 Bb2/8 G3/8 D4/8 ' +
	'Ab2/8 Eb3/8 C4/4 F2/8 C3/8 Ab3/4 ' +

	'G2/8 D3/8 G3/8 A3/8 B3/4 G2/4 ' +
	'C3/8 G3/8 Eb4/8 F4/8 F2/8 C3/8 Ab3/8 C4/8 ' +
	'Bb2/8 F3/8 C4/8 D4/8 Eb2/8 Bb2/8 G3/8 D4/8 ' +
	'Ab2/8 Eb2/8 C4/4 F2/8 C3/8 Ab3/4 ' +

	'C3/8 G3/8 C4/8 D4/8 Eb4/4 G3/4 ' +

	'C3/8 G3/8 Eb4/4 F2/8 C3/8 Ab3/4 ' +
	'Bb2/8 F3/8 D4/4 Eb2/8 Bb2/8 G3/8 D4/8 ' +
	'Ab2/8 Eb3/8 C4/4 F2/8 C3/8 Ab3/4 ' +
	'G2/8 D3/8 G3/8 A3/8 B3/4 G2/4 ' +
	'C3/8 G3/8 Eb4/8 F4/8 F2/8 C3/8 Ab3/8 C4/8 ' +
	'Bb2/8 F3/8 C4/8 D4/8 Eb2/8 Bb2/8 G3/8 D4/8 ' +
	'Ab2/8 Eb2/8 C4/4 F2/8 C3/8 Ab3/4 ' +

	'C3/8 Eb3/8 G3/8 C4/8 Eb4/8 G4/8 C5/8 G4/8 ' +
	'Ab2/8 Eb3/8 Ab3/8 C4/8 Bb2/8 F3/8 Bb3/8 D4/8 ' +
	'G2/8 D3/8 G3/8 Bb3/8 C3/8 G3/8 C4/8 Eb4/8 ' +


	'F2/8 C3/8 F3/8 Ab3/8 Bb2/8 F3/8 Bb3/8 D4/8 ' +
	'Eb2/8 Bb2/8 Eb3/8 G3/8 Bb3/8 Eb3/8 C3/8 Bb3/8 ' +
	'A2/8 Eb3/8 G3/8 C4/8 Fd2/8 D3/8 A3/8 C4/8 ' +
	'G2/8 D3/8 G3/8 Bb3/8 E2/8 C3/8 G3/8 Bb3/8 ' +

	'F2/8 C3/8 F3/8 Ab3/8 Eb2/8 C3/8 F3/8 Ab3/8 ' +
	'D2/8 C3/8 D3/8 G3/8 G2/4 G1/4 ' +
	'C3/8 G3/8 Eb4/4 F2/8 C3/8 Ab3/8 ' +
	'Bb2/8 F3/8 D4/8 Eb2/8 Bb2/8 G3/8 D4/8 ' +

	'Ab2/8 Eb3/8 C4/4 F2/8 C3/8 Ab3/4 ' +
	'G2/8 D3/8 G3/8 A3/8 B3/4 D4/4 ' +
	'C3/8 G3/8 Eb4/8 F4/8 F2/8 C3/8 Ab3/8 C4/8 ' +
	'Bb2/8 F3/8 C4/8 D4/8 E2/8 Bb2/8 G3/8 D4/8 ' +

	'Ab2/8 Eb3/8 C4/4 F2/8 C3/8 Ab3/4 ' +
	'C3/8 G3/8 C4/8 D4/8 Eb4/4 G4/4 ' +
	'Ab2/8 Eb3/8 C4/4 G2/8 D3/8 Bb3/4' +
	'C3/8 G3/8 C4/8 D4/8 Eb4/2'
);
threads[2] = new Thread('PA/4 PA/3 PA/1 PA/1 PA/1 PA/1 PA/2 G4/2 PA/1 Ab4/8 PA/6 PA/2 PA/1 PA/1 PA/1 PA/1 PA/1 PA/2 G4/2 PA/1 Ab4/8 PA/6 PA/2 PA/1 PA/1 PA/2 Eb4/2 PA/1 PA/4 D5/4 C5/2 PA/1 PA/1 PA/1 PA/1 PA/1 PA/1 PA/1 PA/2 PA/4 G4/4 PA/2 G4/2 PA/1 Ab4/8 PA/3 PA/2 PA/1	Ab4/8');
for (i = threads.length - 1; i >= 0; i--) {
	threads[i].record = threads[i].record.split(" ");
};
var noteTypes = {
	"C": 1,
	"D": 3,
	"E": 5,
	"F": 6,
	"G": 8,
	"A": 10,
	"B": 12
};
var noteDuration = 0;
var octave;
var dies;

function noteIndex(str) {
	if (str.length > 4) {
		if (str[1] === "b") {
			dies = -1;
		} else if (str[1] === "d") {
			dies = 1;
		} else {
			dies = 0;
		}
		octave = str[2];
	} else {
		dies = 0;
		octave = str[1];
	}
	return octave * 12 + noteTypes[str[0]] + dies - 9;
}

function playMelody() {
	synchronizedTime = Date.now();
	bDrawedNote = false;
	if ((synchronizedTime-nBeginMelody)%nMelodySize>nMelodyPart) {
		nMelodyPart++;
		l.log(nMelodyPart)
	}
	for (thread = 0; thread < threads.length; thread++) {
		//l.log('qwe ', threads[thread].nNextMelodyPart)
		if (threads[thread].nNextMelodyPart === nMelodyPart) {
			threads[thread].getNextChange();
			threads[thread].changeNote();
		}
	}
	if (bDrawedNote) noteCarret += 3.1;
}