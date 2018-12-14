import { Vec2, Vector as Vec } from '../vector';
import { ellipticalOrbit } from '../Shapes/ellipticalOrbit';

// import { Scene } from '../scene';

export class Rocket {
    /**
     * @constructor
     * @param {Vec2} pos Starting position
     * @param {Vec2} vel Starting velocity
     * @param {Number} mass mass
     * @param {Number} angle angle in radians
     * @param {Array} planetList a list of planets
     */
    constructor(pos, vel, mass, angle, planetList) {
        // dynamics
        this.pos = Vec.toVector(pos);
        this.vel = Vec.toVector(vel);
        this.acc = new Vec2(0, 0);
        this.thrust = 0; // thrust in radial direction
        this.thrustChange = 0;

        this.mass = mass;
        this.angle = angle;
        this.angularVel = 0;
        this.angularAcc = 0;
        this.eccentricity = 0;

        this.rocketHeight = 1.8;
        this.rocketWidth = 0.6;

        // main planet
        this.planetList = planetList;

        // settings
        this.minThrust = 0;
        this.maxThrust = 5000;
        this.dragCoefficient = 0; // 0.00003;

        this.gConstant = 1;

        const _self = this;
        $(window).keydown((e) => {
            switch (e.which) {
            // left/right
            case 37:
                _self.angularAcc = -1;
                break;

            case 39:
                _self.angularAcc = 1;
                break;

                // up/down
            case 38:
                _self.thrustChange = this.maxThrust / 50;
                break;

            case 40:
                _self.thrustChange = -this.maxThrust / 50;
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
        const planet = this.planetList[0];

        // DRAW PREDICTED PATH
        const drawOrbit = scene.camera.zoom < 15;
        this.eccentricity = ellipticalOrbit(this, planet, this.gConstant, scene, drawOrbit).eccentricity;

        // Draw fire first
        const randAngle = (Math.random() - 0.5) * 0.02;
        const fireLength = this.thrust / this.maxThrust * 1 - 0.05 * Math.random();
        const fireOffset = new Vec2(-(this.rocketHeight / 2) - fireLength / 2, 0);
        scene.rect(this.pos, fireLength, 0.2, this.angle + randAngle, '#fd753daa', fireOffset);

        // draw rocket body
        scene.rect(this.pos, this.rocketHeight, this.rocketWidth, this.angle, '#ffffff', null, false);
        scene.circle(this.pos, this.rocketWidth / 2, '#ffffff', this.angle, new Vec2(this.rocketHeight / 2, 0));

        // draw velocity vector
        if (scene.camera.zoom < 1.5) { // if zoomed out
            scene.drawVector(this.pos, this.vel, 2, 0.5 / scene.camera.zoom);
            scene.circle(this.pos, 2 / scene.camera.zoom, '#ffffff');
        } else {
            scene.drawVector(this.pos, this.vel, 0.2, 0.25);
        }
    }

    /**
     * Simulate next timestep
     * @param {Array} interactList A list of sprite objects to interact with.
     * @param {Number} dt The simulation timestep
     */
    simulateFrame(dt) {
        const planet = this.planetList[0];
        const rVec = Vec.sub(this.pos, planet.pos); // from planet to rocket
        const rLenSqrd = rVec.lengthSquared();
        const rVecUnit = rVec.unit();

        if (rLenSqrd < planet.radius ** 2) { // collision with planet
            const velLength = this.vel.length();
            if (velLength > 1) { // show crash
                $('#crash').html(`CRASHED AT ${Math.round(velLength)} px/s`);
                window.setTimeout(() => {
                    $('#crash').html('');
                }, 5000);
            }
            const restitution = this.vel.lengthSquared() < 3 ? 0.0 : 0.3;
            const changeVel = rVecUnit.multiply((1 + restitution) * Math.abs(rVecUnit.dot(this.vel)));
            this.vel.addInPlace(changeVel);

            // find delta and move to prevent intersect
            const rVecToSurface = rVecUnit.multiply(planet.radius);
            const deltaToSurface = Vec.sub(rVecToSurface, rVec).multiply(1.1);
            this.pos.addInPlace(deltaToSurface);
        }


        // update angle using velocity verlet
        this.angle += this.angularVel * dt + 0.5 * this.angularAcc * (dt ** 2);
        this.angularVel += this.angularAcc * dt;
        this.angularVel *= 1 - (0.5 * dt); // dampening

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
        const gravity = rVecUnit.multiply(-this.gConstant * this.mass * planet.mass / rLenSqrd);
        sumForces.addInPlace(gravity);


        // update position and velocity using velocity verlet

        // new acceleration * timestep
        const newAccDt = sumForces.multiply(dt / this.mass);

        this.pos.addInPlace(Vec.add(this.vel.multiply(dt), newAccDt.multiply(dt)));
        this.vel.addInPlace(newAccDt); // update velocity


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
