precision mediump float;

uniform float uBlendFactor;
uniform int uLightState; 
uniform vec3 uAmbientLight;
uniform vec3 uLightDirection;

varying vec3 vNormal;
varying vec2 vTextureCoord;

void main(void) {
    vec3 baseColor = vec3(0.8, 0.8, 0.8);
    vec3 finalColor = baseColor;
    
    if (uLightState > 0) {
        float blend = uBlendFactor * uBlendFactor * (3.0 - 2.0 * uBlendFactor);
        float pulse = smoothstep(0.3, 0.7, uBlendFactor);
        
        vec3 emissiveColor;
        if (uLightState == 1) {
            emissiveColor = vec3(0.0, 1.0, 0.0);
        } else {
            emissiveColor = vec3(1.0, 0.0, 0.0);
        }
        
        vec3 emissive = emissiveColor * blend * 2.0; 
        
        float lightIntensity = max(dot(normalize(vNormal), normalize(uLightDirection)), 0.0);
        vec3 diffuse = baseColor * lightIntensity;
        vec3 ambient = baseColor * uAmbientLight;
        
        finalColor = ambient + diffuse + emissive;
        
        finalColor = mix(finalColor, emissiveColor, pulse * 0.3);
    } else {
        float lightIntensity = max(dot(normalize(vNormal), normalize(uLightDirection)), 0.0);
        vec3 diffuse = baseColor * lightIntensity;
        vec3 ambient = baseColor * uAmbientLight;
        finalColor = ambient + diffuse;
    }
    
    gl_FragColor = vec4(finalColor, 1.0);
}