"use strict";
let frameCounter = 0;
let frame = timeStamp => {
  frameTimes[frameTimesIndex] = timeStamp - lastTimeStamp;
  frameTimesIndex++;
  if (frameTimesIndex > frameTimes.length - 1) frameTimesIndex = 0;
  lastTimeStamp = timeStamp;

  frameCounter++;
  if (frameCounter % 60 === 0) {
    if (ships.length < NUMBER_OF_SHIPS) {
      ships.push(
        new Ship({
          pos: planets[(NUMBER_OF_PLANETS * Math.random()) | 0].pos.add(
            new Vector(Math.random() * 80 - 40, Math.random() * 80 - 40)
          ),
          speed: new Vector(
            Math.random() * 0.2 - 0.1,
            Math.random() * 0.2 - 0.1
          ),
          dest: 0
        })
      );
    }
  }
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);
  // ctx.clearRect(0, 0, width, height);

  ctx.beginPath();
  for (let i = 0; i < cellNumberX; i++) {
    ctx.moveTo(cellSize * i, 0);
    ctx.lineTo(cellSize * i, height);
  }
  for (let i = 0; i < cellNumberX; i++) {
    ctx.moveTo(0, cellSize * i);
    ctx.lineTo(width, cellSize * i);
  }
  ctx.stroke();

  planets.map(pl => pl.draw());

  ship.preUpdate();
  ship.update();
  ship.postUpdate();
  ships.map(sh => sh.update());
  ships.map(sh => sh.draw());
  ship.draw();

  // ctx.fillText('angle ' + ship.angle, 10, 10)

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, 30, 30);
  ctx.fillRect(0, height - 30, 105, 30);
  ctx.fillStyle = "black";
  ctx.fillText(
    (1000 / (frameTimes.reduce((acc, dt) => acc + dt, 0) / frameTimes.length)) |
      0,
    10,
    18
  );
  ctx.fillText("Добавить планету", 10, height - 12);
  requestAnimationFrame(frame);
};
// setInterval(frame, 1000)
requestAnimationFrame(frame);
