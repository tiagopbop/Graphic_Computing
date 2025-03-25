import {CGFobject} from '../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleSmall} from "./MyTriangleSmall.js";
import { MyTriangleBig} from "./MyTriangleBig.js";
import { MyUnitCube} from "./MyUnitCube.js";
import { MyUnitCubeQuad} from "./MyUnitCubeQuad.js";


/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyTangram extends CGFobject {
    constructor(scene) {
        super(scene);
        this.diamond = new MyDiamond(this.scene);
        this.bigTriangle = new MyTriangleBig(this.scene);
        this.smallTriangle = new MyTriangleSmall(this.scene);
        this.parallelogram = new MyParallelogram(this.scene);
        this.triangle = new MyTriangle(this.scene);
        this.unitcube = new MyUnitCube(this.scene);
    //    this.unitcubequad = new MyUnitCubeQuad(this.scene);
    }

    display(){


        // NOTE: setDiffuse is divided by 255 for gamma correction purposes

        // Green Square
        this.scene.pushMatrix();
        this.scene.setDiffuse(0, 255 / 255, 0);

        // Declaring translation Matrix
        /*  [ 1, 0, 0, 0
              0, 1, 0, 0
              0, 0, 1, 0
             tx,ty,tz, 1]
         */
        let translateMatrix =
            [1, 0, 0, 0,
                0, 1, 0, 0,
                0, 0, 1, 0,
                2.12, 4.505, 0, 1,
            ];
        this.scene.multMatrix(translateMatrix);

        this.scene.rotate(45 * (Math.PI/180), 0,0,1);

        this.diamond.display();
        this.scene.popMatrix();


        // Big Orange Triangle
        this.scene.pushMatrix();
        this.scene.setDiffuse(255 / 255, 155 / 255,0);
        this.scene.rotate(45* Math.PI/180, 0,0,1);
        this.bigTriangle.display();
        this.scene.popMatrix();

        // Note: After Rotation, the points become A(-√2, -√2, 0); B(√2, √2,0); C(-√2, √2, 0)
        // Point A (x, y). Rotation of 45º
        // x' = (x * cos 45º) - (y * sin 45º)
        // y' = (x * sin 45º) + (y * cos 45º)


        // Big Blue Triangle
        this.scene.pushMatrix();
        this.scene.setDiffuse(0, 155 / 255, 255 / 255);
        this.scene.translate(0,2 * Math.sqrt(2),0);
        this.scene.rotate(-135* (Math.PI/180), 0,0,1);


        this.bigTriangle.display();
        this.scene.popMatrix();

        // Medium Pink Triangle

        this.scene.pushMatrix();
        this.scene.setDiffuse(255 / 255, 155 / 255, 207 / 255);
        this.scene.translate(0,- Math.sqrt(2),0);
        this.scene.rotate(-45 * (Math.PI/180),0,0,1);
        this.triangle.display();
        this.scene.popMatrix();


        // Small Red Triangle

        this.scene.pushMatrix();
        this.scene.setDiffuse(255 / 255, 27 / 255, 27 / 255);
        this.scene.translate(0.5, -3.33,0);
        this.scene.rotate(135* (Math.PI/180), 0,0,1);
        this.smallTriangle.display();
        this.scene.popMatrix();

        // Small Purple Triangle

        this.scene.pushMatrix();
        this.scene.setDiffuse(150 / 255, 80 / 255, 190 / 255);
        this.scene.translate(1.5*Math.sqrt(2), -3.33,0);
        this.scene.rotate(135* (Math.PI/180), 0,0,1);
        this.smallTriangle.display();
        this.scene.popMatrix();


        // Yellow Parallelogram

        this.scene.pushMatrix();
        this.scene.setDiffuse(255 / 255, 255 / 255, 0);
        this.scene.scale(1,-1,1);
        this.scene.rotate(45 * (Math.PI/180), 0,0,1);
        this.parallelogram.display();
        this.scene.popMatrix();
}
