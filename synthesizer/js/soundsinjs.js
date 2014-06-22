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
var frequencyRange = document.getElementById('frequencyRange');
var frequencyDisplay = document.getElementById('frequencyDisplay');
var buttonStop = document.getElementById('buttonStop');
var cnv = document.getElementById('cnv');
var ctx = cnv.getContext('2d');

var third = false;
var fifth = false;
var minor = 0;
var duration = 0.03; //canvas seconds;
var amplitude;
var divider;
var result = 0;
var keys = [0, 27.5000, 29.1352, 30.8677, 32.7032, 34.6478, 36.7081, 38.8909,
	41.2034, 43.6535, 46.2493, 48.9994, 51.9131, 55.0000, 58.2705, 61.7354,
	65.4064, 69.2957, 73.4162, 77.7817, 82.4069, 87.3071, 92.4986, 97.9989,
	103.8262, 110.0000, 116.5409, 123.4708, 130.8128, 138.5913, 146.8324,
	155.5635, 164.8138, 174.6141, 184.9972, 195.9977, 207.6523, 220.0000,
	233.0819, 246.9417, 261.6256, 277.1826, 293.6648, 311.1270, 329.6276,
	349.2282, 369.9944, 391.9954, 415.3047, 440.0000, 466.1638, 493.8833,
	523.2511, 554.3653, 587.3295, 622.2540, 659.2551, 698.4565, 739.9888,
	783.9909, 830.6094, 880.0000, 932.3275, 987.7666, 1046.5023,
	1108.7305, 1174.6591, 1244.5079, 1318.5102, 1396.9129, 1479.9777,
	1567.9817, 1661.2188, 1760.0000, 1864.6550, 1975.5332, 2093.0045,
	2217.4610, 2349.3181, 2489.0159, 2637.0205, 2793.8259,
	2959.9554, 3135.9635, 3322.4376, 3520.0000, 3729.3101,
	3951.0664, 4186.0090, 4434.9220, 4698.6362, 4978.0317, 5274.0409,
	5587.6516, 5919.9107, 6271.9269
];
var plaingKeys = [88];
var frequency;
var frequency2;
var frequency3;
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
		if (cmd === 9) {
			play(null, note - 20);
		}
		if (cmd === 8) {

			return stop(null, note - 20);
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
		if (isNaN(keynumber)) return;
	}
	third = false;
	fifth = false;
	minor = 0;
	if (window.event.shiftKey) {
		minorChord.checked = true;
		minor = -1;
	} else {
		minorChord.checked = false;
		minor = 0;
	}

	//update	
	gainNode.gain.value = volume.value / 100;

	//create
	oscillator = context.createOscillator();
	//registrate
	nodes[keynumber] = oscillator;
	plaingKeys[keynumber] = oscillator;
	//configure
	oscillator.type = 0;
	oscillator.connect(gainNode);

	if (majorThird.checked) {
		oscillator2 = context.createOscillator();
		oscillator2.type = 0;
		oscillator2.connect(gainNode);
	}

	if (perfectFifth.checked) {
		oscillator3 = context.createOscillator();
		oscillator3.type = 0;
		oscillator3.connect(gainNode);
	}

	
	
	buttons[keynumber].classList.add("pressed");

	frequency = keys[keynumber];
	frequencyDisplay.value = frequency;
	frequencyRange.value = frequency;
	oscillator.frequency.value = frequency;
	oscillator.start(0);

	if (majorThird.checked) {
		third = true;
		buttons[keynumber + 4 + minor].classList.add("pressed");
		frequency2 = keys[keynumber + 4 + minor];
		oscillator2.frequency.value = frequency2;
		oscillator2.start(0);
		plaingKeys[keynumber + 4 + minor] = oscillator;
	}

	if (perfectFifth.checked) {
		fifth = true;
		buttons[keynumber + 7].classList.add("pressed");
		frequency3 = keys[keynumber + 7];
		oscillator3.frequency.value = frequency3;
		oscillator3.start(0);
		plaingKeys[keynumber + 7] = oscillator;
	}

	drawSin(frequency, frequency2, frequency3);
}

function stop(event, note) {
	oscillator.disconnect();
	if (event !== null) note = Number(event.target.dataset.key);
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
		ctx.lineTo(i, (1- result / divider) * amplitude);
	}

	for (i = 0; i <= cnv.width; i += 1) {
		
	}
	ctx.stroke();

	if (third || fifth) {
		ctx.strokeStyle = "rgba(150,0,0,0.3)";
		ctx.beginPath();
		ctx.moveTo(0, amplitude);
		for (i = 0; i <= cnv.width; i ++) {
			ctx.lineTo(i, amplitude - Math.sin(r1 * i) * amplitude / divider );
		}
		ctx.stroke();
	}

	if (third) {
		ctx.strokeStyle = "rgba(0,150,0,0.3)";
		ctx.beginPath();
		ctx.moveTo(0, amplitude);
		for (i = 0; i <= cnv.width; i ++) {
			ctx.lineTo(i, amplitude - Math.sin(r2 * i) * amplitude / divider );
		}
		ctx.stroke();
	}

	if (fifth) {
		ctx.strokeStyle = "rgba(0,0,150,0.3)";
		ctx.beginPath();
		ctx.moveTo(0, amplitude);
		for (i = 0; i <= cnv.width; i ++) {
			ctx.lineTo(i, amplitude - Math.sin(r3 * i) * amplitude / divider );
		}
		ctx.stroke();
	}
}

function playRange(event) {	
	if(!rangeOscillator) {
		rangeOscillator = context.createOscillator();
		rangeOscillator.type = 0;
		rangeOscillator.connect(gainNode);
		rangeOscillator.start(0);
	}
	if (event.target.type === "range"){
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


keyboard.addEventListener('mousedown', play, false);
keyboard.addEventListener('mouseup', stop, false);
frequencyRange.addEventListener('change',playRange,false);
buttonStart.addEventListener('click',playRange,false);
buttonStop.addEventListener('click',stopRange,false);
volume.addEventListener('change',function() {
	gainNode.gain.value = volume.value/100;
}, false);