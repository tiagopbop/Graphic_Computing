import {CGFobject} from '../lib/CGF.js';

export class MyTriangleSmall extends CGFobject{
    constructor(scene,textureCoords) {
        super(scene);
        this.texCoords = textureCoords;
        this.initBuffers();
    }

    initBuffers(){
        this.vertices = [
            -1, 0, 0, // xA, yA, zA (0)
            1, 0, 0, // xB, yB, zB (1)
            0, 1, 0, // xC, yC, zC (2)
            -1, 0, 0, // 3
            1, 0, 0, // 4
            0, 1, 0 // 5
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