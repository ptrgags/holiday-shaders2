#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform int scroll;
uniform float noise_buffer[32];

void main() {
    // Range: [0, 1]
    vec2 uv = gl_FragCoord.xy / resolution;
    // Range: [0, 31];
    int bucket = int(floor(uv.y * 32.0));

    float intensity = 0.0;
    for (int i = 0; i < 32; i++) {
        if (i == bucket)
            intensity = noise_buffer[i];
    }

    gl_FragColor = intensity * vec4(1.0, 0.0, 0.0, 0.0);
}
