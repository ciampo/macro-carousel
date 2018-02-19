window.wcutils = {};

/**
 * `waitForElement` waits for the browser to load the definition of the custom
 * element with the name `elementName`.
 * @returns a promise that resolves when the element has been defined.
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

window.wcutils.getCSSCustomProperty = function(elem, propertyName) {
  const cssStyles = getComputedStyle(elem);
  return String(cssStyles.getPropertyValue(propertyName)).trim();
};

window.wcutils.delay = function(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
};

window.wcutils.flush = function() {
  return wcutils.delay(50);
};
