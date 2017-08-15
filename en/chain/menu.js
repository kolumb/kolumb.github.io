'use strict';
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
	players = parseInt(e.target.innerText)
	for(var i=0; i<btnPlayers.length; i++){
		btnPlayers[i].style.backgroundColor = i<players ? colors[i+1] : "#eee"
		btnPlayers[i].style.color = i<players ? "#fff" : "#339"
	}
	getNames(players)
})
var defaultNames = ['First','Second','Third','Fourth','Fifth','Sixth','Seventh','Eighth']
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
	fieldSize = parseInt(e.target.innerText)
	for(var i=0; i<btnField.length; i++){
		btnField[i].style.backgroundColor = i < fieldSize-1 ? "#afa090" : "#eee"
		btnField[i].style.color = i < fieldSize-1 ? "#fff" : "#339"
	}
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
		newOption.innerText = voices[i].name
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
		return;
	} 
	if(SpeechChk.checked) {
		getVoices()
		document.querySelector('.players').classList.add('custom-names')
		document.querySelector('.synth').style.display = 'block'
		speech = SpeedChk.checked ? 'quick' : 'on'
		if(e.target.nodeName === 'SELECT') {
			voice = e.target.selectedIndex
		}
	} else {
		document.querySelector('.players').classList.remove('custom-names')
		speech = ''
		voice = undefined
		document.querySelector('.synth').style.display = 'none'
	}
})

playBtn.addEventListener('click', function(e){
	var url = MakeURL(fieldSize, getNames(players.length), mute, speech, voice)
	playBtn.href = url
})
/*
level, playersNames, speech, voice
./?поле=4&игроки=Первый,Второй&тихо=да&речь=быстрая&голос=0
*/
function MakeURL(level, playersNames, mute, speech, voice) {
	level = level || 4
	playersNames = playersNames || ['First','Second']
	speech = speech || ''
	var url = './'
	url+= document.location.hostname ? '' : 'index.html'
	url+='?field=' + level
	url+='&players='
	for(var i = 0; i < playersNames.length; i++){
		url+=playersNames[i]
		if(i!== playersNames.length - 1) url+=','
	}
	if(mute) {
		url += '&silent=yes'
	} else {
		url+= speech ? '&speech=' + speech : ''
		url+= voice !== undefined ? '&voice=' + voice : ''
	}
	return url
}