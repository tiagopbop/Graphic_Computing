import {CGFobject, CGFappearance} from "../../lib/CGF.js";
import {MyCone} from "../geometric/MyCone.js";
import {MyPyramid} from "../geometric/MyPyramid.js";
import {MyCircle} from "../geometric/MyCircle.js";
import {MyFire} from "./MyFire.js";

/**
 * Represents a 3D tree object composed of a trunk, crown, and shadow, with customizable parameters.
 * The tree can be tilted along the X or Z axis, and its appearance is controlled via materials and textures.
 *
 * @class
 * @extends CGFobject
 *
 * @param {CGFscene} scene - The scene to which this tree belongs.
 * @param {number} tiltAngleDeg - The tilt angle of the tree in degrees.
 * @param {'x'|'z'} tiltAxis - The axis around which the tree is tilted ('x' or 'z').
 * @param {number} trunkRadius - The radius of the tree trunk.
 * @param {number} treeHeight - The total height of the tree.
 * @param {number[]} crownColorRGB - The RGB color of the tree crown as an array [r, g, b], each in [0, 1].
 *
 * @property {CGFscene} scene - The scene reference.
 * @property {number} tiltAngle - The tilt angle in radians.
 * @property {string} tiltAxis - The axis of tilt ('x' or 'z').
 * @property {number} trunkRadius - The trunk radius.
 * @property {number} treeHeight - The total tree height.
 * @property {number[]} crownColor - The RGB color of the crown.
 * @property {MyCone} trunk - The cone representing the trunk.
 * @property {MyPyramid} pyramid - The pyramid used for crown segments.
 * @property {MyCircle} shadow - The circle representing the shadow.
 * @property {number} crownHeight - The height of the crown.
 * @property {number} trunkHeight - The height of the trunk.
 * @property {number} numPyramids - The number of pyramid segments in the crown.
 *
 */
export class MyTree extends CGFobject {
    constructor(
        scene,
        tiltAngleDeg,
        tiltAxis,
        trunkRadius,
        treeHeight,
        crownColorRGB
    ) {
        super(scene);

        this.scene = scene;
        this.tiltAngle = (tiltAngleDeg * Math.PI) / 180;
        this.tiltAxis = tiltAxis.toLowerCase();
        this.trunkRadius = trunkRadius;
        this.treeHeight = treeHeight;
        this.crownColor = crownColorRGB;

        this.trunk = new MyCone(scene, 20, 1);
        this.pyramid = new MyPyramid(scene, 4, 1);
        this.shadow = new MyCircle(scene, 20, true);

        this.crownHeight = 0.8 * treeHeight;
        this.trunkHeight = 0.3 * treeHeight;
        this.numPyramids = Math.ceil(this.crownHeight / 2);
    }

    /**
     * Renders the tree, applying tilt, trunk, crown, and shadow. Optionally displays the tree as "on fire".
     * @param {boolean} [onFire=false] - If true, renders the tree with a fire effect (not implemented in this code).
     */
    display(onFire = false) {
        this.scene.pushMatrix();
        if (this.scene.textureManager && this.scene.textureManager.shadowMaterial) {
            this.scene.textureManager.shadowMaterial.apply();
        }
        this.scene.translate(0, 0.001, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        const shadowSize = this.trunkRadius * 1.3;
        this.scene.scale(shadowSize, shadowSize, 1);
        this.shadow.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();

        // Tilt tree
        if (this.tiltAxis === "x") {
            this.scene.rotate(this.tiltAngle, 1, 0, 0);
        } else if (this.tiltAxis === "z") {
            this.scene.rotate(this.tiltAngle, 0, 0, 1);
        }

        //Trunk
        this.scene.pushMatrix();
        this.scene.textureManager.trunkMaterial.apply();
        this.scene.scale(
            this.trunkRadius / 1.5,
            this.trunkHeight * 2,
            this.trunkRadius / 1.8
        );
        this.trunk.display();
        this.scene.popMatrix();

        //Crown
        const baseHeight = this.trunkHeight - 1;
        const [r, g, b] = this.crownColor;

        const crownMaterial = new CGFappearance(this.scene);
        crownMaterial.setAmbient(r * 0.7, g * 0.7, b * 0.7, 1.0);
        crownMaterial.setDiffuse(r * 1.0, g * 1.0, b * 1.0, 1.0);
        crownMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        crownMaterial.setShininess(10.0);
        crownMaterial.setTextureWrap("REPEAT", "REPEAT");

        const gradMaterial = crownMaterial;
        gradMaterial.setTexture(
            this.scene.textureManager.leavesGradMaterial.texture
        );

        const topMaterial = new CGFappearance(this.scene);
        topMaterial.setAmbient(r * 0.7, g * 0.7, b * 0.7, 1.0);
        topMaterial.setDiffuse(r * 1.0, g * 1.0, b * 1.0, 1.0);
        topMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        topMaterial.setShininess(10.0);
        topMaterial.setTexture(this.scene.textureManager.leavesMaterial.texture);
        topMaterial.setTextureWrap("REPEAT", "REPEAT");

        for (let i = 0; i < this.numPyramids; i++) {
            const scaleFactor = 1 - i * 0.25;
            const heightOffset =
                baseHeight + i * (this.crownHeight / this.numPyramids) * 0.8;

            this.scene.pushMatrix();

            if (i === this.numPyramids - 1) {
                topMaterial.apply();
            } else {
                gradMaterial.apply();
            }

            this.scene.translate(0, heightOffset, 0);
            this.scene.scale(
                this.trunkRadius * 2 * scaleFactor,
                this.crownHeight / this.numPyramids,
                this.trunkRadius * 2 * scaleFactor
            );
            this.pyramid.display();
            this.scene.popMatrix();
        }

        this.scene.popMatrix();
    }
}
