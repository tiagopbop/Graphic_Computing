precision mediump float;

attribute vec3 aVertexPosition;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;

varying vec2 vTextureCoord;

void main(void) {
    vTextureCoord = vec2(aTextureCoord.s, 1.0 - aTextureCoord.t);
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}