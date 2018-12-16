import { Vec2, Vector as Vec } from './vector';

export class Scene {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        // set initial size
        this.canvas.height = $(window).height();
        this.canvas.width = $(window).width();
        this.canvasSize = new Vec2(this.canvas.width, this.canvas.height);

        const _self = this;
        // automatic resize
        $(window).resize(() => {
            _self.canvas.height = $(window).height();
            _self.canvas.width = $(window).width();
            _self.canvasSize.set(_self.canvas.width, _self.canvas.height);
        });

        this.ctx = this.canvas.getContext('2d');

        this.camera = {
            pos: new Vec2(0, 0),
            zoom: 1,
        };
    }

    clear() {
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawSprite(sprite) {
        sprite.drawMe(this);
    }

    /**
     * Convert to scene coordinates
     * @param {Vec2} pos coordinates
     * @returns {Vec2}
     */
    calculateCoords(pos) { // calculate coordinates based on camera position
        let newPos = pos.sub(this.camera.pos).multiply(this.camera.zoom);
        newPos = newPos.add(this.canvasSize.divide(2));
        return newPos;
    }

    fillAndClose(fill, color, stroke = false, strokeColor = '#555') {
        this.ctx.fillStyle = color;
        if (fill) {
            this.ctx.fill();
        }
        if (stroke) {
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = strokeColor;
            this.ctx.stroke();
        }
        this.ctx.closePath();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }


    // Draw a circle with the given position, radius and color
    circle(pos, radius, color = '#000000', rotation = 0, offset) {
        // console.log(pos instanceof Vec2)
        const scaledRadius = radius * this.camera.zoom;
        if (scaledRadius < 0.7) { // don't render tiny primitives.
            return;
        }
        const posVec = Vec.toVector(pos);
        const newPos = this.calculateCoords(posVec);
        this.ctx.translate(newPos.x, newPos.y);

        this.ctx.beginPath();

        // with offset
        if (offset) { // with offset
            this.ctx.rotate(rotation);
            const scaledOffset = offset.multiply(this.camera.zoom);
            this.ctx.arc(scaledOffset.x, scaledOffset.y, scaledRadius, 0, 2 * Math.PI, false);
        } else {
            this.ctx.arc(0, 0, scaledRadius, 0, 2 * Math.PI, false);
        }

        this.fillAndClose(true, color);
    }

    /**
     * Draw a rectangle
     * @param {Vec2} pos Position
     * @param {Number} width Width of rectangle
     * @param {Number} height Height of rectangle
     * @param {Number} rotation Angle
     * @param {String} color Hex color
     * @param {Vec2} offset Drawing offset
     * @param {Boolean} stroke Draw stroke
     */
    rect(pos, width, height, rotation = 0, color = '#000000', offset, stroke = false, fill = true) {
        const newPos = this.calculateCoords(pos);

        const newWidth = width * this.camera.zoom;
        const newHeight = height * this.camera.zoom;


        this.ctx.beginPath();
        this.ctx.translate(newPos.x, newPos.y);
        this.ctx.rotate(rotation);

        if (offset) { // with offset
            const scaledOffset = offset.multiply(this.camera.zoom);
            this.ctx.rect(-newWidth / 2 + scaledOffset.x, -newHeight / 2 + scaledOffset.y, newWidth, newHeight);
        } else {
            this.ctx.rect(-newWidth / 2, -newHeight / 2, newWidth, newHeight);
        }

        this.fillAndClose(fill, color, stroke);
    }

    /**
     * Draw a radial gradient
     * @param {Vec2} pos position
     * @param {Number} startRadius Start radius of gradient
     * @param {Number} stopRadius End radius of gradient
     * @param {Object} param Color settings
     * @param {String} startColor Start color of gradient
     * @param {String} stopColor Stop color of gradient
     */
    circleGradient(pos, startRadius, stopRadius, {
        startColor = 'rgba(170, 170, 255, 0.6)',
        stopColor = 'rgba(255, 255, 255, 0)',
    } = {}) {
        // const newPos = this.calculateCoords(pos);
        const newStartRadius = startRadius * this.camera.zoom;
        const newStopRadius = stopRadius * this.camera.zoom;
        const grd = this.ctx.createRadialGradient(0, 0, newStartRadius, 0, 0, newStopRadius);
        grd.addColorStop(0, startColor);
        grd.addColorStop(1, stopColor);
        this.circle(pos, stopRadius, grd);
    }

    /**
     * Generate an ellipse
     * @param {Object} conf The settings
     * @param {Vec2} conf.pos Position vector
     * @param {Number} conf.radX Minor radius
     * @param {Number} conf.ranY Major radius
     * @param {Number} conf.rotation Rotation in radians
     * @param {String} conf.color Color of the ellipse
     * @param {Number} conf.startAngle Starting angle in radians
     * @param {Number} conf.endAngle Ending angle in radians
     * @param {Vec2} conf.offset offset vector
     * @param {Boolean} stroke add outline
     */
    ellipse({
        pos,
        radX = 5,
        radY = 2,
        rotation = 0,
        color = '#000000',
        startAngle = 0,
        endAngle = 2 * Math.PI,
        offset,
        stroke = false,
        strokeColor = '#000000',
        fill = true,
    } = {}) {
        const newPos = this.calculateCoords(pos);

        const newRadX = radX * this.camera.zoom;
        const newRadY = radY * this.camera.zoom;


        this.ctx.beginPath();
        this.ctx.translate(newPos.x, newPos.y);
        // this.ctx.rotate(rotation);

        if (offset) { // with offset
            const newOffset = offset.multiply(this.camera.zoom);
            this.ctx.ellipse(newOffset.x, newOffset.x, newRadX, newRadY, rotation, startAngle, endAngle);
        } else {
            this.ctx.ellipse(0, 0, newRadX, newRadY, rotation, startAngle, endAngle);
        }

        this.fillAndClose(fill, color, stroke, strokeColor);
    }


    /**
     * Draws a vector
     * @param {Vec2} pos start of vector
     * @param {Vec2} theVector
     */
    drawVector(pos, theVector, width = 0.5, scaling = 1) {
        // draw a dot, center of mass.
        this.circle(pos, width * 1.5 * scaling, '#88f');
        const newStart = this.calculateCoords(pos);
        const vecEnd = Vec.add(pos, theVector.multiply(scaling));
        const newStop = this.calculateCoords(vecEnd);

        this.ctx.beginPath();
        this.ctx.moveTo(newStart.x, newStart.y);
        this.ctx.lineTo(newStop.x, newStop.y);
        this.ctx.lineWidth = width * this.camera.zoom * scaling;
        this.ctx.strokeStyle = '#88f';
        this.ctx.stroke();

        this.circle(vecEnd, width * 0.6 * scaling, '#88f');
    }
}
