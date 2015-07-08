var field = new HTMLCreator();

var mainCounter = 0;
field.addTag('table', 'gamefield', 'nonselect');
for (var i = 0; i < 3; i++) {
	field.addTag('tr');
	for (var j = 0; j < 3; j++) {
		field.addTag('td');
		field.addTag('table');
		mainCounter++;
		for (var k = 0; k < 3; k++) {
			field.addTag('tr');
			for (var l = 0; l < 3; l++) {				
				field.addTag('td', mainCounter + 'col' + k + l);
				field.addText(mainCounter*(k+1)*(l+1));
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





/*

var mainCounter = 0;
field.addTag('table', 'gamefield', 'nonselect');
for (var i = 0; i < 3; i++) {
	field.addTag('tr', 'mainrow' + i);
	for (var j = 0; j < 3; j++) {
		field.addTag('td', 'maincol' + i + j);
		field.addTag('table');
		mainCounter++;
		for (var k = 0; k < 3; k++) {
			field.addTag('tr', 'row' + j + k);
			for (var l = 0; l < 3; l++) {				
				field.addTag('td', mainCounter + 'col' + k + l);
				field.addText(mainCounter*(k+1)*(l+1))
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

*/
