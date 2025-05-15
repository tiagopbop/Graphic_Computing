import { CGFobject, CGFappearance } from '../../lib/CGF.js';
import { MyCone } from './MyCone.js';
import { MyPyramid } from './MyPyramid.js';

export class MyTree extends CGFobject {
    constructor(scene, tiltAngleDeg, tiltAxis, trunkRadius, treeHeight, crownColorRGB) {
        super(scene);

        this.scene = scene;
        this.tiltAngle = tiltAngleDeg * Math.PI / 180;
        this.tiltAxis = tiltAxis.toLowerCase();
        this.trunkRadius = trunkRadius;
        this.treeHeight = treeHeight;
        this.crownColor = crownColorRGB;

        this.trunk = new MyCone(scene, 20, 1);
        this.pyramid = new MyPyramid(scene, 4, 1);

        this.crownHeight = 0.8 * treeHeight;
        this.trunkHeight = 0.3 * treeHeight;
        this.numPyramids = Math.ceil(this.crownHeight / 2);
    }

    display() {
        this.scene.pushMatrix();

        // Tilt tree
        if (this.tiltAxis === 'x') {
            this.scene.rotate(this.tiltAngle, 1, 0, 0);
        } else if (this.tiltAxis === 'z') {
            this.scene.rotate(this.tiltAngle, 0, 0, 1);
        }

        //Trunk 
        this.scene.pushMatrix();
        this.scene.trunkMaterial.apply();
        this.scene.scale(this.trunkRadius / 1.5, this.trunkHeight * 2, this.trunkRadius / 1.8);
        this.trunk.display();
        this.scene.popMatrix();

        //Crown 
        const baseHeight = this.trunkHeight - 1;
        const [r, g, b] = this.crownColor;

        //tree colored texture
        const crownMaterial = new CGFappearance(this.scene);
        crownMaterial.setAmbient(r * 0.7, g * 0.7, b * 0.7, 1.0);
        crownMaterial.setDiffuse(r * 1.0, g * 1.0, b * 1.0, 1.0);
        crownMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        crownMaterial.setShininess(10.0);
        crownMaterial.setTexture(this.scene.leavesMaterial.texture); // gray texture
        crownMaterial.setTextureWrap('REPEAT', 'REPEAT');

        for (let i = 0; i < this.numPyramids; i++) {
            const scaleFactor = 1 - i * 0.25;
            const heightOffset = baseHeight + i * (this.crownHeight / this.numPyramids) * 0.8;

            this.scene.pushMatrix();
            crownMaterial.apply();
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
