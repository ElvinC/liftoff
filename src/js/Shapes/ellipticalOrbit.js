import { Vector as Vec } from '../vector';
import { GRAVITATIONAL_CONSTANT } from '../physics/constants';
// import { Scene } from '../scene';

/**
 * Draw an elliptical orbit
 * @param {*} bodyA Object with pos, mass and velocity, in motion
 * @param {*} bodyB Object with pos and mass, not in motion
 * @param {Scene} scene Scene to draw the orbit
 * @param {Boolean} drawOrbit Draw orbit on scene
 * @param {Number} opacity Opacity of drawn orbit
 */
export function ellipticalOrbit(bodyA, bodyB, scene, drawOrbit, opacity = 0.25) {
    // body A is in motion, body B is stationary

    // calculate useful values
    const GMb = bodyB.stdGravParam || bodyB.mass * GRAVITATIONAL_CONSTANT;
    // vector from B to A
    const rVec = bodyA.pos.sub(bodyB.pos);
    const rLen = rVec.length();

    // orbital velocity vector, relative velocity
    const orbVel = bodyA.vel.sub(bodyB.vel);
    const velSqrd = orbVel.lengthSquared();
    const rDotVel = Vec.dot(rVec, orbVel);

    // find eccentricity vector, https://en.wikipedia.org/wiki/Eccentricity_vector
    let eccVec = rVec.multiply((velSqrd / GMb) - (1 / rLen));
    // eccVec = eccVec.sub(orbVel.multiply(Vec.dot(rVec, orbVel) / GMb));
    eccVec = eccVec.sub(orbVel.multiply(rDotVel / GMb));

    const eccentricity = eccVec.length();

    // find angular momentum https://en.wikipedia.org/wiki/Angular_momentum
    const RPerpA = Vec.perp(rVec, orbVel);
    // const horizontalVel = RPerpA / rLen;
    // const angularVel = RPerpA / (rLen ** 2);
    // const angularMomentum = (rLen ** 2) * angularVel
    const angularMomentum = RPerpA * bodyA.mass;

    // find true anomaly https://en.wikipedia.org/wiki/True_anomaly
    const eccDotR = eccVec.dot(rVec);

    let trueAnomaly = Math.acos(eccDotR / (eccentricity * rLen));

    if (rDotVel < 0) {
        trueAnomaly = 2 * Math.PI - trueAnomaly;
    }

    // find distance between apoapsis and periapsis.

    // angularMomentum^2/(m^2 y) https://en.wikipedia.org/wiki/Orbit_equation
    const constantTerm = (angularMomentum ** 2) / (GMb * (bodyA.mass ** 2));

    const periapsis = constantTerm / (1 + eccentricity);
    const apoapsis = constantTerm / (1 - eccentricity);

    // find semi-major and semi-minor axes https://en.wikipedia.org/wiki/Semi-major_and_semi-minor_axes
    const semiMajorAxis = (periapsis + apoapsis) / 2;
    const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - (eccentricity ** 2));

    // add distance from foci to center (e * semiMajorAxis = linear eccentricity)
    const linearEccVec = eccVec.multiply(-semiMajorAxis);
    const centerOfEllipse = bodyB.pos.add(linearEccVec);

    // find coordinates for periapsis and apoapsis
    const semiMajorAxisVec = eccVec.multiply(semiMajorAxis / eccentricity);
    const periapsisPos = centerOfEllipse.add(semiMajorAxisVec);
    const apoapsisPos = centerOfEllipse.sub(semiMajorAxisVec);

    if (drawOrbit) {
        scene.ellipse({
            pos: centerOfEllipse,
            radX: semiMajorAxis,
            radY: semiMinorAxis,
            rotation: eccVec.angle(),
            fill: false,
            stroke: true,
            strokeColor: `rgba(255, 255, 255, ${opacity})`,
        });

        // draw periapsis
        
        if (eccentricity < 1) {
            const dotSize = Math.min(6 / scene.camera.zoom, 50000);
            scene.circle(periapsisPos, dotSize, '#ff777799');
            scene.circle(apoapsisPos, dotSize, '#7777ff99');
        }
    }


    return {
        trueAnomaly,
        eccentricity,
        periapsis,
        apoapsis,
    };
}
