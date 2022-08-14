// Як вигадати випадкову формулу неорганічної сполуки? І навіть назвати його? Крім оксидів, серед класів неорганічних сполук є іонними. Отже, щоб написати формулу, треба згадати якийсь аніон і катіон. Навмання - кальцій і фосфат. CaPO4 – неправильно. Спочатку треба згадати їхні заряди. 2 та 3. Щоб розставити індекси, потрібно знайти найменше загальне кратне. А потім цю шістку розділити на власний заряд. Вийде 3 і 2. Ca3PO42 - неправильно. Тобто для простого іона кальцію не потрібно ставити дужки, а для складного фосфату – потрібно. А як визначити, чи складний він, чи ні? Якщо у ньому більше одного елемента, значить складний.
// Как придумать случайную формулу неорганического соединения? И даже назвать его? Кроме оксидов, среди классов неорганических соединений все являются ионными. Значит чтобы написать формулу нужно вспомнить какой-то анион и катион. Наугад - кальций и фосфат. CaPO4 - неправильно. Вначале нужно вспомнить их заряды. 2 и 3. Чтобы расставить индексы, нужно найти наименшее обшее кратное. А затем эту шестерку разделить на собственный заряд. Получится 3 и 2. Ca3PO42 - неправильно. То есть, для простого иона кальция не нужно ставить скобки, а для сложного фосфата - нужно. А как определить, сложный он, или нет? Если в нем больше одного элемента, значит сложный.
// How to come up with a random formula for an inorganic compound? Or even name it? Except oxides, among the classes of inorganic compounds, all are ionic. So in order to write a formula, you need to remember some kind of anion and cation. At random - calcium and phosphate. CaPO4 is wrong. First you need to remember their charges. 2 and 3. To arrange the indices, you need to find the least common multiple. And then divide this six by its own charge. It will turn out 3 and 2. Ca3PO42 is wrong. That is, for a simple calcium ion, you do not need to put brackets, but for a complex phosphate, you need to. How can you tell if it's difficult or not? If it has more than one element, then it is complex.

