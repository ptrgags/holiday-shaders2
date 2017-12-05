/**
 * Interpret 3 floats from the noise buffer as a color
 */
vec4 noise_color(float offset) {
    return vec4(
        noise_lookup(0.0, offset),
        noise_lookup(1.0, offset),
        noise_lookup(2.0, offset),
        1.0
    );
}

vec2 noise_vec2(float offset) {
    return vec2(
        noise_lookup(0.0, offset),
        noise_lookup(1.0, offset)
    );
}

vec2 noise_vec2(vec2 offset) {
    float id = 19.0 * offset.x + offset.y;
    return noise_vec2(id);
}
