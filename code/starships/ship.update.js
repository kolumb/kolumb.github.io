"use strict";

Ship.prototype.update = function() {
  const oldIndex =
    ((this.pos.y / cellSize) | 0) * cellNumberX + ((this.pos.x / cellSize) | 0);

  //else this.acc = Vector.fromAngle(this.angle, 0)
  this.pos = this.pos.add(this.speed);
  this.speed = this.speed.scale(DRAG);
  if (this.pos.x > width) {
    this.pos.x = width;
    this.speed.x = -MAXSPEED / 5;
  }
  if (this.pos.x < 0) {
    this.pos.x = 0;
    this.speed.x = MAXSPEED / 5;
  }
  if (this.pos.y > height) {
    this.pos.y = height;
    this.speed.y = -MAXSPEED / 5;
  }
  if (this.pos.y < 0) {
    this.pos.y = 0;
    this.speed.y = MAXSPEED / 5;
  }

  const x = (this.pos.x / cellSize) | 0;
  const y = (this.pos.y / cellSize) | 0;
  const newIndex = y * cellNumberX + x;
  if (newIndex !== oldIndex) {
    let indexToRemove = reg[oldIndex].findIndex(
      shipToMove => shipToMove === this
    );
    reg[oldIndex][indexToRemove] = reg[oldIndex][reg[oldIndex].length - 1];
    reg[oldIndex].pop();
    cells[oldIndex]--;

    reg[newIndex].push(this);
    cells[newIndex]++;
  }
  this.index = newIndex;

  if (!this.postUpdate) {
    let dist = planets[this.dest].pos.sub(this.pos);
    this.speed = this.speed.add(dist.scale(0.3).clamp(MAXSPEED / 20));
    if (dist.squaredLength() < this.destDist) {
      this.dest++;
      if (this.dest === planets.length) this.dest = 0;
      this.destDist = planets[this.dest].radius ** 2 + ATMOSPHERE;
    }
  }
  let attraction = new Vector(0, 0);
  let count = 0;
  for (let n = -1; n < 2; n++) {
    for (let m = -1; m < 2; m++) {
      let xx = x + n;
      let yy = y + m;
      if (xx < 0 || xx > cellNumberX - 1 || yy < 0 || yy > cellNumberY - 1) {
        continue;
      }
      let index = yy * cellNumberX + xx;
      let homeCell = reg[index];
      for (let i = 0; i < homeCell.length; i++) {
        const neighPos = homeCell[i].pos;
        attraction = attraction.add(this.pos.sub(neighPos));
        //angle += (neighbour.angle%(Math.PI*2))
        //count++
        let dist = this.pos.squareDist(neighPos);
        if (dist < INTERACTION_DISTANCE) {
          let dx = this.pos.x - neighPos.x;
          let dy = this.pos.y - neighPos.y;
          let angle = Math.atan2(dy, dx);
          this.speed = this.speed.add(
            Vector.fromAngle(angle + 0.5, dist) // IDEA: right side movement
              .scale(REPULSION_IMPULSE)
              .clamp(REPULSION_LIMIT)
          );
          /*this.speed.add(
            this.pos
              .sub(neighPos)
              .scale(REPULSION_IMPULSE)
              .clamp(REPULSION_LIMIT)
          );*/
          //this.pos = this.pos.add(this.pos.sub(neighPos).scale(0.5));
        }
      }
    }
  }
  for (let i = 0; i < planets.length; i++) {
    const neighPos = planets[i].pos;
    // attraction = attraction.add(this.pos.sub(neighPos));
    //angle += (neighbour.angle%(Math.PI*2))
    //count++
    let dist = this.pos.squareDist(neighPos);
    if (dist < planets[i].radius ** 2 + 2500) {
      let dx = this.pos.x - neighPos.x;
      let dy = this.pos.y - neighPos.y;
      let angle = Math.atan2(dy, dx);
      this.speed = this.speed.add(
        Vector.fromAngle(angle + 1, dist ** 3)
          .scale(REPULSION_IMPULSE)
          .clamp(REPULSION_LIMIT)
      );
      /*this.speed.add(
        this.pos
          .sub(neighPos)
          .scale(REPULSION_IMPULSE)
          .clamp(REPULSION_LIMIT)
      );*/
      //this.pos = this.pos.add(this.pos.sub(neighPos).scale(0.5));
    }
  }
  this.speed = this.speed.sub(attraction.clamp(ATTRACTION_FORCE));
  if (this.postUpdate) return;

  const targetAngle = Math.atan2(this.speed.y, this.speed.x);
  // https://gist.github.com/shaunlebron/8832585
  const da = (targetAngle - this.angle) % TWO_PI;
  this.angle += clamp(((2 * da) % TWO_PI) - da, 1) * ANGLESPEED;
};
