import {CGFappearance, CGFtexture} from "../../lib/CGF.js";

/**
 * Manages textures and materials for a 3D scene.
 */
export class TextureManager {
    /**
     * Constructor for the TextureManager class.
     *
     * @param {CGFscene} scene - The CGF scene to which the textures and materials will be applied.
     */
    constructor(scene) {
        this.scene = scene;
        this.initTextures();
        this.initMaterials();
    }

    /**
     * Initializes textures for the 3D scene.
     */
    initTextures() {
        this.concreteTexture = new CGFtexture(
            this.scene,
            "./textures/plain/construction/concrete.jpg"
        );
        this.sandstoneBrickWallTexture = new CGFtexture(
            this.scene,
            "./textures/plain/construction/sandstone_brick_wall.jpg"
        );
        this.concreteTilesTexture = new CGFtexture(
            this.scene,
            "./textures/plain/construction/concrete_tiles.jpg"
        );
        this.windowTexture = new CGFtexture(
            this.scene,
            "./textures/objects/Industrial_window.jpg"
        );
        this.doorTexture = new CGFtexture(
            this.scene,
            "./textures/objects/mahogany_dark_door.jpg"
        );
        this.helipadHTexture = new CGFtexture(
            this.scene,
            "./textures/plain/helipad/helih.png"
        );
        this.helipadDownTexture = new CGFtexture(
            this.scene,
            "./textures/plain/helipad/helidown.png"
        );
        this.helipadUpTexture = new CGFtexture(
            this.scene,
            "./textures/plain/helipad/heliup.png"
        );
        this.garageTexture = new CGFtexture(
            this.scene,
            "./textures/objects/garage_door.jpg"
        );
        this.logoTexture = new CGFtexture(
            this.scene,
            "./textures/objects/logo.jpg"
        );

        this.polishedAluminumTexture = new CGFtexture(
            this.scene,
            "./textures/plain/metal/polished_aluminum.jpg"
        );

        this.brushedGoldTexture = new CGFtexture(
            this.scene,
            "./textures/plain/metal/brushed_gold.jpg"
        );
        this.paintedRedMetalTexture = new CGFtexture(
            this.scene,
            "./textures/plain/metal/painted_metal_red.jpg"
        );

        this.bucketTexture = new CGFtexture(
            this.scene,
            "./textures/plain/metal/metal.jpg"
        );


        this.earthTexture = new CGFtexture(
            this.scene,
            "./textures/plain/nature/earth.png"
        );
        this.trunkTexture = new CGFtexture(
            this.scene,
            "./textures/plain/nature/trunk.jpg"
        );
        this.leavesTexture = new CGFtexture(
            this.scene,
            "./textures/plain/nature/leavesbw.jpg"
        );
        this.grassTexture = new CGFtexture(
            this.scene,
            "./textures/plain/nature/grass.jpg"
        );
        this.shadowTexture = new CGFtexture(
            this.scene,
            "./textures/plain/effects/shadow3.png"
        );
        this.leavesGradTexture = new CGFtexture(
            this.scene,
            "./textures/plain/nature/leavesbwgradient.png"
        );
        this.waterTexture = new CGFtexture(
            this.scene,
            "./textures/plain/effects/water.jpg"
        );

        this.waterMapTexture = new CGFtexture(
            this.scene,
            "./textures/plain/effects/water_map.jpg"
        );

        this.fireTexture = new CGFtexture(
            this.scene,
            "./textures/plain/effects/fire.jpg"
        );

        this.panoramaTexture = new CGFtexture(
            this.scene,
            "./textures/plain/panorama/panoram2.jpg"
        );

        this.roadTexture = new CGFtexture(
            this.scene,
            "./textures/plain/road/road2.jpg"
        );
    }

