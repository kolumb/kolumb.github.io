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
var productCountArray;
var score = {};

score.big = {};

score.names = {};
score.names.tic = 'Крестики';
score.names.tac = 'Нолики';
var gameover;

var capturedCell;
var capturedField;

var movingControl;
var first;
var second;

var displayHint = 0;
var maxHint = 5;
var tictac;
var moves;
var product;
var automaticPlay = false;

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

var init = function() {
	movingControl = true;
	tictac = 'tac';
	moves = [];
	product = 0;
	first = 0;
	second = 0;
	productCountArray = [0,1,2,2,3,2,4,2,4,3,2,0,4,0,2,2,3,0,4,0,2,2,0,0,4,1,0,2,2,0,2,0,2,0,0,2,3,0,0,0,2,0,2,0,0,2,0,0,2,1,0,0,0,0,2,0,2,0,0,0,0,0,0,2,1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,1];
	capturedCell = 
[0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0,
 0,0,0,0,0,0,0,0,0];
	capturedField = 
 [false,false,false,
  false,false,false,
  false,false,false];
	score.tic = [0,0,0,0,0,0,0,0,0];
	score.tac = [0,0,0,0,0,0,0,0,0];
	score.big.tic = 0;
	score.big.tac = 0;
	gameover = false;
	hint.innerText = 'Выберите два числа:';
}
init();

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
		var turnAddition = 512>>selectedId%9+1;
		score[tictac][smallFieldIndex] += turnAddition;
		capturedCell[selectedId]++;
		window['cell' + selectedId].classList.add(tictac);
		productCountArray[product]--;
		if(displayHint < maxHint && productCountArray[product] == 0) {
			hint.innerText = 'Теперь другой игрок может поменять одно из чисел: ' + first + ' или ' + second + '.';
			displayHint++;
		}

		if (checkWin(score[tictac][smallFieldIndex])) {
			score.big[tictac] += 512>>smallFieldIndex+1;
			capturedField[smallFieldIndex] = true;
			window['block' + (smallFieldIndex + 1)].classList.add(tictac + '-full');
			if (checkWin(score.big[tictac])) {
				hint.innerHTML = score.names[tictac] + ' выиграли! <button id="newgame">Новая игра</buttom>';
				gameover = true;
			}
		}
	}
}

gamefield.addEventListener('click', function (event) {
	mark(event.target.id.slice(4));
}, false);

var makeTurn = function (){
	tictac = tictac == 'tic' ? 'tac' : 'tic';
	product = first * second;

	if (automaticPlay) {
		if(moves.indexOf(product) !== -1) {
			hint.innerText = 'Это произвидение уже было отмечено. Пропуск хода.';
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

controller.addEventListener('click', function (event) {
	var index = event.target.id.slice(-1);
	if (index === 'r' || gameover) {return;}
	var classList = event.target.classList;
	if (movingControl) {
		if(first &&
			second &&
			index !== first &&
			index !== second) {
			hint.innerText = 'Выберите, пожалуйста, или ' + first + ' или ' + second + '.';
			return;
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
		hint.innerText = '';
		controller.classList.remove('disable');
	} else {	
		if(first) {
			product = index * first;
		} else if(second) {
			product = index * second;
		}	
		if(productCountArray[product] === 0) {
			hint.innerText = 'Это произвидение уже было отмечено. Выберите другое число.';
			return;
		}
		hint.innerText = '';
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
		window[tictac + 'move'].style.display = 'block';
		var tempmove = tictac === 'tic' ? 'tac' : 'tic';
		window[tempmove + 'move'].style.display = 'none';

		if(displayHint < maxHint) {
			gamefield.classList.add('accent');
			hint.innerText = 'Теперь отметьте на поле все числа   ' + (first*second) + '    (' + first + ' умножить на ' + second + ').';
			displayHint++;
		}
	}
	movingControl = !movingControl;
}, false);

automatic.addEventListener('click', function (event) {
	automaticPlay = event.target.checked ? true : false;	
}, false);
hint.addEventListener('click', function (event) {
	if(event.target.id !== 'newgame') {return;}
	controller.classList.remove('disable');
	for(var i = 1; i < 10; i++) {
		window['pick' + i].classList.remove('first');
		window['pick' + i].classList.remove('second');
		window['block' + i].classList.remove('tic-full');
		window['block' + i].classList.remove('tac-full');
	}
	for(var i = 0; i < 81; i++) {
		window['cell' + i].classList.remove('tic');
		window['cell' + i].classList.remove('tac');
	}
	init();	
}, false);
