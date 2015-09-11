(function () {
	'use strict';
	/*
		5 regimes: 
			2: procents;
			3: desctiptive;
			4: progection;
			5: coordinates;
	*/
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
draging = false,
pointerX = 0,
pointerY = 0,
toDegree = Math.PI/180,
bSin = true,
bCos = false,
bTan = false,
bCtn = false,
initCanvas = function() {
	Canvas.width = BufferCanvas.width = Width = window.innerWidth-scrollBarWidth;
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
	buffer.strokeStyle = '#6f789f';
	buffer.lineCap = 'round';
	buffer.fillStyle = '#6f789f';

	buffer.beginPath(); //BigCircle
	buffer.arc(0, 0, unitRadius, 0, Math.PI * 2);

	buffer.save(); //Top arrow
	buffer.translate(0,-minSide*mainFactor);
	buffer.moveTo(-microFactor*graphSize, graphSize*smallFactor);
	buffer.quadraticCurveTo(0,graphSize*halfSmallFactor, 0,0);
	buffer.quadraticCurveTo(0,halfSmallFactor*graphSize, microFactor*graphSize,graphSize*smallFactor);
	buffer.fillText('sin α', graphSize*halfSmallFactor, graphSize*(smallFactor + microFactor));
	buffer.restore();

	buffer.save(); //Right arrow
	buffer.translate(minSide*mainFactor,0);
	buffer.moveTo(-graphSize*smallFactor, -microFactor*graphSize);
	buffer.quadraticCurveTo(-graphSize * halfSmallFactor,0, 0,0);
	buffer.quadraticCurveTo(-graphSize * halfSmallFactor,0, -graphSize*smallFactor,microFactor*graphSize);
	buffer.fillText('cos α', -graphSize*(smallFactor + microFactor), graphSize*smallFactor);
	buffer.restore();

	buffer.moveTo(0, minSide*mainFactor); //axes
	buffer.lineTo(0, -minSide*mainFactor);
	buffer.moveTo(-minSide*mainFactor, 0);
	buffer.lineTo(minSide*mainFactor	, 0);
	buffer.stroke();
},
frame = function() {
	ctx.drawImage(BufferCanvas, -halfWidth, -halfHeight);

	pointerX = unitRadius * Math.cos(-angle);
	pointerY = unitRadius * Math.sin(-angle);
	if(bSin) drawSin();
	if(bCos) drawCos();
	if(bTan) drawTan();
	if(bCtn) drawCtn();

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

	ctx.beginPath(); //white point
	ctx.fillStyle = 'white';
	ctx.arc(pointerX, pointerY, lineWidth*2, 0, Math.PI * 2);
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.fillStyle = '#6f789f';
	ctx.fillText('∠ ' + angle.toFixed(3) + ' радиан', -minSide*mainFactor, -unitRadius);
	ctx.fillText(Math.round(angle/toDegree) + '°', minSide*halfSmallFactor, -minSide*halfSmallFactor);
},
drawSin = function() {
	ctx.beginPath();
	ctx.strokeStyle = '#1489ff';
	ctx.lineWidth = lineWidth*2;
	ctx.moveTo(pointerX, pointerY);
	ctx.lineTo(pointerX, 0);
	ctx.stroke();
},
drawCos = function() {
	ctx.beginPath();
	ctx.strokeStyle = '#ff6514';
	ctx.lineWidth = lineWidth*2;
	ctx.moveTo(pointerX, pointerY);
	ctx.lineTo(0, pointerY);
	ctx.stroke();
},
drawTan = function() {
	ctx.beginPath();
	ctx.strokeStyle = '#39ce33';
	ctx.lineWidth = lineWidth*2;
	ctx.moveTo(pointerX, pointerY);
	ctx.lineTo(unitRadius * Math.tan(angle)/Math.sin(angle), 0);
	ctx.stroke();
},
drawCtn = function() {
	ctx.beginPath();
	ctx.strokeStyle = '#ffc134';
	ctx.lineWidth = lineWidth*2;
	ctx.moveTo(pointerX, pointerY);
	ctx.lineTo(0, -unitRadius / Math.tan(angle)/Math.cos(angle));
	ctx.stroke();
	
},
onDown = function(event) {
	draging = true;
},
onUp = function(event) {
	draging = false;
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
	var key = (typeof event.which === "number")? event.which : event.keyCode;
		console.log("key = " + (key));
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
};
scrollBarWidth = getScrollbarWidth();
initCanvas();
frame();




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
document.addEventListener("keydown", onKey, false);

}());