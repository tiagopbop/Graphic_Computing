import { CGFobject } from '../../lib/CGF.js';
import { MyTree } from './MyTree.js';

export class MyForest extends CGFobject {
    constructor(scene, rows, cols, spacing) {
        super(scene);
        this.rows = rows;
        this.cols = cols;
        this.spacing = spacing;

        // Create matrix of trees
        this.trees = [];
        for (let i = 0; i < rows; i++) {
            this.trees[i] = [];
            for (let j = 0; j < cols; j++) {
                this.trees[i][j] = new MyTree(scene, 40, 6, 10, 3); // Tree params
            }
        }
    }

    display() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const tree = this.trees[i][j];
                const x = i * this.spacing;
                const z = j * this.spacing;

                // Trunk
                this.scene.pushMatrix();
                this.scene.trunkMaterial.apply();
                this.scene.translate(x, 0, z);
                this.scene.scale(1, 1, 1);
                tree.trunk.display();
                this.scene.popMatrix();

                // Foliage layers
                const foliageHeights = [1, 1.7, 2.3];
                const foliageScales = [1.0, 0.8, 0.6];
                for (let k = 0; k < foliageHeights.length; k++) {
                    this.scene.pushMatrix();
                    this.scene.leavesMaterial.apply();
                    this.scene.translate(x, foliageHeights[k], z);
                    this.scene.scale(foliageScales[k], foliageScales[k], foliageScales[k]);
                    tree.foliage.display();
                    this.scene.popMatrix();
                }
            }
        }
    }
}
