let _passiveEvtSupport;

/**
 * Detects browser support for passive event listeners. See
 * https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
 * @returns {boolean} True if the browser support passive event listeners.
 * @private
 */
function _passiveEvtListenersSupported() {
  if (typeof _passiveEvtSupport === 'undefined') {
    _passiveEvtSupport = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: () => {
          _passiveEvtSupport = true;
        },
      });
      window.addEventListener('test', null, opts);
    } catch (e) {}
  }

  return _passiveEvtSupport;
}

/**
 * Returns the event options (including passive if the browser supports it)
 * @param {boolean} isPassive Whether the event is passive or not.
 * @returns {Object|boolean} Based on browser support, returns either an
 * object representing the options (including passive), or a boolean.
 */
export function getEvtListenerOptions(isPassive) {
  return _passiveEvtListenersSupported() ? {passive: isPassive} : false;
}
