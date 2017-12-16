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
#define OVERLAY mix

void main() {
    // Constants ==========================================================

    //Position of the two eyes
    const vec2 LEFT_EYE = vec2(0.3, 0.65);
    const vec2 RIGHT_EYE = vec2(0.7, 0.65);

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
    vec4 COLOR_BG = vec4(0.1, 0.0, 0.2, 1.0);
    vec4 COLOR_LINES = vec4(0.0);
    vec4 COLOR_PUPIL = vec4(0.0);
    vec4 COLOR_EYE = vec4(1.0);

    // ====================================================================

    // The usual suspects
    vec2 uv = REGULAR_UV;
    vec2 mouse_uv = REGULAR_MOUSE_UV;

    // Calculate distances from each eye to the mouse
    vec2 from_left = mouse_uv - LEFT_EYE;
    vec2 from_right = mouse_uv - RIGHT_EYE;

    // Calculate the gaze angles of the two eyes
    float angle_left = rect_to_polar(from_left).y;
    float angle_right = rect_to_polar(from_right).y;

    // Draw large black circles that will become the outlines of each eye
    float left_outline = circle(uv, LEFT_EYE, RADIUS_OUTLINE, CIRCLE_BLUR);
    float right_outline = circle(uv, RIGHT_EYE, RADIUS_OUTLINE, CIRCLE_BLUR);
    float outline_mask = MASK_UNION(left_outline, right_outline);

    // Eye whites
    float left_eye = circle(uv, LEFT_EYE, RADIUS_EYE, CIRCLE_BLUR);
    float right_eye = circle(uv, RIGHT_EYE, RADIUS_EYE, CIRCLE_BLUR);
    float eye_mask = MASK_UNION(left_eye, right_eye);

    // Pupils
    vec2 left_offset = polar_to_rect(vec2(OFFSET_PUPIL, angle_left));
    vec2 right_offset = polar_to_rect(vec2(OFFSET_PUPIL, angle_right));
    float left_pupil = circle(
        uv, LEFT_EYE + left_offset, RADIUS_PUPIL, CIRCLE_BLUR);
    float right_pupil = circle(
        uv, RIGHT_EYE + right_offset, RADIUS_PUPIL, CIRCLE_BLUR);
    float pupil_mask = MASK_UNION(left_pupil, right_pupil);

    // Construct the layers
    vec4 image = OVERLAY(COLOR_BG, COLOR_LINES, outline_mask);
    image = OVERLAY(image, COLOR_EYE, eye_mask);
    image = OVERLAY(image, COLOR_PUPIL, pupil_mask);

    gl_FragColor = display(image);
}
