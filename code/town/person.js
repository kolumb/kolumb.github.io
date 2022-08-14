let turn;
let da;
let turnDir;
let turnAmount;
class Person extends Entity {
    constructor(v) {
        super(v);
        this.angle = 0;
        this.targetAngle = 0;
        this.vel = new Vector();
        // this.force = new Vector();
        this.acc = new Vector();
        this.target = new Vector(Math.random() * width, Math.random() * height); //lastMousePos; // ;
        this.maxForce = 0.04;
        this.turnSpeed = 0.018;
        this.color = randomColor();
    }
    setTarget(v) {
        this.target.set(v.x, v.y);
    }
    update() {
        const dist = this.pos.dist(this.target);
        let speed = this.maxForce;
        if (dist < 10) {
            this.target.set(Math.random() * width, Math.random() * height);
        } else if (dist < 90) {
            speed = (this.maxForce * (dist + 100)) / 1500;
        }
        // let force = this.target.sub(this.pos).clamp(this.maxForce);
        this.targetAngle = this.pos.angleTo(this.target);
        da = this.targetAngle - this.angle;
        turnDir = Math.sign(da);
        turnAmount = Math.abs(da);
        if (turnAmount > Math.PI) {
            turnAmount = Math.PI * 2 - turnAmount;
            turnDir = -turnDir;
        }
        // if (da > Math.PI) {
        //     da = da - Math.PI * 2;
        // } else if (da < -Math.PI) {
        //     da = da + Math.PI * 2;
        // }
        turn = clamp(turnAmount, this.turnSpeed);
        this.angle += turn * turnDir;
        if (Math.abs(this.angle) > Math.PI) {
            this.angle -= turnDir * Math.PI * 2;
        }
        //if (turnAmount < Math.PI / 2) {
        this.acc = Vector.fromAngle(this.angle).scale(
            (speed * (Math.PI - turnAmount) ** 4) / Math.PI ** 4
        );
        /*} else {
            this.acc.set(0, 0);
        }*/
        // this.acc = Vector.fromAngle(this.angle).scale(
        //     clamp((Math.PI - this.targetAngle) / Math.PI, 0.003)
        // );
        this.vel.addMut(this.acc);
        this.pos.addMut(this.vel);
        this.vel.scaleMut(0.98);
    }
    draw() {
        // this.acc.scale(5000).drawFrom(this.pos);
        // this.target.drawFrom(this.target);
        ctx.fillStyle = this.color;
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(-this.angle);
        ctx.fillRect(-8, -5, 16, 10);
        /* ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, 10, 0, Math.PI * 2);
        ctx.arc(this.target.x, this.target.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "black";*/
        ctx.fill();
        //ctx.stroke();
        /*ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        let facingTo = Vector.fromAngle(this.angle)
            .scale(8)
            .add(this.pos);
        ctx.lineTo(facingTo.x, facingTo.y);
        ctx.strokeStyle = "red";
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        facingTo = Vector.fromAngle(this.targetAngle)
            .scale(10)
            .add(this.pos);
        ctx.lineTo(facingTo.x, facingTo.y);
        ctx.strokeStyle = "orange";
        ctx.stroke();*/

        ctx.restore();
        ctx.fillRect(this.target.x - 4, this.target.y - 4, 8, 8);
    }
}
