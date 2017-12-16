/**
 * Information about the Newton fractal useful for coloring.
 */
struct NewtonFractal {
    // Number of iterations it takes to reach the root.
    float iterations;
    // vector between the next to last -> last points in
    // the iteration. This can be used for cool cosine coloring
    vec2 last_vector;
};

// The shader implementation must define a function and its derivative
vec2 f(vec2 x);
vec2 diff_f(vec2 x);

/**
 * Perform the Newton's Method iteration on functions
 */
NewtonFractal newtons_method(vec2 z) {
    const int MAX_ITERATIONS = 256;
    // This tolerance is used to figure out the end
    const float TOLERANCE = 0.001;

    NewtonFractal result;
    result.iterations = float(MAX_ITERATIONS);

    // Keep track of the last two points. At the end we need to calculate
    // the angle between these two points
    vec2 current_z = z;
    vec2 prev_z = z;

    for (int i = 0; i < MAX_ITERATIONS; i++) {
        //Perform one round of Newton's method

        // Calculate f(z) and f'(z). The function will be defined
        // in the impplementation part of the shader.
        vec2 val = f(current_z);
        vec2 derivative = diff_f(current_z);

        // Slide the window forward in time
        prev_z = current_z;
        current_z = current_z - complex_div(val, derivative);

        if (distance(prev_z, current_z) < TOLERANCE) {
            result.iterations = float(i);
            break;
        }
    }

    // Calculate the angle between the last two points for cosine shading
    result.last_vector = current_z - prev_z;
    return result;
}
