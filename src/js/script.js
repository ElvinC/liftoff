import { Vector2D as Vec2, Vector as Vec } from './vector';
import { Scene } from './scene';
import { Circle, Planet } from './shapes';
import { Rocket } from './sprites/rocket';

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
const planetList = [];

let scene = null;
let glider = null;
// const floor = null;


function draw() {
    scene.clear();

    for (let i = 0; i < spriteList.length; i++) {
        scene.drawSprite(spriteList[i]);
        spriteList[i].simulateFrame(window.stepSize);
    }

    // move camera towards player
    const cameraSmooth = Math.min(0.04 + glider.vel.length() / 600, 1);
    const Delta = Vec.sub(glider.pos, scene.camera.pos);
    scene.camera.pos.addInPlace(Delta.multiply(cameraSmooth));

    // move 'ground' to player's x-coordinates
    // floor.pos.x = glider.pos.x;
    $('#speed').html(Math.round(glider.vel.length()));
    $('#distance').html(Math.round((glider.pos.sub(planetList[0].pos).length() - 20000) * 100) / 100);
    $('#ecc').html(Math.round(glider.eccentricity * 100) / 100);
    window.requestAnimFrame(draw);
}

function init() {
    scene = new Scene('canvas');
    window.scene = scene;
    scene.camera.zoom = 8;
    // scene.camera.pos.set(0, -1000);


    const radP = 25000;

    for (let i = 0; i < 500; i++) {
        const randX = 100000 * (Math.random() - 0.5);
        const randY = 100000 * (Math.random() - 0.5) + 10000 + 10;
        const newBall = new Circle(randX, randY, 100 + Math.random() * 1000, '#666688');
        spriteList.push(newBall);
    }
    for (let i = 0; i < 500; i++) {
        const randX = 100000 * (Math.random() - 0.5);
        const randY = 100000 * (Math.random() - 0.5) + 10000 + 10;
        const newBall = new Circle(randX, randY, Math.random() * 400, '#778899');
        spriteList.push(newBall);
    }

    const mainPlanet = new Planet(0, radP + 10, radP, '#539bc1', 100, 1000000000);
    spriteList.push(mainPlanet);
    planetList.push(mainPlanet);


    glider = new Rocket(new Vec2(0, 0), new Vec2(0, 0), 1000, -Math.PI / 2, planetList);
    spriteList.push(glider);

    // floor = new Rectangle(0, 620, 10000, 20, 0, '#333333', 0, 0);
    // spriteList.push(floor);


    $(window).bind('mousewheel', (e) => {
        // console.log(e.originalEvent.wheelDelta)
        const changeAmount = Math.max(0.01, 1 + e.originalEvent.wheelDelta / 1000);
        scene.camera.zoom *= changeAmount;
    });


    window.requestAnimFrame(draw);
}


$(window).ready(() => {
    init();
});
