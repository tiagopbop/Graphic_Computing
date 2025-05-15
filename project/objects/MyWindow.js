import {CGFobject} from '../../lib/CGF.js';

/**
 * MyWindow
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyWindow extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }

    initBuffers() {
        // Define vertices, indices, and other buffer data for the window
        this.vertices = [
            -1, -1, 0,  // Bottom-left
            1, -1, 0,   // Bottom-right
            -1, 1, 0,   // Top-left
            1, 1, 0     // Top-right
        ];

        this.indices = [
            0, 1, 2,
            1, 3, 2
        ];

        this.texCoords = [
            0, 1,
            1, 1,
            0, 0,
            1, 0
        ];

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    display() {
        // Apply the window texture
        this.scene.textureManager.windowMaterial.apply();

        // Render the window
        super.display();
    }
}