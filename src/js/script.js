import { Vec2, Vector as Vec } from './vector';
import { Scene } from './scene';
import { Circle } from './shapes';
import { Planet } from './sprites/planet';
import { Rocket } from './rocketParts/rocket';
import { engineFromPreset } from './rocketParts/rocketPresets';

window.stepSize = 1 / 60;

// one function for requesting animation frame
window.requestAnimFrame = ((function animationFrame(/* callback */) {
    return window.requestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.oRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function nextFrameCallback(cb) {
        window.setTimeout(cb, 1000 / 60);
    };
})());

/*
function simulateObjects(objList) {
    for (let i = 0; i < objList.length; i++) {
        objList[i].simulateFrame();
    }
}

function drawObjects(objList, context) {
    for (let i = 0; i < objList.length; i++) {
        objList[i].drawMe(context);
    }
}
*/

const spriteList = [];
const trailList = [];
const planetList = [];

let scene = null;
let mainRocket = null;

let counter = 0;
let clock = 0;
// const floor = null;


function draw() {
    counter += 1;
    scene.clear();

    if (counter % 5 === 0) {
        trailList.push(new Circle(mainRocket.pos.x, mainRocket.pos.y, 0.5, '#ffffff77', 0, 0));
        trailList[1].color = '#ffffff11';
        trailList[2].color = '#ffffff22';
        trailList[3].color = '#ffffff33';
        trailList[4].color = '#ffffff44';
        trailList[5].color = '#ffffff55';
        trailList[6].color = '#ffffff66';
        trailList.shift();
    }

    for (let i = 0; i < trailList.length; i++) {
        scene.drawSprite(trailList[i]);
    }

    for (let i = 0; i < spriteList.length; i++) {
        scene.drawSprite(spriteList[i]);
        spriteList[i].simulateFrame(window.stepSize);
    }

    // increment time counter
    clock += window.stepSize;

    // move camera towards player
    const cameraSmooth = Math.min(0.04 + mainRocket.vel.length() / 600, 1);
    const Delta = Vec.sub(mainRocket.pos, scene.camera.pos);
    scene.camera.pos.addInPlace(Delta.multiply(cameraSmooth));

    // move 'ground' to player's x-coordinates
    // floor.pos.x = mainRocket.pos.x;
    const pRad = planetList[0].radius;
    $('#clock').html(Math.round(clock * 10) / 10);
    $('#speed').html(Math.round(mainRocket.vel.length()));
    $('#distance').html(Math.round((mainRocket.pos.sub(planetList[0].pos).length() - planetList[0].radius) * 100) / 100);
    $('#eccentricity').html(Math.round(mainRocket.orbitalParams.eccentricity * 100) / 100);
    $('#apoapsis').html(Math.round((mainRocket.orbitalParams.apoapsis - pRad) * 100) / 100);
    $('#periapsis').html(Math.round((mainRocket.orbitalParams.periapsis - pRad) * 100) / 100);
    $('#trueAnomaly').html(Math.round(mainRocket.orbitalParams.trueAnomaly * 100) / 100);
    window.requestAnimFrame(draw);
}

function init() {
    scene = new Scene('canvas');
    window.scene = scene;
    scene.camera.zoom = 8;
    // scene.camera.pos.set(0, -1000);

    $('#simSpeed').change(() => {
        window.stepSize = $('#simSpeed').val() / 60;
    });


    const radP = 6371000;

    for (let i = 0; i < 500; i++) {
        const randX = 100000000 * (Math.random() - 0.5);
        const randY = 100000000 * (Math.random() - 0.5) + 6371000 + 10;
        const newBall = new Circle(randX, randY, 100 + Math.random() * 1500000 + 100000, '#444');
        spriteList.push(newBall);
    }/*
    for (let i = 0; i < 500; i++) {
        const randX = 100000 * (Math.random() - 0.5);
        const randY = 100000 * (Math.random() - 0.5) + 10000 + 10;
        const newBall = new Circle(randX, randY, Math.random() * 400, '#778899');
        spriteList.push(newBall);
    }
*/
    // const mainPlanet = new Planet(0, radP + 10, radP, '#539bc1', 100, 1000000000);
    const mainPlanet = new Planet(0, radP + 10, radP, '#539bc1', 100000, null, 3.986e+14);
    spriteList.push(mainPlanet);
    planetList.push(mainPlanet);

    // create a rocket
    const newEngine = engineFromPreset('merlin1D', 'f9stage1', 9, false);
    //  // mass of F9FT: 549054
    mainRocket = new Rocket(new Vec2(0, 0), new Vec2(0, 0), 400000, -Math.PI / 2, planetList, newEngine);
    window.rocket = mainRocket; // for debugging
    spriteList.push(mainRocket);

    for (let i = 0; i < 20; i++) {
        trailList.push(new Circle(mainRocket.pos.x, mainRocket.pos.y, 0.5, '#ffffff77', 0, 0));
    }

    // floor = new Rectangle(0, 620, 10000, 20, 0, '#333333', 0, 0);
    // spriteList.push(floor);


    $(window).bind('mousewheel', (e) => {
        const changeAmount = Math.max(0.01, 1 + e.originalEvent.wheelDelta / 1000);
        scene.camera.zoom *= changeAmount;
    });


    window.requestAnimFrame(draw);
}


$(window).ready(() => {
    init();
});
