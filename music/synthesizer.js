var Keyboard = document.getElementById('Keyboard')
var Tools = document.getElementById('Tools')
var Options = document.getElementById('Options')
var Stave = document.getElementById('Stave')
var Harmonica = document.getElementById('Harmonica')
var Wave = document.getElementById('Wave')
var core = {
	context: null,
	gainNode: null,
	plaingNotes: [],
	frequencies: [],
	multiplier: Math.pow(2, 1 / 12),
	maxNotes: 100,
	notes: [],
	init: function(){
		if (typeof window.AudioContext !== "undefined") {
        	this.context = new window.AudioContext();
    	} else if (typeof window.webkitAudioContext !== "undefined") {
			this.context = new webkitAudioContext();
		} else if (typeof window.mozAudioContext !== "undefined") {
			this.context = new mozAudioContext();
		} else {
			this.context = null;
			var errorDiv = document.createElement('div'); 
  			var errorMassage = document.createTextNode('К сожалению, ваш браузер не поддерживает работу со звуком.'); 
  			var updateLink = document.createElement('a');
  			updateLink.href = 'https://browser-update.org/ru/update.html';
  			var linkText = document.createTextNode('Узнайте больше здесь');
  			updateLink.appendChild(linkText);
  			errorDiv.appendChild(errorMassage); 
  			errorDiv.appendChild(updateLink); 
  			keyboardWraper.insertBefore(errorDiv);
		}
		if(this.context) {
			this.gainNode = this.context.createGain();
			this.gainNode.connect(this.context.destination);
			this.gainNode.gain.value = 0.04;			
		}
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
						this.plaing = true;
						if(core.context) {
							this.oscillator = core.context.createOscillator();
							this.oscillator.type = 'sine';
							this.oscillator.connect(core.gainNode);
							this.oscillator.frequency.value = this.frequency;
							this.oscillator.start(0);
						}
						this.button.classList.add("pressed");
					}
				},
				stop: function() {
					if (this.plaing) {
						this.plaing = false;
						this.button.classList.remove("pressed");
						if(this.oscillator) this.oscillator.disconnect();
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
				options.minor = msg.shiftKey ? -1 : 0;

				if (cmd === 9){
					console.log(note)
					core.emitPlayNote(note - 32, true);
					if (options.third) core.emitPlayNote(note - 32 + 4 + options.minor, true);
					if (options.fifth) core.emitPlayNote(note - 32 + 7, true);
				}

				if (cmd === 8) {
					core.emitPlayNote(note - 32, false);
					if (options.third) core.emitPlayNote(note - 32 + 4 + options.minor, false);
					if (options.fifth) core.emitPlayNote(note - 32 + 7, false);
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
		document.addEventListener('playnote', this.noteHandler, false);
	},
	noteHandler: function(event, undef) {
		var keynumber = Number(event.detail.note);
		var note = core.notes[keynumber];
		if (note === undef) return;
		if(event.detail.play){			
			if(core.plaingNotes[keynumber]) return ;
			note.play();
			core.plaingNotes[keynumber] = true;
			frequencyDisplay.value = note.frequency.toFixed(4);
			frequencyRange.value = note.frequency;
			if(core.gainNode) core.gainNode.gain.value = volumeRange.value / 100;
		} else {
			if(!core.plaingNotes[keynumber]) return ;
			core.notes[keynumber].stop();
			core.plaingNotes[keynumber] = false;
		}
	},
	emitPlayNote: function(noteNumber, action){
		try {
			document.dispatchEvent(new CustomEvent('playnote', {detail: {note: noteNumber,play: action}}));			
		} catch(err) {

			var event = document.createEvent('HTMLEvents');
			event.initEvent('playnote',true,true);
			event.detail = {};
			event.detail.note = noteNumber;
			event.detail.play = action;
			document.dispatchEvent(event);
		}
	}
}


var keyboard = {
	mouseClicked: '',
	init: function() {

		Keyboard.addEventListener('mousedown', this.mouseHandler, false);
		Keyboard.addEventListener('touchstart', function(e) {
			e.preventDefault();
			var clkEvt = document.createEvent('MouseEvent');
			clkEvt.initMouseEvent('mousedown', true, true, window, e.detail,
				e.touches[0].screenX, e.touches[0].screenY,
				e.touches[0].clientX, e.touches[0].clientY,
				false, false, false, false,
				0, null);
			e.target.dispatchEvent(clkEvt);
		}, false);

		Keyboard.addEventListener('mouseup', this.mouseHandler, false);
		Keyboard.addEventListener('mouseout', this.mouseHandler, false);
		Keyboard.addEventListener('touchend', function(e) {
			e.preventDefault();
			var clkEvt = document.createEvent('MouseEvent');
			clkEvt.initMouseEvent('mouseup', true, true, window, e.detail,
				e.changedTouches[0].screenX, e.changedTouches[0].screenY,
				e.changedTouches[0].clientX, e.changedTouches[0].clientY,
				false, false, false, false,
				0, null);
			e.target.dispatchEvent(clkEvt);
		}, false);
	},
	show: function () {
		Keyboard.classList.remove('hide');
	},
	hide: function () {
		Keyboard.classList.add('hide');
	},
	mouseHandler: function(event){
		if(event.type === 'mousedown' && event.target.id){
			options.minor = event.shiftKey ? -1:0;
			keyboard.mouseClicked = parseInt(event.target.id) + parseInt(options.transposition);
			core.emitPlayNote(keyboard.mouseClicked, true);
			if (options.fifth) {
				core.emitPlayNote(keyboard.mouseClicked + 7, true);
			}
			if (options.third) {
				core.emitPlayNote(keyboard.mouseClicked + 4 + options.minor, true);
			}
		} else if ((event.type === 'mouseup' || event.type === 'mouseout') && keyboard.mouseClicked){
			core.emitPlayNote(keyboard.mouseClicked, false);
			if (options.fifth) {
				core.emitPlayNote(keyboard.mouseClicked + 7, false);
			}
			if (options.third) {
				core.emitPlayNote(keyboard.mouseClicked + 4 + options.minor, false);
			}
			keyboard.mouseClicked = '';
		}
	}
}


var options = {
	minor: 0,
	third: false,
	fifth: false,
	transposition: 0,
	init: function () {
		Options.addEventListener('click', this.clickHandler, false);	
		volumeRange.addEventListener('change', function() {
			if(core.gainNode) core.gainNode.gain.value = volumeRange.value / 100;
		}, false);
	},
	show: function () {
		Options.classList.remove('hide');
	},
	hide: function () {
		Options.classList.add('hide');		
	},
	clickHandler: function (event) {
		switch (event.target.id) {
			case 'majorThird':
				options.third = event.target.checked;
				break;
			case 'perfectFifth':
				options.fifth = event.target.checked;
				break;
			case 'selectTransposition':
				options.transposition = 
				selectTransposition.options[selectTransposition.selectedIndex].value;
		}
	}
}


var stave = {
	graphNote: [],
	graphDies: [],
	lastNote: 2,
	noteCarret: 70,
	before: 0,
	mouseClicked: 0,
	init: function() {
		
		Stave.addEventListener('mousedown', this.mouseHandler, false);
		Stave.addEventListener('mouseup', this.mouseHandler, false);
		for (var i = 0; i < 7; i++) {
			this.graphNote[i] = document.getElementById('note' + (i + 1));
			this.graphNote[i].ondragstart = function() { return false; };
			this.graphDies[i] = document.getElementById('dies' + (i + 1));
		}
	},
	show: function () {
		Stave.classList.remove('hide');
		document.addEventListener('playnote', this.noteHandler, false);
	},
	hide: function () {
		Stave.classList.add('hide');
		document.removeEventListener('playnote', this.noteHandler, false);	
	},
	mouseHandler: function (event) {
		if(event.type === 'mousedown') {
			var top = (document.documentElement && document.documentElement.scrollTop) || 
              document.body.scrollTop;
			var y = event.pageY - Stave.getBoundingClientRect().top - top;
			var octave = 8- Math.floor((y+20)/56);
			var octaveKey = (-1-Math.floor(((y-36) - (8-octave) * 56)/8))*2 ;
			if(octaveKey > 4) {
				octaveKey--;
			}
			this.mouseClicked = octave*12 + octaveKey - 32;
			core.emitPlayNote(this.mouseClicked, true);
		} else if(event.type === 'mouseup') {
			core.emitPlayNote(this.mouseClicked, false);
		}
	},
	noteHandler: function (event) {
		if(event.detail.play)stave.drawNote(core.notes[event.detail.note]);
	},
	drawNote: function(note) {
		var alteration;
		if (++this.lastNote === this.graphNote.length) this.lastNote = 0;

		var now = new Date();
		if(now - this.before > 100){
			this.noteCarret += 32;
		}
		this.before = now;
		if (this.noteCarret > window.innerWidth - 130) this.noteCarret = 70;
		this.graphNote[this.lastNote].style.left = this.noteCarret + 'px';
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
			this.graphDies[this.lastNote].style.left = (this.noteCarret - 8) + 'px';
			this.graphDies[this.lastNote].style.top = (22.6 - note.octave * 3.5 - note.shift + alteration) + 'em';
		} else {
			this.graphDies[this.lastNote].style.visibility = "hidden";
		}		
	}
}


