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
var graphnote = [];
graphnote[0] = document.getElementById('note1');
graphnote[1] = document.getElementById('note2');
graphnote[2] = document.getElementById('note3');
graphnote[3] = graphnote[0];
graphnote[4] = graphnote[1];
var graphdies = [];
graphdies[0] = document.getElementById('dies1');
graphdies[1] = document.getElementById('dies2');
graphdies[2] = document.getElementById('dies3');
graphdies[3] = graphdies[0];
graphdies[4] = graphdies[1];
var frequencyRange = document.getElementById('frequencyRange');
var frequencyDisplay = document.getElementById('frequencyDisplay');
var buttonStop = document.getElementById('buttonStop');
var cursorClick = 0;
var cnv = document.getElementById('cnv');
var ctx = cnv.getContext('2d');
var minor = 0;
var duration = 0.03; //canvas seconds;
var amplitude;
var divider;
var result = 27.5;
var plaingnotes = [];
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
var i = 0;
for (i = 1; i < 100; i++) {
	plaingnotes[i] = false;
	notes[i] = {
		number: i,
		frequency : frequencies[i],
		octave : Math.floor((i + 8) / 12),
		octavekey : (i + 8) % 12,
		dies : false,
		plaing : false,
		button : document.getElementById(i),
		shift : Math.round(((i + 8) % 12 + 1.5) * .54545454)/2,
		play : function () {
			if(!this.plaing){
				this.oscillator = context.createOscillator();
				this.plaing = true;
				this.oscillator.type = 0;
				this.oscillator.connect(gainNode);
				this.oscillator.frequency.value = this.frequency;
				this.oscillator.start(0);
				this.button.classList.add("pressed");
			}
		},
		stop : function () {
			if (this.plaing)	{
				this.plaing = false;
				this.button.classList.remove("pressed");
				this.oscillator.disconnect();			
			}
		}
	};
	if (notes[i].octavekey===1 || 
		notes[i].octavekey===3 || 
		notes[i].octavekey===6 || 
		notes[i].octavekey===8 || 
		notes[i].octavekey===10) {
		notes[i].dies = true;
	}else{
		notes[i].dies = false;
	}
}
var note;
var lastnote = 2;
var wavetable = [];
var minor;
var alteration;
var paper = Raphael("guitarneck", 935, 180);
for(i = 0;i<6;i++){
	paper.path("M35 " + (15.5 + i*30) + "L935 " + (15.5 + i*30));
}
paper.path("M40 15L40 165");
for(i = 0;i<18;i++){
	paper.path("M" + (35 + i*50) + " 15L" + (35 + i*50) + " 165");
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
for(i = 0;i<6;i++){
	circles[i] = paper.circle(50, 15.5+i*30, 8).attr({fill: "#666"}).hide();
}
circles[0].attr({fill: "#F7F73E"});
circles[1].attr({fill: "#1bc2ff"});
circles[2].attr({fill: "#FAA341"});
circles[3].attr({fill: "#b6effb"});

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
	if (event) {
		cursorClick = keynumber = Number(event.target.dataset.key);
		if (isNaN(keynumber)) return;
		minorChord.checked = event.shiftKey ? true : false;
		minor = event.shiftKey ? -1 : 0;
	}
	note = notes[keynumber];
	note.play();
	graphnotes(note);
	plaingnotes[keynumber] = true;

	frequencyDisplay.value = note.frequency.toFixed(4);
	frequencyRange.value = note.frequency;
	gainNode.gain.value = volume.value / 100;

	if (majorThird.checked) {
		notes[keynumber + 4 + minor].play();
		graphnotes(notes[keynumber + 4 + minor]);
		plaingnotes[keynumber + 4 + minor] = true;
	}

	if (perfectFifth.checked) {
		notes[keynumber + 7].play();
		graphnotes(notes[keynumber + 7]);
		plaingnotes[keynumber + 7] = true;
	}

	drawSin();
}

function graphnotes(note) {
	if (++lastnote > 2) lastnote = 0;
	graphnote[lastnote].style.left = (note.octave * 10.5 + note.octavekey * .86) - 7.5 + 'em';
	if(note.octave>5){
		alteration = 3.5 * (note.octave-5);
	} else if(note.octave<2) {
		alteration = -3.5 * (2-note.octave);
	} else {
		alteration = 0
	}
	graphnote[lastnote].style.top = (20 - note.octave * 3.5 - note.shift + alteration) + 'em';
	if (note.dies) {
		graphdies[lastnote].style.visibility = "visible";
		graphdies[lastnote].style.left = (note.octave * 10.5 + note.octavekey * .86) - 8.1 + 'em';
		graphdies[lastnote].style.top = (22.6 - note.octave * 3.5 - note.shift + alteration) + 'em';
	} else {
		graphdies[lastnote].style.visibility = "hidden";
	}
	i = note.number-32;
	j=0;
	if(i>=0 && i<38){
		if(i>18){j=1};
		console.log(i);
		circles[0].show();
		circles[0].attr({
			cx : 10+i*50-j*950,
			cy : 165-j*120
		});
	}
	j=0;
	if(i>4 && i<43){
		if(i>23){j=1};
		circles[1].show();
		circles[1].attr({
			cx : i*50-240-j*950,
			cy : 135-j*120
		});
	}
	j=0;
	if(i>9 && i<29){
		circles[2].show();
		circles[2].attr({
			cx : i*50-490,
			cy : 105
		});
	}
	j=0;
	if(i>14 && i<34){
		circles[3].show();
		circles[3].attr({
			cx : i*50-740-j*600,
			cy : 75-j*90
		});
	}
}

function stop(event, note) {
	if (event !== null) {
		note = cursorClick;
	}
	if (note) {
		plaingnotes[note] = false;
		notes[note].stop();
		if (majorThird.checked) {
			notes[note + 4 + minor].stop();
			plaingnotes[note + 4 + minor] = false;
		}
		if (perfectFifth.checked) {
			notes[note + 7].stop();	
			plaingnotes[note + 7] = false;
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
	
	//r2 = r3 = 0;
	//result = 0;
	ctx.clearRect(0, 0, cnv.width, cnv.height);

	for (var j = 1; j<100; j++) {
		if(plaingnotes[j]) {
			divider++;
		}
	}
	if(divider > 1){
		for (i = 0; i <= cnv.width; i++) {			
			wavetable[i] = 0;
		}
	}
	for (var j = 1; j<100; j++) {
		if(plaingnotes[j]) {
			ctx.strokeStyle = "rgba(0,0," + Math.floor(j*2+50) + ",1)";
			ctx.beginPath();
			ctx.moveTo(0, amplitude);
			r1 = Math.PI * 2 * notes[j].frequency * duration / cnv.width;
			for (i = 0; i <= cnv.width; i++) {	
				result = Math.sin(r1 * i);		
				if(divider > 1){
					wavetable[i] +=result;
				}
				ctx.lineTo(i, (1 - result / divider) * amplitude);
			}
			ctx.stroke();
		}
	}
	if(divider > 1){
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

cnv.width = document.body.clientWidth - 20 - 180;
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