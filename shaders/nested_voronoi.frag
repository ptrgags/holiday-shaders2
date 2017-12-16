import display.frag
import tiling.frag
import min_max.frag
import noise.frag
import hash.frag
import voronoi.frag
-- END IMPORTS --

void main() {
    vec2 uv = REGULAR_UV;
    uv -= noise_vec2(0.0);
    Tiling2D squares = tile_2d(uv, vec2(3.0));

    // First order voronoi
    VoronoiCells cells = voronoi(squares);
    float voronoi_border = smoothstep(0.21, 0.20, cells.dist_from_border);

    vec2 cell_uv = uv - cells.center_global_uv;
    Tiling2D tiny_squares = tile_2d(cells.center_uv, vec2(10.0));
    VoronoiCells tiny_cells = voronoi(tiny_squares);
    float tiny_borders = smoothstep(0.21, 0.20, tiny_cells.dist_from_border);

    vec4 thick_color = noise_color(2.0);
    vec4 thin_color = noise_color(5.0);

    vec4 color = mix(thick_color, thin_color, max(tiny_borders, voronoi_border));

    gl_FragColor = display(color);
}
