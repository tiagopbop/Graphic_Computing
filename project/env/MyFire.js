import {CGFobject, CGFshader} from "../../lib/CGF.js";
import {MyPyramid} from "../geometric/MyPyramid.js";

export class MyFire extends CGFobject {
    /**
     * Constructs a new MyFire instance.
     * @param {CGFscene} scene - The scene to which the fire belongs.
     * @param {number} [forestWidth=20] - The width of the forest area.
     * @param {number} [forestLength=30] - The length of the forest area.
     */
    constructor(scene, forestWidth = 20, forestLength = 30) {
        super(scene);
        this.forestWidth = forestWidth;
        this.forestLength = forestLength;
        this.timeFactor = 0;

        this.fireShader = new CGFshader(
            scene.gl,
            "shaders/fire.vert",
            "shaders/fire.frag"
        );

        this.createFlameMatrix();
    }

    /**
     * Creates a matrix of flame objects distributed in the forest area.
     * This method initializes the flames array with pyramid objects representing individual flames.
     * It creates a grid of flames and adds some random extra flames for variety.
     */
    createFlameMatrix() {
        this.flames = [];

        const flamesPerRow = Math.floor(this.forestWidth / 30);
        const flamesPerCol = Math.floor(this.forestLength / 30);

        for (let i = 0; i < flamesPerRow; i++) {
            for (let j = 0; j < flamesPerCol; j++) {
                const baseX =
                    -this.forestWidth / 2 + (i + 0.5) * (this.forestWidth / flamesPerRow);
                const baseZ =
                    -this.forestLength / 2 +
                    (j + 0.5) * (this.forestLength / flamesPerCol);

                const spacingVariationX = (Math.random() - 0.5) * 20;
                const spacingVariationZ = (Math.random() - 0.5) * 20;

                const x = baseX + spacingVariationX;
                const z = baseZ + spacingVariationZ;

                const height = 10 + Math.random() * 12;
                const width = 3 + Math.random() * 3;

                let finalX = x;
                let finalZ = z;

                if (Math.random() < 0.3) {
                    finalX = (Math.random() - 0.5) * this.forestWidth * 0.8;
                    finalZ = (Math.random() - 0.5) * this.forestLength * 0.8;
                }

                this.flames.push({
                    pyramid: new MyPyramid(this.scene, 16, 8),
                    x: finalX,
                    z: finalZ,
                    baseHeight: height,
                    baseWidth: width,
                });
            }
        }

        const extraFlames = Math.floor(flamesPerRow * flamesPerCol * 0.5);
        for (let i = 0; i < extraFlames; i++) {
            const randomX = (Math.random() - 0.5) * this.forestWidth * 0.9;
            const randomZ = (Math.random() - 0.5) * this.forestLength * 0.9;
            const height = 4 + Math.random() * 10;
            const width = 1 + Math.random() * 2.5;

            this.flames.push({
                pyramid: new MyPyramid(this.scene, 16, 8),
                x: randomX,
                z: randomZ,
                baseHeight: height,
                baseWidth: width,
            });
        }
    }

    /**
     * Updates the fire animation based on the provided time factor.
     * @param {number} timeFactor - The new time factor value for animation.
     */
    update(timeFactor) {
        this.timeFactor = timeFactor;
        if (this.fireShader) {
            this.fireShader.setUniformsValues({timeFactor: timeFactor});
        }
    }

    /**
     * Renders the fire effect on the scene.
     * This method applies the fire shader, scales and translates the flame pyramids, and renders them.
     */
    display() {
        this.scene.gl.enable(this.scene.gl.BLEND);
        this.scene.gl.blendFunc(
            this.scene.gl.SRC_ALPHA,
            this.scene.gl.ONE_MINUS_SRC_ALPHA
        );
        this.scene.gl.depthMask(false);

        if (this.fireShader) {
            this.scene.setActiveShader(this.fireShader);
            this.fireShader.setUniformsValues({timeFactor: this.timeFactor});
        }

        if (this.scene.textureManager && this.scene.textureManager.fireMaterial) {
            this.scene.textureManager.fireMaterial.apply();
        }
        for (let i = 0; i < this.flames.length; i++) {
            const flame = this.flames[i];

            this.scene.pushMatrix();
            this.scene.translate(flame.x, -1.8, flame.z);
            this.scene.scale(flame.baseWidth, flame.baseHeight, flame.baseWidth);
            flame.pyramid.display();
            this.scene.popMatrix();
        }

        this.scene.setActiveShader(this.scene.defaultShader);
        this.scene.gl.depthMask(true);
        this.scene.gl.disable(this.scene.gl.BLEND);
    }
}
