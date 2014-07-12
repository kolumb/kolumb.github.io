var context = new AudioContext();
var oscillator;
var oscillator2;
var oscillator3;
var gainNode = context.createGain();
gainNode.connect(context.destination);
gainNode.gain.value = 0.04;
var rangeOscillator;

var keyboard = document.getElementById('keyboard');
var majorThird = document.getElementById('majorThird');
var perfectFifth = document.getElementById('perfectFifth');
var minorChord = document.getElementById('minorChord');
var volume = document.getElementById('volume');
var note1 = document.getElementById('note1');
var note2 = document.getElementById('note2');
var note3 = document.getElementById('note3');
var dies1 = document.getElementById('dies1');
var dies2 = document.getElementById('dies2');
var dies3 = document.getElementById('dies3');
var frequencyRange = document.getElementById('frequencyRange');
var frequencyDisplay = document.getElementById('frequencyDisplay');
var buttonStop = document.getElementById('buttonStop');
var cursorClick = 0;
var cnv = document.getElementById('cnv');
var ctx = cnv.getContext('2d');

var third = false;
var fifth = false;
var minor = 0;
var duration = 0.03; //canvas seconds;
var amplitude;
var divider;
var result = 27.5;
var frequencies = [100];
frequencies[0] = 0;
frequencies[1] = 27.5;
var multiplier = Math.pow(2, 1 / 12);
for (var i = 2; i < 100; i++) {
	result *= multiplier;
	frequencies[i] = result;
}
var notes = {};
for (var i = 1; i < 100; i++) {
	register[i] = {};
	note = notes[i];
	note.frequency = frequencies[i];
	note.octave = Math.floor((i + 8) / 12);
	note.octavekey = (i + 8) % 12;
	note.dies = false;
	if (note.octavekey===1 || 
		note.octavekey===3 || 
		note.octavekey===6 || 
		note.octavekey===8 || 
		note.octavekey===10) {
		note.dies = true;
	}else{
		note.dies = false;
	}
}
console.log(register["0"]);
console.log(register["1"]);
console.log(register["2"]);
var plaingKeys = [88];
var frequency;
var frequency2;
var frequency3;
var octave = 0;
var data;
var r1 = 0;
var r2 = 0;
var r3 = 0;
var minor;
var nodes = [];
var waveTable = [];

var buttons = [];
for (var i = 1; i <= 88; i++) {
	buttons[i] = document.getElementById(i);
};