var guitar = {
	paper: Raphael("guitarneck", 920, 180),
	circles: [],
	init: function() {
		guitarneck.addEventListener('mousedown', this.mouseHandler, false);
		guitarneck.addEventListener('mouseup', this.mouseHandler, false);

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
	},
	show: function () {
		guitarneck.classList.remove('hide');
		document.addEventListener('playnote', this.noteHandler, false);
	},
	hide: function () {
		guitarneck.classList.add('hide');
		document.removeEventListener('playnote', this.noteHandler, false);
	},
	mouseHandler: function (event) {
		if(event.type === 'mousedown') {
			
		} else if(event.type === 'mouseup') {
			
		}
	},
	noteHandler: function (event) {
		if(event.detail.play){
			var i = event.detail.note - 32;
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
			if (i > 4 && i < 43) {
				j = 0;
				if (i > 23) {
					j = 1
				};
				guitar.circles[1].show();
				guitar.circles[1].attr({
					cx: i * 50 - 240 - j * 950,
					cy: 135 - j * 120
				});
			}
			if (i > 9 && i < 29) {
				j = 0;
				guitar.circles[2].show();
				guitar.circles[2].attr({
					cx: i * 50 - 490,
					cy: 105
				});
			}
			if (i > 14 && i < 34) {
				j = 0;
				guitar.circles[3].show();
				guitar.circles[3].attr({
					cx: i * 50 - 740 - j * 600,
					cy: 75 - j * 90
				});
			}

		} else {
			guitar.circles[0].hide();
			guitar.circles[1].hide();
			guitar.circles[2].hide();
			guitar.circles[3].hide();

		}
	}
}


