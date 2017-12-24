import display.frag
import trig.frag
import signals.frag
import polar.frag
import patterns.frag
import tiling.frag
import noise.frag
import hash.frag
import voronoi.frag
import color.frag
-- END IMPORTS --

void main() {
    vec2 uv = REGULAR_UV;

    // Create a voronoi diagram
    const float NUM_TILES = 4.0;
    Tiling2D tiles = tile_2d(uv, vec2(NUM_TILES));
    VoronoiCells cells = voronoi(tiles);
    float cell_id = cells.center_coords.y * NUM_TILES + cells.center_coords.x;

    float border = step(0.2, cells.dist_from_border);

    // Global UV space centered on the center of the current cell
    vec2 center_uv = uv - cells.center_global_uv;

    float pattern_select = noise_lookup(cell_id);
    float result = select_pattern(center_uv, pattern_select, 8.0);

    vec3 a = noise_vec3(14.0);
    vec3 b = noise_vec3(18.0);
    vec3 c = noise_vec3(19.0);
    vec3 d = noise_vec3(20.0);
    vec3 color1 = cosine_palette(0.25, a, b, c, d);
    vec3 color2 = cosine_palette(0.75, a, b, c, d);
    float color_select = step(0.5, hash21(cells.center_coords));
    vec3 color = mix(color1, color2, color_select);

    gl_FragColor = display(result * border * color);
}
