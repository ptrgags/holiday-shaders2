import display.frag
import signals.frag
import polar.frag
import min_max.frag
import noise.frag
-- END IMPORTS --

/**
 * Draw a circular mask.
 */
float circle(vec2 uv, vec2 center, float radius, float blur) {
    // Make a radial distance field
    float dist = length(uv - center);

    // Use smoothstep to define an inside and outsi
    return smoothstep(radius + blur, radius, dist);
}

#define MASK_UNION max
#define MASK_INTERSECTION min

// This is useful for a simple overlay of layers with a layer mask.
// see overlay_layers for more advanced overlay using the a channel.
#define OVERLAY mix

/**
 * Googly eyes make everything better.
 *
 * This draws a single googly eye centered at eye_pos that always stares in
 * the direction of the mouse.
 *
 * Returns a vec4 containing the eye image. the alpha channel is 1 inside the
 * outline of the eye and 0 outside with a thin gradient between.
 */
vec4 googly_eye(vec2 uv, vec2 mouse_uv, vec2 eye_pos) {
    // Constants =======================================================
    // Size of circles
    const float RADIUS_EYE = 0.12;
    const float RADIUS_PUPIL = 0.07;
    const float RADIUS_OUTLINE = RADIUS_EYE + 0.015;

    // Offset from center of an eye to the center of the pupil
    // in the radial direction
    const float OFFSET_PUPIL = RADIUS_EYE - RADIUS_PUPIL;

    // Use a small number to make nice smooth circle outlines
    const float CIRCLE_BLUR = 0.005;

    // Colors for everything
    vec4 COLOR_OUTLINE = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 COLOR_PUPIL = vec4(0.0, 0.0, 0.0, 1.0);
    vec4 COLOR_EYE = vec4(1.0, 1.0, 1.0, 1.0);

    // ===================================================================
    // Create the three layers of the eye

    // Draw a big circle for the outline of the eye
    float outline_mask = circle(uv, eye_pos, RADIUS_OUTLINE, CIRCLE_BLUR);

    // Draw a slightly smaller circle for the eye
    float eye_mask = circle(uv, eye_pos, RADIUS_EYE, CIRCLE_BLUR);

    // Draw a pupil that gazes at the mouse
    vec2 to_mouse = mouse_uv - eye_pos;
    float mouse_angle = rect_to_polar(to_mouse).y;
    vec2 offset_polar = vec2(OFFSET_PUPIL, mouse_angle);
    vec2 offset = polar_to_rect(offset_polar);
    float pupil_mask = circle(uv, eye_pos + offset, RADIUS_PUPIL, CIRCLE_BLUR);

    // ======================================================================
    // Overlay the layers
    vec4 image = COLOR_OUTLINE;
    image = OVERLAY(image, COLOR_EYE, eye_mask);
    image = OVERLAY(image, COLOR_PUPIL, pupil_mask);

    // Make the background transparent
    image.a = outline_mask;

    return image;
}

/**
 * merge layers a and b with b overlaying a.
 * the alpha channel of b is used as a mask.
 * the resulting alpha channel will be the union of a.
 */
vec4 overlay_layers(vec4 under, vec4 over) {
    vec4 image = OVERLAY(under, over, over.a);
    image.a = MASK_UNION(under.a, over.a);
    return image;
}

/**
 * Mask out the boundaries of a rectangle.
 */
float rectangle_mask(vec2 uv, vec2 origin, vec2 dimensions) {
    vec2 top_right = origin + dimensions;
    vec2 corner1 = step(vec2(0.0), uv - origin);
    vec2 corner2 = step(vec2(0.0), top_right - uv);
    return min_component(corner1) * min_component(corner2);
}

vec2 uv_rect(vec2 uv, vec2 origin, vec2 dimensions) {
    return (uv - origin) / dimensions;
}

float eyebrow(vec2 uv, float eyebrow_type) {
    const float NUM_EYEBROW_TYPES = 8.0;
    const float THICKNESS = 0.2;
    const float BLUR = 0.05;
    int index = int(eyebrow_type * NUM_EYEBROW_TYPES);

    // No eyebrows
    float dist = 1.0;
    if (index == 0) {
        // Flat eyebrows
        dist = abs(uv.y - 0.5);
    } else if (index == 1) {
        // Concerned eyebrows
        dist = abs(uv.y - uv.x);
    } else if (index == 2) {
        // Angry eyebrows
        float func = 1.0 - uv.x;
        dist = abs(uv.y - func);
    } else if (index == 3) {
        // Raised eyebrows
        vec2 shifted = uv - vec2(0.5, 1.0 - THICKNESS);
        float func = -2.0 * (shifted.x * shifted.x);
        dist = abs(shifted.y - func);
    } else if (index == 4) {
        // Neutral eyebrows
        vec2 shifted = uv;
        float func = 0.2 * sqrt(uv.x) + 0.2;
        dist = abs(shifted.y - func);
    } else if (index == 5) {
        // Happy eyebrows
        vec2 shifted = uv - vec2(0.5, 1.0 - THICKNESS);
        float func = - 4.0 * (shifted.x * shifted.x);
        dist = abs(shifted.y - func);
    } else if (index == 6) {
        // Squiggly eyebrows
        float func = -0.2 * sin(TAU * uv.x) + 0.5;
        dist = abs(uv.y - func);
    } else if (index == 7) {
        // Angle eyebrows
        vec2 shifted = uv - vec2(0.5, 1.0 - THICKNESS);
        float func = -abs(shifted.x);
        dist = abs(shifted.y - func);
    }
    return smoothstep(THICKNESS + BLUR, THICKNESS, dist);
}

