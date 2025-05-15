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

        this.earthTexture = new CGFtexture(this.scene, './textures/plain/earth.png');
        this.trunkTexture = new CGFtexture(this.scene, './textures/plain/trunk.jpg');
        this.leavesTexture = new CGFtexture(this.scene, './textures/plain/leavesbw.jpg');
        this.grassTexture = new CGFtexture(this.scene, './textures/plain/grass.jpg');

        this.panoramaTexture = new CGFtexture(this.scene, './textures/plain/panoram2.jpg');
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

        this.earthMaterial = this.createEarthMaterial(this.earthTexture);
        this.trunkMaterial = this.createTrunkMaterial(this.trunkTexture);
        this.leavesMaterial = this.createLeavesMaterial(this.leavesTexture);
        this.grassMaterial = this.createGrassMaterial(this.grassTexture);

        this.panoramMaterial = this.createPanoramMaterial(this.panoramaTexture);

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

    createLeavesMaterial(texture){
        const leavesMaterial = new CGFappearance(this.scene);
        leavesMaterial.setAmbient(0.1, 0.4, 0.1, 1.0);
        leavesMaterial.setDiffuse(0.2, 0.6, 0.2, 1.0);
        leavesMaterial.setSpecular(0.05, 0.2, 0.05, 1.0);
        leavesMaterial.setShininess(10.0);
        leavesMaterial.setTexture(texture);
        leavesMaterial.setTextureWrap('REPEAT', 'REPEAT');
        return leavesMaterial;
    }

    createGrassMaterial(texture){
        const grassMaterial = new CGFappearance(this.scene);
        grassMaterial.setAmbient(0.7, 0.7, 0.7, 1.0);
        grassMaterial.setDiffuse(1.0, 1.0, 1.0, 1.0);
        grassMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
        grassMaterial.setShininess(20.0);
        grassMaterial.setTexture(texture);
        grassMaterial.setTextureWrap('REPEAT', 'REPEAT');
        return grassMaterial;
    }

    createTrunkMaterial(texture){
        const trunkMaterial = new CGFappearance(this.scene);
        trunkMaterial.setAmbient(0.3, 0.2, 0.1, 1.0);
        trunkMaterial.setDiffuse(0.4, 0.3, 0.2, 1.0);
        trunkMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        trunkMaterial.setShininess(10.0);
        trunkMaterial.setTexture(texture);
        trunkMaterial.setTextureWrap('REPEAT', 'REPEAT');
        return trunkMaterial;
    }

    createEarthMaterial(texture){
        const earthMaterial = new CGFappearance(this.scene);
        earthMaterial.setAmbient(0.7, 0.7, 0.7, 1.0);
        earthMaterial.setDiffuse(1.0, 1.0, 1.0, 1.0);
        earthMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
        earthMaterial.setShininess(20.0);
        earthMaterial.setTexture(texture);
        earthMaterial.setTextureWrap('REPEAT', 'REPEAT');
        return earthMaterial;
    }

    createPanoramMaterial(texture){
        const panoramMaterial = new CGFappearance(this.scene);
        panoramMaterial.setEmission(1, 1, 1, 1);
        panoramMaterial.setTexture(texture);
        return panoramMaterial;
    }
}