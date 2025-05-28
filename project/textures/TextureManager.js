import { CGFtexture, CGFappearance } from '../../lib/CGF.js';

export class TextureManager {
    constructor(scene) {
        this.scene = scene;
        this.initTextures();
        this.initMaterials();
    }

    initTextures() {
        this.concreteTexture = new CGFtexture(this.scene, './textures/plain/concrete.jpg');
        this.sandstoneBrickWallTexture = new CGFtexture(this.scene, './textures/plain/sandstone_brick_wall.jpg');
        this.concreteTilesTexture = new CGFtexture(this.scene, './textures/plain/concrete_tiles.jpg');
        this.windowTexture = new CGFtexture(this.scene, './textures/objects/Industrial_window.jpg');
        this.doorTexture = new CGFtexture(this.scene, './textures/objects/mahogany_dark_door.jpg');
        this.helipadTexture = new CGFtexture(this.scene, './textures/objects/heliport-round.jpg');
        this.garageTexture = new CGFtexture(this.scene, './textures/objects/garage_door.jpg');
        this.logoTexture = new CGFtexture(this.scene, './textures/objects/logo.jpg');
        this.metalTexture = new CGFtexture(this.scene, './textures/plain/Metal046A.jpg');
        this.metalTexture2 = new CGFtexture(this.scene, './textures/plain/Metal046B.jpg');
        this.metalTextureOG = new CGFtexture(this.scene, './textures/plain/Metal046A.jpg');
    }

    initMaterials() {
        this.concreteMaterial = this.createMaterial(this.concreteTexture);
        this.windowMaterial = this.createMaterial(this.windowTexture);
        this.sandstoneBrickWallMaterial = this.createMaterial(this.sandstoneBrickWallTexture);
        this.concreteTilesMaterial = this.createMaterial(this.concreteTilesTexture);
        this.doorMaterial = this.createMaterial(this.doorTexture);
        this.helipadMaterial = this.createMaterial(this.helipadTexture);
        this.garageMaterial = this.createMaterial(this.garageTexture);
        this.logoMaterial = this.createMaterial(this.logoTexture);

        // Original Metal
        this.metalMaterialOG = this.createMaterial(this.metalTextureOG);
        this.metalMaterialOG.setAmbient(0.5, 0.5, 0.5, 1);
        this.metalMaterialOG.setDiffuse(0.5, 0.5, 0.5, 1);
        this.metalMaterialOG.setSpecular(0.5, 0.5, 0.5, 1);


        // Yellow Metal
        this.metalMaterial = this.createMaterial(this.metalTexture);
        this.metalMaterial.setAmbient(1.0, 1.0, 0.2, 1); // Brighter yellow tone
        this.metalMaterial.setDiffuse(1.0, 1.0, 0.2, 1);
        this.metalMaterial.setSpecular(1.0, 1.0, 0.5, 1);

        // Red Metal
        this.metalMaterial2 = this.createMaterial(this.metalTexture2);
        this.metalMaterial2.setAmbient(1.0, 0.2, 0.2, 1); // Brighter red tone
        this.metalMaterial2.setDiffuse(1.0, 0.2, 0.2, 1);
        this.metalMaterial2.setSpecular(1.0, 0.4, 0.4, 1);

    }

    createMaterial(texture) {
        const material = new CGFappearance(this.scene);
        material.setAmbient(0.9, 0.9, 0.9, 1);
        material.setDiffuse(0.9, 0.9, 0.9, 1);
        material.setSpecular(0.1, 0.1, 0.1, 1);
        material.setShininess(10.0);
        material.setTexture(texture);
        material.setTextureWrap('REPEAT', 'REPEAT');
        return material;
    }
}