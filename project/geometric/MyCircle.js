import {CGFobject} from "../../lib/CGF.js";

/**
 * MyCircle class represents a circle in the 3D scene.
 * @constructor
 * @param {CGFscene} scene - Reference to the MyScene object.
 * @param {integer} slices - Number of slices for the circle.
 * @param {boolean} isTop - Indicates if the circle represents the top surface (default is true).
 */
export class MyCircle extends CGFobject {
    constructor(scene, slices, isTop = true) {
        super(scene);
        this.slices = slices;
        this.isTop = isTop;
        this.initBuffers();
    }

    /**
     * Initializes the circle's vertices, indices, normals, and texture coordinates.
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        // Center Vertex
        this.vertices.push(0, 0, 0);
        this.texCoords.push(0.5, 0.5);
        if (this.isTop) this.normals.push(0, 0, 1);
        else this.normals.push(0, 0, -1);

        var ang = 0;
        var alphaAng = (2 * Math.PI) / this.slices;

        // Circle Rim Vertices
        for (let i = 0; i <= this.slices; i++) {
            let x = Math.cos(ang);
            let y = Math.sin(ang);

            this.vertices.push(x, y, 0);

            // Map Circle For Texture Coords
            let u = 0.5 + 0.5 * x;
            let v = 0.5 + 0.5 * y;
            this.texCoords.push(u, v);

            if (this.isTop) this.normals.push(0, 0, 1);
            else this.normals.push(0, 0, -1);

            ang += alphaAng;
        }

        // Indices
        for (let i = 1; i <= this.slices; i++) {
            if (this.isTop) this.indices.push(0, i, i + 1);
            else this.indices.push(0, i + 1, i);
        }

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }

    /**
     * Called when user interacts with GUI to change object's complexity.
     * @param {integer} complexity - changes number of slices
     */
    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}
