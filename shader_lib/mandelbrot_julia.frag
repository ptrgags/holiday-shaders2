#define NUM_ITERATIONS 500.0

float mandelbrot_julia(vec2 z_in, vec2 c) {
    vec2 z = z_in;
    for (float i = 0.0; i < NUM_ITERATIONS; i++) {
        vec2 z_next = complex_mult(z, z) + c;

        // If we escaped the circle, return the iteration count
        if (dot(z_next, z_next) > 4.0)
            return i;

        z = z_next;
    }
    return 0.0;
}
