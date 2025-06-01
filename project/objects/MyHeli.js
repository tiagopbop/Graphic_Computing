import { CGFobject } from '../../lib/CGF.js';
import { MyCylinder } from '../geometric/MyCylinder.js';
import { MyCube } from '../geometric/MyCube.js';
import { MyTrapezoid } from '../geometric/MyTrapezoid.js';
import { MyTriangle } from '../geometric/MyTriangle.js';
import { MySphere } from "../geometric/MySphere.js"

/**
 * MyHeli
 * @constructor
 * @param scene - Reference to MyScene object
 */

export class MyHeli extends CGFobject {
    constructor(scene) {
        super(scene);

        this.scene = scene;

        // <editor-fold desc="Helicopter Parts Constructor">
        // Wings
        this.trapezoid = new MyTrapezoid(scene, 1, 0.5, 1, .25);
        this.trapezoidBase = new MyCube(scene, .5, 1, .25);
        this.wingSupport = new MyCube(scene, .25, .5, 2.5);

        // Helix
        this.helixSupport = new MyCylinder(scene, 64, 64);
        this.helixSupportBase = new MyCylinder(scene, 64, 64);
        this.blade = new MyTrapezoid(scene, 5, 4.5, .5, .25);
        this.bladeSupport = new MyCube(scene, .25, .5, .25);

        // Tail Flap
        this.tailFlap = new MyTriangle(scene, 1, 1, .5);

        // Bottom Supports
        this.bottomSupport = new MyCube(scene, .5, .5, 8);
        this.bottomSupport2 = new MyCube(scene, .5, .5, 1);

        this.bottomConnector = new MyCube(scene, 1.25, .35, .35);
        this.bottomConnector2 = new MyCube(scene, .5, .35, .35);

        // Tail
        this.tailBase = new MyTrapezoid(scene, 1.5, 1, 8, 1.5);
        this.tailTop = new MyTriangle(scene, .5, 5.5, 1.5);

        // Body
        this.bodyTailConnect = new MyTriangle(scene, 1.5, 2, 1.5);
        this.bodySupport = new MyCube(scene, .35, 6, 4);
        this.helixBodyBase = new MyTrapezoid(scene, 4, 3.5, 1.5, 3);
        this.helixBodyWrap = new MyTrapezoid(scene, 4.5, 4, 1, 3.5);

        this.mainBodyUp = new MyTrapezoid(scene, 6, 5, 3, 4.7);
        this.mainBodyDown = new MyTrapezoid(scene, 7.6, 6.6, 3, 4.7);

        this.frontPartDown = new MyTrapezoid(scene, 2, 1.5, 1.5, 4.7);
        this.frontPartUp = new MyTriangle(scene, 1.5, 2, 4.7);

        // this.backPartUp = new MyTriangle(scene, .85, 2, 3);
        // this.backPartUp = new MyTrapezoid(scene, 3, 2.15, 3, 3.5);
        this.backPartUp2 = new MyTrapezoid(scene, 3, 2.15, 3, 3)
        this.backPartDown = new MyTrapezoid(scene, 3, 2.15, 3, 1.5)


        this.windshield = new MyTrapezoid(scene, 2.3, .8, 2.8, 4.3);
        this.windshieldDiv = new MyCube(scene, .2, 1, .3);
        this.windshieldDiv2 = new MyCube(scene, .2, 3.4, .3);

        this.bucketString = new MyCube(scene, 5, .3, .3);
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

        this.maxSpeed = 30;
        this.drag = 0.92;

        // Lean angle
        this.leanAngle = 0;
        this.turnLeanAngle = 0;

        // Helix Rotation
        this.helixRotationSpeed = 0;
        this.tailRotorSpeed = 0
        this.helixRotationAngle = 0;
        this.tailRotorAngle = 0; 
        this.bladeSpeedThreshold = 10; // Speed threshold to start flying
        this.revvingUp = false; // Whether the helicopter blades are revving up


        this.bucketState = 'stored'; // 'stored', 'deploying', 'hanging', 'retracting', 'filled'
        this.bucketCurrentLength = 0; // Current string length (starts at 0)
        this.bucketMaxLength = 4; // Maximum string length
        this.bucketHasWater = false;
        this.bucketSpeed = 3; 
        this.waitingForBucketRetraction = false; 

        this.waterSphere = new MySphere(scene, 10, 10,false,2); 
        this.waterDrops = []; 
        this.isDropping = false; 
        this.dropSpawnTimer = 0; 
        this.dropsCreated = 0; 
        this.maxDrops = 15; 
        this.dropSpawnRate = 0.1; 
        this.waterHitFire = false; 

        this.bucketCap = new MyCylinder(scene, 64, 64); 

        this.returningToHelipad = false;
        this.targetHelipadX = -5; 
        this.targetHelipadZ = 13.6; 

        this.initBuffers();
    }

