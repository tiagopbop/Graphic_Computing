import { CGFobject, CGFshader, CGFtexture } from '../../lib/CGF.js';
    import { MyPlane } from '../geometric/MyPlane.js';

    /**
     * MyLake
     * @constructor
     * @param scene - Reference to MyScene object
     */
    export class MyLake extends CGFobject {
        constructor(scene) {
            super(scene);
            this.scene = scene;

            // Create a plane for the lake surface
            this.lakeSurface = new MyPlane(scene, 50); // 50 divisions for smoothness

            // Load water texture
            this.waterTexture = new CGFtexture(scene, './textures/plain/waterTex.jpg');

            // Create water material
            this.waterMaterial = new CGFappearance(scene);
            this.waterMaterial.setAmbient(0.3, 0.3, 0.8, 1);
            this.waterMaterial.setDiffuse(0.3, 0.3, 0.8, 1);
            this.waterMaterial.setSpecular(0.8, 0.8, 0.8, 1);
            this.waterMaterial.setShininess(50);
            this.waterMaterial.setTexture(this.waterTexture);
            this.waterMaterial.setTextureWrap('REPEAT', 'REPEAT');

            this.waterShader = new CGFshader(scene.gl, './shaders/waterShader.vert', './shaders/waterShader.frag');
            this.waterShader.setUniformsValues({ waterTexture: 0, time: 0});

        }

        update(t) {
            this.waterShader.setUniformsValues({ time: t / 1000 }); // Update time in seconds
        }
        display() {
            this.scene.pushMatrix();
            this.scene.translate(0, 0.01, 0); // Slightly above ground to avoid z-fighting
            this.scene.scale(10, 1, 10); // Scale to desired lake size

            this.scene.setActiveShader(this.waterShader);
            this.waterTexture.bind(0);
            this.lakeSurface.display();

            this.scene.setActiveShader(this.scene.defaultShader);
            this.scene.popMatrix();
        }
    }