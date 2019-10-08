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
    throw new RangeError(`'min' ${min} should be lower than 'max' ${max}`);
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
 * Clamps a number according to its absolute value, but still retaining its
 *  sign.
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
 * Computes the tan of an angle in degress, and rounds it to 2 decimals.
 * @param {number} deg The angle in degrees.
 * @return {number} The rounded tan.
 */
export function roundedTan(deg) {
  return Math.round(Math.tan(deg * Math.PI / 180) * 100) / 100;
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
  element.setAttribute(attributeName, `${value}`);
}

/**
 * Standard getter for a Custom Element int property reflected to attribute.
 * @param {HTMLElement} element
 * @param {string} attributeName
 * @param {number} [defaultValue=0]
 * @return {number} Whether the element has that specific attribute
 */
export function intGetter(element, attributeName, defaultValue = 0) {
  const value = element.getAttribute(attributeName);
  return value === null ? defaultValue : parseInt(value, 10);
}

/**
 * An object representing either a touch event or a mouse event.
 * @typedef {object} NormalisedPointerEvent
 * @property {number} x The x coordinate.
 * @property {number} y The y coordinate.
 * @property {?number} id The pointer identifier.
 * @property {MouseEvent|TouchEvent} event The original event object.
 */

/**
 * Normalises touch and mouse events into an object with the same properties.
 * @param {MouseEvent|TouchEvent} ev The mouse or touch event.
 * @returns {NormalisedPointerEvent}
 * @private
 */
export function normalizeEvent(ev) {
  // touch
  if (ev.type === 'touchstart' ||
      ev.type === 'touchmove' ||
      ev.type === 'touchend') {
    const touch = ev.targetTouches[0] || ev.changedTouches[0];
    return {
      x: touch.clientX,
      y: touch.clientY,
      id: touch.identifier,
      event: ev,
    };

  // mouse
  } else {
    return {
      x: ev.clientX,
      y: ev.clientY,
      id: null,
      event: ev,
    };
  }
}

/**
 * Gets the value of a CSS Custom property on a HTML Element.
 * @param {HTMLElement} element The element to get the property from.
 * @param {string} propertyName The property name.
 * @return {string} The property value.
 */
export function getCSSCustomProperty(element, propertyName) {
  const cssStyles = getComputedStyle(element);
  return String(cssStyles.getPropertyValue(propertyName)).trim();
}

/**
 * Sets the value of a CSS Custom property on a HTML Element.
 * @param {HTMLElement} element The element to get the property onto.
 * @param {string} propertyName The property name.
 * @param {string|number} propertyValue The property value.
 */
export function setCSSCustomProperty(element, propertyName, propertyValue) {
  element.style.setProperty(propertyName, `${propertyValue}`);
  if (window.ShadyCSS) {
    window.ShadyCSS.styleSubtree(element, {[propertyName]: propertyValue});
  }
}

/**
 * Check if a variable is undefined
 * @param {*} a Anything
 * @return {boolean}
 */
export function isUndefined(a) {
  return typeof a === 'undefined';
}
