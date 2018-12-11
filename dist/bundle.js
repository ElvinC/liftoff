/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/script.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/js/scene.js":
/*!*************************!*\
  !*** ./src/js/scene.js ***!
  \*************************/
/*! exports provided: Scene */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Scene\", function() { return Scene; });\n/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vector */ \"./src/js/vector.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n\nvar Scene =\n/*#__PURE__*/\nfunction () {\n  function Scene(canvasId) {\n    _classCallCheck(this, Scene);\n\n    this.canvas = document.getElementById(canvasId); // set initial size\n\n    this.canvas.height = $(window).height();\n    this.canvas.width = $(window).width();\n    this.canvasSize = new _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector2D\"](this.canvas.width, this.canvas.height);\n\n    var _self = this; // automatic resize\n\n\n    $(window).resize(function () {\n      _self.canvas.height = $(window).height();\n      _self.canvas.width = $(window).width();\n\n      _self.canvasSize.set(_self.canvas.width, _self.canvas.height);\n    });\n    this.ctx = this.canvas.getContext('2d');\n    this.camera = {\n      pos: new _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector2D\"](0, 0),\n      zoom: 1\n    };\n  }\n\n  _createClass(Scene, [{\n    key: \"clear\",\n    value: function clear() {\n      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);\n    }\n  }, {\n    key: \"drawSprite\",\n    value: function drawSprite(sprite) {\n      sprite.drawMe(this);\n    }\n    /**\n     * Convert to scene coordinates\n     * @param {Vec2} pos coordinates\n     * @returns {Vec2}\n     */\n\n  }, {\n    key: \"calculateCoords\",\n    value: function calculateCoords(pos) {\n      // calculate coordinates based on camera position\n      var newPos = pos.sub(this.camera.pos).multiply(this.camera.zoom);\n      newPos = newPos.add(this.canvasSize.divide(2));\n      return newPos;\n    }\n  }, {\n    key: \"fillAndClose\",\n    value: function fillAndClose(color) {\n      this.ctx.fillStyle = color;\n      this.ctx.fill();\n      this.ctx.lineWidth = 2;\n      this.ctx.strokeStyle = '#555';\n      this.ctx.stroke();\n      this.ctx.closePath();\n      this.ctx.setTransform(1, 0, 0, 1, 0, 0);\n    } // Draw a circle with the given position, radius and color\n\n  }, {\n    key: \"circle\",\n    value: function circle(pos, radius) {\n      var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '#000000';\n      // console.log(pos instanceof Vec2)\n      var posVec = _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].toVector(pos);\n      var newPos = this.calculateCoords(posVec);\n      this.ctx.beginPath();\n      this.ctx.arc(newPos.x, newPos.y, radius * this.camera.zoom, 0, 2 * Math.PI, false);\n      this.fillAndClose(color);\n    }\n    /**\n     * Draw a rectangle\n     * @param {Vec2} pos Position\n     * @param {Number} width Width of rectangle\n     * @param {Number} height Height of rectangle\n     * @param {Number} rotation Angle\n     * @param {String} color Hex color\n     * @param {Vec2} offset Drawing offset\n     */\n\n  }, {\n    key: \"rect\",\n    value: function rect(pos, width, height) {\n      var rotation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;\n      var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '#000000';\n      var offset = arguments.length > 5 ? arguments[5] : undefined;\n      var newPos = this.calculateCoords(pos);\n      var newWidth = width * this.camera.zoom;\n      var newHeight = height * this.camera.zoom;\n      this.ctx.beginPath();\n      this.ctx.translate(newPos.x, newPos.y);\n      this.ctx.rotate(rotation);\n\n      if (offset) {\n        // with offset\n        var scaledOffset = offset.multiply(this.camera.zoom);\n        this.ctx.rect(-newWidth / 2 + scaledOffset.x, -newHeight / 2 + scaledOffset.y, newWidth, newHeight);\n      } else {\n        this.ctx.rect(-newWidth / 2, -newHeight / 2, newWidth, newHeight);\n      }\n\n      this.fillAndClose(color);\n    }\n    /**\n     * Draws a vector\n     * @param {Vec2} pos start of vector\n     * @param {Vec2} theVector\n     */\n\n  }, {\n    key: \"drawVector\",\n    value: function drawVector(pos, theVector) {\n      // draw a dot, center of mass.\n      this.circle(pos, 1, '#000000');\n      var newStart = this.calculateCoords(pos);\n      var newStop = this.calculateCoords(_vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].add(pos, theVector));\n      this.ctx.beginPath();\n      this.ctx.moveTo(newStart.x, newStart.y);\n      this.ctx.lineTo(newStop.x, newStop.y);\n      this.ctx.lineWidth = 1;\n      this.ctx.strokeStyle = '#555';\n      this.ctx.stroke();\n    }\n  }]);\n\n  return Scene;\n}();\n\n//# sourceURL=webpack:///./src/js/scene.js?");

