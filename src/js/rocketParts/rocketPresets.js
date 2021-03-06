import { Engine } from './engine';
import { FuelTank } from './fuelTank';

export const enginePresets = {
    NoEngine: {
        Isp: 0,
        maxThrust: 1,
        minThrust: 0,
        mass: 0,
        fireLength: 0,
    },
    merlin1D: {
        Isp: 282,
        maxThrust: 845000,
        minThrust: 345000,
        mass: 0,
        fireLength: 40,
    },
    Merlin1DVac: {
        Isp: 348,
        maxThrust: 934000,
        minThrust: 334000,
        mass: 0,
        fireLength: 10,
    },
    SuperDraco: {
        Isp: 235,
        maxThrust: 71000,
        minThrust: 14200,
        mass: 0,
        fireLength: 1,
    },
    Rutherford: {
        Isp: 303,
        maxThrust: 192000,
        minThrust: 92000,
        mass: 0,
    },
    RocketdyneF1: {
        Isp: 263,
        maxThrust: 6770000,
        minThrust: 677000,
        mass: 0,
    },
    Raptor: {
        Isp: 350,
        maxThrust: 1993000,
        minThrust: 199300,
    },
    BE3: {
        Isp: 263,
        maxThrust: 490000,
        minThrust: 90000,
        mass: 0,
        fireLength: 3,
    },
    NSEscape: {
        Isp: 200,
        maxThrust: 490000,
        minThrust: 450000,
        mass: 0,
        fireLength: 0.6,
    },
};

export const fuelTankPresets = {
    f9stage1: {
        dryMass: 22200,
        wetMass: 433100,
        height: 42.6,
        width: 3.66,
    },
    f9stage2: {
        dryMass: 4000,
        wetMass: 111500,
        height: 12.6,
        width: 3.66,
    },
    Electron: {
        dryMass: 1250,
        wetMass: 12500,
        height: 17,
        width: 1.2,
    },
    SaturnV: {
        dryMass: 2970000 - 2160000,
        wetMass: 2970000,
    },
    f9Fairing: {
        dryMass: 2500,
        wetMass: 2500,
        height: 13,
        width: 5.2,
    },
    DragonTrunk: {
        dryMass: 800,
        wetMass: 800,
        height: 3,
        width: 3.77,
    },
    Dragon: {
        dryMass: 4200 + 6000 - 1900,
        wetMass: 4200 + 6000,
        height: 3.1,
        width: 3.77,
        cap: true,
    },
    SaturnVStage1: {
        dryMass: 131000,
        wetMass: 2280000,
        height: 42,
        width: 10,
    },
    NSCapsule: {
        height: 3.7,
        width: 3.65,
        dryMass: 4000,
        wetMass: 4300,
        cap: true,
    },
    NSBooster: {
        height: 14,
        width: 3.5,
        dryMass: 9000,
        wetMass: 35000,
    },
};

export function engineFromPreset(engineName, fuelTankName, numEngines, infiniteFuel = false) {
    const eng = enginePresets[engineName];
    const fuelConf = fuelTankPresets[fuelTankName];

    if (eng === undefined || fuelConf === undefined) {
        return false;
    }

    const fuelTank = new FuelTank(fuelConf.wetMass, fuelConf.dryMass);
    const engine = new Engine(eng.mass, eng.Isp, eng.maxThrust, eng.minThrust, numEngines, fuelTank, infiniteFuel);
    return engine;
}
