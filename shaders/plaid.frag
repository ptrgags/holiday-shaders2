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
    int x_bucket = int(floor(uv.x * 32.0));
    int y_bucket = int(floor(uv.y * 32.0));

    // WebGL, could we have simple array access please?
    float x_intensity = 0.0;
    float y_intensity = 0.0;
    for (int i = 0; i < 32; i++) {
        if (i == x_bucket)
            x_intensity = noise_buffer[i];
        if (i == y_bucket)
            y_intensity = noise_buffer[i];
    }

    vec4 x_color = vec4(noise_buffer[0], noise_buffer[1], noise_buffer[2], 1.0);
    vec4 y_color = vec4(noise_buffer[3], noise_buffer[4], noise_buffer[5], 1.0);

    gl_FragColor = max(x_color * x_intensity, y_color * y_intensity);
}
