import { CGFobject } from "../../lib/CGF.js";
import { MyCube } from "../geometric/MyCube.js";
import { MyWindow } from "./MyWindow.js";
import { MyCircle } from "../geometric/MyCircle.js";

export class MyBuilding extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        // Common Columns
        this.column = new MyCube(scene, 6.3, 1, 0.3);       // front and back columns
        this.column1 = new MyCube(scene, 6.3, 0.3, 1);      // left and right columns

        // Taller columns
        this.columnTall = new MyCube(scene, 10.3, 1, 0.3);      // front tall column
        this.columnTall2 = new MyCube(scene, 10.3, 0.3, 1);     // right and left tall column
        this.columnTaller = new MyCube(scene, 12.3, 1, 0.3);
        this.columnTaller2 = new MyCube(scene, 12.3, 0.3, 1);

        // Shorter columns
        this.columnShort = new MyCube(scene, 4, 1, 0.3);        // back short column
        this.columnShort2 = new MyCube(scene, 4, 0.3, 1);       // left short column

        this.separator = new MyCube(scene, 0.3, 3, 0.3);    // front and back separator
        this.separator2 = new MyCube(scene, 0.3, 0.3, 3);   // left and right separator

        this.separatorTall = new MyCube(scene, 0.3, 7, 0.3);    // front tall separator
        this.separatorTall2 = new MyCube(scene, 0.3, 0.3, 12.5);   // right and left tall separator

        this.base = new MyCube(scene, 0.1, 29, 16);           // wide, flat base

        // Garage and Entrance
        this.garage = new MyCube(scene, 6.3, 9, 9);

        this.entrance = new MyCube(scene, 10.3, 5, 11);

        this.entrance2 = new MyCube(scene, 12.3, 8, 13.5);

        this.roofTop = new MyCube(scene, 0.1, 6, 13);

        // Roof Ledge
        this.roofLedge = new MyCube(scene, 0.5, 8.7, 0.3);    // Ledge Front
        this.roofLedge2 = new MyCube(scene, 0.5, 0.3, 9);      // Ledge Left
        this.roofLedge3 = new MyCube(scene, 0.5, 8.7, 0.3);    // Ledge Back
        this.roofLedge4 = new MyCube(scene, 0.5, 0.3, 9);    // Ledge Right

        // Roof Ledge Heli
        this.roofLedgeHeli = new MyCube(scene, 0.5, 7.7, 0.3);    // Ledge Heli Front
        this.roofLedgeHeli2 = new MyCube(scene, 0.5, 0.3, 13.5);    // Ledge Heli Left
        this.roofLedgeHeli3 = new MyCube(scene, 0.5, 7.7, 0.3);    // Ledge Heli Back
        this.roofLedgeHeli4 = new MyCube(scene, 0.5, 0.3, 13.5);    // Ledge Heli Right

        this.topPanel = new MyCube(scene, 0.1, 9, 9);
        this.topPanel2 = new MyCube(scene, 0.1, 8, 13.5);

        // Windows
        this.window = new MyWindow(scene);

        // Door
        this.door = new MyCube(scene, 3.5, 3, 0);

        // Garage Door
        this.garageDoor = new MyCube(scene, 6.3, 3, 0);

        // Helipad
        this.helipad = new MyCircle(scene, 64, 1);

        // Logo
        this.logo = new MyCube(scene, .75, 4.5, 0);
    }

    display() {
        // Base: flat on XZ plane
        this.scene.pushMatrix();
        this.base.display();
        this.scene.popMatrix();

        // Columns and Separators - Translated based on positions
        this.displayColumns();
        this.displaySeparators();

        // Roof and Ledges
        this.displayRoof();
        this.displayLedges();

        // Display the top panel without a texture and position it correctly
        this.scene.pushMatrix();
        this.scene.textureManager.concreteMaterial.apply();
        this.scene.translate(-9, 6.5, -1.5); // Adjust the position of the top panel
        this.topPanel.display();  // Render the top panel
        this.scene.popMatrix();

        // Display top panel 2
        this.scene.pushMatrix();
        this.scene.textureManager.concreteMaterial.apply();
        this.scene.translate(4.5, 12.5, -.5); // Adjust the position of the top panel
        this.topPanel2.display();  // Render the top panel
        this.scene.popMatrix();

        // Main Structure - Applying textures
        this.displayGarage();
        this.displayEntrances();

        // Windows
        this.displayWindows();

        // Door
        this.scene.pushMatrix();
        this.scene.textureManager.doorMaterial.apply();
        this.scene.translate(4.55, 1.75, 6.28);
        this.door.display();
        this.scene.popMatrix();

        // Garage Door
        this.scene.pushMatrix();
        this.scene.textureManager.garageMaterial.apply();
        this.scene.translate(-7, 3.15, 3.15);
        this.garageDoor.display();
        this.scene.popMatrix();

        // Garage Door 2
        this.scene.pushMatrix();
        this.scene.translate(-11, 3.15, 3.15);
        this.garageDoor.display();
        this.scene.popMatrix();

        // Helipad
        this.scene.pushMatrix();
        this.scene.textureManager.helipadMaterial.apply();
        this.scene.textureManager.helipadMaterial.setAmbient(0.3, 0.3, 0.3, 1);
        this.scene.translate(4.5, 12.6, -.5); // Adjust the position of the helipad
        this.scene.rotate(-Math.PI / 2, 1, 0, 0); // Rotate the helipad to face the correct direction
        this.scene.scale(3, 3, 1); // Scale the helipad
        this.helipad.display();  // Render the helipad
        this.scene.popMatrix();

        // Logo
        this.scene.pushMatrix();
        this.scene.textureManager.logoMaterial.apply();
        this.scene.translate(4.55, 4.5, 6.4); // Adjust the position of the logo
        this.logo.display();  // Render the logo
        this.scene.popMatrix();
    }



    displayColumns() {
        // Column positions and display logic
        const columnPositions = [
            [-5, 3.25, 3.15], [-9, 3.25, 3.15], [-13, 3.25, 3.15],
            [-13, 3.25, -6.15], [-9, 3.25, -6.15], [-5, 3.25, -6.15]
        ];

        columnPositions.forEach(([x, y, z]) => {
            this.scene.pushMatrix();
            this.scene.textureManager.concreteTilesMaterial.apply();
            this.scene.translate(x, y, z);
            this.column.display();
            this.scene.popMatrix();
        });

        // Additional columns (left/right, tall, short)
        this.displayAdditionalColumns();
    }

    displayAdditionalColumns() {
        // Left and Right Columns
        const column1Positions = [
            [-13.65, 3.25, 2.5], [-13.65, 3.25, -1.5], [-13.65, 3.25, -5.5]
        ];
        column1Positions.forEach(([x, y, z]) => {
            this.scene.pushMatrix();
            this.scene.textureManager.concreteTilesMaterial.apply();
            this.scene.translate(x, y, z);
            this.column1.display();
            this.scene.popMatrix();
        });

        // Tall and Short Columns
        this.displayTallShortColumns();
    }

    displayTallShortColumns() {
        const tallColumnPositions = [
            [-4, 5.25, 5.15], [0, 5.25, 5.15],
            [-4, 5.25, -6.15], [0, 5.25, -6.15],
            [9, 5.25, 5.15], [13.05, 5.25, 5.15],
            [9, 5.25, -6.15], [13.05, 5.25, -6.15]
        ];
        tallColumnPositions.forEach(([x, y, z]) => {
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.columnTall.display();
            this.scene.popMatrix();
        });

        const tallColumn2Positions = [
            [-4.65, 5.25, 4.5], [13.7, 5.25, 4.5], [13.7, 5.25, -5.5]
        ];
        tallColumn2Positions.forEach(([x, y, z]) => {
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.columnTall2.display();
            this.scene.popMatrix();
        });

        const tallColumn3Positions = [
            [1, 6.25, 6.40], [8.05, 6.25, 6.40],
            [1, 6.25, -7.4], [8.05, 6.25, -7.4]
        ];

        tallColumn3Positions.forEach(([x, y, z]) => {
           this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.columnTaller.display();
            this.scene.popMatrix();
        });

        const tallColumn4Positions = [
            [.45, 6.25, 5.75], [.45, 6.25, -6.75],
            [8.7, 6.25, 5.75], [8.7, 6.25, -6.75]
        ];

        tallColumn4Positions.forEach(([x, y, z]) => {
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.columnTaller2.display();
            this.scene.popMatrix();
        });

        // Left Short Column
        this.scene.pushMatrix();
        this.scene.translate(-4.65, 8.4, -5.5);
        this.columnShort2.display();
        this.scene.popMatrix();
    }

    displaySeparators() {
        const separatorsPositions = [
            [-7, 6.25, 3.15], [-11, 6.25, 3.15],
            [-11, 6.25, -6.15], [-7, 6.25, -6.15]
        ];
        separatorsPositions.forEach(([x, y, z]) => {
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.separator.display();
            this.scene.popMatrix();
        });

        // Left and Right Separators
        this.scene.pushMatrix();
        this.scene.translate(-13.65, 6.25, .5);
        this.separator2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-13.65, 6.25, -3.5);
        this.separator2.display();
        this.scene.popMatrix();

        const separatorsTallPositions = [
            [4.6, 12.25, 6.4], [4.55, 12.25, -7.4]
        ];

        separatorsTallPositions.forEach(([x, y, z]) => {
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.separatorTall.display();
            this.scene.popMatrix();
        });

        const separatorsTall2Positions = [
            [.45, 12.25, -.5], [8.7, 12.25, -.5]
        ];

        separatorsTall2Positions.forEach(([x, y, z]) => {
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.separatorTall2.display();
            this.scene.popMatrix();
        });
    }

    displayRoof() {
        // Roof Left
        this.scene.pushMatrix();
        this.scene.textureManager.concreteMaterial.apply();
        this.scene.translate(-2.5, 10.45, -.25);
        this.roofTop.display();
        this.scene.popMatrix();

        // Roof Right
        this.scene.pushMatrix();
        this.scene.textureManager.concreteMaterial.apply();
        this.scene.translate(11.5, 10.45, -.25);
        this.roofTop.display();
        this.scene.popMatrix();

    }

    displayLedges() {
        // Ledge positions and display
        this.scene.pushMatrix();
        this.scene.textureManager.concreteTilesMaterial.apply();
        this.scene.translate(-8.9, 6.55, 2.85);
        this.roofLedge.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.textureManager.concreteTilesMaterial.apply();
        this.scene.translate(-13.35, 6.55, -1.5);
        this.roofLedge2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.textureManager.concreteTilesMaterial.apply();
        this.scene.translate(-8.9, 6.55, -5.85);
        this.roofLedge3.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.textureManager.concreteTilesMaterial.apply();
        this.scene.translate(-4.55, 6.55, -1.5);
        this.roofLedge4.display();
        this.scene.popMatrix();

        // Heli Ledge positions and display
        this.scene.pushMatrix();
        this.scene.textureManager.concreteTilesMaterial.apply();
        this.scene.translate(4.7, 12.55, 6.1);
        this.roofLedgeHeli.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.textureManager.concreteTilesMaterial.apply();
        this.scene.translate(.7, 12.55, -.5);
        this.roofLedgeHeli2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.textureManager.concreteTilesMaterial.apply();
        this.scene.translate(4.7, 12.55, -7.1);
        this.roofLedgeHeli3.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.textureManager.concreteTilesMaterial.apply();
        this.scene.translate(8.4, 12.55, -.5);
        this.roofLedgeHeli4.display();
        this.scene.popMatrix();
    }


    displayGarage() {
        this.scene.pushMatrix();
        this.scene.textureManager.sandstoneBrickWallMaterial.apply();
        this.scene.translate(-9, 3.25, -1.5);
        this.garage.display();
        this.scene.popMatrix();
    }

    displayEntrances() {
        // Entrance positions and display logic

        // Entrance Left
        this.scene.pushMatrix();
        this.scene.textureManager.sandstoneBrickWallMaterial.apply();
        this.scene.translate(-2, 5.25, -0.5);
        this.entrance.display();
        this.scene.popMatrix();

        // Entrance Middle
        this.scene.pushMatrix();
        this.scene.textureManager.sandstoneBrickWallMaterial.apply();
        this.scene.translate(4.55, 6.25, -0.5);
        this.entrance2.display();
        this.scene.popMatrix();

        // Entrance Right
        this.scene.pushMatrix();
        this.scene.textureManager.sandstoneBrickWallMaterial.apply();
        this.scene.translate(11.05, 5.25, -0.5);
        this.entrance.display();
        this.scene.popMatrix();
    }

    displayWindows() {
        const windowsPositions = [
            [-2, 4.9, 5.15], [-2, 8.9, 5.15],   // Left Building Front
            [3.05, 6.25, 6.4], [6.05, 6.25, 6.4], [3.05, 10.5, 6.4], [6.05, 10.5, 6.4],// Middle Building Front
            [11.05, 4.9, 5.15], [11.05, 8.9, 5.15], // Right Building Front
        ];

        // Front Windows
        windowsPositions.forEach(([x, y, z]) => {
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.window.display();
            this.scene.popMatrix();
        });

        const backwindowPositions = [
            [-2, 4.9, -6.15], [-2, 8.9, -6.15],   // Left Building Back
            [3.05, 6.25, -7.4], [6.05, 6.25, -7.4], [3.05, 10.5, -7.4], [6.05, 10.5, -7.4],// Middle Building Back
            [11.05, 4.9, -6.15], [11.05, 8.9, -6.15] // Right Building Back
        ];
        // Back Windows
        backwindowPositions.forEach(([x, y, z]) => {
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.scene.rotate(Math.PI, 0, 1, 0);
            this.window.display();
            this.scene.popMatrix();
        });

        const rightwindowPositions = [
            [13.7, 8.9, 2.5], [13.7, 8.9, .5], [13.7, 8.9, -1.5], [13.7, 8.9, -3.5],
            [13.7, 4.9, 2.5], [13.7, 4.9, -.5], [13.7, 4.9, -3.5]
        ];

        // Right Windows
        rightwindowPositions.forEach(([x, y, z]) => {
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.scene.rotate(Math.PI / 2, 0, 1, 0);
            this.window.display();
            this.scene.popMatrix();
        });

        const leftwindowPositions = [
            // [-4.65, 8.9, 2.5], [-4.65, 8.9, .5], [-4.65, 8.9, -1.5], [-4.65, 8.9, -3.5],
            [-4.65, 8.9, 2.5], [-4.65, 8.9, -.5], [-4.65, 8.9, -3.5]
        ];

        // Left Windows
        leftwindowPositions.forEach(([x, y, z]) => {
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.scene.rotate(-Math.PI / 2, 0, 1, 0);
            this.window.display();
            this.scene.popMatrix();
        });
    }
}

