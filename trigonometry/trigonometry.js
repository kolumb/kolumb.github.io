var canvasUnitCircle = document.getElementById("unit-circle");
var ctx = canvasUnitCircle.getContext("2d");


var screenWidth = 400, screenHeight = 300,
    unitRadius = 100;

canvasUnitCircle.width = screenWidth;
canvasUnitCircle.height = screenHeight;



ctx.beginPath();
ctx.arc(screenWidth/2, screenHeight/2, unitRadius, 0, Math.PI*2);
ctx.strokeStyle(rgb();
ctx.moveTo(10, 10);
ctx.lineTo(30, 30);
ctx.stroke();
