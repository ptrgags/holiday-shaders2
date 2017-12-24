import display.frag
import tiling.frag
import signals.frag
import polar.frag
import patterns.frag
import noise.frag
import color.frag
-- END IMPORTS --

void main() {
    vec2 uv = CENTERED_UV;
    vec2 polar = rect_to_polar(uv);
    //polar = polar_rotate(polar, 0.1 * polar.x * sin(time));

    Tiling2D cells = tile_2d(polar, vec2(10.0, 16.0));
    cells.uv = polar_rotate(cells.uv, cells.coords.x * sin(0.5 * time));

    float ring = cells.coords.x / 10.0;
    float inv_ring = (10.0 - cells.coords.x) / 10.0;

    vec3 a = noise_vec3(1.0);
    vec3 b = noise_vec3(7.0);
    vec3 c = noise_vec3(30.0);
    vec3 d = noise_vec3(25.0);
    vec3 color1 = inv_ring * cosine_palette(cells.uv.r, a, b, c, d);
    vec3 color2 = 0.5 * color1;

    float pat_select = fract(ring + noise_lookup(17.0));
    float pattern = select_pattern(cells.uv, pat_select, 3.0);

    vec3 color = mix(color2, color1, pattern);

    gl_FragColor = display(color);
}
