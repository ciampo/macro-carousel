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

      --x-slider-transition-duration: 0.6s;
      --x-slider-transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);

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
      contain: paint;

      /*
        https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md
      */
      touch-action: pan-y pinch-zoom;
    }

    #slidesWrapper {
      display: flex;
      align-items: stretch;

      will-change: transform;
    }

    :host([transitioning]) #slidesWrapper {
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

      padding: 0;
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
    this._wrapperTranslateX = undefined;
    this._resizeTimer = undefined;

    // Touch / drag
    this._pointerActive = false;
    this._pointerId = undefined;
    this._pointerFirstX = undefined;
    this._pointerFirstY = undefined;
    this._pointerLastX = undefined;
    this._pointerLastY = undefined;
    this._pointerCurrentX = undefined;
    this._pointerCurrentY = undefined;
    this._trackingPoints = [];
    this._dragTicking = false;
    this._maxDecelVelocity = 30;
    this._minDecelVelocity = 10;
    this._friction = 0.74;
    this._attraction = 0.022;
    this._decelVelocity = undefined;
    this._decelerating = false;
  }

  /**
   * Fires when the element is inserted into the DOM.
   * It's a good place to set the initial `role`, `tabindex`, internal state,
   * and install event listeners.
   * @private
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
    this._externalWrapper.addEventListener('mousedown', this);
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

    this._externalWrapper.removeEventListener('touchstart', this);
    this._externalWrapper.removeEventListener('mousedown', this);

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
    this._computeSlidesPerViewLayout();
    this._slideTo(this.selected);
    this._updatePagination();
    this._updateNavigation();
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
      'slides-per-view',
    ];
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
   * The 0-based index of the selected slide.
   * @type {number}
   * @default 0
   */
  set selected(index) {
    this.setAttribute('selected', index);
  }

  get selected() {
    const value = this.getAttribute('selected');
    return value === null ? 0 : parseInt(value, 10);
  }

  /**
   * Whether the slider is looping (e.g wrapping around).
   * @type {boolean}
   * @default false
   */
  set loop(flag) {
    if (flag) {
      this.setAttribute('loop', '');
    } else {
      this.removeAttribute('loop');
    }
  }

  get loop() {
    return this.hasAttribute('loop');
  }

  /**
   * Whether the navigation buttons (prev/next) are shown.
   * @type {boolean}
   * @default false
   */
  set navigation(flag) {
    if (flag) {
      this.setAttribute('navigation', '');
    } else {
      this.removeAttribute('navigation');
    }
  }

  get navigation() {
    return this.hasAttribute('navigation');
  }

  /**
   * Whether the pagination indicators are shown.
   * @type {boolean}
   * @default false
   */
  set pagination(flag) {
    if (flag) {
      this.setAttribute('pagination', '');
    } else {
      this.removeAttribute('pagination');
    }
  }

  get pagination() {
    return this.hasAttribute('pagination');
  }

  /**
   * The number of slides seen at once in the slider
   * @type {number}
   * @default 1
   */
  set slidesPerView(index) {
    this.setAttribute('slides-per-view', index);
  }

  get slidesPerView() {
    const value = this.getAttribute('slides-per-view');
    return value === null ? 1 : parseInt(value, 10);
  }


  // ===========================================================================
  // Layout-related
  // ===========================================================================

  /**
   * Updated the UI when the window resizes.
   * @private
   */
  _onResize() {
    // Debouncing resize.
    clearTimeout(this._resizeTimer);
    this._resizeTimer = setTimeout(() => {
      this.update();
    }, 250);
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
        getComputedStyle(this._slides[0])['margin-right'], 10);
    return !Number.isFinite(parsedGap) ? 0 : parsedGap;
  }

  /**
   * Updates the internal CSS variable used to lay out the slides.
   * @private
   */
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
   * Updates the wrapper's translateX property (ie. shows a different view).
   * @param {number} tx The value (in px) for the wrapper's translateX property.
   * @private
   */
  _setWrapperTranslateX(tx) {
    this._slidesWrapper.style.transform = `translateX(${tx}px)`;
    this._wrapperTranslateX = tx;
  }

  /**
   * Computes the view's position along the x axis.
   * @param {number} viewIndex
   * @private
   */
  _getViewPosition(viewIndex) {
    return - viewIndex * (this._slidesWidth + this._slidesGap);
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

    this._setWrapperTranslateX(this._getViewPosition(targetView));
  }

  /**
   * Updates the pagination indicators (depending on the current value of
   * `pagination`) to reflect the current number of views and the selected view.
   * @private
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
   * Called when any pagination bullet point is selected.
   * @param {Event} e The 'change' event fired by the radio input.
   * @private
   */
  _onPaginationClicked(e) {
    this.selected = parseInt(e.target.textContent, 10);
  }

  /**
   * Updates the navigation buttons (prev/next) depending on the value of
   * `navigation`, `loop` and the currently selected view.
   * @private
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


  // ===========================================================================
  // Slides slot
  // ===========================================================================

  /**
   * Gets the elements in the light DOM (assignedNodes() of #slidesSlot).
   * @returns {Array<HTMLElement>} The elements found in #slidesSlot.
   * @private
   */
  _getSlides() {
    return this._slidesSlot.assignedNodes()
        .filter(n => n.nodeType === Node.ELEMENT_NODE);
  }

  /**
   * Updates the slider to react to DOM changes in #slidesSlot.
   * @private
   */
  _onSlotChange() {
    this._slides = this._getSlides();

    this.update();
  }


  // ===========================================================================
  // Pointer events + drag
  // ===========================================================================

  /**
   * A normalised object representing either a touch event or a mouse event.
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

  /**
   * Begins to track pointer events in order to drag the wrapper.
   * @param {NormalisedPointerEvent} e The normalised pointer event.
   * @private
   */
  _onPointerDown(e) {
    if (!this._pointerActive) {
      this._decelerating = false;
      this._pointerActive = true;
      this._pointerId = e.id;
      this._pointerFirstX = this._pointerLastX = this._pointerCurrentX = e.x;
      this._pointerFirstY = this._pointerLastY = this._pointerCurrentY = e.x;

      this._trackingPoints = [];
      this._addTrackingPoint(this._pointerLastX);

      // Move
      this._externalWrapper.addEventListener('touchmove', this,
          this._supportsPassiveEvt ? {passive: false} : false);
      this._externalWrapper.addEventListener('mousemove', this,
          this._supportsPassiveEvt ? {passive: false} : false);
      // Up
      this._externalWrapper.addEventListener('mouseup', this);
      this._externalWrapper.addEventListener('touchend', this);
      // Leave
      this._externalWrapper.addEventListener('mouseleave', this);
      this._externalWrapper.addEventListener('touchcancel', this);
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
    if (this._pointerActive && e.id === this._pointerId) {
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

      this.removeAttribute('transitioning');

      this._requestDragTick();
    }
  }

  /**
   * Stops the pointer tracking.
   * @param {NormalisedPointerEvent} e The normalised pointer event.
   * @private
   */
  _onPointerEnd(e) {
    if (this._pointerActive && e.id === this._pointerId) {
      this._stopPointerTracking();
    }
  }

  /**
   * Stops the tracking of pointer events, resets the dragging logic,
   * and possibly starts the deceleration.
   * @private
   */
  _stopPointerTracking() {
    this._pointerActive = false;
    this._pointerId = undefined;

    this._addTrackingPoint(this._pointerLastX);

    this._externalWrapper.removeEventListener('touchmove', this);
    this._externalWrapper.removeEventListener('mousemove', this);
    this._externalWrapper.removeEventListener('touchend', this);
    this._externalWrapper.removeEventListener('mouseup', this);
    this._externalWrapper.removeEventListener('touchcancel', this);
    this._externalWrapper.removeEventListener('mouseleave', this);

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
      requestAnimationFrame(this._updateDrag.bind(this));
    }
    this._dragTicking = true;
  }

  /**
   * Updates the UI while the user is dragging the slides.
   * @private
   */
  _updateDrag() {
    // Current position + the amount of drag happened since the last rAF.
    this._setWrapperTranslateX(this._wrapperTranslateX +
        this._pointerCurrentX - this._pointerLastX);

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

    if (diffX === 0) {
      this._decelVelocity = 0;
    } else {
      // Compute the initial deceleration velocity.
      const maxVel = Math.min(this._maxDecelVelocity, this._slidesWidth / 4);
      const minVel = Math.min(this._minDecelVelocity, this._slidesWidth / 6,
          maxVel);
      // Use normalised vector to give the direction [diffX / Math.abs(diffX)].
      this._decelVelocity = diffX / Math.abs(diffX) *
          Math.max(minVel, Math.min(maxVel, Math.abs(diffX)));
    }

    // Compute whether the target to snap to is the current slide or a
    // previous / next one.
    // TODO: Generalise skippingn one slide—e.g try more slide-per view.
    // idea: use current position to determine virtual new selected, then use
    // velocity to move -1/0/+1 ?
    const distToCurrent = Math.abs(this._wrapperTranslateX) -
        Math.abs(this._getViewPosition(this.selected));

    if (this._decelVelocity > 0) {
      if (this._decelVelocity > (this._slidesWidth + distToCurrent) / 2) {
        this.previous();
      }
      this.previous();
    } else if (this._decelVelocity < 0) {
      if (this._decelVelocity < (distToCurrent - this._slidesWidth) / 2) {
        this.next();
      }
      this.next();
    } else if (Math.abs(distToCurrent) > this._slidesWidth / 3) {
      // If still but at leat 1/3 through the slide, select the previous/next
      // slide.
      if (distToCurrent > 0) {
        this.next();
      } else {
        this.previous();
      }
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

    const snapX = this._getViewPosition(this.selected);

    // Apply attraction: it moves the slider towards the target.
    // Attraction is bigger when the slide is further away.
    this._decelVelocity += this._attraction * (snapX - this._wrapperTranslateX);
    // Apply friction: friction slows down the slider.
    this._decelVelocity *= this._friction;

    let newPosition = this._wrapperTranslateX + this._decelVelocity;
    newPosition = this._decelVelocity > 0 ? Math.min(newPosition, snapX) :
        newPosition = Math.max(newPosition, snapX);

    this._setWrapperTranslateX(newPosition);

    if (Math.abs(snapX - newPosition) >= 1) {
      requestAnimationFrame(this._decelerationStep.bind(this));
    } else {
      this._setWrapperTranslateX(snapX);
      this._decelerating = false;
      this.setAttribute('transitioning', '');
    }
  }

  // ===========================================================================
  // Misc
  // ===========================================================================

  /**
   * Detects browser support for passive event listeners. See
   * https://github.com/WICG/EventListenerOptions/blob/gh-pages/explainer.md#feature-detection
   * @returns {boolean} True if the browser support passive event listeners.
   * @private
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
}

window.customElements.define('x-slider', XSlider);
})();
