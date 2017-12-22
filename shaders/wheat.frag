import display.frag
import tiling.frag
import noise.frag
import signals.frag
import polar.frag
import patterns.frag
import color.frag
-- END IMPORTS --

// Make a pattern that looks like this:
// |||||--
// ||||---
// |||----
// ||-----
// |------
// -------
float wheat(vec2 uv) {
    const float NUM_WHEAT_TILES = 8.0;
    const float LINE_POS = 0.95;
    const float LINE_THICKNESS = 0.12;

    // In order for the wheat pattern to line up correctly we need to shift
    // everything down by half of one of the tiles.
    const vec2 ADJUSTMENT = vec2(0.0, 1.0 / 2.0 / NUM_WHEAT_TILES);

    // Subdivide space into a small grid.
    Tiling2D cells = tile_2d(uv + ADJUSTMENT, vec2(NUM_WHEAT_TILES));
    vec2 grid = smoothstep(LINE_POS, LINE_POS - LINE_THICKNESS, cells.uv);

    // Create a mask for the horizontal lines so each one is shorter
    // than the first and flush right like this:
    //      --
    //     ---
    //    ----
    //   -----
    //  ------
    // -------
    float horizontal_mask = step(cells.coords.y / NUM_WHEAT_TILES, uv.x);

    // Overlay the horizontal lines so it looks like this:
    // |||||--
    // ||||---
    // |||----
    // ||-----
    // |------
    // -------
    float wheat_lines = mix(grid.x, grid.y, horizontal_mask);

    return wheat_lines;

}

/**
 * Make a mask that's lens-shaped as the intersection of two circles.
 *
 * This is no longer used, but may be useful someday.
 */
float lens_mask(vec2 uv) {
    // Now make a mask that's the intersection of two quarter circles
    // at (1, 0) and (0, 1) with radius 1
    const float RADIUS = 1.0;
    const vec2 SOUTHEAST = vec2(1.0, 0.0);
    const vec2 NORTHWEST = vec2(0.0, 1.0);
    const float THICKNESS = 0.01;

    float dist_southeast = distance(uv, SOUTHEAST);
    float lower_circle = smoothstep(RADIUS + THICKNESS, RADIUS, dist_southeast);
    float dist_northwest = distance(uv, NORTHWEST);
    float upper_circle = smoothstep(RADIUS + THICKNESS, RADIUS, dist_northwest);
    float lens_mask = upper_circle * lower_circle;

    return lens_mask;

}

float gamma_mask(vec2 uv, float gamma) {
    const float THICKNESS = 0.02;
    float gamma_upper = pow(uv.x, 1.0 / gamma);
    float upper_mask = smoothstep(gamma_upper + THICKNESS, gamma_upper, uv.y);
    float gamma_lower = pow(uv.x, gamma);
    float lower_mask = smoothstep(gamma_lower - THICKNESS, gamma_lower, uv.y);
    float mask = upper_mask * lower_mask;

    return mask;
}

Tiling2D mirrored_tiles(vec2 uv, vec2 num_tiles) {
    Tiling2D quads = tile_2d(uv, num_tiles);
    vec2 flipped = mod(quads.coords, 2.0);
    quads.uv = mix(quads.uv, 1.0 - quads.uv, flipped);
    return quads;
}


void main() {
    vec2 uv = REGULAR_UV;
    vec2 mouse_uv = REGULAR_MOUSE_UV;

    // Tile space but allow panning with the mouse with a slight
    // parallax effect
    vec2 NUM_TILES = vec2(4.0);
    Tiling2D quads = mirrored_tiles(uv + mouse_uv, NUM_TILES);
    Tiling2D bg_quads = mirrored_tiles(uv + 0.5 * mouse_uv, NUM_TILES);


    // Make the wheat pattern
    float wheat_mask = wheat(quads.uv);

    // Try this again with gamma curves
    const float GAMMA = 2.0;
    float leaf_mask = gamma_mask(quads.uv, GAMMA);

    const vec3 OUTLINE_COLOR = vec3(0.0);
    float leaf_outline_mask = gamma_mask(quads.uv, GAMMA + 0.3);

    // Background color should be dark
    vec3 a = vec3(0.0);
    vec3 b = noise_vec3(2.0);
    vec3 c = noise_vec3(12.0);
    vec3 d = noise_vec3(13.0);
    vec3 bg_color = cosine_palette(noise_lookup(3.0), a, b, c, d);


    float bg_mask = select_pattern(bg_quads.uv, noise_lookup(5.0), 6.0);

    // Foreground color should be lighter
    a = 0.5 + 0.5 * noise_vec3(0.0);
    b = noise_vec3(4.0);
    c = noise_vec3(23.0);
    d = noise_vec3(21.0);
    vec3 leaf_color = cosine_palette(quads.uv.x + quads.uv.y, a, b, c, d);

    vec3 image = bg_mask * bg_color;
    image = mix(image, OUTLINE_COLOR, leaf_outline_mask);
    image = mix(image, leaf_color, leaf_mask * wheat_mask);

    gl_FragColor = display(image);
}
