#define MAX_ITERATIONS 1000.0

struct MJFractal {
    float iterations;
    // Vector from the last two points. This can be used for cosine shading!
    vec2 last_vector;
};

// Every shader that usees this must define an iterated function
vec2 f(vec2 z, vec2 c);
//Returns a constant for the escape radius. Usually 4.0
float escape_radius_squared();

MJFractal mandelbrot_julia(vec2 z, vec2 c, float iterations) {

    MJFractal result;
    result.iterations = 0.0;

    vec2 current_z = z;
    vec2 prev_z = z;

    float escape = escape_radius_squared();

    for (float i = 0.0; i < MAX_ITERATIONS; i++) {
        // Allow controlling the number of iterations programmatically.
        if (i >= iterations)
            break;

        prev_z = current_z;
        current_z = f(current_z, c);

        // If we escaped the circle, return the iteration count
        if (dot(current_z, current_z) > escape) {
            result.iterations = i;
            break;
        }
    }

    result.last_vector = current_z - prev_z;
    return result;
}
