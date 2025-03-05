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
            0,2,1, //frente1
            0,3,2, //frente2

            1,5,0, //direita1
            1,6,5, //direita22

            6,4,5, //tras1
            6,7,4, //tras2

            7,3,4, //esquerda1
            7,2,3, //esquerda2

            3,5,4, //cima1
            3,0,5, //cima2

            1,2,6, //baixo1
            2,7,6  //baixo2
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

