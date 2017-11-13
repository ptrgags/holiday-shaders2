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

    // Calculate a rotation matrix
    mat2 rot = rotate2d(noise_buffer[6] * PI / 2.0);
    vec2 offset = vec2(noise_buffer[7], noise_buffer[8]);

    // Range: [0, 1]
    vec2 uv = (gl_FragCoord.xy - CENTER) / resolution.x - offset;
    uv = rot * uv;


    // Range: [0, 31];
    int x_bucket = bucket(uv.x);
    int y_bucket = bucket(uv.y);

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
