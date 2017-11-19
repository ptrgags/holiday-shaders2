/**
 * Convert from rectangular to polar
 * however, the theta is converted to an angle between 0 and 1
 * since this is typically more useful.
 */
vec2 rect_to_polar(vec2 rect) {
    float r = length(rect);

    // Calculate the angle from [-pi, pi]
    float theta = atan(rect.y, rect.x);

    // Convert to [-1, 1] by dividing by pi
    theta /= PI;

    // Shift to a range of [0.0, 1.0] using the same transform I use
    // for making an unsigned signal
    theta = unsigned_signal(theta);

    // Rotate by half a circle so 0 starts on the right side of the circle.
    theta = fract(theta + 0.5);

    return vec2(r, theta);
}

/**
 * Convert from polar coordinates with a normalized angle to (x, y)
 * coordinates.
 */
vec2 polar_to_rect(vec2 polar) {
    float theta_rad = polar.y * TAU;
    float x = polar.x * cos(theta_rad);
    float y = polar.x * sin(theta_rad);
    return vec2(x, y);
}

/**
 * Rotate a polar vector by a fraction of a circle. The result will still
 * be in the range [0, 1]
 */
vec2 polar_rotate(vec2 polar, float amount) {
    vec2 result = polar;
    result.y = fract(polar.y - amount);
    return result;
}
