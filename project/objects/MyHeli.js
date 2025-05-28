import {CGFobject} from '../../lib/CGF.js';
import { MyCylinder } from '../geometric/MyCylinder.js';
import { MyCube } from '../geometric/MyCube.js';
import { MyTrapezoid } from '../geometric/MyTrapezoid.js';
import { MyTriangle } from '../geometric/MyTriangle.js';

/**
 * MyHeli
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyHeli extends CGFobject {
    constructor(scene) {
        super(scene);

        this.scene = scene;

        // Wings
        this.trapezoid = new MyTrapezoid(scene, 1, 0.5, 1,.25);
        this.trapezoidBase = new MyCube(scene, .5, 1, .25);
        this.wingSupport = new MyCube(scene, .25, .5, 2.5);

        // Helix
        this.helixSupport = new MyCylinder(scene, 64, 64);
        this.helixSupportBase = new MyCylinder(scene, 64, 64);
        this.blade = new MyTrapezoid(scene, 5, 4.5, .5,.25);
        this.bladeSupport = new MyCube(scene, .25, .5, .25);

        // Tail Flap
        this.tailFlap = new MyTriangle(scene, 1, 1, .25);

        // Bottom Supports
        this.bottomSupport = new MyCube(scene, .5, .5, 8);
        this.bottomSupport2 = new MyCube(scene, .5, .5, 1);

        this.bottomConnector = new MyCube(scene, 1.25, .35, .35);
        this.bottomConnector2 = new MyCube(scene, .5, .35, .35);

        // Tail
        this.tailBase = new MyTrapezoid(scene, 1.5, 1, 8, .5);
        this.tailTop = new MyTriangle(scene,.5,5.5,.5);

        // Body
        this.bodyTailConnect = new MyTriangle(scene, 1.5, 2, .5);
        this.bodySupport = new MyCube(scene, .35, 6.5, 5.5);
        this.helixBodyBase = new MyTrapezoid(scene, 4, 3.5, 1.5, 1);
        this.helixBodyWrap = new MyTrapezoid(scene, 4.5, 4, 1, 1.5);

        this.mainBodyUp = new MyTrapezoid(scene, 6, 5, 3, 2.7);
        this.mainBodyDown = new MyTrapezoid(scene, 8.35, 7.35, 3, 2.7);

        this.windshield = new MyTrapezoid(scene, 2.3, .8, 2.8, 2.4);
    }

    display(){
        // Display The Top Helix
        // this.displayHelix();

        // Display The Bottom Support
        // this.scene.pushMatrix();
        // this.scene.rotate(Math.PI/2, 0, 1, 0);
        // this.displayBottomSupport(1);
        // this.scene.translate(6,0,0);
        // this.displayBottomSupport(-1);
        // this.scene.popMatrix();

        // Display The Main Body
        this.displayBody();

        // Display The Tail
        // this.displayTail();

        // Display The Back Helix and Blades
        // this.displayBackHelix();

        // Display The Wings
        // this.scene.pushMatrix();
        // this.scene.translate(4.5, .5, 3);
        // this.scene.rotate(-Math.PI/2, 0, 0, 0);
        // this.displayWings(-1);
        // this.scene.translate(0, 0, -5.5);
        // this.scene.rotate(Math.PI/2, 0, 0, 0);
        // this.displayWings(1);
        // this.scene.popMatrix();


        // Display The Bucket
        this.displayBucket();

    }

    displayHelix(bladeScaleFactor = 1){
        // Support
        this.scene.pushMatrix();
        this.scene.translate(0, .5, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(.55, .55, 2);
        this.scene.textureManager.metalMaterialOG.apply();
        this.helixSupport.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(1, 1, .5);
        this.scene.textureManager.metalMaterialOG.apply();
        this.helixSupportBase.display();
        this.scene.popMatrix();

        // Blades Support
        this.scene.pushMatrix();
        this.scene.translate(0, 1.75, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(1.1, 1.1, .5);
        this.scene.textureManager.metalMaterialOG.apply();
        this.scene.textureManager.metalMaterialOG.setAmbient(0.9, 0.9, 0.9, 1);
        this.scene.textureManager.metalMaterialOG.setDiffuse(0.9, 0.9, 0.9, 1);
        this.scene.textureManager.metalMaterialOG.setSpecular(0.1, 0.1, 0.1, 1);
        this.helixSupportBase.display();
        this.scene.popMatrix();

        // Blades
        this.scene.pushMatrix();
        this.scene.translate(-1.25, 2, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(bladeScaleFactor * 4, 2, 1);
        this.scene.textureManager.metalMaterialOG.apply();
        this.displayBlade();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 2, 1.25);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.scene.scale(bladeScaleFactor * 4, 2, 1);
        this.scene.textureManager.metalMaterialOG.apply();
        this.displayBlade();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.25, 2, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.scale(bladeScaleFactor * 4, 2, 1);
        this.scene.textureManager.metalMaterialOG.apply();
        this.displayBlade();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 2, -1.25);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.rotate(-Math.PI/2, 0, 0, 1);
        this.scene.scale(bladeScaleFactor * 4, 2, 1);
        this.scene.textureManager.metalMaterialOG.apply();
        this.displayBlade();
        this.scene.popMatrix();


    }

    displayBlade(){
        this.scene.pushMatrix();
        this.scene.translate(0, -.125, 0);
        this.bladeSupport.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.blade.display();
        this.scene.popMatrix();
    }

    displayBottomSupport(leftSupport){
        // Left Support is either 1 or -1 that indicates the position of the support
        // Main Support
        this.scene.pushMatrix();
        this.scene.textureManager.metalMaterialOG.apply();
        this.bottomSupport.display();
        this.scene.translate(0, .28, 4.2);
        this.scene.rotate(-Math.PI/4, 1, 0, 0);
        this.bottomSupport2.display();
        this.scene.popMatrix();

        // Supports Connections
        this.scene.pushMatrix();
        this.scene.translate(leftSupport * .05, .5, 2);
        this.bottomConnector.display();
        this.scene.translate(leftSupport * .1, .75, 0);
        this.scene.rotate(leftSupport * -Math.PI/5.5, 0, 0, 1);
        this.bottomConnector2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(leftSupport * .05, .5, -2);
        this.bottomConnector.display();
        this.scene.translate(leftSupport * .1, .75, 0);
        this.scene.rotate(leftSupport * -Math.PI/5.5, 0, 0, 1);
        this.scene.textureManager.metalMaterialOG.apply();
        this.bottomConnector2.display();
        this.scene.popMatrix();

    }

    displayBody(){

        // Body Connecting With Tail
        // this.scene.gl.enable(this.scene.gl.POLYGON_OFFSET_FILL); // Avoid twitching with Intersection Polygons
        // this.scene.gl.polygonOffset(2.0, 2.0); // Offset factor and units
        //
        // this.scene.pushMatrix();
        // this.scene.translate(6.85, 1.25, .25);
        // this.scene.rotate(Math.PI, 0, 1, 0);
        // this.scene.scale(1,1,2);
        // this.bodyTailConnect.display();
        // this.scene.popMatrix();
        // this.scene.gl.disable(this.scene.gl.POLYGON_OFFSET_FILL);
        //
        // // Top Part Connecting to Helix
        // this.scene.gl.enable(this.scene.gl.POLYGON_OFFSET_FILL); // Avoid twitching with Intersection Polygons
        // this.scene.gl.polygonOffset(5.0, 5.0); // Offset factor and units
        //
        // this.scene.pushMatrix();
        // this.scene.translate(11.6, 1.25, .25);
        // this.scene.rotate(Math.PI, 0, 0, 0);
        // this.helixBodyBase.display();
        // this.scene.popMatrix();
        //
        // // Top Part Wrap
        // this.scene.pushMatrix();
        // this.scene.translate(12.1, 1, .25);
        // this.scene.rotate(Math.PI, 0, 0, 0);
        // this.helixBodyWrap.display();
        // this.scene.popMatrix();
        //
        //
        // this.scene.gl.disable(this.scene.gl.POLYGON_OFFSET_FILL);


        // Main Body Up
        this.scene.gl.enable(this.scene.gl.POLYGON_OFFSET_FILL); // Avoid twitching with Intersection Polygons
        this.scene.gl.polygonOffset(2.0, 2.0); // Offset factor and units

        this.scene.pushMatrix();
        this.scene.translate(13.35, -1, .25);
        this.scene.rotate(Math.PI, 0, 0, 0);
        this.mainBodyUp.display();
        this.scene.popMatrix();

        // Main Body Down
        this.scene.pushMatrix();
        this.scene.translate(8.3, -4, .25);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.mainBodyDown.display();
        this.scene.popMatrix();


        // Back Body

        // Front Body


        // Bottom Base (Connected to the bottom support)
        // this.scene.pushMatrix();
        // this.scene.translate(0, 1.25,-3)
        // this.bodySupport.display();
        // this.scene.popMatrix();

        // WindShield
        this.scene.pushMatrix();
        this.scene.translate(14.5, -1.1, .25);
        this.scene.rotate(Math.PI, 0, 0, 0);
        this.windshield.display();
        this.scene.popMatrix();

        this.scene.gl.disable(this.scene.gl.POLYGON_OFFSET_FILL);

    }


    displayTail(){
        // Tail
        this.scene.gl.enable(this.scene.gl.POLYGON_OFFSET_FILL); // Avoid twitching with Intersection Polygons
        this.scene.gl.polygonOffset(2.0, 2.0); // Offset factor and units
        this.scene.pushMatrix();
        this.scene.translate(2.5,-.75,.25);
        this.scene.rotate(-Math.PI/2, 0, 0, 1);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.textureManager.metalMaterial2.apply();
        this.tailBase.display();
        this.scene.popMatrix();
        this.scene.gl.disable(this.scene.gl.POLYGON_OFFSET_FILL);

        // Upper Tail
        this.scene.pushMatrix();
        this.scene.translate(3.75, .75, .25);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.textureManager.metalMaterial.apply();
        this.tailTop.display();
        this.scene.popMatrix();
    }

    displayBackHelix(){
        // Back Helix
        this.scene.pushMatrix();
        this.scene.translate(0, 1.5, .25);
        this.scene.scale(2, 2, 2);
        this.displayTailFlap();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -1.5, .25);
        this.scene.scale(2, 2, 2);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.displayTailFlap();
        this.scene.popMatrix();


        // Back Blades
        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(.25, .25, .25);
        this.displayHelix(.35);
        this.scene.popMatrix();
    }

    displayTailFlap(){
        this.scene.pushMatrix();
        this.scene.textureManager.metalMaterial.apply();
        this.tailFlap.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI, 1, 0, 0);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.scene.translate(0, 1, 0);
        this.scene.textureManager.metalMaterial.apply();
        this.tailFlap.display();
        this.scene.popMatrix();
    }

    displayWings(zPosition){
        // zPosition is either 1 or -1 that indicates the position of the wing support

        // Wings
        this.scene.pushMatrix();
        this.scene.translate(0.25, 0, 0);
        this.scene.textureManager.metalMaterial.apply();
        this.trapezoid.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -.75, 0);
        this.trapezoidBase.display();
        this.scene.popMatrix();

        // Wings Support
        this.scene.pushMatrix();
        this.scene.textureManager.metalMaterial2.apply();
        this.scene.translate(0, -.5, zPosition* 1.25);
        this.wingSupport.display();
        this.scene.popMatrix();

    }

    displayBucket(){
        // Bucket

        // Bucket Support
    }

}

