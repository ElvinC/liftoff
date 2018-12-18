import { Vec2 } from '../vector';

export class Planet {
    constructor(x, y, radius, color = '#000000', atmosHeight, mass = 1, stdGravParam) {
        this.color = color;
        this.radius = radius;
        this.atmStart = radius;
        this.atmEnd = radius + atmosHeight;
        this.pos = new Vec2(x, y);
        this.vel = new Vec2(0, 0);
        this.mass = mass;
        this.inv_mass = 1 / mass;

        // G * m
        this.stdGravParam = stdGravParam;

        this.imgReady = false;
        this.img = document.createElement('img');
        this.img.src = '../../earth.png';
        let _self = this;
        this.img.onload = () => {
            _self.imgReady = true;
        };
    }

    simulateFrame(dt) {
        this.pos.addInPlace(this.vel.multiply(dt));
    }

    /**
     * Draws sprite on given scene
     * @param {Scene} scene the scene to draw the sprite
     */
    drawMe(scene) {
        // draw atmosphere first
        scene.circleGradient(this.pos, this.atmStart, this.atmEnd, {
            startColor: 'rgba(170, 170, 255, 0.6)',
            stopColor: 'rgba(100, 100, 200, 0)',
        });

        // if zoomed in, draw rectangle instead to prevent floating point bugs

        if (scene.camera.zoom * this.radius > 5000000) {
            const rectSize = this.radius / 320;

            // vec from center of planet to camera
            const rVecCam = scene.camera.pos.sub(this.pos);
            const rVecRect = rVecCam.unit(this.radius - rectSize / 2);
            const rectPos = this.pos.add(rVecRect);
            scene.rect(rectPos, rectSize, rectSize, rVecRect.angle(), this.color);
        } else {
            scene.circle(this.pos, this.radius, this.color);
            scene.circle(this.pos, this.radius / 200, '#00000099');

            let newPos = scene.calculateCoords(this.pos);

            if (this.imgReady) {
                scene.ctx.drawImage(this.img, newPos.x - this.radius * scene.camera.zoom, newPos.y - this.radius * scene.camera.zoom, 2 * this.radius * scene.camera.zoom, 2 * this.radius * scene.camera.zoom);
            }
 
        }
    }
}
