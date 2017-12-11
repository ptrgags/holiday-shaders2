struct VoronoiCells {
    vec2 center_uv;
    vec2 center_coords;
    vec2 center_global_uv;
    float dist_from_border;
};

VoronoiCells voronoi(Tiling2D grid) {
    vec2 nearest_offset;
    vec2 to_nearest;
    vec2 neighbor_global_uv;

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
    //result.center_uv = to_nearest;
    result.center_uv = -to_nearest / grid.num_tiles;
    result.center_coords = grid.coords + nearest_offset;
    result.center_global_uv = result.center_coords + hash22(result.center_coords);
    result.center_global_uv /= grid.num_tiles;
    result.dist_from_border = sqrt(min_dist);
    return result;
}
