"use strict"
const lang = location.pathname.match(/^\/(\w\w)\//)?.[1] || "uk"
const translations =
	{ winPhrases:
		{ uk: ["Непогано","Оце-то так!","Так тримати!","Добрий хід!","Супер!","Ой вей!"]
		, ru: ["Неплохо","Вот это да!","Так держать!","Хороший ход!","Супер!","Ух ты!"]
		, en: ["Not bad","Amazing!","Keep it up!","Good move!","Excelent!","Wow!"]
		}
	, phrases:
		{ uk: ["Твій хід ","А тепер ходить ","Всі чекають на тебе ","А як ти походиш ","Не спи ","Давай ","Ходи ","Твоя черга "]
		, ru: ["Твой ход ","А теперь ходит ","Все ждут тебя ","А как ты походишь ","Не спи ","Давай ","Ходи ","Твоя очередь "]
		, en: ["Your move ","And next move will make ","Everybody is waiting for you ","What's your move ","Don't sleep ","Come on ","Please, move ","Your turn "]
		}
	, defaultNames:
		{ uk: ['Гей ти','Перший','Другий','Третій','Четвертий','П\'ятий','Шостий','Сьомий','Восьмий']
		, ru: ['Эй ты','Первый','Второй','Третий','Четвёртый','Пятый','Шестой','Седьмой','Восьмой']
		, en: ['Hey, you','First','Second','Third','Forth','Fifth','Sixth','Seventh','Eighth']
		}
	, language:
		{ uk: "українська"
		, ru: "русский"
		, en: "english"
		}
	, quick:
		{ uk: "швидке"
		, ru: "быстрая"
		, en: "quick"
		}
	, voice:
		{ uk: "голос"
		, ru: "голос"
		, en: "voice"
		}
	, speech:
		{ uk: "мовлення"
		, ru: "речь"
		, en: "speech"
		}
	, field:
		{ uk: "поле"
		, ru: "поле"
		, en: "field"
		}
	, quiet:
		{ uk: "тихо"
		, ru: "тихо"
		, en: "quiet"
		}
	, players:
		{ uk: "гравці"
		, ru: "игроки"
		, en: "players"
		}
	}

var synth = window.speechSynthesis
var speech = false
var mute = false
var voices, winUtter

var winPhrases = translations.winPhrases[lang]
var phrases = translations.phrases[lang]
var utterThis = []
window.addEventListener('load', function(){
	if(typeof synth !== 'object' || !speech) {
		speech = false
		return;
	}
	voices = synth.getVoices()
	winUtter = winPhrases.map(phrase => new SpeechSynthesisUtterance(phrase))
	var voiceIndex = 0
	for(var i = 0; i < voices.length; i++){
		if(voices[i].name.toLowerCase().indexOf(translations.language[lang]) > -1 ){
			voiceIndex = i
		}
	}
	if(voices[voiceIndex]){
		voiceIndex = voices[voiceIndex]
	} else if(voices[0] && voices[0].name) {
		voiceIndex = voices[0]
	} else {
		speech = false
		return;
	}
	for(var j = 0; j < phrases.length; j++) {
		for (var i = 0; i < maxPlayers; i++) {
			utterThis[i*phrases.length+j] = new SpeechSynthesisUtterance(
					phrases[j] + userNames[i+1]
				)
			utterThis[i*phrases.length+j].voice = voiceIndex
			if(parameters[translations.voice[lang]]) utterThis[i*phrases.length+j].voice = voices[parameters[translations.voice[lang]]]
			if(parameters[translations.speech[lang]] === translations.quick[lang]) {
				utterThis[i*phrases.length+j].pitch = .6
				utterThis[i*phrases.length+j].rate = 2
			}
		}
	}
	synth.speak(utterThis[0])
})
var maxPlayers = 2
var level = 4
var userNames = translations.defaultNames[lang]
var parameters
if(window.location.search) {
	parameters = []
	parameters = window.location.search.substring(1).split('&').reduce(function(obj, pair){
		if(!pair) {return obj}
		pair = pair.split('=')
		obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1])
		return obj
	},{})
	level = parameters[translations.field[lang]] || level
	if(parameters[translations.quiet[lang]]) mute = true
	if(parameters[translations.speech[lang]]) speech = true
	if(parameters[translations.players[lang]]){
		parameters[translations.players[lang]] = parameters[translations.players[lang]].split(',')
		for(var i = 1; i < userNames.length; i++){
			if(parameters[translations.players[lang]][i-1]) {
			userNames[i] = parameters[translations.players[lang]][i-1]
				maxPlayers = i
			}
		}
	}
}
if(!mute){
	var errSound = new Audio('../../chain/error.mp3')
	var infiniteSound = new Audio('../../chain/infinite.mp3')
	var end = false
	var pop = [null,
	new Audio('../../chain/pop1.mp3'),
	new Audio('../../chain/pop2.mp3'),
	new Audio('../../chain/pop3.mp3'),
	new Audio('../../chain/pop4.mp3'),
	new Audio('../../chain/pop5.mp3'),
	new Audio('../../chain/pop1.mp3'),
	new Audio('../../chain/pop2.mp3'),
	new Audio('../../chain/pop3.mp3'),
	new Audio('../../chain/pop4.mp3'),
	new Audio('../../chain/pop5.mp3')]
	var pops = new Audio('../../chain/pops.mp3')
	pops.loop = true
	var plaing = false
}

