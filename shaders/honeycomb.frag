import display.frag
import trig.frag
-- END IMPORTS --

void main() {
    // Centered coordinates
    vec2 uv = (gl_FragCoord.xy - CENTER) / resolution.y;

    // Zoom out
    uv *= 4.0;

    // compensate for the hexagon transformation
    uv.x *= csc(PI / 3.0);

    // Shift every other column of cells up like bricks in a wall
    vec2 coords = floor(uv);
    float y_offset = 0.5 * mod(coords.x, 2.0);
    uv.y += y_offset;
    vec2 cell_uv = fract(uv);

    vec2 dist_from_center = abs(cell_uv - 0.5);

    // TODO: How does this work?
    float metric1 = dist_from_center.x * 1.5 + dist_from_center.y;
    float metric2 = dist_from_center.y * 2.0;
    float metric = max(metric1, metric2);

    float from_sides = abs(metric - 1.0);
    float from_center = 1.0 - from_sides;

    float outline = smoothstep(0.9, 0.91, from_center);

    gl_FragColor = display(outline);
}
