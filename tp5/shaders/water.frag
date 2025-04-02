#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSamplerWater;
uniform sampler2D uSamplerWaterMap;

uniform float timeFactor;


void main() {
    vec2 coords = mod(vTextureCoord + timeFactor * 0.005, 1.0);
    vec4 color = texture2D(uSamplerWater, coords);

    vec4 filterMap = texture2D(uSamplerWaterMap, coords);

    color.r -= color.r * filterMap.r * 0.2;
    color.g -= color.g * filterMap.g * 0.2;
    color.b -= color.b * filterMap.b * 0.2;

    gl_FragColor = color;

    // Other color definitions
//    vec2 aux = vec2(timeFactor * 0.0075, timeFactor * 0.0075);
//    vec4 color = texture2D(uSamplerWater, vTextureCoord * 0.6 + aux);
//    gl_FragColor = color;


}