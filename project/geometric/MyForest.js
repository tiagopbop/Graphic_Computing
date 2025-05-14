import { CGFobject } from '../../lib/CGF.js';
import { MyTree } from './MyTree.js';

export class MyForest extends CGFobject {
    constructor(scene, rows, cols) {
        super(scene);
        this.trees = [];

        const planeRadius = 500;         //extra to have trees when moving
        const exclusionRadius = 80;       //space for building
        const totalWidth = planeRadius * 2;

        const spacingX = totalWidth / cols;
        const spacingZ = totalWidth / rows;

        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                // Random offset - no grid lock
                const offsetX = (Math.random() - 0.5) * spacingX * 0.7;
                const offsetZ = (Math.random() - 0.5) * spacingZ * 0.7;

                const x = -planeRadius + j * spacingX + offsetX;
                const z = -planeRadius + i * spacingZ + offsetZ;

                // Skip trees near the center
                const distToCenter = Math.sqrt(x * x + z * z);
                if (distToCenter < exclusionRadius || distToCenter > planeRadius) continue;

                // Random parameters
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

                this.trees.push({
                    x, z, scale: treeScale,
                    tree: new MyTree(scene, tiltAngle, tiltAxis, trunkRadius, height, crownColor)
                });
            }
        }
    }

    display() {
        for (const { x, z, scale, tree } of this.trees) {
            this.scene.pushMatrix();
            this.scene.translate(x, 0, z);
            this.scene.scale(scale, scale, scale);
            tree.display();
            this.scene.popMatrix();
        }
    }
}
