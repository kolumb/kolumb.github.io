class Car {
    vel = new Vector(0, -0.001);
    player = true
    scale = 0.6;
    angle = - Math.PI / 2;
    turningSpeed = 0;
    color = randomColor();
    trails = [];
    trailIndex = 0;
    finished = false
    goalSkipDistance = 100 + 500
    goalIndex = 6
    goalFollowingDirection = 1;
    goalSkipFactor = 1;
    turningSpeedFactor = 1;
    exaggeration = 0.2;
    accFactor = 1;
    place = 0
    mustReturn = false
    helicopter = false
    propellerAngle = 0
    closestRoadPointIndex = 0
    extrapolation = 60
    futureFactor = 1
    constructor(pos = new Vector()) {
        assert(pos instanceof Vector, "Expected Vector object as position");
        this.pos = pos
        for (let i = 0; i < 1000; i++) {
            this.trails.push({pos: new Vector(), age: 100});
        }
    }
    update(dt) {
        const dir = Vector.fromAngle(this.angle)// - Math.PI / 2);
        let goal = roadPoints[this.goalIndex].scale(ROAD_SCALE)

        if (Input.downState) {
            Input.up = Input.down = Input.left = Input.right = false
            if (Input.pointer.distEuclidean(Input.startPos) > Input.gestureDeadZone ** 2) {
                const gesture = Input.pointer.sub(Input.startPos)
                if (this.helicopter) {
                    if (gesture.x > Input.gestureDeadZone) Input.right = true
                    if (gesture.x < -Input.gestureDeadZone) Input.left = true
                    if (gesture.y > Input.gestureDeadZone) Input.down = true
                    if (gesture.y < -Input.gestureDeadZone) Input.up = true
                } else {
                    const angleDiff = normalizeAngle(normalizeAngle(Math.PI / 2 - gesture.angle()) - normalizeAngle(car.angle))
                    if (gesture.length() > Input.gestureDeadZone) {
                        if (Math.abs(angleDiff) > Math.PI / 2) {
                            Input.down = true
                        } else {
                            Input.up = true
                        }
                        if (angleDiff > Input.gestureDeadAngle && angleDiff < Math.PI - Input.gestureDeadAngle * 2) {
                            Input.right = true
                        } else if (angleDiff < -Input.gestureDeadAngle && angleDiff > -Math.PI + Input.gestureDeadAngle * 2) {
                            Input.left = true
                        }
                    }
                }
            }
        }
        let velocity
        if (this.helicopter) {
            if (Input.up) {
                if (playerMoved === 0) {
                    this.startTime = performance.now() / 1000
                    playerMoved = 1
                }
                this.vel.y -= ENGINE_POWER * dt;
            }
            if (Input.down) {
                this.vel.y += ENGINE_POWER * dt;
            }
            if (Input.left) {
                this.vel.x -= ENGINE_POWER * dt;
            }
            if (Input.right) {
                this.vel.x += ENGINE_POWER * dt;
            }
            const velAng = Math.PI * 2 - (this.vel.angle() + Math.PI * 3 / 2)
            let angleDiff = ((this.angle - velAng) + Math.PI * 2) % (Math.PI * 2)
            if (angleDiff > Math.PI) angleDiff = angleDiff - Math.PI * 2
            this.turningSpeed += Math.abs(angleDiff) > 0.2 ? clamp(-angleDiff, MAX_TURNING_SPEED / 2) : 0;
            this.turningSpeed  *= 0.95
            this.angle += this.turningSpeed;
        } else {
            if (Input.up) {
                if (playerMoved === 0) {
                    this.startTime = performance.now() / 1000
                    playerMoved = 1
                }
                this.vel.addMut(dir.scale(ENGINE_POWER * dt));
            }
            if (Input.down) {
                this.vel.subMut(dir.scale(0.5 * ENGINE_POWER * dt));
            }
            velocity = this.vel.length()
            if (Input.left) {
                this.turningSpeed -= clamp(TURNING_FORSE * Math.max(velocity - 1, 0) / 10, MAX_TURNING_SPEED * velocity / 10);
            }
            if (Input.right) {
                this.turningSpeed += clamp(TURNING_FORSE * Math.max(velocity - 1, 0) / 10, MAX_TURNING_SPEED * velocity / 10);
            }
            this.angle += this.turningSpeed;
            this.turningSpeed *= (1 - TURNING_FRICTION);
        }
        if (this.angle < 0) {
            this.angle += Math.PI * 2;
        }
        this.angle %= Math.PI * 2;
        this.pos.addMut(this.vel);

        const velAng = Math.PI * 2 - (this.vel.angle() + Math.PI * 3 / 2)
        let angleDiff = ((this.angle - velAng) + Math.PI * 2) % (Math.PI * 2)
        if (angleDiff > Math.PI) angleDiff = angleDiff - Math.PI * 2
        let movingToLeft = 0;
        if (angleDiff > 0) {
            movingToLeft = 1
        } else {
            movingToLeft = -1
        }
        const sideFriction = Vector.fromAngle(movingToLeft * Math.PI / 2 +  this.angle)
            .scale(movingToLeft * Math.sin(angleDiff) * SIDE_FRICTION)
        if (this.helicopter === false) {
            if (this.vel.length() > 0.1)
                this.vel.addMut(sideFriction)
            this.vel.scaleMut(1 - FRICTION);
            this.trails.filter(trail => trail.age < 100 && Math.random() < 0.15).forEach(trail => trail.age++);
            if ((Input.up || Input.down) && (velocity > 4 && velocity < 7 || Math.abs(this.turningSpeed)) > 0.005) {
                this.trails[this.trailIndex].pos = dir.scale(-35 * this.scale).add(this.pos).add(new Vector(-dir.y, dir.x).scale(14 * this.scale))
                this.trails[this.trailIndex].age = Math.max(Math.floor(this.vel.length() * 13), 0)
            }
            this.trailIndex++;
            if ((Input.up || Input.down) && (velocity > 4 && velocity < 7 || Math.abs(this.turningSpeed) > 0.005)) {
                this.trails[this.trailIndex].pos = dir.scale(-35 * this.scale).add(this.pos).add(new Vector(dir.y, -dir.x).scale(14 * this.scale))
                this.trails[this.trailIndex].age = Math.max(Math.floor(this.vel.length() * 13), 0)
            }
            this.trailIndex++;
            if (this.trailIndex >= this.trails.length) {
                this.trailIndex = 0;
            }
            const distToRoad = roadPoints.reduce((min, point, i) => {
                const roadDist = this.pos.distEuclidean(point.scale(ROAD_SCALE))
                if (roadDist < min && i < this.goalIndex) {
                    this.closestRoadPointIndex = i
                    return roadDist
                } else {
                    return min
                }
            }, Infinity)
            if (distToRoad > 100 * 100) {
                this.vel.scaleMut(OFFROAD_FRICTION)
            }
        }
        if (this.pos.dist(goal) < this.goalSkipDistance) {
            this.mustReturn = false
            this.goalIndex += this.goalFollowingDirection
            if (this.goalIndex >= roadPoints.length || this.goalIndex <= 0) {
                this.goalFollowingDirection *= -1
                this.goalIndex += this.goalFollowingDirection
            }
        }
        if (!this.finished && this.goalIndex > roadPoints.length - 15 && this.pos.dist(roadPoints[roadPoints.length - 4 - 8].scale(ROAD_SCALE)) < 300 && this.pos.dist(goal) < this.goalSkipDistance * 2) {
            this.finished = true
            winners.push(this)
            this.place = winners.length
            this.time = (performance.now() / 1000 - this.startTime).toFixed(1)
        }
    }
    render() {
        // let goal = roadPoints[this.goalIndex].scale(ROAD_SCALE)
        // goal.sub(this.pos).drawFrom(this.pos)
        // roadPoints[this.closestRoadPointIndex].scale(ROAD_SCALE).sub(this.pos).drawFrom(this.pos)
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.angle + Math.PI / 2);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo((1 - 25) * this.scale, (19 - 57 + OFFSET) * this.scale);
        ctx.lineTo((5 - 25) * this.scale, (6 - 57 + OFFSET) * this.scale);

        ctx.lineTo((14 - 25) * this.scale, (1 - 57 + OFFSET) * this.scale);
        ctx.lineTo((35 - 25) * this.scale, (1 - 57 + OFFSET) * this.scale);

        ctx.lineTo((44 - 25) * this.scale, (6 - 57 + OFFSET) * this.scale);
        ctx.lineTo((49 - 25) * this.scale, (19 - 57 + OFFSET) * this.scale);
        ctx.lineTo((47 - 25) * this.scale, (61 - 57 + OFFSET) * this.scale);
        ctx.lineTo((49 - 25) * this.scale, (82 - 57 + OFFSET) * this.scale);
        ctx.lineTo((48 - 25) * this.scale, (100 - 57 + OFFSET) * this.scale);
        ctx.lineTo((43 - 25) * this.scale, (110 - 57 + OFFSET) * this.scale);

        ctx.lineTo((35 - 25) * this.scale, (115 - 57 + OFFSET) * this.scale);
        if (this.helicopter) {
            ctx.lineTo((30 - 25) * this.scale, (115 + 120- 57 + OFFSET) * this.scale);

            ctx.lineTo((19 - 25) * this.scale, (115 + 120- 57 + OFFSET) * this.scale);
        }
        ctx.lineTo((14 - 25) * this.scale, (115 - 57 + OFFSET) * this.scale);

        ctx.lineTo((5 - 25) * this.scale, (110 - 57 + OFFSET) * this.scale);
        ctx.lineTo((1 - 25) * this.scale, (100 - 57 + OFFSET) * this.scale);
        ctx.lineTo((0 - 25) * this.scale, (82 - 57 + OFFSET) * this.scale);
        ctx.lineTo((2 - 25) * this.scale, (61 - 57 + OFFSET) * this.scale);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = "yellow"
        if (this.finished) {
            ctx.lineWidth = 5
        } else {
            ctx.lineWidth = 1
        }
        ctx.stroke();
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.moveTo((5 - 25) * this.scale, (33 - 57 + OFFSET) * this.scale);
        ctx.lineTo((18 - 25) * this.scale, (28 - 57 + OFFSET) * this.scale);
        ctx.lineTo((33 - 25) * this.scale, (28 - 57 + OFFSET) * this.scale);
        ctx.lineTo((44 - 25) * this.scale, (33 - 57 + OFFSET) * this.scale);
        ctx.lineTo((38 - 25) * this.scale, (45 - 57 + OFFSET) * this.scale);
        ctx.lineTo((30 - 25) * this.scale, (42 - 57 + OFFSET) * this.scale);
        ctx.lineTo((22 - 25) * this.scale, (42 - 57 + OFFSET) * this.scale);
        ctx.lineTo((12 - 25) * this.scale, (45 - 57 + OFFSET) * this.scale);
        ctx.moveTo((5 - 25) * this.scale, (39 - 57 + OFFSET) * this.scale);
        ctx.lineTo((10 - 25) * this.scale, (48 - 57 + OFFSET) * this.scale);
        ctx.lineTo((10 - 25) * this.scale, (69 - 57 + OFFSET) * this.scale);
        ctx.lineTo((5 - 25) * this.scale, (66 - 57 + OFFSET) * this.scale);
        ctx.lineTo((6 - 25) * this.scale, (42 - 57 + OFFSET) * this.scale);
        ctx.lineTo((1 - 25) * this.scale, (44 - 57 + OFFSET) * this.scale);
        ctx.lineTo((-1 - 25) * this.scale, (42 - 57 + OFFSET) * this.scale);
        ctx.moveTo((44 - 25) * this.scale, (39 - 57 + OFFSET) * this.scale);
        ctx.lineTo((40 - 25) * this.scale, (48 - 57 + OFFSET) * this.scale);
        ctx.lineTo((40 - 25) * this.scale, (69 - 57 + OFFSET) * this.scale);
        ctx.lineTo((45 - 25) * this.scale, (66 - 57 + OFFSET) * this.scale);
        ctx.lineTo((44 - 25) * this.scale, (42 - 57 + OFFSET) * this.scale);
        ctx.lineTo((49 - 25) * this.scale, (44 - 57 + OFFSET) * this.scale);
        ctx.lineTo((51 - 25) * this.scale, (42 - 57 + OFFSET) * this.scale);
        ctx.moveTo((5 - 25) * this.scale, (71 - 57 + OFFSET) * this.scale);
        ctx.lineTo((10 - 25) * this.scale, (73 - 57 + OFFSET) * this.scale);
        ctx.lineTo((10 - 25) * this.scale, (78 - 57 + OFFSET) * this.scale);
        ctx.lineTo((5 - 25) * this.scale, (90 - 57 + OFFSET) * this.scale);
        ctx.moveTo((45 - 25) * this.scale, (71 - 57 + OFFSET) * this.scale);
        ctx.lineTo((40 - 25) * this.scale, (73 - 57 + OFFSET) * this.scale);
        ctx.lineTo((40 - 25) * this.scale, (78 - 57 + OFFSET) * this.scale);
        ctx.lineTo((45 - 25) * this.scale, (90 - 57 + OFFSET) * this.scale);
        ctx.moveTo((14 - 25) * this.scale, (77 - 57 + OFFSET) * this.scale);
        ctx.lineTo((35 - 25) * this.scale, (77 - 57 + OFFSET) * this.scale);
        ctx.lineTo((37 - 25) * this.scale, (83 - 57 + OFFSET) * this.scale);
        ctx.lineTo((35 - 25) * this.scale, (90 - 57 + OFFSET) * this.scale);
        ctx.lineTo((27 - 25) * this.scale, (95 - 57 + OFFSET) * this.scale);
        ctx.lineTo((21 - 25) * this.scale, (95 - 57 + OFFSET) * this.scale);
        ctx.lineTo((14 - 25) * this.scale, (90 - 57 + OFFSET) * this.scale);
        ctx.lineTo((12 - 25) * this.scale, (83 - 57 + OFFSET) * this.scale);
        ctx.fill();
        if (this.helicopter) {
            ctx.fillStyle = "black"
            ctx.fillRect(4, 100 - Math.sin(this.propellerAngle * 10 * (this.turningSpeed + 0.05)) * 15, 3, Math.sin(this.propellerAngle * 10 * (this.turningSpeed + 0.05)) * 30)
            ctx.rotate(this.propellerAngle)
            ctx.fillRect(-80, -4, 160, 8)
            ctx.rotate(-this.propellerAngle)
            this.propellerAngle += Input.up || Input.down ? 0.4 : 0.2
        }

        let goal = roadPoints[this.goalIndex].scale(ROAD_SCALE)
        if ((this.pos.dist(goal) > this.goalSkipDistance * 2 || this.mustReturn) && this.finished === false) {
            this.mustReturn = true
            const goalAngle = this.pos.angleTo(goal)
            ctx.rotate(goalAngle - this.angle + Math.PI);
            ctx.fillStyle = this.helicopter ? "grey" : "red"
            ctx.beginPath()
            ctx.moveTo(0, lesser * 0.4)
            ctx.lineTo(20, lesser * 0.4 - 20)
            ctx.lineTo(10, lesser * 0.4 - 20)
            ctx.lineTo(10, lesser * 0.4 - 40)
            ctx.lineTo(-10, lesser * 0.4 - 40)
            ctx.lineTo(-10, lesser * 0.4 - 20)
            ctx.lineTo(-20, lesser * 0.4 - 20)
            ctx.fill()
        }
        ctx.restore();
    }
    toggleHelicopter() {
        car.helicopter = !car.helicopter
        if (!car.helicopter) {

            const distToRoad = roadPoints.reduce((min, point, i) => {
                const roadDist = car.pos.distEuclidean(point.scale(ROAD_SCALE))
                if (roadDist < min) {
                    car.closestRoadPointIndex = i
                    return roadDist
                } else {
                    return min
                }
            }, Infinity)
            if (car.goalIndex < car.closestRoadPointIndex) {
                car.goalIndex = car.closestRoadPointIndex
            }
        }
    }
}
