import {CGFobject} from "../../lib/CGF.js";
import {MyCylinder} from "../geometric/MyCylinder.js";
import {MyCube} from "../geometric/MyCube.js";
import {MyTrapezoid} from "../geometric/MyTrapezoid.js";
import {MyTriangle} from "../geometric/MyTriangle.js";

/**
 * MyHeli
 * @constructor
 * @param scene - Reference to MyScene object
 */

/**
 * Represents a helicopter object with interactive controls and display logic for a CGF scene.
 * Handles helicopter physics, animation, and bucket logic for water pickup and fire extinguishing.
 *
 * @extends CGFobject
 *
 * @property {Object} position - The current position of the helicopter { x, y, z }.
 * @property {Object} velocity - The current velocity of the helicopter { x, z }.
 * @property {Object} acceleration - The current acceleration of the helicopter { x, z }.
 * @property {number} orientation - The orientation (yaw) of the helicopter in radians.
 * @property {number} targetY - The target vertical position (altitude) for the helicopter.
 * @property {number} verticalSpeed - The vertical speed (units/second) for altitude changes.
 * @property {number} cruiseAltitude - The default altitude when cruising.
 * @property {boolean} in_air - Whether the helicopter is airborne.
 * @property {number} maxSpeed - The maximum horizontal speed.
 * @property {number} drag - The drag factor applied to velocity.
 * @property {number} leanAngle - The current lean angle for forward/backward tilt.
 * @property {number} turnLeanAngle - The current lean angle for turning.
 * @property {number} helixRotationSpeed - The rotation speed of the main rotor blades.
 * @property {number} helixRotationAngle - The current rotation angle of the main rotor blades.
 * @property {number} bladeSpeedThreshold - The minimum blade speed required for takeoff.
 * @property {boolean} revvingUp - Whether the blades are currently revving up for takeoff.
 * @property {string} bucketState - The current state of the bucket ("empty", "descending", "filled", "open").
 * @property {Object} bucketPosition - The relative position of the bucket { x, y, z }.
 * @property {boolean} bucketHasWater - Whether the bucket currently contains water.
 *
 * @constructor
 * @param {CGFscene} scene - The CGF scene to which this helicopter belongs.
 */
