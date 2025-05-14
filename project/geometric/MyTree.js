import {CGFobject} from '../../lib/CGF.js';
import { MyCylinder } from './MyCylinder.js';
import { MyPyramid } from './MyPyramid.js';


export class MyTree extends CGFobject {
    constructor(scene, trunkSlices, trunkStacks, foliageSlices, foliageStacks) {
        super(scene);

        // Just store the trunk and foliage components
        this.trunk = new MyCylinder(scene, trunkSlices, trunkStacks);
        this.foliage = new MyPyramid(scene, foliageSlices, foliageStacks);
    }
}

