import { Vector2D as Vec2, Vector as Vec } from './vector';
// import { Scene } from './scene';

export class Rocket {
    /**
     * @constructor
     * @param {Vec2} pos Starting position
     * @param {Vec2} vel Starting velocity
     * @param {Number} mass mass
     * @param {Number} angle angle in radians
     */
    constructor(pos, vel, mass, angle) {
        this.pos = Vec.toVector(pos);
        this.vel = Vec.toVector(vel);
        this.acc = new Vec2(0, 0);
        this.thrust = 0; // thrust in radial direction
        this.thrustChange = 0;

        this.mass = mass;
        this.angle = angle;
        this.angularVel = 0;
        this.angularAcc = 0;

        // settings
        this.minThrust = 0;
        this.maxThrust = 0.15;
        this.dragCoefficient = 0; // 0.00003;

        const _self = this;
        $(window).keydown((e) => {
            switch (e.which) {
            // left/right
            case 37:
                _self.angularAcc = -0.001;
                break;

            case 39:
                _self.angularAcc = 0.001;
                break;

                // up/down
            case 38:
                _self.thrustChange = 0.005;
                break;

            case 40:
                _self.thrustChange = -0.005;
                break;

            default:
                break;
            }
        });

        $(window).keyup((e) => {
            switch (e.which) {
            // left/right
            case 37:
                _self.angularAcc = 0;
                break;

            case 39:
                _self.angularAcc = 0;
                break;
                // up/down
            case 38:
                _self.thrustChange = 0;
                break;
            case 40:
                _self.thrustChange = 0;
                break;
            default:
                break;
            }
        });
    }

    /**
     *
     * @param {Scene} scene Scene to draw the shape
     */
    drawMe(scene) {
        const fireLength = this.thrust * 300;
        scene.rect(this.pos, fireLength, 3, this.angle, '#ff0000', new Vec2(-30 - fireLength / 2, 0));
        scene.rect(this.pos, 60, 14, this.angle, '#ffffff', null, true);

        // draw velocity vector
        scene.drawVector(this.pos, this.vel.multiply(2));
    }

    simulateFrame() {
        const planet = new Vec2(0, 100000 + 600);
        const rPlanet = 100000;
        const rVec = Vec.sub(this.pos, planet); // from planet to rocket
        const rLenSqrd = rVec.lengthSquared();
        const rVecUnit = rVec.unit();

        if (rLenSqrd < rPlanet ** 2) { // collision with planet
            const restitution = this.vel.lengthSquared() < 3 ? 0.0 : 0.3;
            const changeVel = rVecUnit.multiply((1 + restitution) * Math.abs(rVecUnit.dot(this.vel)));
            this.vel.addInPlace(changeVel);

            // find delta and move to prevent intersect
            const rVecToSurface = rVecUnit.multiply(rPlanet);
            const deltaToSurface = Vec.sub(rVecToSurface, rVec).multiply(1.1);
            this.pos.addInPlace(deltaToSurface);
        }


        // update angle
        this.angularVel += this.angularAcc;
        this.angle += this.angularVel;

        // Update thrust
        this.thrust += this.thrustChange;
        this.thrust = Math.min(this.maxThrust, Math.max(this.minThrust, this.thrust)); // limit

        // FORCES
        const sumForces = new Vec2(0, 0);

        // Thrust force
        const thrustForce = Vec.unit(this.angle, this.thrust); // In the radial direction
        sumForces.addInPlace(thrustForce); // add thrust force

        // drag
        const velUnit = this.vel.unit();
        const drag = velUnit.multiply(-this.vel.lengthSquared() * this.dragCoefficient); // Cd*v^2 in opposite direction
        sumForces.addInPlace(drag);

        // gravity
        // sumForces.y += 0.05;
        const mPlanet = 50000000;
        const gravity = rVecUnit.multiply(-mPlanet / rLenSqrd);
        sumForces.addInPlace(gravity);


        // update position and velocity
        const newAcc = sumForces.divide(this.mass);
        this.vel.addInPlace(newAcc); // update velocity
        this.pos.addInPlace(this.vel); // update position


        // bounce
        /*
        if (this.pos.y > 600) {
            this.vel.y = -Math.abs(this.vel.y) * 0.2
            this.pos.y = 600;
        } *//*
        if (this.pos.x > 3000) {
            this.pos.x = -3000;
        } */
    }
}

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
        scene.circleGradient(this.pos, this.atmStart, this.atmEnd);
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