export class MyHeli extends CGFobject {
    constructor(scene) {
        super(scene);

        this.scene = scene;

        // <editor-fold desc="Helicopter Parts Constructor">
        // Wings
        this.trapezoid = new MyTrapezoid(scene, 1, 0.5, 1, 0.25);
        this.trapezoidBase = new MyCube(scene, 0.5, 1, 0.25);
        this.wingSupport = new MyCube(scene, 0.25, 0.5, 2.5);

        // Helix
        this.helixSupport = new MyCylinder(scene, 64, 64);
        this.helixSupportBase = new MyCylinder(scene, 64, 64);
        this.blade = new MyTrapezoid(scene, 5, 4.5, 0.5, 0.25);
        this.bladeSupport = new MyCube(scene, 0.25, 0.5, 0.25);

        // Tail Flap
        this.tailFlap = new MyTriangle(scene, 1, 1, 0.5);

        // Bottom Supports
        this.bottomSupport = new MyCube(scene, 0.5, 0.5, 8);
        this.bottomSupport2 = new MyCube(scene, 0.5, 0.5, 1);

        this.bottomConnector = new MyCube(scene, 1.25, 0.35, 0.35);
        this.bottomConnector2 = new MyCube(scene, 0.5, 0.35, 0.35);

        // Tail
        this.tailBase = new MyTrapezoid(scene, 1.5, 1, 8, 1.5);
        this.tailTop = new MyTriangle(scene, 0.5, 5.5, 1.5);

        // Body
        this.bodyTailConnect = new MyTriangle(scene, 1.5, 2, 1.5);
        this.bodySupport = new MyCube(scene, 0.35, 6, 4);
        this.helixBodyBase = new MyTrapezoid(scene, 4, 3.5, 1.5, 3);
        this.helixBodyWrap = new MyTrapezoid(scene, 4.5, 4, 1, 3.5);

        this.mainBodyUp = new MyTrapezoid(scene, 6, 5, 3, 4.7);
        this.mainBodyDown = new MyTrapezoid(scene, 7.6, 6.6, 3, 4.7);

        this.frontPartDown = new MyTrapezoid(scene, 2, 1.5, 1.5, 4.7);
        this.frontPartUp = new MyTriangle(scene, 1.5, 2, 4.7);

        // this.backPartUp = new MyTriangle(scene, .85, 2, 3);
        // this.backPartUp = new MyTrapezoid(scene, 3, 2.15, 3, 3.5);
        this.backPartUp2 = new MyTrapezoid(scene, 3, 2.15, 3, 3);
        this.backPartDown = new MyTrapezoid(scene, 3, 2.15, 3, 1.5);

        this.windshield = new MyTrapezoid(scene, 2.3, 0.8, 2.8, 4.3);
        this.windshieldDiv = new MyCube(scene, 0.2, 1, 0.3);
        this.windshieldDiv2 = new MyCube(scene, 0.2, 3.4, 0.3);

        this.bucketString = new MyCube(scene, 5, 0.3, 0.3);
        this.bucket = new MyCylinder(scene, 64, 64);

        // </editor-fold>

        // Motion state
        this.position = {x: 0, y: 0, z: 0};
        this.velocity = {x: 0, z: 0};
        this.acceleration = {x: 0, z: 0};
        this.orientation = 0;

        // Vertical control
        this.targetY = 0;
        this.verticalSpeed = 5; // units/second
        this.cruiseAltitude = 30;
        this.in_air = false;

        this.maxSpeed = 10;
        this.drag = 0.92;

        // Lean angle
        this.leanAngle = 0;
        this.turnLeanAngle = 0;

        // Helix Rotation
        this.helixRotationSpeed = 0;
        this.helixRotationAngle = 0;
        this.bladeSpeedThreshold = 10; // Speed threshold to start flying
        this.revvingUp = false; // Whether the helicopter blades are revving up

        // Bucket Logic
        this.bucketState = "empty";
        this.bucketPosition = {x: 0, y: -5, z: 0}; // Relative position of the bucket
        this.bucketHasWater = false; // Whether the bucket has water or not

        this.initBuffers();
    }

    /**
     * Displays the helicopter model.
     */
    display() {
        this.scene.pushMatrix();

        this.scene.rotate(this.leanAngle, 1, 0, 0);
        this.scene.rotate(this.turnLeanAngle, 0, 0, 1);

        this.displayHeli();
        this.scene.popMatrix();
    }

    // Helicopter Control Methods (functions)

    /**
     * Sets the helicopters status to take off.
     */
    takeOff() {
        if (!this.in_air && this.helixRotationSpeed < this.bladeSpeedThreshold) {
            this.revvingUp = true; // Start revving up the blades
        }
    }

    /**
     * Sets the helicopters status to land.
     */
    land() {
        if (this.in_air) {
            if (this.isOverLake()) {
                this.bucketState = "descending"; // Start filling the bucket
                this.targetY = this.position.y - 5; // Lower the helicopter to fill the bucket
            } else {
                this.in_air = false;
                this.targetY = 0;
                this.velocity = {x: 0, z: 0};
            }
        }
    }

    /**
     * Determines if the helicopter is in the process of taking off.
     * The helicopter is considered to be taking off if its target altitude is set to the cruise altitude
     * but it has not yet reached said altitude.
     *
     * @returns {boolean} - Returns true if the helicopter is taking off, false otherwise.
     */
    isTakingOff() {
        return (
            this.targetY === this.cruiseAltitude &&
            this.position.y != this.cruiseAltitude
        );
    }

    /**
     * Determines if the helicopter is in the process of landing.
     * The helicopter is considered to be landing if its target altitude is set to zero
     * but it has not yet reached the ground.
     *
     * @returns {boolean} - Returns true if the helicopter is landing, false otherwise.
     */
    isLanding() {
        return this.targetY === 0 && this.position.y != 0;
    }

