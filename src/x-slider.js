/**
 * Markup and styles.
 */
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: flex;
      flex-direction: column;
      align-items: stretch;

      contain: content;

      overflow: hidden;

      background-color: #ccc;
    }

    :host([hidden]) {
      display: none
    }

    #slidesWrapper {
      display: flex;
      align-items: stretch;

      background-color: #ccc;
    }

    :host([transitioning]) #slidesWrapper {
      will-change: transform;

      transition: .5s transform ease-in-out;
    }

    #pagination {
      align-self: center;
    }

    ::slotted(*) {
      flex: 1 0 100%;

      outline: 1px solid red;
    }
  </style>

  <div id="slidesWrapper">
    <slot id="slidesSlot"><p>No content available</p></slot>
  </div>
  <div id="pagination"></div>
`;

/**
 * XSlider definition.
 */
class XSlider extends HTMLElement {
  static get observedAttributes() {
    return ['selected'];
  }

  /**
   * Runs anytime a new instance is created (in HTML or JS).
   * The construtor is a good place to create shadow DOM, though you should
   * avoid touching any attributes or light DOM children as they may not
   * be available yet.
   * @constructor
   */
  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  /**
   * Fires when the element is inserted into the DOM.
   * It's a good place to set the initial `role`, `tabindex`, internal state,
   * and install event listeners.
   */
  connectedCallback() {
    // Grab references to the DOM.
    this._slidesWrapper = this.shadowRoot.querySelector('#slidesWrapper');
    this._slidesSlot = this.shadowRoot.querySelector('#slidesSlot');
    this._paginationWrapper = this.shadowRoot.querySelector('#pagination');
    this._slides = this._getSlides();

    // Setup the component.
    this.selected = this.getAttribute('initial-slide') || 0;
    this.selected = this.selected || 0;

    this._updatePagination();

    // Enable transitions only after the initial setup.
    // Double rAF is necessary to wait for 'selected' to take effect.
    requestAnimationFrame(_ => {
      requestAnimationFrame(_ => {
        this.setAttribute('transitioning', '');
      });
    });

    // Add event listeners.
    this._slidesSlot.addEventListener('slotchange', this);
  }

  /**
   * Defining handleEvent allows to pass `this` as the callback to every
   * `addEventListener` and `removeEventListener`. This avoids the need of
   * binding every function. See
   * https://medium.com/@WebReflection/dom-handleevent-a-cross-platform-standard-since-year-2000-5bf17287fd38
   *
   * @param {Event} e
   */
  handleEvent(e) {
    if (e.target.name === 'x-slider-pagination') {
      this._onPaginationChange(e);
    } else if (e.target === this._slidesSlot) {
      this._onSlotChange();
    }
  }

  /**
   * Fires when the element is removed from the DOM.
   * It's a good place to do clean up work like releasing references and
   * removing event listeners.
   */
  disconnectedCallback() {
    this._slidesSlot.removeEventListener('slotchange', this);
  }

  /**
   * Used for upgrading properties in case this element is upgraded lazily.
   * See web/fundamentals/architecture/building-components/best-practices#lazy-properties
   * @param {any} prop
   */
  _upgradeProperty(prop) {
    if (this.hasOwnProperty(prop)) {
      let value = this[prop];
      delete this[prop];
      this[prop] = value;
    }
  }

  attributeChangedCallback(attrName, oldVal, newVal) {
    this[attrName] = newVal;
  }

  /**
   * Sets the selected slide and moves it into view.
   * @param {number} i The 0-based index of the selected slide.
   */
  set selected(i) {
    const parsed = parseInt(i, 10);

    if (!Number.isFinite(parsed) ||
        parsed >= this._slides.length ||
        parsed < 0) {
      console.warn(`Can not set selected slide to number ${i}`);
      return;
    }

    if (this._selected === parsed) return;

    this._selected = parsed;
    this.setAttribute('selected', parsed);

    /* Update the DOM as necessary */
    requestAnimationFrame(_ => {
      this._slideTo(this._selected)
      this._updatePagination();
    });
  }

  /**
   * Gets the index of the selected slide.
   * @return {number} The 0-based index of the selected slide.
   */
  get selected() {
    return this._selected;
  }

  /**
   * Called when the content of #slidesSlot changes.
   * Updates the slider to the new number of slides.
   */
  _onSlotChange() {
    this._slides = this._getSlides();

    if (this.selected >= this._slides.length) {
      this.selected = this._slides.length - 1;
    }

    this._updatePagination();
  }

  /**
   * Updates the pagination to relect the current number of slides,
   * and highlights the bullet point correponsing to the selected slide.
   */
  _updatePagination() {
    // Update the number of bullet points
    if (this._paginationWrapper.childElementCount !== this._slides.length) {
      // Remove bullet points (TODO: optimise).
      while (this._paginationWrapper.firstChild) {
        this._paginationWrapper.firstChild.removeEventListener('change', this);
        this._paginationWrapper.removeChild(this._paginationWrapper.firstChild);
      }
      // Add bullet points.
      const frag = document.createDocumentFragment();
      this._slides.forEach((s, i) => {
        const radio = document.createElement('input');
        radio.setAttribute('type', 'radio');
        radio.setAttribute('name', 'x-slider-pagination');
        radio.setAttribute('aria-label', `To slide ${i + 1}`);
        radio.setAttribute('data-slide', i);
        radio.checked = i === this._selected;
        radio.addEventListener('change', this);

        frag.appendChild(radio);
      });
      this._paginationWrapper.appendChild(frag);
    } else {
      Array.from(this._paginationWrapper.childNodes).forEach((radio, i) => {
        radio.checked = i === this._selected;
      });
    }
  }

  _onPaginationChange(e) {
    this.selected = e.target.getAttribute('data-slide');
  }

  /**
   * Gets the elements in the light DOM (assignedNodes() of #slidesSlot).
   * @returns {Array<HTMLElement>} The elements found in #slidesSlot.
   */
  _getSlides() {
    return this._slidesSlot.assignedNodes()
        .filter(n => n.nodeType === Node.ELEMENT_NODE);
  }

  /**
   * Translates the slider to show the target slide.
   * @param {number} targetSlide The slide to slide to.
   */
  _slideTo(targetSlide) {
    this._slidesWrapper.style.transform = `translateX(${- targetSlide * 100}%)`;
  }
}

window.customElements.define('x-slider', XSlider);
