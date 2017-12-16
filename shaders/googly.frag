import display.frag
import signals.frag
import polar.frag
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

void main() {
    // Constants ==========================================================

    //Position of the two eyes
    const vec2 LEFT_EYE = vec2(0.3, 0.65);
    const vec2 RIGHT_EYE = vec2(0.7, 0.65);

    vec4 COLOR_BG = vec4(0.1, 0.0, 0.2, 1.0);

    // ====================================================================

    // The usual suspects
    vec2 uv = REGULAR_UV;
    vec2 mouse_uv = REGULAR_MOUSE_UV;

    // Generate the eyes and merge them into one layer
    vec4 left_eye = googly_eye(uv, mouse_uv, LEFT_EYE);
    vec4 right_eye = googly_eye(uv, mouse_uv, RIGHT_EYE);
    vec4 eyes = overlay_layers(left_eye, right_eye);

    // Construct the layers
    vec4 image = OVERLAY(COLOR_BG, eyes, eyes.a);

    gl_FragColor = display(image);
}
