precision mediump float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float timeFactor;

varying vec2 vTextureCoord;

void main(void) {
    vTextureCoord = vec2(aTextureCoord.s, 1.0 - aTextureCoord.t);

    // Simple wave variation in Y axis
    float wave1 = 0.1 * sin(aVertexPosition.x * 2.0 + timeFactor * 1.0);
    float wave2 = 0.08 * cos(aVertexPosition.z * 3.0 + timeFactor * 1.2);
    float wave3 = 0.05 * sin((aVertexPosition.x + aVertexPosition.z) * 4.0 + timeFactor * 0.8);

    float totalWave = wave1 + wave2 + wave3;

    vec4 pos = vec4(aVertexPosition.x, aVertexPosition.y + totalWave, aVertexPosition.z, 1.0);
    gl_Position = uPMatrix * uMVMatrix * pos;
}