    // <editor-fold desc="Bucket Logic Methods">
    /**
     * Checks if the helicopter is currently positioned over a lake.
     * Determines the helicopter's position relative to predefined lake boundaries.
     *
     * @returns {boolean} - Returns true if the helicopter is over the lake, false otherwise.
     */
    isOverLake() {
        const lakeBounds = {xMin: -70, xMax: -50, zMin: -20, zMax: 0};
        return (
            this.position.x >= lakeBounds.xMin &&
            this.position.x <= lakeBounds.xMax &&
            this.position.z >= lakeBounds.zMin &&
            this.position.z <= lakeBounds.zMax
        );
    }

    /**
     * Checks if the helicopter is currently positioned over a fire.
     * Determines the helicopter's position relative to predefined fire boundaries.
     *
     * @returns {boolean} - Returns true if the helicopter is over the fire, false otherwise.
     */
    isOverFire() {
        const fireBounds = {xMin: 220, xMax: 240, zMin: -60, zMax: -40};
        return (
            this.position.x >= fireBounds.xMin &&
            this.position.x <= fireBounds.xMax &&
            this.position.z >= fireBounds.zMin &&
            this.position.z <= fireBounds.zMax
        );
    }

    /**
     * Handles the logic for picking up water with the helicopter's bucket.
     * Changes the bucket state to "filled" and sets the bucketHasWater flag to true
     * if the helicopter is in the correct position and state to pick up water.
     */
    pickUpWater() {
        if (this.bucketState === "descending" && this.position.y <= this.targetY) {
            this.bucketState = "filled"; // Bucket is now full
            this.bucketHasWater = true; // Indicate that the bucket has water
            this.targetY = this.cruiseAltitude; // Return to cruise altitude
        }
    }

    /**
     * Handles the logic for dropping water from the helicopter's bucket.
     * Changes the bucket state to "open" and sets the bucketHasWater flag to false
     * if the helicopter is in the correct position and state to drop water over a fire.
     */
    dropWater() {
        if (this.bucketState === "filled" && this.isOverFire()) {
            this.bucketState = "open"; // Bucket is now empty
            this.bucketHasWater = false; // Indicate that the bucket is empty
            // Missing Logic to extinguish the fire
        }
    }

    // </editor-fold>
    /**
     * Resets the helicopter's state to its initial conditions.
     * Sets the position, velocity, orientation, and other related properties to their default values.
     */
    reset() {
        this.position = {x: 0, y: 0, z: 0};
        this.velocity = {x: 0, z: 0};
        this.orientation = 0;
        this.in_air = false;
        this.targetY = 0;
    }

    /**
     * Increases the helicopter's acceleration in the direction it is currently facing.
     * Adjusts the helicopter's lean angle based on the acceleration.
     *
     * @param {number} v - The amount to increase the acceleration by. Positive values increase forward acceleration.
     */
    accelerate(v) {
        if (!this.in_air) return;

        const dirX = Math.sin(this.orientation);
        const dirZ = Math.cos(this.orientation);
        this.acceleration.x += v * dirX;
        this.acceleration.z += v * dirZ;

        // Leaning effect
        const maxLeanAngle = Math.PI / 36;
        const leanAdjustment = v * 0.005; // Adjust the lean based on acceleration
        this.leanAngle = Math.max(
            -maxLeanAngle,
            Math.min(maxLeanAngle, this.leanAngle + leanAdjustment)
        );
    }

