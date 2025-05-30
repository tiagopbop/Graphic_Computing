precision mediump float;

uniform float timeFactor;
uniform sampler2D uWaterTex;

varying vec2 vTextureCoord;

void main(void) {
    vec2 waterUV = vTextureCoord * 3.0;
    waterUV.x += 0.02 * sin(timeFactor * 0.3 + vTextureCoord.y * 8.0);
    waterUV.y += 0.015 * cos(timeFactor * 0.4 + vTextureCoord.x * 6.0);
    
    vec4 waterColor = texture2D(uWaterTex, waterUV);
    
    waterColor.rgb *= vec3(0.3, 0.6, 0.9);
    waterColor.a = 1.0;
    
    gl_FragColor = waterColor;
}