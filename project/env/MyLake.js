import {CGFobject, CGFappearance, CGFshader} from "../../lib/CGF.js";

export class MyLake extends CGFobject {
    /**
     * Creates an instance of MyLake.
     * @param {CGFscene} scene - The scene to which the lake belongs.
     * @param {number} [radius=25] - The radius of the lake.
     * @param {number} [subdivisions=64] - The number of subdivisions for the lake geometry.
     */
    constructor(scene, radius = 25, subdivisions = 64) {
        super(scene);
        this.scene = scene;
        this.radius = radius;
        this.subdivisions = subdivisions;
        this.timeFactor = 0;

        if (scene && scene.gl) {
            this.waterShader = new CGFshader(
                scene.gl,
                "shaders/water.vert",
                "shaders/water.frag"
            );
        }

        this.initBuffers();
    }

  /**
   * Initializes the buffers for the lake geometry.
   * This method creates the vertices, normals, and texture coordinates for the lake geometry.
   */
  initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        const centerX = 0;
        const centerZ = 0;

        // Center vertex
        this.vertices.push(centerX, 0, centerZ);
        this.normals.push(0, 1, 0);
        this.texCoords.push(0.5, 0.5);

        for (let i = 0; i <= this.subdivisions; i++) {
            const angle = (i / this.subdivisions) * Math.PI * 2;

            let radiusVariation = 1.3;

            radiusVariation += 0.15 * Math.sin(angle * 2); // 2 gentle bulges
            radiusVariation += 0.1 * Math.cos(angle * 4); // smaller variations
            radiusVariation += 0.05 * Math.sin(angle * 7); // tiny details

            radiusVariation = Math.max(1.0, Math.min(1.5, radiusVariation));

            const actualRadius = this.radius * radiusVariation;

            const x = centerX + Math.cos(angle) * actualRadius;
            const z = centerZ + Math.sin(angle) * actualRadius;

            this.vertices.push(x, 0, z);
            this.normals.push(0, 1, 0);

            const texX = 0.5 + 0.5 * Math.cos(angle);
            const texZ = 0.5 + 0.5 * Math.sin(angle);
            this.texCoords.push(texX, texZ);
        }

        for (let i = 0; i < this.subdivisions; i++) {
            this.indices.push(0); // center
            this.indices.push(1 + ((i + 1) % this.subdivisions));
            this.indices.push(1 + i);
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }

    /**
     * Updates the time factor for the water shader.
     * @param {number} timeFactor - The new time factor.
     */
    update(timeFactor) {
        this.timeFactor = timeFactor;
        if (this.waterShader) {
            this.waterShader.setUniformsValues({
                timeFactor: timeFactor,
                uWaterTex: 0,
            });
        }
    }

    /**
     * Displays the lake geometry.
     */
    display() {
        this.scene.gl.activeTexture(this.scene.gl.TEXTURE0);
        this.scene.textureManager.waterTexture.bind();

        this.scene.setActiveShader(this.waterShader);
        super.display();

        this.scene.setActiveShader(this.scene.defaultShader);
    }
}
