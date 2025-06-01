import {CGFobject} from "../../lib/CGF.js";
import {MyTriangle} from "./MyTriangle.js";
import {MyCube} from "./MyCube.js";

/**
 * MyTrapezoid
 * @constructor
 * @param scene - Reference to MyScene object
 * @param bottomLength - The length of the bottom edge of the trapezoid
 * @param topLength - The length of the top edge of the trapezoid
 * @param height - The height of the trapezoid
 * @para  depth - The depth of the Trapezoid
 */
export class MyTrapezoid extends CGFobject {
    constructor(scene, bottomLength, topLength, height, depth) {
        super(scene);
        this.height = height;
        this.bottomLength = bottomLength;
        this.topLength = topLength;
        this.depth = depth;

        this.lengthDiff = bottomLength - topLength;

        this.triangle = new MyTriangle(scene, height, this.lengthDiff, depth);

        this.square = new MyCube(scene, height, topLength, depth);
    }

    display() {
        this.scene.gl.enable(this.scene.gl.POLYGON_OFFSET_FILL);
        this.scene.gl.polygonOffset(2, 2);

        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0);
        this.triangle.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-this.topLength / 2 - this.lengthDiff / 2, 0, 0);
        this.square.display();
        this.scene.popMatrix();

        this.scene.gl.disable(this.scene.gl.POLYGON_OFFSET_FILL);
    }
}
