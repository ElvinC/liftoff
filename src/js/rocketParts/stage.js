import { enginePresets, fuelTankPresets } from './rocketPresets';
import { Engine } from './engine';
import { FuelTank } from './fuelTank';
import { Vec2 } from '../vector';

export class Stage {
    constructor(engine, numEngines, fuelTank, numFueltanks, {
        height = 71,
        width = 3.66,
        fireLength = 40,
        fireWidth = 2.5,
        hasCap = false,
        color = "#ffffff",
    } = {}) {
        this.engine = engine;
        this.numEngines = numEngines;
        this.fuelTank = fuelTank;
        this.numFueltanks = numFueltanks;
        this.height = height;
        this.width = width;
        this.fireLength = fireLength;
        this.fireWidth = fireWidth;
        this.hasCap = hasCap;
        this.color = color;
        this.deltaV = 0;
    }

    getIsp() {

    }

    drawMe(pos, angle, scene, offset, drawFire = false, fireAmount = 0) {
        // Draw fire first
        if (drawFire) {
            // use shadow as "glow"
            scene.setShadow('#fd753d', 40);

            let randAngle = (Math.random() - 0.5) * 0.01;
            let newFireLength = fireAmount * this.fireLength - 0.5 * Math.random();
            let fireOffset = new Vec2(-(this.height / 2) - newFireLength / 2, 0);
            scene.rect(pos, newFireLength, this.fireWidth, angle + randAngle, '#fd753daa', fireOffset);

            scene.setShadow('#ffd976', 40);
            randAngle = (Math.random() - 0.5) * 0.005;
            newFireLength = fireAmount * this.fireLength * 0.8 - 0.1 * Math.random();
            fireOffset = new Vec2(-(this.height / 2) - newFireLength / 2, 0);
            scene.rect(pos, newFireLength, 1.5, angle + randAngle, '#ffe99699', fireOffset);

            // stop shadow
            scene.setShadow();
        }

        // draw cap
        if (this.hasCap) {
            const rectOffset = offset.sub(new Vec2(this.width / 4, 0));
            const capOffset = offset.add(new Vec2((this.height - this.width) / 2, 0));
            // subtract radius of circle from height
            scene.rect(pos, this.height - this.width / 2, this.width, angle, this.color, rectOffset, false);
            scene.circle(pos, this.width / 2, this.color, angle, capOffset, 3 / 2 * Math.PI, Math.PI / 2);
        } else {
            // draw rocket body
            scene.rect(pos, this.height, this.width, angle, this.color, offset, false);
        }
    }

    simulateFrame(dt) {
        this.engine.setThrottle(this.engine.thrust + this.engine.thrustChange * dt);

        if (!this.engine.infiniteFuel) {
            this.fuelTank.fuel -= this.engine.getMdot() * dt;
        }
    }

    getThrustAndUpdateFuel(dt) {
        if (this.fuelTank.fuel <= 0) {
            this.engine.thrust = 0;
            return 0;
        }

        // update thrust and consume fuel
        this.simulateFrame(dt);
        return this.engine.thrust;
}
}


export function stageFromPreset(EngineName, numEngines, fuelTankName, numFueltanks, cap = false) {
    const eng = enginePresets[EngineName];
    const fuelConf = fuelTankPresets[fuelTankName];

    const engine = new Engine(eng.mass, eng.Isp, eng.maxThrust, eng.minThrust, numEngines);
    const fuelTank = new FuelTank(fuelConf.wetMass, fuelConf.dryMass);

    const newStage = new Stage(engine, numEngines, fuelTank, numFueltanks, {
        height: fuelConf.height,
        width: fuelConf.width,
        fireLength: eng.fireLength,
        hasCap: cap,
    });
    return newStage;
}