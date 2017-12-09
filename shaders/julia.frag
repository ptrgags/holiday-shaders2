import complex.frag
import display.frag
import noise.frag
import mandelbrot_julia.frag
-- END IMPORTS --

vec2 pick_c(float selection) {
    const int NUM_POINTS = 2;
    vec2 POINTS_OF_INTEREST[NUM_POINTS];
    POINTS_OF_INTEREST[0] = vec2(-0.4, 0.6);
    POINTS_OF_INTEREST[1] = vec2(-0.285, -0.01);
    /*
    POINTS_OF_INTEREST[2] = vec2(0.3245046418497685, 0.04855101129280834); //Idk but it looks cool
    POINTS_OF_INTEREST[3] = vec2(-0.925, 0.266); // S-shape
    POINTS_OF_INTEREST[4] = vec2(-0.748, 0.1); // Whirlpool
    POINTS_OF_INTEREST[5] = vec2(-0.16070135, 1.0375665); // Pointy
    POINTS_OF_INTEREST[6] = vec2(0.267235642726, -0.003347589624); // Twisted Border
    POINTS_OF_INTEREST[7] = vec2(0.281717921930775, 0.5771052841488505);
    */

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

void main() {
    mat2 rotation = noise_rotation(1.0);

    vec2 wave = noise_lookup(1.0) * sin(0.5 * noise_vec2(2.0) * time - noise_vec2(4.0));
    wave += 0.5 * noise_lookup(5.0) * sin(noise_vec2(6.0) * time - noise_vec2(8.0));

    vec2 c = noise_vec2(2.0) + wave;



    //float zoom = mix(50.0, 5e5, noise_lookup(3.0));
    vec4 color = noise_color(8.0);
    vec4 color2 = noise_color(9.0);

    // Translate, rotate, and zoom
    //vec2 uv = rotation * (gl_FragCoord.xy - CENTER) / zoom + center;
    vec2 uv = rotation * (gl_FragCoord.xy - CENTER) / 300.0;

    const float num_iterations = 500.0;
    float iterations = mandelbrot_julia(uv, c, num_iterations);

    vec4 hash_coloring = noise_lookup(iterations) *  color;
    vec4 iteration_coloring = 2.0 * iterations / MAX_ITERATIONS * color2;
    float mix_factor = noise_lookup(4.0);

    gl_FragColor = mix(hash_coloring , iteration_coloring, mix_factor);
}