float mouth(vec2 uv, vec2 dimensions, float mouth_type) {
    const float NUM_MOUTH_TYPES = 8.0;
    const float THICKNESS = 0.1;
    const float BLUR = 0.05;
    int index = int(mouth_type * NUM_MOUTH_TYPES);

    // No mouth
    float dist = 1.0;
    if (index == 0) {
        // neutral mouth
        dist = abs(uv.y - 0.5);
    } else if (index == 1) {
        // Happy Mouth
        vec2 shifted = uv - vec2(0.5, 0.5);
        float func = shifted.x * shifted.x;
        dist = abs(shifted.y - func);
    } else if (index == 2) {
        // Sad mouth
        vec2 shifted = uv - vec2(0.5, 0.5);
        float func = -(shifted.x * shifted.x);
        dist = abs(shifted.y - func);
    } else if (index == 3) {
        // Very happy mouth
        vec2 shifted = uv - vec2(0.5, 0.5);
        float func = 4.0 * (shifted.x * shifted.x);
        dist = abs(shifted.y - func);
    } else if (index == 4) {
        // Confused face
        float func = -0.2 * sin(TAU * uv.x) + 0.5;
        dist = abs(uv.y - func);
    } else if (index == 5) {
        // Displeased face
        float func = 0.4 * uv.x + 0.5;
        dist = abs(uv.y - func);
    } else if (index == 6) {
        // Grin

        // center and scale the origin so the canvas is [-1, 1]
        // in both directions
        vec2 shifted = 2.0 * (uv - 0.5);

        // Top line
        float func1 = 0.5;
        float dist1 = abs(shifted.y - func1);

        // Bottom curve
        float func2 = shifted.x * shifted.x - 0.5;
        float dist2 = abs(shifted.y - func2);

        // Make the union of the two shapes
        dist = min(dist1, dist2);
    } else if (index == 7) {
        // Surprised face
        vec2 center = dimensions / 2.0;
        vec2 centered = (uv * dimensions - center) / dimensions.y;
        float center_dist = length(centered);
        const float RADIUS = 0.35;
        dist = abs(center_dist - RADIUS);
    }
    return smoothstep(THICKNESS + BLUR, THICKNESS, dist);
}

void main() {
    // Constants ==========================================================

    //Position of the two eyes
    const vec2 LEFT_EYE = vec2(0.3, 0.65);
    const vec2 RIGHT_EYE = vec2(0.7, 0.65);

    vec4 color_bg = noise_color(5.0);

    // ====================================================================

    // The usual suspects
    vec2 uv = REGULAR_UV;
    vec2 mouse_uv = REGULAR_MOUSE_UV;

    // Generate the eyes and merge them into one layer
    vec4 left_eye = googly_eye(uv, mouse_uv, LEFT_EYE);
    vec4 right_eye = googly_eye(uv, mouse_uv, RIGHT_EYE);
    vec4 eyes = overlay_layers(left_eye, right_eye);

    const vec2 MOUTH_POS = vec2(0.25, 0.2);
    const vec2 MOUTH_DIMS = vec2(0.5, 0.2);
    float mouth_mask = rectangle_mask(uv, MOUTH_POS, MOUTH_DIMS);
    vec2 mouth_uv = uv_rect(uv, MOUTH_POS, MOUTH_DIMS);
    float mouth = mouth(mouth_uv, MOUTH_DIMS, noise_lookup(10.0));

    const vec2 LEFT_EYEBROW_POS = vec2(0.15, 0.85);
    const vec2 RIGHT_EYEBROW_POS = vec2(0.6, 0.85);
    const vec2 EYEBROW_DIMS = vec2(0.25, 0.1);

    float left_eyebrow_mask = rectangle_mask(uv, LEFT_EYEBROW_POS, EYEBROW_DIMS);
    vec2 left_eyebrow_uv = uv_rect(uv, LEFT_EYEBROW_POS, EYEBROW_DIMS);
    float left_eyebrow = eyebrow(left_eyebrow_uv, noise_lookup(3.0));

    float right_eyebrow_mask = rectangle_mask(uv, RIGHT_EYEBROW_POS, EYEBROW_DIMS);
    vec2 right_eyebrow_uv = uv_rect(uv, RIGHT_EYEBROW_POS, EYEBROW_DIMS);
    right_eyebrow_uv.x = 1.0 - right_eyebrow_uv.x;
    float right_eyebrow = eyebrow(right_eyebrow_uv, noise_lookup(3.0));

    // Construct the layers
    vec4 image = OVERLAY(color_bg, eyes, eyes.a);
    image = OVERLAY(image, vec4(0.0), mouth * mouth_mask);
    image = OVERLAY(image, vec4(0.0), left_eyebrow * left_eyebrow_mask);
    image = OVERLAY(image, vec4(0.0), right_eyebrow * right_eyebrow_mask);

    gl_FragColor = display(image);
}
