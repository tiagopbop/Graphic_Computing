import { CGFscene, CGFcamera, CGFaxis} from "../lib/CGF.js";
import { TextureManager } from "./textures/TextureManager.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./geometric/MySphere.js"
import { MyCube } from "./geometric/MyCube.js";
import { MyBuilding_Old } from "./objects/MyBuilding_Old.js";
import { MyBuilding } from "./objects/MyBuilding.js";
import { MyWindow } from "./objects/MyWindow.js";
import { MyHeli } from "./objects/MyHeli.js";
// import { MyLake } from "./env/MyLake.js";

/**
 * MyScene
 * @constructor
 */
export class MyScene2 extends CGFscene {
  constructor() {
    super();
  }

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

    //Initialize env objects
    this.objects = [
      new MyPlane(this, 64),
      new MySphere(this, 5, 128, 128),
      new MyCube(this, 1, 1, 1),
      new MyBuilding_Old(this),
      new MyBuilding(this),
      new MyWindow(this),
      new MyHeli(this),
      // new MyLake(this)
    ];

    //Ob
    this.objectList = {
      'Plane': 0,
      'Sphere': 1,
      'Cube': 2,
      'BuildingOld': 3,
      'Building': 4,
      'Window': 5,
      'Heli': 6,
      // 'Lake' : 7

    }

    this.selectedObject = 6;
    this.selectedMaterial = 0;
    this.displayAxis = true;
    this.scaleFactor = 10.0;
    this.ambientlightFactor = 0.6;
    this.cameraZoom = 0.35;

  }

  initLights() {
    this.setGlobalAmbientLight(0.3, 0.3, 0.3, 1.0);

    this.lights[0].setPosition(40.0, 100.0, 40.0, 1.0);
    this.lights[0].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[0].setSpecular(1.0, 1.0, 1.0, 1.0);
    this.lights[0].setConstantAttenuation(1.0);
    this.lights[0].setLinearAttenuation(0.01);
    this.lights[0].setQuadraticAttenuation(0.001);
    this.lights[0].enable();
    this.lights[0].setVisible(true);
    this.lights[0].update();

    this.lights[1].setPosition(-40.0, 100.0, -40.0, 1.0);
    this.lights[1].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[1].setSpecular(1.0, 1.0, 1.0, 1.0);
    this.lights[1].setConstantAttenuation(1.0);
    this.lights[1].setLinearAttenuation(0.01);
    this.lights[1].setQuadraticAttenuation(0.001);
    this.lights[1].enable();
    this.lights[1].setVisible(true);
    this.lights[1].update();

    this.lights[2].setPosition(0.0, 150.0, 0.0, 1.0);
    this.lights[2].setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.lights[2].enable();
    this.lights[2].update();
  }

  initCameras() {
    this.camera = new CGFcamera(
        0.6, // Field of View
        0.1, // Near Clipping Plane
        1000, // Far Clipping Plane
        vec3.fromValues(400, 400, 400), // Camera Position
        vec3.fromValues(0, 0, 0) // Target Position
    );
  }

  resetCamera() {
    console.log("Resetting camera");
    this.camera.setPosition(vec3.fromValues(400, 400, 400));
    this.camera.setTarget(vec3.fromValues(0, 0, 0));
    this.cameraZoom = 0.6;
    this.updateProjectionMatrix()
  }

    moveCameraLR(offset) {
      console.log("Moving camera left/right by: " + offset);
      const speed = 2.0;
      const position = this.camera.position;
      const target = this.camera.target;
      this.camera.setPosition(vec3.fromValues(position[0]+offset * speed, position[1], position[2]));
        this.camera.setTarget(vec3.fromValues(target[0]+offset * speed, target[1], target[2]));
      this.updateProjectionMatrix();
    }

    moveCameraUD(offset) {
        console.log("Moving camera up/down by: " + offset);
        const speed = 2.0;
        const position = this.camera.position;
        const target = this.camera.target;
        this.camera.setPosition(vec3.fromValues(position[0], position[1] + offset * speed, position[2] ));
        this.camera.setTarget(vec3.fromValues(target[0], target[1] + offset*speed, target[2]));
        this.updateProjectionMatrix();
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
    if (this.displayAxis) {
      this.axis.display();
    }

    this.setDefaultAppearance();

    // ---- BEGIN Geometric transformation section


    this.pushMatrix();
    this.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);

    this.objects[this.selectedObject].display();

    this.popMatrix();

  }
}