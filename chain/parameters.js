"use strict"

var debug = false // true //
var detailed = false // true //

var maxPlayers = 2
, level = 2 //
, speech = false
, mute = true	// false
, userNames = ['Эй ты','Первый','Второй','Третий','Четвёртый','Пятый','Шестой','Седьмой','Восьмой']
, parameters
if(window.location.search) {
	parameters = []
	parameters = window.location.search.substring(1).split('&').reduce(function(obj, pair){
		if(!pair) {return obj}
		pair = pair.split('=')
		obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1])
		return obj
	},{})
	level = parameters.поле || level
	if(parameters.тихо) mute = true
	if(parameters.речь) speech = true
	if(parameters.игроки){
		parameters.игроки = parameters.игроки.split(',')
		for(var i = 1; i < userNames.length; i++){
			if(parameters.игроки[i-1]) {
				userNames[i] = parameters.игроки[i-1]
				maxPlayers = i
			}
		}
	}
}
if(debug){
	console.log('============= Debuging =============')
	console.log('level', level)
	console.log('mute', mute)
	console.log('speech', speech)
}