window.addEventListener('load', function(e) {
	var decodeMessage, midiMessageReceived, synth;
	decodeMessage = function(msg) {
		var channel, cmd, note, vel;
		cmd = msg.data[0] >> 4;
		channel = msg.data[0] & 0xf;
		note = msg.data[1];
		vel = msg.data[2];
		if (msg.shiftKey) {
			minorChord.checked = true;
			minor = -1;
		} else {
			minorChord.checked = false;
			minor = 0;
		}
		if (cmd === 9) {
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

	//init
	if (event) {
		keynumber = Number(event.target.dataset.key);
		if (event.shiftKey) {
			minorChord.checked = true;
			minor = -1;
		} else {
			minorChord.checked = false;
			minor = 0;
		}
		cursorClick = keynumber;
		if (isNaN(keynumber)) return;
	}
	third = false;
	fifth = false;
	frequency = frequencies[keynumber];
	frequencyDisplay.value = frequency;
	frequencyRange.value = frequency;

	//update		
	buttons[keynumber].classList.add("pressed");
	gainNode.gain.value = volume.value / 100;

	//create
	oscillator = context.createOscillator();
	//registrate
	nodes[keynumber] = oscillator;
	plaingKeys[keynumber] = oscillator;
	//configure
	octave = Math.floor((keynumber + 8) / 12);
	octavekey = (keynumber + 8) % 12;
	adder = octavekey > 4 ? 1 : 0;
	adder = octavekey === 11 ? 2 : adder;
	shift = Math.floor((octavekey + adder) * .5) / 2;
	// 0 1 2 3 4 5 6 7 8 9 10 11
	// 0 0 1 1 2 3 3 4 4 5 5  6
	if (shift !== 0) {
		dies1.style.visibility = "visible";
		dies1.style.left = (octave * 10.5 + octavekey * .86) - 8.1 + 'em';
		dies1.style.top = (23.1 - octave * 3.5 - shift) + 'em';
	} else {
		dies1.style.visibility = "hidden";
	}

	note1.style.left = (octave * 10.5 + octavekey * .86) - 7.5 + 'em';
	note1.style.top = (20.5 - octave * 3.5 - shift) + 'em';

	oscillator.type = 0;
	oscillator.connect(gainNode);
	oscillator.frequency.value = frequency;
	oscillator.start(0);

	if (majorThird.checked) {
		oscillator2 = context.createOscillator();
		oscillator2.type = 0;
		oscillator2.connect(gainNode);
		third = true;
		buttons[keynumber + 4 + minor].classList.add("pressed");
		frequency2 = frequencies[keynumber + 4 + minor];
		oscillator2.frequency.value = frequency2;
		oscillator2.start(0);
		plaingKeys[keynumber + 4 + minor] = oscillator;


		octave = Math.floor((keynumber + 12 + minor) / 12);
		octavekey = (keynumber + 12 + minor) % 12;
		adder = octavekey > 4 ? 1 : 0;
		adder = octavekey === 11 ? 2 : adder;
		shift = Math.floor((octavekey + adder) * .5) / 2;
		note2.style.left = (octave * 10.5 + octavekey * .86) - 7.5 + 'em';
		note2.style.top = (20.5 - octave * 3.5 - shift) + 'em';
	}

	if (perfectFifth.checked) {
		oscillator3 = context.createOscillator();
		oscillator3.type = 0;
		oscillator3.connect(gainNode);
		fifth = true;
		buttons[keynumber + 7].classList.add("pressed");
		frequency3 = frequencies[keynumber + 7];
		oscillator3.frequency.value = frequency3;
		oscillator3.start(0);
		plaingKeys[keynumber + 7] = oscillator;

		octave = Math.floor((keynumber + 15) / 12);
		octavekey = (keynumber + 15) % 12;
		adder = octavekey > 4 ? 1 : 0;
		adder = octavekey === 11 ? 2 : adder;
		shift = Math.floor((octavekey + adder) * .5) / 2;
		note3.style.left = (octave * 10.5 + octavekey * .86) - 7.5 + 'em';
		note3.style.top = (20.5 - octave * 3.5 - shift) + 'em';
	}

	drawSin(frequency, frequency2, frequency3);
}

function stop(event, note) {
	oscillator.disconnect();
	if (event !== null) note = cursorClick; //Number(event.target.dataset.key);
	if (note) {
		buttons[note].classList.remove("pressed");
		nodes[note].disconnect();
		if (majorThird.checked) {
			buttons[note + 4 + minor].classList.remove("pressed");
			oscillator2.disconnect();
		}
		if (perfectFifth.checked) {
			buttons[note + 7].classList.remove("pressed");
			oscillator3.disconnect();
		}
	}
}

function drawSin(freq, freq2, freq3) {
	amplitude = cnv.height / 2;
	divider = 1;
	r2 = r3 = 0;
	result = 0;
	ctx.clearRect(0, 0, cnv.width, cnv.height);

	ctx.strokeStyle = "rgba(0,0,0,1)";
	ctx.beginPath();
	ctx.moveTo(0, amplitude);
	r1 = Math.PI * 2 * freq * duration / cnv.width;
	if (third) {
		r2 = Math.PI * 2 * freq2 * duration / cnv.width;
		divider++;
	}
	if (fifth) {
		r3 = Math.PI * 2 * freq3 * duration / cnv.width;
		divider++;
	}
	for (i = 0; i <= cnv.width; i++) {
		result = Math.sin(r1 * i);
		if (third) result += Math.sin(r2 * i);
		if (fifth) result += Math.sin(r3 * i);
		ctx.lineTo(i, (1 - result / divider) * amplitude);
	}
	ctx.stroke();

	if (third || fifth) {
		ctx.strokeStyle = "rgba(150,0,0,0.3)";
		ctx.beginPath();
		ctx.moveTo(0, amplitude);
		for (i = 0; i <= cnv.width; i++) {
			ctx.lineTo(i, amplitude - Math.sin(r1 * i) * amplitude / divider);
		}
		ctx.stroke();
	}

	if (third) {
		ctx.strokeStyle = "rgba(0,150,0,0.3)";
		ctx.beginPath();
		ctx.moveTo(0, amplitude);
		for (i = 0; i <= cnv.width; i++) {
			ctx.lineTo(i, amplitude - Math.sin(r2 * i) * amplitude / divider);
		}
		ctx.stroke();
	}

	if (fifth) {
		ctx.strokeStyle = "rgba(0,0,150,0.3)";
		ctx.beginPath();
		ctx.moveTo(0, amplitude);
		for (i = 0; i <= cnv.width; i++) {
			ctx.lineTo(i, amplitude - Math.sin(r3 * i) * amplitude / divider);
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
	//rangeOscillator.stop(0);
	rangeOscillator.disconnect();
	rangeOscillator = null;
}

cnv.width = document.body.clientWidth - 20;
cnv.height = 256;
duration = cnv.width * 0.00003;



keyboard.addEventListener('mousedown', play, false);
keyboard.addEventListener('mouseup', stop, false);
frequencyRange.addEventListener('change', playRange, false);
buttonStart.addEventListener('click', playRange, false);
buttonStop.addEventListener('click', stopRange, false);
volume.addEventListener('change', function() {
	gainNode.gain.value = volume.value / 100;
}, false);

var keyboardspoiler = document.getElementById("keyboardspoiler");
var keyboardinfo = document.getElementById("keyboardinfo");
keyboardspoiler.addEventListener('click', function(event) {
	keyboardinfo.classList.toggle("show");
}, false);