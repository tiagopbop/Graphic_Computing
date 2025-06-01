import {CGFobject} from "../../lib/CGF.js";

/**
 * Represents a cone in a 3D scene.
 * @extends CGFobject
 */
export class MyCone extends CGFobject {
    /**
     * Constructs a MyCone object.
     * @param {CGFscene} scene - The CGF scene where the cone will be displayed.
     * @param {number} slices - The number of horizontal slices for the cone.
     * @param {number} stacks - The number of vertical stacks for the cone.
     */
    constructor(scene, slices, stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }

    /**
     * Initializes the vertex, index, normal, and texture coordinate buffers for the cone.
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const alpha = (2 * Math.PI) / this.slices;

        // Tip vertex
        this.vertices.push(0, 1, 0);
        this.normals.push(0, 1, 0);
        this.texCoords.push(0.5, 0); // Tip center

        // Side rim vertices
        for (let i = 0; i <= this.slices; i++) {
            const ang = i * alpha;
            const x = Math.cos(ang);
            const z = -Math.sin(ang);

            this.vertices.push(x, 0, z);

            // sloped normals
            const nx = x;
            const ny = Math.cos(Math.PI / 4);
            const nz = z;
            const len = Math.sqrt(nx * nx + ny * ny + nz * nz);
            this.normals.push(nx / len, ny / len, nz / len);

            this.texCoords.push(i / this.slices, 1);
        }

        // Side indices
        for (let i = 1; i <= this.slices; i++) {
            this.indices.push(0, i, i + 1);
        }

        // Base center vertex
        const baseCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, -1, 0);
        this.texCoords.push(0.5, 0.5);

        // Base rim
        for (let i = 0; i <= this.slices; i++) {
            const ang = i * alpha;
            const x = Math.cos(ang);
            const z = -Math.sin(ang);

            this.vertices.push(x, 0, z);
            this.normals.push(0, -1, 0);
            this.texCoords.push(0.5 + 0.5 * x, 0.5 - 0.5 * z);
        }

        // Base indices (triangle fan)
        for (let i = 1; i <= this.slices; i++) {
            this.indices.push(
                baseCenterIndex,
                baseCenterIndex + i + 1,
                baseCenterIndex + i
            );
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * Updates the number of slices for the cone based on the given complexity.
     * @param {number} complexity - A value between 0 and 1 representing the desired complexity.
     */
    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity);
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}