var buffer = document.createElement('canvas'); 
var bufctx = buffer.getContext('2d');
var ctx = Canvas.getContext('2d')
ctx.globalCompositeOperation = "lighter"
var width
var height
var vertical

var logicFPS = 1000/7
var FPS = 1000/24
var before = 0

var field
var cellSize
var fix
var fieldSize
var maxCells
var cells = []
var stages = [.1, .3, .7, 1.2, 1.6, 2, 2.4, 2.8]
var unstable = false
var explosion = 0
var sizeOfExplosion

var player = 1
var lightColors = ['#cccccc', '#92D169', '#B880FF', '#FF6060', '#80E3FF', '#FFAA80', '#FF80FB', '#FFF080', '#80A6FF', '#80FFB4', '#FF80A6']

var darkColors = ['#bbbbbb', '#FF8080', '#78BEF0', '#DED16F', '#CC66C9', '#5DBAAC', '#F2A279', '#7182E3', '#92D169', '#BF607C', '#81DCE4']
var colors = lightColors


var error

function Vector(x,y) {
	this.x = x
	this.y = y
}
(function(){
	this.add = function (v) {
		return new Vector(this.x + v.x, this.y + v.y)
	}
	this.mult = function(multiplicator) {
		return new Vector(this.x * multiplicator, this.y * multiplicator)
	}
	this.length = function() {
		return Math.sqrt(this.x*this.x + this.y*this.y)
	}
}).call(Vector.prototype)


function createCells() {
	for (var i = 0; i < field.max; i++){
		cells.push( new Cell(i) )
	}	
}

function placeCells() {
	for (var i = 0; i<field.size.x; i++){
		for (var j = 0; j<field.size.y; j++){
			cells[j*field.size.x+i].place(i,j)
		}
	}
}

function clickHandler(event) {
	if(unstable) {
		error = new Vector(event.layerX, event.layerY)
		if(!mute) errSound.play()
		setTimeout(field.redraw, logicFPS*2)
		return
	}
	var x = 0|((event.layerX - !field.vertical*field.fix)/field.cellSize)
	var y = 0|((event.layerY - field.vertical*field.fix)/field.cellSize)
	var cell = y*field.size.x + x

	if(!field.owners[cell] || field.owners[cell] === player) {
		field.add(cell)
		unstable = true
		setTimeout(field.update, logicFPS)
		if(!plaing) {
			plaing = true
			if(!mute) pop[player].play()
		}
	} else {
		error = new Vector(event.layerX, event.layerY)
		if(!mute) errSound.play()
		setTimeout(field.redraw, logicFPS*2)
	}
	field.redraw()
}

function frame(stamp) {
	for(var i = 0; i < field.max; i++) {
		cells[i].draw()
	}
}

function startGame() {
	field = new Field(level)
	createCells()
	placeCells()
	//setTimeout(field.update, logicFPS)
	field.redraw()
	window.addEventListener('resize', field.resize, false)
	Canvas.addEventListener('click', clickHandler, false)
}
startGame()
