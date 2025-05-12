import { CGFscene, CGFcamera, CGFaxis, CGFappearance, CGFtexture } from "../lib/CGF.js";
import { MyPlane } from "./MyPlane.js";
import { MySphere } from "./geometric/MySphere.js"
import { MyCube } from "./geometric/MyCube.js";
import { MyBuilding } from "./objects/MyBuilding.js";

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
    this.initMaterials();
    this.initTextures();

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
        new MyBuilding(this)
    ];

    //Ob
    this.objectList = {
      'Plane' : 0,
      'Sphere' : 1,
      'Cube' : 2,
      'Building' : 3
    }

    this.selectedObject = 3;
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

  initTextures() {
    // Brick Material
    this.brickTex = new CGFtexture(this, './textures/bricks.jpg');

    this.brickMaterial = new CGFappearance(this);
    this.brickMaterial.setAmbient(0.9, 0.9, 0.9, 1);
    this.brickMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
    this.brickMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.brickMaterial.setShininess(10.0);
    this.brickMaterial.setTexture(this.brickTex);
    this.brickMaterial.setTextureWrap('REPEAT', 'REPEAT');

    // Concrete Material
    this.concreteTex = new CGFtexture(this, './textures/concrete.jpg');

    this.concreteMaterial = new CGFappearance(this);
    this.concreteMaterial.setAmbient(0.9, 0.9, 0.9, 1);
    this.concreteMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
    this.concreteMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.concreteMaterial.setShininess(10.0);
    this.concreteMaterial.setTexture(this.concreteTex);
    this.concreteMaterial.setTextureWrap('REPEAT', 'REPEAT');

    // Patterned Concrete Wall Material
    this.concreteWallTex = new CGFtexture(this, './textures/patterned_concrete_wall.jpg');

    this.concreteWallMaterial = new CGFappearance(this);
    this.concreteWallMaterial.setAmbient(0.9, 0.9, 0.9, 1);
    this.concreteWallMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
    this.concreteWallMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.concreteWallMaterial.setShininess(10.0);
    this.concreteWallMaterial.setTexture(this.concreteWallTex);
    this.concreteWallMaterial.setTextureWrap('REPEAT', 'REPEAT');

    // Brick Pavement Material
    this.brickPavementTex = new CGFtexture(this, './textures/brick_pavement.jpg');

    this.brickPavementMaterial = new CGFappearance(this);
    this.brickPavementMaterial.setAmbient(0.9, 0.9, 0.9, 1);
    this.brickPavementMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
    this.brickPavementMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.brickPavementMaterial.setShininess(10.0);
    this.brickPavementMaterial.setTexture(this.brickPavementTex);
    this.brickPavementMaterial.setTextureWrap('REPEAT', 'REPEAT');

    // Concrete Tiles Material
    this.concreteTilesTex = new CGFtexture(this, './textures/concrete_tiles.jpg');

    this.concreteTilesMaterial = new CGFappearance(this);
    this.concreteTilesMaterial.setAmbient(0.9, 0.9, 0.9, 1);
    this.concreteTilesMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
    this.concreteTilesMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.concreteTilesMaterial.setShininess(10.0);
    this.concreteTilesMaterial.setTexture(this.concreteTilesTex);
    this.concreteTilesMaterial.setTextureWrap('REPEAT', 'REPEAT');

    // Sandstone Brick Wall Material
    this.sandstoneBrickWallTex = new CGFtexture(this, './textures/sandstone_brick_wall.jpg');

    this.sandstoneBrickWallMaterial = new CGFappearance(this);
    this.sandstoneBrickWallMaterial.setAmbient(0.9, 0.9, 0.9, 1);
    this.sandstoneBrickWallMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
    this.sandstoneBrickWallMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.sandstoneBrickWallMaterial.setShininess(10.0);
    this.sandstoneBrickWallMaterial.setTexture(this.sandstoneBrickWallTex);
    this.sandstoneBrickWallMaterial.setTextureWrap('REPEAT', 'REPEAT');

    // Seaworn Sandstone Material
    this.seawornSandstoneTex = new CGFtexture(this, './textures/seaworn_sandstone_brick.jpg');

    this.seawornSandstoneMaterial = new CGFappearance(this);
    this.seawornSandstoneMaterial.setAmbient(0.9, 0.9, 0.9, 1);
    this.seawornSandstoneMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
    this.seawornSandstoneMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.seawornSandstoneMaterial.setShininess(10.0);
    this.seawornSandstoneMaterial.setTexture(this.seawornSandstoneTex);
    this.seawornSandstoneMaterial.setTextureWrap('REPEAT', 'REPEAT');

    // Brick Wall Material
    this.brickWallTex = new CGFtexture(this, './textures/brick_wall_13.jpg');

    this.brickWallMaterial = new CGFappearance(this);
    this.brickWallMaterial.setAmbient(0.9, 0.9, 0.9, 1);
    this.brickWallMaterial.setDiffuse(0.9, 0.9, 0.9, 1);
    this.brickWallMaterial.setSpecular(0.1, 0.1, 0.1, 1);
    this.brickWallMaterial.setShininess(10.0);
    this.brickWallMaterial.setTexture(this.brickWallTex);
    this.brickWallMaterial.setTextureWrap('REPEAT', 'REPEAT');

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
