import { CGFobject } from '../../lib/CGF.js';
import { MyTree } from './MyTree.js';
import { MyFire } from './MyFire.js';

export class MyForest extends CGFobject {
    constructor(scene, rows, cols, onFireSide = false, width = 310, length = 700) {
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
                const tiltAxis = Math.random() > 0.5 ? 'x' : 'z';
                const trunkRadius = 0.5 + Math.random() * 0.5;
                const height = 5 + Math.random() * 5;

                const foliageColors = [
                    [0.1, 0.4, 0.1],  // dark green
                    [0.2, 0.6, 0.2],  // green
                    [0.8, 0.8, 0.2],  // yellow
                    [0.9, 0.5, 0.1],  // orange
                    [0.9, 0.2, 0.1],  // red
                ];
                const crownColor = foliageColors[Math.floor(Math.random() * foliageColors.length)];
                const treeScale = 5 + Math.random();

                const on_fire = onFireSide;

                this.trees.push({
                    x, z, scale: treeScale,
                    on_fire,
                    tree: new MyTree(scene, tiltAngle, tiltAxis, trunkRadius, height, crownColor)
                });
            }
        }

        if (onFireSide) {
            this.forestFire = new MyFire(scene, totalWidth, totalLength);
        }
    }

    update(timeFactor) {
        if (this.forestFire) {
            this.forestFire.update(timeFactor);
        }
    }

    display() {
        for (const { x, z, scale, tree, on_fire } of this.trees) {
            this.scene.pushMatrix();
            this.scene.translate(x, 0, z);
            this.scene.scale(scale, scale, scale);
            tree.display(false);
            this.scene.popMatrix();
        }

        if (this.forestFire) {
            this.forestFire.display();
        }
    }
}