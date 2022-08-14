var consolelog = function(){
	ConsoleWrapper.classList.add('expand-console');
	Console.textContent += Array.prototype.slice.call(arguments).join(' ') + '\n';

	ConsoleWrapper.scrollTop = ConsoleWrapper.scrollHeight;
	console.log.apply(console, arguments);
}
var intervals = [];
var programs = [];
var examples;
examples = [
"функция Привет () {\n" +
"    если (истина) {\n" +
"        консоль (\"Привет мир!\")\n" +
"    } иначе {\n" +
"        консоль (\"Быть такого не может!\")\n" +
"    }\n" +
"}\n" +
"\n" +
"Привет ()\n"

,

"Холст.ширина = 200;\n" +
"Холст.высота = 200;\n\n" +
'переменная случ1 = 70*Математика.случайное();\n' +
'переменная случ2 = 70*Математика.случайное();\n' +
"переменная кадр = Холст.Контекст;\n" +
"кадр.стильЛинии = 'красная';\n" +
"кадр.начатьПуть();\n" +
"кадр.подвинутьНа(случ1+5,случ2+5);\n" +
"кадр.линиюНа(случ1+30,случ2+20);\n" +
"кадр.линиюНа(случ1+20,случ2+30);\n" +
"кадр.замкнутьПуть();\n" +
"кадр.начертить();\n" +
"\n" +
"кадр.стильЗаливки = 'зелёная';\n" +
"кадр.шрифт = 'курсив средний Colibry';\n" +
"кадр.залитьТекст('Начало координат', случ1+30, случ2+35);\n"

,

"var size, ball, frames, ctx;\n" +
"Canvas.width = Canvas.height = size = window.innerWidth/2 - 20;\n" +
"ctx = Canvas.getContext('2d');\n" +
"ctx.fillStyle = '#abc';\n" +
"\n" +
"function initBall() {\n" +
"    frames = 0;\n" +
"    ball = {\n" +
"        radius: size/10,\n" +
"        x: 300,\n" +
"        y: 450,\n" +
"        speed: (Math.random()*2 - 1)\n" +
"    };\n" +
"    ball.speedX = -3 + Math.random()*ball.speed;\n" +
"    ball.speedY = -2 + Math.random()*ball.speed;\n" +
"}\n" +
"\n" +
"function updateBall() {\n" +
"    ball.x += ball.speedX;\n" +
"    ball.y += ball.speedY;\n" +
"\n" +
"    if( ball.x < ball.radius ) {\n" +
"        ball.x = ball.radius;\n" +
"        ball.speedX = -ball.speedX; }\n" +
"\n" +
"    if( ball.x > size - ball.radius ) {\n" +
"        ball.x = size - ball.radius;\n" +
"        ball.speedX = -ball.speedX; }\n" +
"\n" +
"    if( ball.y < ball.radius ) {\n" +
"        ball.y = ball.radius;\n" +
"        ball.speedY = -ball.speedY; }\n" +
"\n" +
"    if( ball.y > size - ball.radius ) {\n" +
"        ball.y = size - ball.radius;\n" +
"        ball.speedY = -ball.speedY; }\n" +
"}\n" +
"\n" +
"\n" +
"function drawBall() {\n" +
"    ctx.clearRect(0,0,size,size);\n" +
"    ctx.beginPath();\n" +
"    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, false);\n" +
"    ctx.fill();\n" +
"}\n" +
"\n" +
"function frame() {\n" +
"    updateBall();\n" +
"    drawBall();\n" +
"    if(frames++ > 234) {\n" +
"        initBall();\n" +
"    }\n" +
"}\n" +
"\n" +
"initBall();\n" +
"intervals.push(setInterval(frame, 12));\n"
];
examples.forEach(function(item) {
	programs.push(item);
});

var vocabulary = {
	//'':	'',
	'консоль':		'consolelog',
	'внимание':		'alert',
	'переменная':	'var',
	'пусть':		'var',
	'это':			'=',
	'функция':		'function',
	'вернуть':		'return',
	'если':			'if',
	'иначе':		'else',
	'пока':			'while',
	'для':			'for',
	'цикл':			'for',
	'истина':		'true',
	'правда':		'true',
	'да':			'true',
	'ложь':			'false',
	'неправда':		'false',
	'нет':			'false',
	'окно':			'window',
	'документ':		'document',
	'внутренняяШирина': 'innerWidth',
	'внутренняяВысота': 'innerHeight',
	'Холст':		'Canvas',
	'Контекст':		'getContext("2d")',
	'ширина':		'width',
	'высота':		'height',
	'стильЗаливки':	'fillStyle',
	'стильЛинии':	'strokeStyle',
	'красная':		'red',
	'синяя':		'blue',
	'желтая':		'yellow',
	'черная':		'black',
	'зелёная':		'green',
	'зеленая':		'green',
	'ширинаЛинии':	'lineWidth',
	'толщинаЛинии':	'lineWidth',
	'начатьПуть':	'beginPath',
	'замкнутьПуть':	'closePath',
	'закрытьПуть':	'closePath',
	'закончитьПуть': 'closePath',
	'подвинутьНа':	'moveTo',
	'линиюНа':		'lineTo',
	'начертить':	'stroke',
	'шрифт':		'font',
	'залитьТекст':	'fillText ',
	'залить':		'fill',
	'курсив':		'italic',
	'курсивный':	'italic',
	'крупный':		'28px',
	'средний':		'16px',
	'мелкий':		'12px',
	'Математика':	'Math',
	'случайное':	'random',
	'от':	'(',
	'до':	')',
	'начало':	'{',
	'конец':	'}',
};