    display() {
        this.scene.pushMatrix();
        
        // Apply position and orientation first
        this.scene.translate(this.position.x, this.position.y, this.position.z);
        this.scene.rotate(this.orientation, 0, 1, 0);
        
        // Apply tilt rotations
        this.scene.rotate(this.leanAngle, 1, 0, 0);        // Forward/backward tilt
        this.scene.rotate(this.turnLeanAngle, 0, 0, 1);    // Left/right tilt 
        
        // Scale and orient the helicopter model
        this.scene.scale(1, 1, 1);
        this.scene.rotate(-Math.PI/2, 0, 1, 0); 

        // Display the helicopter parts
        this.heliConstruct();
        this.scene.popMatrix();
    }

    // Helicopter Control Methods (functions)
    takeOff() {
        if(!this.in_air && this.helixRotationSpeed < this.bladeSpeedThreshold) {
            this.revvingUp = true; 
        }

    }

    land() {
        if (!this.in_air) return; 
    
        if (this.isOverLake()) {
            // Over lake: descend to fill bucket
            this.targetY = -13; 
            this.bucketState = 'descending'; 
        } else if (this.isOverHelipad()) {
            // Over helipad: land normally
            this.in_air = false;
            this.targetY = 0;
            this.velocity = {x: 0, z: 0};
        } else {
            // Not over helipad or lake: return to helipad first
            this.returnToHelipad();
        }
    }
    
    isOverHelipad() {
        
        const startingArea = {
            centerX: 0,
            centerZ: 0,
            radius: 10 
        };
        
        const landingArea = {
            centerX: -5,
            centerZ: 13.6,
            radius: 8 
        };
        
        const distanceFromStart = Math.hypot(
            this.position.x - startingArea.centerX,
            this.position.z - startingArea.centerZ
        );
        
        const distanceFromLanding = Math.hypot(
            this.position.x - landingArea.centerX,
            this.position.z - landingArea.centerZ
        );
        
        const isOverStart = distanceFromStart <= startingArea.radius;
        const isOverLanding = distanceFromLanding <= landingArea.radius;
        const isOver = isOverStart || isOverLanding;
                
        return isOver;
    }
    returnToHelipad() {
        this.targetHelipadX = 8; 
        this.targetHelipadZ = 14.6; 
        this.returningToHelipad = true;
        
        this.targetY = Math.max(20, this.position.y);
    }
    


    isTakingOff() {
        return this.targetY === this.cruiseAltitude && this.position.y != this.cruiseAltitude;
    }

    isLanding() {
        return this.targetY === 0 && this.position.y != 0;
    }

    isOverLake() {
        const lakeCenter = {x: -130, z: 160};
        const lakeRadius = 100; 
        
        const distance = Math.hypot(
            this.position.x - lakeCenter.x,
            this.position.z - lakeCenter.z
        );
        
        const isOverLake = distance <= lakeRadius;
                
        return isOverLake;
    }


    isOverFire() {
        
        const fireCenter = {x: 225, z: -50}; 
        const fireWidth = 310;
        const fireLength = 700;
        
        const fireBounds = {
            xMin: fireCenter.x - fireWidth/2,  
            xMax: fireCenter.x + fireWidth/2,  
            zMin: fireCenter.z - fireLength/2, 
            zMax: fireCenter.z + fireLength/2  
        };
                
        const isOver = (
            this.position.x >= fireBounds.xMin &&
            this.position.x <= fireBounds.xMax &&
            this.position.z >= fireBounds.zMin &&
            this.position.z <= fireBounds.zMax
        );
        
        return isOver;
    }
    checkFireExtinguishing() {
        if (this.waterHitFire) {
            this.waterHitFire = false; 
            return true; 
        }
        return false;
    }


