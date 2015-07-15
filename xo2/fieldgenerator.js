var field = new HTMLCreator();
var fieldArray = [];
var mainCounter = 0;
field.addTag('table', 'gamefield', 'noselect');
for (var i = 0; i < 3; i++) {
	field.addTag('tr');
	for (var j = 0; j < 3; j++) {
		field.addTag('td');
		field.addTag('table');
		mainCounter++;
		for (var k = 0; k < 3; k++) {
			field.addTag('tr');
			for (var l = 0; l < 3; l++) {				
				field.addTag('td');
				field.addText(mainCounter*(k*3 + l+1));
				field.addTag('div', 'cell' + (27*i + 9*j + 3*k + l), 'over');
				fieldArray[27*i + 9*j + 3*k + l] = mainCounter*(k*3 + l+1);
				field.closeTag();
				field.closeTag();
			};
			field.closeTag();
		};
		field.closeTag();
		field.closeTag();
	}
	field.closeTag();
};
field.closeTag();

field.log();

document.body.innerHTML = '\n' + fieldArray + document.body.innerHTML;
//console.log("fieldArray = " + fieldArray);

var productArray = [];
for( var i = 0; i < 82; i++ ) {
	productArray[i] = '[ ';
}
for( var i = 0; i < 81; i++ ) {

	productArray[fieldArray[i]] += i + ',';
}
for( var i = 0; i < 82; i++ ) {
	productArray[i] = productArray[i].slice(0, -1) + ']';
}
document.body.innerHTML = '\n' + productArray + document.body.innerHTML;
//console.log("productArray = " + productArray);