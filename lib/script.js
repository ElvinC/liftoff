"use strict";

var _vector = require("./vector");

var _scene = require("./scene");

var _shapes = require("./shapes");

// one function for requesting animation frame
window.requestAnimFrame = function animationFrame()
/* callback */
{
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function nextFrameCallback(cb) {
    window.setTimeout(cb, 1000 / 60);
  };
}();
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


var spriteList = [];
var scene = null;
var glider = null; // const floor = null;

function draw() {
  scene.clear();

  for (var i = 0; i < spriteList.length; i++) {
    scene.drawSprite(spriteList[i]);
    spriteList[i].simulateFrame();
  } // move camera towards player


  var cameraSmooth = Math.min(0.04 + glider.vel.length() / 600, 1);

  var Delta = _vector.Vector.sub(glider.pos, scene.camera.pos);

  scene.camera.pos.addInPlace(Delta.multiply(cameraSmooth)); // move 'ground' to player's x-coordinates
  // floor.pos.x = glider.pos.x;

  $('#speed').html(Math.round(glider.vel.length()));
  $('#altitude').html(Math.round(600 - glider.pos.y));
  window.requestAnimFrame(draw);
}

function init() {
  scene = new _scene.Scene('canvas');
  window.scene = scene;
  scene.camera.zoom = 0.8; // scene.camera.pos.set(0, -1000);

  for (var i = 0; i < 300; i++) {
    var randX = 20000 * (Math.random() - 0.5);
    var randY = 15000 * (Math.random() - 1);
    var newBall = new _shapes.Circle(randX, randY, 10, '#0066ff');
    spriteList.push(newBall);
  }

  var radP = 1000;
  var planet = new _shapes.Circle(0, radP + 600, radP, '#00ff00');
  spriteList.push(planet);
  glider = new _shapes.Rocket(new _vector.Vector2D(0, 0), new _vector.Vector2D(0, 0), 1, 0);
  spriteList.push(glider); // floor = new Rectangle(0, 620, 10000, 20, 0, '#333333', 0, 0);
  // spriteList.push(floor);

  $(window).bind('mousewheel', function (e) {
    // console.log(e.originalEvent.wheelDelta)
    var changeAmount = Math.min(0.01, 1 + e.originalEvent.wheelDelta / 1000);
    scene.camera.zoom *= changeAmount;
  });
  window.requestAnimFrame(draw);
}

$(window).ready(function () {
  init();
});
//# sourceMappingURL=script.js.map