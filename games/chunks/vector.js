class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }
    length() { return Math.hypot(this.x, this.y); }

    normalized() { return this.scale(1 / this.length()); }
    normalizeMut() { this.scaleMut(1 / this.length()); }

    add(v) { return new Vector(this.x + v.x, this.y + v.y); }
    addMut(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }
    sub(v) { return this.add(v.scale(-1)); }
    subMut(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }
    dot(v) { return this.x * v.x + this.y * v.y; }

    mult(v) { return new Vector(this.x * v.x, this.y * v.y); }

    dist(v) { return Math.hypot(this.x - v.x, this.y - v.y); }

    distEuclidean(v) {
        const dx = this.x - v.x;
        const dy = this.y - v.y;
        return dx * dx + dy * dy;
    }

    angleTo(v) {
        const dx = v.x - this.x;
        const dy = v.y - this.y;
        return Math.atan2(dy, dx);
    }

    scale(f) { return new Vector(this.x * f, this.y * f); }
    divide(f) { return new Vector(this.x / f, this.y / f); }
    scaleMut(f) {
        this.x *= f;
        this.y *= f;
        return this;
    }
    copy() { return new Vector(this.x, this.y); }

    set(x, y) {
        this.x = x;
        this.y = y;
        return this;
    }
    clamp(max) {
        const length = this.length();
        if (length > max && length > 0) {
            return this.scale(max / length);
        } else {
            return this;
        }
    }
    clampMut(max) {
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

    static fromAngle(a) { return new Vector(Math.cos(a), Math.sin(a)); }

    drawFrom(v) {
        ctx.beginPath();
        ctx.moveTo(v.x, v.y);
        ctx.lineTo(v.x + this.x, v.y + this.y);
        ctx.stroke();
    }
}
