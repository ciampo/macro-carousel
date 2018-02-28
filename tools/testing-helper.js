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

window.wcutils.camelCaseToDash =  function(myStr) {
  return myStr.replace( /([a-z])([A-Z])/g, '$1-$2' ).toLowerCase();
}

window.wcutils.dashToCamelCase =  function(myStr) {
  return myStr.replace(/-([a-z])/g, function(g) { return g[1].toUpperCase(); });
}


/**
 * Get a random integer between `min` and `max`.
 *
 * @param {number} min - min number
 * @param {number} max - max number
 * @return {number} a random integer
 */
window.wcutils.getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

window.wcutils.matrixToTransformObj = function(matrix) {
  // this happens when there was no rotation yet in CSS
  if(matrix === 'none') {
    matrix = 'matrix(0,0,0,0,0)';
  }
  var obj = {},
      values = matrix.match(/([-+]?[\d\.]+)/g);

  obj.rotate = (Math.round(
    Math.atan2(
      parseFloat(values[1]),
      parseFloat(values[0])) * (180/Math.PI)) || 0
  ).toString() + 'deg';
  obj.translate = values[5] ? values[4] + 'px, ' + values[5] + 'px' : (values[4] ? values[4] + 'px' : '');

  return obj;
}

window.wcutils.appendStyles = function(doc, css) {
  const head = doc.head || doc.getElementsByTagName('head')[0];
  const style = doc.createElement('style');

  style.type = 'text/css';
  if (style.styleSheet){
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(doc.createTextNode(css));
  }
  head.appendChild(style);
}