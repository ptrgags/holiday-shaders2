import signals.frag
import polar.frag
import complex.frag
import newtons_method.frag
import noise.frag
import display.frag
import color.frag
import transform.frag
-- END IMPORTS --

#define POWER_OFFSET 3.0
#define MAX_RAND_POWER 7

int random_power(float offset) {
    float power = 3.0 + floor(4.0 * noise_lookup(offset));
    return int(power);
}

/**
 * Function of a complex number on which we will run Newton's fractal.
 *
 * f(x) = x^y - 1  where y is a random power from 3-6
 */
vec2 f(vec2 x) {
    int power = random_power(POWER_OFFSET);
    return complex_power(x, power) - vec2(1.0, 0.0);
}

/**
 * Derivative of f.
 *
 * f'(x) = yx^(y-1)
 */
vec2 diff_f(vec2 x) {
    int power = random_power(POWER_OFFSET);
    return float(power) * complex_power(x, power - 1);
}

float nearest_root(vec2 root) {
    int power = random_power(POWER_OFFSET);
    float sector_size = 1.0 / float(power);
    const float TOLERANCE = 0.001;
    for (int i = 0; i <= MAX_RAND_POWER; i++) {
        if (i >= power)
            break;
        float angle = float(i) * sector_size;
        vec2 polar = vec2(1.0, angle);
        vec2 rect = polar_to_rect(polar);
        if (distance(rect, root) < TOLERANCE)
            return angle;
    }
    return -1.0;
}

void main() {
    vec2 centered = gl_FragCoord.xy - CENTER;

    vec2 uv = CENTERED_UV;

    vec2 z = v_uv * resolution - resolution / 2.0;
    // Twist and zoom
    z = rotate(length(z) / resolution.x - time) * z;
    z *= animated_zoom();

    NewtonFractal fractal = newtons_method(z);

    float angle = rect_to_polar(fractal.last_vector).y;
    // simple cos(angle) * iteration_mask looks cool too
    float cosine_mask = cos(angle); //unsigned_signal(cos(TAU * angle - 2.0 * time));

    float hue = 360.0 * rect_to_polar(fractal.root).y;
    float saturation = 0.5 * noise_lookup(3.0) + 0.5;
    float value = noise_lookup(4.0);
    vec3 hsv = vec3(hue, saturation, value);
    vec3 color = hsv2rgb(hsv);

    float sector_id = nearest_root(fractal.root);

    vec3 a = color;
    vec3 b = noise_vec3(3.0);
    vec3 c = noise_vec3(6.0);
    vec3 d = noise_vec3(9.0);
    vec3 palette = cosine_palette(sector_id, a, b, c, d);

    float band_mask = noise_lookup(fractal.iterations);

    gl_FragColor = display(palette * fractal.iteration_uv * 4.0);
}
