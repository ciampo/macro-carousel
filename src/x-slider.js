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

      --x-slider-gap: 16px;

      --x-slider-transition-duration: 0.5s;
      --x-slider-transition-timing-function: ease-in-out;

      --x-slider-navigation-color: #000;

      --x-slider-pagination-color: #999;
      --x-slider-pagination-color-selected: #000;
      --x-slider-pagination-size: 12px;
      --x-slider-pagination-gap: 8px;
      --x-slider-pagination-height: 32px;

      --x-slider__internal__slides-per-view: 1;
    }

    :host([hidden]) {
      display: none
    }

    #externalWrapper {
      overflow: hidden;

      /*
        https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
      */
      touch-action: pan-y pinch-zoom;
    }

    #slidesWrapper {
      display: flex;
      align-items: stretch;
    }

    :host([transitioning]) #slidesWrapper {
      will-change: transform;

      transition-property: transform;
      transition-duration: var(--x-slider-transition-duration);
      transition-timing-function: var(--x-slider-transition-timing-function);
    }

    #pagination {
      align-self: center;

      display: flex;
      align-items: center;
      justify-content: center;

      height: var(--x-slider-pagination-height);
    }

    #pagination button {
      width: var(--x-slider-pagination-size);
      height: var(--x-slider-pagination-size);

      margin: 0 calc(var(--x-slider-pagination-gap) / 2);

      border: none;
      border-radius: 50%;

      background-color: var(--x-slider-pagination-color);

      font-size: 0;

      cursor: pointer;

      opacity: .8;
    }

    #pagination button:hover,
    #pagination button:focus,
    #pagination button[disabled] {
      opacity: 1;
    }

    #pagination button[disabled] {
      background-color: var(--x-slider-pagination-color-selected);
    }

    ::slotted(*) {
      /* (100% - gap * (slidesPerView - 1)) / slidesPerView */
      flex: 0 0 calc((100% - (var(--x-slider__internal__slides-per-view) - 1) *
          var(--x-slider-gap)) / var(--x-slider__internal__slides-per-view));
      margin-right: var(--x-slider-gap);
    }

    #previous,
    #next {
      position: absolute;
      top: calc(50% - var(--x-slider-pagination-height) / 2);
      transform: translateY(-50%);

      color: var(--x-slider-navigation-color);
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
    return [
      'selected',
      'loop',
      'navigation',
      'pagination',
      'slides-per-view',
    ];
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

    // References to DOM nodes.
    this._externalWrapper = this.shadowRoot.querySelector('#externalWrapper');
    this._slidesWrapper = this.shadowRoot.querySelector('#slidesWrapper');
    this._slidesSlot = this.shadowRoot.querySelector('#slidesSlot');

    this._paginationWrapper = this.shadowRoot.querySelector('#pagination');
    this._paginationIndicators = [];

    this._navigationWrapper = this.shadowRoot.querySelector('#navigation');
    this._prevButton = undefined;
    this._nextButton = undefined;

    this._slides = undefined;

    // State
    this._lastViewIndex = -1;

    // Layout related
    this._wrapperWidth = 0;
    this._slidesGap = 0;
    this._slidesWidth = 0;
    this._resizeTimer = undefined;

    // Touch / drag
    this._pointerActive = false;
    this._pointerId = undefined;
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
    this._upgradeProperty('pagination');
    this._upgradeProperty('slidesPerView');

    this.update();

    // Enable transitions only after the initial setup.
    // Double rAF is necessary to wait for 'selected' to take effect.
    requestAnimationFrame(_ => {
      requestAnimationFrame(_ => {
        this.setAttribute('transitioning', '');
      });
    });

    // Add event listeners.
    this._slidesSlot.addEventListener('slotchange', this);
    window.addEventListener('resize', this,
        this._supportsPassiveEvt ? {passive: true} : false);

    // fixes weird safari 10 bug where preventDefault is prevented
    // @see https://github.com/metafizzy/flickity/issues/457#issuecomment-254501356
    window.addEventListener('touchmove', function() {});
    this._externalWrapper.addEventListener('touchstart', this);
    this._externalWrapper.addEventListener('touchmove', this,
        this._supportsPassiveEvt ? {passive: false} : false);
    this._externalWrapper.addEventListener('touchend', this);
    this._externalWrapper.addEventListener('touchcancel', this);
    this._externalWrapper.addEventListener('mousedown', this);
    this._externalWrapper.addEventListener('mousemove', this,
        this._supportsPassiveEvt ? {passive: false} : false);
    this._externalWrapper.addEventListener('mouseup', this);
    this._externalWrapper.addEventListener('mouseleave', this);
  }

  /**
   * Fires when the element is removed from the DOM.
   * It's a good place to do clean up work like releasing references and
   * removing event listeners.
   */
  disconnectedCallback() {
    this._slidesSlot.removeEventListener('slotchange', this);
    window.removeEventListener('resize', this);

    this._externalWrapper.removeEventListener('touchstart', this);
    this._externalWrapper.removeEventListener('touchmove', this);
    this._externalWrapper.removeEventListener('touchend', this);
    this._externalWrapper.removeEventListener('touchcancel', this);
    this._externalWrapper.removeEventListener('mousedown', this);
    this._externalWrapper.removeEventListener('mousemove', this);
    this._externalWrapper.removeEventListener('mouseup', this);
    this._externalWrapper.removeEventListener('mouseleave', this);

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
   */
  handleEvent(e) {
    // Window resize
    if (e.target === window && e.type === 'resize') {
      this._onResize();

    // Slot change
    } else if (e.target === this._slidesSlot) {
      this._onSlotChange();

    // Pagination indicators
    } else if (this.pagination &&
        this._paginationIndicators.find(el => el === e.target)) {
      this._onPaginationClicked(e);

    // Navigation (prev / next button)
    } else if (this.navigation && e.target === this._prevButton) {
      this.previous();
    } else if (this.navigation && e.target === this._nextButton) {
      this.next();

    // Touch / drag
    } else if (e.type === 'touchstart' || e.type === 'mousedown') {
      this._onPointerDown(this._normalizeEvent(e));
    } else if (e.type === 'touchmove' || e.type === 'mousemove') {
      this._onPointerMove(this._normalizeEvent(e));
    } else if (e.type === 'touchend' || e.type === 'mouseup') {
      this._onPointerEnd(this._normalizeEvent(e));
    } else if (e.type === 'touchcancel' || e.type === 'mouseleave') {
      this._stopPointerTracking();
    }
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

  /**
   * "Forces" an update by sliding the current view in, and updating
   * navigation and pagination.
   */
  update() {
    this._computeSizes();
    this._computeSlidesPerViewLayout();
    this._slideTo(this.selected);
    this._updatePagination();
    this._updateNavigation();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'selected':
        if (!this._slides || this._slides.length === 0) {
          return;
        }

        const parsedSelected = parseInt(newValue, 10);

        // Accept only numbers between `0` and `this._lastViewIndex`.
        if (!Number.isFinite(parsedSelected) ||
            parsedSelected > this._lastViewIndex ||
            parsedSelected < 0) {
          this.selected = oldValue;
          return;
        }

        // Show the new selected slide and update pagination.
        this.update();
        break;

      case 'loop':
        this._updateNavigation();
        break;

      case 'navigation':
        this._updateNavigation();
        break;

      case 'pagination':
        this._updatePagination();
        break;

      case 'slides-per-view':
        if (!this._slides || this._slides.length === 0) {
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
    }
  }

  /**
   * Reflects the property to its corresponding attribute.
   * @param {number} index The 0-based index of the selected slide.
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
    return value === null ? 0 : parseInt(value, 10);
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
   * Reflects the property to its corresponding attribute.
   * @param {boolean} flag True to show pagination indicators, false to disable it.
   */
  set pagination(flag) {
    if (flag) {
      this.setAttribute('pagination', '');
    } else {
      this.removeAttribute('pagination');
    }
  }

  /**
   * Gets the property's value from the corresponding attribute.
   * @return {boolean} True if pagination indicators are shown, false otherwise.
   */
  get pagination() {
    return this.hasAttribute('pagination');
  }

  /**
   * Reflects the property to its corresponding attribute.
   * @param {number} index The number of slides seen at once in the slider.
   */
  set slidesPerView(index) {
    this.setAttribute('slides-per-view', index);
  }

  /**
   * Gets the property's value from the corresponding attribute.
   * @return {number} The number of slides seen at once in the slider.
   */
  get slidesPerView() {
    const value = this.getAttribute('slides-per-view');
    return value === null ? 1 : parseInt(value, 10);
  }

  /**
   * Called when the content of #slidesSlot changes.
   * Updates the slider to the new number of slides.
   */
  _onSlotChange() {
    this._slides = this._getSlides();

    this.update();
  }

  _onResize() {
    // Debouncing resize.
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(() => {
      this.update();
    }, 250);
  }

  _computeSizes() {
    this._wrapperWidth = this._slidesWrapper.getBoundingClientRect().width;
    this._slidesGap = this._getSlidesGap();
    this._slidesWidth = this._getSlidesWidth();
  }

  /**
   * Updates the pagination indicators (depending on the current value of
   * `pagination`) to reflect the current number of views and the selected view.
   */
  _updatePagination() {
    if (!this._paginationWrapper || !this._slides ||
        this._slides.length === 0) {
      return;
    }

    if (!this.pagination || (this.pagination &&
        this._paginationWrapper.childElementCount !==
        this._lastViewIndex + 1)) {
      // Remove all children of pag wrapper and their ev listeners
      this._paginationIndicators.forEach(el => {
        el.removeEventListener('click', this);
        this._paginationWrapper.removeChild(el);
      });
      this._paginationIndicators.length = 0;
    }

    if (this.pagination) {
      // Create dom for pagination indicators
      if (this._paginationWrapper.childElementCount !==
          this._lastViewIndex + 1) {
        const frag = document.createDocumentFragment();
        for (let i = 0; i <= this._lastViewIndex; i++) {
          const btn = document.createElement('button');
          btn.textContent = i;
          btn.setAttribute('aria-label', `Go to view ${i + 1}`);
          btn.addEventListener('click', this);

          frag.appendChild(btn);
          this._paginationIndicators.push(btn);
        }
        this._paginationWrapper.appendChild(frag);
      }

      // Update `disabled` to highlight the selected slide.
      this._paginationIndicators.forEach((btn, i) => {
        btn.disabled = i === this.selected;
      });
    }
  }

  /**
   * Updates the navigation buttons (prev/next) depending on the value of
   * `navigation`, `loop` and the currently selected view.
   */
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

      // update `disabled`
      this._prevButton.disabled =
          !this.loop && this.selected === 0;
      this._nextButton.disabled =
          !this.loop && this.selected === this._lastViewIndex;
    }
  }

  /**
   * Called when any pagination bullet point is selected.
   * @param {Event} e The 'change' event fired by the radio input.
   */
  _onPaginationClicked(e) {
    this.selected = parseInt(e.target.textContent, 10);
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
      this.selected = this._lastViewIndex;
    }
  }

  /**
   * Selects the slide following the currently selected one.
   * If the currently selected slide is the last slide and the loop
   * functionality is disabled, nothing happens.
   */
  next() {
    if (this.selected < this._lastViewIndex) {
      this.selected += 1;
    } else if (this.loop) {
      this.selected = 0;
    }
  }

  _computeSlidesPerViewLayout() {
    // Used to compute the slides's width.
    this.style.setProperty('--x-slider__internal__slides-per-view',
        this.slidesPerView);

    // Recompute the index of the last view (aka max value for `selected`).
    this._lastViewIndex = Math.max(0, this._slides.length - this.slidesPerView);
    if (this.selected > this._lastViewIndex) {
      this.selected = this._lastViewIndex;
    }
  }

  /**
   * Translates the slider to show the target view.
   * @param {number} targetView The view to slide to.
   */
  _slideTo(targetView) {
    if (!this._slidesWrapper) {
      return;
    }

    this._slidesWrapper.style.transform = `translateX(
        ${- targetView * (this._slidesWidth + this._slidesGap)}px)`;
  }

  /**
   * https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
   */
  _supportsPassiveEvt() {
    if (typeof this._passiveEvt === 'undefined') {
      this._passiveEvt = false;
      try {
        const opts = Object.defineProperty({}, 'passive', {
          get: () => {
            this._passiveEvt = true;
          },
        });
        window.addEventListener('test', null, opts);
      } catch (e) {}
    }

    return this._passiveEvt;
  }

  _normalizeEvent(ev) {
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

  _onPointerDown(e) {
    if (!this._pointerActive) {
      this._pointerActive = true;
      this._pointerId = e.id;
      this._firstTouch = {
        x: e.x,
        y: e.y,
        translateX: this._getWrapperTranslateX(),
      };
    }
  }

  _onPointerMove(e) {
    if (this._pointerActive && e.id === this._pointerId) {
      const deltaX = e.x - this._firstTouch.x;
      const deltaY = e.y - this._firstTouch.y;
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        e.event.preventDefault();
      }

      this.removeAttribute('transitioning');

      this._slidesWrapper.style.transform =
        `translateX(${this._firstTouch.translateX + deltaX}px)`;
    }
  }

  _onPointerEnd(e) {
    if (this._pointerActive && e.id === this._pointerId) {
      this._stopPointerTracking();
    }
  }

  _stopPointerTracking() {
    this._pointerActive = false;
    this._pointerId = undefined;

    this.setAttribute('transitioning', '');

    const fullSlideWidth = this._slidesWidth + this._slidesGap;
    const maxValue = this._lastViewIndex * fullSlideWidth;

    const wrapperTranslateX = Math.abs(
        Math.max(-maxValue, Math.min(0, this._getWrapperTranslateX())));
    const modulo = wrapperTranslateX % fullSlideWidth;
    const divided = Math.floor(wrapperTranslateX / fullSlideWidth);

    if (modulo >= fullSlideWidth / 2) {
      this.selected = divided + 1;
    } else {
      this.selected = divided;
    }
  }

  _getWrapperTranslateX() {
    const matrix = getComputedStyle(this._slidesWrapper).transform
        .replace(/[^0-9\-.,]/g, '').split(',');
    return parseInt(matrix[12] || matrix[4], 10);
  }

  _getSlidesWidth() {
    return (this._wrapperWidth - (this.slidesPerView - 1) * this._slidesGap) /
        this.slidesPerView;
  }

  _getSlidesGap() {
    const parsedGap = parseInt(
        getComputedStyle(this._slides[0])['margin-right'], 10);
    return !Number.isFinite(parsedGap) ? 0 : parsedGap;
  }
}

window.customElements.define('x-slider', XSlider);
})();
