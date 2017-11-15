#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform int scroll;
uniform float noise_buffer[32];

#define PI 3.1415
#define CENTER (resolution / 2.0)

// Rotate around the origin angle radians. Remember that
// matricies are column major in GLSL!
mat2 rotate2d(float angle){
    return mat2(
        cos(angle), sin(angle),
        -sin(angle), cos(angle)
    );
}

// Map a float UV value in the range [0, 32)
int bucket(float x) {
    // We don't want negatives
    float positive = abs(x);
    //Make sure numbers are in the range [0, 1)
    float cycled = fract(positive);
    //Scale up to [0, 32)
    float scaled = cycled * 32.0;
    //Truncate to get the bucket
    return int(scaled);
}


void main() {
    // Noise-controled variables =============================================
    // Colors for columns and rows, respectively
    vec4 x_color = vec4(noise_buffer[0], noise_buffer[1], noise_buffer[2], 1.0);
    vec4 y_color = vec4(noise_buffer[3], noise_buffer[4], noise_buffer[5], 1.0);
    // How much to tilt the plaid pattern
    float tilt_angle = noise_buffer[6] * PI / 2.0;
    // UV offset of the center of rotation
    vec2 offset = vec2(noise_buffer[7], noise_buffer[8]);
    // =========================================================================


    // Define UV Coordinates starting from the center
    vec2 uv = (gl_FragCoord.xy - CENTER) / resolution.x;

    // Tilt the coordinate space
    uv = rotate2d(tilt_angle) * uv;

    // move the origin
    uv -= offset;

    // divide space into buckets numbered from 0 to 31
    // the numbering wraps around if we are too far away from the origin.
    int x_bucket = bucket(uv.x);
    int y_bucket = bucket(uv.y);

    // Lookup the intensities from the noise buffer. All 32 values are used.
    float x_intensity = 0.0;
    float y_intensity = 0.0;
    for (int i = 0; i < 32; i++) {
        if (i == x_bucket)
            x_intensity = noise_buffer[i];
        if (i == y_bucket)
            y_intensity = noise_buffer[i];
    }

    // Take the union of the horizontal and vertical stripes.
    gl_FragColor = max(x_color * x_intensity, y_color * y_intensity);
}
