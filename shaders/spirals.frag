import signals.frag
import polar.frag
import noise.frag
import tiling.frag
import color.frag
import display.frag
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
    vec2 uv = CENTERED_UV;
    vec2 mouse_uv = REGULAR_MOUSE_UV;

    // Tile space
    Tiling2D squares = tile_2d(uv, vec2(4.0));

    vec2 polar = rect_to_polar(squares.uv - 0.5);

    polar = polar_rotate(polar, noise_lookup(15.0, squares.id) + mouse_uv.x);

    float a_noise = noise_lookup(1.0, squares.id);
    float b_noise = noise_lookup(2.0, squares.id);
    float thickness = noise_lookup(20.0);
    float line = log_spiral(polar, a_noise, b_noise, thickness);

    Tiling1D tiling = tile_1d(polar.y, 6.0);
    float color_select = mod(tiling.id, 2.0);

    vec3 a = noise_vec3(4.0);
    vec3 b = noise_vec3(8.0);
    vec3 c = noise_vec3(9.0);
    vec3 d = noise_vec3(10.0);
    vec3 color1 = cosine_palette(0.2, a, b, c, d);
    vec3 color2 = cosine_palette(0.4, a, b, c, d);
    vec3 color3 = cosine_palette(0.6, a, b, c, d);
    vec3 color4 = cosine_palette(0.8, a, b, c, d);

    vec3 palette_a = mix(color1, color2, color_select);
    vec3 palette_b = mix(color3, color4, color_select);
    float palette_select = step(0.5, noise_lookup(squares.id));
    vec3 color = mix(palette_a, palette_b, palette_select);

    gl_FragColor = display(line * color);
}