    /**
     * Initializes materials for the 3D scene.
     */
    initMaterials() {
        this.concreteMaterial = this.createMaterial(this.concreteTexture);
        this.windowMaterial = this.createMaterial(this.windowTexture);
        this.sandstoneBrickWallMaterial = this.createMaterial(
            this.sandstoneBrickWallTexture
        );
        this.concreteTilesMaterial = this.createMaterial(this.concreteTilesTexture);
        this.doorMaterial = this.createMaterial(this.doorTexture);
        this.helipadHMaterial = this.createMaterial(this.helipadHTexture);
        this.helipadDownMaterial = this.createMaterial(this.helipadDownTexture);
        this.helipadUpMaterial = this.createMaterial(this.helipadUpTexture);
        this.bucketMaterial = this.createMaterial(this.bucketTexture);
        this.garageMaterial = this.createMaterial(this.garageTexture);
        this.logoMaterial = this.createMaterial(this.logoTexture);

        this.earthMaterial = this.createEarthMaterial(this.earthTexture);
        this.trunkMaterial = this.createTrunkMaterial(this.trunkTexture);
        this.leavesMaterial = this.createLeavesMaterial(this.leavesTexture);
        this.grassMaterial = this.createGrassMaterial(this.grassTexture);
        this.shadowMaterial = this.createShadowMaterial(this.shadowTexture);
        this.leavesGradMaterial = this.createLeavesGradMaterial(
            this.leavesGradTexture
        );
        this.waterMaterial = this.createWaterMaterial(this.waterTexture);
        this.fireMaterial = this.createFireMaterial(this.fireTexture);

        this.panoramMaterial = this.createPanoramMaterial(this.panoramaTexture);

        this.roadMaterial = this.createRoadMaterial(this.roadTexture);

        this.polishedAluminumMaterial = this.createMaterial(this.polishedAluminumTexture);
        this.polishedAluminumMaterial.setAmbient(0.7, 0.7, 0.7, 1);
        this.polishedAluminumMaterial.setDiffuse(0.8, 0.8, 0.8, 1);
        this.polishedAluminumMaterial.setSpecular(1.0, 1.0, 1.0, 1);
        this.polishedAluminumMaterial.setShininess(180.0);

        this.brushedGoldMaterial = this.createMaterial(this.brushedGoldTexture);
        this.brushedGoldMaterial.setAmbient(0.7, 0.7, 0.3, 1);
        this.brushedGoldMaterial.setDiffuse(0.8, 0.8, 0.3, 1);
        this.brushedGoldMaterial.setSpecular(1.0, 0.9, 0.5, 1);
        this.brushedGoldMaterial.setShininess(180.0);

        this.paintedRedMetalMaterial = this.createMaterial(this.paintedRedMetalTexture);
        this.paintedRedMetalMaterial.setAmbient(0.7, 0.2, 0.2, 1);
        this.paintedRedMetalMaterial.setDiffuse(0.8, 0.2, 0.2, 1);
        this.paintedRedMetalMaterial.setSpecular(1.0, 0.4, 0.4, 1);
        this.paintedRedMetalMaterial.setShininess(140.0);

        this.windshieldMaterial = this.createWindshieldMaterial(this.polishedAluminumTexture);

    }

    /**
     * Creates a material with the specified texture.
     *
     * @param {CGFtexture} texture - The texture to apply to the material.
     * @returns {CGFappearance} - The created material.
     */
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

    /**
     * Creates a material for leaves with the specified texture.
     *
     * @param {CGFtexture} texture - The texture to apply to the leaves material.
     * @returns {CGFappearance} - The created leaves material.
     */
    createLeavesMaterial(texture) {
        const leavesMaterial = new CGFappearance(this.scene);
        leavesMaterial.setAmbient(0.1, 0.4, 0.1, 1.0);
        leavesMaterial.setDiffuse(0.2, 0.6, 0.2, 1.0);
        leavesMaterial.setSpecular(0.05, 0.2, 0.05, 1.0);
        leavesMaterial.setShininess(10.0);
        leavesMaterial.setTexture(texture);
        leavesMaterial.setTextureWrap('REPEAT', 'REPEAT');
        return leavesMaterial;
    }

    /**
     * Creates a material for leaves with a gradient texture.
     *
     * @param {CGFtexture} texture - The texture to apply to the leaves material.
     * @returns {CGFappearance} - The created leaves gradient material.
     */
    createLeavesGradMaterial(texture) {
        const leavesGradMaterial = new CGFappearance(this.scene);
        leavesGradMaterial.setAmbient(0.1, 0.4, 0.1, 1.0);
        leavesGradMaterial.setDiffuse(0.2, 0.6, 0.2, 1.0);
        leavesGradMaterial.setSpecular(0.05, 0.2, 0.05, 1.0);
        leavesGradMaterial.setShininess(10.0);
        leavesGradMaterial.setTexture(texture);
        leavesGradMaterial.setTextureWrap('REPEAT', 'REPEAT');
        return leavesGradMaterial;
    }

    /**
     * Creates a material for grass with the specified texture.
     *
     * @param {CGFtexture} texture - The texture to apply to the grass material.
     * @returns {CGFappearance} - The created grass material.
     */
    createGrassMaterial(texture) {
        const grassMaterial = new CGFappearance(this.scene);
        grassMaterial.setAmbient(0.7, 0.7, 0.7, 1.0);
        grassMaterial.setDiffuse(1.0, 1.0, 1.0, 1.0);
        grassMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
        grassMaterial.setShininess(20.0);
        grassMaterial.setTexture(texture);
        grassMaterial.setTextureWrap('REPEAT', 'REPEAT');
        return grassMaterial;
    }

    /**
     * Creates a material for shadows with the specified texture.
     *
     * @param {CGFtexture} texture - The texture to apply to the shadow material.
     * @returns {CGFappearance} - The created shadow material.
     */
    createShadowMaterial(texture) {
        const shadowMaterial = new CGFappearance(this.scene);
        shadowMaterial.setAmbient(0.7, 0.7, 0.7, 1.0);
        shadowMaterial.setDiffuse(1.0, 1.0, 1.0, 1.0);
        shadowMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
        shadowMaterial.setShininess(20.0);
        shadowMaterial.setTexture(texture);
        shadowMaterial.setTextureWrap('REPEAT', 'REPEAT');
        return shadowMaterial;
    }

