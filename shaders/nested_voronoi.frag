import display.frag
import tiling.frag
import min_max.frag
import noise.frag
import hash.frag
import voronoi.frag
import color.frag
-- END IMPORTS --

void main() {
    vec2 uv = REGULAR_UV;
    uv -= noise_vec2(0.0);
    Tiling2D squares = tile_2d(uv, vec2(3.0));

    // First order voronoi
    VoronoiCells cells = voronoi(squares);
    float voronoi_border = smoothstep(0.21, 0.20, cells.dist_from_border);

    vec2 cell_uv = uv - cells.center_global_uv;
    Tiling2D tiny_squares = tile_2d(cells.center_uv, vec2(8.0));
    VoronoiCells tiny_cells = voronoi(tiny_squares);
    float tiny_borders = smoothstep(0.21, 0.20, tiny_cells.dist_from_border);

    vec3 a = 0.5 + 0.5 * noise_vec3(9.0);
    vec3 b = noise_vec3(19.0);
    vec3 c = noise_vec3(30.0);
    vec3 d = vec3(0.0, 1.0 / 3.0, 2.0 / 3.0);

    vec3 line_color = vec3(0.0);
    vec3 color1 = cosine_palette(0.0, a, b, c, d);
    vec3 color2 = cosine_palette(0.25, a, b, c, d);
    vec3 color3 = cosine_palette(0.5, a, b, c, d);
    vec3 color4 = cosine_palette(0.75, a, b, c, d);
    float color_select = step(0.5, hash21(tiny_cells.center_coords));

    vec3 palette1 = mix(color1, color3, color_select);
    vec3 palette2 = mix(color2, color4, color_select);
    float palette_select = step(0.5, hash21(cells.center_coords));
    vec3 palette = mix(palette1, palette2, palette_select);

    vec3 image = palette;
    image = mix(image, line_color, tiny_borders);
    image = mix(image, line_color, voronoi_border);

    gl_FragColor = display(image);
}
