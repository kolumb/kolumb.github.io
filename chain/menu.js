'use strict';
const lang = location.pathname.match(/^\/(\w\w)\//)?.[1] || "uk"
const translations =
	{ defaultNames:
		{ uk: ['Перший','Другий','Третій','Четвертий','П\'ятий','Шостий','Сьомий','Восьмий']
		, ru: ['Первый','Второй','Третий','Четвёртый','Пятый','Шестой','Седьмой','Восьмой']
		, en: ['First','Second','Third','Forth','Fifth','Sixth','Seventh','Eighth']
		}
	, quick:
		{ uk: "швидке"
		, ru: "быстрая"
		, en: "quick"
		}
	, on:
		{ uk: "вкл"
		, ru: "вкл"
		, en: "on"
		}
	, field:
		{ uk: "?поле="
		, ru: "?поле="
		, en: "?field="
		}
	, players:
		{ uk: "&гравці="
		, ru: "&игроки="
		, en: "&players="
		}
	, quiet:
		{ uk: "&тихо=так"
		, ru: "&тихо=да"
		, en: "&quiet=yes"
		}
	, speech:
		{ uk: "&мовлення="
		, ru: "&речь="
		, en: "&speech="
		}
	, voice:
		{ uk: "&голос="
		, ru: "&голос="
		, en: "&voice="
		}
	}

var btnPlayers = document.querySelectorAll('.players .button')
var btnField = document.querySelectorAll('.field-size .button')
var selection = document.querySelector('select')
var players = ['1', '2']
var fieldSize = 4
var mute = false
var speech = ''
var voice = undefined;
var colors = ['#cccccc', '#92D169', '#B880FF', '#FF6060', '#80E3FF', '#FFAA80', '#FF80FB', '#FFF080', '#80A6FF', '#80FFB4', '#FF80A6']
btnPlayers[0].style.backgroundColor = colors[1]
btnPlayers[0].style.color = "#fff"
btnPlayers[1].style.backgroundColor = colors[2]
btnPlayers[1].style.color = "#fff"

for(var j = 0; j < 3; j++){
	btnField[j].style.backgroundColor = "#afa090"
	btnField[j].style.color = "#fff"
}
document.querySelector('.players').addEventListener('click', function(e){
	if(e.target.nodeName !== "BUTTON") return;
	players = parseInt(e.target.textContent)
	for(var i=0; i<btnPlayers.length; i++){
		btnPlayers[i].style.backgroundColor = i<players ? colors[i+1] : "#eee"
		btnPlayers[i].style.color = i<players ? "#fff" : "#339"
	}
	getNames(players)
	var url = MakeURL(fieldSize, getNames(players.length), mute, speech, voice)
	playBtn.href = url
})
var defaultNames = translations.defaultNames[lang]
function getNames(n){
	players = []
	var names = defaultNames
	if(SpeechChk.checked) {
		var inputs = document.querySelectorAll('.button input')
		for (var i = 0; i < names.length; i++) {
			names[i] = inputs[i].value || defaultNames[i]
		}
	}
	for(var i = 0; i < n; i++){
		players.push(names[i])
	}
	return players
}
document.querySelector('.field-size').addEventListener('click', function(e){
	if(e.target.nodeName !== "BUTTON") return;
	fieldSize = parseInt(e.target.textContent)
	for(var i=0; i<btnField.length; i++){
		btnField[i].style.backgroundColor = i < fieldSize-1 ? "#afa090" : "#eee"
		btnField[i].style.color = i < fieldSize-1 ? "#fff" : "#339"
	}
	var url = MakeURL(fieldSize, getNames(players.length), mute, speech, voice)
	playBtn.href = url
})

var synth = window.speechSynthesis
var speechSupport = typeof synth === 'object' || !!speech
if(!speechSupport) SpeechChk.disabled = 'disabled'
var voices
function getVoices(){
	if(!speechSupport) return;
	voices = synth.getVoices()
	var options = document.querySelectorAll('option')
	for(var i = 0; i< voices.length; i++){
		if(options[i]) continue;
		var newOption = document.createElement("option")
		newOption.textContent = voices[i].name
		newOption.value = i
		selection.appendChild(newOption)
	}
}
document.querySelector('.options').addEventListener('click', function(e){
	if(SoundChk.checked) {
		mute = false
		SpeechChk.disabled = false
	} else {
		mute = true
		SpeechChk.disabled = 'disabled'
		document.querySelector('.synth').style.display = 'none'
		var url = MakeURL(fieldSize, getNames(players.length), mute, speech, voice)
		playBtn.href = url
		return;
	} 
	if(SpeechChk.checked) {
		getVoices()
		document.querySelector('.players').classList.add('custom-names')
		document.querySelector('.synth').style.display = 'block'
		speech = SpeedChk.checked ? translations.quick[lang] : translations.on[lang]
		if(e.target.nodeName === 'SELECT') {
			voice = e.target.selectedIndex
		}
	} else {
		document.querySelector('.players').classList.remove('custom-names')
		speech = ''
		voice = undefined
		document.querySelector('.synth').style.display = 'none'
	}
	var url = MakeURL(fieldSize, getNames(players.length), mute, speech, voice)
	playBtn.href = url
})

/*
level, playersNames, speech, voice
./?рівень=4&гравці=Перший,Другий&тихо=так&мовлення=швидке&голос=0
./?уровень=4&игроки=Первый,Второй&тихо=да&речь=быстрая&голос=0
./?level=4&players=First,Second&quiet=yes&speech=fast&voice=0
*/
function MakeURL(level, playersNames, mute, speech, voice) {
	level = level || 4
	playersNames = playersNames || [translations.defaultNames[lang][0],translations.defaultNames[lang][1]]
	speech = speech || ''
	var url = './'
	url+= document.location.hostname ? '' : 'index.html'
	url+=translations.field[lang] + level
	url+=translations.players[lang]
	for(var i = 0; i < playersNames.length; i++){
		url+=playersNames[i]
		if(i!== playersNames.length - 1) url+=','
	}
	if(mute) {
		url += translations.quiet[lang]
	} else {
		url+= speech ? translations.speech[lang] + speech : ''
		url+= voice !== undefined ? translations.voice[lang] + voice : ''
	}
	return url
}
