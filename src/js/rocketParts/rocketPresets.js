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
        minThrust: 92000,
        mass: 0,
    },
    RocketdyneF1: {
        Isp: 263,
        maxThrust: 7770000,
        minThrust: 3770000,
        mass: 0,
    },
};

export const fuelTankPresets = {
    f9stage1: {
        dryMass: 22200 + 111500,
        wetMass: 433100 + 111500,
    },
    Electron: {
        dryMass: 1250,
        wetMass: 12500,
    },
    SaturnV: {
        dryMass: 2970000 - 2160000,
        wetMass: 2970000,
    },
};

export function engineFromPreset(engineName, fuelTankName, numEngines, infiniteFuel = false) {
    const eng = enginePresets[engineName];
    const fuelConf = fuelTankPresets[fuelTankName];

    const fuelTank = new FuelTank(fuelConf.wetMass, fuelConf.dryMass);
    const engine = new Engine(eng.mass, eng.Isp, eng.maxThrust, eng.minThrust, numEngines, fuelTank, infiniteFuel);
    return engine;
}
