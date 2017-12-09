import display.frag
import tiling.frag
import min_max.frag
import noise.frag
import hash.frag
-- END IMPORTS --

struct VoronoiCells {
    vec2 center_uv;
    vec2 center_coords;
    float dist_from_border;
};

VoronoiCells voronoi(Tiling2D grid) {
    vec2 nearest_offset;
    vec2 to_nearest;

    // First pass: Get info about our closest neighbor.
    float min_dist = 8.0;
    for (int x = -1; x <= 1; x++) {
        for (int y = -1; y <= 1; y++) {
            // Offset from the current cell
            vec2 offset = vec2(float(x), float(y));

            // Which cell is the neighbor in?
            vec2 neighbor_coords = grid.coords + offset;

            // UV coordinates of the point in the neighbor cell.
            vec2 neighbor_center = offset + hash22(neighbor_coords);

            // vector to neighbor's center relative to our center
            vec2 to_neighbor = neighbor_center - grid.uv;

            // Distance squared to neighbor
            float dist_squared = dot(to_neighbor, to_neighbor);

            // Keep track of minimum
            if (dist_squared < min_dist) {
                min_dist = dist_squared;
                nearest_offset = offset;
                to_nearest = to_neighbor;
            }
        }
    }

    // Pass 2: Distance to borders
    min_dist = 8.0;
    for (int x = -2; x <= 2; x++) {
        for (int y = -2; y <= 2; y++) {
            // This time measure relative to nearest cell
            vec2 offset = nearest_offset + vec2(float(x), float(y));

            // Same as above except the offset is different
            vec2 neighbor_coords = grid.coords + offset;
            vec2 neighbor_center = offset + hash22(neighbor_coords);
            vec2 to_neighbor = neighbor_center - grid.uv;

            // This time, project onto the line between to_nearest
            // and nearest_offset, measuring from the midpoint.
            vec2 midpoint = 0.5 * (to_nearest + to_neighbor);
            vec2 along_line = normalize(to_neighbor - to_nearest);
            float proj_dist = dot(midpoint, along_line);

            min_dist = min(min_dist, proj_dist);
        }
    }

    // Finally, pack up the results and ship out!
    VoronoiCells result;
    result.center_uv = to_nearest;
    result.center_coords = grid.coords + nearest_offset;
    result.dist_from_border = min_dist;
    return result;
}

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
