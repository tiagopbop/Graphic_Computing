import {CGFobject} from '../../lib/CGF.js';
/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 * @param height - The height of the triangle (i.e., the up-most vertices)
 * @param base - The base length of the triangle (i.e., the sides size in XY plane)
 */

export class MyTriangle extends CGFobject{
    constructor(scene, height, base, depth) {
        super(scene);
        this.height = height;
        this.base = base;
        this.depth = depth;

        this.initBuffers();
    }

    initBuffers(){
        this.halfHeight = this.height / 2;
        this.halfBase = this.base / 2;
        this.halfDepth = this.depth / 2;

        this.vertices = [
            -this.halfBase, this.halfHeight, this.halfDepth, // xA, yA, zA (0)
            -this.halfBase, -this.halfHeight, this.halfDepth, // xB, yB, zB (1)
            this.halfBase, -this.halfHeight, this.halfDepth, // xC, yC, zC (2)

            // Each Vertex in Triangle should have 2 Normals, 1 for each Face
            -this.halfBase, this.halfHeight, -this.halfDepth, // (3)
            -this.halfBase, -this.halfHeight, -this.halfDepth, // (4)
            this.halfBase, -this.halfHeight, -this.halfDepth, // (5)
        ];

        this.indices = [
            0, 1, 2,
            3, 5, 4
        ];

        this.indices.push(
            0, 3, 4,  0, 4, 1,  // Left side
            1, 4, 5,  1, 5, 2,  // Bottom side
            2, 5, 3,  2, 3, 0   // Right side
        );

        // Normal Vectors
        this.normals = [
            0, 0, 1,
            0, 0, 1,
            0, 0, 1,

            0, 0, -1,
            0, 0, -1,
            0, 0, -1,

            -1, 0, 0,
            -1, 0, 0,
            -1, 0, 0,

            0, -1, 0,
            0, -1, 0,
            0, -1, 0,

            1, 0, 0,
            1, 0, 0,
            1, 0, 0,
        ]


        this.texCoords = [
            0, 0.5,
            0, 1,
            0.5, 1,

            0, 0.5,
            0, 1,
            0.5, 1,
        ]
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }

}

