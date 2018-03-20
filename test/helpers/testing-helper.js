window.wcutils = {};

/**
 * `waitForElement` waits for the browser to load the definition of the custom
 * element with the name `elementName`.
 * @return {Promise} a promise that resolves when the element has been defined.
 */
window.wcutils.waitForElement = function(elementName) {
  return customElements.whenDefined(elementName);
};

/**
 * `before` is a wrapper for Mocha’s before() function and adds a “testing area”
 * to the DOM. The element is accessible inside test function via
 * `this.container`. The container can be used to inject markup for the
 * custom element that is supposed to be tested.
 */
window.wcutils.before = function(f) {
  return function() {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    f && f.call(this);
  };
};

/**
 * `after` cleans up the “testing area” added by `before()`.
 */
window.wcutils.after = function(f) {
  return function() {
    this.container.remove();
    this.container = null;
    f && f.call(this);
  };
};

/**
 * `isHidden` returns true if an element is hidden, taken both the `hidden`
 * and `aria-hidden` attribute into account.
 */
window.wcutils.isHidden = function(elem) {
  return elem.hidden ||
    (elem.getAttribute('aria-hidden') || '').toLowerCase() === 'true';
};

/**
 * Reads the value og a CSS Custom Property
 * @param {HTMLElement} elem The Element to read the property from
 * @param {string} propertyName THe CSS Custom Property name
 * @return {string} The value of the CSS Custom Property.
 */
window.wcutils.getCSSCustomProperty = function(elem, propertyName) {
  const cssStyles = getComputedStyle(elem);
  return String(cssStyles.getPropertyValue(propertyName)).trim();
};

/**
 * Promisified setTimeout.
 * @param {number} ms The delay
 * @return {Promise}
 */
window.wcutils.delay = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Arbitrary promisified delay of 50ms
 * @return {Promise}
 */
window.wcutils.flush = function() {
  return wcutils.delay(80);
};

/**
 * Converts a string from camelCase to dash-case.
 * @param {string} myStr The camelCase string to convert
 * @return {string} The converted dash-case string.
 */
window.wcutils.camelCaseToDash = function(myStr) {
  return myStr.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
};

/**
 * Converts a string from camelCase to dash-case.
 * @param {string} myStr The camelCase string to convert
 * @return {string} The converted dash-case string.
 */
window.wcutils.dashToCamelCase = function(myStr) {
  return myStr.replace(/-([a-z])/g, g => g[1].toUpperCase());
};

/**
 * Get a random integer between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random integer
 */
window.wcutils.getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};


/**
 * @typedef {Object} TransformObj
 * @property {string} rotate The rotate string value
 * @property {number} translate The translate string value
 */

/**
 * Converts a CSS transform matrix to a more human readable object
 * @param {string} matrix The transform matrix
 * @return {TransformObj} An object representing the transform
 */
window.wcutils.matrixToTransformObj = function(matrix) {
  // this happens when there was no rotation yet in CSS
  if (matrix === 'none') {
    matrix = 'matrix(0,0,0,0,0)';
  }
  const obj = {};
  const values = matrix.match(/([-+]?[\d\.]+)/g);

  obj.rotate = (Math.round(
    Math.atan2(
      parseFloat(values[1]),
      parseFloat(values[0])) * (180 / Math.PI)) || 0
  ).toString() + 'deg';

  obj.translate = values[5] ?
      values[4] + 'px, ' + values[5] + 'px' :
      (values[4] ? values[4] + 'px' : '');

  return obj;
};

/**
 * Appends styles to the head of a document
 * @param {HTMLDocument} doc The document object
 * @param {string} css The string of text containing CSS styles
 */
window.wcutils.appendStyles = function(css) {
  const doc = document;
  const head = doc.head || doc.getElementsByTagName('head')[0];
  const style = doc.createElement('style');
  style.setAttribute('data-test-styles', '');

  style.type = 'text/css';
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(doc.createTextNode(css));
  }
  head.appendChild(style);
};

/**
* Removes the styles appended with wcutils.appendStyles.
*/
window.wcutils.removeStyles = function() {
  const styles = Array.prototype.slice.call(
      document.querySelectorAll('[data-test-styles]'));
  styles.forEach(styleTag => {
    document.head.removeChild(styleTag);
  });
};
