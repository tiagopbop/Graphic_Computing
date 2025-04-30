import { CGFobject } from '../../lib/CGF.js';

/**
* MySphere
* @constructor
* @param scene - Reference to MyScene object
* @param slices - number of divisions around the Y axis (longitude)
* @param stacks - number of divisions along the Y axis (latitude)
* @param inverted - if true, sphere is inverted (normals face inward)
*/
export class MySphere extends CGFobject {
    constructor(scene, slices, stacks, inverted=true, radius = 1) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.inverted = inverted;
        this.radius = radius;
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const alphaAng = 2 * Math.PI / this.slices;
        const betaAng = Math.PI / this.stacks;

        // Vertices, normals, texCoords
        for (let stack = 0; stack <= this.stacks; stack++) {
            const beta = stack * betaAng; 
            const z = Math.cos(beta);
            const r = Math.sin(beta); 

            for (let slice = 0; slice <= this.slices; slice++) {
                const alpha = slice * alphaAng;
                const x = r * Math.cos(alpha);
                const y = r * Math.sin(alpha);

                this.vertices.push(this.radius * x, this.radius * y, this.radius * z);
                this.normals.push(
                    this.inverted ? -x : x,
                    this.inverted ? -y : y,
                    this.inverted ? -z : z
                );
                this.texCoords.push(slice / this.slices, 1 - stack / this.stacks);
            }
        }

        // Indices (adjust winding order if inverted)
        for (let stack = 0; stack < this.stacks; stack++) {
            for (let slice = 0; slice < this.slices; slice++) {
                const first = stack * (this.slices + 1) + slice;
                const second = first + this.slices + 1;

                if (this.inverted) {
                    // Reverse winding order
                    this.indices.push(first, first + 1, second);
                    this.indices.push(second, first + 1, second + 1);
                } else {
                    this.indices.push(first, second, first + 1);
                    this.indices.push(second, second + 1, first + 1);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity); 
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}
