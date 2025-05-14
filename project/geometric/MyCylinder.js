import {CGFobject} from '../../lib/CGF.js';

/**
 * MyCylinder
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyCylinder extends CGFobject {
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

        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices;
        var indexAux = 0;

        // Side faces
        for (var j = 0; j < this.stacks; j++) {
            let zLower = j / this.stacks;
            let zUpper = (j + 1) / this.stacks;

            ang = 0;
            for (var i = 0; i < this.slices; i++) {
                let sa = Math.sin(ang);
                let saa = Math.sin(ang + alphaAng);
                let ca = Math.cos(ang);
                let caa = Math.cos(ang + alphaAng);

                // Vertices (4 per quad)
                this.vertices.push(ca, sa, zUpper);
                this.vertices.push(ca, sa, zLower);
                this.vertices.push(caa, saa, zLower);
                this.vertices.push(caa, saa, zUpper);

                // Normals
                let normalX = ca;
                let normalY = sa;
                let normalXX = caa;
                let normalYY = saa;
                let normalLength = Math.sqrt(normalX ** 2 + normalY ** 2);

                normalX /= normalLength;
                normalY /= normalLength;
                normalXX /= normalLength;
                normalYY /= normalLength;

                let normal = [normalX, normalY, 0];
                let normalXY = [normalXX, normalYY, 0];

                this.normals.push(...normal, ...normal, ...normalXY, ...normalXY);

                // Texture Coordinates (sides)
                this.texCoords.push(i / this.slices, zUpper);     // Top left
                this.texCoords.push(i / this.slices, zLower);     // Bottom left
                this.texCoords.push((i + 1) / this.slices, zLower); // Bottom right
                this.texCoords.push((i + 1) / this.slices, zUpper); // Top right

                // Indices
                this.indices.push(indexAux, indexAux + 1, indexAux + 2);
                this.indices.push(indexAux, indexAux + 2, indexAux + 3);

                indexAux += 4;
                ang += alphaAng;
            }
        }

        // Bottom cap
        let baseCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 0);  // Center vertex
        this.normals.push(0, 0, -1);
        this.texCoords.push(0.5, 0.5); // Center texCoord

        ang = 0;
        for (let i = 0; i < this.slices; i++) {
            let ca = Math.cos(ang);
            let sa = Math.sin(ang);
            this.vertices.push(ca, sa, 0);
            this.normals.push(0, 0, -1);
            this.texCoords.push(0.5 + 0.5 * ca, 0.5 - 0.5 * sa); // Circular mapping

            this.indices.push(baseCenterIndex, baseCenterIndex + ((i + 1) % this.slices) + 1, baseCenterIndex + i + 1);
            ang += alphaAng;
        }

        // Top cap
        let topCenterIndex = this.vertices.length / 3;
        this.vertices.push(0, 0, 1);  // Center vertex
        this.normals.push(0, 0, 1);
        this.texCoords.push(0.5, 0.5); // Center texCoord

        ang = 0;
        for (let i = 0; i < this.slices; i++) {
            let ca = Math.cos(ang);
            let sa = Math.sin(ang);
            this.vertices.push(ca, sa, 1);
            this.normals.push(0, 0, 1);
            this.texCoords.push(0.5 + 0.5 * ca, 0.5 - 0.5 * sa); // Circular mapping

            this.indices.push(topCenterIndex, topCenterIndex + i + 1, topCenterIndex + ((i + 1) % this.slices) + 1);
            ang += alphaAng;
        }

        // Setup WebGL buffers
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    updateBuffers(complexity) {
        this.slices = 3 + Math.round(9 * complexity); // Slices vary from 3-12
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}
