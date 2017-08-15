var thread;
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
var tempo = 50;
var nMelodySize = durationTypes["1"] * tempo //16 *100 = 1600 4/4
var nMelodyPart;
buttonMelody.addEventListener('click', function() {
	threads = secretGarden;
	tempo = 90;
	nBeginMelody = Date.now();
	nMelodyPart = 0;
	for (thread = 0; thread < threads.length; thread++) {
		threads[thread].position = 0;
		threads[thread].getNextChange();
	};
	if (nMelodyInterval === undefined) {
		nMelodyInterval = setInterval(playMelody, tempo);
		buttonMelody.innerText = '■ Пример'
	} else {		
		clearInterval(nMelodyInterval);
		nMelodyInterval = undefined
		for (i = 1; i < 100; i++) {
			core.plaingNotes[i] = false;
			core.notes[i].stop();
		}
		buttonMelody.innerText = '▶ Пример'
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
		if(!this.record[this.position]) return;
		if (this.record[this.position].length > 4) {
			this.nNextMelodyPart =  nMelodyPart + durationTypes[this.record[this.position].slice(4)]*2;

		} else {
			this.nNextMelodyPart =  nMelodyPart + durationTypes[this.record[this.position].slice(3)]*2;
		}
	}
	this.changeNote = function() {
		if (this.position !== 0) {
			if (this.record[this.position - 1][0] !== "P") {
				core.emitPlayNote(noteIndex(this.record[this.position - 1]), false);
			}
		}
		if (this.position > this.record.length - 1) {
			clearInterval(nMelodyInterval);
			nMelodyInterval = undefined
			return;
		}
		if (this.record[this.position][0] !== "P") {
			bDrawedNote = true;
			if (!core.plaingNotes[noteIndex(this.record[this.position])]) core.emitPlayNote(noteIndex(this.record[this.position]), true);
		};
		this.position++;
	}
}


var kuznechik = []
kuznechik[0] = new Thread('B4/8 D5/8 F5/8 Eb5/4')

for (i = kuznechik.length - 1; i >= 0; i--) {
	kuznechik[i].record = kuznechik[i].record.split(" ");
};
var threads = kuznechik;

var secretGarden = [];
secretGarden[0] = new Thread('PA/16 G4/8 C5/8 D5/8 ' +
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
secretGarden[1] = new Thread('PA/16 PA/3 C3/8 G3/8 Eb4/4 F2/8 C3/8 Ab3/4 ' +
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
secretGarden[2] = new Thread('PA/16 PA/3 PA/1 PA/1 PA/1 PA/1 PA/2 G4/2 PA/1 Ab4/8 PA/6 PA/2 PA/1 PA/1 PA/1 PA/1 PA/1 PA/2 G4/2 PA/1 Ab4/8 PA/6 PA/2 PA/1 PA/1 PA/2 Eb4/2 PA/1 PA/4 D5/4 C5/2 PA/1 PA/1 PA/1 PA/1 PA/1 PA/1 PA/1 PA/2 PA/4 G4/4 PA/2 G4/2 PA/1 Ab4/8 PA/3 PA/2 PA/1 Ab4/8');
for (i = secretGarden.length - 1; i >= 0; i--) {
	secretGarden[i].record = secretGarden[i].record.split(" ");
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
	}
	for (var thread = 0; thread < threads.length; thread++) {
		if (threads[thread].nNextMelodyPart === nMelodyPart) {
			threads[thread].getNextChange();
			threads[thread].changeNote();
		}
	}
	if (bDrawedNote) stave.noteCarret += 3.1;
}

window.addEventListener('load', function (event){
	nBeginMelody = Date.now();
	nMelodyPart = 0;
	threads[0].position = 0;
	threads[0].getNextChange();
	nMelodyInterval = setInterval(playMelody, tempo);
})