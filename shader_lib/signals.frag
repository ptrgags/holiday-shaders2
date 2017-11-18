/**
 * Convert from a signed signal of [-1, 1] to an unsigned
 * signal from [0, 1]. This squishes and shifts it up.
 * This is useful for squishing e.g. a sine wave into the range [0, 1]
 */
float unsigned_signal(float signed_sig) {
    return 0.5 * signed_sig + 0.5;
}

/**
 * Convert from an unsigned signal in the range [0, 1] to a signed signal
 * from [-1, 1]. This shifts down and expands the signal.
 * This is useeful for making a signal more like a sine wave.
 */
float signed_signal(float unsigned_sig) {
    return 2.0 *  (unsigned_sig - 0.5);
}