    /**
     * Adjusts the helicopter's orientation and applies a leaning effect based on the turn value.
     * Updates the velocity direction according to the new orientation.
     *
     * @param {number} v - The turn value, where positive values turn the helicopter to the right and negative values turn it to the left.
     */
    turn(v) {
        if (!this.in_air) return;

        this.orientation -= v;

        const speed = Math.hypot(this.velocity.x, this.velocity.z);
        this.velocity.x = speed * Math.sin(this.orientation);
        this.velocity.z = speed * Math.cos(this.orientation);

        // Leaning effect on turn
        const maxTurnLeanAngle = Math.PI / 36;
        const forwardLean = -0.005;

        if (v > 0) {
            this.turnLeanAngle = Math.max(
                -maxTurnLeanAngle,
                Math.min(maxTurnLeanAngle, this.turnLeanAngle + v * 0.2 + forwardLean)
            );
        } else {
            this.turnLeanAngle = Math.max(
                -maxTurnLeanAngle,
                Math.min(maxTurnLeanAngle, this.turnLeanAngle - v * 0.2 + forwardLean)
            );
        }
    }

    /**
     * Updates the helicopter's state based on the elapsed time and speed factor.
     * Handles the physics of motion, including acceleration, velocity, and position updates.
     * Manages the helicopter's vertical movement and bucket logic.
     *
     * @param {number} deltaTime - The time elapsed since the last update, in milliseconds.
     * @param {number} [speedFactor=1.0] - A multiplier for the speed of the helicopter, allowing for speed adjustments.
     */
    update(deltaTime, speedFactor = 1.0) {
        const delta = deltaTime / 1000;

        if (this.revvingUp) {
            this.helixRotationSpeed = Math.min(
                this.bladeSpeedThreshold,
                this.helixRotationSpeed + 1 * delta
            );

            if (this.helixRotationSpeed >= this.bladeSpeedThreshold) {
                this.in_air = true;
                this.targetY = this.cruiseAltitude;
                this.revvingUp = false;
            }
        }

        if (this.in_air) {
            this.velocity.x += this.acceleration.x * delta * speedFactor;
            this.velocity.z += this.acceleration.z * delta * speedFactor;

            this.velocity.x *= this.drag;
            this.velocity.z *= this.drag;

            const speed = Math.hypot(this.velocity.x, this.velocity.z);
            if (speed > this.maxSpeed) {
                const scale = this.maxSpeed / speed;
                this.velocity.x *= scale;
                this.velocity.z *= scale;
            }

            this.position.x += this.velocity.x * delta;
            this.position.z += this.velocity.z * delta;
        } else if (this.isLanding()) {
            this.helixRotationSpeed = Math.max(
                0,
                this.helixRotationSpeed - 0.5 * delta
            ); // Dampen rotation speed when not in air
        } else if (!this.revvingUp) {
            this.helixRotationSpeed = 0;
        }

        // this.acceleration = {x: 0, z: 0};

        const dy = this.targetY - this.position.y;
        if (Math.abs(dy) > 0.01) {
            const dir = Math.sign(dy);
            const step = this.verticalSpeed * delta;
            this.position.y += dir * Math.min(Math.abs(dy), step);
        } else {
            this.position.y = this.targetY;

            // Handle Bucket State
            if (
                this.bucketState === "descending" &&
                this.position.y <= this.targetY
            ) {
                this.pickUpWater(); // Pick up water if descending
            }
        }

        this.acceleration = {x: 0, z: 0};
        this.helixRotationAngle += this.helixRotationSpeed * delta;
    }

    // Helicopter Display Methods (functions)

    /**
     * Displays the helicopter's main body.
     */
    displayHeli() {
        this.scene.pushMatrix();
        this.scene.translate(this.position.x, this.position.y, this.position.z);
        this.scene.rotate(this.orientation, 0, 1, 0);

        this.scene.scale(1, 1, 1);
        this.scene.rotate(-Math.PI / 2, 0, 1, 0); // Rotate to align with the scene's coordinate system

        // Display the helicopter parts
        this.heliConstruct();

        this.scene.popMatrix();
    }

