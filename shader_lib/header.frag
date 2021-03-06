/*
 * This file lists uniforms and global constants that are used across
 * several
 */
#ifdef GL_ES
precision highp float;
#endif

// Time in seconds since shader was initialized
uniform float time;
// (width, height) of canvas
uniform vec2 resolution;
// mouse position
uniform vec2 mouse;
// scroll wheel displacement from center in number of clicks
uniform int scroll;

// Noise buffer is where the SHA-256 hash or other input source goes
#define NOISE_BUFFER_SIZE 32
uniform float noise_buffer[NOISE_BUFFER_SIZE];

// Trig constants
#define PI 3.1415
#define TAU (2.0 * PI)

// These are useful for defining UV coordinates for 2D shaders
/*
#define CENTER (resolution / 2.0)
#define REGULAR_UV (gl_FragCoord.xy / resolution.x)
#define CENTERED_UV ((gl_FragCoord.xy - CENTER) / resolution.x)
#define REGULAR_MOUSE_UV (mouse / resolution.x)
#define CENTERED_MOUSE_UV ((mouse - CENTER) / resolution.x)

/**
 * Fix the aspect ratio, however use units of x instead of y
 * since these shaders have a portrait orientation
 */
vec2 fix_aspect(vec2 uv) {
    float aspect_ratio = resolution.x / resolution.y;
    // Convert to UV in units of x instead of the usual units of y.
    uv.y /= aspect_ratio;
    return uv;
}

// UV coordinates must be passed via the vertex shader
varying vec2 v_uv;

#define CENTER 0.5
#define REGULAR_UV fix_aspect(v_uv)
#define CENTERED_UV fix_aspect(v_uv - CENTER)
#define REGULAR_MOUSE_UV (mouse / resolution.x)
#define CENTERED_MOUSE_UV ((mouse - CENTER) / resolution.x)

/**
 * look up a value in the noise buffer. The cycle_offset
 * allows you to start at an offset and cycle around the array.
 *
 * Because WebGL doesn't allow unbounded array access :P
 */
float noise_lookup(float index, float cycle_offset) {
    float cycled = mod(index + cycle_offset, float(NOISE_BUFFER_SIZE));
    int desired = int(cycled);
    for (int i = 0; i < NOISE_BUFFER_SIZE; i++) {
        if (i == desired)
            return noise_buffer[i];
    }
    return 0.0;
}

/**
 * Shortcut if we don't care about the offset.
 */
float noise_lookup(float index) {
    return noise_lookup(index, 0.0);
}
