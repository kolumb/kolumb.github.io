class Vehicle {
    vel = new Vector();
    scale = 0.6;
    angle = -Math.PI / 2;
    color = randomColor();
    turningSpeed = 0;
    goalFollowingDirection = 1;
    goalSkipFactor = Math.random()
    goalSkipDistance = 100 + 500 * this.goalSkipFactor
    accFactor = Math.random()
    maxAcc = 3 + 20 * this.accFactor
    turningSpeedFactor = Math.random()
    turningFactor = 0.01 + 0.1 * this.turningSpeedFactor
    returnToRoadFactor = Math.random()
    distToRoadFactor = Math.random()
    closestRoadPointIndex = 0
    finished = false
    extrapolation = 60 * Math.random()
    futureFactor = Math.random()
    constructor(pos = new Vector(), goalIndex = 6) {
        assert(pos instanceof Vector, "Expected Vector object as position");
        isNaN(goalIndex) && assert(false, "Expected a number");
        this.pos = pos
        this.goalIndex = goalIndex
    }
    update(dt) {
        const distToRoad = roadPoints.reduce((min, point, i) => {
            const roadDist = this.pos.distEuclidean(point.scale(ROAD_SCALE))
            if (roadDist < min && i < this.goalIndex) {
                this.closestRoadPointIndex = i
                return roadDist
            } else {
                return min
            }
        }, Infinity)

        const dir = Vector.fromAngle(this.angle)
        const goal = roadPoints[this.goalIndex].scale(ROAD_SCALE)
        if (!this.finished) this.vel.addMut(dir.scale(ENGINE_POWER * dt * playerMoved));
        const offRoadAngle = this.pos.angleTo(roadPoints[this.closestRoadPointIndex + 2].scale(ROAD_SCALE))
        const goalAngle = this.pos.angleTo(goal)
        const futureGoalAngle = clamp(normalizeAngle(this.pos.add(this.vel.scale(this.extrapolation)).angleTo(goal) - this.angle), Math.PI / 2)
        const goalFixAngle = normalizeAngle(offRoadAngle - goalAngle)
        const velocity = this.vel.length()
        if (this.finished) {
            this.turningSpeed *= 0.99
        } else {
            this.turningSpeed += clamp(normalizeAngle(clamp(normalizeAngle(goalAngle - this.angle), Math.PI / 2) + futureGoalAngle * this.futureFactor + goalFixAngle * clamp(this.returnToRoadFactor * distToRoad / 20000, 1)) * this.turningFactor * Math.max(velocity - 1, 0) / 10
                , MAX_TURNING_SPEED * velocity / 10)
        }
        this.angle += this.turningSpeed;
        this.angle %= Math.PI * 2;
        this.turningSpeed *= (1 - TURNING_FRICTION);
        this.pos.addMut(this.vel.clamp(this.maxAcc));
        this.vel.scaleMut(1 - FRICTION);

        if (distToRoad > 100 * 100) {
            this.vel.scaleMut(OFFROAD_FRICTION)
        }
        if (this.pos.dist(goal) < this.goalSkipDistance) {
            this.goalIndex += this.goalFollowingDirection
            if (this.goalIndex >= roadPoints.length || this.goalIndex <= 0) {
                this.goalFollowingDirection *= -1
                this.goalIndex += this.goalFollowingDirection
            }
        }
        if (!this.finished && this.goalIndex > roadPoints.length - 15 && this.pos.dist(roadPoints[roadPoints.length - 4 - 8].scale(ROAD_SCALE)) < 300) {
            this.finished = true
            winners.push(this)
            this.time = (performance.now() / 1000 - car.startTime).toFixed(1)
        }
    }
    render() {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.angle + Math.PI / 2);
        ctx.fillStyle = this.color;
        if (lowGraphics) {
            ctx.fillRect(-15, -40, 30, 70)
            if (this.finished) {
                ctx.strokeStyle = "white"
                ctx.lineWidth = 5
                ctx.strokeRect(-15, -40, 30, 70);
            }
        } else {
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
            ctx.lineTo((14 - 25) * this.scale, (115 - 57 + OFFSET) * this.scale);

            ctx.lineTo((5 - 25) * this.scale, (110 - 57 + OFFSET) * this.scale);
            ctx.lineTo((1 - 25) * this.scale, (100 - 57 + OFFSET) * this.scale);
            ctx.lineTo((0 - 25) * this.scale, (82 - 57 + OFFSET) * this.scale);
            ctx.lineTo((2 - 25) * this.scale, (61 - 57 + OFFSET) * this.scale);
            ctx.fill();
            if (this.finished) {
                ctx.closePath();
                ctx.strokeStyle = "white"
                ctx.lineWidth = 5
                ctx.stroke();
            }
        }
        ctx.fillStyle = "black";
        if (lowGraphics) {
            ctx.fillRect(-10, -20, 20, 10)
            ctx.fillRect(-5, 7, 10, 7)
        } else {
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
        }
        // ctx.rotate(-this.angle - Math.PI / 2)
        // ctx.fillText(Math.round(this.extrapolation), 10, 50)
        ctx.restore();
        if (this === cameraTarget) {
            let goal = roadPoints[this.goalIndex].scale(ROAD_SCALE)
            ctx.strokeStyle = "blue"
            goal.sub(this.pos.add(this.vel.scale(this.extrapolation))).drawFrom(this.pos.add(this.vel.scale(this.extrapolation)))
            ctx.strokeStyle = "green"
            goal.sub(this.pos).drawFrom(this.pos)
            ctx.strokeStyle = "red"
            roadPoints[this.closestRoadPointIndex + 2].scale(ROAD_SCALE).sub(this.pos).drawFrom(this.pos)
            ctx.fillStyle = "black"
            ctx.fillText(participants.indexOf(this) + 1, this.pos.x + 30, this.pos.y)
            ctx.fillRect(goal.x, goal.y, 10, 10)
        }
    }
    static followLooser() {
        const notFinished = participants.filter(p => !p.finished)
        if (cameraTarget.finished) {
            cameraTarget = notFinished[notFinished.length - 1] || car
        } else {
            const notFinishedIndex = notFinished.indexOf(cameraTarget)
            if (notFinishedIndex < notFinished.length - 1) {
                cameraTarget = notFinished[notFinishedIndex + 1]
            }
        }
    }
    static followLeader() {
        const notFinished = participants.filter(p => !p.finished)
        if (cameraTarget.finished) {
            cameraTarget = notFinished[0] || car
        } else {
            const notFinishedIndex = notFinished.indexOf(cameraTarget)
            if (notFinishedIndex > 0) {
                cameraTarget = notFinished[notFinishedIndex - 1]
            }
        }
    }
}
