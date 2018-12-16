import { STANDARD_GRAVITY } from '../physics/constants';
// import { FuelTank } from './fuelTank';

export class Engine {
    constructor(mass, Isp, maxThrust, minThrust, numEngines, fuelTank, infiniteFuel = false, gimbalAngle = 0) {
        this.mass = mass * numEngines;
        this.Isp = Isp;
        this.maxThrust = maxThrust * numEngines;
        this.minThrust = minThrust * numEngines;
        this.gimbalAngle = gimbalAngle;
        this.infiniteFuel = infiniteFuel;

        this.thrust = 0;
        this.thrustChange = 0;
        this.throttleRate = this.maxThrust * 2; // amount per second

        this.deltaV = 0;

        // fuel tank
        this.fuelTank = fuelTank;

        // calculate exhaust velocity
        this.Ve = Isp * STANDARD_GRAVITY;
    }

    /**
     * Set the current throttle
     * @param {Number} amount amount of throttle in Newtons
     */
    setThrottle(amount) {
        // if zero, keep at zero
        
        if (this.thrust !== 0 || this.minThrust === 0) {
            this.thrust = Math.min(this.maxThrust, Math.max(this.minThrust, amount));
        }

        // if engine is off, start at minThrust. If at min and throttling down, go to 0.
        if (this.thrust === 0 && this.thrustChange > 0) {
            this.thrust = this.minThrust;
        } else if (this.thrust === this.minThrust && this.thrustChange < 0) {
            this.thrust = 0;
        }
    }

    /**
     * Begin throttle up
     */
    beginThrottleUp() {
        this.thrustChange = this.throttleRate;
    }

    /**
     * Begin throttle down
     */
    beginThrottleDown() {
        this.thrustChange = -this.throttleRate;
    }

    /**
     * Stop throttling
     */
    throttleStop() {
        this.thrustChange = 0;
    }

    /**
     * Returns the current mass flow rate
     */
    getMdot() {
        return this.thrust / this.Ve;
    }

    /**
     * Update parameters
     * @param {Number} dt Timestep in seconds
     */
    simulateFrame(dt) {
        this.setThrottle(this.thrust + this.thrustChange * dt);

        // consume fuel
        if (!this.infiniteFuel) {
            this.fuelTank.fuel -= this.getMdot() * dt;
            this.deltaV = this.Ve * Math.log((this.fuelTank.fuel + this.fuelTank.dryMass) / this.fuelTank.dryMass);
        }
    }

    /**
     * Returns the current thrust.
     * @param {Number} dt The timestep in seconds
     */
    getThrustAndUpdateFuel(dt) {
        if (this.fuelTank.fuel <= 0) {
            this.thrust = 0;
            return 0;
        }

        // update thrust and consume fuel
        this.simulateFrame(dt);
        return this.thrust;
    }
}
