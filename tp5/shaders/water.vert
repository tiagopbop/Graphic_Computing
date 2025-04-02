attribute vec3 aVertexPosition;
attribute vec3 aVertexNormal;
attribute vec2 aTextureCoord;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform mat4 uNMatrix;

uniform float timeFactor;
uniform sampler2D uSamplerWaterMap;

varying vec2 vTextureCoord;

void main() {
    vTextureCoord = aTextureCoord;

    // Method 1
    vec3 offset = vec3(0.0,0.0,0.0);

    vec2 aux = vec2((timeFactor * 0.01), (timeFactor * 0.01));

    offset.z = texture2D(uSamplerWaterMap, aTextureCoord + aux).b * 0.065;

    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset, 1.0);

    // Method 2
//    vec3 offset = aVertexNormal * texture2D(uSamplerWaterMap, vTextureCoord).b * 0.05;
//    vec3 offset2 = aVertexNormal * texture2D(uSamplerWaterMap, vTextureCoord + sin(timeFactor * 0.005) * sin(timeFactor * 0.005)).b * 0.05;
//
//    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition + offset + offset2, 1.0);
}

