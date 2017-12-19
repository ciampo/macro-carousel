/**
 * Clamps a number between a min and a max.
 * @param {number} x The number to be clamped.
 * @param {number} [min] The min value.
 * @param {number} [max] The max value.
 * @return {number} The clamped number.
 * @throws {RangeError} min must be strictly less than max.
 */
export function clamp(x, min = x, max = x) {
  let clamped = x;

  if (min > max) {
    throw new RangeError('`min` should be lower than `max`');
  }

  if (x < min) {
    clamped = min;
  }

  if (x > max) {
    clamped = max;
  }

  return clamped;
}

/**
 * Clamps a number according to its absolute value, but still retainig its sign.
 * @param {number} x The number to be clamped.
 * @param {number} [min] The min value.
 * @param {number} [max] The max value.
 * @return {number} The clamped number.
 */
export function clampAbs(x, min, max) {
  if (x === 0) {
    throw new RangeError('x must be different from `0`');
  }

  return x / Math.abs(x) * clamp(Math.abs(x), min, max);
}