var harmonica = {
	harmonicaNotes: {
		32: [0xe6d690, 0],	//E3
		35: [0xb6effb, 1,2],	//G3
		39: [0xddaadd, 3],	//B3
		40: [0xffaabb, 4],	//C4
		42: [0xf8d3b2, 5],	//D4
		44: [0xe6d690, 6,20],	//E4
		45: [0xb9e5b6, 7],	//F4
		47: [0xb6effb, 8,21,22],//G4
		49: [0x1bc2ff, 9],	//A4
		51: [0xddaadd, 11,23],//B4
		52: [0xffaabb, 10,12,24],//C5
		54: [0xf8d3b2, 13,25],//D5
		56: [0xe6d690, 14,26],//E5
		57: [0xb9e5b6, 15,27],//F5
		59: [0xb6effb, 16,28],//G5
		61: [0x1bc2ff, 17,29],//A5
		63: [0xddaadd, 19,31],//B5
		64: [0xffaabb, 18,30,32],//C6
		66: [0xf8d3b2, 33],	//D6
		68: [0xe6d690, 34],	//E6
		69: [0xb9e5b6, 35],	//F6
		71: [0xb6effb, 36],	//G6
		73: [0x1bc2ff, 37],	//A6
		75: [0xddaadd, 39],	//B6
		76: [0xffaabb, 38]	//C7
	},
	harmonyHoles: [32,35,35,39,40,42,44,45,47,49,52,51,52,54,56,57,59,61,64,63,44,47,47,51,52,54,56,57,59,61,64,63,64,66,68,69,71,73,76,75],
	harmonyCanvas: document.getElementById('harmony'),
	harmWidth: 0,
	harmHeight: 0,
	harmCtx: harmony.getContext('2d'),
	init: function () {
		this.harmonyCanvas.addEventListener('mousedown', this.mouseHandler, false);
		this.harmonyCanvas.addEventListener('mouseup', this.mouseHandler, false);
	},
	show: function () {
		this.harmonyCanvas.classList.remove('hide');
		this.harmWidth = document.body.clientWidth * 3 / 4;
		this.harmHeight = this.harmWidth / 10;
		this.harmonyCanvas.width = this.harmWidth;
		this.harmonyCanvas.height = this.harmHeight;
		this.harmCtx.beginPath();
		this.harmCtx.moveTo(.5, .5);
		this.harmCtx.lineTo(this.harmWidth - .5, .5);
		this.harmCtx.lineTo(this.harmWidth - .5, this.harmHeight - .5);
		this.harmCtx.lineTo(.5, this.harmHeight - .5);
		this.harmCtx.moveTo(.5, this.harmHeight / 2 - .5);
		this.harmCtx.lineTo(this.harmWidth - .5, this.harmHeight / 2 - .5);
		for (var i = 0; i < 20; i++) {
			this.harmCtx.moveTo(i * this.harmWidth / 20 + .5, .5);
			this.harmCtx.lineTo(i * this.harmWidth / 20 + .5, this.harmHeight - .5);
		};
		this.harmCtx.stroke();
		document.addEventListener('playnote', this.noteHandler, false);		
	},
	hide: function () {		
		this.harmonyCanvas.classList.add('hide');
		document.removeEventListener('playnote', this.noteHandler, false);
	},
	mouseHandler: function (event) {
		if(event.type === 'mousedown') {
			var x = event.clientX - Harmonica.getBoundingClientRect().left - Harmonica.scrollLeft;
			var y = event.clientY - Harmonica.getBoundingClientRect().top - Harmonica.scrollTop;
			var i = Math.floor(x/(harmonica.harmHeight / 2));
			if(y> harmonica.harmHeight/2){i+=20;}

			harmonica.mouseClicked = harmonica.harmonyHoles[i];
			core.emitPlayNote(harmonica.mouseClicked, true);
		} else if(event.type === 'mouseup') {
			core.emitPlayNote(harmonica.mouseClicked, false);
		}
	},
	noteHandler: function (event, undef) {
		var note = event.detail.note;
		if(harmonica.harmonicaNotes[note] === undef) return;
		var x, y, size = harmonica.harmHeight / 2;
		
		if(event.detail.play){
			harmonica.harmCtx.fillStyle ='#' + harmonica.harmonicaNotes[note][0].toString(16);			
			
		} else {
			harmonica.harmCtx.fillStyle ='#fff';
		}
		for(var i = harmonica.harmonicaNotes[note].length; i>=0; i--){
			x = harmonica.harmonicaNotes[note][i];
			y = 0;
			if(x>19){
				x-=20;
				y=1
			}
			harmonica.harmCtx.fillRect(x*size+3,y*size+2.5,size-4.5,size-5.5);
		}
	}
}


