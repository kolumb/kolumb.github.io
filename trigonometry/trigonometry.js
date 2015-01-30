(function () {
	'use strict';
	/*
		5 regimes: 
			2: procents;
			3: desctiptive;
			4: progection;
			5: coordinates;
	*/
	var canvasUnitCircle = document.getElementById("unit-circle"),
		ctx = canvasUnitCircle.getContext("2d"),
		checks = document.getElementById("checks"),
		screenWidth = 600,
		screenHeight = 600,
		unitRadius = 100,
		angle = Math.PI/3,
		draging = false,
		pointerX = 0,
		pointerY = 0,
		toDegree = Math.PI/180,
		bSin = true,
		bCos = false,
		bTan = false,
		bCtn = false,
		drawSin = function () {
			ctx.beginPath();
			ctx.strokeStyle = '#1489ff';
			ctx.lineWidth = 3;
			ctx.moveTo(pointerX, pointerY);
			ctx.lineTo(pointerX, 0);
			ctx.closePath();
			ctx.stroke();
		},
		drawCos = function () {
			ctx.beginPath();
			ctx.strokeStyle = '#ff6514';
			ctx.lineWidth = 3;
			ctx.moveTo(pointerX, pointerY);
			ctx.lineTo(0, pointerY);
			ctx.closePath();
			ctx.stroke();
		},
		drawTan = function () {
			ctx.beginPath();
			ctx.strokeStyle = '#39ce33';
			ctx.lineWidth = 3;
			ctx.moveTo(pointerX, pointerY);
			ctx.lineTo(unitRadius * Math.tan(angle)/Math.sin(angle), 0);
			ctx.closePath();
			ctx.stroke();
		},
		drawCtn = function () {
			ctx.beginPath();
			ctx.strokeStyle = '#ffc134';
			ctx.lineWidth = 3;
			ctx.moveTo(pointerX, pointerY);
			ctx.lineTo(0, -unitRadius / Math.tan(angle)/Math.cos(angle));
			ctx.closePath();
			ctx.stroke();
			
		},
		drawCircle = function () {
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#6f789f';
			ctx.fillStyle = 'white';
			ctx.beginPath();
			ctx.arc(0, 0, unitRadius, 0, Math.PI * 2);
			ctx.moveTo(0, screenHeight * 0.4);
			ctx.lineTo(0, -screenHeight * 0.4);
			ctx.moveTo(-screenWidth * 0.4, 0);
			ctx.lineTo(screenWidth * 0.4, 0);

			ctx.moveTo(0, 0);
			ctx.lineTo(pointerX, pointerY);
			ctx.moveTo(unitRadius*.2,0);
			
			ctx.arc(0, 0, unitRadius*.2, 0, -angle, true);
			ctx.stroke();
			ctx.beginPath();
			ctx.arc(pointerX, pointerY, 2, 0, Math.PI * 2);
			ctx.fill();
		},
		redraw = function () {
			ctx.clearRect(-screenWidth / 2, -screenHeight / 2, screenWidth, screenHeight);
			pointerX = unitRadius * Math.cos(-angle);
			pointerY = unitRadius * Math.sin(-angle);
			if(bSin) drawSin();
			if(bCos) drawCos();
			if(bTan) drawTan();
			if(bCtn) drawCtn();
			drawCircle();
			
			ctx.fillText('angle = ' + angle.toFixed(3), -screenWidth*.4, 10);
			ctx.fillText('s c t c = ' + bSin + ' ' + bCos + ' ' + bTan + ' ' + bCtn, -screenWidth*.4, 22);
			ctx.fillText('degrees = ' + Math.round(angle/toDegree), -screenWidth*.4, 34);
		},
		onDown = function (event) {
			draging = event.layerY < screenHeight * 0.8 ? true : false;
		},
		onUp = function (event) {
			draging = false;
		},
		move = function (event) {
			if (draging) {
				angle = Math.atan2(event.layerX - screenWidth / 2, event.layerY - screenHeight / 2)-Math.PI / 2;
				redraw();
			}
		},
		checkFuncs = function (event) {
			bSin = document.getElementById("sin").checked;
			bCos = document.getElementById("cos").checked;
			bTan = document.getElementById("tan").checked;
			bCtn = document.getElementById("ctn").checked;
			redraw();
		};

	canvasUnitCircle.width = screenWidth;
	canvasUnitCircle.height = screenHeight;
	ctx.translate(screenWidth / 2 + 0.5, screenHeight / 2 + 0.5);
	redraw();
	canvasUnitCircle.addEventListener("mousedown", onDown);
	canvasUnitCircle.addEventListener("mouseup", onUp);
	canvasUnitCircle.addEventListener("mouseleave", onUp);
	canvasUnitCircle.addEventListener("mousemove", move);
	checks.addEventListener("click", checkFuncs);
}());