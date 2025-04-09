import {CGFobject} from '../lib/CGF.js';

/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MySphere extends CGFobject {
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

                //used for normals
                let sa = Math.sin(ang);
                let saa = Math.sin(ang+alphaAng);
                let ca = Math.cos(ang);
                let caa = Math.cos(ang+alphaAng);


                //Define Vertices for this Slice
                this.vertices.push(ca, sa, zUpper);
                this.vertices.push(ca, sa, zLower);
                this.vertices.push(caa, saa, zLower);
                this.vertices.push(caa, saa, zUpper);

                // Compute Normal Vectors
                let normalX = (ca);
                let normalY = (sa);

                let normalXX = (caa);
                let normalYY = (saa);

                let normalLength = Math.sqrt(normalX ** 2 + normalY ** 2);
                normalX /= normalLength;
                normalY /= normalLength;

                normalXX /= normalLength;
                normalYY /= normalLength;

                let normal = [normalX, normalY, 0];
                let normalXY = [normalXX, normalYY,0];

                // Assign Normals
                this.normals.push(...normal, ...normal, ...normalXY,...normalXY);


                // Define Indices for this Face
                this.indices.push(indexAux, indexAux + 1, indexAux + 2);
                this.indices.push(indexAux, indexAux + 2, indexAux + 3);

  

                indexAux += 4;
                ang += alphaAng;
            }
        }

        // this.normals.push(0, 0, 1);


        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.LINES;

        this.initGLBuffers();
    }
        /**
     * Called when user interacts with GUI to change object's complexity.
     * @param {integer} complexity - changes number of slices
     */
        updateBuffers(complexity){
            this.slices = 3 + Math.round(9 * complexity); //complexity varies 0-1, so slices varies 3-12
    
            // reinitialize buffers
            this.initBuffers();
            this.initNormalVizBuffers();
        }
}

