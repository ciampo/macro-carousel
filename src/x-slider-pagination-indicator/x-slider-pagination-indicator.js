import indicatorHtml from './x-slider-pagination-indicator.html';
import indicatorStyles from './x-slider-pagination-indicator.css';

const _indicatorTemplate = document.createElement('template');
_indicatorTemplate.innerHTML =
    `<style>${indicatorStyles}</style> ${indicatorHtml}`;

if (window.ShadyCSS) {
  window.ShadyCSS.prepareTemplate(_indicatorTemplate,
      'x-slider-pagination-indicator');
}

/**
 * A pagination indicator button.
 */
class XSliderPaginationIndicator extends HTMLElement {
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
    this.shadowRoot.appendChild(_indicatorTemplate.content.cloneNode(true));
  }

  /**
   * `connectedCallback()` fires when the element is inserted into the DOM.
   * It's a good place to set the initial `role`, `tabindex`, internal state,
   * and install event listeners.
   */
  connectedCallback() {
    // Shim Shadow DOM styles. This needs to be run in `connectedCallback()`
    // because if you shim Custom Properties (CSS variables) the element
    // will need access to its parent node.
    if (window.ShadyCSS) {
      window.ShadyCSS.styleElement(this);
    }

    this._defaultTabIndex = 0;

    if (!this.hasAttribute('role')) {
      this.setAttribute('role', 'button');
    }

    if (!this.hasAttribute('tabindex')) {
      this.setAttribute('tabindex', this._defaultTabIndex);
    } else {
      this._defaultTabIndex = this.getAttribute('tabindex');
    }

    this.addEventListener('keydown', this);
    this.addEventListener('click', this);
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
    if (this.disabled) {
      e.preventDefault();
      return;
    }

    // Click
    if (e.type === 'click') {
      this._onClick();

    // Space / Enter
    } else if (e.type === 'keydown' &&
        (e.keyCode === 32 || e.keyCode === 13)) {
      // preventDefault called to avoid page scroll when hitting spacebar.
      e.preventDefault();
      this._onClick();
    }
  }

  /**
   * Fired when the selected slide changes.
   * @event XSlider#x-slider-pagination-indicator-clicked
   * @type {Object}
   */

  /**
   * Called when the button is clicked / pressed.
   * @fires XSlider#x-slider-pagination-indicator-clicked
   * @private
   */
  _onClick() {
    this.dispatchEvent(
        new CustomEvent('x-slider-pagination-indicator-clicked'));
  }
}

window.customElements.define('x-slider-pagination-indicator',
    XSliderPaginationIndicator);
