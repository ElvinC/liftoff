import { Vec2, Vector as Vec } from './vector';
// import { Scene } from './scene';

export class Circle {
    /**
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} radius
     * @param {String} color
     * @param {Number} mass
     * @param {Number} restitution
     */
    constructor(x, y, radius, color = '#000000', mass, restitution) {
        this.color = color;
        this.radius = radius;
        this.pos = new Vec2(x, y);
        this.speed = new Vec2(0, 0);
        this.restitution = restitution;
        this.mass = mass;
        this.inv_mass = 1 / mass;

        // change position of rectangle
    }

    changePos(x, y) {
        const change = new Vec2(x, y);
        this.pos = Vec.add(this.pos, change);
    }


    simulateFrame() {
        //
    } 

    drawMe(scene) {
        scene.circle(this.pos, this.radius, this.color);
    }
}

export class Rectangle {
    constructor(x, y, width, height, rotation, color = '#000000', mass, restitution) {
        // center i at the center of mass
        this.color = color;
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.pos = new Vec2(x, y);
        this.speed = new Vec2(5, 0);
        this.restitution = restitution;
        this.mass = mass;
        this.inv_mass = 1 / mass;
    }

    // change position of rectangle
    changePos(x, y) {
        const change = new Vec2(x, y);
        this.pos = Vec.add(this.pos, change);
    }

    simulateFrame() {
        //
    }

    drawMe(scene) {
        scene.rect(this.pos, this.width, this.height, this.rotation, this.color);
    }
}
