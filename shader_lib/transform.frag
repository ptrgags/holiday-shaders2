/**
 * Return a rotation matrix
 */
mat2 rotate(float theta) {
    return mat2(
        cos(theta), sin(theta),
        -sin(theta), cos(theta)
    );
}
