import {CGFobject} from '../lib/CGF.js';

/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 * @param nDivs 
 */
export class MyUnitCube extends CGFobject {
    constructor(scene, nDivs) {
        super(scene);
        nDivs = typeof nDivs != 'undefined' ? nDivs : 1;
        this.nDivs = this.nDivs;
        this.patchLenght = 1.0 / this.nDivs;

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
            -0.5,-0.5, -0.5, //7

            0.5, 0.5, 0.5, //9
            0.5, -0.5, 0.5, //9
            -0.5,-0.5, 0.5, //10
            -0.5,0.5,0.5, //11
            -0.5, 0.5, -0.5, //12
            0.5, 0.5, -0.5, //13
            0.5,-0.5, -0.5, //14
            -0.5,-0.5, -0.5, //15

            0.5, 0.5, 0.5, //16
            0.5, -0.5, 0.5, //17
            -0.5,-0.5, 0.5, //18
            -0.5,0.5,0.5, //19
            -0.5, 0.5, -0.5, //20
            0.5, 0.5, -0.5, //21
            0.5,-0.5, -0.5, //22
            -0.5,-0.5, -0.5 //23
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

        this.vertices.push(0,1,0);

        this.normals = [];
/*
        for (var i = 0; i <=  this.nDivs/4 ; i++) {
            this.normals.push(0.5, 0, 0);
        }
        */
        
        for (var i = 0; i <=  this.nDivs/4 ; i++) {
            this.normals.push(0.5, 0, 0);
        }
        for (var i = 0; i <=  this.nDivs/4 ; i++) {
            this.normals.push(-0.5, 0, 0);
        }
        for (var i = 0; i <=  this.nDivs/8 ; i++) {
            this.normals.push(-0.5, 0, 0);
        }
        for (var i = 0; i <=  this.nDivs/4 ; i++) {
            this.normals.push(0.5, 0, 0);
        }
        for (var i = 0; i <=  this.nDivs/8 ; i++) {
            this.normals.push(-0.5, 0, 0);
        }
        
        
        for (var i = 0; i <=  this.nDivs/8 ; i++) {
            this.normals.push(0, 0.5, 0);
        }     
        for (var i = 0; i <=  this.nDivs/4 ; i++) {
            this.normals.push(0, -0.5, 0);
        }
        for (var i = 0; i <=  this.nDivs/4 ; i++) {
            this.normals.push(0, 0.5, 0);
        }
        for (var i = 0; i <=  this.nDivs/8 ; i++) {
            this.normals.push(0, 0.5, 0);
        }    
        for (var i = 0; i <=  this.nDivs/4 ; i++) {
            this.normals.push(0, -0.5, 0);
        } 
        


        for (var i = 0; i <=  this.nDivs/2 ; i++) {
            this.normals.push(0, 0, 0.5);
        } 
        for (var i = 0; i <=  this.nDivs/2 ; i++) {
            this.normals.push(0, 0, -0.5);
        } 
        

        


        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
    /**
     * Called when user interacts with GUI to change object's complexity.
     * @param {integer} complexity - changes number of nDivs
     */
    updateBuffers(complexity){
        this.nDivs = 1 +  Math.round(9 * complexity); //complexity varies 0-1, so nDivs varies 1-10
        this.patchLength = 1.0 / this. nDivs;

        // reinitialize buffers
        this.initBuffers();
        this.initNormalVizBuffers();
    }
}

