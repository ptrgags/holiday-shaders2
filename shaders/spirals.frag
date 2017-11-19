import signals.frag
import polar.frag
import noise.frag
import tiling.frag
-- END IMPORTS --


float plot(float y, float func, float thickness) {
    return smoothstep(func - thickness, func, y)
        - smoothstep(func, func + thickness, y);
}

/**
 * Make the spiral r = a * e^(b * theta)
 */
float log_spiral(
        vec2 polar, float a_noise, float b_noise, float thickness_noise) {
    const int MIN_ROTATIONS = -20;
    const int MAX_ROTATIONS = 10;
    const float MIN_A = 0.1;
    const float MAX_A = 0.5;
    const float MIN_B = 0.1;
    const float MAX_B = 0.5;
    const float MIN_THICKNESS = 0.005;
    const float MAX_THICKNESS = 0.05;

    float a = mix(MIN_A, MAX_A, a_noise);
    float b = mix(MIN_B, MAX_B, b_noise);
    float thickness = mix(MIN_THICKNESS, MAX_THICKNESS, thickness_noise);

    float line = 0.0;
    for (int i = MIN_ROTATIONS; i < MAX_ROTATIONS; i++) {
        float theta = polar.y + float(i);
        float spiral_arm = a * exp(b * theta);
        float new_line = plot(polar.x, spiral_arm, thickness);
        line = max(line, new_line);
    }
    return line;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - CENTER) / resolution.x;

    // Tile space
    Tiling2D squares = tile_2d(uv, vec2(4.0));

    vec2 polar = rect_to_polar(squares.uv - 0.5);

    polar = polar_rotate(polar, noise_lookup(15.0, squares.id));

    float a = noise_lookup(1.0, squares.id);
    float b = noise_lookup(2.0, squares.id);
    float thickness = noise_lookup(20.0);
    float line = log_spiral(polar, a, b, thickness);

    Tiling1D tiling = tile_1d(polar.y, 6.0);
    float color_select = mod(tiling.id, 2.0);
    vec4 color1 = noise_color(squares.id);
    vec4 color2 = noise_color(squares.id + 3.0);
    vec4 color = mix(color1, color2, color_select);

    gl_FragColor = line * color;
}
