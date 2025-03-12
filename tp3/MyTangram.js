import {CGFobject, CGFappearance} from '../lib/CGF.js';
import { MyDiamond } from "./MyDiamond.js";
import { MyTriangle } from "./MyTriangle.js";
import { MyParallelogram } from "./MyParallelogram.js";
import { MyTriangleSmall} from "./MyTriangleSmall.js";
import { MyTriangleBig} from "./MyTriangleBig.js";


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
        this.initMaterials();
    }

    // Dealing with Materials for Exercise 1.5 tp3
    initMaterials() {
        // Material Definition following the Similar Definition in MyScene.js

        // Diamond Material (Green Square)
        this.diamondMaterial = new CGFappearance(this.scene);
        this.diamondMaterial.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.diamondMaterial.setDiffuse(0, 255 / 255, 0, 1.0);
        this.diamondMaterial.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.diamondMaterial.setShininess(10.0);

        // Big Triangle Material 1 (Big Orange Triangle)
        this.bigTriangleMaterial1 = new CGFappearance(this.scene);
        this.bigTriangleMaterial1.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.bigTriangleMaterial1.setDiffuse(255 / 255, 155 / 255, 0, 1.0);
        this.bigTriangleMaterial1.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.bigTriangleMaterial1.setShininess(10.0);

        // Big Triangle Material 2 (Big Blue Triangle)
        this.bigTriangleMaterial2 = new CGFappearance(this.scene);
        this.bigTriangleMaterial2.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.bigTriangleMaterial2.setDiffuse(0, 155 / 255, 255 / 255, 1.0);
        this.bigTriangleMaterial2.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.bigTriangleMaterial2.setShininess(10.0);

        // Triangle Material (Pink Triangle)
        this.triangleMaterial = new CGFappearance(this.scene);
        this.triangleMaterial.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.triangleMaterial.setDiffuse(255 / 255, 155 / 255, 207 / 255, 1.0);
        this.triangleMaterial.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.triangleMaterial.setShininess(10.0);

        // Small Triangle Material 1 (Small Red Triangle)
        this.smallTriangleMaterial1 = new CGFappearance(this.scene);
        this.smallTriangleMaterial1.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.smallTriangleMaterial1.setDiffuse(255 / 255, 27 / 255, 27 / 255, 1.0);
        this.smallTriangleMaterial1.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.smallTriangleMaterial1.setShininess(10.0);

        // Small Triangle Material 2 (Small Purple Triangle)
        this.smallTriangleMaterial2 = new CGFappearance(this.scene);
        this.smallTriangleMaterial2.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.smallTriangleMaterial2.setDiffuse(150 / 255, 80 / 255, 190 / 255, 1.0);
        this.smallTriangleMaterial2.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.smallTriangleMaterial2.setShininess(10.0);

        // Parallelogram Material (Yellow Parallelogram)
        this.parallelogramMaterial = new CGFappearance(this.scene);
        this.parallelogramMaterial.setAmbient(0.3, 0.3, 0.3, 1.0);
        this.parallelogramMaterial.setDiffuse(255 / 255, 255 / 255, 0, 1.0);
        this.parallelogramMaterial.setSpecular(0.9, 0.9, 0.9, 1.0);
        this.parallelogramMaterial.setShininess(10.0);
    }


    display(){
        // NOTE: setDiffuse is removed in tp3 since it's defined in init Materials

        // Green Square
        this.scene.pushMatrix();
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
        // this.diamondMaterial.apply();
        this.scene.customMaterial.apply(); // Applying Custom Material (ex 1.6 tp3)
        this.diamond.display();
        this.scene.popMatrix();


        // Big Orange Triangle
        this.scene.pushMatrix();
        this.scene.rotate(45* Math.PI/180, 0,0,1);
        this.bigTriangleMaterial1.apply();
        this.bigTriangle.display();
        this.scene.popMatrix();

        // Note: After Rotation, the points become A(-√2, -√2, 0); B(√2, √2,0); C(-√2, √2, 0)
        // Point A (x, y). Rotation of 45º
        // x' = (x * cos 45º) - (y * sin 45º)
        // y' = (x * sin 45º) + (y * cos 45º)


        // Big Blue Triangle
        this.scene.pushMatrix();
        this.scene.translate(0,2 * Math.sqrt(2),0);
        this.scene.rotate(-135* (Math.PI/180), 0,0,1);
        this.bigTriangleMaterial2.apply();
        this.bigTriangle.display();
        this.scene.popMatrix();

        // Medium Pink Triangle

        this.scene.pushMatrix();
        this.scene.translate(0,- Math.sqrt(2),0);
        this.scene.rotate(-45 * (Math.PI/180),0,0,1);
        this.triangleMaterial.apply();
        this.triangle.display();
        this.scene.popMatrix();


        // Small Red Triangle

        this.scene.pushMatrix();
        this.scene.translate(0.5, -3.33,0);
        this.scene.rotate(135* (Math.PI/180), 0,0,1);
        this.smallTriangleMaterial1.apply();
        this.smallTriangle.display();
        this.scene.popMatrix();

        // Small Purple Triangle

        this.scene.pushMatrix();
        this.scene.translate(1.5*Math.sqrt(2), -3.33,0);
        this.scene.rotate(135* (Math.PI/180), 0,0,1);
        this.smallTriangleMaterial2.apply();
        this.smallTriangle.display();
        this.scene.popMatrix();


        // Yellow Parallelogram

        this.scene.pushMatrix();
        this.scene.scale(1,-1,1);
        this.scene.rotate(45 * (Math.PI/180), 0,0,1);
        this.parallelogramMaterial.apply();
        this.parallelogram.display();
        this.scene.popMatrix();
    }

    // Make Normal Vector Visible in the Scene
    enableNormalViz(){
        this.diamond.enableNormalViz()
        this.bigTriangle.enableNormalViz()
        this.smallTriangle.enableNormalViz()
        this.parallelogram.enableNormalViz()
        this.triangle.enableNormalViz()
    };

    // Make Normal Vectors Invisible
    disableNormalViz(){
        this.diamond.disableNormalViz()
        this.bigTriangle.disableNormalViz()
        this.smallTriangle.disableNormalViz()
        this.parallelogram.disableNormalViz()
        this.triangle.disableNormalViz()
    };
}