/***/ }),

/***/ "./src/js/script.js":
/*!**************************!*\
  !*** ./src/js/script.js ***!
  \**************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vector */ \"./src/js/vector.js\");\n/* harmony import */ var _scene__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./scene */ \"./src/js/scene.js\");\n/* harmony import */ var _shapes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./shapes */ \"./src/js/shapes.js\");\n\n\n // one function for requesting animation frame\n\nwindow.requestAnimFrame = function animationFrame()\n/* callback */\n{\n  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function nextFrameCallback(cb) {\n    window.setTimeout(cb, 1000 / 60);\n  };\n}();\n/*\nfunction simulateObjects(objList) {\n    for (let i = 0; i < objList.length; i++) {\n        objList[i].simulateFrame();\n    }\n}\n\nfunction drawObjects(objList, context) {\n    for (let i = 0; i < objList.length; i++) {\n        objList[i].drawMe(context);\n    }\n}\n*/\n\n\nvar spriteList = [];\nvar scene = null;\nvar glider = null;\nvar planet = null; // const floor = null;\n\nfunction draw() {\n  scene.clear();\n\n  for (var i = 0; i < spriteList.length; i++) {\n    scene.drawSprite(spriteList[i]);\n    spriteList[i].simulateFrame();\n  } // move camera towards player\n\n\n  var cameraSmooth = Math.min(0.04 + glider.vel.length() / 600, 1);\n  var Delta = _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].sub(glider.pos, scene.camera.pos);\n  scene.camera.pos.addInPlace(Delta.multiply(cameraSmooth)); // move 'ground' to player's x-coordinates\n  // floor.pos.x = glider.pos.x;\n\n  $('#speed').html(Math.round(glider.vel.length()));\n  $('#distance').html(Math.round(glider.pos.sub(planet.pos).length()));\n  window.requestAnimFrame(draw);\n}\n\nfunction init() {\n  scene = new _scene__WEBPACK_IMPORTED_MODULE_1__[\"Scene\"]('canvas');\n  window.scene = scene;\n  scene.camera.zoom = 0.8; // scene.camera.pos.set(0, -1000);\n\n  for (var i = 0; i < 300; i++) {\n    var randX = 20000 * (Math.random() - 0.5);\n    var randY = 15000 * (Math.random() - 1);\n    var newBall = new _shapes__WEBPACK_IMPORTED_MODULE_2__[\"Circle\"](randX, randY, 10, '#0066ff');\n    spriteList.push(newBall);\n  }\n\n  var radP = 1000;\n  planet = new _shapes__WEBPACK_IMPORTED_MODULE_2__[\"Circle\"](0, radP + 600, radP, '#00ff00');\n  spriteList.push(planet);\n  glider = new _shapes__WEBPACK_IMPORTED_MODULE_2__[\"Rocket\"](new _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector2D\"](0, 0), new _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector2D\"](0, 0), 1, 0);\n  spriteList.push(glider); // floor = new Rectangle(0, 620, 10000, 20, 0, '#333333', 0, 0);\n  // spriteList.push(floor);\n\n  $(window).bind('mousewheel', function (e) {\n    // console.log(e.originalEvent.wheelDelta)\n    var changeAmount = Math.max(0.01, 1 + e.originalEvent.wheelDelta / 1000);\n    scene.camera.zoom *= changeAmount;\n  });\n  window.requestAnimFrame(draw);\n}\n\n$(window).ready(function () {\n  init();\n});\n\n//# sourceURL=webpack:///./src/js/script.js?");

/***/ }),

/***/ "./src/js/shapes.js":
/*!**************************!*\
  !*** ./src/js/shapes.js ***!
  \**************************/
