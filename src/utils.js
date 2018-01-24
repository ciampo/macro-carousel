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

/**
 * Standard setter for a Custom Element boolean property reflected to attribute.
 * @param {HTMLElement} element
 * @param {string} attributeName
 * @param {boolean} flag
 */
export function booleanSetter(element, attributeName, flag) {
  if (flag) {
    element.setAttribute(attributeName, '');
  } else {
    element.removeAttribute(attributeName);
  }
}

/**
 * Standard getter for a Custom Element boolean property reflected to attribute.
 * @param {HTMLElement} element
 * @param {string} attributeName
 * @return {boolean} Whether the element has that specific attribute
 */
export function booleanGetter(element, attributeName) {
  return element.hasAttribute(attributeName);
}

/**
 * Standard setter for a Custom Element int property reflected to attribute.
 * @param {HTMLElement} element
 * @param {string} attributeName
 * @param {number} value
 */
export function intSetter(element, attributeName, value) {
  element.setAttribute(attributeName, value);
}

/**
 * Standard getter for a Custom Element int property reflected to attribute.
 * @param {HTMLElement} element
 * @param {string} attributeName
 * @param {string} [defaultValue=0]
 * @return {number} Whether the element has that specific attribute
 */
export function intGetter(element, attributeName, defaultValue = 0) {
  const value = element.getAttribute(attributeName);
  return value === null ? defaultValue : parseInt(value, 10);
}