var compile = function () {
	var temp = RusInput.value;
	temp = temp.replace(/[\wа-яё]+/gi, function(match) {
		if(vocabulary[match] !== undefined) {
			return vocabulary[match]
		} else {
			return match;
		}
	});
	// if(localStorage) {
	// 	localStorage['program' + currentProgram] = temp;
	// }
	EngOutput.value = temp;
	intervals.forEach(function(interval){clearInterval(intervals.pop());})
	try {
		eval(temp); //eval is evil!..
	} catch(e) {
		// if(localStorage) {
		// 	currentProgram = localStorage['currentProgram'] = 0;
		// }
		RusInput.value = '';
		consolelog('Ошибка в программе: ' + e);
		console.log(e);
	}
}
var selectProgram = function(id) {
	currentProgram = id;
	// if(localStorage) {
	// 	localStorage.currentProgram = id;
	// }
	RusInput.value = programs[id];
	ExampleSelect.value = id;
	compile();
}
var currentProgram = 0;
var programsCounter = examples.length-1;
// if(localStorage) {
// 	if(!localStorage.programsCounter) {
// 		localStorage.programsCounter = examples.length-1;
// 		localStorage.currentProgram = 0;
// 	} else {
// 		programsCounter = localStorage.programsCounter;
// 
// 		currentProgram = localStorage.currentProgram;
// 		var name, option;
// 		for (var i = 0; i <= programsCounter; i++) {
// 			programs[i] = localStorage['program' + i];
// 			option = document.createElement('option');
// 			option.textContent = localStorage['programName' + i];
// 			option.value = '' + i;
// 			ExampleSelect.appendChild(option);
// 		};
// 	}
// }
if(location.hash){
	for (var i = 0; i < ExampleSelect.options.length; i++) {
		if (ExampleSelect.options[i].textContent === location.hash.substr(1)) {
			selectProgram(i);
		}
	};
} else {
	selectProgram(currentProgram);
}
var runs = 0;


CompileButton.addEventListener('click', function(e){
	if(runs === 0) {
		runs++;
		return;
	}
	compile();
}, false);


ResultButton.addEventListener('click', function (e) {
	EngOutput.classList.toggle('hide');console.log('toggle');
}, false);

ExampleSelect.addEventListener('change', function (e) {
	programs[currentProgram] = RusInput.value;
	// if(localStorage){
	// 	localStorage['program' + currentProgram] = RusInput.value;
	// }
	var id = ExampleSelect.options.selectedIndex;
	selectProgram(id);
}, false);


NewButton.addEventListener('click', function (e) {
	var option = document.createElement('option');
	if(programsCounter) {
		programsCounter++;
	} else {
		programsCounter = examples.length;
	}
	option.textContent = 'Моя программа ' + programsCounter;
	option.value = programsCounter;
	ExampleSelect.appendChild(option);
	ExampleSelect.value = currentProgram = programsCounter;
	// if(localStorage) {
	// 	localStorage.currentProgram = localStorage.programsCounter = programsCounter;
	// 	localStorage['program' + (programsCounter-1)] = RusInput.value;
	// 	localStorage['program' + programsCounter] = '';
	// 	localStorage['programName' + programsCounter] = 'Моя программа ' + programsCounter;
	// }
	programs[programsCounter] = RusInput.value;
	RusInput.value = '';
}, false);


RenameButton.addEventListener('click', function(e) {
	var node = ExampleSelect.options[ExampleSelect.options.selectedIndex]
	var name = prompt("Введите новое имя", node.textContent);
	if(!name) return;
	node.textContent=name;
	// if(localStorage) {
	// 	localStorage['programName' + programsCounter] = name;
	// }
},false);



ResetButton.addEventListener('click', function(e) {
	// if(localStorage){
	// 	localStorage.clear();
	// }
	for(;programsCounter>=examples.length; programsCounter--){
		ExampleSelect.options[programsCounter] = null;
		programs.pop();
	}
	ExampleSelect.value = currentProgram = programsCounter;
	RusInput.value = programs[programsCounter];

},false);

RusInput.addEventListener('change', function(e) {
	runs = 0;
	compile();
	// if(localStorage) {
	// 	localStorage['program' + currentProgram] = RusInput.value;
	// }
},false);
RusInput.addEventListener('keyup', function(e) {
	if(e.which === 13) {
		compile();
		// if(localStorage) {
		// 	localStorage['program' + currentProgram] = RusInput.value;
		// }		
	}
},false);