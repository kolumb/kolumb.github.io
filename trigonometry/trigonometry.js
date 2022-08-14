(function () {
	'use strict';
	const lang = location.pathname.match(/^\/(\w\w)\//)?.[1] || "uk"
	const translations =
		{ radians:
			{ uk: "радіан"
			, ru: "радиан"
			, en: "radians"
			}
		, arcLength:
			{ uk: "Довжина дуги"
			, ru: "Длина дуги"
			, en: "Arc length"
			}
		}
	/*
		5 regimes: 
			2: procents;
			3: desctiptive;
			4: progection;
			5: coordinates;
	*/
Math.sign = Math.sign || function(x) {
  x = +x; // convert to a number
  if (x === 0 || isNaN(x)) {
    return x;
  }
  return x > 0 ? 1 : -1;
}

var Canvas = document.getElementById("Canvas"),
ctx = Canvas.getContext('2d'),
BufferCanvas = document.createElement('canvas'),
buffer = BufferCanvas.getContext('2d'),
Checks = document.getElementById("Checks"),

Width, halfWidth,
Height, halfHeight,
scrollBarWidth,
unitRadius,
unitRadiusFactor = 0.3,
horizontal,
minSide,
lineWidth,
mainFactor = 0.45,
smallFactor = 0.1,
halfSmallFactor = 0.05,
microFactor = 0.02,
graphSize,
angle = Math.PI/3,
newAngle = 0,
anim,
draging = false,
pointerX = 0,
pointerY = 0,
toDegree = Math.PI/180,
bRad = true,
bSin = true,
bCos = false,
bTan = false,
bCtn = false,

selectedType = 'default',
initCanvas = function() {
	Canvas.width = BufferCanvas.width = Width = window.innerWidth//-scrollBarWidth;
	Canvas.height = BufferCanvas.height = Height = window.innerHeight;
	halfWidth = Math.round(Width / 2);
	halfHeight = Math.round(Height / 2);
	ctx.translate(halfWidth, halfHeight);
	buffer.translate(halfWidth, halfHeight);
	horizontal = Width>Height;
	minSide = horizontal ? Height : Width;
	graphSize = minSide*mainFactor,
	ctx.lineWidth = buffer.lineWidth = lineWidth = Math.ceil(minSide/400);
	ctx.font = buffer.font = lineWidth*15+'px Garamond,Cambria,serif';
	unitRadius = unitRadiusFactor*minSide;

	drawBuffer();
	frame();
},
drawBuffer = function() {
	buffer.fillStyle = 'white';
	buffer.fillRect(-halfWidth, -halfHeight, Width, Height);	

	switch(selectedType) {
	case 'default':		
	case 'radians':
	case 'vectors':
		buffer.strokeStyle = '#6f789f';
		buffer.lineCap = 'round';
		buffer.fillStyle = '#6f789f';

		buffer.beginPath(); //BigCircle
		buffer.arc(0, 0, unitRadius, 0, Math.PI * 2);
		buffer.save(); //Top arrow
		buffer.translate(0,-minSide*mainFactor);
		buffer.moveTo(-microFactor*graphSize, smallFactor*graphSize);
		buffer.quadraticCurveTo(0,halfSmallFactor*graphSize, 0,0);
		buffer.quadraticCurveTo(0,halfSmallFactor*graphSize, microFactor*graphSize,smallFactor*graphSize);
		buffer.fillText('sin α', halfSmallFactor*graphSize, (smallFactor + microFactor)*graphSize);
		buffer.restore();

		buffer.save(); //Right arrow
		buffer.translate(minSide*mainFactor,0);
		buffer.moveTo(-graphSize*smallFactor, -microFactor*graphSize);
		buffer.quadraticCurveTo(-halfSmallFactor*graphSize,0, 0,0);
		buffer.quadraticCurveTo(-halfSmallFactor*graphSize,0, -smallFactor*graphSize,microFactor*graphSize);
		buffer.fillText('cos α', -(smallFactor + microFactor)*graphSize, smallFactor*graphSize);
		buffer.restore();

		buffer.moveTo(0, minSide*mainFactor); //axes
		buffer.lineTo(0, -minSide*mainFactor);
		buffer.moveTo(-minSide*mainFactor, 0);
		buffer.lineTo(minSide*mainFactor	, 0);
		buffer.stroke();
		break;
	case 'percents':	
		buffer.strokeStyle = '#DFE2EF';
		buffer.beginPath(); //BigCircle
		buffer.arc(0, 0, unitRadius, 0, Math.PI * 2);
		buffer.stroke();
		break;
	}	
},
frame = function() {
	ctx.drawImage(BufferCanvas, -halfWidth, -halfHeight);

	pointerX = unitRadius * Math.cos(-angle);
	pointerY = unitRadius * Math.sin(-angle);



	ctx.strokeStyle = '#6f789f';
	ctx.fillStyle = 'rgba(196,198,206,0.5)';
	ctx.lineWidth = lineWidth;

	ctx.beginPath(); //clockArrow
	ctx.moveTo(0, 0);
	ctx.lineTo(pointerX, pointerY);
	ctx.stroke();

	ctx.beginPath(); //Angle helper
	ctx.moveTo(0, 0);
	ctx.lineTo(unitRadius*0.15,0);
	ctx.arc(0, 0, unitRadius*0.15, 0, -angle, angle>0);
	ctx.fill();


	ctx.fillStyle = '#6f789f';
	if(selectedType === 'percents') {
		ctx.save();
		if(Math.abs(angle) < Math.PI/2) {
			ctx.rotate(-angle);
			ctx.fillText('100%', unitRadiusFactor*unitRadius, -halfSmallFactor*unitRadius);
		} else {
			ctx.rotate(Math.PI - angle);
			ctx.fillText('100%', -(1-unitRadiusFactor)*unitRadius, -halfSmallFactor*unitRadius);
		}
		ctx.restore();
	} else {
		ctx.beginPath();
		var textPosX = minSide*halfSmallFactor;
		var textPosY = minSide*halfSmallFactor * (angle < 0 ? 1.7 : -1);
		if(Math.abs(angle)>0.5 && Math.abs(angle)<1.571) {
			textPosX = minSide*smallFactor*Math.cos(angle/2) - lineWidth * 7;
			textPosY = -minSide*smallFactor*Math.sin(angle/2) - lineWidth * (angle < 0 ? -5 : -7);
		}
		ctx.fillText(Math.round(angle/toDegree) + '°', textPosX, textPosY);
	}

	if(bRad) drawRad();
	if(bSin) drawSin();
	if(bCos) drawCos();
	if(bTan) drawTan();
	if(bCtn) drawCtn();

	ctx.beginPath(); //white point
	ctx.fillStyle = 'white';
	ctx.arc(pointerX, pointerY, lineWidth*2, 0, Math.PI * 2);
	ctx.fill();
	ctx.closePath();
},
drawRad = function() {	
	if(selectedType === 'percents') return;
	ctx.strokeStyle = '#30B8B8';
	ctx.lineWidth = lineWidth*3;
	ctx.beginPath(); //Angle radian
	ctx.arc(0, 0, unitRadius, 0, -angle, angle>0);
	ctx.stroke();
	Radian.textContent = '∠ ' + angle.toFixed(3) + ' ' + translations.radians[lang];
},
drawSin = function() {
	ctx.beginPath();
	ctx.strokeStyle = '#1489ff';
	var x = unitRadius, y = unitRadius;
	switch(selectedType) {
	case 'radians':
	case 'vectors':
		ctx.lineWidth = lineWidth * 3;
		ctx.moveTo(0, pointerY);
		ctx.lineTo(0, 0);
		break;
	case 'percents':
		ctx.save();



		/*if(Math.abs(angle) < Math.PI/2) {
			ctx.rotate(Math.PI/2);
			if(angle < 0) {
				x = halfSmallFactor*unitRadius;
			} else {
				x = -mainFactor*unitRadius;
			}
			y = -Math.sign(Math.sin(angle))*unitRadius*(Math.cos(angle)+halfSmallFactor);
		} else {
			ctx.rotate(-Math.PI/2);
			if(angle < 0) {
				x = -0.5*unitRadius;
			} else {
				x = smallFactor*unitRadius;
			}
			y = Math.sign(Math.sin(angle))*unitRadius*(Math.cos(angle)-halfSmallFactor);
		}*/
		ctx.fillText(Math.round(100*Math.sin(angle)) + '%', x, y);
		ctx.restore();
	case 'default':
		ctx.lineWidth = lineWidth * 2;
		ctx.moveTo(pointerX, pointerY);
		ctx.lineTo(pointerX, 0);
	}
	ctx.stroke();
	sinValue.textContent = Math.sin(angle).toFixed(3);
},
drawCos = function() {
	ctx.beginPath();
	ctx.strokeStyle = '#ff6514';
	switch(selectedType) {
	case 'radians':
	case 'vectors':
		ctx.lineWidth = lineWidth * 3;
		ctx.moveTo(pointerX, 0);
		ctx.lineTo(0, 0);
		break;
	case 'percents':
	default:
		ctx.lineWidth = lineWidth * 2;
		ctx.moveTo(pointerX, pointerY);
		ctx.lineTo(0, pointerY);
	}
	ctx.stroke();
	cosValue.textContent = Math.cos(angle).toFixed(3);
},
drawTan = function() {
	ctx.beginPath();
	ctx.strokeStyle = '#39ce33';
	ctx.lineWidth = lineWidth*2;
	switch(selectedType) {
	case 'radians':
	case 'vectors':
		ctx.moveTo(unitRadius, 0);
		ctx.lineTo(unitRadius, -unitRadius * Math.tan(angle));
		break;
	case 'percents':
	default:
		ctx.moveTo(pointerX, pointerY);
		ctx.lineTo(unitRadius/Math.cos(angle), 0);
	}
	ctx.stroke();
	if(Math.abs(tanValue.textContent = Math.tan(angle).toFixed(3))>100) tanValue.textContent = '∞';
},
drawCtn = function() {
	ctx.beginPath();
	ctx.strokeStyle = '#ffc134';
	ctx.lineWidth = lineWidth*2;
	switch(selectedType) {
	case 'radians':
	case 'vectors':
		ctx.moveTo(0, -unitRadius);		
		ctx.lineTo(unitRadius / Math.tan(angle), -unitRadius);
		break;
	case 'percents':
	default:
		ctx.moveTo(pointerX, pointerY);
		ctx.lineTo(0, -unitRadius / Math.sin(angle));
	}
	ctx.stroke();
	if(Math.abs(ctnValue.textContent = (1/Math.tan(angle)).toFixed(3))>100) ctnValue.textContent = '∞';
},
onDown = function(event) {
	draging = true;
	anim.runing = false;
	newAngle = Math.atan2(halfHeight - event.layerY, event.layerX - halfWidth);
},
onUp = function(event) {
	draging = false;
	if(newAngle === Math.atan2(halfHeight - event.layerY, event.layerX - halfWidth)) {
		intro({from: angle, to: newAngle, friction: 0.85});
	}
},
onMove = function(event) {
	if (draging) {
		var oldAngle = angle;
		angle = Math.atan2(halfHeight - event.layerY, event.layerX - halfWidth);
		if(oldAngle>2.5 && angle<0) {
			angle +=Math.PI*2;
		} else if(oldAngle<-2.5 && angle>0) {
			angle -=Math.PI*2;
		}
		frame();
	}
},
onKey = function (event) {
	anim.runing = false;
	var key = (typeof event.which === "number")? event.which : event.keyCode;
	switch (key) {
		case 38: case 39: case 107: case 187:
			angle += toDegree;
			frame();
			break;
		case 37: case 40: case 109: case 189:
			angle -= toDegree;
			frame();
			break;
	}
},
checkFuncs = function(event) {
	bRad = document.getElementById("rad").checked;
	if(!bRad) Radian.textContent = translations.arcLength[lang]
	bSin = document.getElementById("sin").checked;
	bCos = document.getElementById("cos").checked;
	bTan = document.getElementById("tan").checked;
	bCtn = document.getElementById("ctn").checked;
	frame();
},
getScrollbarWidth = function() {
    var outer = document.createElement("div");
    outer.style.visibility = "hidden";
    outer.style.width = "100px";
    document.body.appendChild(outer);
    var widthNoScroll = outer.offsetWidth;
    outer.style.overflow = "scroll";
    var inner = document.createElement("div");
    inner.style.width = "100%";
    outer.appendChild(inner); 
    var widthWithScroll = inner.offsetWidth;
    outer.parentNode.removeChild(outer);
    return widthNoScroll - widthWithScroll;
},
Animator = function(config) {
	return {
		value: config.from,
		to: config.to,
		friction: config.friction,
		step: 0,
		epsilon: config.epsilon || 0.0001,
		runing: true,
		next: function() {
			if(Math.abs(this.value-this.to) > this.epsilon) {
				this.step += (this.to - this.value)/40;
				this.step *= this.friction;
				this.value += this.step;
			} else {
				this.runing = false;
			}
			return this.value;
		}
	}
},
intro = function(config){
	if(typeof config.from === 'number') {
		anim = Animator(config);
	}
	angle = anim.next();
	if(anim.runing) {
		frame();
		requestAnimationFrame(intro);
	}
};
scrollBarWidth = getScrollbarWidth();
initCanvas();

intro({from: 0, to: Math.PI/3, friction: 0.9});


window.addEventListener('resize', initCanvas, false);
Canvas.addEventListener("mousedown", onDown, false);
Canvas.addEventListener('touchstart', onDown, false);
Canvas.addEventListener("mouseup", onUp, false);
Canvas.addEventListener('touchend', onUp, false);
Canvas.addEventListener("mouseleave", onUp, false);
Canvas.addEventListener("mousemove", onMove);
Canvas.addEventListener("touchmove", function(e) {
	e.preventDefault();
	var moveEvt = document.createEvent('MouseEvents');
	moveEvt.initMouseEvent('mousemove', true, true, window, e.detail,
		e.changedTouches[0].screenX, e.changedTouches[0].screenY,
		e.changedTouches[0].clientX, e.changedTouches[0].clientY,
		false, false, false, false,
		0, null);
	e.target.dispatchEvent(moveEvt);
}, false);
Checks.addEventListener("click", checkFuncs);
Types.addEventListener('click', function(event){
	if(event.target.nodeName !== "INPUT") return;
	if (event.target.value === selectedType) {
		event.target.checked = true;
	} else {
		selectedType = event.target.value
		var types = document.querySelectorAll("#Types>input");
		for(var i = 0; i < types.length; i++) {
		    if(types[i].value !== selectedType) {
		        types[i].checked = false;
		    }
		}
	}
	drawBuffer();
	frame();
},false)
document.addEventListener("keydown", onKey, false);

}());