import { Vector2D as Vec2, Vector as Vec } from './vector';
// import { Scene } from './scene';

export class Planet {
    constructor(x, y, radius, color = '#000000', atmosHeight, mass = 1) {
        this.color = color;
        this.radius = radius;
        this.atmStart = radius;
        this.atmEnd = radius + atmosHeight;
        this.pos = new Vec2(x, y);
        this.speed = new Vec2(0, 0);
        this.mass = mass;
        this.inv_mass = 1 / mass;
    }

    simulateFrame() {
        //
    }

    drawMe(scene) {
        scene.circleGradient(this.pos, this.atmStart, this.atmEnd, 'rgba(170, 170, 255, 0.6)', 'rgba(100, 100, 200, 0)');
        scene.circle(this.pos, this.radius, this.color);
    }
}

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

    
    simulateFrame() {/*
        this.changePos(this.speed.x, this.speed.y);
        this.speed = vec.add(this.speed, new Vec2(0, 1))

        if (this.pos.x + this.radius > canvas.width) {
            this.speed.x = -(Math.abs(this.speed.x));
    }
        if (this.pos.x - this.radius < 0) {
            this.speed.x = Math.abs(this.speed.x);
        }
        else if (this.pos.y + this.radius > canvas.height) {
            //this.speed.y = Math.min(-(Math.abs(this.speed.y)) * 0.6, -Math.random()*25);
            this.speed.y = -(Math.abs(this.speed.y)) * 0.6
            //this.speed.x = this.speed.x * 0.6 + ((Math.random()-0.5)*20);
            this.speed.x = this.speed.x;

            this.changePos(0, canvas.height - (this.pos.y + this.radius));
        }
        else if (this.pos.y - this.radius < 0) {
            this.speed.y = Math.abs(this.speed.y);
        }*/
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
        /*
        this.changePos(this.speed.x, this.speed.y)
        this.speed = vec.add(this.speed, new Vec2(0, 1))
*/
        /*
        if (this.pos.x + this.radius > canvas.width) {
            this.speed.x = -(Math.abs(this.speed.x));
        } */
        if (this.pos.x - this.radius < 0) {
            this.speed.x = Math.abs(this.speed.x);
        } else if (this.pos.y + this.radius > canvas.height) {
            // this.speed.y = Math.min(-(Math.abs(this.speed.y)) * 0.6, -Math.random()*25);
            this.speed.y = -(Math.abs(this.speed.y)) * 0.6;
            // this.speed.x = this.speed.x * 0.6 + ((Math.random()-0.5)*20);
            this.speed.x = this.speed.x;

            this.changePos(0, canvas.height - (this.pos.y + this.radius));
        } else if (this.pos.y - this.radius < 0) {
            this.speed.y = Math.abs(this.speed.y);
        }
    }

    drawMe(scene) {
        scene.rect(this.pos, this.width, this.height, this.rotation, this.color);
    }
}
