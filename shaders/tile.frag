#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform int scroll;
uniform float noise_buffer[32];

#define PI 3.1415
#define TAU (2.0 * PI)

// Because WebGL doesn't allow unbounded array access :P
float noise_lookup(float index, float cycle_offset) {
    float cycled = mod(index + cycle_offset, 32.0);
    int desired = int(cycled);
    for (int i = 0; i < 32; i++) {
        if (i == desired)
            return noise_buffer[i];
    }
    return 0.0;
}

void main() {
    // Convert to UV coordinates
    vec2 uv = gl_FragCoord.xy / resolution;

    //Divide into a 2x2 grid and number each square from 0-3
    vec2 tile = 2.0 * uv;
    vec2 bucket = floor(tile);
    float square = 2.0 * bucket.y + bucket.x;

    // Subdivide each bucket into 4 triangles that meet in the center
    vec2 bucket_uv = fract(tile);
    vec2 centered_uv = bucket_uv - 0.5;

    // Get the angle around the center of the square
    float theta = atan(centered_uv.y, centered_uv.x);
    float theta_norm = theta / TAU + 0.5;
    float rotated = fract(theta_norm - 1.0 / 8.0);

    // Divide into 8 triangles
    float scaled = rotated * 8.0;
    float angle_bucket = floor(scaled);

    // Assign a number from 0-31
    float triangle_num = 8.0 * square + angle_bucket;

    float noise = noise_lookup(triangle_num, 0.0);
    float threshold = step(0.5, noise);

    gl_FragColor = threshold * vec4(1.0, 0.0, 0.0, 1.0);
}
