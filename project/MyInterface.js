import { CGFinterface, dat } from '../lib/CGF.js';

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

        this.initKeys();

        // Axis Display
        this.gui.add(this.scene, 'displayAxis').name("Display axis");

        // Camera Zoom
        this.gui.add(this.scene, 'cameraZoom', 0.1, 2.0).name('Camera Zoom');

        // Scale Factor
        this.gui.add(this.scene, 'scaleFactor', 0.1, 50.0).name('Scale');

        // Ambient Light
        this.gui.add(this.scene, 'ambientlightFactor', 0.1, 1.0).name('Ambient Light');
        
        //heli speed
        this.gui.add(this.scene, 'speedFactor', 0.1, 3.0).name('Speed Factor');



        // Lights
        // a folder for grouping parameters for one of the lights
        var f0 = this.gui.addFolder('Light 0 ');
        f0.add(this.scene.lights[0], 'enabled').name("Enabled");
        // a subfolder for grouping only the three coordinates of the light
        var sf0 = f0.addFolder('Light 0 Position');
        sf0.add(this.scene.lights[0].position, '0', -100.0, 100.0).name("X Position");
        sf0.add(this.scene.lights[0].position, '1', -100.0, 100.0).name("Y Position");
        sf0.add(this.scene.lights[0].position, '2', -100.0, 100.0).name("Z Position");

        // similar but for light 1
        var f1 = this.gui.addFolder('Light 1 ');
        f1.add(this.scene.lights[1], 'enabled').name("Enabled");
        var sf1 = f1.addFolder('Light 1 Position');
        sf1.add(this.scene.lights[1].position, '0', -100.0, 100.0).name("X Position");
        sf1.add(this.scene.lights[1].position, '1', -100.0, 100.0).name("Y Position");
        sf1.add(this.scene.lights[1].position, '2', -100.0, 100.0).name("Z Position");
        var sf2 = f1.addFolder('Light 1 Attenuation');
        sf2.add(this.scene.lights[1], 'constant_attenuation', 0.00, 1.00).name("Const. Atten.");
        sf2.add(this.scene.lights[1], 'linear_attenuation', 0.0, 1.0).name("Linear Atten.");
        sf2.add(this.scene.lights[1], 'quadratic_attenuation', 0.0, 1.0).name("Quad. Atten.");

        // Reset Camera FOV
        this.gui.add(this.scene, 'resetCamera').name('Reset Camera');

        return true;
    }



    initKeys() {
        // create reference from the env to the GUI
        this.scene.gui = this;

        // disable the processKeyboard function
        this.processKeyboard = function () { };

        // create a named array to store which keys are being pressed
        this.activeKeys = {};
    }
    processKeyDown(event) {
        // called when a key is pressed down
        // mark it as active in the array
        this.activeKeys[event.code] = true;
    };

    processKeyUp(event) {
        // called when a key is released, mark it as inactive in the array
        this.activeKeys[event.code] = false;
    };

    isKeyPressed(keyCode) {
        // returns true if a key is marked as pressed, false otherwise
        return this.activeKeys[keyCode] || false;
    }



}