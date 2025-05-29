#version 120

varying vec2 vTexCoord;

uniform sampler2D waterTexture;
uniform float time;

void main() {
    // Create ripple effect by distorting texture coordinates
    float wave = sin(10.0 * vTexCoord.x + time) * 0.02 + cos(10.0 * vTexCoord.y + time) * 0.02;
    vec2 distortedTexCoord = vTexCoord + vec2(wave, wave);

    // Sample the water texture
    vec4 waterColor = texture2D(waterTexture, distortedTexCoord);

    // Adjust color for a more realistic water effect
    gl_FragColor = vec4(waterColor.rgb * 0.8, 1.0);
}