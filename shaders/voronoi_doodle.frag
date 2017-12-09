import display.frag
import patterns.frag
import tiling.frag
import noise.frag
-- END IMPORTS --

void main() {
    vec2 uv = REGULAR_UV;
    Tiling2D tiles = tile_2d(uv, vec2(4.0));
    float result = select_pattern(tiles.uv, tiles.id);
    gl_FragColor = display(result) * noise_color(4.0);
}
