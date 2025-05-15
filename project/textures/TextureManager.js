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