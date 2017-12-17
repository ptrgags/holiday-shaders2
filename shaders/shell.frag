import signals.frag
import polar.frag
import tiling.frag
import display.frag
import color.frag
import noise.frag
-- END IMPORTS --

void main() {
    vec2 uv = CENTERED_UV;

    vec2 polar = rect_to_polar(uv);
    float angle = polar.y;
    polar.y += sin(time) * polar.x;

    float num_sections = 6.0 + 2.0 * floor(noise_lookup(3.0) * 10.0);

    Tiling2D cells = tile_2d(polar, vec2(6.0, num_sections));

    float is_flipped = mod(cells.coords.y, 2.0);
    cells.uv.y = mix(cells.uv.y, 1.0 - cells.uv.y, is_flipped);

    float major_lines = smoothstep(0.3, 0.2, num_sections * cells.uv.x * cells.uv.y);


    float divisions = 1.0 + floor(noise_lookup(8.0) * 5.0);

    float sweep = divisions * mod(angle - 0.5 * time, 1.0 / divisions);

    vec3 a = noise_vec3(4.0);
    vec3 b = noise_vec3(5.0);
    vec3 c = noise_vec3(6.0);
    vec3 d = noise_vec3(7.0);
    vec3 color = cosine_palette(polar.x, a, b, c, d);

    gl_FragColor = display(color * major_lines * sweep);
}
