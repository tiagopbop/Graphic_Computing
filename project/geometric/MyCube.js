import {CGFobject} from '../../lib/CGF.js';
/**
 * MySphere
 * @constructor
 * @param scene - Reference to MyScene object
 * @param height - The height of the Cube (i.e., the up-most vertices)
 * @param length - The length of the Cube (i.e., the sides size in XY plane)
 * @param depth - The depth of the Cube (i.e., the sides size in the YZ plane)
 */
export class MyCube extends CGFobject {
    constructor(scene, height, length, depth) {
        super(scene);
        this.height = height;
        this.length = length;
        this.depth = depth;
        this.initBuffers();
    }

    initBuffers() {
        // Assuming the cube is centered at the origin
        /* The coordinates for each vertex of the cube are as follows:
            height2 = height / 2;
            length2 = length / 2;
            depth2 = depth / 2;

            xMax = length2;
            xMin = -length2;
            yMax = depth2;
            yMin = -depth2;
            zMax = height2;
            zMin = -height2;
         */

        const height2 = this.height / 2;
        const length2 = this.length / 2;
        const depth2 = this.depth / 2;

        this.vertices = [
            // Front Face
            -length2, -height2, depth2,
            length2, -height2, depth2,
            length2, height2, depth2,
            -length2, height2, depth2,

            // Back Face
            -length2, -height2, -depth2,
            -length2, height2, -depth2,
            length2, height2, -depth2,
            length2, -height2, -depth2,

            // Top Face
            -length2, height2, depth2,
            length2, height2, depth2,
            length2, height2, -depth2,
            -length2, height2, -depth2,

            // Bottom Face
            -length2, -height2, depth2,
            -length2, -height2, -depth2,
            length2, -height2, -depth2,
            length2, -height2, depth2,

            // Right Face
            length2, -height2, depth2,
            length2, -height2, -depth2,
            length2, height2, -depth2,
            length2, height2, depth2,


            // Left Face
            -length2, -height2, depth2,
            -length2, height2, depth2,
            -length2, height2, -depth2,
            -length2, -height2, -depth2,

        ];

        this.indices = [

            // Front Face
            0, 1, 2,
            0, 2, 3,

            // Back Face
            4, 5, 6,
            4, 6, 7,

            // Top Face
            8, 9, 10,
            8, 10, 11,

            // Bottom Face
            12, 13, 14,
            12, 14, 15,

            // Right Face
            16, 17, 18,
            16, 18, 19,

            // Left Face
            20, 21, 22,
            20, 22, 23,
        ];

        this.vertices.push(0,1,0);

        this.normals = [
            // Front Face
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            // Back Face
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            // Top Face
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,
            0, 1, 0,

            // Bottom Face
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,
            0, -1, 0,

            // Right Face
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
            1, 0, 0,

            // Left Face
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,

        ];

        this.texCoords = [
            // Front Face
            0, 1,
            1, 1,
            1, 0,
            0, 0,

            // Back Face
            1, 1,
            1, 0,
            0, 0,
            0, 1,

            // Top Face
            0, 1,
            1, 1,
            1, 0,
            0, 0,

            // Bottom Face
            0, 0,
            0, 1,
            1, 1,
            1, 0,

            // Right Face
            0, 1,
            1, 1,
            1, 0,
            0, 0,

            // Left Face
            1, 1,
            1, 0,
            0, 0,
            0, 1,
        ];


        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