var display;
var elements = {
	h: {lable: "H", z: 1, type: 'nonmetal'},
	he: {lable: "He", z: 2, type: 'nonmetal'},
	li: {lable: "Li", z: 3, type: 'metal'},
	be: {lable: "Be", z: 4, type: 'amphoter'},
	b: {lable: "B", z: 5, type: 'nonmetal'},
	c: {lable: "C", z: 6, type: 'nonmetal'},
	n: {lable: "N", z: 7, type: 'nonmetal'},
	o: {lable: "O", z: 8, type: 'nonmetal'},
	f: {lable: "F", z: 9, type: 'nonmetal'},
	ne: {lable: "Ne", z: 10, type: 'nonmetal'},
	na: {lable: "Na", z: 11, type: 'metal'},
	mg: {lable: "Mg", z: 12, type: 'metal'},
	al: {lable: "Al", z: 13, type: 'amphoter'},
	si: {lable: "Si", z: 14, type: 'nonmetal'},
	p: {lable: "P", z: 15, type: 'nonmetal'},
	s: {lable: "S", z: 16, type: 'nonmetal'},
	cl: {lable: "Cl", z: 17, type: 'nonmetal'},
	ar: {lable: "Ar", z: 18, type: 'nonmetal'},
	k: {lable: "K", z: 19, type: 'metal'},
	ca: {lable: "Ca", z: 20, type: 'metal'},
	sc: {lable: "Sc", z: 21, type: 'metal'},
	ti: {lable: "Ti", z: 22, type: 'amphoter'},
	v: {lable: "V", z: 23, type: 'amphoter'},
	cr: {lable: "Cr", z: 24, type: 'amphoter'},
	mn: {lable: "Mn", z: 25, type: 'amphoter'},
	fe: {lable: "Fe", z: 26, type: 'amphoter'},
	co: {lable: "Co", z: 27, type: 'amphoter'},
	ni: {lable: "Ni", z: 28, type: 'amphoter'},
	cu: {lable: "Cu", z: 29, type: 'amphoter'},
	zn: {lable: "Zn", z: 30, type: 'amphoter'},
	ga: {lable: "Ga", z: 31, type: 'amphoter'},
	ge: {lable: "Ge", z: 32, type: 'amphoter'},
	as: {lable: "As", z: 33, type: 'nonmetal'},
	se: {lable: "Se", z: 34, type: 'nonmetal'},
	br: {lable: "Br", z: 35, type: 'nonmetal'},
	kr: {lable: "Kr", z: 36, type: 'nonmetal'},
	rb: {lable: "Rb", z: 37, type: 'metal'},
	sr: {lable: "Sr", z: 38, type: 'metal'},
	y: {lable: "Y", z: 39, type: 'metal'},
	zr: {lable: "Zr", z: 40, type: 'amphoter'},
	nb: {lable: "Nb", z: 41, type: 'metal'},
	mo: {lable: "Mo", z: 42, type: 'metal'},
	tc: {lable: "Tc", z: 43, type: 'metal'},
	ru: {lable: "Ru", z: 44, type: 'metal'},
	rh: {lable: "Rh", z: 45, type: 'metal'},
	pd: {lable: "Pd", z: 46, type: 'metal'},
	ag: {lable: "Ag", z: 47, type: 'amphoter'},
	cd: {lable: "Cd", z: 48, type: 'amphoter'},
	In: {lable: "In", z: 49, type: 'amphoter'},
	sn: {lable: "Sn", z: 50, type: 'amphoter'},
	sb: {lable: "Sb", z: 51, type: 'amphoter'},
	te: {lable: "Te", z: 52, type: 'nonmetal'},
	i: {lable: "I", z: 53, type: 'nonmetal'},
	xe: {lable: "Xe", z: 54, type: 'nonmetal'},
	cs: {lable: "Cs", z: 55, type: 'metal'},
	ba: {lable: "Ba", z: 56, type: 'metal'},
	la: {lable: "La", z: 57, type: 'metal'},
	ce: {lable: "Ce", z: 58, type: 'metal'},
	pr: {lable: "Pr", z: 59, type: 'metal'},
	nd: {lable: "Nd", z: 60, type: 'metal'},
	pm: {lable: "Pm", z: 61, type: 'metal'},
	sm: {lable: "Sm", z: 62, type: 'metal'},
	eu: {lable: "Eu", z: 63, type: 'metal'},
	gd: {lable: "Gd", z: 64, type: 'metal'},
	tb: {lable: "Tb", z: 65, type: 'metal'},
	dy: {lable: "Dy", z: 66, type: 'metal'},
	ho: {lable: "Ho", z: 67, type: 'metal'},
	er: {lable: "Er", z: 68, type: 'metal'},
	tm: {lable: "Tm", z: 69, type: 'metal'},
	yb: {lable: "Yb", z: 70, type: 'metal'},
	lu: {lable: "Lu", z: 71, type: 'metal'},
	hf: {lable: "Hf", z: 72, type: 'metal'},
	ta: {lable: "Ta", z: 73, type: 'metal'},
	w: {lable: "W", z: 74, type: 'metal'},
	re: {lable: "Re", z: 75, type: 'metal'},
	os: {lable: "Os", z: 76, type: 'metal'},
	ir: {lable: "Ir", z: 77, type: 'metal'},
	pt: {lable: "Pt", z: 78, type: 'metal'},
	au: {lable: "Au", z: 79, type: 'amphoter'},
	hg: {lable: "Hg", z: 80, type: 'amphoter'},
	tl: {lable: "Tl", z: 81, type: 'amphoter'},
	pb: {lable: "Pb", z: 82, type: 'amphoter'},
	bi: {lable: "Bi", z: 83, type: 'amphoter'},
	po: {lable: "Po", z: 84, type: 'amphoter'},
	at: {lable: "At", z: 85, type: 'nonmetal'},
	rn: {lable: "Rn", z: 86, type: 'nonmetal'},
	fr: {lable: "Fr", z: 87, type: 'metal'},
	ra: {lable: "Ra", z: 88, type: 'metal'}
};

