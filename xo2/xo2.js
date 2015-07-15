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

var productCoutArray = 
[0,1,2,2,3,2,4,2,4,3,2,0,4,0,2,2,3,0,4,0,2,2,0,0,4,1,0,2,2,0,2,0,2,0,0,2,3,0,0,0,2,0,2,0,0,2,0,0,2,1,0,0,0,0,2,0,2,0,0,0,0,0,0,2,1,0,0,0,0,0,0,0,2,0,0,0,0,0,0,0,0,1];

var linksArray = [
[],[0],[1,9],[2,18],[3,10,27],[4,36],[5,11,19,45],[6,54],[7,12,28,63],
[8,20,72],[13,37],[],[14,21,29,46],[],[15,55],[22,38],[16,30,64],[],
[17,23,47,73],[],[31,39],[24,56],[],[],[25,32,48,65],[40],[],
[26,74],[33,57],[],[41,49],[],[34,66],[],[],[42,58],
[35,50,75],[],[],[],[43,67],[],[51,59],[],[],
[44,76],[],[],[52,68],[60],[],[],[],[],
[53,77],[],[61,69],[],[],[],[],[],[],
[62,78],[70],[],[],[],[],[],[],[],
[71,79],[],[],[],[],[],[],[],[],[80] ];


gamefield.addEventListener('click', function (event) {
	
}, false);
var tic = true;
var moves = [];
var makeTurn = function (){
	var product = first * second;
	if(moves.indexOf(product) !== -1) {
		console.log("Пропуск хода.");
		tic = !tic;
		return;
	}
	moves.push(product);
	var listOfCells = linksArray[product];
	var cellNumber = 0;
	for(var i = 0; i<listOfCells.length; i++){
		cellNumber = listOfCells[i];
		if(tic) {
			window['cell' + cellNumber].classList.add('tic');
		} else {
			window['cell' + cellNumber].classList.add('tac');
		}
	}
	tic = !tic;
}

var moving = true;

var first = 0;
var second = 0;

var controllerHandler = function (event) {
	var index = event.target.id.slice(-1);
	if (index === 'r') {return;}
	if (moving) {
		if(first && second && index !== first && index !== second) {console.log('Выберите, пожалуйста, число для перемещения.'); return;}
		if (first === index) {
			event.target.classList.remove('first');
			first = 0;
		} else if (second === index){
			event.target.classList.remove('second');
			second = 0;
		} else {
			first = index;
			event.target.classList.add('first');
		}
	} else {
		if (first === index) {
			event.target.classList.add('second');
			second = index;
		} else if (second === index){
			event.target.classList.add('first');
			first = index;
		} else {
			if (first) {
				second = index;
				event.target.classList.add('second');
			} else {
				first = index;
				event.target.classList.add('first');
			}
		}
		makeTurn();
	}
	moving = !moving;
}


controller.addEventListener('click', controllerHandler, false);
