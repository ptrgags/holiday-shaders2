import display.frag
import trig.frag
import signals.frag
import polar.frag
import patterns.frag
import tiling.frag
import noise.frag
import hash.frag
import voronoi.frag
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

    gl_FragColor = display(result * border) * noise_color(4.0);
}
