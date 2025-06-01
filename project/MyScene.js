import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture } from "../lib/CGF.js";
import { TextureManager } from "./textures/TextureManager.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./geometric/MySphere.js"
import { MyCube } from "./geometric/MyCube.js";
import { MyBuilding } from "./objects/MyBuilding.js";
import {MyTree} from "./geometric/MyTree.js";
import {MyForest} from "./geometric/MyForest.js";
import { MyPanoram } from "./objects/MyPanoram.js";
import { MyHeli } from "./objects/MyHeli.js";
import { MyLake } from './geometric/MyLake.js';

/**
 * MyScene class represents the main scene of the WebGL application.
 * It extends the CGFscene class provided by the CGF.js library.
 *
 * @constructor
 */
export class MyScene extends CGFscene {
    /**
     * Initializes the MyScene instance.
     */
    constructor() {
        super();
    }

    /**
     * Initializes the WebGL application.
     *
     * @param {CGFApplication} application - The CGFApplication instance.
     */
    init(application) {
        super.init(application);

    this.initCameras();
    this.initLights();

    this.textureManager = new TextureManager(this);

    //Background color
    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.setUpdatePeriod(50);

    this.axis = new CGFaxis(this, 20, 1);

    this.panoram = new MyPanoram(this, this.textureManager.panoramaTexture);
    this.sphere = new MySphere(this,40,20);
    this.plane = new MyPlane(this,64,0,30,0,30);
    this.road = new MyPlane(this,64,0,1,0,35);
    this.lake = new MyLake(this, 50, 32); 

        this.heli = new MyHeli(this);
        this.building = new MyBuilding(this);

    this.selectedObject = 0;
    this.selectedMaterial = 0;
    this.displayAxis = false;
    this.scaleFactor = 20.0;
    this.ambientlightFactor = 0.3;
    this.cameraZoom = 1;
    this.speedFactor = 1;
    this.leftForest1 = new MyForest(this, 10, 7, false,310,350);  // normal trees (10,7)
    this.leftForest2 = new MyForest(this, 10, 7, false,310,350);
    
    this.rightForest1 = new MyForest(this, 15, 7, true); // trees on fire (15,7)
    this.rightForest2 = new MyForest(this, 15, 7, false);
    


  }
  initLights() {
    this.setGlobalAmbientLight(0.3, 0.3, 0.3, 1.0);

    this.lights[0].setPosition(50.0, 50.0, 50.0, 1.0);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].setSpecular(1.0, 1.0, 1.0, 1.0);
    this.lights[0].enable();
    this.lights[0].setVisible(true);
    this.lights[0].update();

    this.lights[1].setPosition(-50.0, 50.0, 50.0, 1.0);
    this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[1].setSpecular(1.0, 1.0, 1.0, 1.0);
    this.lights[1].enable();
    this.lights[1].setVisible(true);
    this.lights[1].update();
  }

    /**
     * Initializes the camera settings.
     */
    initCameras() {
        this.camera = new CGFcamera(
            this.cameraZoom, // Field of View
            0.1, // Near Clipping Plane
            1000, // Far Clipping Plane
            vec3.fromValues(0, 30, -120), // Camera Position
            vec3.fromValues(0, 10, 0) // Target Position
        );
    }

    /**
     * Resets the camera settings to their initial state.
     */
    resetCamera() {
        console.log("Resetting camera");
        this.camera.setPosition(vec3.fromValues(200, 200, 200));
        this.camera.setTarget(vec3.fromValues(0, 0, 0));
        this.cameraZoom = 0.4;
        this.updateProjectionMatrix();
    }

/**
 * Checks for user input and updates the scene accordingly.
 *
 * @param {number} t - The current time in milliseconds.
 */
  checkKeys(t) {
    const f = this.speedFactor * 2;
    if (this.gui.isKeyPressed("KeyW")) 
      this.heli.accelerate(4 * f);

    if (this.gui.isKeyPressed("KeyS")) 
      this.heli.accelerate(-1.5*f);

    if (this.gui.isKeyPressed("KeyD"))
      this.heli.turn(0.02 * f);

    if (this.gui.isKeyPressed("KeyA"))
       this.heli.turn(-0.02 * f);

    if (this.gui.isKeyPressed("KeyP")){
      this.heli.takeOff();
    }

    if (this.gui.isKeyPressed("KeyL"))
       this.heli.land();

    if (this.gui.isKeyPressed("KeyR")) 
      this.heli.reset();

    if (this.gui.isKeyPressed("KeyO")) {
      this.heli.dropWater();
    }
  }

