import {CGFobject} from '../../lib/CGF.js';
/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param radius - sphere radius
 * @param slices - number of slices
 * @param stacks - number of stacks
 */
export class MySphere extends CGFobject {
    constructor(scene, radius, slices, stacks) {
        super(scene);
        this.radius = radius;
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }

    // Based on https://www.songho.ca/opengl/gl_sphere.html

    /**
     * Slices = number of vertical divisions (longitude)
     * Stacks = number of horizontal divisions (latitude)
     * phi = angle between the stacks
     * theta = angle between the slices
     */
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const thetaStep = 2 * Math.PI / this.slices; // sector or slice step
        const phiStep = Math.PI / this.stacks; // stack step

        for(let latitude = 0; latitude <= this.stacks; latitude++){
            const phi = Math.PI / 2 - latitude * phiStep; // angle between the stacks
            const cosPhi = Math.cos(phi);
            const sinPhi = Math.sin(phi);

            for(let longitude = 0; longitude <= this.slices; longitude++){
                const theta = longitude * thetaStep; // angle between the slices

                // Vertex Positions
                const cosTheta = Math.cos(theta);
                const sinTheta = Math.sin(theta);

                const x = this.radius * cosPhi * cosTheta;
                const y = this.radius * sinPhi;
                const z = this.radius * cosPhi * sinTheta;

                this.vertices.push(x, y, z);

                // Normals
                const length = Math.sqrt(x * x + y * y + z * z);
                this.normals.push(x / length, y / length, z / length);
                this.texCoords.push(longitude / this.slices, latitude / this.stacks);
            }
        }

        // Generate Indices
        for(let latitude = 0; latitude < this.stacks; latitude++){
            for(let longitude = 0; longitude < this.slices; longitude++){
                const first = (latitude * (this.slices + 1)) + longitude;
                const second = first + this.slices + 1;

                if (latitude !== 0) {
                    this.indices.push(first, second, first + 1);
                }
                if (latitude !== this.stacks - 1) {
                    this.indices.push(second, second + 1, first + 1);
                }
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

