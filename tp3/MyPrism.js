import {CGFobject} from '../lib/CGF.js';

/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyPrism extends CGFobject {
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

        var ang = 0;
        var alphaAng = 2 * Math.PI / this.slices;
        var indexAux = 0;
        for (var j = 0; j < this.stacks; j++){
            // Defining Z Values
            let zLower = j / this.stacks;
            let zUpper = (j + 1) / this.stacks;

            for (var i = 0; i < this.slices; i++) {

                let sa = Math.sin(ang);
                let saa = Math.sin(ang + alphaAng);
                let ca = Math.cos(ang);
                let caa = Math.cos(ang + alphaAng);

                //Define Vertices for this Slice
                this.vertices.push(ca, sa, zUpper);
                this.vertices.push(ca, sa, zLower);
                this.vertices.push(caa, saa, zLower);
                this.vertices.push(caa, saa, zUpper);

                // Compute Normal Vectors
                let normalX = (ca + caa) / 2;
                let normalY = (sa + saa) / 2;

                let normalLength = Math.sqrt(normalX ** 2 + normalY ** 2);
                normalX /= normalLength;
                normalY /= normalLength;

                let normal = [normalX, normalY, 0];

                // Assign Normals
                this.normals.push(...normal, ...normal, ...normal, ...normal);


                // Define Indices for this Face
                this.indices.push(indexAux, indexAux + 1, indexAux + 2);
                this.indices.push(indexAux, indexAux + 2, indexAux + 3);

                if(j < this.stacks - 1){
                    // Connect to next stack
                    this.indices.push(indexAux+2, indexAux + 1, indexAux + 5);
                    this.indices.push(indexAux+2, indexAux + 5, indexAux + 6);
                    this.indices.push(indexAux+3, indexAux + 2, indexAux + 6);
                    this.indices.push(indexAux+3, indexAux + 6, indexAux + 7);
                }

                indexAux += 4;
                ang += alphaAng;
            }
        }

        // this.normals.push(0, 0, 1);


        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

