import {CGFobject} from '../lib/CGF.js';

export class MyTriangleBig extends CGFobject{
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers(){

        // Normals, Vertices and Indices Implemented Following Logic Presented in MyTriangle.js

        this.vertices = [
            -2, 0, 0, // xA, yA, zA (0)
            2, 0, 0, // xB, yB, zB (1)
            0, 2, 0, // xC, yC, zC (2)
            -2, 0, 0, // 3
            2, 0, 0, // 4
            0, 2, 0 // 5
        ];

        this.indices = [
            0, 1, 2,
            5, 4, 3
        ];

        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
        ]


        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}