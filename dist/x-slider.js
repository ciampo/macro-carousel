(function(l, i, v, e) { v = l.createElement(i); v.async = 1; v.src = '//' + (location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; e = l.getElementsByTagName(i)[0]; e.parentNode.insertBefore(v, e)})(document, 'script');
(function () {
'use strict';

var css = "/*\nConsistency between navigation and pagination hover/active/focus styles\n*/\n\n:host {\n  position: relative;\n\n  display: -webkit-box;\n\n  display: -ms-flexbox;\n\n  display: flex;\n  -webkit-box-orient: vertical;\n  -webkit-box-direction: normal;\n      -ms-flex-direction: column;\n          flex-direction: column;\n  -webkit-box-align: stretch;\n      -ms-flex-align: stretch;\n          align-items: stretch;\n\n  contain: content;\n\n  --x-slider-gap: 16px;\n\n  --x-slider-background-color: transparent;\n\n  --x-slider-slide-min-height: 0px;\n  --x-slider-slide-max-height: none;\n\n  --x-slider-transition-duration: 0.6s;\n  --x-slider-transition-timing-function: cubic-bezier(.25, .46, .45, .94);\n\n  --x-slider-navigation-color: #000;\n  --x-slider-navigation-color-focus: var(--x-slider-navigation-color);\n  --x-slider-navigation-background-color: transparent;\n  --x-slider-navigation-background-color-focus: #f0f0f0;\n  --x-slider-navigation-button-size: 48px;\n  --x-slider-navigation-icon-size: 24px;\n  --x-slider-navigation-icon-mask: url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000'%3E %3Cpath d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'/%3E %3C/svg%3E\");\n\n  --x-slider-pagination-color: #999;\n  --x-slider-pagination-color-selected: #000;\n  --x-slider-pagination-size-clickable: 24px;\n  --x-slider-pagination-size-dot: 8px;\n  --x-slider-pagination-gap: 2px;\n  --x-slider-pagination-height: 44px;\n}\n\n:host([hidden]) {\n  display: none\n}\n\n:host-context(.js-focus-visible) :focus:not(.focus-visible),\n:host-context(.js-focus-visible) ::slotted(*:focus:not(.focus-visible)) {\n  outline: 0;\n}\n\n#externalWrapper {\n  height: 100%;\n\n  overflow: hidden;\n  contain: paint;\n\n  background-color: var(--x-slider-background-color);\n\n  /*\n    https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md\n  */\n  -ms-touch-action: pan-y pinch-zoom;\n      touch-action: pan-y pinch-zoom;\n\n  cursor: -webkit-grab;\n\n  cursor: grab;\n}\n\n:host([pointer-down]) #externalWrapper {\n  cursor: -webkit-grabbing;\n  cursor: grabbing;\n}\n\n:host([disable-drag]) #externalWrapper,\n:host([disable-drag][pointer-down]) #externalWrapper {\n  cursor: default;\n}\n\n\n#slidesWrapper {\n  display: -webkit-box;\n  display: -ms-flexbox;\n  display: flex;\n  -webkit-box-align: stretch;\n      -ms-flex-align: stretch;\n          align-items: stretch;\n\n  height: 100%;\n  min-height: var(--x-slider-slide-min-height);\n  max-height: var(--x-slider-slide-max-height);\n\n  will-change: transform;\n\n  --x-slider__internal__slides-per-view: 1;\n}\n\n:host([transitioning]) #slidesWrapper {\n  -webkit-transition-property: -webkit-transform;\n  transition-property: -webkit-transform;\n  transition-property: transform;\n  transition-property: transform, -webkit-transform;\n  -webkit-transition-duration: var(--x-slider-transition-duration);\n          transition-duration: var(--x-slider-transition-duration);\n  -webkit-transition-timing-function: var(--x-slider-transition-timing-function);\n          transition-timing-function: var(--x-slider-transition-timing-function);\n}\n\n#pagination {\n  display: none;\n}\n\n:host([pagination]) #pagination {\n  -ms-flex-item-align: center;\n      align-self: center;\n\n  display: -webkit-box;\n\n  display: -ms-flexbox;\n\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n\n  width: 100%;\n  height: var(--x-slider-pagination-height);\n  min-height: var(--x-slider-pagination-size-clickable);\n\n  contain: strict;\n\n  font-size: 0;\n}\n\n#paginationSlot::slotted(button) {\n  position: relative;\n\n  width: var(--x-slider-pagination-size-clickable);\n  height: var(--x-slider-pagination-size-clickable);\n\n  margin: 0 calc(var(--x-slider-pagination-gap) / 2);\n  padding: 0;\n\n  border: none;\n  background: none;\n\n  font-size: inherit;\n\n  cursor: pointer;\n\n  opacity: .8;\n}\n\n#paginationSlot::slotted(button)::before,\n#paginationSlot::slotted(button)::after {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n\n  -webkit-transform: translate(-50%, -50%);\n\n          transform: translate(-50%, -50%);\n\n  display: block;\n\n  width: var(--x-slider-pagination-size-dot);\n  height: var(--x-slider-pagination-size-dot);\n\n  border-radius: 50%;\n\n  background-color: var(--x-slider-pagination-color);\n\n  content: '';\n}\n\n#paginationSlot::slotted(button)::before {\n  -webkit-transform: translate(-50%, -50%) scale(2);\n          transform: translate(-50%, -50%) scale(2);\n\n  opacity: 0;\n\n  will-change: opacity;\n}\n\n#paginationSlot::slotted(button:hover),\n#paginationSlot::slotted(.disabled) {\n  opacity: 1;\n}\n\n#paginationSlot::slotted(button:active)::before,\n#paginationSlot::slotted(button.focus-visible)::before {\n  opacity: .2;\n}\n\n#paginationSlot::slotted(.disabled)::after {\n  background-color: var(--x-slider-pagination-color-selected);\n}\n\n#slidesSlot::slotted(*) {\n  /* (100% - gap * (slidesPerView - 1)) / slidesPerView */\n  -webkit-box-flex: 0;\n      -ms-flex: 0 0 calc((100% - (var(--x-slider__internal__slides-per-view) - 1) *\n      var(--x-slider-gap)) / var(--x-slider__internal__slides-per-view));\n          flex: 0 0 calc((100% - (var(--x-slider__internal__slides-per-view) - 1) *\n      var(--x-slider-gap)) / var(--x-slider__internal__slides-per-view));\n  margin-right: var(--x-slider-gap);\n\n  /*\n   * Enforces the slides to keep their size even if the content requires\n   * a bigger slide size.\n   */\n  overflow: hidden;\n\n  outline: 0;\n\n  -webkit-user-select: none;\n\n     -moz-user-select: none;\n\n      -ms-user-select: none;\n\n          user-select: none;\n}\n\n:host([disable-drag]) #slidesSlot::slotted(*) {\n  -webkit-user-select: auto;\n     -moz-user-select: auto;\n      -ms-user-select: auto;\n          user-select: auto;\n}\n\n#ariaSlot::slotted(*) {\n  position: absolute;\n\n  height: 1px;\n  width: 1px;\n\n  margin: -1px;\n  padding: 0;\n\n  clip: rect(0 0 0 0);\n\n  overflow: hidden;\n\n  border: 0;\n}\n\n#navigation {\n  display: none;\n}\n\n:host([navigation]) #navigation {\n  display: block;\n}\n\n#navigationSlot::slotted(button) {\n  position: absolute;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n          transform: translateY(-50%);\n\n  display: -webkit-box;\n\n  display: -ms-flexbox;\n\n  display: flex;\n  -webkit-box-align: center;\n      -ms-flex-align: center;\n          align-items: center;\n  -webkit-box-pack: center;\n      -ms-flex-pack: center;\n          justify-content: center;\n\n  min-width: var(--x-slider-navigation-button-size);\n  min-height: var(--x-slider-navigation-button-size);\n  padding: 0;\n\n  background: none;\n  background-color: var(--x-slider-navigation-background-color);\n  border: 0;\n  border-radius: 50%;\n\n  overflow: hidden;\n\n  cursor: pointer;\n}\n\n:host([pagination]) #navigationSlot::slotted(button) {\n  top: calc(50% - var(--x-slider-pagination-height) / 2);\n}\n\n#navigationSlot::slotted(#previous) {\n  left: 0;\n}\n\n#navigationSlot::slotted(#next) {\n  right: 0;\n}\n\n#navigationSlot::slotted(button)::before,\n#navigationSlot::slotted(button)::after {\n  position: absolute;\n\n  content: '';\n}\n\n#navigationSlot::slotted(button)::after {\n  top: calc((var(--x-slider-navigation-button-size) - var(--x-slider-navigation-icon-size)) / 2);\n  right: calc((var(--x-slider-navigation-button-size) - var(--x-slider-navigation-icon-size)) / 2);\n  width: var(--x-slider-navigation-icon-size);\n  height: var(--x-slider-navigation-icon-size);\n\n  background-color: var(--x-slider-navigation-color);\n\n  /* References:\n   * - https://developer.mozilla.org/en-US/docs/Web/CSS/mask-image\n   * - https://codepen.io/tigt/post/optimizing-svgs-in-data-uris\n   */\n  -webkit-mask-image: var(--x-slider-navigation-icon-mask);\n          mask-image: var(--x-slider-navigation-icon-mask);\n}\n\n#navigationSlot::slotted(#next)::after {\n  -webkit-transform: rotateZ(180deg);\n          transform: rotateZ(180deg);\n}\n\n\n#navigationSlot::slotted(button)::before {\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n\n  background-color: var(--x-slider-navigation-background-color-focus);\n\n  opacity: 0;\n\n  will-change: opacity;\n}\n\n/*\n * Show the bg circle when the button is not disabled and is hovered, active,\n * focused or keyboard-focused (thanks to the focus-visible polyfill).\n */\n#navigationSlot::slotted(button:hover:not(:disabled))::before,\n#navigationSlot::slotted(button:active:not(:disabled))::before,\n#navigationSlot::slotted(button:focus:not(:disabled))::before,\n:host-context(.js-focus-visible) #navigationSlot::slotted(button.focus-visible)::before {\n  opacity: 1;\n}\n\n#navigationSlot::slotted(button:hover:not(:disabled))::after,\n#navigationSlot::slotted(button:active:not(:disabled))::after,\n#navigationSlot::slotted(button:focus:not(:disabled))::after,\n:host-context(.js-focus-visible) #navigationSlot::slotted(button.focus-visible)::after {\n  background-color: var(--x-slider-navigation-color-focus);\n}\n\n/*\n * Do not show the bg circle if the button is focused (but not active or not hovered)\n * and doesn't have a focused-visible class. This means, do not leave the bg showing\n * after the user clicks on the button.\n */\n:host-context(.js-focus-visible) #navigationSlot::slotted(button:focus:not(:active):not(:hover):not(.focus-visible))::before {\n  opacity: 0;\n}\n\n:host-context(.js-focus-visible) #navigationSlot::slotted(button:focus:not(:active):not(:hover):not(.focus-visible))::after {\n  background-color: var(--x-slider-navigation-color);\n}\n\n#navigationSlot::slotted(button[disabled]) {\n  opacity: .2;\n}\n\n/*\n * Print styles:\n * - Show all slides and stack them vertically\n * - Eliminate the slide gap, show an outline\n * - make sure the page doesn't break a slide in half\n * - hide pagination and navigation buttons\n */\n\n@media print {\n  #slidesSlot::slotted(*) {\n    margin-right: 0;\n    margin-bottom: .2em;\n\n    outline: 1px solid black;\n\n    color: #000;\n\n    page-break-inside: avoid;\n  }\n\n  /* Remove the navigational buttons, they provide no context in print */\n   :host([navigation]) #navigation,\n   :host([pagination]) #pagination {\n    display: none;\n  }\n\n  /* Stack the slides */\n  #slidesWrapper {\n    display: block;\n\n    -webkit-transform: none !important;\n\n            transform: none !important;\n    -webkit-transition: 0s;\n    transition: 0s;\n  }\n}\n";

var html = "<div id=\"externalWrapper\">\n  <div id=\"slidesWrapper\">\n    <slot id=\"slidesSlot\"><p>No content available</p></slot>\n  </div>\n</div>\n\n<div id=\"navigation\">\n  <slot id=\"navigationSlot\" name=\"navigationSlot\"></slot>\n</div>\n\n<div id=\"pagination\">\n  <slot id=\"paginationSlot\" name=\"paginationSlot\"></slot>\n</div>\n\n<slot id=\"ariaSlot\" name=\"ariaSlot\"></slot>";

let passiveEvtSupport;

/**
 * Detects browser support for passive event listeners. See
 * https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
 * @returns {boolean} True if the browser support passive event listeners.
 * @private
 */
function _passiveEvtListenersSupported() {
  if (typeof passiveEvtSupport === 'undefined') {
    passiveEvtSupport = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: () => {
          passiveEvtSupport = true;
        },
      });
      window.addEventListener('test', null, opts);
    } catch (e) {}
  }

  return passiveEvtSupport;
}

