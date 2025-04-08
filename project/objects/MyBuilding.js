import {CGFobject} from '../../lib/CGF.js';
import { MyCube } from "../geometric/MyCube.js";

/**
 * MyBuilding
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyBuilding extends CGFobject {
    constructor(scene) {
        super(scene);
        this.cube = new MyCube(this.scene,1,1,1);
        this.cube2 = new MyCube(this.scene,2.5,1.5,1.5);
        this.cube3 = new MyCube(this.scene,.75, 1,1);


        // this.initBuffers();
    }

    display() {

        // Middle Building
        this.scene.pushMatrix();
        this.cube.display();
        this.scene.popMatrix();


        // Left Building
        this.scene.pushMatrix();
        this.scene.translate(1.25, 0, 0);
        this.cube2.display();
        this.scene.popMatrix();



        // Right Building
        this.scene.pushMatrix();
        this.scene.translate(-1.25, 0, 0);
        this.cube2.display();
        this.scene.popMatrix();

        // Door Part
        this.scene.pushMatrix();
        this.scene.translate(0, -.87, 0);
        this.cube3.display();
        this.scene.popMatrix();


        // this.primitiveType = this.scene.gl.TRIANGLES;
        // this.initGLBuffers();
    }
}