/**
 * Extinguishes the fire in the forest.
 */
  extinguishFire() {
    this.rightForest1.extinguish();
    this.rightForest2.extinguish();
}

    /**
     * Updates the scene based on the elapsed time.
     *
     * @param {number} t - The current time in milliseconds.
     */
    update(t) {
      const now = performance.now();
      const delta = now - (this.lastTime || now);
      this.lastTime = now;
  
      this.checkKeys(t);
      this.heli.update(delta, this.speedFactor);

      if (this.heli.checkFireExtinguishing()) {
        this.extinguishFire();
    }
      let heliState = 'normal';
      if (this.heli.isLanding()) {
          heliState = 'landing';
      } else if (this.heli.isTakingOff()) {
          heliState = 'takeoff';
      }
      
      this.building.updateHelipadState(heliState, delta);
      this.building.update(t);

      const timeFactor = t / 100 % 100;
      this.rightForest1.update(timeFactor);
      this.lake.update(timeFactor);
  }

    /**
     * Sets the default appearance for the WebGL objects.
     */
    setDefaultAppearance() {
        this.setAmbient(0.5, 0.5, 0.5, 1.0);
        this.setDiffuse(0.5, 0.5, 0.5, 1.0);
        this.setSpecular(0.5, 0.5, 0.5, 1.0);
        this.setShininess(10.0);
    }

    /**
     * Updates the projection matrix based on the camera settings.
     */
    updateProjectionMatrix() {
        this.camera.fov = this.cameraZoom;
        super.updateProjectionMatrix();
    }

    /**
     * Renders the scene.
     */
    display() {
        // ---- BEGIN Background, camera and axis setup
        // Clear image and depth buffer everytime we update the env
        this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        // Initialize Model-View matrix as identity (no transformation
        this.updateProjectionMatrix();
        this.loadIdentity();
        // Apply transformations corresponding to the camera position relative to the origin
        this.applyViewMatrix();

    // Update Lights
    this.lights[0].update();
    this.lights[1].update();

    // Update global ambient light
    this.setGlobalAmbientLight(
        this.ambientlightFactor,
        this.ambientlightFactor,
        this.ambientlightFactor,
        1.0
    );

    // Draw axis
    if(this.displayAxis){
      this.axis.display();
    }

    this.setDefaultAppearance();

        //interior

        this.panoram.display();

        //plane
        this.pushMatrix();
        this.textureManager.grassMaterial.apply();
        this.rotate(-Math.PI / 2, 1, 0, 0);
        this.scale(500, 500, 1);
        this.plane.display();
        this.popMatrix();

        //road
        this.pushMatrix();
        this.textureManager.roadMaterial.apply();
        this.translate(0, 0.05, 0);
        this.rotate(-Math.PI / 2, 1, 0, 0);
        this.translate(-6, -75, 0);
        this.scale(15, 300, 1);
        this.road.display();
        this.popMatrix();

        // left forest 1
        this.pushMatrix();
        this.scale(0.5, 0.5, 0.5);
        this.translate(-185, 0, -250);
        this.leftForest1.display();
        this.popMatrix();

        // left forest 2
        this.pushMatrix();
        this.scale(0.5, 0.5, 0.5);
        this.translate(-185, 0, 250);
        this.leftForest2.display();
        this.popMatrix();

        // right forest 1
        this.pushMatrix();
        this.scale(0.5, 0.5, 0.5);
        this.translate(225, 0, -50);
        this.rightForest1.display();
        this.popMatrix();

        //right forest 2
        this.pushMatrix();
        this.scale(0.5, 0.5, 0.5);
        this.translate(225, 0, 50); // ← was -150
        this.rightForest2.display();
        this.popMatrix();

        //heli
        this.pushMatrix();
        this.translate(4.4, 16, -87);
        this.scale(0.5, 0.5, 0.5);
        this.heli.display();
        this.popMatrix();

        //building
        this.pushMatrix();
        this.translate(0, 0, -80);
        this.building.display();
        this.popMatrix();

        // lake
        this.pushMatrix();
        this.translate(-70, 0.1, -9);
        this.scale(-0.5, 0, -0.5);
        this.lake.display();
        this.popMatrix();

        this.setDefaultAppearance();
    }
}
