/**
 * This is a list of a bunch of reusable binary patterns that return
 * either 0.0 or 1.0. There are also functions to select the patterns.
 *
 * Required imports:
 * polar.frag
 */

#define TOTAL_PATTERNS 16.0
/**
 * Return horizontal stripes like this:
 *
 * 111111111
 * 000000000
 * 111111111
 * 000000000
 */
float stripes(vec2 uv, float num_stripes) {
    float y = uv.y * num_stripes;
    float stripe_id = floor(y);
    return mod(stripe_id, 2.0);
}

/**
 * Return circular waves out from the bottom-left corner
 */
float waves(vec2 uv, float num_waves) {
    float r = length(uv) * num_waves;
    float wave_id =  floor(r);
    return mod(wave_id, 2.0);
}

/**
 * Return a checkerboard pattern.
 */
 float checkered(vec2 uv, float scale) {
     vec2 scaled = uv * scale;
     vec2 cell_coords = floor(scaled);
     float id = cell_coords.x + cell_coords.y;
     return mod(id, 2.0);
 }

/**
 * Make a bunch of rectangles of random heights.
 */
float rand_signal(vec2 uv, float num_bins) {
     float x = uv.x * num_bins;
     float bin_id = floor(x);
     float height = noise_lookup(bin_id);
     return step(height, uv.y);
 }

/**
 * Draw chevron shapes that look like corners of a square
 */
float corners(vec2 uv, float scale) {
    vec2 scaled = uv * scale;
    vec2 cell_uv = fract(scaled);
    float max_coord = max(cell_uv.x, cell_uv.y);
    float big_square = 1.0 - step(0.85, max_coord);
    float small_square = 1.0 - step(0.7, max_coord);
    return big_square - small_square;
}

/**
 * like ocean/curves but with a triangle wave
 */
float zigzag(vec2 uv, float num_curves) {
    float y = uv.y * num_curves;
    y += abs(mod(8.0 * uv.x, 2.0) - 1.0);
    float curve_id = floor(y);
    return mod(curve_id, 2.0);
}

/**
 * Make a brick wall texture
 */
float bricks(vec2 uv, float scale) {
    vec2 scaled = uv * vec2(scale, scale * 2.0);
    vec2 cell_id = floor(scaled);
    float shift = 0.5 * mod(cell_id.y, 2.0);
    scaled.x += shift;
    vec2 cell_uv = fract(scaled);
    vec2 border = step(vec2(0.1, 0.2), cell_uv);
    return min(border.x, border.y);
}

/**
 * Make some parallel curves
 */
float curves(vec2 uv, float num_curves) {
    float y = uv.y * num_curves;
    y += smoothstep(0.0, 1.0, uv.x);
    float curve_id = floor(y);
    return mod(curve_id, 2.0);
}

/**
 * Beasically the same thing as curves, just with sine waves
 */
float ocean(vec2 uv, float num_curves) {
     float y = uv.y * num_curves;
     y += sin(4.0 * TAU * uv.x);
     float curve_id = floor(y);
     return mod(curve_id, 2.0);
}

/**
 * Select on/off for each cell in a grid
 */
float digital(vec2 uv, float scale) {
    vec2 cell_coords = floor(uv * scale);
    float cell_id1 = cell_coords.x + cell_coords.y;
    float cell_id2 = cell_coords.y * scale + cell_coords.x;
    float val = noise_lookup(cell_id1 + cell_id2);
    return step(0.5, val);
}

/**
 * Kinda like ocean/curves but with space distorted more
 */
float curvilinear(vec2 uv, float spacing) {
    uv.x *= uv.y;
    uv.y += smoothstep(0.0, 1.0, uv.x) + sin(3.0 * uv.x);
    float curve_id = floor(spacing * uv.y);
    return mod(curve_id, 2.0);
}

/**
 * Interference between two sine waves, one at (0, 0), one at (1, 1)
 */
float interference(vec2 uv, float freq) {
    // This needs to be a larger number than
    float scaled_freq = 10.0 * freq;
    float dist1 = length(uv);
    float dist2 = length(1.0 - uv);
    float wave1 = sin(dist1 * scaled_freq);
    float wave2 = sin(dist2 * scaled_freq);
    float superposition = wave1 + wave2;
    return step(0.0, superposition);
}

/**
 * Make a bunch of horizontal spikes
 * pointing to the left.
 */
float spikes(vec2 uv, float num_spikes) {
    float y = uv.y * num_spikes;
    float y_uv = fract(y);
    float thickness = 0.5 * uv.x;
    float dist_center = abs(y_uv - 0.5);
    return float(dist_center < thickness);
}

/**
 * two sets of stripes in different directions
 */
float cross_hatch(vec2 uv, float spacing) {
    const vec2 dir1 = normalize(vec2(2.0, 1.0));
    const vec2 dir2 = normalize(vec2(1.0, 3.0));
    float scaled_spacing = 4.0 * spacing;

    // Scalar projection in two directions
    float p1 = dot(uv, dir1);
    float p2 = dot(uv, dir2);

    // Turn into a vector so we can do simultaneous calculations
    vec2 p = vec2(p1, p2);

    //Make thin stripes
    vec2 cell_uv = fract(p * scaled_spacing);
    vec2 cell_coords = floor(p * scaled_spacing);
    float line_thickness = abs(cell_coords.x) / scaled_spacing;
    vec2 thin_lines = 1.0 - step(line_thickness, cell_uv);

    // Union the lines but make them dark
    return 1.0 - max(thin_lines.x, thin_lines.y);
}

/**
 * Make a tiling of circles
 */
float circles(vec2 uv, float scale) {
    vec2 cell_uv = fract(scale * uv);
    vec2 centered = cell_uv - 0.5;
    return 1.0 - step(0.4, length(centered));
}

/**
 * Design on a polar grid
 */
float spokes(vec2 uv, float scale) {
    vec2 centered = uv - 0.5;
    vec2 polar = rect_to_polar(centered);
    vec2 cell_coords = floor(scale * polar);
    vec2 odd_even = mod(cell_coords, 2.0);
    return min(odd_even.x, odd_even.y);
}

float select_pattern(vec2 uv, float select, float parameter) {
    int index = int(select * TOTAL_PATTERNS);
    if (index == 0) {
        // TODO: Select via noise buffer
        return stripes(uv, parameter);
    } else if (index == 1) {
        return waves(uv, parameter);
    } else if (index == 2) {
        return checkered(uv, parameter);
    } else if (index == 3) {
        return rand_signal(uv, parameter);
    } else if (index == 4) {
        return corners(uv, parameter);
    } else if (index == 5) {
        return zigzag(uv, parameter);
    } else if (index == 6) {
        return bricks(uv, parameter);
    } else if (index == 7) {
        return curves(uv, parameter);
    } else if (index == 8) {
        return ocean(uv, parameter);
    } else if (index == 9) {
        return digital(uv, parameter);
    } else if (index == 10) {
        return curvilinear(uv, parameter);
    } else if (index == 11) {
        return interference(uv, parameter);
    } else if (index == 12) {
        return spikes(uv, parameter);
    } else if (index == 13) {
        return cross_hatch(uv, parameter);
    } else if (index == 14) {
        return circles(uv, parameter);
    } else if (index == 15) {
        return spokes(uv, parameter);
    } else {
        return 0.5;
    }
}
