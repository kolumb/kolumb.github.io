const FRICTION = 0.01;
const SIDE_FRICTION = 0.1;
const ENGINE_POWER = 0.15;
const TURNING_FORSE = 0.04;
const TURNING_FRICTION = 0.1;
const OFFSET = -15;
const MAX_TURNING_SPEED = 0.008;
class Car {
    vel = new Vector();
    scale = 0.6;
    angle = - Math.PI / 2;
    turningSpeed = 0;
    color = randomColor();
    trails = [];
    trailIndex = 0;
    constructor(pos = new Vector()) {
        assert(pos instanceof Vector, "Expected Vector object as position");
        this.pos = pos
        for (let i = 0; i < 1000; i++) {
            this.trails.push({pos: new Vector(), age: 100});
        }
    }
    update(dt) {
        const dir = Vector.fromAngle(this.angle)// - Math.PI / 2);
        if (Input.up) {
            this.vel.addMut(dir.scale(ENGINE_POWER * dt));
        }
        if (Input.down) {
            this.vel.subMut(dir.scale(ENGINE_POWER * dt));
        }
        const velocity = this.vel.length()
        if (Input.left) {
            this.turningSpeed -= clamp(TURNING_FORSE * Math.max(velocity - 1, 0) / 10, MAX_TURNING_SPEED * velocity / 10);
        }
        if (Input.right) {
            this.turningSpeed += clamp(TURNING_FORSE * Math.max(velocity - 1, 0) / 10, MAX_TURNING_SPEED * velocity / 10);
        }
        this.angle += this.turningSpeed;
        if (this.angle < 0) {
            this.angle += Math.PI * 2;
        }
        this.angle %= Math.PI * 2;
        this.turningSpeed *= (1 - TURNING_FRICTION);
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
        if (this.vel.length() > 0.1)
            this.vel.addMut(sideFriction)

        this.vel.scaleMut(1 - FRICTION);
        this.trails.filter(trail => trail.age < 100 && Math.random() < 0.15).forEach(trail => trail.age++);
        if (velocity > 4 && velocity < 7 || (Input.up || Input.down) && Math.abs(this.turningSpeed) > 0.005) {
            this.trails[this.trailIndex].pos = dir.scale(-35 * this.scale).add(this.pos).add(new Vector(-dir.y, dir.x).scale(14 * this.scale))
            this.trails[this.trailIndex].age = Math.max(Math.floor(this.vel.length() * 13), 0)
        }
        this.trailIndex++;
        if (velocity > 4 && velocity < 7 || (Input.up || Input.down) && Math.abs(this.turningSpeed) > 0.005) {
            this.trails[this.trailIndex].pos = dir.scale(-35 * this.scale).add(this.pos).add(new Vector(dir.y, -dir.x).scale(14 * this.scale))
            this.trails[this.trailIndex].age = Math.max(Math.floor(this.vel.length() * 13), 0)
        }
        this.trailIndex++;
        if (this.trailIndex >= this.trails.length) {
            this.trailIndex = 0;
        }
    }
    render() {
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
        ctx.lineTo((14 - 25) * this.scale, (115 - 57 + OFFSET) * this.scale);

        ctx.lineTo((5 - 25) * this.scale, (110 - 57 + OFFSET) * this.scale);
        ctx.lineTo((1 - 25) * this.scale, (100 - 57 + OFFSET) * this.scale);
        ctx.lineTo((0 - 25) * this.scale, (82 - 57 + OFFSET) * this.scale);
        ctx.lineTo((2 - 25) * this.scale, (61 - 57 + OFFSET) * this.scale);
        // ctx.lineTo((1 - 25) * this.scale, (19 - 57 + OFFSET) * this.scale);
        ctx.fill();
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
        ctx.restore();
        this.vel.scale(10).drawFrom(this.pos)
        Vector.fromAngle(this.angle).scale(100).drawFrom(this.pos)
        ctx.strokeStyle = "red"
        const velAng = Math.PI * 2 - (this.vel.angle() + Math.PI * 3 / 2)
        let angleDiff = ((this.angle - velAng) + Math.PI * 2) % (Math.PI * 2)
        if (angleDiff > Math.PI) angleDiff = angleDiff - Math.PI * 2
        let leftSideFriction = 0;
        if (angleDiff > 0) {
            leftSideFriction = 1
        } else {
            leftSideFriction = -1
        }
        if (this.vel.length() > 0.1)
            Vector.fromAngle(leftSideFriction * Math.PI / 2 +  this.angle).scale(leftSideFriction * Math.sin(angleDiff) * 100).drawFrom(this.pos)
    }
}