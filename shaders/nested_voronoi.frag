import display.frag
import tiling.frag
import min_max.frag
import noise.frag
import hash.frag
import voronoi.frag
-- END IMPORTS --

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.x;
    uv -= noise_vec2(0.0);
    Tiling2D squares = tile_2d(uv, vec2(3.0));

    //vec2 center = hash22(squares.coords);
    /*
    vec2 center = noise_vec2(squares.id);
    float dist = distance(center, squares.uv);
    vec4 dist_color = vec4(0.5, 0.0, 1.0, 1.0) * dist;
    */

    // First order voronoi
    VoronoiCells cells = voronoi(squares);
    float voronoi_border = smoothstep(0.03, 0.025, cells.dist_from_border);

    //TODO: Why do integer tilings turn into noise?
    Tiling2D tiny_squares = tile_2d(cells.center_uv, vec2(2.1));
    VoronoiCells tiny_cells = voronoi(tiny_squares);
    float tiny_borders = smoothstep(0.02, 0.019, tiny_cells.dist_from_border);

    //cells = voronoi(tiny_squares);


    vec4 thick_color = noise_color(2.0);
    vec4 thin_color = noise_color(5.0);

    // Draw a border between cells as an overlay
    float border = step(0.95, max_component(squares.uv));
    vec4 border_color = vec4(1.0, 0.0, 0.0, 1.0);

    vec4 color = mix(thick_color, thin_color, max(tiny_borders, voronoi_border));

    gl_FragColor = display(color);
}
