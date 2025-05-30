precision mediump float;

uniform sampler2D uHTexture;
uniform sampler2D uDownTexture;
uniform sampler2D uUpTexture;
uniform float uBlendFactor;
uniform int uTargetTexture;

varying vec2 vTextureCoord;

void main(void) {
    vec4 hColor = texture2D(uHTexture, vTextureCoord);
    vec4 downColor = texture2D(uDownTexture, vTextureCoord);
    vec4 upColor = texture2D(uUpTexture, vTextureCoord);
    
    float blend = uBlendFactor * uBlendFactor * (3.0 - 2.0 * uBlendFactor);
    
    if (uTargetTexture == 1) { // DOWN
        vec4 blended = mix(hColor, downColor, blend);
        float pulse = smoothstep(0.3, 0.7, uBlendFactor);
        blended.rgb = mix(blended.rgb, vec3(1.0, 0.7, 0.7), pulse * 0.2);
        gl_FragColor = blended;
    } 
    else if (uTargetTexture == 2) { // UP
        vec4 blended = mix(hColor, upColor, blend);
        float pulse = smoothstep(0.3, 0.7, uBlendFactor);
        blended.rgb = mix(blended.rgb, vec3(0.7, 1.0, 0.7), pulse * 0.2);
        gl_FragColor = blended;
    } 
    else { // H
        gl_FragColor = hColor;
    }
}