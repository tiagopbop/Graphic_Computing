attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float timeFactor;

varying vec2 vTextureCoord;

void main() {
vTextureCoord = vec2(aTextureCoord.s, 1.0 - aTextureCoord.t); 
    
    vec3 position = aVertexPosition;
    
    float time = timeFactor * 0.15;
    
    float heightFactor = (aVertexPosition.y + 1.0) * 5.0;
    heightFactor = clamp(heightFactor, 0.0, 0.8);
    
    float noiseX = sin(aVertexPosition.x * 15.0 + aVertexPosition.z * 8.0) * 0.5 + 0.5;
    float noiseZ = cos(aVertexPosition.x * 12.0 + aVertexPosition.z * 10.0) * 0.5 + 0.5;
    
    float wave1 = sin(time * 2.0 + aVertexPosition.y * 5.0 + noiseX * 6.28);
    float wave2 = sin(time * 1.5 + aVertexPosition.x * 3.0 + noiseZ * 6.28);
    float wave3 = cos(time * 2.5 + aVertexPosition.z * 4.0 + noiseX * 3.14);
    
    float wave4 = sin(time * 3.0 + (aVertexPosition.x + aVertexPosition.z) * 2.0 + noiseZ * 4.71);
    float wave5 = cos(time * 1.8 + aVertexPosition.y * 6.0 + noiseX * 2.35);
    
    float bendX = (wave1 + wave4 * 0.6) * heightFactor * heightFactor * 0.3;
    float bendZ = (wave2 + wave5 * 0.7) * heightFactor * heightFactor * 0.25;
    
    float stretch = wave3 * heightFactor * 0.15;
    
    float turbulenceX = sin(time * 4.0 + noiseX * 8.0 + aVertexPosition.y * 8.0) * heightFactor * 0.08;
    float turbulenceZ = cos(time * 3.5 + noiseZ * 7.0 + aVertexPosition.x * 6.0) * heightFactor * 0.06;
    
    position.x += bendX + turbulenceX;
    position.z += bendZ + turbulenceZ;
    position.y += stretch;
    
    gl_Position = uPMatrix * uMVMatrix * vec4(position, 1.0);
}