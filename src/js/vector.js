
export class Vec2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    set(x, y) {
        this.x = x;
        this.y = y;
    }

    lengthSquared() {
        // console.log(this.x)
        return (Math.pow(this.x, 2) + Math.pow(this.y, 2));
    }

    /**
     * @returns {Vec2}
     */
    length() {
        return Math.hypot(this.x, this.y);
    }

    /**
     * Unit vector in the same direction
     * @param {Number} length
     * @returns {Vec2}
     */
    unit(length = 1) {
        const vecLength = this.length();
        if (vecLength === 0) {
            // no length, return vector with angle 0
            return new Vec2(1 * length, 0);
        }
        return this.multiply(length / vecLength);
    }

    /**
     * vector division
     * @returns {Vec2}
     */
    divide(d) {
        return new Vec2(this.x / d, this.y / d);
    }

    // vector multiplication
    multiply(m) {
        return new Vec2(this.x * m, this.y * m);
    }

    add(b) {
        return new Vec2(this.x + b.x, this.y + b.y);
    }

    /**
     * Add another vector in place.
     * @param {Vec2} b Another vector
     */
    addInPlace(b) {
        this.x += b.x;
        this.y += b.y;
    }

    // this - vector b
    sub(b) {
        return new Vec2(this.x - b.x, this.y - b.y);
    }

    dot(b) {
        return this.x * b.x + this.y * b.y;
    }

    angle() {
        return Math.atan2(this.y, this.x);
    }

    print() {
        console.log(`${this.x}, ${this.y}`);
    }

    containsNaN() {
        return Number.isNaN(this.x) || Number.isNaN(this.y);
    }
}

export const Vector = {
    add(a, b) {
        return new Vec2(a.x + b.x, a.y + b.y);
    },

    sub(a, b) {
        return new Vec2(a.x - b.x, a.y - b.y);
    },

    dot(a, b) {
        return a.x * b.x + a.y * b.y;
    },
    toVector(obj) {
        if (obj instanceof Vec2) {
            return obj;
        }
        return new Vec2(obj[0], obj[1]);
    },
    /**
     * Generate a unit vector
     * @param {Number} angle In radians
     * @param {Number} length Length of vector
     */
    unit(angle, length = 1) {
        return new Vec2(length * Math.cos(angle), length * Math.sin(angle));
    },

    /**
     * Area of parallelogram spanned by a and b.
     * Equal to z-component of cross product in 3d.
     * @param {Vector2} a First vector
     * @param {Vector2} b Second vector
     */
    perp(a, b) {
        // TODO
        return a.x * b.y - a.y * b.x;
    },
};
