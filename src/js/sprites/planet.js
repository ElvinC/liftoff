import { Vec2 } from '../vector';

export class Planet {
    constructor(x, y, radius, color = '#000000', atmosHeight, mass = 1) {
        this.color = color;
        this.radius = radius;
        this.atmStart = radius;
        this.atmEnd = radius + atmosHeight;
        this.pos = new Vec2(x, y);
        this.vel = new Vec2(0, 0);
        this.mass = mass;
        this.inv_mass = 1 / mass;
    }

    simulateFrame() {
        //
    }

    drawMe(scene) {
        scene.circleGradient(this.pos, this.atmStart, this.atmEnd, {
            startColor: 'rgba(170, 170, 255, 0.6)',
            stopColor: 'rgba(100, 100, 200, 0)',
        });
        scene.circle(this.pos, this.radius, this.color);
        scene.circle(this.pos, this.radius / 200, '#00000099');
    }
}