/*! exports provided: Rocket, Circle, Rectangle */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Rocket\", function() { return Rocket; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Circle\", function() { return Circle; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Rectangle\", function() { return Rectangle; });\n/* harmony import */ var _vector__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./vector */ \"./src/js/vector.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\n // import { Scene } from './scene';\n\nvar Rocket =\n/*#__PURE__*/\nfunction () {\n  /**\n   * @constructor\n   * @param {Vec2} pos Starting position\n   * @param {Vec2} vel Starting velocity\n   * @param {Number} mass mass\n   * @param {Number} angle angle in radians\n   */\n  function Rocket(pos, vel, mass, angle) {\n    _classCallCheck(this, Rocket);\n\n    this.pos = _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].toVector(pos);\n    this.vel = _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].toVector(vel);\n    this.acc = new _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector2D\"](0, 0);\n    this.thrust = 0; // thrust in radial direction\n\n    this.thrustChange = 0;\n    this.mass = mass;\n    this.angle = angle;\n    this.angularVel = 0;\n    this.angularAcc = 0; // settings\n\n    this.minThrust = 0;\n    this.maxThrust = 0.3;\n    this.dragCoefficient = 0; // 0.00003;\n\n    var _self = this;\n\n    $(window).keydown(function (e) {\n      switch (e.which) {\n        // left/right\n        case 37:\n          _self.angularAcc = -0.001;\n          break;\n\n        case 39:\n          _self.angularAcc = 0.001;\n          break;\n        // up/down\n\n        case 38:\n          _self.thrustChange = 0.005;\n          break;\n\n        case 40:\n          _self.thrustChange = -0.005;\n          break;\n\n        default:\n          break;\n      }\n    });\n    $(window).keyup(function (e) {\n      switch (e.which) {\n        // left/right\n        case 37:\n          _self.angularAcc = 0;\n          break;\n\n        case 39:\n          _self.angularAcc = 0;\n          break;\n        // up/down\n\n        case 38:\n          _self.thrustChange = 0;\n          break;\n\n        case 40:\n          _self.thrustChange = 0;\n          break;\n\n        default:\n          break;\n      }\n    });\n  }\n  /**\n   *\n   * @param {Scene} scene Scene to draw the shape\n   */\n\n\n  _createClass(Rocket, [{\n    key: \"drawMe\",\n    value: function drawMe(scene) {\n      var fireLength = this.thrust * 300;\n      scene.rect(this.pos, fireLength, 3, this.angle, '#ff0000', new _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector2D\"](-30 - fireLength / 2, 0));\n      scene.rect(this.pos, 60, 14, this.angle, '#ffffff'); // draw velocity vector\n\n      scene.drawVector(this.pos, this.vel.multiply(2));\n    }\n  }, {\n    key: \"simulateFrame\",\n    value: function simulateFrame() {\n      // update angle\n      this.angularVel += this.angularAcc;\n      this.angle += this.angularVel; // Update thrust\n\n      this.thrust += this.thrustChange;\n      this.thrust = Math.min(this.maxThrust, Math.max(this.minThrust, this.thrust)); // limit\n      // FORCES\n\n      var sumForces = new _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector2D\"](0, 0); // Thrust force\n\n      var thrustForce = _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].unit(this.angle, this.thrust); // In the radial direction\n\n      sumForces.addInPlace(thrustForce); // add thrust force\n      // drag\n\n      var velUnit = this.vel.unit();\n      var drag = velUnit.multiply(-this.vel.lengthSquared() * this.dragCoefficient); // Cd*v^2 in opposite direction\n\n      sumForces.addInPlace(drag); // gravity\n      // sumForces.y += 0.05;\n\n      var planet = new _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector2D\"](0, 1000 + 600);\n      var rVec = _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].sub(planet, this.pos);\n      var rLenSqrd = rVec.lengthSquared();\n      var mPlanet = 10000;\n      var gravity = rVec.unit(mPlanet / rLenSqrd);\n      sumForces.addInPlace(gravity); // update position and velocity\n\n      var newAcc = sumForces.divide(this.mass);\n      this.vel.addInPlace(newAcc); // update velocity\n\n      this.pos.addInPlace(this.vel); // update position\n      // bounce\n\n      /*\n      if (this.pos.y > 600) {\n          this.vel.y = -Math.abs(this.vel.y) * 0.2\n          this.pos.y = 600;\n      } */\n\n      /*\n      if (this.pos.x > 3000) {\n      this.pos.x = -3000;\n      } */\n    }\n  }]);\n\n  return Rocket;\n}();\nvar Circle =\n/*#__PURE__*/\nfunction () {\n  /**\n   *\n   * @param {Number} x\n   * @param {Number} y\n   * @param {Number} radius\n   * @param {String} color\n   * @param {Number} mass\n   * @param {Number} restitution\n   */\n  function Circle(x, y, radius) {\n    var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#000000';\n    var mass = arguments.length > 4 ? arguments[4] : undefined;\n    var restitution = arguments.length > 5 ? arguments[5] : undefined;\n\n    _classCallCheck(this, Circle);\n\n    this.color = color;\n    this.radius = radius;\n    this.pos = new _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector2D\"](x, y);\n    this.speed = new _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector2D\"](0, 0);\n    this.restitution = restitution;\n    this.mass = mass;\n    this.inv_mass = 1 / mass; // change position of rectangle\n  }\n\n  _createClass(Circle, [{\n    key: \"changePos\",\n    value: function changePos(x, y) {\n      var change = new _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector2D\"](x, y);\n      this.pos = _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].add(this.pos, change);\n    }\n  }, {\n    key: \"simulateFrame\",\n    value: function simulateFrame() {\n      /*\n      this.changePos(this.speed.x, this.speed.y);\n      this.speed = vec.add(this.speed, new Vec2(0, 1))\n      if (this.pos.x + this.radius > canvas.width) {\n      this.speed.x = -(Math.abs(this.speed.x));\n      }\n      if (this.pos.x - this.radius < 0) {\n      this.speed.x = Math.abs(this.speed.x);\n      }\n      else if (this.pos.y + this.radius > canvas.height) {\n      //this.speed.y = Math.min(-(Math.abs(this.speed.y)) * 0.6, -Math.random()*25);\n      this.speed.y = -(Math.abs(this.speed.y)) * 0.6\n      //this.speed.x = this.speed.x * 0.6 + ((Math.random()-0.5)*20);\n      this.speed.x = this.speed.x;\n      this.changePos(0, canvas.height - (this.pos.y + this.radius));\n      }\n      else if (this.pos.y - this.radius < 0) {\n      this.speed.y = Math.abs(this.speed.y);\n      }*/\n    }\n  }, {\n    key: \"drawMe\",\n    value: function drawMe(scene) {\n      scene.circle(this.pos, this.radius, this.color);\n    }\n  }]);\n\n  return Circle;\n}();\nvar Rectangle =\n/*#__PURE__*/\nfunction () {\n  function Rectangle(x, y, width, height, rotation) {\n    var color = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '#000000';\n    var mass = arguments.length > 6 ? arguments[6] : undefined;\n    var restitution = arguments.length > 7 ? arguments[7] : undefined;\n\n    _classCallCheck(this, Rectangle);\n\n    // center i at the center of mass\n    this.color = color;\n    this.width = width;\n    this.height = height;\n    this.rotation = rotation;\n    this.pos = new _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector2D\"](x, y);\n    this.speed = new _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector2D\"](5, 0);\n    this.restitution = restitution;\n    this.mass = mass;\n    this.inv_mass = 1 / mass;\n  } // change position of rectangle\n\n\n  _createClass(Rectangle, [{\n    key: \"changePos\",\n    value: function changePos(x, y) {\n      var change = new _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector2D\"](x, y);\n      this.pos = _vector__WEBPACK_IMPORTED_MODULE_0__[\"Vector\"].add(this.pos, change);\n    }\n  }, {\n    key: \"simulateFrame\",\n    value: function simulateFrame() {\n      /*\n      this.changePos(this.speed.x, this.speed.y)\n      this.speed = vec.add(this.speed, new Vec2(0, 1))\n      */\n\n      /*\n      if (this.pos.x + this.radius > canvas.width) {\n          this.speed.x = -(Math.abs(this.speed.x));\n      } */\n      if (this.pos.x - this.radius < 0) {\n        this.speed.x = Math.abs(this.speed.x);\n      } else if (this.pos.y + this.radius > canvas.height) {\n        // this.speed.y = Math.min(-(Math.abs(this.speed.y)) * 0.6, -Math.random()*25);\n        this.speed.y = -Math.abs(this.speed.y) * 0.6; // this.speed.x = this.speed.x * 0.6 + ((Math.random()-0.5)*20);\n\n        this.speed.x = this.speed.x;\n        this.changePos(0, canvas.height - (this.pos.y + this.radius));\n      } else if (this.pos.y - this.radius < 0) {\n        this.speed.y = Math.abs(this.speed.y);\n      }\n    }\n  }, {\n    key: \"drawMe\",\n    value: function drawMe(scene) {\n      scene.rect(this.pos, this.width, this.height, this.rotation, this.color);\n    }\n  }]);\n\n  return Rectangle;\n}();\n\n//# sourceURL=webpack:///./src/js/shapes.js?");