    heliConstruct() {
        // Display The Top Helix
        this.scene.pushMatrix();
        this.scene.translate(9.5, 2, 0.25);
        this.scene.scale(0.75, 0.75, 0.75);
        this.displayHelix(0.65);
        this.scene.popMatrix();

        // Display The Bottom Support
        this.scene.pushMatrix();
        this.scene.translate(12, -6.65, 2.4);
        this.scene.scale(0.75, 0.75, 0.75);
        this.scene.rotate(Math.PI / 2, 0, 1, 0);
        this.displayBottomSupport(1);
        this.scene.translate(5.75, 0, 0);
        this.displayBottomSupport(-1);
        this.scene.popMatrix();

        // Display The Main Body
        this.displayBody();

        // Display The Tail
        this.displayTail();

        // Display The Back Helix and Blades
        this.displayBackHelix();

        // Display The Wings
        this.scene.pushMatrix();
        this.scene.translate(4.5, 0.5, 3);
        this.scene.rotate(-Math.PI / 2, 0, 0, 0);
        this.displayWings(-1);
        this.scene.translate(0, 0, -5.5);
        this.scene.rotate(Math.PI / 2, 0, 0, 0);
        this.displayWings(1);
        this.scene.popMatrix();

        // Display The Bucket
        // this.displayBucket();
    }

    // <editor-fold desc="Helicopter Parts Display Methods">
    displayHelix(bladeScaleFactor = 1) {
        // Support
        this.scene.pushMatrix();
        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.55, 0.55, 2);
        this.scene.textureManager.brushedMetalMaterial.apply();
        this.helixSupport.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(1, 1, 0.5);
        this.scene.textureManager.brushedMetalMaterial.apply();
        this.helixSupportBase.display();
        this.scene.popMatrix();

