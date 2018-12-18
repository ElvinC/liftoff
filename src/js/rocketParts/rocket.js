import { Vec2, Vector as Vec } from '../vector';
import { ellipticalOrbit } from '../Shapes/ellipticalOrbit';
import { ISA } from '../physics/atmosphere';
import { Stage } from './stage';

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
    constructor(pos, vel, mass, angle, planetList, engine) {
        // dynamics
        this.pos = Vec.toVector(pos);
        this.vel = Vec.toVector(vel);
        this.acc = new Vec2(0, 0);

        this.dynPressure = 0;

        // parameters
        this.mass = mass;
        this.angle = angle;
        this.angularVel = 0;
        this.angularAcc = 0;
        this.orbitalParams = {
            trueAnomaly: 0,
            eccentricity: 0,
            periapsis: 0,
            apoapsis: 0,
        };

        this.engine = engine;

        this.rocketHeight = 71;
        this.rocketWidth = 3.66;

        // main planet
        this.planetList = planetList;

        // settings
        this.dragCoefficient = 0.04; // not based on anything

        this.spacePressed = false;

        const _self = this;
        $(window).keydown((e) => {
            switch (e.which) {
            // left/right
            case 37:
                _self.angularAcc = -0.2;
                break;

            case 39:
                _self.angularAcc = 0.2;
                break;

                // up/down
            case 38:
                _self.engine.beginThrottleUp();
                break;

            case 40:
                _self.engine.beginThrottleDown();
                break;

            case 32:
                if (!this.spacePressed) {
                    this.spacePressed = true;
                }
                

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
                _self.engine.throttleStop();
                break;
            case 40:
                _self.engine.throttleStop();
                break;
            case 32:
                this.spacePressed = false;
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
        const drawOrbit = scene.camera.zoom < 0.5;
        this.orbitalParams = ellipticalOrbit(this, planet, scene, drawOrbit);

        // Draw fire first
        let randAngle = (Math.random() - 0.5) * 0.01;
        let fireLength = this.engine.thrust / this.engine.maxThrust * 40 - 0.5 * Math.random();
        let fireOffset = new Vec2(-(this.rocketHeight / 2) - fireLength / 2, 0);

        scene.ctx.shadowColor = '#fd753d';
        scene.ctx.shadowBlur = 40;
        scene.rect(this.pos, fireLength, 2.5, this.angle + randAngle, '#fd753daa', fireOffset);
        randAngle = (Math.random() - 0.5) * 0.005;
        fireLength = this.engine.thrust / this.engine.maxThrust * 25 - 0.1 * Math.random();
        fireOffset = new Vec2(-(this.rocketHeight / 2) - fireLength / 2, 0);

        scene.ctx.shadowColor = '#ffd976';
        scene.rect(this.pos, fireLength, 1.5, this.angle + randAngle, '#ffe99699', fireOffset);

        scene.ctx.shadowColor = "transparent";
        scene.ctx.shadowBlur = 0;
        // draw rocket body
        scene.rect(this.pos, this.rocketHeight, this.rocketWidth, this.angle, '#ffffff', null, false);
        scene.rect(this.pos, 7.2, this.rocketWidth, this.angle, '#444444', new Vec2(this.rocketHeight / 5, 0), false);
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
     * @param {Number} dt The simulation timestep
     */
    simulateFrame(dt) {
        const planet = this.planetList[0];
        const rVec = Vec.sub(this.pos, planet.pos); // from planet to rocket
        const rLenSqrd = rVec.lengthSquared();
        const rVecUnit = rVec.unit();

        // update current mass
        this.mass = this.engine.mass + this.engine.fuelTank.fuel + this.engine.fuelTank.dryMass;

        if (rLenSqrd < planet.radius ** 2) { // collision with planet
            const velLength = this.vel.length();
            if (velLength > 4) { // show crash
                $('#crash').html(`CRASHED AT ${Math.round(velLength)} m/s`);
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
        this.angle = this.angle % (2 * Math.PI); // wrap around
        this.angularVel += this.angularAcc * dt;
        this.angularVel *= Math.max(1 - (0.5 * dt), 0); // dampening

        // Update thrust
        const thrust = this.engine.getThrustAndUpdateFuel(dt);

        // FORCES
        const sumForces = new Vec2(0, 0);
        // Thrust force
        const thrustForce = Vec.unit(this.angle, thrust); // In the radial direction
        sumForces.addInPlace(thrustForce); // add thrust force
        
        // drag
        const velUnit = this.vel.unit();

        const altitude = Math.sqrt(rLenSqrd) - planet.radius;
        const ISAData = ISA(altitude);
        // 1/2 rho v^2 Cd in opposite direction
        const dynPressure = 0.5 * ISAData.density * this.vel.lengthSquared();
        this.dynPressure = dynPressure;

        const drag = -dynPressure * this.dragCoefficient;
        const dragVec = velUnit.multiply(drag);
        sumForces.addInPlace(dragVec);

        // gravity
        const GMPlanet = planet.stdGravParam || this.gConstant * planet.mass;
        const gravity = rVecUnit.multiply(-this.mass * GMPlanet / rLenSqrd);
        sumForces.addInPlace(gravity);

        
        // update position and velocity using velocity verlet

        // new acceleration
        const newAcc = sumForces.divide(this.mass);
        this.acc = newAcc;

        this.pos.addInPlace(Vec.add(this.vel.multiply(dt), newAcc.multiply(0.5 * (dt ** 2))));
        this.vel.addInPlace(newAcc.multiply(dt)); // update velocity
    }
}
