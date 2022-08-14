class Tree {
    scale = Math.random() * 1 + 1;
    angle = Math.random() * Math.PI * 2;
    constructor(pos = new Vector()) {
        assert(pos instanceof Vector, "Expected Vector object as position");
        this.pos = pos
        const r = Math.floor((0.4 * Math.random() + 0.1) * 255);
        const g = Math.floor((0.5 * Math.random() + 0.5) * 255);
        const b = Math.floor((0.1 * Math.random() + 0.1) * 255);
        this.color = `rgb(${r}, ${g}, ${b})`;
    }
    update(dt) {
    }
    render() {
        ctx.save();
        ctx.translate(this.pos.x, this.pos.y);
        ctx.rotate(this.angle + Math.PI / 2);
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(1 * this.scale, - 10 * this.scale);
        ctx.lineTo(2 * this.scale, -6 * this.scale);
        ctx.lineTo(5 * this.scale, -5 * this.scale);
        ctx.lineTo(3 * this.scale, -1 * this.scale);
        ctx.lineTo(9 * this.scale, 1 * this.scale);
        ctx.lineTo(3 * this.scale, 4 * this.scale);
        ctx.lineTo(5 * this.scale, 6 * this.scale);
        ctx.lineTo(1 * this.scale, 6 * this.scale);
        ctx.lineTo(0 * this.scale, 9 * this.scale);
        ctx.lineTo(-2 * this.scale, 3 * this.scale);
        ctx.lineTo(-3 * this.scale, 7 * this.scale);
        ctx.lineTo(-6 * this.scale, 1 * this.scale);
        ctx.lineTo(-9 * this.scale, 1 * this.scale);
        ctx.lineTo(-4 * this.scale, 1 * this.scale);
        ctx.lineTo(-4 * this.scale, -5 * this.scale);
        ctx.lineTo(-1 * this.scale, -2 * this.scale);

        ctx.fill();
        ctx.restore();
    }
}