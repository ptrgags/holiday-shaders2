
import signals.frag
import polar.frag
import complex.frag
import newtons_method.frag
import noise.frag
import display.frag
import color.frag
import transform.frag
-- END IMPORTS --

int random_power(float offset) {
    float power = 2.0 + floor(4.0 * noise_lookup(offset));
    return int(power);
}

/**
 * Function of a complex number on which we will run Newton's fractal.
 *
 * f(x) = x^a - x^b - 1
 * where x is a random integer power and b is a - 2 (minimum 1)
 */
vec2 f(vec2 x) {
    int a = random_power(7.0);
    int b = int(min(float(a - 2), 1.0));
    return complex_power(x, a) - complex_power(x, b) - vec2(1.0, 0.0);
}

/**
 * Derivative of f.
 *
 * f'(x) = ax^(a-1) - bx^(b-1)
 */
vec2 diff_f(vec2 x) {
    int a = random_power(7.0);
    int b = int(min(float(a - 2), 1.0));
    return (
        float(a) * complex_power(x, a - 1)
        - float(b) * complex_power(x, b - 1));
}


void main() {
    vec2 uv = CENTERED_UV;

    // TODO: handle this in a nicer fashion
    vec2 z = v_uv * resolution - resolution / 2.0;

    // Rotate and zoom
    z = rotate(1.5 * time) * z;
    z *= animated_zoom();

    NewtonFractal fractal = newtons_method(z);

    float angle = rect_to_polar(fractal.last_vector).y;
    float cosine_mask = cos(angle);

    vec3 a = noise_vec3(6.0);
    vec3 b = noise_vec3(8.0);
    vec3 c = noise_vec3(3.0);
    vec3 d = noise_vec3(15.0);
    vec3 color = cosine_palette(fractal.iterations, a, b, c, d);

    float band_mask = noise_lookup(fractal.iterations);

    gl_FragColor = display(cosine_mask * band_mask * color);
}
