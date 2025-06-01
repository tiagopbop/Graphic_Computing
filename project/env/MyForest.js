import {CGFobject} from "../../lib/CGF.js";
import {MyTree} from "./MyTree.js";
import {MyFire} from "./MyFire.js";

export class MyForest extends CGFobject {
    /**
     * Constructs a new MyForest instance, generating a grid of trees with random positions, tilts, sizes, and colors.
     * Optionally, the forest can be marked as "on fire" and include a fire effect.
     *
     * @param {CGFscene} scene - The scene to which the forest belongs.
     * @param {number} rows - Number of rows of trees in the forest.
     * @param {number} cols - Number of columns of trees in the forest.
     * @param {boolean} [onFireSide=false] - Whether this side of the forest is on fire.
     * @param {number} [width=310] - Total width of the forest area.
     * @param {number} [length=700] - Total length of the forest area.
     */
    constructor(
        scene,
        rows,
        cols,
        onFireSide = false,
        width = 310,
        length = 700
    ) {
        super(scene);
        this.trees = [];
        this.onFireSide = onFireSide;

        const totalWidth = width;
        const totalLength = length;

        const spacingX = totalWidth / cols;
        const spacingZ = totalLength / rows;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                const offsetX = (Math.random() - 0.5) * spacingX * 0.6;
                const offsetZ = (Math.random() - 0.5) * spacingZ * 0.6;

                const x = -totalWidth / 2 + j * spacingX + offsetX;
                const z = -totalLength / 2 + i * spacingZ + offsetZ;

                const tiltAngle = Math.random() * 15;
                const tiltAxis = Math.random() > 0.5 ? "x" : "z";
                const trunkRadius = 0.5 + Math.random() * 0.5;
                const height = 5 + Math.random() * 5;

                const foliageColors = [
                    [0.1, 0.4, 0.1], // dark green
                    [0.2, 0.6, 0.2], // green
                    [0.8, 0.8, 0.2], // yellow
                    [0.9, 0.5, 0.1], // orange
                    [0.9, 0.2, 0.1], // red
                ];
                const crownColor =
                    foliageColors[Math.floor(Math.random() * foliageColors.length)];
                const treeScale = 5 + Math.random();

                const on_fire = onFireSide;

                this.trees.push({
                    x,
                    z,
                    scale: treeScale,
                    on_fire,
                    tree: new MyTree(
                        scene,
                        tiltAngle,
                        tiltAxis,
                        trunkRadius,
                        height,
                        crownColor
                    ),
                });
            }
        }

        if (onFireSide) {
            this.forestFire = new MyFire(scene, totalWidth, totalLength);
        }
    }

    /**
     * Updates the forest's state based on the given time factor.
     * @param timeFactor - The time factor to adjust the forest's animation.
     */
    update(timeFactor) {
        if (this.forestFire) {
            this.forestFire.update(timeFactor);
        }
    }

    /**
     * Extinguishes the forest fire by removing the fire instance and setting all trees' on_fire status to false.
     */
    extinguish() {
        if (this.forestFire) {
            this.forestFire = null;
        }
        for (const tree of this.trees) {
            tree.on_fire = false;
        }

    }

    /**
     * Renders the forest by displaying all its trees and their fire effects if applicable.
     */
    display() {
        for (const {x, z, scale, tree, on_fire} of this.trees) {
            this.scene.pushMatrix();
            this.scene.translate(x, 0, z);
            this.scene.scale(scale, scale, scale);
            tree.display(on_fire);
            this.scene.popMatrix();
        }

        if (this.forestFire) {
            this.forestFire.display();
        }
    }
}
