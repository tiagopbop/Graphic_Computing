import {CGFinterface, dat} from '../lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);
        
        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();

        //Checkbox element in GUI
        this.gui.add(this.scene, 'displayAxis').name('Display Axis');

        //Slider element in GUI
        this.gui.add(this.scene, 'scaleFactor', 0.1, 5).name('Scale Factor');

        //Checkbox to show tangram in GUI
        this.gui.add(this.scene, 'tangramCheck').name('Tangram Check');
        this.gui.add(this.scene, 'unitcubeCheck').name('Unit Cube Check');
        this.gui.add(this.scene, 'quadCheck').name('Quad Check');
        this.gui.add(this.scene, 'unitcubequadCheck').name('Unit Cube Quad Check');



        return true;
    }
}