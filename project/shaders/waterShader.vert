#version 120

attribute vec3 position;
attribute vec2 texCoord;

varying vec2 vTexCoord;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

void main() {
    vTexCoord = texCoord;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}