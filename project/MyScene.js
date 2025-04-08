import { CGFscene, CGFcamera, CGFaxis, CGFappearance } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./geometric/MySphere.js"
import { MyCube } from "./geometric/MyCube.js";
import { MyBuilding } from "./objects/MyBuilding.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene extends CGFscene {
  constructor() {
    super();
  }
  init(application) {
    super.init(application);

    this.initCameras();
    this.initLights();
    this.initMaterials();

    //Background color
    this.gl.clearColor(0, 0, 0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);

    this.enableTextures(true);

    this.setUpdatePeriod(50);

    this.axis = new CGFaxis(this, 20, 1);

    //Initialize env objects
    this.objects = [
        new MyPlane(this, 64),
        new MySphere(this, 1, 128, 128),
        new MyCube(this, 1, 1, 1),
        new MyBuilding(this)
    ];

    //Ob
    this.objectList = {
      'Plane' : 0,
      'Sphere' : 1,
      'Cube' : 2,
      'Building' : 3
    }

    this.selectedObject = 0;
    this.selectedMaterial = 0;
    this.displayAxis = true;
    this.scaleFactor = 20.0;
    this.ambientlightFactor = 0.3;
    this.cameraZoom = 0.4;

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

  initCameras() {
    this.camera = new CGFcamera(
      0.4, // Field of View
      0.1, // Near Clipping Plane
      1000, // Far Clipping Plane
      vec3.fromValues(200, 200, 200), // Camera Position
      vec3.fromValues(0, 0, 0) // Target Position
    );
  }

  resetCamera() {
    console.log("Resetting camera");
    this.camera.setPosition(vec3.fromValues(200, 200, 200));
    this.camera.setTarget(vec3.fromValues(0, 0, 0));
    this.cameraZoom = 0.4;
    this.updateProjectionMatrix()
  }


  checkKeys() {
    var text = "Keys pressed: ";
    var keysPressed = false;

    // Check for key codes e.g. in https://keycode.info/
    if (this.gui.isKeyPressed("KeyW")) {
      text += " W ";
      keysPressed = true;
    }

    if (this.gui.isKeyPressed("KeyS")) {
      text += " S ";
      keysPressed = true;
    }
    if (keysPressed)
      console.log(text);
  }

  initMaterials() {
    // Default Material
    this.defaultMaterial = new CGFappearance(this);
    this.defaultMaterial.setAmbient(0.1, 0.1, 0.1, 0.3); // Low ambient, semi-transparent
    this.defaultMaterial.setDiffuse(0.2, 0.2, 0.2, 0.3); // Low diffuse, semi-transparent
    this.defaultMaterial.setSpecular(1.0, 1.0, 1.0, 0.3); // High specular for shininess
    this.defaultMaterial.setShininess(150.0); // High shininess for a glass-like effect
    

    // Earth Material
    this.earthMaterial = new CGFappearance(this);
    this.earthMaterial.setAmbient(0.7, 0.7, 0.7, 1.0);
    this.earthMaterial.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.earthMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.earthMaterial.setShininess(20.0);
    this.earthMaterial.loadTexture('./textures/earth.png') // Load the earth texture
    this.earthMaterial.setTextureWrap('REPEAT', 'REPEAT');

    // Material Lists
    this.materials = [this.defaultMaterial, this.earthMaterial];

    this.materialIDs = {
        'Default': 0,
        'Earth': 1
    };
  }

  update(t) {
    this.checkKeys();
  }

  setDefaultAppearance() {
    this.setAmbient(0.5, 0.5, 0.5, 1.0);
    this.setDiffuse(0.5, 0.5, 0.5, 1.0);
    this.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.setShininess(10.0);
  }

  updateProjectionMatrix() {
    this.camera.fov = this.cameraZoom;
    super.updateProjectionMatrix();
  }

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

    // ---- BEGIN Geometric transformation section


    this.pushMatrix();
    this.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);

    this.materials[this.selectedMaterial].apply();
    this.objects[this.selectedObject].display();

    this.popMatrix();

  }
}