        // Blades Support
        this.scene.pushMatrix();
        this.scene.translate(0, 1.75, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(1.1, 1.1, 0.5);
        this.scene.textureManager.brushedMetalMaterial.apply();
        this.helixSupportBase.display();
        this.scene.popMatrix();

        // Blades
        this.scene.pushMatrix();
        this.scene.translate(-1.25, 2, 0);
        this.scene.rotate(this.helixRotationAngle, 0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(bladeScaleFactor * 4, 2, 1);
        this.scene.textureManager.brushedMetalMaterial.apply();
        this.displayBlade();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 2, 1.25);
        this.scene.rotate(this.helixRotationAngle, 0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.scene.scale(bladeScaleFactor * 4, 2, 1);
        this.scene.textureManager.brushedMetalMaterial.apply();
        this.displayBlade();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.25, 2, 0);
        this.scene.rotate(this.helixRotationAngle, 0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.scale(bladeScaleFactor * 4, 2, 1);
        this.scene.textureManager.brushedMetalMaterial.apply();
        this.displayBlade();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 2, -1.25);
        this.scene.rotate(this.helixRotationAngle, 0, 1, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.rotate(-Math.PI / 2, 0, 0, 1);
        this.scene.scale(bladeScaleFactor * 4, 2, 1);
        this.scene.textureManager.brushedMetalMaterial.apply();
        this.displayBlade();
        this.scene.popMatrix();
    }

    displayBlade() {
        this.scene.pushMatrix();
        this.scene.translate(0, -0.125, 0);
        this.bladeSupport.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.blade.display();
        this.scene.popMatrix();
    }

    displayBottomSupport(leftSupport) {
        // Left Support is either 1 or -1 that indicates the position of the support
        // Main Support
        this.scene.pushMatrix();
        this.scene.textureManager.brushedMetalMaterial.apply();
        this.bottomSupport.display();
        this.scene.translate(0, 0.28, 4.2);
        this.scene.rotate(-Math.PI / 4, 1, 0, 0);
        this.bottomSupport2.display();
        this.scene.popMatrix();

        // Supports Connections
        this.scene.pushMatrix();
        this.scene.translate(leftSupport * 0.05, 0.5, 2);
        this.bottomConnector.display();
        this.scene.translate(leftSupport * 0.1, 0.75, 0);
        this.scene.rotate((leftSupport * -Math.PI) / 5.5, 0, 0, 1);
        this.bottomConnector2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(leftSupport * 0.05, 0.5, -2);
        this.bottomConnector.display();
        this.scene.translate(leftSupport * 0.1, 0.75, 0);
        this.scene.rotate((leftSupport * -Math.PI) / 5.5, 0, 0, 1);
        this.scene.textureManager.brushedMetalMaterial.apply();
        this.bottomConnector2.display();
        this.scene.popMatrix();
    }

    displayBody() {
        // Body Connecting With Tail
        this.scene.gl.enable(this.scene.gl.POLYGON_OFFSET_FILL); // Avoid twitching with Intersection Polygons
        this.scene.gl.polygonOffset(2.0, 2.0); // Offset factor and units

        this.scene.textureManager.brushedGoldMaterial.apply();

        this.scene.pushMatrix();
        this.scene.translate(6.85, 1.25, 0.25);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(1, 1, 2);
        this.bodyTailConnect.display();
        this.scene.popMatrix();

        this.scene.textureManager.brushedGoldMaterial.apply();

        this.scene.pushMatrix();
        this.scene.translate(11.6, 1.25, 0.25);
        this.scene.rotate(Math.PI, 0, 0, 0);
        this.helixBodyBase.display();
        this.scene.popMatrix();

        // Top Part Wrap
        this.scene.pushMatrix();
        this.scene.translate(12.1, 1, 0.25);
        this.scene.rotate(Math.PI, 0, 0, 0);
        this.helixBodyWrap.display();
        this.scene.popMatrix();

        this.scene.gl.disable(this.scene.gl.POLYGON_OFFSET_FILL);

        // Main Body Up
        // this.scene.gl.enable(this.scene.gl.POLYGON_OFFSET_FILL); // Avoid twitching with Intersection Polygons
        // this.scene.gl.polygonOffset(2.0, 2.0); // Offset factor and units

        this.scene.textureManager.paintedRedMetalMaterial.apply();

        this.scene.pushMatrix();
        this.scene.translate(13.35, -1, 0.25);
        this.scene.rotate(Math.PI, 0, 0, 0);
        this.mainBodyUp.display();
        this.scene.popMatrix();

        // Main Body Down

        this.scene.pushMatrix();
        this.scene.translate(6.3, -1, 0.25);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.backPartUp2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(8.35, -4, 0.25);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.textureManager.brushedGoldMaterial.apply();
        this.mainBodyDown.display();
        this.scene.popMatrix();

        // Front Body
        this.scene.pushMatrix();
        this.scene.translate(17.1, -4.75, 0.25);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.textureManager.brushedGoldMaterial.apply();
        this.frontPartDown.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(16.35, -3.25, 0.25);
        this.frontPartUp.display();
        this.scene.popMatrix();

        // Bottom Base (Connected to the bottom support)
        this.scene.pushMatrix();
        this.scene.translate(12, -5.65, 0.25);
        this.bodySupport.display();
        this.scene.popMatrix();

        // WindShield
        this.scene.textureManager.polishedAluminumMaterial.apply();
        this.scene.pushMatrix();
        this.scene.translate(14.5, -1.1, 0.25);
        this.scene.rotate(Math.PI, 0, 0, 0);
        this.windshield.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(13.25, 0.35, 0.25);
        this.scene.textureManager.paintedRedMetalMaterial.apply();
        this.windshieldDiv.display();
        this.scene.translate(1.27, -1.45, 0);
        this.scene.rotate(-Math.PI / 3, 0, 0, 1);
        this.windshieldDiv2.display();
        this.scene.popMatrix();

        // this.scene.gl.disable(this.scene.gl.POLYGON_OFFSET_FILL);
    }

    displayTail() {
        // Tail
        this.scene.gl.enable(this.scene.gl.POLYGON_OFFSET_FILL); // Avoid twitching with Intersection Polygons
        this.scene.gl.polygonOffset(2.0, 2.0); // Offset factor and units
        this.scene.pushMatrix();
        this.scene.translate(2.5, -0.75, 0.25);
        this.scene.rotate(-Math.PI / 2, 0, 0, 1);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.textureManager.paintedRedMetalMaterial.apply();
        this.tailBase.display();
        this.scene.popMatrix();
        this.scene.gl.disable(this.scene.gl.POLYGON_OFFSET_FILL);

        // Upper Tail
        this.scene.pushMatrix();
        this.scene.translate(3.75, 0.75, 0.25);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.textureManager.brushedGoldMaterial.apply();
        this.tailTop.display();
        this.scene.popMatrix();
    }

    displayBackHelix() {
        // Back Helix
        this.scene.pushMatrix();
        this.scene.translate(0, 1.5, 0.25);
        this.scene.scale(2, 2, 2);
        this.displayTailFlap();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -1.5, 0.25);
        this.scene.scale(2, 2, 2);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.displayTailFlap();
        this.scene.popMatrix();

        // Back Blades
        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(0.25, 0.25, 0.25);
        this.scene.rotate(this.helixRotationAngle, 0, 1, 0);
        this.displayHelix(0.35);
        this.scene.popMatrix();
    }

