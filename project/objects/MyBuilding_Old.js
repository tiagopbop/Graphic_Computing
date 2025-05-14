import { CGFobject } from "../../lib/CGF.js";
import { MyCube } from "../geometric/MyCube.js";
import { MyWindow } from "./MyWindow.js";

export class MyBuilding_Old extends CGFobject {
    constructor(scene) {
        super(scene);
        this.scene = scene;

        // Common Columns
        this.column = new MyCube(scene, 6.3, 1, 0.3);       // front and back columns
        this.column1 = new MyCube(scene, 6.3, 0.3, 1);      // left and right columns

        // Taller columns
        this.columnTall = new MyCube(scene, 10.3, 1, 0.3);      // front tall column
        this.columnTall2 = new MyCube(scene, 10.3, 0.3, 1);     // right and left tall column

        // Shorter columns
        this.columnShort = new MyCube(scene, 4, 1, 0.3);        // back short column
        this.columnShort2 = new MyCube(scene, 4, 0.3, 1);       // left short column

        this.column3 = new MyCube(scene, 6.3, 2, 0.3);          // wider back column
        this.column4 = new MyCube(scene, 6.3, 0.3, 0.3);       // small right column

        this.separator = new MyCube(scene, 0.3, 3, 0.3);    // front and back separator
        this.separator2 = new MyCube(scene, 0.3, 0.3, 3);   // left and right separator
        this.separator3 = new MyCube(scene, 0.3, 0.3, 4.71);   // wider left separator

        this.base = new MyCube(scene, 0.1, 19, 14);           // wide, flat base

        // Garage and Entrance
        this.garage = new MyCube(scene, 6.3, 13, 9);

        this.entrance = new MyCube(scene, 10.3, 4, 5);

        this.entrance2 = new MyCube(scene, 6.3, 4, 6);

        this.roofTop = new MyCube(scene, 0.1, 5, 7.7);

        // Roof Ledge
        this.roofLedge = new MyCube(scene, 0.5, 12.7, 0.3);    // Ledge Front
        this.roofLedge2 = new MyCube(scene, 0.5, 0.3, 9);      // Ledge Left
        this.roofLedge3 = new MyCube(scene, 0.5, 16.4, 0.3);    // Ledge Back
        this.roofLedge4 = new MyCube(scene, 0.5, 0.3, 5.71);    // Ledge Right

        this.topPanel = new MyCube(scene, 0.1, 17, 9);

        // Windows
        this.window = new MyWindow(scene);
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
        this.scene.translate(0, 6.5, -1.5); // Adjust the position of the top panel
        this.topPanel.display();  // Render the top panel
        this.scene.popMatrix();

        // Main Structure - Applying textures
        this.displayGarage();
        this.displayEntrances();

        // Windows
        this.displayWindows();

    }



    displayColumns() {
        // Column positions and display logic
        const columnPositions = [
            [4, 3.25, 3.15], [0, 3.25, 3.15], [-4, 3.25, 3.15], [-8, 3.25, 3.15],
            [-8, 3.25, -6.15], [-4, 3.25, -6.15], [0, 3.25, -6.15], [8, 3.25, -6.15]
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
            [-8.65, 3.25, 2.5], [-8.65, 3.25, -1.5], [-8.65, 3.25, -5.5],
            [8.65, 3.25, -5.5]
        ];
        column1Positions.forEach(([x, y, z]) => {
            this.scene.pushMatrix();
            this.scene.textureManager.concreteTilesMaterial.apply();
            this.scene.translate(x, y, z);
            this.column1.display();
            this.scene.popMatrix();
        });

        // Different Sized Columns (Wider and Narrower)
        this.displayWiderAndNarrowColumns();

        // Tall and Short Columns
        this.displayTallShortColumns();
    }

