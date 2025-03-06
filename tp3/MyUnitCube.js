import {CGFobject} from '../lib/CGF.js';

/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        this.vertices = [
            0.5, 0.5, 0.5, //0
            0.5, -0.5, 0.5, //1
            -0.5,-0.5, 0.5, //2
            -0.5,0.5,0.5, //3
            -0.5, 0.5, -0.5, //4
            0.5, 0.5, -0.5, //5
            0.5,-0.5, -0.5, //6
            -0.5,-0.5, -0.5 //7
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            0,2,1, //front1
            0,3,2, //front2

            1,5,0, //right1
            1,6,5, //right2

            6,4,5, //back1
            6,7,4, //back2

            7,3,4, //left1
            7,2,3, //left2

            3,5,4, //top1
            3,0,5, //top2

            1,2,6, //bottom1
            2,7,6  //bottom2
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

