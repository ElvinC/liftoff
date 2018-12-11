"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Vector = exports.Vector2D = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Vector2D =
/*#__PURE__*/
function () {
  function Vector2D(x, y) {
    _classCallCheck(this, Vector2D);

    this.x = x;
    this.y = y;
  }

  _createClass(Vector2D, [{
    key: "set",
    value: function set(x, y) {
      this.x = x;
      this.y = y;
    }
  }, {
    key: "lengthSquared",
    value: function lengthSquared() {
      // console.log(this.x)
      return Math.pow(this.x, 2) + Math.pow(this.y, 2);
    }
    /**
     * @returns {Vector2D}
     */

  }, {
    key: "length",
    value: function length() {
      return Math.hypot(this.x, this.y);
    }
    /**
     * Unit vector in the same direction
     * @param {Number} length
     * @returns {Vector2D}
     */

  }, {
    key: "unit",
    value: function unit() {
      var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var vecLength = this.length();

      if (vecLength === 0) {
        // no length, return vector with angle 0
        return new Vector2D(1 * length, 0);
      }

      return this.multiply(length / vecLength);
    }
    /**
     * vector division
     * @returns {Vector2D}
     */

  }, {
    key: "divide",
    value: function divide(d) {
      return new Vector2D(this.x / d, this.y / d);
    } // vector multiplication

  }, {
    key: "multiply",
    value: function multiply(m) {
      return new Vector2D(this.x * m, this.y * m);
    }
  }, {
    key: "add",
    value: function add(b) {
      return new Vector2D(this.x + b.x, this.y + b.y);
    }
    /**
     * Add another vector in place.
     * @param {Vector2D} b Another vector
     */

  }, {
    key: "addInPlace",
    value: function addInPlace(b) {
      this.x += b.x;
      this.y += b.y;
    } // this - vector b

  }, {
    key: "sub",
    value: function sub(b) {
      return new Vector2D(this.x - b.x, this.y - b.y);
    }
  }, {
    key: "dot",
    value: function dot(b) {
      return this.x * b.x + this.y * b.y;
    }
  }, {
    key: "print",
    value: function print() {
      console.log("".concat(this.x, ", ").concat(this.y));
    }
  }]);

  return Vector2D;
}();

exports.Vector2D = Vector2D;
var Vector = {
  add: function add(a, b) {
    return new Vector2D(a.x + b.x, a.y + b.y);
  },
  sub: function sub(a, b) {
    return new Vector2D(a.x - b.x, a.y - b.y);
  },
  dot: function dot(a, b) {
    return a.x * b.x + a.y * b.y;
  },
  toVector: function toVector(obj) {
    if (obj instanceof Vector2D) {
      return obj;
    }

    return new Vector2D(obj[0], obj[1]);
  },

  /**
   * Generate a unit vector
   * @param {Number} angle In radians
   * @param {Number} length Length of vector
   */
  unit: function unit(angle) {
    var length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
    return new Vector2D(length * Math.cos(angle), length * Math.sin(angle));
  }
};
exports.Vector = Vector;
//# sourceMappingURL=vector.js.map