    displayWiderAndNarrowColumns() {
        this.scene.pushMatrix();
        this.scene.textureManager.concreteTilesMaterial.apply();
        this.scene.translate(4, 3.25, -6.15);
        this.column3.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.textureManager.concreteTilesMaterial.apply();
        this.scene.translate(8.65, 3.25, -0.15);
        this.column4.display();
        this.scene.popMatrix();
    }

    displayTallShortColumns() {
        const tallColumnPositions = [
            [5, 5.25, 5.15], [8, 5.25, 5.15]
        ];
        tallColumnPositions.forEach(([x, y, z]) => {
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.columnTall.display();
            this.scene.popMatrix();
        });

        const tallColumn2Positions = [
            [8.65, 5.25, 4.5], [8.65, 5.25, 0.5], [4.45, 5.25, 4.5]
        ];
        tallColumn2Positions.forEach(([x, y, z]) => {
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.columnTall2.display();
            this.scene.popMatrix();
        });

        // Short Back Columns
        const shortColumnPositions = [
            [5, 8.4, -0.15], [8, 8.4, -0.15]
        ];
        shortColumnPositions.forEach(([x, y, z]) => {
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.columnShort.display();
            this.scene.popMatrix();
        });

        // Left Short Column
        this.scene.pushMatrix();
        this.scene.translate(4.45, 8.4, 0.5);
        this.columnShort2.display();
        this.scene.popMatrix();
    }

    displaySeparators() {
        const separatorsPositions = [
            [2, 6.25, 3.15], [-2, 6.25, 3.15], [-6, 6.25, 3.15],
            [-6, 6.25, -6.15], [-2, 6.25, -6.15], [2, 6.25, -6.15], [6, 6.25, -6.15]
        ];
        separatorsPositions.forEach(([x, y, z]) => {
            this.scene.pushMatrix();
            this.scene.translate(x, y, z);
            this.separator.display();
            this.scene.popMatrix();
        });

        // Left and Right Separators
        this.scene.pushMatrix();
        this.scene.translate(8.65, 6.25, -2.65);
        this.separator3.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-8.65, 6.25, .5);
        this.separator2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-8.65, 6.25, -3.5);
        this.separator2.display();
        this.scene.popMatrix();
    }

    displayRoof() {
        this.scene.pushMatrix();
        this.scene.textureManager.concreteMaterial.apply();
        this.scene.translate(6.5, 10.45, 1.5);
        this.roofTop.display();
        this.scene.popMatrix();
    }

    displayLedges() {
        // Ledge positions and display
        this.scene.pushMatrix();
        this.scene.textureManager.concreteTilesMaterial.apply();
        this.scene.translate(-1.9, 6.55, 2.85);
        this.roofLedge.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.textureManager.concreteTilesMaterial.apply();
        this.scene.translate(-8.35, 6.55, -1.5);
        this.roofLedge2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.textureManager.concreteTilesMaterial.apply();
        this.scene.translate(0, 6.55, -5.85);
        this.roofLedge3.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.textureManager.concreteTilesMaterial.apply();
        this.scene.translate(8.35, 6.55, -3.15);
        this.roofLedge4.display();
        this.scene.popMatrix();
    }

    displayGarage() {
        this.scene.pushMatrix();
        this.scene.textureManager.sandstoneBrickWallMaterial.apply();
        this.scene.translate(-2, 3.25, -1.5);
        this.garage.display();
        this.scene.popMatrix();
    }

    displayEntrances() {
        // Entrance positions and display logic
        this.scene.pushMatrix();
        this.scene.textureManager.sandstoneBrickWallMaterial.apply();
        this.scene.translate(6.5, 5.25, 2.5);
        this.entrance.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.textureManager.sandstoneBrickWallMaterial.apply();
        this.scene.translate(6.5, 3.25, -3);
        this.entrance2.display();
        this.scene.popMatrix();
    }

    displayWindows() {
        this.scene.pushMatrix();
        this.scene.translate(10.5, 5.25, 2.5);
        // this.scene.textureManager.windowMaterial.apply();
        this.window.display();
        this.scene.popMatrix();
    }
}

