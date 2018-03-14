import {booleanSetter, booleanGetter} from '../utils';

/**
 * A generic button.
 */
export default (template) => class XSliderButton extends HTMLElement {
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
    this.shadowRoot.appendChild(template.content.cloneNode(true));
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

    this._upgradeProperty('disabled');

    this.addEventListener('keydown', this);
    this.addEventListener('click', this);
  }

  /**
   * Used for upgrading properties in case this element is upgraded lazily.
   * See web/fundamentals/architecture/building-components/best-practices#lazy-properties
   * @param {*} prop
   * @private
   */
  _upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      const value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  /**
   * An array of the observed attributes.
   * @static
   */
  static get observedAttributes() {
    return [
      'disabled',
    ];
  }

  /**
   * Whether the button is disabled.
   * @type {boolean}
   * @default false
   */
  set disabled(flag) {
    booleanSetter(this, 'disabled', flag);
  }

  get disabled() {
    return booleanGetter(this, 'disabled');
  }

  /**
   * Called whenever an observedAttribute's value changes.
   * @param {string} name The attribute's local name.
   * @param {*} oldValue The attribute's previous value.
   * @param {*} newValue The attribute's new value.
   * @private
   */
  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'disabled':
        if (oldValue === newValue) {
          return;
        }

        if (this.disabled) {
          this._defaultTabIndex = this.getAttribute('tabindex');
          this.removeAttribute('tabindex');
          this.setAttribute('aria-disabled', 'true');
        } else {
          this.setAttribute('tabindex', this._defaultTabIndex);
          this.setAttribute('aria-disabled', 'false');
        }
        break;
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
    if (this.disabled) {
      e.preventDefault();
      return;
    }

    // Click
    if (e.type === 'click') {
      this._onClick && this._onClick();

    // Space / Enter
    } else if (e.type === 'keydown' &&
        (e.keyCode === 32 || e.keyCode === 13)) {
      // preventDefault called to avoid page scroll when hitting spacebar.
      e.preventDefault();
      this._onClick && this._onClick();
    }
  }
};
