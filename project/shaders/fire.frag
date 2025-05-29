#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform float timeFactor;
uniform sampler2D uSampler;
uniform bool uUseTexture;

void main() {
    float height = vTextureCoord.t;
    
    vec3 fireColor;
    float alpha;
    
    float time = timeFactor * 0.003;
    
    float horizontalNoise = sin(vTextureCoord.s * 8.0 + time * 1.5) * 0.05;
    float adjustedHeight = clamp(height + horizontalNoise, 0.0, 1.0);
    
    if (adjustedHeight < 0.2) {
        fireColor = vec3(0.8, 0.2, 0.05);
        alpha = 1.0;
    } else if (adjustedHeight < 0.4) {
        float t = (adjustedHeight - 0.2) / 0.2;
        fireColor = mix(vec3(0.8, 0.2, 0.05), vec3(0.9, 0.4, 0.0), t);
        alpha = 1.0;
    } else if (adjustedHeight < 0.6) {
        float t = (adjustedHeight - 0.4) / 0.2;
        fireColor = mix(vec3(0.9, 0.4, 0.0), vec3(0.9, 0.7, 0.1), t);
        alpha = 0.95;
    } else if (adjustedHeight < 0.8) {
        float t = (adjustedHeight - 0.6) / 0.2;
        fireColor = mix(vec3(0.9, 0.7, 0.1), vec3(0.95, 0.9, 0.2), t);
        alpha = 0.9;
    } else if (adjustedHeight < 0.95) {
        float t = (adjustedHeight - 0.8) / 0.15;
        fireColor = mix(vec3(0.95, 0.9, 0.2), vec3(0.95, 0.95, 0.6), t);
        alpha = 0.8;
    } else {
        float t = (adjustedHeight - 0.95) / 0.05;
        fireColor = mix(vec3(0.95, 0.95, 0.6), vec3(0.98, 0.98, 0.8), t);
        alpha = 0.7 - t * 0.7;
    }
    

    if (uUseTexture) {
        vec4 textureColor = texture2D(uSampler, vTextureCoord);
        // Multiply texture with gradient colors
        fireColor *= textureColor.rgb;
        alpha *= textureColor.a;
    }
    
    float flicker1 = 0.9 + 0.1 * sin(time * 2.5 + vTextureCoord.s * 8.0);
    float flicker2 = 0.95 + 0.05 * cos(time * 1.8 + vTextureCoord.t * 6.0);
    
    float combinedFlicker = flicker1 * flicker2;
    fireColor *= combinedFlicker;
    
    alpha *= (0.9 + 0.1 * combinedFlicker);
    
    gl_FragColor = vec4(fireColor, alpha);
}