import { Vector2D as Vec2, Vector as Vec } from './vector';
import { Scene } from './scene';
import { Circle, Rocket } from './shapes';

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

let scene = null;
let glider = null;
let planet = null;
// const floor = null;


function draw() {
    scene.clear();

    for (let i = 0; i < spriteList.length; i++) {
        scene.drawSprite(spriteList[i]);
        spriteList[i].simulateFrame();
    }

    // move camera towards player
    const cameraSmooth = Math.min(0.04 + glider.vel.length() / 600, 1);
    const Delta = Vec.sub(glider.pos, scene.camera.pos);
    scene.camera.pos.addInPlace(Delta.multiply(cameraSmooth));

    // move 'ground' to player's x-coordinates
    // floor.pos.x = glider.pos.x;
    $('#speed').html(Math.round(glider.vel.length()));
    $('#distance').html(Math.round(glider.pos.sub(planet.pos).length()));

    window.requestAnimFrame(draw);
}

function init() {
    scene = new Scene('canvas');
    window.scene = scene;
    scene.camera.zoom = 0.8;
    // scene.camera.pos.set(0, -1000);

    for (let i = 0; i < 300; i++) {
        const randX = 20000 * (Math.random() - 0.5);
        const randY = 15000 * (Math.random() - 1);
        const newBall = new Circle(randX, randY, 10, '#0066ff');
        spriteList.push(newBall);
    }

    const radP = 1000;
    planet = new Circle(0, radP + 600, radP, '#00ff00');
    spriteList.push(planet);

    glider = new Rocket(new Vec2(0, 0), new Vec2(0, 0), 1, 0);
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
