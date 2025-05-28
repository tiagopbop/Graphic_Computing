import { CGFobject } from '../../lib/CGF.js';

/**
 * MyPlane
 * @constructor
 * @param scene - Reference to MyScene object
 * @param divisions - Number of divisions for the plane
 */
export class MyPlane extends CGFobject {
    constructor(scene, divisions) {
        super(scene);
        this.divisions = divisions;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const step = 1.0 / this.divisions;

        for (let i = 0; i <= this.divisions; i++) {
            for (let j = 0; j <= this.divisions; j++) {
                this.vertices.push(j * step, 0, i * step);
                this.normals.push(0, 1, 0);
                this.texCoords.push(j * step, i * step);
            }
        }

        for (let i = 0; i < this.divisions; i++) {
            for (let j = 0; j < this.divisions; j++) {
                const topLeft = i * (this.divisions + 1) + j;
                const topRight = topLeft + 1;
                const bottomLeft = topLeft + this.divisions + 1;
                const bottomRight = bottomLeft + 1;

                this.indices.push(topLeft, bottomLeft, topRight);
                this.indices.push(topRight, bottomLeft, bottomRight);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}