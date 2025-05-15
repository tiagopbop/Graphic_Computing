import { CGFobject } from '../../lib/CGF.js';

export class MyHeli extends CGFobject {
    constructor(scene, slices = 20, stacks = 20, radius = 1) {
        super(scene);
        this.scene = scene;
        this.slices = slices;
        this.stacks = stacks;
        this.radius = radius;

        // Motion state
        this.position = { x: 0, y: 0, z: 0 };
        this.velocity = { x: 0, z: 0 };
        this.acceleration = { x: 0, z: 0 };
        this.orientation = 0;

        // Vertical control
        this.targetY = 0;
        this.verticalSpeed = 5; // units/second
        this.cruiseAltitude = 10;
        this.in_air = false;

        this.maxSpeed = 10;
        this.drag = 0.92;

        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.normals = [];
        this.indices = [];
        this.texCoords = [];

        const alpha = 2 * Math.PI / this.slices;
        const beta = Math.PI / this.stacks;

        for (let j = 0; j <= this.stacks; j++) {
            const theta = j * beta;
            const cosTheta = Math.cos(theta);
            const sinTheta = Math.sin(theta);

            for (let i = 0; i <= this.slices; i++) {
                const phi = i * alpha;
                const x = Math.cos(phi) * sinTheta;
                const y = Math.sin(phi) * sinTheta;
                const z = cosTheta;

                this.vertices.push(this.radius * x, this.radius * y, this.radius * z);
                this.normals.push(x, y, z);
                this.texCoords.push(i / this.slices, 1 - j / this.stacks);
            }
        }

        for (let j = 0; j < this.stacks; j++) {
            for (let i = 0; i < this.slices; i++) {
                const a = j * (this.slices + 1) + i;
                const b = a + this.slices + 1;

                this.indices.push(a, b, a + 1);
                this.indices.push(b, b + 1, a + 1);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    takeOff() {
        if (!this.in_air) {
            this.in_air = true;
            this.targetY = this.cruiseAltitude;
        }
    }

    land() {
        if (this.in_air) {
            this.in_air = false;
            this.targetY = 0;
            this.velocity = { x: 0, z: 0 };
        }
    }

    reset() {
        this.position = { x: 0, y: 0, z: 0 };
        this.velocity = { x: 0, z: 0 };
        this.orientation = 0;
        this.in_air = false;
        this.targetY = 0;
    }

    accelerate(v) {
        if (!this.in_air) return;

        const dirX = Math.sin(this.orientation);
        const dirZ = Math.cos(this.orientation);
        this.acceleration.x += v * dirX;
        this.acceleration.z += v * dirZ;
    }

    turn(v) {
        if (!this.in_air) return;

        this.orientation += v;

        const speed = Math.hypot(this.velocity.x, this.velocity.z);
        this.velocity.x = speed * Math.sin(this.orientation);
        this.velocity.z = speed * Math.cos(this.orientation);
    }

    update(deltaTime, speedFactor = 1.0) {
        const delta = deltaTime / 1000;

        if (this.in_air) {
            this.velocity.x += this.acceleration.x * delta * speedFactor;
            this.velocity.z += this.acceleration.z * delta * speedFactor;

            this.velocity.x *= this.drag;
            this.velocity.z *= this.drag;

            const speed = Math.hypot(this.velocity.x, this.velocity.z);
            if (speed > this.maxSpeed) {
                const scale = this.maxSpeed / speed;
                this.velocity.x *= scale;
                this.velocity.z *= scale;
            }

            this.position.x += this.velocity.x * delta;
            this.position.z += this.velocity.z * delta;
        }

        this.acceleration = { x: 0, z: 0 };

        const dy = this.targetY - this.position.y;
        if (Math.abs(dy) > 0.01) {
            const dir = Math.sign(dy);
            const step = this.verticalSpeed * delta;
            this.position.y += dir * Math.min(Math.abs(dy), step);
        } else {
            this.position.y = this.targetY;
        }
    }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.position.x, this.position.y, this.position.z);
        this.scene.rotate(this.orientation, 0, 1, 0);
    
        this.scene.scale(1, 1, 1); 
        this.scene.defaultAppearance?.apply();
    
        super.display(); 
        this.scene.popMatrix();
    }
}