/**
 * Returns the event options (including passive if the browser supports it)
 * @param {boolean} isPassive Whether the event is passive or not.
 * @returns {Object|boolean} Based on browser support, returns either an
 * object representing the options (including passive), or a boolean.
 */
function getEvtListenerOptions(isPassive) {
  return _passiveEvtListenersSupported() ? {passive: isPassive} : false;
}

/**
 * Clamps a number between a min and a max.
 * @param {number} x The number to be clamped.
 * @param {number} [min] The min value.
 * @param {number} [max] The max value.
 * @return {number} The clamped number.
 * @throws {RangeError} min must be strictly less than max.
 */
function clamp(x, min = x, max = x) {
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
function clampAbs(x, min, max) {
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
function booleanSetter(element, attributeName, flag) {
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
function booleanGetter(element, attributeName) {
  return element.hasAttribute(attributeName);
}

/**
 * Standard setter for a Custom Element int property reflected to attribute.
 * @param {HTMLElement} element
 * @param {string} attributeName
 * @param {number} value
 */
function intSetter(element, attributeName, value) {
  element.setAttribute(attributeName, value);
}

/**
 * Standard getter for a Custom Element int property reflected to attribute.
 * @param {HTMLElement} element
 * @param {string} attributeName
 * @param {string} [defaultValue=0]
 * @return {number} Whether the element has that specific attribute
 */
function intGetter(element, attributeName, defaultValue = 0) {
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
function normalizeEvent(ev) {
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

const sliderTemplate = document.createElement('template');
sliderTemplate.innerHTML = `<style>${css}</style> ${html}`;

/**
 * An object representing either a touch event or a mouse event.
 * @typedef {object} NormalisedPointerEvent
 * @property {number} x The x coordinate.
 * @property {number} y The y coordinate.
 * @property {?number} id The pointer identifier.
 * @property {MouseEvent|TouchEvent} event The original event object.
 */

/**
 * An object containing information about a slide.
 * @typedef {object} SlideInfo
 * @property {HTMLElement} element The DOM element.
 * @property {number} layoutIndex The real index in the layout.
 * @property {number} position The current position within the slder (in px).
 */

/**
 * A slider/carousel Web Component.
 */
class XSlider extends HTMLElement {
  /**
   * Creates a new instance of XSlider.
   * @constructor
   */
  constructor() {
    /*
     * Runs anytime a new instance is created (in HTML or JS).
     * The construtor is a good place to create shadow DOM, though you should
     * avoid touching any attributes or light DOM children as they may not
     * be available yet.
     */
    super();

    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(sliderTemplate.content.cloneNode(true));

    /**
     * The wrapper element enclosing the slides.
     * @type {HTMLElement}
     * @private
     */
    this._externalWrapper = this.shadowRoot.querySelector('#externalWrapper');

    /**
     * The internal wrapper element (responsible for the slides layout
     *  and for sliding).
     * @type {HTMLElement}
     * @private
     */
    this._slidesWrapper = this.shadowRoot.querySelector('#slidesWrapper');

    /**
     * The slot where the slides are injected into.
     * @type {HTMLSlotElement}
     * @private
     */
    this._slidesSlot = this.shadowRoot.querySelector('#slidesSlot');

    /**
     * The slot where the aria-live element is injected into.
     * @type {HTMLSlotElement}
     * @private
     */
    this._ariaSlot = this.shadowRoot.querySelector('#ariaSlot');

    /**
     * The slot where the pagination indicators are injected into.
     * @type {HTMLSlotElement}
     * @private
     */
    this._paginationSlot = this.shadowRoot.querySelector('#paginationSlot');

    /**
     * Array of pagination indicators.
     * @type {Array<HTMLElement>}
     * @private
     */
    this._paginationIndicators = [];

    /**
     * The slot where the navigation previous/next buttons are injected into.
     * @type {HTMLSlotElement}
     * @private
     */
    this._navigationSlot = this.shadowRoot.querySelector('#navigationSlot');

    /**
     * The navigation `previous` button.
     * @type {HTMLElement|undefined}
     * @private
     */
    this._prevButton = undefined;

    /**
     * The navigation `next` button.
     * @type {HTMLElement|undefined}
     * @private
     */
    this._nextButton = undefined;

    /**
     * The array of slides, i.e. the children of this._slidesSlot.
     * @type {Array<SlideInfo>}
     * @private
     */
    this._slides = [];

    /**
     * The index of the the last view.
     * @type {number}
     * @private
     */
    this._lastViewIndex = -1;

    /**
     * An internal index representing the "wrapAround" iteration about the
     * selected index. If _wrapAround is false, its value doesn't change.
     * @type {number}
     * @private
     */
    this._selectedIteration = 0;


    /**
     * An internal index keeping track of the previous value for the layout
     * index. Useful for understanding which slides need to be moved.Gets
     * updated every time `selected` changes.
     * @type {number}
     * @private
     */
    this._previousEffectiveLayoutIndex = 0;

    /**
     * The width of this._slidesWrapper (in px). Derived from CSS.
     * @type {number}
     * @private
     */
    this._wrapperWidth = 0;

    /**
     * The width of the gap between each slide (in px). Derived from CSS.
     * @type {number}
     * @private
     */
    this._slidesGap = 0;

    /**
     * The width of each individual slide (in px). Computed mathematically
     * from other properties.
     * @type {number}
     * @private
     */
    this._slidesWidth = 0;

    /**
     * The translation on the X axis applied to this._slidesWrapper (in px).
     * @type {number}
     * @private
     */
    this._wrapperTranslateX = 0;

    /**
     * The reference to the timer used to debounce the resize handler.
     * @type {number|undefined}
     * @private
     */
    this._resizeTimer = undefined;

    /**
     * True when CSS transitions are enabled.
     * @type {boolean}
     * @private
     */
    this._transitioning = false;

    // Touch / drag

    /**
     * Whether the user's pointer is currently being used to drag the slides.
     * @type {boolean}
     * @private
     */
    this._isPointerActive = false;

    /**
     * The ID of the active pointer that is dragging the slides.
     * @type {number|undefined}
     * @private
     */
    this._pointerId = undefined;

    /**
     * The coordinate on the X axis at which the active pointer first "touched".
     * @type {number|undefined}
     * @private
     */
    this._pointerFirstX = undefined;

    /**
     * The coordinate on the Y axis at which the active pointer first "touched".
     * @type {number|undefined}
     * @private
     */
    this._pointerFirstY = undefined;

    /**
     * The coordinate on the X axis used to the set the wrapper's translation
     * during the last frame.
     * @type {number|undefined}
     * @private
     */
    this._pointerLastX = undefined;

    /**
     * The coordinate on the Y axis used to the set the wrapper's translation
     * during the last frame.
     * @type {number|undefined}
     * @private
     */
    this._pointerLastY = undefined;

    /**
     * The coordinate on the X axis at which the active pointer last "touched".
     * @type {number|undefined}
     * @private
     */
    this._pointerCurrentX = undefined;

    /**
     * The coordinate on the Y axis at which the active pointer last "touched".
     * @type {number|undefined}
     * @private
     */
    this._pointerCurrentY = undefined;

    /**
     * Updated during pointer events.
     * @type {number|undefined}
     * @private
     */
    this._lastDraggedLayoutIndex = undefined;

    /**
     * Array containining the translation value assumed by the slidesWrapper in
     * the last 100ms. Used to compute the starting velocity when decelerating.
     * @type {Array<number>}
     * @private
     */
    this._trackingPoints = [];

    /**
     * Flag used to limit the number of udpates to the slidesWrapper to once
     * per frame (the pointer events may fire more frequently than that).
     * @type {boolean}
     * @private
     */
    this._dragTicking = false;

    /**
     * The upper bound for the initial value of the velocity when decelerating.
     * @type {number}
     * @private
     */
    this._maxDecelVelocity = 50;

    /**
     * The lower bound for the initial value of the velocity when decelerating.
     * @type {number}
     * @private
     */
    this._minDecelVelocity = 20;

    /**
     * If the velocity is higher than a threshold, the number of slides that
     * / the carousel is moving by increases by 1.
     * @type {number}
     * @private
     */
    this._slidesToMoveVelocityThresholds = [500, 800];

    /**
     * The value for the friction strength used when decelerating.
     * 0 < friction < 1.
     * @type {number}
     * @private
     */
    this._friction = 0.7;

    /**
     * The value for the attraction strength used when decelerating.
     * @type {number}
     * @private
     */
    this._attraction = 0.04;

    /**
     * The value of the deceleration velocity (in px).
     * @type {number}
     * @private
     */
    this._decelVelocity = 0;

    /**
     * Whether the slider is currently decelerating towards its final point
     * after being dragged by the user.
     * @type {boolean}
     * @private
     *
     */
    this._decelerating = false;
  }

  /**
   * Fires when the element is inserted into the DOM.
   * It's a good place to set the initial `role`, `tabindex`, internal state,
   * and install event listeners.
   * @private
   */
  connectedCallback() {
    // Setting role=list (we set role=listitem for the slides)
    this.setAttribute('role', 'list');

    // Setup the component.
    this._upgradeProperty('selected');
    this._upgradeProperty('loop');
    this._upgradeProperty('navigation');
    this._upgradeProperty('pagination');
    this._upgradeProperty('disableDrag');
    this._upgradeProperty('slidesPerView');
    this._upgradeProperty('reducedMotion');
    this._upgradeProperty('autoFocus');

    this._previousEffectiveLayoutIndex = this.selected;

    // Enable transitions only after the initial setup.
    this._enableWrapperTransitions();

    // Add event listeners.
    this._slidesSlot.addEventListener('slotchange', this);
    window.addEventListener('resize', this, getEvtListenerOptions(true));
    this.addEventListener('keydown', this);

    // fixes weird safari 10 bug where preventDefault is prevented
    // @see https://github.com/metafizzy/flickity/issues/457#issuecomment-254501356
    window.addEventListener('touchmove', function() {});
  }

  /**
   * Fires when the element is removed from the DOM.
   * It's a good place to do clean up work like releasing references and
   * removing event listeners.
   * @private
   */
  disconnectedCallback() {
    this._slidesSlot.removeEventListener('slotchange', this);
    window.removeEventListener('resize', this);

    if (!this.disableDrag) {
      this._externalWrapper.removeEventListener('touchstart', this);
      this._externalWrapper.removeEventListener('mousedown', this);
    }

    if (this.navigation) {
      this._prevButton.removeEventListener('click', this);
      this._nextButton.removeEventListener('click', this);
    }

    if (this.pagination) {
      this._paginationIndicators.forEach(p => {
        p.removeEventListener('click', this);
      });
    }
  }

  /**
   * Defining handleEvent allows to pass `this` as the callback to every
   * `addEventListener` and `removeEventListener`. This avoids the need of
   * binding every function. See
   * https://medium.com/@WebReflection/dom-handleevent-a-cross-platform-standard-since-year-2000-5bf17287fd38
   *
   * @param {Event} e Any event.
   * @private
   */
  handleEvent(e) {
    // Window resize
    if (e.type === 'resize' && e.target === window) {
      this._onResize();

    // Slot change
    } else if (e.type === 'slotchange' && e.target === this._slidesSlot) {
      this._onSlidesSlotChange();

    // Pagination indicators
    } else if (e.type === 'click' && this.pagination &&
        this._paginationIndicators.find(el => el === e.target)) {
      this._onPaginationClicked(e);

    // Navigation (prev / next button)
    } else if (e.type === 'click' && this.navigation) {
      if (e.target === this._prevButton) {
        this.previous();
      } else if (e.target === this._nextButton) {
        this.next();
      }

    // Keyboard.
    } else if (e.type === 'keydown') {
      // Left / Up.
      if (e.keyCode === 37 || e.keyCode === 38) {
        this.previous();
      // Right / Down.
      } else if (e.keyCode === 39 || e.keyCode === 40) {
        this.next();
      }

    // transitionend (CSS)
    } else if (e.type === 'transitionend' && e.target === this._slidesWrapper) {
      this._updateSlidesA11y();
      this._focusSelectedSlide();
      this._updateAriaLiveDom();

    // Touch / drag
    } else if (e.type === 'touchstart' || e.type === 'mousedown') {
      this._onPointerDown(normalizeEvent(e));
    } else if (e.type === 'touchmove' || e.type === 'mousemove') {
      this._onPointerMove(normalizeEvent(e));
    } else if (e.type === 'touchend' || e.type === 'mouseup') {
      this._onPointerEnd(normalizeEvent(e));
    } else if (e.type === 'touchcancel') {
      this._stopPointerTracking();
    }
  }

  /**
   * Used for upgrading properties in case this element is upgraded lazily.
   * See web/fundamentals/architecture/building-components/best-practices#lazy-properties
   * @param {any} prop
   * @private
   */
  _upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }


  // ===========================================================================
  // Public methods (update, previous, next)
  // ===========================================================================

  /**
   * "Forces" an update by sliding the current view in, and updating
   * navigation and pagination.
   */
  update() {
    this._computeSizes();
    this._updateWrapAround();
    this._computeSlidesPerViewLayout();
    this._shiftSlides(this._slides.map(slide => slide.layoutIndex), true);
    this._slideTo(this.selected);
    this._updatePagination();
    this._updateNavigation();
    this._updateDragEventListeners();
    this._updateSlidesA11y();
    this._updateAriaLiveDom();
  }

  /**
   * Selects the slide preceding the currently selected one.
   * If the currently selected slide is the first slide and the loop
   * functionality is disabled, nothing happens.
   */
  previous() {
    this.selected = this._computePrevious(this.selected);
  }

  /**
   * Computes the previous index.
   * @param {number} i The index of reference used to compure the previous.
   * @return {number} The previous index with respect to the input.
   * @private
   */
  _computePrevious(i) {
    let previousSlideIndex;

    // Wrap around is true only if loop is true.
    if (i > 0) {
      previousSlideIndex = i - 1;
    } else if (this.loop) {
      if (this._wrapAround) {
        this._selectedIteration -= 1;
      }

      previousSlideIndex = this._lastViewIndex;
    }

    return previousSlideIndex;
  }

  /**
   * Selects the slide following the currently selected one.
   * If the currently selected slide is the last slide and the loop
   * functionality is disabled, nothing happens.
   */
  next() {
    this.selected = this._computeNext(this.selected);
  }

  /**
   * Computes the previous index.
   * @param {number} i The index of reference used to compure the next.
   * @return {number} The next index with respect to the input.
   * @private
   */
  _computeNext(i) {
    let nextSlideIndex;
    // Wrap around is true only if loop is true.
    if (i < this._lastViewIndex) {
      nextSlideIndex = i + 1;
    } else if (this.loop) {
      if (this._wrapAround) {
        this._selectedIteration += 1;
      }

      nextSlideIndex = 0;
    }

    return nextSlideIndex;
  }


  // ===========================================================================
  // Attributes / properties (selected, loop, navigation, pagination,
  // slides-per-view)
  // ===========================================================================

  /**
   * An array of the observed attributes.
   * @static
   */
  static get observedAttributes() {
    return [
      'selected',
      'loop',
      'navigation',
      'pagination',
      'disable-drag',
      'slides-per-view',
      'reduced-motion',
      'auto-focus',
    ];
  }

  /**
   * Fired when the selected slide changes.
   * @event XSlider#x-slider-selected-changed
   * @type {Object}
   * @param {number} detail The index of the new selected slide.
   */

  /**
   * Called whenever an observedAttribute's value changes.
   * @param {string} name The attribute's local name.
   * @param {*} oldValue The attribute's previous value.
   * @param {*} newValue The attribute's new value.
   * @fires XSlider#x-slider-selected-changed
   * @private
   */
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'selected':
        if (this._slides.length === 0) {
          return;
        }

        const parsedNewValue = parseInt(newValue, 10);

        // Accept only numbers between `0` and `this._lastViewIndex`.
        if (!Number.isFinite(parsedNewValue) ||
            parsedNewValue > this._lastViewIndex ||
            parsedNewValue < 0) {
          this.selected = oldValue;
          return;
        }

        if (this._wrapAround) {
          const effectiveLayoutIndex = this.selected +
              this._selectedIteration * (this._lastViewIndex + 1);

          // Get the "jump" between the current layout position and the previous
          // one. This gives the indication of which slides need to be moved to
          // a different location.
          // selectionDelta: if negative, we're selecting a slide to the right
          // The absolute value is shows by how many slides the "jump" is.
          // If selectionDelta === 0, no action is needed.
          const selectionDelta = this._previousEffectiveLayoutIndex -
              effectiveLayoutIndex;

          // Compute which slides are going to be in view in the upcoming
          // transition.
          const slidesInViewIndexes = [];
          const indexOffset = selectionDelta < 0 ?
              this.slidesPerView + selectionDelta : 0;
          // Starting at -1 means that we're also shifting the slide to the left
          // of the current one. Useful to not brake the slider while dragging
          // left.
          for (let i = -1; i < Math.abs(selectionDelta); i++) {
            // The index is compute by adding up:
            // - i: the current iteration's index
            // - effectiveLayoutIndex: where the slider is currently at
            // - indexOffset: compensates when scrolling right by taking into
            //   account the number of slidesPerView and selectionDelta
            slidesInViewIndexes.push(i + effectiveLayoutIndex + indexOffset);
          }

          this._shiftSlides(slidesInViewIndexes);

          this._previousEffectiveLayoutIndex = effectiveLayoutIndex;
        }

        this._slideTo(this.selected);
        this._updatePagination();
        this._updateNavigation();

        this.dispatchEvent(new CustomEvent('x-slider-selected-changed', {
          detail: this.selected,
        }));

        // Apply a11y changes immediately only if the slider is not
        // transitioning (i.e. CSS transitions) or decelerating (i.e. after
        // dragging). In those cases, the functions below are triggered in a
        // transitionend event listener, or at the end of the deceleration
        // rendering loop.
        if (!this._transitioning && !this._decelerating) {
          this._updateSlidesA11y();
          this._focusSelectedSlide();
          this._updateAriaLiveDom();
        }

        break;

      case 'loop':
        this._updateWrapAround();
        this._computeSlidesPerViewLayout();

        // Reset the slides 'layoutIndex', transform and position.
        this._shiftSlides(this._slides.map((slide, index) => index));
        this._updateNavigation();
        this._updatePagination();
        this._updateSlidesA11y();
        this._focusSelectedSlide();
        this._updateAriaLiveDom();
        break;

      case 'navigation':
        // Calling `_onResize()` instead of `_updateNavigation()` as adding/
        // removing navigation buttons causes the slidesWrapper to resize.
        this._onResize();
        break;

      case 'pagination':
        this._updatePagination();
        break;

      case 'disable-drag':
        this._updateDragEventListeners();
        break;

      case 'slides-per-view':
        if (this._slides.length === 0) {
          return;
        }

        const parsedSlidesPerView = parseInt(newValue, 10);

        // Accept only numbers greater than `1`.
        if (!Number.isFinite(parsedSlidesPerView) ||
            parsedSlidesPerView < 1) {
          this.slidesPerView = oldValue;
          return;
        }

        this.update();
        break;

      case 'reduced-motion':
        if (newValue !== null) {
          this._disableWrapperTransitions();
        } else {
          this._enableWrapperTransitions();
        }
        break;
    }
  }

  /**
   * The 0-based index of the selected slide.
   * @type {number}
   * @default 0
   */
  set selected(index) {
    intSetter(this, 'selected', index);
  }

  get selected() {
    return intGetter(this, 'selected');
  }

  /**
   * Whether the slider is looping (e.g wrapping around).
   * @type {boolean}
   * @default false
   */
  set loop(flag) {
    booleanSetter(this, 'loop', flag);
  }

  get loop() {
    return booleanGetter(this, 'loop');
  }

  /**
   * Whether the navigation buttons (prev/next) are shown.
   * @type {boolean}
   * @default false
   */
  set navigation(flag) {
    booleanSetter(this, 'navigation', flag);
  }

  get navigation() {
    return booleanGetter(this, 'navigation');
  }

  /**
   * Whether the pagination indicators are shown.
   * @type {boolean}
   * @default false
   */
  set pagination(flag) {
    booleanSetter(this, 'pagination', flag);
  }

  get pagination() {
    return booleanGetter(this, 'pagination');
  }

  /**
   * If true, the slides can not be dragged with pointer events.
   * @type {boolean}
   * @default false
   */
  set disableDrag(flag) {
    booleanSetter(this, 'disable-drag', flag);
  }

  get disableDrag() {
    return booleanGetter(this, 'disable-drag');
  }

  /**
   * The number of slides seen at once in the slider
   * @type {number}
   * @default 1
   */
  set slidesPerView(index) {
    intSetter(this, 'slides-per-view', index);
  }

  get slidesPerView() {
    return intGetter(this, 'slides-per-view', 1);
  }

  /**
   * If true, disables CSS transitions and drag deceleration.
   * @type {boolean}
   * @default false
   */
  set reducedMotion(flag) {
    booleanSetter(this, 'reduced-motion', flag);
  }

  get reducedMotion() {
    return booleanGetter(this, 'reduced-motion');
  }

  /**
   * If true, newly selected slides will focused automatically. This will likely
   * move the page so that the slide is completely in view.
   * @type {boolean}
   * @default false
   */
  set autoFocus(flag) {
    booleanSetter(this, 'auto-focus', flag);
  }

  get autoFocus() {
    return booleanGetter(this, 'auto-focus');
  }


  // ===========================================================================
  // Layout-related
  // ===========================================================================

  /**
   * Disables CSS transitions on the slide wrapper. Useful when dragging and
   * resizing.
   * @private
   */
  _disableWrapperTransitions() {
    this.removeAttribute('transitioning');
    this._transitioning = false;
    this._slidesWrapper.removeEventListener('transitionend', this, false);
  }

  /**
   * Enables CSS transitions on the slide wrapper.
   * @private
   */
  _enableWrapperTransitions() {
    if (this.reducedMotion) {
      return;
    }

    // Double rAF is necessary to wait for 'selected' to take effect.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.setAttribute('transitioning', '');
        this._transitioning = true;
        this._slidesWrapper.addEventListener('transitionend', this, false);
      });
    });
  }

  /**
   * Updated the UI when the window resizes.
   * @private
   */
  _onResize() {
    // Debouncing resize.
    clearTimeout(this._resizeTimer);
    this._disableWrapperTransitions();
    this._resizeTimer = setTimeout(() => {
      this.update();
      this._enableWrapperTransitions();
    }, 100);
  }

  /**
   * Computes a few value needed to lay out the UI.
   * @private
   */
  _computeSizes() {
    this._wrapperWidth = this._slidesWrapper.getBoundingClientRect().width;
    this._slidesGap = this._getSlidesGap();
    this._slidesWidth = this._getSlideWidth();
  }

  /**
   * Computes the width of one slide given the layout constraint.
   * @returns {number} The width of one slide.
   * @private
   */
  _getSlideWidth() {
    return (this._wrapperWidth - (this.slidesPerView - 1) * this._slidesGap) /
        this.slidesPerView;
  }

  /**
   * Computes the slide gap value from CSS.
   * @returns {number} The width of the gap between slides.
   * @private
   */
  _getSlidesGap() {
    const parsedGap = parseInt(
        getComputedStyle(this._slides[0].element)['margin-right'], 10);
    return !Number.isFinite(parsedGap) ? 0 : parsedGap;
  }

  /**
   * Updates the internal CSS variable used to lay out the slides.
   * @private
   */
  _computeSlidesPerViewLayout() {
    if (this._slides.length === 0) {
      return;
    }

    // Used to compute the slides's width.
    this._slidesWrapper.style.setProperty(
        '--x-slider__internal__slides-per-view', this.slidesPerView);

    // Recompute the index of the last view (aka max value for `selected`).
    this._lastViewIndex = this._wrapAround ? this._slides.length - 1 :
        this._computeLastViewIndex();
    // TODO: check if the wrapAround check makes sense. The idea is to not force
    // a new value for selected in case the slider is wrapping around. But
    // probably we need to recompute slide positions and translate to them
    if (!this._wrapAround && this.selected > this._lastViewIndex) {
      this.selected = this._lastViewIndex;
    }
  }

  /**
   * Computes how many views there could be if the slider didn't wrap around.
   * @return {number} The index of the last view.
   * @private
   */
  _computeLastViewIndex() {
    return Math.max(0, this._slides.length - this.slidesPerView);
  }


  /**
   * Extracts the slide's data index (i.e. between 0 and this._slides.lenght -1)
   * from its layoutIndex.
   * @param {number} layoutIndex The slide's layoutIndex
   * @return {number} The slide's data index.
   * @private
   */
  _getSlideDataIndexFromLayoutIndex(layoutIndex) {
    if (this._slides.length === 0) {
      return;
    }

    let positiveLayoutIndex = layoutIndex;
    while (positiveLayoutIndex < 0) {
      positiveLayoutIndex += this._slides.length;
    }
    return positiveLayoutIndex % this._slides.length;
  }

  /**
   * Shifts the slides to the new position needed.
   * @param {Array<number>} slidesInViewIndexes Layout indexes of the slides
   * that will be seen during the next slider transition.
   * @param {boolean} [force=false] A value of true forces all slides to update.
   * @private
   */
  _shiftSlides(slidesInViewIndexes, force = false) {
    if (this._slides.length === 0) {
      return;
    }

    let dataIndex;
    slidesInViewIndexes.forEach(inViewIndex => {
      if (force ||
          !this._slides.find(slide => slide.layoutIndex === inViewIndex)) {
        // Correctly compute dataIndex also when it's negative.
        dataIndex = this._getSlideDataIndexFromLayoutIndex(inViewIndex);

        this._slides[dataIndex].layoutIndex = inViewIndex;
        this._slides[dataIndex].position =
            this._computeSlidePosition(inViewIndex);
        // Using (dataIndex - inViewIndex) instead of (inViewIndex - dataIndex)
        // to compensate for the "-" in the this._computeSlidePosition function.
        this._slides[dataIndex].element.style.transform = `translateX(${
            this._computeSlidePosition(dataIndex - inViewIndex)}px)`;
      }
    });
  }

  /**
   * Computes the slide's position along the x axis given its index.
   * @param {number} slideIndex
   * @return {number} The view's position (in px).
   * @private
   */
  _computeSlidePosition(slideIndex) {
    return - slideIndex * (this._slidesWidth + this._slidesGap);
  }

  /**
   * Updates the wrapper's translateX property (ie. shows a different view).
   * @param {number} tx The value (in px) for the wrapper's translateX property.
   * @private
   */
  _setWrapperTranslateX(tx) {
    this._slidesWrapper.style.transform = `translate3d(${tx}px, 0, 0)`;
    this._wrapperTranslateX = tx;
  }

  /**
   * Translates the slider to show the target view.
   * @param {number} targetView The view to slide to.
   * @private
   */
  _slideTo(targetView) {
    if (!this._slidesWrapper || this._decelerating) {
      return;
    }

    this._setWrapperTranslateX(this._slides[targetView].position);
  }

  /**
   * Moves the focus to the selected slide.
   * @private
   */
  _focusSelectedSlide() {
    if (this._slides.length === 0 || !this.autoFocus) {
      return;
    }

    this._slides[this.selected].element.focus();
  }

  /**
   * Updates the `aria-hidden` and `inert` attributes on the slides.
   * @private
   */
  _updateSlidesA11y() {
    const slidesInView = [];
    for (let i = 0; i < this.slidesPerView; i++) {
      slidesInView.push((this.selected + i) % this._slides.length);
    }

    // Set aria-hidden to false only for the slides whose indexes are included
    // in the slidesInView array.
    let isSlideInView;
    this._slides.map(slide => slide.element).forEach((slideEl, slideIndex) => {
      isSlideInView = typeof slidesInView
          .find(i => i === slideIndex) !== 'undefined';
      // Slides in view have `aria-hidden` set to `false`.
      slideEl.setAttribute('aria-hidden', isSlideInView ? 'false' : 'true');
      // Slides in view don't have the `inert` attribute and can be focused.
      if (isSlideInView) {
        slideEl.removeAttribute('inert');
        slideEl.setAttribute('tabindex', -1);
      } else {
        slideEl.setAttribute('inert', '');
      }
    });
  }

  /**
   * Updates the pagination indicators (depending on the current value of
   * `pagination`) to reflect the current number of views and the selected view.
   * @private
   */
  _updatePagination() {
    if (!this._paginationSlot || this._slides.length === 0) {
      return;
    }

    if (!this.pagination || (this.pagination &&
        this._paginationSlot.assignedNodes().length !==
        this._lastViewIndex + 1)) {
      // Remove all the assignedNodes of pagination slot and their ev listeners
      this._paginationIndicators.forEach(indicatorEl => {
        indicatorEl.removeEventListener('click', this);
        this.removeChild(indicatorEl);
      });
      this._paginationIndicators.length = 0;
    }

    if (this.pagination) {
      // Create dom for pagination indicators
      if (this._paginationSlot.assignedNodes().length !==
          this._lastViewIndex + 1) {
        const frag = document.createDocumentFragment();
        for (let i = 0; i <= this._lastViewIndex; i++) {
          const btn = document.createElement('button');
          btn.textContent = i;
          btn.setAttribute('slot', 'paginationSlot');
          btn.setAttribute('aria-label', `Go to item ${i + 1}`);
          btn.addEventListener('click', this);

          frag.appendChild(btn);
          this._paginationIndicators.push(btn);
        }
        this.appendChild(frag);
      }

      // Update `disabled` to highlight the selected slide.
      this._paginationIndicators.forEach((btn, index) => {
        if (index === this.selected) {
          btn.classList.add('disabled');
        } else {
          btn.classList.remove('disabled');
        }
      });
    }
  }

  /**
   * Called when any pagination bullet point is selected.
   * @param {Event} e The 'change' event fired by the radio input.
   * @private
   */
  _onPaginationClicked(e) {
    this.selected = parseInt(e.target.textContent, 10);
  }

  /**
   * Creates a navigation button element.
   * @param {string} id The id of the button element.
   * @returns {HTMLButtonElement} The button element.
   * @private
   */
  _createNavigationButton(id) {
    const btn = document.createElement('button');
    btn.setAttribute('id', id);
    btn.setAttribute('slot', 'navigationSlot');
    btn.addEventListener('click', this);
    return btn;
  }

  /**
   * Updates the navigation buttons (prev/next) depending on the value of
   * `navigation`, `loop` and the currently selected view.
   * @private
   */
  _updateNavigation() {
    if (!this._navigationSlot || this._slides.length === 0) {
      return;
    }

    if (!this.navigation || (this.navigation &&
        this._navigationSlot.assignedNodes().length !== 2)) {
      // remove all navigation slot assigned nodes and their ev listeners
      this._navigationSlot.assignedNodes().forEach(button => {
        button.removeEventListener('click', this);
        this.removeChild(button);
      });

      this._prevButton = undefined;
      this._nextButton = undefined;
    }

    if (this.navigation) {
      if (this._navigationSlot.assignedNodes().length !== 2) {
        // add buttons and add ev listeners
        this._prevButton = this._createNavigationButton('previous');
        this.appendChild(this._prevButton);

        this._nextButton = this._createNavigationButton('next');
        this.appendChild(this._nextButton);
      }

      // update `disabled`
      this._prevButton.disabled =
          !this.loop && this.selected === 0;
      this._nextButton.disabled =
          !this.loop && this.selected === this._lastViewIndex;

      // update 'aria-label'
      this._prevButton.setAttribute('aria-label', `Go to ${
         this.loop && this.selected === 0 ? 'last' : 'previous'} item`);
      this._nextButton.setAttribute('aria-label', `Go to ${
          this.loop && this.selected === this._lastViewIndex ? 'first' : 'next'
          } item`);
    }
  }

  /**
   * Decides whether to wrapAround or not based on the number of views.
   * @private
   */
  _updateWrapAround() {
    // this._computeLastViewIndex() > 1 means that there are at least 2 slides
    // more than the number of slides in view. 2 extra slides are need in
    // order to successfully shift the slides and simulate an infinite loop.
    this._wrapAround = this.loop && this._computeLastViewIndex() > 1;

    // TODO: apply consequences (if there's any).
  }


  // ===========================================================================
  // Slides slot
  // ===========================================================================

  /**
   * Gets the elements in the light DOM (assignedNodes() of #slidesSlot).
   * @returns {Array<SlideInfo>} Info about the slides found in #slidesSlot.
   * @private
   */
  _getSlides() {
    // Get light DOM in #slidesSlot, keep only Element nodes,
    // create a SlideInfo object out of it.
    return this._slidesSlot.assignedNodes()
        .filter(node => node.nodeType === Node.ELEMENT_NODE)
        .map((node, index) => ({
          element: node,
          layoutIndex: index,
          position: this._computeSlidePosition(index),
        })) || [];
  }

  /**
   * Updates the slider to react to DOM changes in #slidesSlot.
   * @private
   */
  _onSlidesSlotChange() {
    this._slides = this._getSlides();
    this._slides.forEach(slide => {
      slide.element.setAttribute('tabindex', -1);
      slide.element.setAttribute('role', 'listitem');
    });

    this.update();
  }


  // ===========================================================================
  // aria-live region
  // ===========================================================================
  /**
   * Updates the aria-live region, used to notify screen readers.
   * @private
   */
  _updateAriaLiveDom() {
    if (!this._ariaSlot || this._slides.length === 0) {
      return;
    }

    if (this._ariaSlot.assignedNodes().length !== 1) {
      this._ariaLiveRegion = document.createElement('div');
      this._ariaLiveRegion.setAttribute('slot', 'ariaSlot');
      this._ariaLiveRegion.setAttribute('aria-live', 'polite');
      this._ariaLiveRegion.setAttribute('aria-atomic', 'true');
      this.appendChild(this._ariaLiveRegion);
    }

    const firstSlideIndex = this._slides[this.selected].layoutIndex;
    let slidesIndexesString = '';
    for (let i = 0; i < this.slidesPerView; i++) {
      slidesIndexesString += (firstSlideIndex + i) % this._slides.length + 1;
      if (i < this.slidesPerView - 2) {
        slidesIndexesString += ', ';
      } else if (i < this.slidesPerView - 1) {
        slidesIndexesString += ' and ';
      }
    }
    this._ariaLiveRegion.textContent = `
Item${this.slidesPerView > 1 ? 's' : ''} ${slidesIndexesString}
of ${this._slides.length}`;
  }


  // ===========================================================================
  // Pointer events + drag
  // ===========================================================================

  /**
   * Add/remove event listeners for pointer interactions.
   * @private
   */
  _updateDragEventListeners() {
    if (this.disableDrag) {
      this._externalWrapper.removeEventListener('touchstart', this);
      this._externalWrapper.removeEventListener('mousedown', this);
    } else {
      this._externalWrapper.addEventListener('touchstart', this);
      this._externalWrapper.addEventListener('mousedown', this);
    }
  }

  /**
   * Begins to track pointer events in order to drag the wrapper.
   * @param {NormalisedPointerEvent} e The normalised pointer event.
   * @private
   */
  _onPointerDown(e) {
    if (!this._isPointerActive) {
      this._decelerating = false;
      this._isPointerActive = true;
      this._pointerId = e.id;
      this._pointerFirstX = this._pointerLastX = this._pointerCurrentX = e.x;
      this._pointerFirstY = this._pointerLastY = this._pointerCurrentY = e.y;
      this._lastDraggedLayoutIndex = this._slides[this.selected].layoutIndex;

      this._trackingPoints = [];
      this._addTrackingPoint(this._pointerLastX);

      window.addEventListener('touchmove', this, getEvtListenerOptions(false));
      window.addEventListener('mousemove', this, getEvtListenerOptions(false));
      window.addEventListener('mouseup', this);
      window.addEventListener('touchend', this);
      window.addEventListener('touchcancel', this);

      this.setAttribute('pointer-down', '');
    }
  }

  /**
   * Tracks the pointer movement and reflects it to the UI.
   * @param {NormalisedPointerEvent} e The normalised pointer event.
   * @private
   */
  _onPointerMove(e) {
    // Checking the pointer id avoids running the same code twice
    // in case of touch screens.
    if (this._isPointerActive && e.id === this._pointerId) {
      // Always update the current value of the pointer.
      // Once per frame, it gets consumed and becomes the last value.
      this._pointerCurrentX = e.x;
      this._pointerCurrentY = e.y;

      // Prevent default only if dragging horizontally.
      if (Math.abs(this._pointerCurrentX - this._pointerFirstX) >
          Math.abs(this._pointerCurrentY - this._pointerFirstY)) {
        e.event.preventDefault();
      }

      this._addTrackingPoint(this._pointerLastX);

      this._disableWrapperTransitions();

      this._requestDragTick();
    }
  }

  /**
   * Stops the pointer tracking.
   * @param {NormalisedPointerEvent} e The normalised pointer event.
   * @private
   */
  _onPointerEnd(e) {
    if (this._isPointerActive && e.id === this._pointerId) {
      this._stopPointerTracking();
    }
  }

  /**
   * Stops the tracking of pointer events, resets the dragging logic,
   * and possibly starts the deceleration.
   * @private
   */
  _stopPointerTracking() {
    this._isPointerActive = false;
    this._pointerId = undefined;

    this._addTrackingPoint(this._pointerLastX);

    this.removeAttribute('pointer-down');

    window.removeEventListener('touchmove', this);
    window.removeEventListener('mousemove', this);
    window.removeEventListener('touchend', this);
    window.removeEventListener('mouseup', this);
    window.removeEventListener('touchcancel', this);

    this._startDecelerating();
  }

  /**
   * Stores the last 100ms worth of tracking data from pointer events.
   * @param {number} x The x coordinate value to strore
   * @private
   */
  _addTrackingPoint(x) {
    const time = Date.now();
    // Keep only data from the last 100ms
    while (this._trackingPoints.length > 0) {
      if (time - this._trackingPoints[0].time <= 100) {
        break;
      }
      this._trackingPoints.shift();
    }

    this._trackingPoints.push({x, time});
  }

  /**
   * Updates the UI once per animation frame.
   * @private
   */
  _requestDragTick() {
    if (!this._dragTicking) {
      requestAnimationFrame(this._updateDragPosition.bind(this));
    }
    this._dragTicking = true;
  }

  /**
   * Updates the UI while the user is dragging the slides.
   * @private
   */
  _updateDragPosition() {
    // Current position + the amount of drag happened since the last rAF.
    const newPosition = this._wrapperTranslateX +
        this._pointerCurrentX - this._pointerLastX;

    // Get the slide that we're dragging onto.
    let slideIndex;
    let slidePosition;
    this._slides.forEach((slideObj, index) => {
      if (slideObj.position >= newPosition &&
          (typeof slidePosition === 'undefined' ||
              slideObj.position < slidePosition)) {
        slidePosition = slideObj.position;
        slideIndex = index;
      }
    });

    if (this._wrapAround) {
      let firstLayoutIndex;

      // Sometimes there's no slide to the left of the current one - in that
      // case, slideIndex would be undefined.
      if (typeof slideIndex === 'undefined') {
        // Get the leftmost slide - the one we just left to the pointer's right.
        const leftMostSlide = this._slides.slice(0)
            .sort((a, b) => a.layoutIndex > b.layoutIndex)[0];
        // Compute the slideIndex as a valid index for this._slides.
        slideIndex = leftMostSlide.layoutIndex - 1;
        while (slideIndex < 0) {
          slideIndex += this._slides.length;
        }
        slideIndex = slideIndex % this._slides.length;
        // Compute firstLayoutIndex.
        firstLayoutIndex = leftMostSlide.layoutIndex - 2;
      } else {
        // If slideIndex is defined, firstLayoutIndex is easy to compute.
        firstLayoutIndex = this._slides[slideIndex].layoutIndex - 1;
      }

      // Updated (shift) slides.
      const slidesToShift = [];
      const lastLayoutIndex = firstLayoutIndex + this.slidesPerView + 2;
      for (let i = firstLayoutIndex; i < lastLayoutIndex; i++) {
        slidesToShift.push(i);
      }
      this._shiftSlides(slidesToShift);
    } else {
      // When _wrapAround is disabled, if we drag to the left of the first
      // slide, the algorithm can't find a value for slideIndex (as indexes
      // don't go negative in that case).
      slideIndex = slideIndex || 0;
    }

    this._lastDraggedLayoutIndex = this._slides[slideIndex].layoutIndex;

    this._setWrapperTranslateX(newPosition);

    this._pointerLastX = this._pointerCurrentX;
    this._pointerLastY = this._pointerCurrentY;
    this._dragTicking = false;
  }

  /**
   * Computes the initial parameters of the deceleration.
   * @private
   */
  _startDecelerating() {
    this._decelerating = true;

    const lastPoint = this._trackingPoints[this._trackingPoints.length - 1];
    const firstPoint = this._trackingPoints[0];
    const diffX = (lastPoint.x - firstPoint.x) || 0;

    this._selectedIteration =
        Math.floor(this._lastDraggedLayoutIndex / this._slides.length);

    const currentSlideIndex =
        this._getSlideDataIndexFromLayoutIndex(this._lastDraggedLayoutIndex);

    if (diffX === 0) {
      this._decelVelocity = 0;

      // If the user's pointer was not moving, pick the new selected slide
      // based on the pointer's position.
      // Because currentSlideIndex is the slide the pointer is currently onto,
      // distToCurrent is always going to be positive.
      const distToCurrent = this._slides[currentSlideIndex].position -
          this._wrapperTranslateX;
      this.selected = distToCurrent > this._slidesWidth / 2 ?
          this._computeNext(currentSlideIndex) : currentSlideIndex;
    } else {
      this._decelVelocity = clampAbs(diffX,
          this._minDecelVelocity, this._maxDecelVelocity);

      let slidesToMove = 1;
      this._slidesToMoveVelocityThresholds.forEach(threshold => {
        if (Math.abs(diffX) > threshold) {
          slidesToMove += 1;
        }
      });

      // If dragging left, we subtract 1 to slidesToMove, as the current slide
      // would already be a previous slide with respect to where we started
      // dragging from.
      if (diffX > 0) {
        slidesToMove -= 1;
      }

      // Finally, apply next/prev for [slidesToMove] times and set the new value
      // of selected.
      let targetSlide = currentSlideIndex;
      for (let i = 0; i < slidesToMove; i++) {
        targetSlide = diffX < 0 ? this._computeNext(targetSlide) :
            this._computePrevious(targetSlide);
      }
      this.selected = targetSlide;
    }

    requestAnimationFrame(this._decelerationStep.bind(this));
  }

  /**
   * Animates the slider while updating the deceleration velocity.
   * @private
   */
  _decelerationStep() {
    if (!this._decelerating) {
      return;
    }

    const snapX = this._slides[this.selected].position;

    // Apply attraction: it moves the slider towards the target.
    // Attraction is bigger when the slide is further away.
    this._decelVelocity += this._attraction * (snapX - this._wrapperTranslateX);
    // Apply friction: friction slows down the slider.
    this._decelVelocity *= this._friction;

    const newPosition = this._wrapperTranslateX + this._decelVelocity;

    // Keep animating until the carousel is close to the snapping point
    // with a very small veloity. This results in a springy effect.
    // Do not animate if the reduced-motion mode is enabled.
    const tooFarOrTooFast = Math.abs(snapX - newPosition) >= 1 ||
        Math.abs(this._decelVelocity) >= 1;
    if (tooFarOrTooFast && !this.reducedMotion) {
      this._setWrapperTranslateX(newPosition);
      requestAnimationFrame(this._decelerationStep.bind(this));
    } else {
      this._setWrapperTranslateX(snapX);
      this._decelerating = false;
      this._enableWrapperTransitions();

      requestAnimationFrame(() => {
        this._updateSlidesA11y();
        this._focusSelectedSlide();
        this._updateAriaLiveDom();
      });
    }
  }
}

window.customElements.define('x-slider', XSlider);

}());