    /**
     * Creates a material for trunks with the specified texture.
     *
     * @param {CGFtexture} texture - The texture to apply to the trunk material.
     * @returns {CGFappearance} - The created trunk material.
     */
    createTrunkMaterial(texture) {
        const trunkMaterial = new CGFappearance(this.scene);
        trunkMaterial.setAmbient(0.3, 0.2, 0.1, 1.0);
        trunkMaterial.setDiffuse(0.4, 0.3, 0.2, 1.0);
        trunkMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        trunkMaterial.setShininess(10.0);
        trunkMaterial.setTexture(texture);
        trunkMaterial.setTextureWrap('REPEAT', 'REPEAT');
        return trunkMaterial;
    }

    /**
     * Creates a material for fire with the specified texture.
     *
     * @param {CGFtexture} texture - The texture to apply to the fire material.
     * @returns {CGFappearance} - The created fire material.
     */
    createFireMaterial(texture) {
        const fireMaterial = new CGFappearance(this.scene);
        fireMaterial.setAmbient(0.3, 0.2, 0.1, 1.0);
        fireMaterial.setDiffuse(0.4, 0.3, 0.2, 1.0);
        fireMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        fireMaterial.setShininess(10.0);
        fireMaterial.setTexture(texture);
        fireMaterial.setTextureWrap('REPEAT', 'REPEAT');
        return fireMaterial;
    }

    /**
     * Creates a water material with specified texture and optional map texture.
     *
     * @param {CGFtexture} texture - The main texture to be applied to the water material.
     * @param {CGFtexture} [mapTexture] - An optional map texture to be used for additional effects.
     * @returns {CGFappearance} The configured water material with the specified textures and properties.
     */
    createWaterMaterial(texture, mapTexture) {
        const waterMaterial = new CGFappearance(this.scene);
        waterMaterial.setAmbient(0.2, 0.4, 0.6, 1.0);
        waterMaterial.setDiffuse(0.3, 0.5, 0.8, 0.8);
        waterMaterial.setSpecular(0.8, 0.9, 1.0, 1.0);
        waterMaterial.setShininess(120.0);
        waterMaterial.setTexture(texture);
        if (mapTexture) {
            waterMaterial.setActiveTexture(mapTexture);
        }
        waterMaterial.setTextureWrap('REPEAT', 'REPEAT');
        return waterMaterial;
    }

    /**
     * Creates a material for earth with the specified texture.
     *
     * @param {CGFtexture} texture - The texture to apply to the earth material.
     * @returns {CGFappearance} - The created earth material.
     */
    createEarthMaterial(texture) {
        const earthMaterial = new CGFappearance(this.scene);
        earthMaterial.setAmbient(0.7, 0.7, 0.7, 1.0);
        earthMaterial.setDiffuse(1.0, 1.0, 1.0, 1.0);
        earthMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
        earthMaterial.setShininess(20.0);
        earthMaterial.setTexture(texture);
        earthMaterial.setTextureWrap('REPEAT', 'REPEAT');
        return earthMaterial;
    }

    /**
     * Creates a panorama material with the specified texture.
     *
     * @param {CGFtexture} texture - The texture to apply to the panorama material.
     * @returns {CGFappearance} - The created panorama material.
     */
    createPanoramMaterial(texture) {
        const panoramMaterial = new CGFappearance(this.scene);
        panoramMaterial.setEmission(1, 1, 1, 1);
        panoramMaterial.setTexture(texture);
        return panoramMaterial;
    }

    /**
     * Creates a road material with the specified texture.
     *
     * @param {CGFtexture} texture - The texture to apply to the road material.
     * @returns {CGFappearance} - The created road material.
     */
    createRoadMaterial(texture) {
        const grassMaterial = new CGFappearance(this.scene);
        grassMaterial.setAmbient(0.7, 0.7, 0.7, 1.0);
        grassMaterial.setDiffuse(1.0, 1.0, 1.0, 1.0);
        grassMaterial.setSpecular(0.5, 0.5, 0.5, 1.0);
        grassMaterial.setShininess(20.0);
        grassMaterial.setTexture(texture);
        grassMaterial.setTextureWrap('REPEAT', 'REPEAT');
        return grassMaterial;
    }

    /**
     * Creates a windshield material with the specified texture.
     *
     * @param {CGFtexture} texture - The texture to apply to the windshield material.
     * @returns {CGFappearance} - The created windshield material.
     */
    createWindshieldMaterial(texture) {
        const windshieldMaterial = new CGFappearance(this.scene);
        windshieldMaterial.setAmbient(0.0, 0.1, 0.3, 1.0); // Blueish color
        windshieldMaterial.setDiffuse(0.0, 0.2, 0.5, 1.0); // Blueish color
        windshieldMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        windshieldMaterial.setShininess(10.0);
        windshieldMaterial.setTexture(texture);
        windshieldMaterial.setTextureWrap('REPEAT', 'REPEAT');
        return windshieldMaterial;
    }
}
