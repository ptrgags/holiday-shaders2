import display.frag
import tiling.frag
import signals.frag
import polar.frag
import patterns.frag
import min_max.frag
-- END IMPORTS --
void main() {
    vec2 uv = REGULAR_UV;
    vec2 mouse_uv = REGULAR_MOUSE_UV;

    float mouse_dist = length(mouse_uv - uv);
    float light_mask = smoothstep(0.8, 0.4, mouse_dist);

    Tiling1D horizontal_lines = tile_1d(uv.y, 20.0);
    float horizontal_mask = 1.0 - step(0.1, horizontal_lines.uv);

    float vert_line1 = float(abs(uv.x - 0.15) < 0.003);
    float vert_line2 = float(abs(uv.x - 0.18) < 0.003);
    float vertical_mask = max(vert_line1, vert_line2);

    const vec4 hor_color = vec4(0.3, 0.3, 1.0, 1.0);
    const vec4 ver_color = vec4(1.0, 0.3, 0.3, 1.0);
    const vec4 back_color = vec4(1.0, 1.0, 0.3, 1.0);
    const vec4 light_color = vec4(0.3, 0.0, 1.0, 1.0);
    const vec4 ink_color = vec4(0.5, 1.0, 1.0, 1.0);

    // Background
    vec4 image = back_color;

    // Add the red and blue lines
    image = mix(image, ver_color, vertical_mask);
    image = mix(image, hor_color, horizontal_mask);

    // Let there be light!
    vec4 lit_color = mix(image, light_color, 0.75);
    image = mix(image, lit_color, light_mask);

    // Pick some random patterns to display in invisible ink
    Tiling2D squares = tile_2d(uv, vec2(5.0));
    float pattern = select_pattern(squares.uv, noise_lookup(squares.id), 8.0);
    vec2 odd_even = mod(squares.coords, 2.0);
    float pattern_mask = 1.0 - max_component(odd_even);
    float ink_mask = pattern * pattern_mask * light_mask;
    image = mix(image, ink_color, ink_mask);

    gl_FragColor = display(image);
}
