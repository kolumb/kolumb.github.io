var synth = window.speechSynthesis
, voices, winUtter

, winPhrases = [
	"Неплохо"
	,"Вот это да!"
	,"Так держать!"
	,"Хороший ход!"
	,"Супер!"
	,"Ух ты!"
]
, phrases = [
	"Твой ход "
	,"А теперь ходит "
	,"Все ждут тебя "
	,"А как ты походишь "
	,"Не спи "
	,"Давай "
	,"Ходи "
	,"Твоя очередь "
]
, utterThis = []

if(!mute){
	var errSound = new Audio('error.mp3')
	, infiniteSound = new Audio('infinite.mp3')
	, end = false
	, pop = [null,
	new Audio('pop1.mp3'),
	new Audio('pop2.mp3'),
	new Audio('pop3.mp3'),
	new Audio('pop4.mp3'),
	new Audio('pop5.mp3'),
	new Audio('pop1.mp3'),
	new Audio('pop2.mp3'),
	new Audio('pop3.mp3'),
	new Audio('pop4.mp3'),
	new Audio('pop5.mp3')]
	, pops = new Audio('pops.mp3')
	pops.loop = true
}

function wrongMoveSound(){
	if(!mute) errSound.play()
}

function finishExplosionSound(sizeOfExplosion){
	if(!mute) {
		pops.pause()
		pops.currentTime = 0
	}
	if(sizeOfExplosion>3 && speech) {
		if(synth.speaking) synth.cancel()
		synth.speak(
			winUtter[
				Math.floor(
					Math.random()*winPhrases.length
				)
			]
		)
	}
}
function sayWhoIsNext(player,sizeOfExplosion){
	if(speech) {
		// if you plaing quickly, phrazes announcing next player staking and lag.
		if(synth.speaking && sizeOfExplosion<4) synth.cancel()
		synth.speak(utterThis[Math.floor(phrases.length*Math.random())
			+ (player-1)*phrases.length])
	}
}
function victorySound(){
	if(!mute) {
		infiniteSound.play()
		pops.volume = .3
	}
}

window.addEventListener('load', function(){
	if(typeof synth !== 'object' || !speech) {
		speech = false
		return;
	}
	voices = synth.getVoices()
	winUtter = winPhrases.map(phrase => new SpeechSynthesisUtterance(phrase))
	var voiceRu = 0
	for(var i = 0; i < voices.length; i++){
		if(voices[i].name.indexOf('русский') > -1 ){
			voiceRu = i
		}
	}
	if(voices[voiceRu]){
		voiceRu = voices[voiceRu]
	} else if(voices[0] && voices[0].name) {
		voiceRu = voices[0]
	} else {
		speech = false
		return;
	}
	for(var j = 0; j < phrases.length; j++) {
		for (var i = 0; i < maxPlayers; i++) {
			utterThis[i*phrases.length+j] = new SpeechSynthesisUtterance(
					phrases[j] + userNames[i+1]
				)
			utterThis[i*phrases.length+j].voice = voiceRu
			if(parameters.голос) utterThis[i*phrases.length+j].voice = voices[parameters.голос]
			if(parameters.речь === "быстрая") {
				utterThis[i*phrases.length+j].pitch = .6
				utterThis[i*phrases.length+j].rate = 2
			}
		}
	}
	synth.speak(utterThis[0])
})