import {CGFappearance, CGFobject} from "../../lib/CGF.js";
import {MySphere} from "../geometric/MySphere.js";

export class MyPanoram extends CGFobject {
    /**
     * Creates an instance of MyPanoram.
     * @param {object} scene - The scene to which this object belongs.
     * @param {object} texture - The texture to be applied to the panorama.
     */
    constructor(scene, texture) {
        super(scene);
        this.sphere = new MySphere(this.scene, 50, 50, true, 200);
        this.material = new CGFappearance(this.scene);
        this.material.setEmission(1, 1, 1, 1);
        this.material.setTexture(texture);
    }

    /**
     * Displays the panorama by applying the material and rendering the sphere.
     * Positions the sphere at the camera's location and rotates it for correct orientation.
     */
    display() {
        this.scene.pushMatrix();
        this.material.apply();
        this.scene.translate(
            this.scene.camera.position[0],
            0,
            this.scene.camera.position[2]
        );
        this.scene.rotate(Math.PI / 2, 1, 0, 0);
        this.sphere.display();
        this.scene.popMatrix();
    }
}
