class Car extends Entity {
    static firedTarget = new Vector(-20, innerHeight + 20);
    static maxForce = 0.04;
    static turnSpeed = 0.018;
    static doneDist = 10;
    static breakDist = 90;
    static minSpeed = 100;
    static normalSpeed = 1500;
    constructor(v) {
        super(v);
        this.angle = 0;
        this.targetAngle = 0;
        this.vel = new Vector();
        // this.force = new Vector();
        this.acc = new Vector();
        this.hired = true;
        const avaiableCities = City.created
            .map((created, i) => (created ? i : -1))
            .filter((i) => i > -1);
        const avaiableIndex =
            avaiableCities[
                Math.floor(Math.random() ** 3 * avaiableCities.length)
            ];
        this.cityIndex = avaiableIndex;
        const city = cities[this.cityIndex];
        const targetIndexes = city.getEmptySpot();
        this.color = randomColor();
        if (targetIndexes === undefined) {
            this.hired = false;
            this.target = Car.firedTarget;
            return;
        }
        this.targetHash = targetIndexes.x + "," + targetIndexes.y;
        const targetVec = targetIndexes.scale(City.cellSize).add(city.pos);
        this.target = new Vector(targetVec.x, targetVec.y);
    }
    setTarget(v) {
        this.target.set(v.x, v.y);
    }
    update() {
        const dist = this.pos.dist(this.target);
        let speed = Car.maxForce;
        if (dist < Car.doneDist) {
            const avaiableCities = City.created
                .map((created, i) => (created ? i : -1))
                .filter((i) => i > -1);
            if (avaiableCities.length === 0) {
                this.target = new Vector(
                    width * Math.random(),
                    height * Math.random()
                );
                return;
            }
            if (this.hired === false) {
                if (this.target === Car.firedTarget) {
                    const thisIndex = cars.indexOf(this);
                    cars.splice(thisIndex, 1);
                    return;
                }
                this.target = Car.firedTarget;
                cities[this.cityIndex].clearSpot(this.targetHash);
                return;
            }
            cities[this.cityIndex].clearSpot(this.targetHash);
            cities[this.cityIndex].color = "orange";
            const avaiableIndex =
                avaiableCities[
                    Math.floor(Math.random() ** 3 * avaiableCities.length)
                ];
            this.cityIndex = avaiableIndex;
            const city = cities[this.cityIndex];
            if (!city) {
                this.target = new Vector(
                    width * Math.random(),
                    height * Math.random()
                );
                return;
            }
            const targetIndexes = city.getEmptySpot();
            if (targetIndexes === undefined) {
                this.hired = false;
                this.target = Car.firedTarget;
                return;
            }
            this.targetHash = targetIndexes.x + "," + targetIndexes.y;
            const targetVec = targetIndexes.scale(City.cellSize).add(city.pos);
            this.target.set(targetVec.x, targetVec.y);
        } else if (dist < Car.breakDist) {
            speed = (Car.maxForce * (dist + Car.minSpeed)) / Car.normalSpeed;
        }
        this.targetAngle = this.pos.angleTo(this.target);
        const da = this.targetAngle - this.angle;
        let turnDir = Math.sign(da);
        let turnAmount = Math.abs(da);
        if (turnAmount > Math.PI) {
            turnAmount = Math.PI * 2 - turnAmount;
            turnDir = -turnDir;
        }
        this.angle += clamp(turnAmount, Car.turnSpeed) * turnDir;
        if (Math.abs(this.angle) > Math.PI) {
            this.angle -= turnDir * Math.PI * 2;
        }
        this.acc = Vector.fromAngle(this.angle).scale(
            (speed * (Math.PI - turnAmount) ** 4) / Math.PI ** 4
        );
        this.vel.addMut(this.acc);
        this.pos.addMut(this.vel);
        this.vel.scaleMut(0.98);
    }
    draw() {
        ctx.fillStyle = this.hired ? this.color : "grey";
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(-this.angle);
        ctx.fillRect(
            -City.drawCellSize * 0.8,
            -City.drawCellSize / 2,
            City.drawCellSize * 1.6,
            City.drawCellSize
        );
        ctx.fill();
        ctx.restore();
        ctx.fillStyle = this.color;
        ctx.fillRect(
            this.target.x - City.drawCellSize / 2,
            this.target.y - City.drawCellSize / 2,
            City.drawCellSize,
            City.drawCellSize
        );
    }
}
