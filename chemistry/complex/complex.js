// Zn2+, Co2+, Cu2+, Mn2+, Fe2+, Fe3+, Ni2+
function log10(x) {
  return Math.log(x) / Math.log(10);
}
var colors = ['#1f77b4','#ff7f0e','#2ca02c','#d62728','#9467bd','#8c564b','#e377c2','#7f7f7f','#bcbd22','#17becf'];
//[L] Ligand concentration 10^-10 to 10^4
var LIGAND_CONCENTRATION_MIN = 0.0000000001; //1e-10;
var LIGAND_CONCENTRATION_MAX = 1000; //1e+4;
// Max number of forms 10
var MAX_FORMS = 10
// monodentate ligands NH3, OH-, CL-, CH3COO-
// instability constant
var instablConsts = [];
var constantsInput = document.getElementById('Constants');
var plusButton = document.getElementById('Plus');
var minusButton = document.getElementById('Minus');
var labels = constantsInput.getElementsByTagName('label');
var inputs = constantsInput.getElementsByTagName('input');
inputs[0].focus();
var ligandConcInputMin = document.getElementById('ligandConcentrationMin');
var ligandConcInputMax = document.getElementById('ligandConcentrationMax');
var ligandConcMin = parseFloat(ligandConcInputMin.value);
var ligandConcMax = parseFloat(ligandConcInputMax.value);
var ligandConc = 0.01;
function addConstantInput(event){
	if(inputs.length> MAX_FORMS-1){
		console.log('Перевищено допустиму кількість форм катіонів.');
		return;
	}
	var newLabel = document.createElement('label');
	var newText = document.createTextNode('K');
	var newEqText = document.createTextNode(' = ');
	var newSub = document.createElement('sub');
	var newIndexText = document.createTextNode((inputs.length+1));
	var newInput = document.createElement('input');
	newInput.type='number';
	newLabel.appendChild(newText);
	newSub.appendChild(newIndexText);
	newLabel.appendChild(newSub);
	newLabel.appendChild(newEqText);
	newLabel.appendChild(newInput);
	constantsInput.appendChild(newLabel);
	newInput.focus();
	updateInputs();	
}
function removeConstantInput(event) {
	constantsInput.removeChild(labels[labels.length-1]);
	updateInputs();
}
function updateInputs() {
	instablConsts = [];
	for(var i=0; i<inputs.length; i++){
		instablConsts.push(inputs[i].value);
	}
}


plusButton.addEventListener('click', addConstantInput, false);
minusButton.addEventListener('click', removeConstantInput, false);
constantsInput.addEventListener('keypress', function (event) {
	if(event.target === inputs[inputs.length-1]) {
		if( event.keyCode === 13){
			addConstantInput(event);
		}
	} else {
		event.target.parentNode.nextSibling.nextSibling.getElementsByTagName('input')[0].focus();
	}
}, false);

ligandConcInputMin.addEventListener('blur', function (event) {
	ligandConcMin = parseFloat(ligandConcInputMin.value);
	if(isNaN(ligandConcMin)) {
		ligandConcInputMin.value = '';
	} else if(ligandConcMin < LIGAND_CONCENTRATION_MIN) {
		ligandConcInputMin.value = LIGAND_CONCENTRATION_MIN;
	} else if(ligandConcMin > LIGAND_CONCENTRATION_MAX) {
		ligandConcInputMin.value = LIGAND_CONCENTRATION_MAX;
	}
}, false);
ligandConcInputMax.addEventListener('blur', function (event) {
	ligandConcMax = parseFloat(ligandConcInputMax.value);
	if(isNaN(ligandConcMax)) {
		ligandConcInputMax.value = '';
	} else if(ligandConcMax < LIGAND_CONCENTRATION_MIN) {
		ligandConcInputMax.value = LIGAND_CONCENTRATION_MIN;
	} else if(ligandConcMax > LIGAND_CONCENTRATION_MAX) {
		ligandConcInputMax.value = LIGAND_CONCENTRATION_MAX;
	}
}, false);


var cnv = document.getElementById('ConcentrationGraph');
var ctx = cnv.getContext('2d');
cnv.width = window.innerWidth;
cnv.height = 400;
ctx.translate(0,cnv.height);



var firstTime = true;

var alphas = [];

function calculate (event) {
	updateInputs();
	ctx.clearRect(0,0,cnv.width, -cnv.height)
	ligandConc = ligandConcMin;
	var lgConcMin = Math.log10(ligandConcMin);
	var lgConcMax = Math.log10(ligandConcMax);
	var ligandConcAdder = (lgConcMax - lgConcMin)/cnv.width;
	var ligandConcCount = 0;
	for(var pixel = 0; pixel< cnv.width; pixel++){
		ligandConcCount += ligandConcAdder;
		ligandConc = Math.pow(10, ligandConcCount);
		alphas = [];
		var divider = 0;
		for(var i = 0; i <= inputs.length; i++){
			var adder = 1;
			for(var j = 0; j < i; j++){
				adder *= ligandConc;
			}
			for(var j = i; j < inputs.length; j++){
				adder *= instablConsts[j];
			}
			divider += adder;
		}

		for(var i = 0; i <= inputs.length; i++){

			var value = 1;
			for(var j = 0; j < i; j++){
				value *= ligandConc;
			}
			for(var j = i; j < inputs.length; j++){
				value *= instablConsts[j];
			}
			ctx.fillStyle = colors[i];
			ctx.fillRect(pixel, -5-(190*value/divider),1,1)
		}
	}
}
var calcButton = document.getElementById('calc');
calcButton.addEventListener('click', calculate, false);


