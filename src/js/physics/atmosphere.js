import { STANDARD_GRAVITY } from './constants';


const RSpecificAir = 287.058;
const heatCapacityRatio = 1.4;

// https://en.wikipedia.org/wiki/International_Standard_Atmosphere
const layers = [
    {
        layer: 0,
        name: 'Troposphere',
        baseGeopotential: -610,
        baseGeometric: -611,
        lapse: +6.5,
        baseTemperature: +19.0,
        basePressure: 108900,
        baseDensity: 1.2985,
    },
    {
        layer: 1,
        name: 'Tropopause',
        baseGeopotential: 11000,
        baseGeometric: 11019,
        lapse: 0.0,
        baseTemperature: -56.5,
        basePressure: 22632,
        baseDensity: 0.3639,
    },
    {
        layer: 2,
        name: 'Stratosphere',
        baseGeopotential: 20000,
        baseGeometric: 20063,
        lapse: -1.0,
        baseTemperature: -56.5,
        basePressure: 5474.9,
        baseDensity: 0.088,
    },
    {
        layer: 3,
        name: 'Stratosphere',
        baseGeopotential: 32000,
        baseGeometric: 32162,
        lapse: -2.8,
        baseTemperature: -44.5,
        basePressure: 868.02,
        baseDensity: 0.0132,
    },
    {
        layer: 4,
        name: 'Stratopause',
        baseGeopotential: 47000,
        baseGeometric: 47350,
        lapse: 0.0,
        baseTemperature: -2.5,
        basePressure: 110.91,
        baseDensity: 0.002,
    },
    {
        layer: 5,
        name: 'Mesosphere',
        baseGeopotential: 51000,
        baseGeometric: 51413,
        lapse: +2.8,
        baseTemperature: -2.5,
        basePressure: 66.939,
        baseDensity: 0.00086,
    },
    {
        layer: 6,
        name: 'Mesosphere',
        baseGeopotential: 71000,
        baseGeometric: 71802,
        lapse: +2.0,
        baseTemperature: -58.5,
        basePressure: 3.9564,
        baseDensity: 0.000064,
    },
    {
        layer: 7,
        name: 'Mesopause',
        baseGeopotential: 84852,
        baseGeometric: 86000,
        lapse: 0,
        baseTemperature: -86.28,
        basePressure: 0.3734,
        baseDensity: 0.00000696,
    },
];

function celsiusToKelvin(temperature) {
    return temperature + 273.15;
}

function getTemperature(layer, height) {
    const bT = celsiusToKelvin(layer.baseTemperature);
    const a = layer.lapse / 1000;
    const deltaHeight = height - layer.baseGeometric;

    const temperature = bT - deltaHeight * a;
    return temperature;
}

function getPressureNoLapse(layer, height) {
    // https://en.wikipedia.org/wiki/Barometric_formula
    const l = layer;
    const bT = celsiusToKelvin(l.baseTemperature);
    const eqExponent = (-STANDARD_GRAVITY * (height - l.baseGeometric)) / (bT * RSpecificAir);
    const pressure = l.basePressure * Math.exp(eqExponent);
    return pressure;
}

function getPressure(layer, temperature) {
    const l = layer;
    const lapse = l.lapse / 1000;
    const bT = celsiusToKelvin(l.baseTemperature);

    // P = Pl * (T/Tl)^(-g0/a*R)
    const eqExponent = STANDARD_GRAVITY / (lapse * RSpecificAir);

    const pressure = l.basePressure * ((temperature / bT) ** eqExponent);

    return pressure;
}

function getLayer(height) {
    // find atmospheric layer
    for (let i = 1; i < layers.length; i++) {
        if (height < layers[i].baseGeometric) {
            return layers[i - 1];
        }
    }
    return null;
}

function speedOfSound(temperature) {
    return Math.sqrt(heatCapacityRatio * RSpecificAir * temperature);
}

export function ISA(altitude) {
    if (altitude > 86000 || altitude < -611) {
        return {
            temperature: 0,
            pressure: 0,
            density: 0,
            soundSpeed: 0,
        };
    }

    const layer = getLayer(altitude);

    const temperature = getTemperature(layer, altitude);
    let pressure = 0;
    if (layer.lapse === 0) {
        pressure = getPressureNoLapse(layer, altitude);
    } else {
        pressure = getPressure(layer, temperature);
    }
    const density = pressure / (RSpecificAir * temperature);
    const soundSpeed = speedOfSound(temperature);
    return {
        temperature,
        pressure,
        density,
        soundSpeed,
    };
}
