import display.frag
import tiling.frag
-- END IMPORTS --

void main() {
    vec2 uv = (gl_FragCoord.xy) / resolution.x;

    // Tile space
    const vec2 NUM_TILES = vec2(4.0);
    Tiling2D quads = tile_2d(uv, NUM_TILES);
    vec2 flipped = mod(quads.coords, 2.0);
    quads.uv = mix(quads.uv, 1.0 - quads.uv, flipped);

    // Draw a wheat pattern
    const vec2 NUM_WHEAT_TILES = vec2(8.0);
    Tiling2D cells = tile_2d(quads.uv, NUM_WHEAT_TILES);

    // Draw horizontal lines and vertical lines separately.
    float vertical_lines = smoothstep(0.95, 0.8, cells.uv.x);
    float horizontal_lines = smoothstep(0.95, 0.8, cells.uv.y);

    // Create a mask for the horizontal lines so each one is shorter
    // than the first and flush right like this:
    //      --
    //     ---
    //    ----
    //   -----
    //  ------
    // -------
    float horizontal_mask = step(cells.coords.y / NUM_WHEAT_TILES.y, quads.uv.x);

    // Overlay the horizontal lines so it looks like this:
    // |||||--
    // ||||---
    // |||----
    // ||-----
    // |------
    // -------
    float wheat_lines = mix(vertical_lines, horizontal_lines, horizontal_mask);

    // Now make a mask that's the intersection of two quarter circles
    // at (1, 0) and (0, 1) with radius 1
    const float RADIUS = 1.0;
    float dist_southeast = distance(quads.uv, vec2(1.0, 0.0));
    float lower_circle = smoothstep(RADIUS + 0.01, RADIUS, dist_southeast);
    float dist_northwest = distance(quads.uv, vec2(0.0, 1.0));
    float upper_circle = smoothstep(RADIUS + 0.01, RADIUS, dist_northwest);
    float wheat_circle_mask = upper_circle * lower_circle;

    // Try this again with gamma curves
    const float ALPHA = 2.0;
    float gamma_upper = pow(quads.uv.x, 1.0 / ALPHA);
    float upper_mask = smoothstep(gamma_upper + 0.01, gamma_upper, quads.uv.y);
    float gamma_lower = pow(quads.uv.x, ALPHA);
    float lower_mask = smoothstep(gamma_lower - 0.01, gamma_lower, quads.uv.y);
    float wheat_gamma_mask = upper_mask * lower_mask;


    gl_FragColor = display(wheat_gamma_mask * wheat_lines);
}
