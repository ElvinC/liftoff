"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Scene = void 0;

var _vector = require("./vector");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Scene =
/*#__PURE__*/
function () {
  function Scene(canvasId) {
    _classCallCheck(this, Scene);

    this.canvas = document.getElementById(canvasId); // set initial size

    this.canvas.height = $(window).height();
    this.canvas.width = $(window).width();
    this.canvasSize = new _vector.Vector2D(this.canvas.width, this.canvas.height);

    var _self = this; // automatic resize


    $(window).resize(function () {
      _self.canvas.height = $(window).height();
      _self.canvas.width = $(window).width();

      _self.canvasSize.set(_self.canvas.width, _self.canvas.height);
    });
    this.ctx = this.canvas.getContext('2d');
    this.camera = {
      pos: new _vector.Vector2D(0, 0),
      zoom: 1
    };
  }

  _createClass(Scene, [{
    key: "clear",
    value: function clear() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }, {
    key: "drawSprite",
    value: function drawSprite(sprite) {
      sprite.drawMe(this);
    }
    /**
     * Convert to scene coordinates
     * @param {Vec2} pos coordinates
     * @returns {Vec2}
     */

  }, {
    key: "calculateCoords",
    value: function calculateCoords(pos) {
      // calculate coordinates based on camera position
      var newPos = pos.sub(this.camera.pos).multiply(this.camera.zoom);
      newPos = newPos.add(this.canvasSize.divide(2));
      return newPos;
    }
  }, {
    key: "fillAndClose",
    value: function fillAndClose(color) {
      this.ctx.fillStyle = color;
      this.ctx.fill();
      this.ctx.lineWidth = 2;
      this.ctx.strokeStyle = '#555';
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    } // Draw a circle with the given position, radius and color

  }, {
    key: "circle",
    value: function circle(pos, radius) {
      var color = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '#000000';

      // console.log(pos instanceof Vec2)
      var posVec = _vector.Vector.toVector(pos);

      var newPos = this.calculateCoords(posVec);
      this.ctx.beginPath();
      this.ctx.arc(newPos.x, newPos.y, radius * this.camera.zoom, 0, 2 * Math.PI, false);
      this.fillAndClose(color);
    }
    /**
     * Draw a rectangle
     * @param {Vec2} pos Position
     * @param {Number} width Width of rectangle
     * @param {Number} height Height of rectangle
     * @param {Number} rotation Angle
     * @param {String} color Hex color
     * @param {Vec2} offset Drawing offset
     */

  }, {
    key: "rect",
    value: function rect(pos, width, height) {
      var rotation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;
      var color = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : '#000000';
      var offset = arguments.length > 5 ? arguments[5] : undefined;
      var newPos = this.calculateCoords(pos);
      var newWidth = width * this.camera.zoom;
      var newHeight = height * this.camera.zoom;
      this.ctx.beginPath();
      this.ctx.translate(newPos.x, newPos.y);
      this.ctx.rotate(rotation);

      if (offset) {
        // with offset
        var scaledOffset = offset.multiply(this.camera.zoom);
        this.ctx.rect(-newWidth / 2 + scaledOffset.x, -newHeight / 2 + scaledOffset.y, newWidth, newHeight);
      } else {
        this.ctx.rect(-newWidth / 2, -newHeight / 2, newWidth, newHeight);
      }

      this.fillAndClose(color);
    }
    /**
     * Draws a vector
     * @param {Vec2} pos start of vector
     * @param {Vec2} theVector
     */

  }, {
    key: "drawVector",
    value: function drawVector(pos, theVector) {
      // draw a dot, center of mass.
      this.circle(pos, 1, '#000000');
      var newStart = this.calculateCoords(pos);
      var newStop = this.calculateCoords(_vector.Vector.add(pos, theVector));
      this.ctx.beginPath();
      this.ctx.moveTo(newStart.x, newStart.y);
      this.ctx.lineTo(newStop.x, newStop.y);
      this.ctx.lineWidth = 1;
      this.ctx.strokeStyle = '#555';
      this.ctx.stroke();
    }
  }]);

  return Scene;
}();

exports.Scene = Scene;
//# sourceMappingURL=scene.js.map