var kations = [
	{formula: ["h", 0], valency: 1, name: "гідроген"},//цей повтор, щоб частіше траплялись кислоти, серед цих багатьох солей
	{formula: ["h", 0], valency: 1, name: "гідроген"},
	{formula: ["li", 0], valency: 1, name: "літій"},
	{formula: ["be", 0], valency: 2, name: "берилій"},
	{formula: ["b", 0], valency: 3, name: "бор"},
	{formula: ["n", 0, "h", 4], valency: 1, name: "амоній"},
	{formula: ["na", 0], valency: 1, name: "натрій"},
	{formula: ["mg", 0], valency: 2, name: "магній"},
	{formula: ["al", 0], valency: 3, name: "алюміній"},
	{formula: ["k", 0], valency: 1, name: "калій"},
	{formula: ["ca", 0], valency: 2, name: "кальцій"},
	{formula: ["ti", 0], valency: 4, name: "титан (IV)"},
	{formula: ["cr", 0], valency: 3, name: "хром (III)"},
	{formula: ["cr", 0], valency: 2, name: "хром (II)"},
	{formula: ["mn", 0], valency: 2, name: "манган (II)"},
	{formula: ["fe", 0], valency: 3, name: "ферум (III)"},
	{formula: ["fe", 0], valency: 2, name: "ферум (II)"},
	{formula: ["ni", 0], valency: 2, name: "нікель"},
	{formula: ["cu", 0], valency: 2, name: "купрум (II)"},
	{formula: ["zn", 0], valency: 2, name: "цинк"},
	{formula: ["ag", 0], valency: 1, name: "аргентум"},
	{formula: ["ba", 0], valency: 2, name: "барій"},
	{formula: ["hg", 0], valency: 2, name: "меркурій"},
	{formula: ["pb", 0], valency: 2, name: "плюмбум"},
	{formula: ["bi", 0], valency: 3, name: "вісмут"}
];
var anions = [
	{formula: ["h", 0], valency: 1, name: "гідрид"},
	{formula: ["c", 0, "o", 3], valency: 2, name: "карбонат"},
	{formula: ['h', 0, "c", 0, "o", 3], valency: 1, name: "гідроген карбонат"},
	{formula: ["n", 0, 'o', 3], valency: 1, name: "нітрат"},
	{formula: ["o", 0], valency: 2, name: "оксид"},
	{formula: ["o", 0], valency: 2, name: "оксид"},
	{formula: ["o", 0, 'h', 0], valency: 1, name: "гідроксид"},
	{formula: ["o", 0, 'h', 0], valency: 1, name: "гідроксид"},
	{formula: ["f", 0], valency: 1, name: "фторид"},
	{formula: ["al", 0, 'o', 2], valency: 1, name: "алюмінат"},
	{formula: ["si", 0, 'o', 3], valency: 2, name: "силікат"},
	{formula: ["p", 0, "o", 4], valency: 3, name: "фосфат"},
	{formula: ["s", 0, "o", 4], valency: 2, name: "сульфат"},
	{formula: ["s", 0, "o", 3], valency: 2, name: "сульфат"},
	{formula: ["s", 0], valency: 2, name: "сульфід"},
	{formula: ["cl", 0], valency: 1, name: "хлорид"},
	{formula: ["mn", 0, 'o', 4], valency: 1, name: "перманганат"},
	{formula: ["zn", 0, 'o' ,2], valency: 2, name: "цинкат"},
	{formula: ["br", 0], valency: 1, name: "бромід"},
	{formula: ["i", 0], valency: 1, name: "йодид"}
];

var naming = false;

function generateCompound() {
	if(naming) {
		showName();
	} else {
		clearAll(display);
		formula = createFormula();
		display.appendChild(formula);		
	}
	naming = !naming;
}

function clearAll(display) {
	display.innerHTML = "";
}

function createFormula() {
	var index, name;

	// Створити контейнер.
	var container = document.createElement('div');

	// Створити два випадковий цілих числа.
	var kationNumber = Math.floor(Math.random()*kations.length);
	var anionNumber = Math.floor(Math.random()*anions.length);

	// Просто синоніми, щоб коротше писати.
	var currentKat = kations[kationNumber];
	var currentAn = anions[anionNumber];
/*
	Наприклад, якщо вийшло так:
	anionNumber = 1
	currentAn = anions[1] 
	currentAn.formula =      ["c",  0,     "o",  3]
	currentAn.valency =        2
	currentAn.name =          "карбонат"
*/

	// Знайти найменше спільне кратне.
	var leastCommonMulitple = lcm(currentKat.valency, currentAn.valency);

	writeIon(currentKat, leastCommonMulitple, container);

	writeIon(currentAn, leastCommonMulitple, container);

	// А ще додамо ім'я.
	name = document.createElement('div');
	name.textContent += currentKat.name + ' ' + currentAn.name;
	name.style.fontSize = '0.4em';
	name.style.display = 'none'; // Але одразу не покажемо.
	container.appendChild(name);

	return container;
}

function writeIon(ion, leastCommonMulitple, container) {
	var index, elementIndex, lable, element;
	var complex = ion.formula.length > 2 ? true : false;
	var ionIndex = leastCommonMulitple/ion.valency;
	if (ionIndex>1) {
		if (complex) {
			container.appendChild(document.createTextNode('('));
		}
	}
	for (i=0, l=ion.formula.length; i<l; i += 2) {
		element = elements[ion.formula[i]]
		lable = document.createElement('span');
		lable.className = element.type;
		lable.textContent = element.lable;
		if(ion.formula[i+1]){
			elementIndex = document.createElement('sub');
			elementIndex.textContent = ion.formula[i+1];
			lable.appendChild(elementIndex);
		}
		container.appendChild(lable);
	}
	if (ionIndex>1) {
		if (complex) {
			container.appendChild(document.createTextNode(')'));
		}
		index = document.createElement('sub');
		index.textContent = ionIndex;
		container.appendChild(index);
	}
}

function gcf(a, b) {//Greatest Common Factor
	return (b == 0) ? a : gcf(b, a%b);
}
function lcm(a, b) {//Least Common Multiple
	return (a/gcf(a, b))*b;
}

function showName(e) {
	display.lastChild.lastChild.style.display = 'block';	
}




// Знайти у документі місце, де помістимо формулу.
display = document.getElementById('display'); 

// Будемо чекати команди.
document.addEventListener('mousedown', generateCompound, false);
document.addEventListener('keydown', generateCompound, false);
