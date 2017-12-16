import signals.frag
import polar.frag
import complex.frag
import newtons_method.frag
import noise.frag
import display.frag
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

    vec2 uv = CENTERED_UV;

    // TODO: handle this in a nicer fashion
    //vec2 z = v_uv * resolution - resolution / 2.0;
    //z /= 8.0;
    vec2 z = uv;

    NewtonFractal fractal = newtons_method(z);

    float angle = rect_to_polar(fractal.last_vector).y;
    // simple cos(angle) * iteration_mask looks cool too
    float cosine_mask = unsigned_signal(cos(TAU * angle - 2.0 * time));



    float mask = noise_lookup(fractal.iterations);
    vec4 band_color = noise_color(fractal.iterations + 1.0);

    vec4 color1 = noise_color(0.0);
    vec4 color2 = noise_color(3.0);

    vec2 polar = rect_to_polar(uv);
    float color_change = smoothstep(0.1, 0.5, polar.x);

    vec4 color = mix(color1, color2, color_change);


    gl_FragColor = display(cosine_mask * mask * band_color);
}
