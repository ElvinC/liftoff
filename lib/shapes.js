"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Rectangle = exports.Circle = exports.Rocket = void 0;

var _vector = require("./vector");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// import { Scene } from './scene';
var Rocket =
/*#__PURE__*/
function () {
  /**
   * @constructor
   * @param {Vec2} pos Starting position
   * @param {Vec2} vel Starting velocity
   * @param {Number} mass mass
   * @param {Number} angle angle in radians
   */
  function Rocket(pos, vel, mass, angle) {
    _classCallCheck(this, Rocket);

    this.pos = _vector.Vector.toVector(pos);
    this.vel = _vector.Vector.toVector(vel);
    this.acc = new _vector.Vector2D(0, 0);
    this.thrust = 0; // thrust in radial direction

    this.thrustChange = 0;
    this.mass = mass;
    this.angle = angle;
    this.angularVel = 0;
    this.angularAcc = 0; // settings

    this.minThrust = 0;
    this.maxThrust = 0.3;
    this.dragCoefficient = 0; // 0.00003;

    var _self = this;

    $(window).keydown(function (e) {
      switch (e.which) {
        // left/right
        case 37:
          _self.angularAcc = -0.001;
          break;

        case 39:
          _self.angularAcc = 0.001;
          break;
        // up/down

        case 38:
          _self.thrustChange = 0.005;
          break;

        case 40:
          _self.thrustChange = -0.005;
          break;

        default:
          break;
      }
    });
    $(window).keyup(function (e) {
      switch (e.which) {
        // left/right
        case 37:
          _self.angularAcc = 0;
          break;

        case 39:
          _self.angularAcc = 0;
          break;
        // up/down

        case 38:
          _self.thrustChange = 0;
          break;

        case 40:
          _self.thrustChange = 0;
          break;

        default:
          break;
      }
    });
  }
  /**
   *
   * @param {Scene} scene Scene to draw the shape
   */


  _createClass(Rocket, [{
    key: "drawMe",
    value: function drawMe(scene) {
      var fireLength = this.thrust * 300;
      scene.rect(this.pos, fireLength, 3, this.angle, '#ff0000', new _vector.Vector2D(-30 - fireLength / 2, 0));
      scene.rect(this.pos, 60, 14, this.angle, '#ffffff'); // draw velocity vector

      scene.drawVector(this.pos, this.vel.multiply(2));
    }
  }, {
    key: "simulateFrame",
    value: function simulateFrame() {
      // update angle
      this.angularVel += this.angularAcc;
      this.angle += this.angularVel; // Update thrust

      this.thrust += this.thrustChange;
      this.thrust = Math.min(this.maxThrust, Math.max(this.minThrust, this.thrust)); // limit
      // FORCES

      var sumForces = new _vector.Vector2D(0, 0); // Thrust force

      var thrustForce = _vector.Vector.unit(this.angle, this.thrust); // In the radial direction


      sumForces.addInPlace(thrustForce); // add thrust force
      // drag

      var velUnit = this.vel.unit();
      var drag = velUnit.multiply(-this.vel.lengthSquared() * this.dragCoefficient); // Cd*v^2 in opposite direction

      sumForces.addInPlace(drag); // gravity
      // sumForces.y += 0.05;

      var planet = new _vector.Vector2D(0, 1000 + 600);

      var rVec = _vector.Vector.sub(planet, this.pos);

      var rLenSqrd = rVec.lengthSquared();
      var mPlanet = 10000;
      var gravity = rVec.unit(mPlanet / rLenSqrd);
      sumForces.addInPlace(gravity); // update position and velocity

      var newAcc = sumForces.divide(this.mass);
      this.vel.addInPlace(newAcc); // update velocity

      this.pos.addInPlace(this.vel); // update position
      // bounce

      /*
      if (this.pos.y > 600) {
          this.vel.y = -Math.abs(this.vel.y) * 0.2
          this.pos.y = 600;
      } */

      /*
      if (this.pos.x > 3000) {
      this.pos.x = -3000;
      } */
    }
  }]);

  return Rocket;
}();

exports.Rocket = Rocket;

