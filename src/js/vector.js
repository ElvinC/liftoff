import { ENGINE_METHOD_NONE } from "constants";

export class Vector2D {
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
     * @returns {Vector2D}
     */
    length() {
        return Math.hypot(this.x, this.y);
    }

    /**
     * Unit vector in the same direction
     * @param {Number} length
     * @returns {Vector2D}
     */
    unit(length = 1) {
        const vecLength = this.length();
        if (vecLength === 0) {
            // no length, return vector with angle 0
            return new Vector2D(1 * length, 0);
        }
        return this.multiply(length / vecLength);
    }

    /**
     * vector division
     * @returns {Vector2D}
     */
    divide(d) {
        return new Vector2D(this.x / d, this.y / d);
    }

    // vector multiplication
    multiply(m) {
        return new Vector2D(this.x * m, this.y * m);
    }

    add(b) {
        return new Vector2D(this.x + b.x, this.y + b.y);
    }

    /**
     * Add another vector in place.
     * @param {Vector2D} b Another vector
     */
    addInPlace(b) {
        this.x += b.x;
        this.y += b.y;
    }

    // this - vector b
    sub(b) {
        return new Vector2D(this.x - b.x, this.y - b.y);
    }

    dot(b) {
        return this.x * b.x + this.y * b.y;
    }

    print() {
        console.log(`${this.x}, ${this.y}`);
    }
}

export const Vector = {
    add(a, b) {
        return new Vector2D(a.x + b.x, a.y + b.y);
    },

    sub(a, b) {
        return new Vector2D(a.x - b.x, a.y - b.y);
    },

    dot(a, b) {
        return a.x * b.x + a.y * b.y;
    },
    toVector(obj) {
        if (obj instanceof Vector2D) {
            return obj;
        }
        return new Vector2D(obj[0], obj[1]);
    },
    /**
     * Generate a unit vector
     * @param {Number} angle In radians
     * @param {Number} length Length of vector
     */
    unit(angle, length = 1) {
        return new Vector2D(length * Math.cos(angle), length * Math.sin(angle));
    },

    /**
     * Return z-component of cross product.
     * @param {Vector2} a First vector
     * @param {Vector2} b Second vector
     */
    cross(a, b) {
        // TODO
    }
};
