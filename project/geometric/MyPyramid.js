import {CGFobject} from '../../lib/CGF.js';

/**
* MyPyramid
* @constructor
* @param scene - Reference to MyScene object
* @param slices - number of divisions around the Y axis
* @param stacks - number of divisions along the Y axis (unused here)
*/
export class MyPyramid extends CGFobject {
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
        this.texCoords = []; // Add texCoords

        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices;

        // Sides of the pyramid
        for (var i = 0; i < this.slices; i++) {
            var sa = Math.sin(ang);
            var saa = Math.sin(ang + alphaAng);
            var ca = Math.cos(ang);
            var caa = Math.cos(ang + alphaAng);

            // Vertices for each face (tip + two base points)
            this.vertices.push(0, 1, 0);            // Tip
            this.vertices.push(ca, 0, -sa);         // Base current
            this.vertices.push(caa, 0, -saa);       // Base next

            // Normals (face normals)
            var normal = [
                saa - sa,
                ca * saa - sa * caa,
                caa - ca
            ];
            var nsize = Math.sqrt(normal[0] ** 2 + normal[1] ** 2 + normal[2] ** 2);
            normal = normal.map(n => n / nsize);
            this.normals.push(...normal, ...normal, ...normal);

            // Texture Coordinates for sides (simple mapping)
            this.texCoords.push(0.5, 0);   // Tip
            this.texCoords.push(0, 1);     // Base left
            this.texCoords.push(1, 1);     // Base right

            // Indices for sides
            this.indices.push(3 * i, 3 * i + 1, 3 * i + 2);

            ang += alphaAng;
        }

        // Base center vertex
        let baseCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0);               // Center of base
        this.normals.push(0, -1, 0);
        this.texCoords.push(0.5, 0.5);             // Center texCoord

        // Indices for base cap (reuse side vertices)
        for (var i = 0; i < this.slices; i++) {
            this.indices.push(
                baseCenterIndex,
                3 * i + 2,      // Next rim vertex from sides
                3 * i + 1       // Current rim vertex from sides
            );
        }


        // Base rim vertices
        ang = 0;
        for (var i = 0; i < this.slices; i++) {
            var ca = Math.cos(ang);
            var sa = Math.sin(ang);
            this.vertices.push(ca, 0, -sa);
            this.normals.push(0, -1, 0);           // Downward normals
            this.texCoords.push(0.5 + 0.5 * ca, 0.5 - 0.5 * sa); // Circular mapping
            ang += alphaAng;
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
