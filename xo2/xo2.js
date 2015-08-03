var fieldArray = 
[1, 2, 3, 4, 5, 6, 7, 8, 9,
 2, 4, 6, 8,10,12,14,16,18, 
 3, 6, 9,12,15,18,21,24,27, 
 4, 8,12,16,20,24,28,32,36, 
 5,10,15,20,25,30,35,40,45, 
 6,12,18,24,30,36,42,48,54, 
 7,14,21,28,35,42,49,56,63, 
 8,16,24,32,40,48,56,64,72, 
 9,18,27,36,45,54,63,72,81];

var score = {};
score.tic = 
 [0,0,0,
  0,0,0,
  0,0,0];
score.tac = 
 [0,0,0,
  0,0,0,
  0,0,0];

score.big = {};
score.big.tic = 0;
score.big.tac = 0;

score.names = {};
score.names.tic = 'Крестики';
score.names.tac = 'Нолики';

var capturedCell = 
[0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0];

var capturedField = 
 [false,false,false,
  false,false,false,
  false,false,false];

var checks = [448,56,7,292,146,73,273,84];
/* Minimal binary state of field in case of victory.
Horizontal:
111 000 000 = 448
000 111 000 = 56
000 000 111 = 7
Vertical:
100 100 100 = 292
010 010 010 = 146
001 001 001 = 73
Diagonal:
100 010 001 = 273
001 010 100 = 84 */

var linksToCells = [
[],[0],[1,9],[2,18],[3,10,27],[4,36],[5,11,19,45],[6,54],[7,12,28,63],
[8,20,72],[13,37],[],[14,21,29,46],[],[15,55],[22,38],[16,30,64],[],
[17,23,47,73],[],[31,39],[24,56],[],[],[25,32,48,65],[40],[],
[26,74],[33,57],[],[41,49],[],[34,66],[],[],[42,58],
[35,50,75],[],[],[],[43,67],[],[51,59],[],[],
[44,76],[],[],[52,68],[60],[],[],[],[],
[53,77],[],[61,69],[],[],[],[],[],[],
[62,78],[70],[],[],[],[],[],[],[],
[71,79],[],[],[],[],[],[],[],[],[80] ];

var checkWin = function(fieldSum){
	for (var i = 0; i < 9; i++) {
		if((fieldSum & checks[i]) === checks[i]){
			return true;
		}
	};
	return false;
};

var mark = function (selectedId) {
	var smallFieldIndex = Math.floor(selectedId/9);
	if(capturedField[smallFieldIndex]) {
		return false;
	}
	var selectedProduct = fieldArray[selectedId];
	if (product === selectedProduct && !capturedCell[selectedId]) {
		capturedCell[selectedId]++;
		window['cell' + selectedId].classList.add(tictac);
		var turnAddition = 512>>selectedId%9+1;
		score[tictac][smallFieldIndex] += turnAddition;
		if (checkWin(score[tictac][smallFieldIndex])) {
			window['block' + (smallFieldIndex + 1)].classList.add(tictac + '-full');
			capturedField[smallFieldIndex] = true;
			score.big[tictac] += 512>>smallFieldIndex+1;
			if (checkWin(score.big[tictac])) {
				alert(score.names[tictac] + ' выиграли!');
			}
		}
	}
}

gamefield.addEventListener('click', function (event) {
	mark(event.target.id.slice(4));
}, false);


var tictac = 'tac';
var moves = [];
var product = 0;
var automaticPlay = false;
var makeTurn = function (){
	tictac = tictac == 'tic' ? 'tac' : 'tic';
	product = first * second;

	if (automaticPlay) {
		if(moves.indexOf(product) !== -1) {
			console.log("Пропуск хода.");
			tictac = tictac == 'tic' ? 'tac' : 'tic';
			return;
		}
		moves.push(product);
		var listOfCells = linksToCells[product];
		for(var i = 0; i<listOfCells.length; i++){
			mark(listOfCells[i]);
		}
	}	
}

var movingControl = true;

var first = 0;
var second = 0;

controller.addEventListener('click', function (event) {
	var index = event.target.id.slice(-1);
	var classList = event.target.classList;
	if (index === 'r') {return;}
	if (movingControl) {
		if(first &&
			second &&
			index !== first &&
			index !== second) {
			console.log('Выберите, пожалуйста, число для перемещения.'); return;
		}
		if (first === index) {
			classList.remove('first');
			first = 0;
		} else if (second === index){
			classList.remove('second');
			second = 0;
		} else {
			first = index;
			classList.add('first');
		}
		controller.classList.remove('disable');
	} else {
		if (first === index) {
			classList.add('second');
			second = index;
		} else if (second === index){
			classList.add('first');
			first = index;
		} else {
			if (first) {
				second = index;
				classList.add('second');
			} else {
				first = index;
				classList.add('first');
			}
		}
		makeTurn();
		controller.classList.add('disable');
	}
	movingControl = !movingControl;
}, false);



automatic.addEventListener('click', function (event) {
	automaticPlay = event.target.checked ? true : false;	
}, false);