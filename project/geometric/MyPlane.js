import {CGFobject} from "../../lib/CGF.js";

/**
 * MyPlane class represents a 2D plane in a 3D scene.
 * @constructor
 * @param {MyScene} scene - Reference to the MyScene object.
 * @param {number} divisions - Number of divisions for the plane.
 */
export class MyPlane extends CGFobject {
    constructor(scene, divisions) {
        super(scene);
        this.divisions = divisions;
        this.initBuffers();
    }

    /**
     * Initializes the plane's vertices, indices, normals, and texture coordinates.
     */
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