var Circle =
/*#__PURE__*/
function () {
  /**
   *
   * @param {Number} x
   * @param {Number} y
   * @param {Number} radius
   * @param {String} color
   * @param {Number} mass
   * @param {Number} restitution
   */
  function Circle(x, y, radius) {
    var color = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '#000000';
    var mass = arguments.length > 4 ? arguments[4] : undefined;
    var restitution = arguments.length > 5 ? arguments[5] : undefined;

    _classCallCheck(this, Circle);

    this.color = color;
    this.radius = radius;
    this.pos = new _vector.Vector2D(x, y);
    this.speed = new _vector.Vector2D(0, 0);
    this.restitution = restitution;
    this.mass = mass;
    this.inv_mass = 1 / mass; // change position of rectangle
  }

  _createClass(Circle, [{
    key: "changePos",
    value: function changePos(x, y) {
      var change = new _vector.Vector2D(x, y);
      this.pos = _vector.Vector.add(this.pos, change);
    }
    /*
    simulateFrame() {
        this.changePos(this.speed.x, this.speed.y)
        this.speed = vec.add(this.speed, new Vec2(0, 1))
         if (this.pos.x + this.radius > canvas.width) {
            this.speed.x = -(Math.abs(this.speed.x));
    }
        if (this.pos.x - this.radius < 0) {
            this.speed.x = Math.abs(this.speed.x);
        }
        else if (this.pos.y + this.radius > canvas.height) {
            //this.speed.y = Math.min(-(Math.abs(this.speed.y)) * 0.6, -Math.random()*25);
            this.speed.y = -(Math.abs(this.speed.y)) * 0.6
            //this.speed.x = this.speed.x * 0.6 + ((Math.random()-0.5)*20);
            this.speed.x = this.speed.x;
             this.changePos(0, canvas.height - (this.pos.y + this.radius));
        }
        else if (this.pos.y - this.radius < 0) {
            this.speed.y = Math.abs(this.speed.y);
        }
    } */

  }, {
    key: "drawMe",
    value: function drawMe(scene) {
      scene.circle(this.pos, this.radius, this.color);
    }
  }]);

  return Circle;
}();

exports.Circle = Circle;

var Rectangle =
/*#__PURE__*/
function () {
  function Rectangle(x, y, width, height, rotation) {
    var color = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : '#000000';
    var mass = arguments.length > 6 ? arguments[6] : undefined;
    var restitution = arguments.length > 7 ? arguments[7] : undefined;

    _classCallCheck(this, Rectangle);

    // center i at the center of mass
    this.color = color;
    this.width = width;
    this.height = height;
    this.rotation = rotation;
    this.pos = new _vector.Vector2D(x, y);
    this.speed = new _vector.Vector2D(5, 0);
    this.restitution = restitution;
    this.mass = mass;
    this.inv_mass = 1 / mass;
  } // change position of rectangle


  _createClass(Rectangle, [{
    key: "changePos",
    value: function changePos(x, y) {
      var change = new _vector.Vector2D(x, y);
      this.pos = _vector.Vector.add(this.pos, change);
    }
  }, {
    key: "simulateFrame",
    value: function simulateFrame() {
      /*
      this.changePos(this.speed.x, this.speed.y)
      this.speed = vec.add(this.speed, new Vec2(0, 1))
      */

      /*
      if (this.pos.x + this.radius > canvas.width) {
          this.speed.x = -(Math.abs(this.speed.x));
      } */
      if (this.pos.x - this.radius < 0) {
        this.speed.x = Math.abs(this.speed.x);
      } else if (this.pos.y + this.radius > canvas.height) {
        // this.speed.y = Math.min(-(Math.abs(this.speed.y)) * 0.6, -Math.random()*25);
        this.speed.y = -Math.abs(this.speed.y) * 0.6; // this.speed.x = this.speed.x * 0.6 + ((Math.random()-0.5)*20);

        this.speed.x = this.speed.x;
        this.changePos(0, canvas.height - (this.pos.y + this.radius));
      } else if (this.pos.y - this.radius < 0) {
        this.speed.y = Math.abs(this.speed.y);
      }
    }
  }, {
    key: "drawMe",
    value: function drawMe(scene) {
      scene.rect(this.pos, this.width, this.height, this.rotation, this.color);
    }
  }]);

  return Rectangle;
}();

exports.Rectangle = Rectangle;
//# sourceMappingURL=shapes.js.map