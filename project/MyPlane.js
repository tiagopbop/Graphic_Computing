import {CGFobject} from "../lib/CGF.js";

/**
 * MyPlane class represents a 2D plane in a 3D scene.
 * It generates a grid of vertices, normals, and texture coordinates.
 * The grid is defined by the number of divisions in both directions (nrDivs).
 * The texture coordinates can be customized using minS, maxS, minT, and maxT.
 *
 * @constructor
 * @param {MyScene} scene - Reference to MyScene object
 * @param {number} [nrDivs=1] - Number of divisions in both directions of the surface
 * @param {number} [minS=0] - Minimum texture coordinate in S
 * @param {number} [maxS=1] - Maximum texture coordinate in S
 * @param {number} [minT=0] - Minimum texture coordinate in T
 * @param {number} [maxT=1] - Maximum texture coordinate in T
 */
export class MyPlane extends CGFobject {
    constructor(scene, nrDivs, minS, maxS, minT, maxT) {
        super(scene);
        // nrDivs = 1 if not provided
        nrDivs = typeof nrDivs !== "undefined" ? nrDivs : 1;
        this.nrDivs = nrDivs;
        this.patchLength = 1.0 / nrDivs;
        this.minS = minS || 0;
        this.maxS = maxS || 1;
        this.minT = minT || 0;
        this.maxT = maxT || 1;
        this.q = (this.maxS - this.minS) / this.nrDivs;
        this.w = (this.maxT - this.minT) / this.nrDivs;
        this.initBuffers();
    }

    initBuffers() {
        // Generate vertices, normals, and texCoords
        this.vertices = [];
        this.normals = [];
        this.texCoords = [];
        var yCoord = 0.5;
        for (var j = 0; j <= this.nrDivs; j++) {
            var xCoord = -0.5;
            for (var i = 0; i <= this.nrDivs; i++) {
                this.vertices.push(xCoord, yCoord, 0);
                this.normals.push(0, 0, 1);
                this.texCoords.push(this.minS + i * this.q, this.minT + j * this.w);
                xCoord += this.patchLength;
            }
            yCoord -= this.patchLength;
        }
        // Generating indices
        this.indices = [];

        var ind = 0;
        for (var j = 0; j < this.nrDivs; j++) {
            for (var i = 0; i <= this.nrDivs; i++) {
                this.indices.push(ind);
                this.indices.push(ind + this.nrDivs + 1);
                ind++;
            }
            if (j + 1 < this.nrDivs) {
                this.indices.push(ind + this.nrDivs);
                this.indices.push(ind);
            }
        }
        this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
        this.initGLBuffers();
    }

    /**
     * Sets the primitive type to TRIANGLE_STRIP for fill mode.
     */
    setFillMode() {
        this.primitiveType = this.scene.gl.TRIANGLE_STRIP;
    }

    /**
     * Sets the primitive type to LINES for line mode.
     */
    setLineMode() {
        this.primitiveType = this.scene.gl.LINES;
    }
}