/***/ }),

/***/ "./src/js/vector.js":
/*!**************************!*\
  !*** ./src/js/vector.js ***!
  \**************************/
/*! exports provided: Vector2D, Vector */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Vector2D\", function() { return Vector2D; });\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Vector\", function() { return Vector; });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }\n\nvar Vector2D =\n/*#__PURE__*/\nfunction () {\n  function Vector2D(x, y) {\n    _classCallCheck(this, Vector2D);\n\n    this.x = x;\n    this.y = y;\n  }\n\n  _createClass(Vector2D, [{\n    key: \"set\",\n    value: function set(x, y) {\n      this.x = x;\n      this.y = y;\n    }\n  }, {\n    key: \"lengthSquared\",\n    value: function lengthSquared() {\n      // console.log(this.x)\n      return Math.pow(this.x, 2) + Math.pow(this.y, 2);\n    }\n    /**\n     * @returns {Vector2D}\n     */\n\n  }, {\n    key: \"length\",\n    value: function length() {\n      return Math.hypot(this.x, this.y);\n    }\n    /**\n     * Unit vector in the same direction\n     * @param {Number} length\n     * @returns {Vector2D}\n     */\n\n  }, {\n    key: \"unit\",\n    value: function unit() {\n      var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;\n      var vecLength = this.length();\n\n      if (vecLength === 0) {\n        // no length, return vector with angle 0\n        return new Vector2D(1 * length, 0);\n      }\n\n      return this.multiply(length / vecLength);\n    }\n    /**\n     * vector division\n     * @returns {Vector2D}\n     */\n\n  }, {\n    key: \"divide\",\n    value: function divide(d) {\n      return new Vector2D(this.x / d, this.y / d);\n    } // vector multiplication\n\n  }, {\n    key: \"multiply\",\n    value: function multiply(m) {\n      return new Vector2D(this.x * m, this.y * m);\n    }\n  }, {\n    key: \"add\",\n    value: function add(b) {\n      return new Vector2D(this.x + b.x, this.y + b.y);\n    }\n    /**\n     * Add another vector in place.\n     * @param {Vector2D} b Another vector\n     */\n\n  }, {\n    key: \"addInPlace\",\n    value: function addInPlace(b) {\n      this.x += b.x;\n      this.y += b.y;\n    } // this - vector b\n\n  }, {\n    key: \"sub\",\n    value: function sub(b) {\n      return new Vector2D(this.x - b.x, this.y - b.y);\n    }\n  }, {\n    key: \"dot\",\n    value: function dot(b) {\n      return this.x * b.x + this.y * b.y;\n    }\n  }, {\n    key: \"print\",\n    value: function print() {\n      console.log(\"\".concat(this.x, \", \").concat(this.y));\n    }\n  }]);\n\n  return Vector2D;\n}();\nvar Vector = {\n  add: function add(a, b) {\n    return new Vector2D(a.x + b.x, a.y + b.y);\n  },\n  sub: function sub(a, b) {\n    return new Vector2D(a.x - b.x, a.y - b.y);\n  },\n  dot: function dot(a, b) {\n    return a.x * b.x + a.y * b.y;\n  },\n  toVector: function toVector(obj) {\n    if (obj instanceof Vector2D) {\n      return obj;\n    }\n\n    return new Vector2D(obj[0], obj[1]);\n  },\n\n  /**\n   * Generate a unit vector\n   * @param {Number} angle In radians\n   * @param {Number} length Length of vector\n   */\n  unit: function unit(angle) {\n    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;\n    return new Vector2D(length * Math.cos(angle), length * Math.sin(angle));\n  }\n};\n\n//# sourceURL=webpack:///./src/js/vector.js?");

/***/ })

/******/ });