var wave = {
	canvas: document.getElementById('cnv'),
	rangeOscillator: null,
	waveDuration: document.getElementById('cnv').width * 0.00007, //canvas seconds
	ctx: document.getElementById('cnv').getContext('2d'), //canvas waveTable
	amplitude: 0,
	lineCount: 0, //canvas wave components count
	result: 27.5,
	wavetable: [],
	init: function () {
		wave.ctx.strokeStyle = "rgba(20,50,140,1)";
		frequencyRange.addEventListener('change', this.playRange, false);
		buttonStart.addEventListener('click', this.playRange, false);
		buttonStop.addEventListener('click', this.stopRange, false);
		Less10.addEventListener('click', this.moveRange, false);
		Less.addEventListener('click', this.moveRange, false);
		More.addEventListener('click', this.moveRange, false);
		More10.addEventListener('click', this.moveRange, false);
		wave.amplitude = wave.canvas.height / 2;
	},
	show: function () {
		Wave.classList.remove('hide');
		this.canvas.width = document.body.clientWidth - 90;
		this.canvas.height = 256;
		document.addEventListener('playnote', this.drawSin, false);		
		wave.amplitude = wave.canvas.height / 2;
	},
	hide: function () {
		document.removeEventListener('playnote', this.drawSin, false);
		Wave.classList.add('hide');
	},
	drawSin: function (event, frequency) {
		if(!event || !event.detail.play) {
			wave.ctx.clearRect(0, 0, wave.canvas.width, wave.canvas.height);
			wave.ctx.beginPath();
			wave.ctx.moveTo(0, wave.amplitude);
			var r1 = Math.PI * 2 * frequency * wave.waveDuration / wave.canvas.width;
			for (i = 0; i <= wave.canvas.width; i+=3) {
				wave.result = Math.sin(r1 * i);
				if (wave.lineCount > 1) {
					wave.wavetable[i] += wave.result;
				}
				wave.ctx.lineTo(i, (1 - wave.result / wave.lineCount) * wave.amplitude);
			}
			wave.ctx.stroke();
			return;
		};
		wave.lineCount = 0;
		wave.ctx.clearRect(0, 0, wave.canvas.width, wave.canvas.height);

		for (var j = 1; j < core.maxNotes; j++) {
			if (core.plaingNotes[j]) {
				wave.lineCount++;
			}
		}
		if (wave.lineCount > 1) {
			for (var i = 0; i <= wave.canvas.width; i++) {
				wave.wavetable[i] = 0;
			}
		}

		wave.ctx.beginPath();
		for (var j = 1; j < core.maxNotes; j++) {
			if (core.plaingNotes[j]) {
				wave.ctx.moveTo(0, wave.amplitude);
				var r1 = Math.PI * 2 * core.notes[j].frequency * wave.waveDuration / wave.canvas.width;
				for (i = 0; i <= wave.canvas.width; i+=3) {
					wave.result = Math.sin(r1 * i);
					if (wave.lineCount > 1) {
						wave.wavetable[i] += wave.result;
					}
					wave.ctx.lineTo(i, (1 - wave.result / wave.lineCount) * wave.amplitude);
				}
			}
		}
		wave.ctx.stroke();

		if (wave.lineCount > 1) {
			wave.ctx.lineWidth = 2;
			wave.ctx.strokeStyle = "rgba(200,0,50,1)";
			wave.ctx.beginPath();
			wave.ctx.moveTo(0, wave.amplitude);
			for (i = 0; i <= wave.canvas.width; i+=3) {
				wave.ctx.lineTo(i, (1 - wave.wavetable[i] / wave.lineCount) * wave.amplitude);
			}
			wave.ctx.stroke();
			wave.ctx.lineWidth = 1;
			wave.ctx.strokeStyle = "rgba(20,50,140,1)";
		}
	},
	playRange: function(event) {
		wave.drawSin( null, frequencyRange.value);
		if (!wave.rangeOscillator) {
			wave.rangeOscillator = core.context.createOscillator();
			wave.rangeOscillator.type = 'sine';
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
	},
	moveRange: function(event) {
		var change; 
		switch(event.target.id) {
			case 'Less10': change = -10; break;
			case 'Less': change = -1; break;
			case 'More': change = 1; break;
			case 'More10': change = 10; break;
		}
		frequencyDisplay.value = (parseFloat(frequencyDisplay.value) + change) + 'гц';
		wave.playRange(event);
	}
}


core.init();

keyboard.init();
keyboard.show();

options.init();
options.hide();

stave.init();
stave.show();

guitar.init();
guitar.hide();

harmonica.init();
harmonica.hide();

wave.init();
wave.hide();


Tools.addEventListener('click', function (event) {
	var node = event.target.parentNode.firstChild.nextSibling;
	if(node.type === 'checkbox') {
		var module = node.id.substring(0,node.id.length-5);
		node.checked ? window[module].show() : window[module].hide();
	}
}, false);
