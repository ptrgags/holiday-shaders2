import display.frag
import tiling.frag
import min_max.frag
import noise.frag
-- END IMPORTS --

/**
 * Hash vec2 -> float
 * Borrowed from https://thebookofshaders.com/11/
 */
float hash21(vec2 uv) {
    return fract(sin(dot(uv, vec2(12.9898,78.233))) * 43758.5453123);
}

/**
 * Hash vec2 -> vec2
 * Modified from https://www.shadertoy.com/view/ldl3W8 by the great
 * Inigo Quilez
 */
vec2 hash22(vec2 uv) {
    // Project UV in two different directions that are close to prime numbers
    float dot1 = dot(uv, vec2(127.1,311.7));
    float dot2 = dot(uv, vec2(269.5, 183.3));

    // Store in a vec2
    vec2 dots = vec2(dot1, dot2);

    // Scramble the vector
    return fract(sin(dots) * 43758.5453);
}


/*
struct VoronoiCells {
    float dist_to_border;
}

VoronoiCells voronoi(Tiling2D grid) {
    vec2 nearest_neighbor_coords;
    vec2 nearest_neighbor_distance;

    float min_distance = 8.0;
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            vec2 neighbor_coords = vec2(float(x), float(y));
            vec2 neighbor_center =
        }
    }
}
*/

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.x;
    Tiling2D squares = tile_2d(uv, vec2(8.0));

    //vec2 center = hash22(squares.coords);
    vec2 center = noise_vec2(squares.id);
    float dist = distance(center, squares.uv);
    vec4 dist_color = vec4(0.5, 0.0, 1.0, 1.0) * dist;

    // Draw a border between cells as an overlay
    float border = step(0.95, max_component(squares.uv));
    vec4 border_color = vec4(1.0, 0.0, 0.0, 1.0);

    vec4 color = mix(dist_color, border_color, border);

    gl_FragColor = display(color);
}