    reset() {
        this.position = {x: 0, y: 0, z: 0};
        this.velocity = {x: 0, z: 0};
        this.orientation = 0;
        this.in_air = false;
        this.targetY = 0;
    }

    accelerate(v) {
        if (!this.in_air) return;
    
        const tiltInfluence = this.turnLeanAngle * 0.3;
        
        this.orientation -= tiltInfluence * v * 0.02;
    
        const dirX = Math.sin(this.orientation);
        const dirZ = Math.cos(this.orientation);
        this.acceleration.x += v * dirX;
        this.acceleration.z += v * dirZ;
    
        const maxLeanAngle = Math.PI / 36;
        const leanAdjustment = v * 0.005;
        this.leanAngle = Math.max(-maxLeanAngle, Math.min(maxLeanAngle, this.leanAngle + leanAdjustment));
    }

    turn(v) {
        if (!this.in_air) return;
    
        const currentSpeed = Math.hypot(this.velocity.x, this.velocity.z);
        const isMoving = currentSpeed > 0.1;
    
        if (isMoving) {
            const maxTurnLeanAngle = Math.PI / 20;
            const tiltAmount = v * 0.5;
    
            this.turnLeanAngle += tiltAmount;
            this.turnLeanAngle = Math.max(-maxTurnLeanAngle, Math.min(maxTurnLeanAngle, this.turnLeanAngle));
        } else {
            this.orientation -= v;
        }
    }
    update(deltaTime, speedFactor = 1.0) {
        const delta = deltaTime / 1000;
    
        if (this.revvingUp){
            this.helixRotationSpeed = Math.min(this.bladeSpeedThreshold, this.helixRotationSpeed + 1 * delta);
    
            if(this.helixRotationSpeed >= this.bladeSpeedThreshold){
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
    
        } else if (this.isLanding()){
            this.helixRotationSpeed = Math.max(0, this.helixRotationSpeed - 0.5 * delta);
        } else if (!this.revvingUp){
            this.helixRotationSpeed = 0;
        }
    
        const dy = this.targetY - this.position.y;
        if (Math.abs(dy) > 0.01) {
            const dir = Math.sign(dy);
            const step = this.verticalSpeed * delta;
            this.position.y += dir * Math.min(Math.abs(dy), step);
        } else {
            this.position.y = this.targetY;
    
            if (this.bucketState === 'descending' && this.position.y <= 8) {
                this.fillBucket(); // Fill bucket when low over lake
            }
        }
    

    if (this.returningToHelipad) {
        const deltaX = this.targetHelipadX - this.position.x;
        const deltaZ = this.targetHelipadZ - this.position.z;
        const distance = Math.hypot(deltaX, deltaZ);
        
        //retract bucket when near helipad
        if (distance < 15 && (this.bucketState === 'hanging' || this.bucketState === 'filled')) {
            if (this.bucketState !== 'retracting') {
                this.retractBucket();
            }
        }
        
        if (distance > 2) {
            const desiredOrientation = Math.atan2(deltaX, deltaZ);
            
            let orientationDiff = desiredOrientation - this.orientation;
            
            while (orientationDiff > Math.PI) orientationDiff -= 2 * Math.PI;
            while (orientationDiff < -Math.PI) orientationDiff += 2 * Math.PI;
            
            const rotationSpeed = 2.0;
            const maxRotationStep = rotationSpeed * delta;
            
            if (Math.abs(orientationDiff) > maxRotationStep) {
                this.orientation += Math.sign(orientationDiff) * maxRotationStep;
            } else {
                this.orientation = desiredOrientation;
            }
            
            const alignmentThreshold = Math.PI / 6;
            if (Math.abs(orientationDiff) < alignmentThreshold) {
                const speed = 8;
                this.velocity.x = (deltaX / distance) * speed;
                this.velocity.z = (deltaZ / distance) * speed;
                
                this.position.x += this.velocity.x * delta;
                this.position.z += this.velocity.z * delta;
            } else {
                this.velocity.x *= 0.9;
                this.velocity.z *= 0.9;
            }
            
        } else {
            this.returningToHelipad = false;
            this.velocity = {x: 0, z: 0};
            
            if (this.bucketState === 'hanging' || this.bucketState === 'filled' || this.bucketState === 'retracting') {
                this.waitingForBucketRetraction = true;
                if (this.bucketState !== 'retracting') {
                    this.retractBucket();
                }
            } else {
                this.in_air = false;
                this.targetY = 0;
            }
        }
    }
        
        // waiting for bucket retraction
        if (this.waitingForBucketRetraction) {
            if (this.bucketState === 'stored') {
                this.waitingForBucketRetraction = false;
                this.in_air = false;
                this.targetY = 0;
            }
            this.velocity = {x: 0, z: 0};
        }
        this.updateBucket(delta);
        this.updateWaterDrops(delta); 

        const currentSpeed = Math.hypot(this.velocity.x, this.velocity.z);
        const isMoving = currentSpeed > 0.1; 
        
        if (!isMoving) {
            this.leanAngle *= 0.92; 
            this.turnLeanAngle *= 0.92; 
            
            if (Math.abs(this.leanAngle) < 0.01) this.leanAngle = 0;
            if (Math.abs(this.turnLeanAngle) < 0.01) this.turnLeanAngle = 0;
        }
    
        this.acceleration = {x: 0, z: 0};
        this.helixRotationAngle += this.helixRotationSpeed * delta;
    
        if (this.in_air || this.revvingUp) {
            this.tailRotorAngle += this.helixRotationSpeed * 2 * delta;
        } else if (this.isLanding()) {
            this.tailRotorAngle += Math.max(0, this.helixRotationSpeed) * 2 * delta;
        }
    }
    



    heliConstruct() {
        // Display The Top Helix
        this.scene.pushMatrix();
        this.scene.translate(9.5, 2, .25);
        this.scene.scale(.75, .75, .75);
        this.displayHelix(.65);
        this.scene.popMatrix();

        // Display The Bottom Support
        this.scene.pushMatrix();
        this.scene.translate(12, -6.65, 2.4);
        this.scene.scale(.75, .75, .75);
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
        this.scene.translate(4.5, .5, 3);
        this.scene.rotate(-Math.PI / 2, 0, 0, 0);
        this.displayWings(-1);
        this.scene.translate(0, 0, -5.5);
        this.scene.rotate(Math.PI / 2, 0, 0, 0);
        this.displayWings(1);
        this.scene.popMatrix();

        // Display The Bucket
        // this.displayBucket();

        this.displayBucketSystem();


    }

    displayBucketSystem() {
        if (this.bucketState === 'stored' || this.bucketCurrentLength <= 0) return;

        this.scene.pushMatrix();
        
        this.scene.translate(12, -3, 0);
        
        this.scene.pushMatrix();
        this.scene.translate(0, -this.bucketCurrentLength * 2, 0);
        this.scene.scale(0.08, this.bucketCurrentLength + 0.505, 0.08);
        this.scene.textureManager.bucketMaterial.apply();
        this.bucketString.display();
        this.scene.popMatrix();

        // Bucket walls
        this.scene.pushMatrix();
        this.scene.translate(0, -this.bucketCurrentLength * 5 + 0.7, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(1.2, 1.2, 1.5);
        this.scene.textureManager.bucketMaterial.apply();
        this.bucket.display();
        this.scene.popMatrix();

        //  Content
        this.scene.pushMatrix();
        this.scene.translate(0, -this.bucketCurrentLength * 5 + 0.71, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(1.0, 1.0, 1.3);
        
        if (this.bucketHasWater) {
            // Blue water
            this.scene.setDiffuse(0.2, 0.4, 0.8, 0.9);
            this.scene.setAmbient(0.1, 0.2, 0.4, 1.0);
            this.scene.setSpecular(0.4, 0.6, 1.0, 1.0);
            this.scene.setShininess(50);
        } else {
            // black
            this.scene.setDiffuse(0.0, 0.0, 0.0, 1.0);
            this.scene.setAmbient(0.0, 0.0, 0.0, 1.0);
            this.scene.setSpecular(0.0, 0.0, 0.0, 1.0);
        }
        
        this.bucket.display();
        this.scene.popMatrix();

        // Bucket bottom
        this.scene.pushMatrix();
        this.scene.translate(0, -this.bucketCurrentLength * 5 + 0.7 - 0.75, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(1.2, 1.2, 0.05);
        this.scene.textureManager.bucketMaterial.apply();
        this.bucketCap.display();
        this.scene.popMatrix();

        // Bucket top rim
        this.scene.pushMatrix();
        this.scene.translate(0, -this.bucketCurrentLength * 5 + 0.45, 0);
        this.scene.rotate(Math.PI/2, 1, 0, 0);
        this.scene.scale(1.25, 1.25, 0.05); 
        this.scene.textureManager.bucketMaterial.apply();
        this.bucketCap.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
        this.displayWaterDropsInBucket();
    }
        
    updateBucket(delta) {
        const overHelipad = this.isOverHelipad();
        
        if (this.in_air && this.position.y >= this.cruiseAltitude - 2) {
            if (this.bucketState === 'stored' && !overHelipad) {
                this.bucketState = 'deploying';
            }
        } else if (!this.in_air && this.position.y <= 2) {
            if (this.bucketState === 'hanging' || this.bucketState === 'filled') {
                this.bucketState = 'retracting';
            }
        }
        
        if (overHelipad && this.in_air) {
            if (this.bucketState === 'hanging' || this.bucketState === 'filled') {
                this.bucketState = 'retracting';
            }
        }

        switch(this.bucketState) {
            case 'deploying':
                if (overHelipad) {
                    this.bucketState = 'stored';
                    break;
                }
                
                this.bucketCurrentLength += this.bucketSpeed * delta;
                if (this.bucketCurrentLength >= this.bucketMaxLength) {
                    this.bucketCurrentLength = this.bucketMaxLength;
                    this.bucketState = 'hanging';
                }
                break;
                
            case 'retracting':
                this.bucketCurrentLength -= this.bucketSpeed * delta;
                if (this.bucketCurrentLength <= 0) {
                    this.bucketCurrentLength = 0;
                    this.bucketState = 'stored';
                    this.bucketHasWater = false;
                }
                break;
                
            case 'hanging':
            case 'filled':
                if (overHelipad && this.in_air) {
                    this.bucketState = 'retracting';
                } else {
                    this.bucketCurrentLength = this.bucketMaxLength;
                }
                break;
                
            case 'stored':
                this.bucketCurrentLength = 0;
                break;
        }

        if (this.bucketState === 'hanging' && this.isOverLake() && !overHelipad && this.position.y <= 3) {
            this.fillBucket();
        }
    }
    
    deployBucket() {
        if (this.bucketState === 'stored') {
            this.bucketState = 'deploying';
        }
    }
    
    retractBucket() {
        if (this.bucketState === 'hanging' || this.bucketState === 'filled') {
            this.bucketState = 'retracting';
        }
    }
    
    fillBucket() {
        if (this.bucketState === 'descending' && this.isOverLake() && this.position.y <= 3) {
            this.bucketHasWater = true;
            this.bucketState = 'filled';
            
            this.targetY = this.cruiseAltitude;
        }
    }
    
    dropWater() {
        if (this.bucketState === 'filled' && this.bucketHasWater) {
            this.bucketHasWater = false;
            this.bucketState = 'hanging';
            
            this.isDropping = true;
            this.dropSpawnTimer = 0;
            this.dropsCreated = 0;
            
            return true;
        }
        return false;
    }
    
    
    createWaterDrop() {
        const drop = {
            position: {
                x: (Math.random() - 0.5) * 2,     
                y: -0.5 - Math.random() * 1,      
                z: (Math.random() - 0.5) * 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,     
                y: -3 - Math.random() * 2,        
                z: (Math.random() - 0.5) * 2
            },
            life: 0,
            maxLife: 8,
            size: 0.3 + Math.random() * 0.4
        };
        
        this.waterDrops.push(drop);
    }
    
    
    updateWaterDrops(delta) {
        if (this.isDropping) {
            this.dropSpawnTimer += delta;
            
            if (this.dropSpawnTimer >= this.dropSpawnRate && this.dropsCreated < this.maxDrops) {
                this.createWaterDrop();
                this.dropsCreated++;
                this.dropSpawnTimer = 0;
            }
            
            if (this.dropsCreated >= this.maxDrops) {
                this.isDropping = false;
            }
        }
        
        for (let i = this.waterDrops.length - 1; i >= 0; i--) {
            const drop = this.waterDrops[i];
            
            drop.velocity.y -= 15 * delta; 
            drop.position.x += drop.velocity.x * delta;
            drop.position.y += drop.velocity.y * delta;
            drop.position.z += drop.velocity.z * delta;
            
            drop.velocity.x *= 0.98;
            drop.velocity.z *= 0.98;
            
            drop.life += delta;
            
            if (drop.position.y <= -25 && this.isOverFire()) {
                this.waterHitFire = true;
            }
            
            if (drop.life >= drop.maxLife || drop.position.y <= -30) {
                this.waterDrops.splice(i, 1);
            }
        }
    }
    
    
    
    displayWaterDropsInBucket() {
        if (this.waterDrops.length === 0) return;
        
        for (const drop of this.waterDrops) {
            this.scene.pushMatrix();
            
            this.scene.translate(
                12 + drop.position.x,  
                -3 + (-this.bucketCurrentLength * 5 + drop.position.y), 
                0 + drop.position.z   
            );
            
            const ageFactor = 1 - (drop.life / drop.maxLife);
            const currentSize = drop.size * ageFactor;
            this.scene.scale(currentSize/2, currentSize/2, currentSize/2);
            
            this.scene.setDiffuse(0.2, 0.4, 0.8, 0.7 * ageFactor);
            this.scene.setAmbient(0.1, 0.2, 0.4, 1.0);
            this.scene.setSpecular(0.4, 0.6, 1.0, 1.0);
            this.scene.setShininess(50);
            
            this.waterSphere.display();
            
            this.scene.popMatrix();
        }
    }
    

    displayHelix(bladeScaleFactor = 1){
        // Support
        this.scene.pushMatrix();
        this.scene.translate(0, .5, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(.55, .55, 2);
        this.scene.textureManager.metalMaterialOG.apply();
        this.helixSupport.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(1, 1, .5);
        this.scene.textureManager.metalMaterialOG.apply();
        this.helixSupportBase.display();
        this.scene.popMatrix();

        // Blades Support
        this.scene.pushMatrix();
        this.scene.translate(0, 1.75, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(1.1, 1.1, .5);
        this.scene.textureManager.metalMaterialOG.apply();
        this.scene.textureManager.metalMaterialOG.setAmbient(0.9, 0.9, 0.9, 1);
        this.scene.textureManager.metalMaterialOG.setDiffuse(0.9, 0.9, 0.9, 1);
        this.scene.textureManager.metalMaterialOG.setSpecular(0.1, 0.1, 0.1, 1);
        this.helixSupportBase.display();
        this.scene.popMatrix();

        // Blades
        this.scene.pushMatrix();
        this.scene.translate(-1.25, 2, 0);
        this.scene.rotate(this.helixRotationAngle, 0, 1, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(bladeScaleFactor * 4, 2, 1);
        this.scene.textureManager.metalMaterialOG.apply();
        this.displayBlade();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 2, 1.25);
        this.scene.rotate(this.helixRotationAngle, 0, 1, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.scene.scale(bladeScaleFactor * 4, 2, 1);
        this.scene.textureManager.metalMaterialOG.apply();
        this.displayBlade();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(1.25, 2, 0);
        this.scene.rotate(this.helixRotationAngle, 0, 1, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.scale(bladeScaleFactor * 4, 2, 1);
        this.scene.textureManager.metalMaterialOG.apply();
        this.displayBlade();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 2, -1.25);
        this.scene.rotate(this.helixRotationAngle, 0, 1, 0);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.rotate(-Math.PI/2, 0, 0, 1);
        this.scene.scale(bladeScaleFactor * 4, 2, 1);
        this.scene.textureManager.metalMaterialOG.apply();
        this.displayBlade();
        this.scene.popMatrix();


    }

    displayBlade(){
        this.scene.pushMatrix();
        this.scene.translate(0, -.125, 0);
        this.bladeSupport.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.blade.display();
        this.scene.popMatrix();
    }

    displayBottomSupport(leftSupport){
        // Left Support is either 1 or -1 that indicates the position of the support
        // Main Support
        this.scene.pushMatrix();
        this.scene.textureManager.metalMaterialOG.apply();
        this.bottomSupport.display();
        this.scene.translate(0, .28, 4.2);
        this.scene.rotate(-Math.PI/4, 1, 0, 0);
        this.bottomSupport2.display();
        this.scene.popMatrix();

        // Supports Connections
        this.scene.pushMatrix();
        this.scene.translate(leftSupport * .05, .5, 2);
        this.bottomConnector.display();
        this.scene.translate(leftSupport * .1, .75, 0);
        this.scene.rotate(leftSupport * -Math.PI/5.5, 0, 0, 1);
        this.bottomConnector2.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(leftSupport * .05, .5, -2);
        this.bottomConnector.display();
        this.scene.translate(leftSupport * .1, .75, 0);
        this.scene.rotate(leftSupport * -Math.PI/5.5, 0, 0, 1);
        this.scene.textureManager.metalMaterialOG.apply();
        this.bottomConnector2.display();
        this.scene.popMatrix();

    }

    displayBody(){

        // Body Connecting With Tail
        this.scene.gl.enable(this.scene.gl.POLYGON_OFFSET_FILL); // Avoid twitching with Intersection Polygons
        this.scene.gl.polygonOffset(2.0, 2.0); // Offset factor and units

        this.scene.pushMatrix();
        this.scene.translate(6.85, 1.25, .25);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(1,1,2);
        this.scene.textureManager.metalMaterial.apply();
        this.bodyTailConnect.display();
        this.scene.popMatrix();
        this.scene.gl.disable(this.scene.gl.POLYGON_OFFSET_FILL);

        // Top Part Connecting to Helix
        this.scene.gl.enable(this.scene.gl.POLYGON_OFFSET_FILL); // Avoid twitching with Intersection Polygons
        this.scene.gl.polygonOffset(5.0, 5.0); // Offset factor and units

        this.scene.pushMatrix();
        this.scene.translate(11.6, 1.25, .25);
        this.scene.rotate(Math.PI, 0, 0, 0);
        this.helixBodyBase.display();
        this.scene.popMatrix();

        // Top Part Wrap
        this.scene.pushMatrix();
        this.scene.translate(12.1, 1, .25);
        this.scene.rotate(Math.PI, 0, 0, 0);
        this.helixBodyWrap.display();
        this.scene.popMatrix();


        this.scene.gl.disable(this.scene.gl.POLYGON_OFFSET_FILL);


        // Main Body Up
        this.scene.gl.enable(this.scene.gl.POLYGON_OFFSET_FILL); // Avoid twitching with Intersection Polygons
        this.scene.gl.polygonOffset(2.0, 2.0); // Offset factor and units

        this.scene.pushMatrix();
        this.scene.translate(13.35, -1, .25);
        this.scene.rotate(Math.PI, 0, 0, 0);
        this.scene.textureManager.metalMaterial2.apply();
        this.mainBodyUp.display();
        this.scene.popMatrix();

        // Main Body Down
        this.scene.pushMatrix();
        this.scene.translate(8.35, -4, .25);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.textureManager.metalMaterial.apply();
        this.mainBodyDown.display();
        this.scene.popMatrix();


        // Back Body
        // this.scene.pushMatrix();
        // this.scene.rotate(Math.PI, 0, -1, 1);
        // this.scene.translate(-6.85,1.6,1);
        // this.backPartUp.display();
        // this.scene.translate(0,-2.3,0);
        // this.scene.rotate(Math.PI, 1, 0, 0);
        // this.backPartUp.display();
        // this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(6.3,-1,.25);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.textureManager.metalMaterial2.apply();
        this.backPartUp2.display();
        this.scene.popMatrix();


        // this.scene.pushMatrix();
        // this.scene.translate(6.3,-4,.25);
        // this.scene.rotate(Math.PI, 0, 0, 1);
        // this.backPartDown.display();
        // this.scene.popMatrix();

        // Front Body
        this.scene.pushMatrix();
        this.scene.translate(17.1, -4.75, .25);
        this.scene.rotate(Math.PI, 0, 0, 1);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.textureManager.metalMaterial.apply();
        this.frontPartDown.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(16.35, -3.25, .25);
        this.frontPartUp.display();
        this.scene.popMatrix();

        // Bottom Base (Connected to the bottom support)
        this.scene.pushMatrix();
        this.scene.translate(12, -5.65,.25)
        this.bodySupport.display();
        this.scene.popMatrix();

        // WindShield
        this.scene.pushMatrix();
        this.scene.translate(14.5, -1.1, .25);
        this.scene.rotate(Math.PI, 0, 0, 0);
        this.scene.textureManager.metalMaterialOG2.apply();
        this.windshield.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(13.25, .35, .25);
        this.scene.textureManager.metalMaterial2.apply();
        this.windshieldDiv.display();
        this.scene.translate(1.27, -1.45, 0);
        this.scene.rotate(-Math.PI/3, 0, 0, 1);
        this.windshieldDiv2.display();
        this.scene.popMatrix();

        this.scene.gl.disable(this.scene.gl.POLYGON_OFFSET_FILL);

    }


    displayTail(){
        // Tail
        this.scene.gl.enable(this.scene.gl.POLYGON_OFFSET_FILL); // Avoid twitching with Intersection Polygons
        this.scene.gl.polygonOffset(2.0, 2.0); // Offset factor and units
        this.scene.pushMatrix();
        this.scene.translate(2.5,-.75,.25);
        this.scene.rotate(-Math.PI/2, 0, 0, 1);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.scene.textureManager.metalMaterial2.apply();
        this.tailBase.display();
        this.scene.popMatrix();
        this.scene.gl.disable(this.scene.gl.POLYGON_OFFSET_FILL);

        // Upper Tail
        this.scene.pushMatrix();
        this.scene.translate(3.75, .75, .25);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.textureManager.metalMaterial.apply();
        this.tailTop.display();
        this.scene.popMatrix();
    }
    displayBackHelix(){
        this.scene.pushMatrix();
        this.scene.translate(0, 1.5, .25);
        this.scene.scale(2, 2, 2);
        this.displayTailFlap();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -1.5, .25);
        this.scene.scale(2, 2, 2);
        this.scene.rotate(Math.PI, 1, 0, 0);
        this.displayTailFlap();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, -0.5);
        this.scene.rotate(-Math.PI/2, 1, 0, 0);
        this.scene.scale(0.25, 0.25, 0.25);
        
        this.scene.rotate(this.tailRotorAngle, 0, 1, 0);
        this.displayHelix(0.35);
        this.scene.popMatrix();
    }


    displayTailFlap(){
        this.scene.pushMatrix();
        this.scene.textureManager.metalMaterial.apply();
        this.tailFlap.display();
        this.scene.popMatrix();


        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI, 1, 0, 0);
        this.scene.rotate(Math.PI/2, 0, 0, 1);
        this.scene.translate(0, 1, 0);
        this.scene.textureManager.metalMaterial.apply();
        this.tailFlap.display();
        this.scene.popMatrix();
    }

    displayWings(zPosition){
        // zPosition is either 1 or -1 that indicates the position of the wing support

        // Wings
        this.scene.pushMatrix();
        this.scene.translate(0.25, 0, 0);
        this.scene.textureManager.metalMaterial.apply();
        this.trapezoid.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, -.75, 0);
        this.trapezoidBase.display();
        this.scene.popMatrix();

        // Wings Support
        this.scene.pushMatrix();
        this.scene.textureManager.metalMaterial2.apply();
        this.scene.translate(0, -.5, zPosition* 1.25);
        this.wingSupport.display();
        this.scene.popMatrix();

    }

    displayBucket() {
        this.scene.pushMatrix();
        this.scene.translate(this.bucketPosition.x, this.bucketPosition.y, this.bucketPosition.z);

        if (this.bucketState === 'open') {
            this.scene.scale(1, 1, 0.5);
        }

        this.scene.textureManager.metalMaterial2.apply();
        this.bucket.display();
        this.scene.popMatrix();

        if (this.bucketHasWater) {
            // Display water inside the bucket
            this.scene.pushMatrix();
            this.scene.translate(this.bucketPosition.x, this.bucketPosition.y - 0.5, this.bucketPosition.z);
            this.scene.scale(0.8, 0.8, 0.8);
            this.scene.textureManager.waterMaterial.apply();
            this.bucket.display();
            this.scene.popMatrix();
        }
    }

}
