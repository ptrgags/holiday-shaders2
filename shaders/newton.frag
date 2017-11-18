-- END IMPORTS --

/**
 * Complex multiplication:
 * (a + bi)(c + di) = (ac - bd) + (ad + bc)i
 */
vec2 complex_mult(vec2 a, vec2 b) {
    return vec2(
        a.x * b.x - a.y * b.y,
        a.x * b.y + a.y * b.x);
}

/**
 * Complex division:
 * (a + bi) / (c + di) =
 * let divisor = c^2 + d^2 in
 * (ac + bd)/divisor + ((bc - ad)/divisor)i
 */
vec2 complex_div(vec2 a, vec2 b) {
    float divisor = dot(b, b);

    // Handle divide by 0
    if (divisor == 0.0)
        return vec2(0.0);
    else {
        return vec2(
            (a.x * b.x + a.y * b.y) / divisor,
            (a.y * b.x - a.x * b.y) / divisor
        );
    }
}

/**
 * Function of a complex number on which we will run Newton's fractal.
 *
 * f(x) = x^3 - 1
 */
vec2 f(vec2 x) {
    // x^2
    vec2 result = complex_mult(x, x);
    // x^3
    result = complex_mult(x, result);

    // x^3 - 1
    result.x -= 1.0;
    return result;
}

/**
 * Derivative of f.
 *
 * df/dx(x) = 3x^2
 */
vec2 diff_f(vec2 x) {
    // x^2
    vec2 result = complex_mult(x, x);
    // 3x^2
    result *= 3.0;
    return result;
}

void main() {
    vec2 centered = gl_FragCoord.xy - CENTER;

    vec2 z = centered;
    const int MAX = 128;
    int iteration = MAX;
    float TOLERANCE = 0.0001;
    for (int i = 0; i < MAX; i++) {
        // Perform one round of Newton's Method
        vec2 new_z = z - complex_div(f(z), diff_f(z));
        if (distance(new_z, z) < TOLERANCE) {
            iteration = i;
            break;
        }
        z = new_z;
    }

    float fraction = float(iteration) / float(MAX);
    //Make the darks darker and the mids brighter
    float adjusted_contrast = smoothstep(0.08, 0.3, fraction);

    gl_FragColor = adjusted_contrast * vec4(1.0, 0.0, 0.0, 1.0);
}
