import signals.frag
import polar.frag
import complex.frag
import newtons_method.frag
import noise.frag
import display.frag
import color.frag
-- END IMPORTS --

/**
 * Function of a complex number on which we will run Newton's fractal.
 *
 * f(x) = x^4 - 1
 */
vec2 f(vec2 x) {
    return complex_power(x, 4) - vec2(1.0, 0.0);
}

/**
 * Derivative of f.
 *
 * f'(x) = 4x^3
 */
vec2 diff_f(vec2 x) {
    return 4.0 * complex_power(x, 3);
}

void main() {
    vec2 uv = CENTERED_UV;

    vec2 z = v_uv * resolution - resolution / 2.0;
    z *= animated_zoom();

    NewtonFractal fractal = newtons_method(z);

    vec3 a = noise_vec3(17.0);
    vec3 b = noise_vec3(24.0);
    vec3 c = noise_vec3(14.0);
    vec3 d = noise_vec3(3.0);
    vec3 palette = cosine_palette(fractal.iterations, a, b, c, d);

    gl_FragColor = display(palette);
}
