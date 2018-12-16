import { Engine } from './engine';
import { FuelTank } from './fuelTank';

export const enginePresets = {
    merlin1D: {
        Isp: 282,
        maxThrust: 845000,
        minThrust: 50000,
        mass: 0,
    },
    Rutherford: {
        Isp: 303,
        maxThrust: 192000,
        minThrust: 1,
        mass: 0,
    },
};

export const fuelTankPresets = {
    f9stage1: {
        dryMass: 22200,
        wetMass: 433100,
    },
    Electron: {
        dryMass: 1250,
        wetMass: 12500,
    },
};

export function engineFromPreset(engineName, fuelTankName, numEngines, infiniteFuel = false) {
    const engConf = enginePresets[engineName];
    const fuelConf = fuelTankPresets[fuelTankName];

    const fuelTank = new FuelTank(fuelConf.wetMass, fuelConf.dryMass);
    const engine = new Engine(engConf.mass, engConf.Isp, engConf.maxThrust, engConf.minThrust, numEngines, fuelTank, infiniteFuel);
    return engine;
}
