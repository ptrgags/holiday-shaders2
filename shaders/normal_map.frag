import tiling.frag
import noise.frag
import display.frag
import trig.frag
import min_max.frag
-- END IMPORTS --

vec3 cylindrical_to_cartesian(vec3 cyl) {
    // Unpack the cylindrical coords for clarity
    float r = cyl.x;
    float theta = cyl.y;
    float z = cyl.z;

    // Convert x and y from polar -> cartesian. Z stays the same.
    float x = r * cos(theta);
    float y = r * sin(theta);

    return vec3(x, y, z);
}


/**
 * Rotate the y-axis clockwise so it makes a 60 degree angle
 * with the x-axis. This warps every unit square into a rhombus shape
 */
mat2 rhombus() {
    return mat2(
        1.0, 0.0,
        //TODO: Why the -csc?
        cot(-PI / 3.0), -csc(-PI / 3.0)
    );
}

void main() {
    vec2 uv = REGULAR_UV;
    vec2 mouse_uv = REGULAR_MOUSE_UV;

    // Warp space so it is a tesselation of rhombi
    vec2 warped = rhombus() * uv;
    Tiling2D rhombi = tile_2d(warped, vec2(6.0));

    //Divide each rhombus into two simplices
    // (one in the SW corner, the other NE)
    // The NE simplex is inverted so (0, 0) is in the far corner.
    float flipped = float(rhombi.uv.y > 1.0 - rhombi.uv.x);
    // Select between normal and inverted
    vec2 simplex = mix(rhombi.uv, 1.0 - rhombi.uv, flipped);

    // Convert to barycentric coordinates (x + y + z = 1)
    // x is the bottom right corner
    // y is the top corner
    // z is the bottom left corner
    // for the right-side-up triangle. The other one is flipped
    // upside down and backwards.
    vec3 bary = vec3(simplex, 1.0 - simplex.x - simplex.y);

    // Divide the triangle into three where the dividing lines
    // are from the center to each vertex.
    //
    // This is a vector where exactly one component is 1.
    vec3 tri_id = vec3(
        // Top right triangle
        min_component(bary) == bary.z,
        // Top left triangle
        min_component(bary) == bary.x,
        // bottom triangle
        min_component(bary) == bary.y
    );

    // The numbering of the 6 triangles in the rhombus
    // look atmittedly weird. However, this makes it easy to
    // map to multiples of 60 degrees when calculating normals.
    // Bear with me please :)
    vec3 regular_indices = vec3(0.0, 2.0, 4.0);
    vec3 flipped_indices = vec3(3.0, 5.0, 1.0);
    //Select which vector to use
    vec3 indices = mix(regular_indices, flipped_indices, flipped);

    //Select which index matches this triangle.
    float index = dot(tri_id, indices);

    // The indices were chosen such that 0 is 30 degrees, 1 is 90 degrees
    // and so on!
    float theta = (PI / 3.0) * index + (PI / 6.0);

    // Calculate the normal vector
    vec3 cylindrical = vec3(1.0, theta, -1.0);
    vec3 cartesian = cylindrical_to_cartesian(cylindrical);
    vec3 normal = normalize(cartesian);

    // Pick a color. any color.
    vec4 color_regular = noise_color(5.0);
    vec4 color_flipped = noise_color(6.0);
    vec4 color = mix(color_regular, color_flipped, flipped);

    // Vector from pixel to light (the mouse position at z = -1)
    vec3 light = vec3(mouse_uv - uv, -1.0);
    light = normalize(light);

    // Calculate the light falloff. Just make a blurry circle
    float dist_from_light = length(uv - mouse_uv);
    float falloff = smoothstep(0.7, 0.1, dist_from_light);

    // Calculate diffuse lighting
    float diffuse = falloff * dot(light, normal);

    gl_FragColor = diffuse * color;
}
