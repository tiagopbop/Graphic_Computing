
import {CGFapplication} from '../lib/CGF.js';
import { MyScene } from './MyScene.js';
import { MyInterface } from './MyInterface.js';
import { MyScene2 } from './MyScene2.js';
import { MyInterface2 } from './MyInterface2.js';

function main()
{
    var app = new CGFapplication(document.body);
    var myScene2 = new MyScene();
    var myInterface2 = new MyInterface();

    app.init();

    app.setScene(myScene2);
    app.setInterface(myInterface2);

    myInterface2.setActiveCamera(myScene2.camera);

    app.run();
}

main();