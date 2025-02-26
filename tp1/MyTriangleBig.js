import {CGFobject} from '../lib/CGF.js';

export class MyTriangleBig extends CGFobject{
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers(){
        this.vertices = [
            -2, 0, 0, // xA, yA, zA (0)
            2, 0, 0, // xB, yB, zB (1)
            0, 2, 0, // xC, yC, zC (2)
        ];

        this.indices = [
            0, 1, 2
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}