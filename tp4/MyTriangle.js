import {CGFobject} from '../lib/CGF.js';

export class MyTriangle extends CGFobject{
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers(){
        this.vertices = [
            -1, -1, 0, // xA, yA, zA (0)
            1, -1, 0, // xB, yB, zB (1)
            -1, 1, 0, // xC, yC, zC (2)

            // Each Vertex in Triangle should have 2 Normals, 1 for each Face
            -1, -1, 0, // 3
            1, -1, 0, // 4
            -1, 1, 0, // 5
        ];

        this.indices = [
            0, 1, 2,
            5, 4, 3
        ];

        // Normal Vectors
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