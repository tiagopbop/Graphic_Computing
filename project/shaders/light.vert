precision mediump float;

attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

varying vec3 vNormal;
varying vec2 vTextureCoord;

void main(void) {
    vTextureCoord = aTextureCoord;
    vNormal = normalize((uNMatrix * vec4(aVertexNormal, 0.0)).xyz);
    
    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
}