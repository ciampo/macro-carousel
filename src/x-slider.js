(function() {
/**
 * Markup and styles.
 */
const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      position: relative;

      display: flex;
      flex-direction: column;
      align-items: stretch;

      contain: content;

      --x-slider-pagination-height: 2rem;
    }

    :host([hidden]) {
      display: none
    }

    #externalWrapper {
      overflow: hidden;
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

      height: var(--x-slider-pagination-height);
    }

    ::slotted(*) {
      flex: 1 0 100%;
    }

    #previous,
    #next {
      position: absolute;
      top: calc(50% - var(--x-slider-pagination-height) / 2);
      transform: translateY(-50%);
    }

    #previous {
      left: 0;
    }

    #next {
      right: 0;
    }
  </style>

  <div id="externalWrapper">
    <div id="slidesWrapper">
      <slot id="slidesSlot"><p>No content available</p></slot>
    </div>
  </div>

  <div id="navigation"></div>

  <div id="pagination"></div>
`;

/**
 * XSlider definition.
 */
class XSlider extends HTMLElement {
  static get observedAttributes() {
    return ['selected', 'loop', 'navigation'];
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

    // Grab references to elements in the shadow DOM.
    this._slidesWrapper = this.shadowRoot.querySelector('#slidesWrapper');
    this._slidesSlot = this.shadowRoot.querySelector('#slidesSlot');
    this._paginationWrapper = this.shadowRoot.querySelector('#pagination');
    this._navigationWrapper = this.shadowRoot.querySelector('#navigation');
    this._prevButton = undefined;
    this._nextButton = undefined;
  }

  /**
   * Fires when the element is inserted into the DOM.
   * It's a good place to set the initial `role`, `tabindex`, internal state,
   * and install event listeners.
   */
  connectedCallback() {
    // Get Light Dom.
    this._slides = this._getSlides();

    // Setup the component.
    this._upgradeProperty('selected');
    this._upgradeProperty('loop');
    this._upgradeProperty('navigation');

    this._slideTo(this.selected);
    this._updatePagination();
    this._updateNavigation();

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
   * @param {Event} e Any event.
   */
  handleEvent(e) {
    if (e.target.name === 'x-slider-pagination') {
      this._onPaginationChange(e);
    } else if (e.target === this._slidesSlot) {
      this._onSlotChange();
    } else if (this.navigation && e.target === this._prevButton) {
      this.previous();
    } else if (this.navigation && e.target === this._nextButton) {
      this.next();
    }
  }

  /**
   * Fires when the element is removed from the DOM.
   * It's a good place to do clean up work like releasing references and
   * removing event listeners.
   */
  disconnectedCallback() {
    this._slidesSlot.removeEventListener('slotchange', this);

    if (this.navigation) {
      this._prevButton.removeEventListener('click', this);
      this._nextButton.removeEventListener('click', this);
    }

    const pagination = this.shadowRoot
        .querySelectorAll('input[name="x-slider-pagination"]');
    pagination.forEach(p => {
      p.removeEventListener('change', this);
    });
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

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'selected':
        if (!this._slides || this._slides.length === 0) {
          return;
        }

        const parsed = parseInt(newValue, 10);

        // Accept only numbers between `0` and `this._slides.length - 1`.
        if (!Number.isFinite(parsed) ||
            parsed >= this._slides.length ||
            parsed < 0) {
          this.selected = oldValue;
          return;
        }

        // Show the new selected slide and update pagination.
        this._slideTo(parsed);
        this._updatePagination();
        this._updateNavigation();
        break;
      case 'loop':
        this._updateNavigation();
        break;
      case 'navigation':
        this._updateNavigation();
        break;
    }
  }

  /**
   * Reflects the property to its corresponding attribute.
   * @param {number} i The 0-based index of the selected slide.
   */
  set selected(index) {
    this.setAttribute('selected', index);
  }

  /**
   * Gets the property's value from the corresponding attribute.
   * @return {number} The 0-based index of the selected slide.
   */
  get selected() {
    const value = this.getAttribute('selected');
    return value === null ? 0 : parseInt(value);
  }

  /**
   * Reflects the property to its corresponding attribute.
   * @param {boolean} flag True to make the slider loop, false to disable it.
   */
  set loop(flag) {
    if (flag) {
      this.setAttribute('loop', '');
    } else {
      this.removeAttribute('loop');
    }
  }

  /**
   * Gets the property's value from the corresponding attribute.
   * @return {boolean} True if the slider is looping, false otherwise.
   */
  get loop() {
    return this.hasAttribute('loop');
  }

  /**
   * Reflects the property to its corresponding attribute.
   * @param {boolean} flag True to show navigation buttons, false to disable it.
   */
  set navigation(flag) {
    if (flag) {
      this.setAttribute('navigation', '');
    } else {
      this.removeAttribute('navigation');
    }
  }

  /**
   * Gets the property's value from the corresponding attribute.
   * @return {boolean} True if navigation buttons are shown, false otherwise.
   */
  get navigation() {
    return this.hasAttribute('navigation');
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

    this._slideTo(this.selected);
    this._updatePagination();
    this._updateNavigation();
  }

  /**
   * Updates the pagination to relect the current number of slides,
   * and highlights the bullet point correponsing to the selected slide.
   */
  _updatePagination() {
    if (!this._paginationWrapper || !this._slides ||
        this._slides.length === 0) {
      return;
    }

    const currentSlide = this.selected;

    // Update the number of bullet points
    if (this._paginationWrapper.childElementCount !== this._slides.length) {
      // Remove bullet points
      // TODO: optimise by:
      // - keeping a reference to the radio buttons (useful for removing ev listeners)
      // - add/remove only what necessary
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
        radio.setAttribute('value', i);
        radio.setAttribute('aria-label', `Go to view ${i + 1}`);
        radio.checked = i === currentSlide;
        radio.addEventListener('change', this);

        frag.appendChild(radio);
      });
      this._paginationWrapper.appendChild(frag);
    } else {
      Array.from(this._paginationWrapper.childNodes).forEach((radio, i) => {
        radio.checked = i === currentSlide;
      });
    }
  }

  _updateNavigation() {
    if (!this._navigationWrapper || !this._slides ||
        this._slides.length === 0) {
      return;
    }

    if (!this.navigation ||
        (this.navigation && this._navigationWrapper.childElementCount !== 2)) {
      // remove all children of nav wrapper and their ev listeners
      while (this._navigationWrapper.firstChild) {
        this._navigationWrapper.firstChild.removeEventListener('click', this);
        this._navigationWrapper.removeChild(this._navigationWrapper.firstChild);

        this._prevButton = undefined;
        this._nextButton = undefined;
      }
    }

    if (this.navigation) {
      if (this._navigationWrapper.childElementCount !== 2) {
        // add buttons and add ev listeners
        this._prevButton = document.createElement('button');
        this._prevButton.setAttribute('aria-label', 'To previous view');
        this._prevButton.setAttribute('id', 'previous');
        this._prevButton.textContent = '<';
        this._prevButton.addEventListener('click', this);
        this._navigationWrapper.appendChild(this._prevButton);

        this._nextButton = document.createElement('button');
        this._nextButton.setAttribute('aria-label', 'To next view');
        this._nextButton.setAttribute('id', 'next');
        this._nextButton.textContent = '>';
        this._nextButton.addEventListener('click', this);
        this._navigationWrapper.appendChild(this._nextButton);
      }

      // update disabled
      if (!this.loop && this.selected === 0) {
        this._prevButton.setAttribute('disabled', '');
      } else {
        this._prevButton.removeAttribute('disabled');
      }
      if (!this.loop && this.selected === this._slides.length - 1) {
        this._nextButton.setAttribute('disabled', '');
      } else {
        this._nextButton.removeAttribute('disabled');
      }
    }
  }

  /**
   * Called when any pagination bullet point is selected.
   * @param {Event} e The 'change' event fired by the radio input.
   */
  _onPaginationChange(e) {
    this.selected = e.target.getAttribute('value');
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
   * Selects the slide preceding the currently selected one.
   * If the currently selected slide is the first slide and the loop
   * functionality is disabled, nothing happens.
   */
  previous() {
    if (this.selected > 0) {
      this.selected -= 1;
    } else if (this.loop) {
      this.selected = this._slides.length - 1;
    }
  }

  /**
   * Selects the slide following the currently selected one.
   * If the currently selected slide is the last slide and the loop
   * functionality is disabled, nothing happens.
   */
  next() {
    if (this.selected < this._slides.length - 1) {
      this.selected += 1;
    } else if (this.loop) {
      this.selected = 0;
    }
  }

  /**
   * Translates the slider to show the target slide.
   * @param {number} targetSlide The slide to slide to.
   */
  _slideTo(targetSlide) {
    if (!this._slidesWrapper) {
      return;
    }

    this._slidesWrapper.style.transform = `translateX(${- targetSlide * 100}%)`;
  }
}

window.customElements.define('x-slider', XSlider);
})();
