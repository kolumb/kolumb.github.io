class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    length() { return Math.hypot(this.x, this.y); }

    normalized() { return this.scale(1 / this.length()); }
    normalizeMut() { this.scaleMut(1 / this.length()); }

    add(v) {
        assert(v instanceof Vector, "Expected Vector object");
        return new Vector(this.x + v.x, this.y + v.y);
    }
    addMut(v) {
        assert(v instanceof Vector, "Expected Vector object");
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v) {
        assert(v instanceof Vector, "Expected Vector object");
        return this.add(v.scale(-1));
    }
    subMut(v) {
        assert(v instanceof Vector, "Expected Vector object");
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    dot(v) {
        assert(v instanceof Vector, "Expected Vector object");
        return this.x * v.x + this.y * v.y;
    }

    mult(v) {
        assert(v instanceof Vector, "Expected Vector object");
        return new Vector(this.x * v.x, this.y * v.y);
    }

    dist(v) {
        assert(v instanceof Vector, "Expected Vector object");
        return Math.hypot(this.x - v.x, this.y - v.y);
    }

    distEuclidean(v) {
        assert(v instanceof Vector, "Expected Vector object");
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return dx * dx + dy * dy;
    }

    angle() {
        return Math.atan2(this.x, this.y);
    }
    angleTo(v) {
        assert(v instanceof Vector, "Expected Vector object");
        const dx = v.x - this.x;
        const dy = v.y - this.y;
        return Math.atan2(dy, dx);
    }

    scale(f) {
        isNaN(f) && assert(false, "Expected a number");
        return new Vector(this.x * f, this.y * f);
    }
    scaleMut(f) {
        isNaN(f) && assert(false, "Expected a number");
        this.x *= f;
        this.y *= f;
        return this;
    }
    copy() { return new Vector(this.x, this.y); }

    set(x, y) {
        isNaN(x) && isNaN(y) && assert(false, "Expected a number");
        this.x = x;
        this.y = y;
        return this;
    }
    clamp(max) {
        isNaN(max) && assert(false, "Expected a number");
        const length = this.length();
        if (length > max && length > 0) {
            return this.scale(max / length);
        } else {
            return this;
        }
    }
    clampMut(max) {
        isNaN(max) && assert(false, "Expected a number");
        const length = this.length();
        if (length > max && length > 0) {
            return this.scaleMut(max / length);
        } else {
            return this;
        }
    }
    round() { return new Vector(Math.round(this.x), Math.round(this.y)); }

    floor() { return new Vector(Math.floor(this.x), Math.floor(this.y)); }

    ceil() { return new Vector(Math.ceil(this.x), Math.ceil(this.y)); }

    swap() { return new Vector(this.y, this.x); }

    static random() { return Vector.fromAngle(Math.PI * 2 * Math.random())}

    static fromAngle(a) {
        isNaN(a) && assert(false, "Expected a number");
        return new Vector(Math.cos(a), Math.sin(a));
    }

    drawFrom(v) {
        assert(v instanceof Vector, "Expected Vector object");
        ctx.beginPath();
        ctx.moveTo(v.x, v.y);
        ctx.lineTo(v.x + this.x, v.y + this.y);
        ctx.stroke();
    }
}
