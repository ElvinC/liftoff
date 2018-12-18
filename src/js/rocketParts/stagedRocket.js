import { Vec2, Vector as Vec } from '../vector';
import { ellipticalOrbit } from '../Shapes/ellipticalOrbit';
import { ISA } from '../physics/atmosphere';

export class StagedRocket {
    constructor(pos, vel, angle, stageList, planetList, focus = true) {
        this.pos = pos;
        this.vel = vel;
        this.angle = angle;
        this.acc = new Vec2(0, 0);
        this.stages = stageList;
        this.droppedStages = [];
        this.planetList = planetList;

        // focus on rocket, user can control it
        this.focus = focus;

        this.mass = 1;

        this.dynPressure = 0;

        // parameters
        this.angle = angle;
        this.angularVel = 0;
        this.angularAcc = 0;
        this.orbitalParams = {
            trueAnomaly: 0,
            eccentricity: 0,
            periapsis: 0,
            apoapsis: 0,
        };

        // settings
        this.dragCoefficient = 0.04; // not based on anything

        this.spacePressed = false;

        const _self = this;
        $(window).keydown((e) => {
            if (this.focus) {
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
                    _self.stages[0].engine.beginThrottleUp();
                    break;
    
                case 40:
                    _self.stages[0].engine.beginThrottleDown();
                    break;
    
                case 32:
                    if (!this.spacePressed) {
                        this.spacePressed = true;
                        this.seperateStage();
                    }
                    break;
        
                default:
                    break;
                }
            }

        });

        $(window).keyup((e) => {
            if (this.focus) {
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
                    _self.stages[0].engine.throttleStop();
                    break;
                case 40:
                    _self.stages[0].engine.throttleStop();
                    break;
                case 32:
                    this.spacePressed = false;
                    break;
                default:
                    break;
                }
            }
        });
    }

    updateMass() {
        let newMass = 0;
        for (let i = 0; i < this.stages.length; i++) {
            newMass += this.stages[i].engine.mass;
            newMass += this.stages[i].fuelTank.fuel;
            newMass += this.stages[i].fuelTank.dryMass;
        }
        this.mass = newMass;
    }

    seperateStage() {
        if (this.stages.length >= 2) {
            let droppedStage = this.stages[0];
            console.log(this.stages[1]);
            
            // how much to move
            const shiftAmount = (droppedStage.height + this.stages[1].height) / 2;

            this.stages.shift(); // remove current stage
            
            const nPos = this.pos.copy();
            const nVel = this.vel.add(Vec.unit(this.angle, -2)); // push it a little
            let newStageObject = new StagedRocket(nPos, nVel, this.angle, [droppedStage], this.planetList, false);
            this.droppedStages.push(newStageObject);

            this.pos.addInPlace(Vec.unit(this.angle, shiftAmount));
        }
    }

    simulateFrame(dt) {
        const planet = this.planetList[0];
        
        const rVec = Vec.sub(this.pos, planet.pos); // from planet to rocket
        const rLenSqrd = rVec.lengthSquared();
        const rVecUnit = rVec.unit();

        this.updateMass();
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
        const thrust = this.stages[0].getThrustAndUpdateFuel(dt);


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

        // simulate the dropped stages
        for (let i = 0; i < this.droppedStages.length; i++) {
            this.droppedStages[i].simulateFrame(dt);
        }
    }

    drawMe(scene) {
        const planet = this.planetList[0];

        // DRAW PREDICTED PATH
        const drawOrbit = scene.camera.zoom < 0.5;

        const orbitOpacity = this.focus ? 0.25 : 0.1;
        this.orbitalParams = ellipticalOrbit(this, planet, scene, drawOrbit, orbitOpacity);

        // let offset = new Vec2(0, 0);
        const offset = new Vec2(0, 0); // offset based on dynamic pressure
        const shakePos = Vec.add(this.pos, Vec.unit(Math.random() * 2 * Math.PI, 0.0003 * Math.sqrt(this.dynPressure)))
        // let sumHeight = 0;
        let maxWidth = 0;
        for (let i = 0; i < this.stages.length; i++) {
            const stage = this.stages[i];
            if (i === 0) {
                const fireAmount = stage.engine.thrust / stage.engine.maxThrust;
                stage.drawMe(shakePos, this.angle, scene, offset, true, fireAmount);
            } else {
                stage.drawMe(shakePos, this.angle, scene, offset, false);
            }
            // sumHeight += stage.height;
            maxWidth = Math.max(maxWidth, stage.width);

            if (i < this.stages.length - 1) {
                offset.x += (stage.height + this.stages[i + 1].height) / 2;
            }
        }

        // draw dropped stages
        for (let i = 0; i < this.droppedStages.length; i++) {
            this.droppedStages[i].drawMe(scene);
        }
/*
        var grd = scene.ctx.createLinearGradient(0, 0, 170, 0);
        grd.addColorStop(0, "rgba(200, 100, 100, 0.6)");
        grd.addColorStop(1, "rgba(200, 100, 100, 0)");

        let glowOffset = new Vec2((sumHeight - this.stages[0].height) / 2, 0);
        let glowHeight = sumHeight + 2;
        let glowWidth = maxWidth + 2;
        scene.rect(this.pos, glowHeight, glowWidth, this.angle, grd, glowOffset, false, true);*/

        // draw velocity vector
        if (scene.camera.zoom < 1.5) { // if zoomed out
            const vectorColor = this.focus ? '#ffffff' : '#ffffff55';
            scene.drawVector(this.pos, this.vel, 2 / scene.camera.zoom, 0.05 / scene.camera.zoom, vectorColor);
            scene.circle(this.pos, 2 / scene.camera.zoom, vectorColor);
        } else {
            scene.drawVector(this.pos, this.vel, 0.3, 0.1, '#ff5722');
        }
    }

    getDeltaV() {
        const totalMass = this.mass;
        const currentStage = this.stages[0];
        // find mass, when current tank is empty;
        const dryMass = totalMass - currentStage.fuelTank.fuel;
        const deltaV = currentStage.engine.Ve * Math.log(totalMass / dryMass);
        return deltaV;
    }
}