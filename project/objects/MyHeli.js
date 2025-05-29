import { CGFobject } from '../../lib/CGF.js';
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

        this.helixRotationAngle = 0;

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
        this.tailFlap = new MyTriangle(scene, 1, 1, .5);

        // Bottom Supports
        this.bottomSupport = new MyCube(scene, .5, .5, 8);
        this.bottomSupport2 = new MyCube(scene, .5, .5, 1);

        this.bottomConnector = new MyCube(scene, 1.25, .35, .35);
        this.bottomConnector2 = new MyCube(scene, .5, .35, .35);

        // Tail
        this.tailBase = new MyTrapezoid(scene, 1.5, 1, 8, 1.5);
        this.tailTop = new MyTriangle(scene,.5,5.5,1.5);

        // Body
        this.bodyTailConnect = new MyTriangle(scene, 1.5, 2, 1.5);
        this.bodySupport = new MyCube(scene, .35, 6, 4);
        this.helixBodyBase = new MyTrapezoid(scene, 4, 3.5, 1.5, 3);
        this.helixBodyWrap = new MyTrapezoid(scene, 4.5, 4, 1, 3.5);

        this.mainBodyUp = new MyTrapezoid(scene, 6, 5, 3, 4.7);
        this.mainBodyDown = new MyTrapezoid(scene, 7.6, 6.6, 3, 4.7);

        this.frontPartDown = new MyTrapezoid(scene, 2, 1.5, 1.5, 4.7);
        this.frontPartUp = new MyTriangle(scene, 1.5, 2, 4.7);

        // this.backPartUp = new MyTriangle(scene, .85, 2, 3);
        // this.backPartUp = new MyTrapezoid(scene, 3, 2.15, 3, 3.5);
        this.backPartUp2 = new MyTrapezoid(scene, 3,2.15,3,3)
        this.backPartDown = new MyTrapezoid(scene, 3,2.15,3,1.5)


        this.windshield = new MyTrapezoid(scene, 2.3, .8, 2.8, 4.3);
        this.windshieldDiv = new MyCube(scene, .2, 1, .3);
        this.windshieldDiv2 = new MyCube(scene, .2, 3.4, .3);

        this.bucketString = new MyCube(scene, 5, .3, .3);
        this.bucket = new MyCylinder(scene, 64, 64);

        // Motion state
        this.position = { x: 0, y: 0, z: 0 };
        this.velocity = { x: 0, z: 0 };
        this.acceleration = { x: 0, z: 0 };
        this.orientation = 0;

        // Vertical control
        this.targetY = 0;
        this.verticalSpeed = 5; // units/second
        this.cruiseAltitude = 30;
        this.in_air = false;

        this.maxSpeed = 10;
        this.drag = 0.92;

        this.initBuffers();
    }

    // update(deltaTime) {
    //     this.helixRotationAngle += deltaTime * 0.005;
    // }

    display() {
        this.scene.pushMatrix();
        this.scene.translate(this.position.x, this.position.y, this.position.z);
        this.scene.rotate(this.orientation, 0, 1, 0);

        this.scene.scale(1, 1, 1);
        // this.scene.defaultAppearance?.apply();

        // super.display();
        this.scene.rotate(-Math.PI/2,0,1,0);
        this.displayHeli();
        this.scene.popMatrix();
    }

    displayHeli(){
        // Display The Top Helix
        this.scene.pushMatrix();
        this.scene.translate(9.5,2,.25);
        this.scene.scale(.75, .75, .75);
        this.displayHelix(.65);
        this.scene.popMatrix();

        // Display The Bottom Support
        this.scene.pushMatrix();
        this.scene.translate(12, -6.65,2.4);
        this.scene.scale(.75, .75, .75);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.displayBottomSupport(1);
        this.scene.translate(5.75,0,0);
        this.displayBottomSupport(-1);
        this.scene.popMatrix();

        // Display The Main Body
        this.displayBody();

        // Display The Tail
        this.displayTail();

        // Display The Back Helix and Blades
        this.displayBackHelix();

        // Display The Wings
        this.scene.pushMatrix();
        this.scene.translate(4.5, .5, 3);
        this.scene.rotate(-Math.PI/2, 0, 0, 0);
        this.displayWings(-1);
        this.scene.translate(0, 0, -5.5);
        this.scene.rotate(Math.PI/2, 0, 0, 0);
        this.displayWings(1);
        this.scene.popMatrix();

        // Display The Bucket
        // this.displayBucket();

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
        this.scene.gl.enable(this.scene.gl.POLYGON_OFFSET_FILL); // Avoid twitching with Intersection Polygons
        this.scene.gl.polygonOffset(2.0, 2.0); // Offset factor and units

        this.scene.pushMatrix();
        this.scene.translate(6.85, 1.25, .25);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(1,1,2);
        this.scene.textureManager.metalMaterial.apply();
        this.bodyTailConnect.display();
        this.scene.popMatrix();
        this.scene.gl.disable(this.scene.gl.POLYGON_OFFSET_FILL);

        // Top Part Connecting to Helix
        this.scene.gl.enable(this.scene.gl.POLYGON_OFFSET_FILL); // Avoid twitching with Intersection Polygons
        this.scene.gl.polygonOffset(5.0, 5.0); // Offset factor and units

        this.scene.pushMatrix();
        this.scene.translate(11.6, 1.25, .25);
        this.scene.rotate(Math.PI, 0, 0, 0);
        this.helixBodyBase.display();
        this.scene.popMatrix();

        // Top Part Wrap
        this.scene.pushMatrix();
        this.scene.translate(12.1, 1, .25);
        this.scene.rotate(Math.PI, 0, 0, 0);
        this.helixBodyWrap.display();
        this.scene.popMatrix();


        this.scene.gl.disable(this.scene.gl.POLYGON_OFFSET_FILL);


        // Main Body Up
        this.scene.gl.enable(this.scene.gl.POLYGON_OFFSET_FILL); // Avoid twitching with Intersection Polygons
        this.scene.gl.polygonOffset(2.0, 2.0); // Offset factor and units

        this.scene.pushMatrix();
        this.scene.translate(13.35, -1, .25);
        this.scene.rotate(Math.PI, 0, 0, 0);
        this.scene.textureManager.metalMaterial2.apply();
        this.mainBodyUp.display();
        this.scene.popMatrix();

        // Main Body Down
        this.scene.pushMatrix();
        this.scene.translate(8.35, -4, .25);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.textureManager.metalMaterial.apply();
        this.mainBodyDown.display();
        this.scene.popMatrix();


        // Back Body
        // this.scene.pushMatrix();
        // this.scene.rotate(Math.PI, 0, -1, 1);
        // this.scene.translate(-6.85,1.6,1);
        // this.backPartUp.display();
        // this.scene.translate(0,-2.3,0);
        // this.scene.rotate(Math.PI, 1, 0, 0);
        // this.backPartUp.display();
        // this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(6.3,-1,.25);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.textureManager.metalMaterial2.apply();
        this.backPartUp2.display();
        this.scene.popMatrix();


        // this.scene.pushMatrix();
        // this.scene.translate(6.3,-4,.25);
        // this.scene.rotate(Math.PI, 0, 0, 1);
        // this.backPartDown.display();
        // this.scene.popMatrix();

        // Front Body
        this.scene.pushMatrix();
        this.scene.translate(17.1, -4.75, .25);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.textureManager.metalMaterial.apply();
        this.frontPartDown.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(16.35, -3.25, .25);
        this.frontPartUp.display();
        this.scene.popMatrix();

        // Bottom Base (Connected to the bottom support)
        this.scene.pushMatrix();
        this.scene.translate(12, -5.65,.25)
        this.bodySupport.display();
        this.scene.popMatrix();

        // WindShield
        this.scene.pushMatrix();
        this.scene.translate(14.5, -1.1, .25);
        this.scene.rotate(Math.PI, 0, 0, 0);
        this.scene.textureManager.metalMaterialOG2.apply();
        this.windshield.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(13.25, .35, .25);
        this.scene.textureManager.metalMaterial2.apply();
        this.windshieldDiv.display();
        this.scene.translate(1.27, -1.45, 0);
        this.scene.rotate(-Math.PI/3, 0, 0, 1);
        this.windshieldDiv2.display();
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
        this.scene.translate(0,0,-.5)
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
        this.scene.pushMatrix();
        this.scene.translate(0, -1.5, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(2, 2, 3);
        this.scene.textureManager.metalMaterial2.apply();
        this.bucket.display();
        this.scene.popMatrix();


        // Inner Bucket (Hollow Effect)
        this.scene.pushMatrix();
        this.scene.translate(0, -1.5, 0);
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.scene.scale(1.8, 1.8, 2.8); // Slightly smaller to create the hollow effect
        this.scene.textureManager.metalMaterialOG2.apply(); // Use a darker or contrasting material
        this.bucket.display();
        this.scene.popMatrix();


        // Bucket Support
        this.scene.pushMatrix();
        this.scene.textureManager.metalMaterialOG.apply();
        this.bucketString.display();
        this.scene.popMatrix();
    }



    takeOff() {
        if (!this.in_air) {
            this.in_air = true;
            this.targetY = this.cruiseAltitude;
        }
    }

    land() {
        if (this.in_air) {
            this.in_air = false;
            this.targetY = 0;
            this.velocity = { x: 0, z: 0 };
        }
    }

    reset() {
        this.position = { x: 0, y: 0, z: 0 };
        this.velocity = { x: 0, z: 0 };
        this.orientation = 0;
        this.in_air = false;
        this.targetY = 0;
    }

    accelerate(v) {
        if (!this.in_air) return;

        const dirX = Math.sin(this.orientation);
        const dirZ = Math.cos(this.orientation);
        this.acceleration.x += v * dirX;
        this.acceleration.z += v * dirZ;
    }

    turn(v) {
        if (!this.in_air) return;

        this.orientation += v;

        const speed = Math.hypot(this.velocity.x, this.velocity.z);
        this.velocity.x = speed * Math.sin(this.orientation);
        this.velocity.z = speed * Math.cos(this.orientation);
    }

    update(deltaTime, speedFactor = 1.0) {
        const delta = deltaTime / 1000;

        if (this.in_air) {
            this.velocity.x += this.acceleration.x * delta * speedFactor;
            this.velocity.z += this.acceleration.z * delta * speedFactor;

            this.velocity.x *= this.drag;
            this.velocity.z *= this.drag;

            const speed = Math.hypot(this.velocity.x, this.velocity.z);
            if (speed > this.maxSpeed) {
                const scale = this.maxSpeed / speed;
                this.velocity.x *= scale;
                this.velocity.z *= scale;
            }

            this.position.x += this.velocity.x * delta;
            this.position.z += this.velocity.z * delta;
        }

        this.acceleration = { x: 0, z: 0 };

        const dy = this.targetY - this.position.y;
        if (Math.abs(dy) > 0.01) {
            const dir = Math.sign(dy);
            const step = this.verticalSpeed * delta;
            this.position.y += dir * Math.min(Math.abs(dy), step);
        } else {
            this.position.y = this.targetY;
        }
    }
}
