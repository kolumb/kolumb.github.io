'use strict';

function norm(value, min, max) {
  return (value - min) / (max - min)
}
function lerp(norm, min, max) {
  return (max - min) * norm + min
}
function map(value, sourceMin, sourceMax, destMin, destMax) {
  return lerp(norm(value, sourceMin, sourceMax), destMin, destMax)
}

const ctx = graphCanvas.getContext('2d')
const uiCtx = uiCanvas.getContext('2d')
let width
let height
const resize = function(){
	width = window.innerWidth-40
	height = window.innerHeight-40
	graphCanvas.width = width
	graphCanvas.height = height
	uiCanvas.width = width
	uiCanvas.height = height

	line =uiCtx.lineWidth = ctx.lineWidth = Math.floor(height/oldest)
	uiCtx.font = '15px sans-serif'

	toCenter = Math.floor((height-oldest*line)/2)
	draw()
}

const data = rawData.split(' ').map( x => x.split('_') )
const gender = 0
const age = 1

const oldest = data.reduce(function(max, person){
			if(person[age] > max) return person[age]
			return max
		}, 0)
console.log('Oldest', oldest)

const ages =
	{ M: []
	, F: []
	}
ages.M.length = oldest+1
ages.F.length = oldest+1
ages.M.fill(0)
ages.F.fill(0)
data.map( person => ages[person[gender]][person[age]]++ )

const mostNumerous = Math.max(
	Math.max.apply(null, ages.M)
	, Math.max.apply(null, ages.F)
)


let line
let toCenter


const way =
	{ M: -1
	, F: 1
	}

const colors = 
	{ M:
		{ old: '#003AB0'
		, middle: '#3471EC'
		, young: '#85BBF7'
		}
	, F:
		{ old: '#B00058'
		, middle: '#EC348F'
		, young: '#F785BE'
		}
	}

const bar = function(ctx, gender, i, vertical, highlight){
	if(ages[gender][i]){
		ctx.beginPath()
		ctx.strokeStyle = highlight ? '#404' : colors[gender][i>59 ? 'old':i<19 ? 'young':'middle']
		ctx.moveTo(way[gender]*line, vertical)
		ctx.lineTo(way[gender]*map(ages[gender][i], 0, mostNumerous, 0, width/2), vertical)
		ctx.stroke()
	}
}

const draw = function(){
	let value
	ctx.save()
	ctx.translate(Math.floor(width/2), 0)
	for(let i = 0; i <= oldest; i++){
		value = height - i * line - toCenter + (line%2)/2
		bar(ctx, 'M', i, value, false)
		bar(ctx, 'F', i, value, false)
	}
	ctx.restore()
}
resize()
window.addEventListener('resize', resize)

const tipHight = 30
const tipWidth = 50
const tip = function(gender, age, vertical){
	if(age<0 || age > oldest) return
	const dir = -way[gender]
	const x = dir*(tipWidth+line)-tipWidth
	const y = vertical-tipHight
	uiCtx.fillStyle = '#404'
	uiCtx.fillRect( x, y, tipWidth*2, tipHight*2)

	uiCtx.beginPath()
	uiCtx.moveTo(dir*(line), y)
	uiCtx.lineTo(-dir*(line*2), y + tipHight)
	uiCtx.lineTo(dir*(line), y + tipHight*2)
	uiCtx.closePath()
	uiCtx.fill()

	uiCtx.fillStyle = '#cec'
	const lastDigit = age%10
	const years = lastDigit === 1 ? " год" : lastDigit > 4 || lastDigit === 0 ? " лет" : " года"
	const value = ages[gender][age]
	const humans = ((value >19 || value < 11)&&((value%10 > 1) && (value%10 < 5))) ? " человека" : " человек"
	uiCtx.fillText(age + years, x+tipWidth/5,y+tipHight*.7)
	uiCtx.fillText(value + humans, x+tipWidth/5,y+tipHight*1.55)
}

const mousemove = function(e){
	const x = e.layerX
	const y = height - e.layerY - toCenter
	const age = Math.floor(y / line)
	const gender = x < width/2 ? 'M':'F'

	uiCtx.clearRect(0,0,width, height)
	uiCtx.save()
	uiCtx.translate(Math.floor(width/2), 0)

	const vertical = height - age * line - toCenter + (line%2)/2
	bar(uiCtx, gender, age, vertical, true)
	tip(gender, age, vertical)
	uiCtx.restore()
}
window.addEventListener('mousemove', mousemove)

