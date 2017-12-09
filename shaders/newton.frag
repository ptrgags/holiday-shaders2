import signals.frag
import polar.frag
import complex.frag
-- END IMPORTS --

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

    /*
    float fraction = float(iteration) / float(MAX);
    //Make the darks darker and the mids brighter
    float adjusted_contrast = smoothstep(0.08, 0.3, fraction);

    gl_FragColor = adjusted_contrast * vec4(1.0, 0.5, 1.0, 1.0);
    */

    float mask = noise_lookup(float(iteration), 0.0);

    vec4 color1 = vec4(
        noise_lookup(0.0, 0.0),
        noise_lookup(1.0, 0.0),
        noise_lookup(2.0, 0.0),
        1.0
    );

    vec4 color2 = vec4(
        noise_lookup(3.0, 0.0),
        noise_lookup(4.0, 0.0),
        noise_lookup(5.0, 0.0),
        1.0
    );

    vec2 uv = centered / resolution;
    vec2 polar = rect_to_polar(uv);
    float color_change = smoothstep(0.1, 0.5, polar.x);

    vec4 color = mix(color1, color2, color_change);

    gl_FragColor = mask * color;
}
