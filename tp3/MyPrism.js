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
        // this.vertices = [
        //     0, 0, 0,
        //     0.5, Math.sin(60), 0,
        //     -0.5, Math.sin(120), 0,
        //     -1, 0, 0,
        //     -0.5, Math.sin(240), 0,
        //     0.5, Math.sin(300), 0,
        //     1, 0, 0,
        // ];

        //Counter-clockwise reference of vertices
        // this.indices = [
        //     0, 1, 2,
        //     0, 2, 3,
        //     0, 3, 4,
        //     0, 4, 5,
        //     0, 5, 6,
        // ];

        // this.normals = [
        // ]

        this.vertices = [];
        this.indices = [];
        this.normals = [];

        var ang = 0;
        var alphaAng = 2*Math.PI/this.slices;
        var indexAux = 0;
        for(var i = 0; i < this.slices; i++){

            /*var sa=Math.sin(ang);
            var saa=Math.sin(ang+alphaAng);
            var ca=Math.cos(ang);
            var caa=Math.cos(ang+alphaAng);*/


            this.vertices.push(Math.cos(ang), Math.sin(ang), 1);
            this.vertices.push(Math.cos(ang), Math.sin(ang), 0);
            ang+=alphaAng;

            this.vertices.push(Math.cos(ang), Math.sin(ang), 0);
            this.vertices.push(Math.cos(ang), Math.sin(ang), 1);




            /*// triangle normal computed by cross product of two edges
            var normal= [
                saa-sa,
                ca*saa-sa*caa,
                caa-ca
            ];


            // normalization
            var nsize=Math.sqrt(
                normal[0]*normal[0]+
                normal[1]*normal[1]+
                normal[2]*normal[2]+
                normal[3]*normal[3]
            );
            normal[0]/=nsize;
            normal[1]/=nsize;
            normal[2]/=nsize;
            normal[3]/=nsize;

            // push normal once for each vertex of this triangle
            this.normals.push(...normal);
            this.normals.push(...normal);
            this.normals.push(...normal);
            this.normals.push(...normal);*/

            this.indices.push(indexAux,indexAux+1,indexAux+2);
            this.indices.push(indexAux,indexAux+2,indexAux+3);
            indexAux+=4;
        }


        this.normals.push(0,0,1);




        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