    displayTailFlap() {
        this.scene.pushMatrix();
        this.scene.textureManager.brushedGoldMaterial.apply();
        this.tailFlap.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI, 1, 0, 0);
        this.scene.rotate(Math.PI / 2, 0, 0, 1);
        this.scene.translate(0, 1, 0);
        this.scene.textureManager.brushedGoldMaterial.apply();
        this.tailFlap.display();
        this.scene.popMatrix();
    }

    displayWings(zPosition) {
        // zPosition is either 1 or -1 that indicates the position of the wing support

        // Wings
        this.scene.pushMatrix();
        this.scene.translate(0.25, 0, 0);
        this.scene.textureManager.brushedGoldMaterial.apply();
        this.trapezoid.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -0.75, 0);
        this.trapezoidBase.display();
        this.scene.popMatrix();

        // Wings Support
        this.scene.pushMatrix();
        this.scene.textureManager.paintedRedMetalMaterial.apply();
        this.scene.translate(0, -0.5, zPosition * 1.25);
        this.wingSupport.display();
        this.scene.popMatrix();
    }

    // displayBucket(){
    //     // Bucket
    //     this.scene.pushMatrix();
    //     this.scene.translate(0, -1.5, 0);
    //     this.scene.rotate(Math.PI/2, 1, 0, 0);
    //     this.scene.scale(2, 2, 3);
    //     this.scene.textureManager.paintedRedMetalMaterial.apply();
    //     this.bucket.display();
    //     this.scene.popMatrix();
    //
    //
    //     // Inner Bucket (Hollow Effect)
    //     this.scene.pushMatrix();
    //     this.scene.translate(0, -1.5, 0);
    //     this.scene.rotate(Math.PI / 2, 1, 0, 0);
    //     this.scene.scale(1.8, 1.8, 2.8); // Slightly smaller to create the hollow effect
    //     this.scene.textureManager.metalMaterialOG2.apply(); // Use a darker or contrasting material
    //     this.bucket.display();
    //     this.scene.popMatrix();
    //
    //
    //     // Bucket Support
    //     this.scene.pushMatrix();
    //     this.scene.textureManager.metalMaterialOG.apply();
    //     this.bucketString.display();
    //     this.scene.popMatrix();
    // }

    displayBucket() {
        this.scene.pushMatrix();
        this.scene.translate(
            this.bucketPosition.x,
            this.bucketPosition.y,
            this.bucketPosition.z
        );

        if (this.bucketState === "open") {
            this.scene.scale(1, 1, 0.5); // Simulate the bucket opening
        }

        this.scene.textureManager.paintedRedMetalMaterial.apply();
        this.bucket.display();
        this.scene.popMatrix();

        if (this.bucketHasWater) {
            // Display water inside the bucket
            this.scene.pushMatrix();
            this.scene.translate(
                this.bucketPosition.x,
                this.bucketPosition.y - 0.5,
                this.bucketPosition.z
            );
            this.scene.scale(0.8, 0.8, 0.8);
            this.scene.textureManager.waterMaterial.apply();
            this.bucket.display();
            this.scene.popMatrix();
        }
    }

    // </editor-fold>
}
