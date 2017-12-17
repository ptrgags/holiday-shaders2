import complex.frag
import display.frag
import noise.frag
import mandelbrot_julia.frag
import signals.frag
import polar.frag
import color.frag
-- END IMPORTS --

vec2 pick_center(float selection) {
    const int NUM_POINTS = 8;
    vec2 POINTS_OF_INTEREST[NUM_POINTS];
    POINTS_OF_INTEREST[0] = vec2(-0.170337, -1.06506); // Tendrils
    POINTS_OF_INTEREST[1] = vec2(-0.761574, -0.0847596); // Spirals
    POINTS_OF_INTEREST[2] = vec2(0.3245046418497685, 0.04855101129280834); //Idk but it looks cool
    POINTS_OF_INTEREST[3] = vec2(-0.925, 0.266); // S-shape
    POINTS_OF_INTEREST[4] = vec2(-0.748, 0.1); // Whirlpool
    POINTS_OF_INTEREST[5] = vec2(-0.16070135, 1.0375665); // Pointy
    POINTS_OF_INTEREST[6] = vec2(0.267235642726, -0.003347589624); // Twisted Border
    POINTS_OF_INTEREST[7] = vec2(0.281717921930775, 0.5771052841488505);
    /*
    POINTS_OF_INTEREST[0] = vec2(-0.75, 0.1); // Seahorse Valley
    POINTS_OF_INTEREST[1] = vec2(-1.75, 0.0); // Mini Mandelbrot
    POINTS_OF_INTEREST[2] = vec2(0.274, 0.482); // Quad-Spiral Valley
    POINTS_OF_INTEREST[3] = vec2(0.275, 0.0); // Elephant Valley
    */

    float scaled = float(NUM_POINTS) * selection;
    int index = int(floor(scaled));

    for (int i = 0; i < NUM_POINTS; i++) {
        if (i == index)
            return POINTS_OF_INTEREST[i];
    }

    // Default to the center of the circle
    return vec2(0.0);
}

vec2 f(vec2 z, vec2 c) {
    return complex_mult(z, z) + c;
}

float escape_radius_squared() {
    return 4.0;
}

void main() {
    mat2 rotation = noise_rotation(5.0);
    vec2 center = pick_center(noise_lookup(7.0));
    //vec2 center = pick_center(0.99);
    float zoom = mix(50.0, 5e5, noise_lookup(16.0));
    //vec4 color = noise_color(4.0);
    //vec4 color2 = noise_color(7.0);

    // Translate, rotate, and zoom
    // TODO: Fix this
    vec2 uv = rotation * (gl_FragCoord.xy - CENTER) / zoom + center;

    MJFractal fractal = mandelbrot_julia(vec2(0.0), uv, 500.0);

    vec3 a = noise_vec3(1.0);
    vec3 b = noise_vec3(6.0);
    vec3 c = noise_vec3(12.0);
    vec3 d = noise_vec3(17.0);
    vec3 color = cosine_palette(fractal.iterations - floor(2.0 * time), a, b, c, d);

    float angle = rect_to_polar(fractal.last_vector).y;
    float cosine_mask = cos(angle);

    float hash_mask = noise_lookup(fractal.iterations - 2.0 * time);

    gl_FragColor = display(hash_mask * cosine_mask * color);
}
