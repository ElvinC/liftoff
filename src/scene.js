import { Vector2D as Vec2, Vector as Vec } from './vector.js';

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
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
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

    fillAndClose(color) {
        this.ctx.fillStyle = color;
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#555';
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    }


    // Draw a circle with the given position, radius and color
    circle(pos, radius, color = '#000000') {
        // console.log(pos instanceof Vec2)
        const posVec = Vec.toVector(pos);
        const newPos = this.calculateCoords(posVec);

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
    rect(pos, width, height, rotation = 0, color = '#000000', offset) {
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

        this.fillAndClose(color);
    }

    /**
     * Draws a vector
     * @param {Vec2} pos start of vector
     * @param {Vec2} theVector
     */
    drawVector(pos, theVector) {
        // draw a dot, center of mass.
        this.circle(pos, 1, '#000000');
        const newStart = this.calculateCoords(pos);
        const newStop = this.calculateCoords(Vec.add(pos, theVector));

        this.ctx.beginPath();
        this.ctx.moveTo(newStart.x, newStart.y);
        this.ctx.lineTo(newStop.x, newStop.y);
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = '#555';
        this.ctx.stroke();
    }
}
