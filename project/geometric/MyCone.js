import {CGFobject} from '../../lib/CGF.js';

/**
* MyCone
* @constructor
* @param scene - Reference to MyScene object
* @param slices - number of divisions around the Y axis
* @param stacks - number of divisions along the Y axis (currently unused)
*/
export class MyCone extends CGFobject {
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = []; // Add texCoords array

        const alphaAng = 2 * Math.PI / this.slices;

        // Base vertices (rim)
        let ang = 0;
        for (let i = 0; i < this.slices; i++) {
            let x = Math.cos(ang);
            let z = -Math.sin(ang);
            this.vertices.push(x, 0, z); // Rim vertex
            this.normals.push(x, Math.cos(Math.PI / 4), z); // Approx normal for side
            this.texCoords.push(i / this.slices, 1); // Texture coords for sides (u along slices)
            ang += alphaAng;
        }

        // Tip vertex
        this.vertices.push(0, 1, 0); 
        this.normals.push(0, 1, 0);
        this.texCoords.push(0.5, 0); // Tip texture coord

        // Indices for sides
        for (let i = 0; i < this.slices; i++) {
            this.indices.push(i, (i + 1) % this.slices, this.slices); // Triangle fan for sides
        }

        // Base cap (center vertex)
        const baseCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0); 
        this.normals.push(0, -1, 0);
        this.texCoords.push(0.5, 0.5); // Center of texture

        // Rim vertices for base cap
        ang = 0;
        for (let i = 0; i < this.slices; i++) {
            let x = Math.cos(ang);
            let z = -Math.sin(ang);
            this.vertices.push(x, 0, z);
            this.normals.push(0, -1, 0);
            this.texCoords.push(0.5 + 0.5 * x, 0.5 - 0.5 * z); // Circular mapping
            ang += alphaAng;
        }

        // Indices for base cap
        for (let i = 0; i < this.slices; i++) {
            this.indices.push(baseCenterIndex, baseCenterIndex + i + 1, baseCenterIndex + ((i + 1) % this.slices) + 1);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity); // Complexity varies 0-1, so slices vary 3-12

        // Reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}
