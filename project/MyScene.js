import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./geometric/MySphere.js"
import { MyCube } from "./geometric/MyCube.js";
import { MyBuilding } from "./objects/MyBuilding.js";
import {MyTree} from "./geometric/MyTree.js";
import {MyForest} from "./geometric/MyForest.js";
import { MyPanoram } from "./objects/MyPanoram.js";


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

    this.panoram = new MyPanoram(this, this.panoramMaterial);
    this.sphere = new MySphere(this,40,20);
    this.plane = new MyPlane(this,64);
    //this.forest = new MyForest(this, 4, 5, 200); // 4 rows, 5 cols, spacing = 3

    this.selectedObject = 0;
    this.selectedMaterial = 0;
    this.displayAxis = true;
    this.scaleFactor = 20.0;
    this.ambientlightFactor = 0.3;
    this.cameraZoom = 0.4;


    // Parameters
    const rows = 4;  // Number of rows
    const cols = 5;  // Number of columns

    // Create forest matrix
    this.forest = [];
    for (let i = 0; i < rows; i++) {
        this.forest[i] = [];
        for (let j = 0; j < cols; j++) {
            this.forest[i][j] = new MyTree(this, 12, 6, 6, 2 ); // Adjust slices/stacks as needed
        }
    }


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
      vec3.fromValues(100, 100, 100), // Camera Position
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

    // Interior Material
   /* this.panoramMaterial = new CGFappearance(this);
    this.panoramMaterial.setAmbient(0.7, 0.7, 0.7, 1.0);
    this.panoramMaterial.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.panoramMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.panoramMaterial.setShininess(20.0);
    this.panoramMaterial.loadTexture('./textures/panoram.jpg') // Load the earth texture
    this.panoramMaterial.setTextureWrap('REPEAT', 'REPEAT');
    */
    // Trunk material
    this.trunkMaterial = new CGFappearance(this);
    this.trunkMaterial.setAmbient(0.3, 0.2, 0.1, 1.0);
    this.trunkMaterial.setDiffuse(0.4, 0.3, 0.2, 1.0);
    this.trunkMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
    this.trunkMaterial.setShininess(10.0);
    this.trunkMaterial.loadTexture('./textures/trunk.jpg');
    this.trunkMaterial.setTextureWrap('REPEAT', 'REPEAT');

    // Leaves material
    this.leavesMaterial = new CGFappearance(this);
    this.leavesMaterial.setAmbient(0.1, 0.4, 0.1, 1.0);
    this.leavesMaterial.setDiffuse(0.2, 0.6, 0.2, 1.0);
    this.leavesMaterial.setSpecular(0.05, 0.2, 0.05, 1.0);
    this.leavesMaterial.setShininess(10.0);
    this.leavesMaterial.loadTexture('./textures/leaves.jpg');
    this.leavesMaterial.setTextureWrap('REPEAT', 'REPEAT');

    // Earth Material
    this.grassMaterial = new CGFappearance(this);
    this.grassMaterial.setAmbient(0.7, 0.7, 0.7, 1.0);
    this.grassMaterial.setDiffuse(1.0, 1.0, 1.0, 1.0);
    this.grassMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
    this.grassMaterial.setShininess(20.0);
    this.grassMaterial.loadTexture('./textures/grass.jpg') // Load the earth texture
    this.grassMaterial.setTextureWrap('REPEAT', 'REPEAT');

    this.panoramMaterial = new CGFtexture(this,'./textures/panoram2.jpg');

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

    //exterior
//    this.pushMatrix();
  //  this.earthMaterial.apply();
    //this.scale(151,151,151);
    //this.sphere.display();
    //this.popMatrix();

    //interior

    this.panoram.display();

    //plane
    this.pushMatrix();
    this.grassMaterial.apply();
    this.rotate(-Math.PI/2,1,0,0);
    this.scale(180,180,1);
    this.plane.display();
    this.popMatrix();
    
    
    for (let i = 0; i < this.forest.length; i++) {
      for (let j = 0; j < this.forest[i].length; j++) {
          const tree = this.forest[i][j];
  
          const x = i * 5; // Distance between trees (adjust as needed)
          const z = j * 5;
  
          // Draw trunk
          this.pushMatrix();
          this.trunkMaterial.apply();
          this.translate(3*x, 3, 3*z);
          this.scale(0.9, 6, 0.9);
          this.rotate(Math.PI/2,1,0,0)
          tree.trunk.display();
          this.popMatrix();
  
          // Foliage Layer 1
          this.pushMatrix();
          this.leavesMaterial.apply();
          this.translate(3*x, 3, 3*z);
          this.scale(6.0, 6.0, 6.0);
          tree.foliage.display();
          this.popMatrix();
  
          // Foliage Layer 2
          this.pushMatrix();
          this.leavesMaterial.apply();
          this.translate(3*x, 3*1.7, 3*z);
          this.scale(4.8, 4.8, 4.8);
          tree.foliage.display();
          this.popMatrix();
  
          // Foliage Layer 3
          this.pushMatrix();
          this.leavesMaterial.apply();
          this.translate(3*x,3* 2.3,3* z);
          this.scale(3.6, 3.6, 3.6);
          tree.foliage.display();
          this.popMatrix();
      }
  }
  



  }
}
