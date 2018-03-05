import styles from './x-slider.css';
import html from './x-slider.html';
import {getEvtListenerOptions} from './passiveEventListeners.js';
import {
  clamp, clampAbs, booleanSetter, booleanGetter, intSetter, intGetter,
  normalizeEvent, getCSSCustomProperty, setCSSCustomProperty,
} from './utils.js';

/**
 * Markup and styles.
 */
const _template = document.createElement('template');
_template.innerHTML = `<style>${styles}</style> ${html}`;

if (window.ShadyCSS) {
  window.ShadyCSS.prepareTemplate(_template, 'x-slider');
}

window.xSlider = window.xSlider || {};
window.xSlider.__testonly__ = window.xSlider.__testonly__ || {};
window.xSlider.__testonly__.clamp = clamp;
window.xSlider.__testonly__.clampAbs = clampAbs;
window.xSlider.__testonly__.normalizeEvent = normalizeEvent;

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

    if (window.ShadyCSS) {
      window.ShadyCSS.styleElement(this);
    }

    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(_template.content.cloneNode(true));

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
     * Whether the first/previous slide should infinite loop
     * @type {boolean}
     * @private
     */
    this._infiniteLoop = false;

    /**
     * An internal index representing the "wrapAround" iteration about the
     * selected index. If _infiniteLoop is false, its value doesn't change.
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
     * The reference to the timer used to debounce the `update()` function.
     * @type {number|undefined}
     * @private
     */
    this._updateTimer = undefined;

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
      this._disableWrapperTransitions();
      this.update();

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
    // Debouncing update.
    clearTimeout(this._updateTimer);
    this._disableWrapperTransitions();
    this._updateTimer = setTimeout(() => {
      this._internalUpdate();
    }, 50);
  }

  /**
   * Internal implementation of update(). Split in a separate function in
   * order to allow debouncing.
   * @private
   */
  _internalUpdate() {
    // Sometimes the 'slot-changed' event doesn't fire consistently across
    // browsers, depending on how the Custom Element was parsed and initialised
    // (see https://github.com/whatwg/dom/issues/447)
    // Here, we're making sure that the `slot-changed callback runs at least
    // once before the update() function.
    if (this._slides.length === 0) {
      this._onSlidesSlotChange();

      // If there's really no slide ヾ(-_- )ゞ.
      if (this._slides.length === 0) {
        return;
      }
    }

    this._computeSizes();
    this._updateInfiniteLoop();
    this._computeSlidesPerViewLayout();
    this._shiftSlides(this._slides.map(slide => slide.layoutIndex), true);
    this._slideTo(this.selected);
    this._updatePagination();
    this._updateNavigation();
    this._updateDragEventListeners();
    this._updateSlidesA11y();
    this._updateAriaLiveDom();

    this._enableWrapperTransitions();
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
    let previousSlideIndex = i;

    // Wrap around is true only if loop is true.
    if (i > 0) {
      previousSlideIndex = i - 1;
    } else if (this.loop) {
      if (this._infiniteLoop) {
        this._selectedIteration -= 1;
      }

      previousSlideIndex = this._lastViewIndex;
    }

    return clamp(previousSlideIndex, 0, this._lastViewIndex);
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
   * Computes the next index.
   * @param {number} i The index of reference used to compure the next.
   * @return {number} The next index with respect to the input.
   * @private
   */
  _computeNext(i) {
    let nextSlideIndex = i;

    // Wrap around is true only if loop is true.
    if (i < this._lastViewIndex) {
      nextSlideIndex = i + 1;
    } else if (this.loop) {
      if (this._infiniteLoop) {
        this._selectedIteration += 1;
      }

      nextSlideIndex = 0;
    }

    return clamp(nextSlideIndex, 0, this._lastViewIndex);
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
          this.selected = oldValue || 0;
          return;
        }

        if (this._infiniteLoop) {
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
        this._updateInfiniteLoop();
        this._computeSlidesPerViewLayout();

        // Reset the slides 'layoutIndex', transform and position.
        this._shiftSlides(this._slides.map((slide, index) => index));
        this._updateNavigation();
        this._updatePagination();
        this._updateSlidesA11y();
        this._focusSelectedSlide();
        this._updateAriaLiveDom();

        if (window.ShadyCSS) {
          window.ShadyCSS.styleSubtree(this);
        }
        break;

      case 'navigation':
        // Calling `update()` instead of `_updateNavigation()` as adding/
        // removing navigation buttons causes the slidesWrapper to resize.
        this.update();

        if (window.ShadyCSS) {
          window.ShadyCSS.styleSubtree(this);
        }
        break;

      case 'pagination':
        this._updatePagination();

        if (window.ShadyCSS) {
          window.ShadyCSS.styleSubtree(this);
        }
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
            parsedSlidesPerView < 1 ||
            parsedSlidesPerView > this._slides.length) {
          this.slidesPerView = oldValue || 1;
          return;
        }

        this.update();

        if (window.ShadyCSS) {
          window.ShadyCSS.styleSubtree(this);
        }
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
   * @returns {number} The width (in px) of one slide.
   * @private
   */
  _getSlideWidth() {
    return (this._wrapperWidth - (this.slidesPerView - 1) * this._slidesGap) /
        this.slidesPerView;
  }

  /**
   * Computes the slide gap value from CSS.
   * @returns {number} The width (in px) of the gap between slides.
   * @private
   */
  _getSlidesGap() {
    // Check if gap has unitless values (i.e. values ending with a digit).
    if (/\d$/.test(getCSSCustomProperty(this, '--x-slider-gap'))) {
      console.warn(`Warning: it looks like --x-slider-gap has a unitless value.
Add CSS units to its value to avoid breaking the slides layout.`);
    }
    // Getting the computed style because we need a value in px, while
    // the actual CSS property can be declared with any unit.
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
    setCSSCustomProperty(this,
        '--x-slider__internal__slides-per-view', `${this.slidesPerView}`);

    // Recompute the index of the last view (aka max value for `selected`).
    this._lastViewIndex = this._infiniteLoop ? this._slides.length - 1 :
        this._computeLastViewIndex();
    // TODO: check if the wrapAround check makes sense. The idea is to not force
    // a new value for selected in case the slider is wrapping around. But
    // probably we need to recompute slide positions and translate to them
    if (!this._infiniteLoop && this.selected > this._lastViewIndex) {
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
   * @param {string} className The class of the button element.
   * @returns {HTMLButtonElement} The button element.
   * @private
   */
  _createNavigationButton(className) {
    const btn = document.createElement('button');
    btn.classList.add(className);
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
        this._prevButton = this._createNavigationButton('x-slider-previous');
        this.appendChild(this._prevButton);

        this._nextButton = this._createNavigationButton('x-slider-next');
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
  _updateInfiniteLoop() {
    // this._computeLastViewIndex() > 1 means that there are at least 2 slides
    // more than the number of slides in view. 2 extra slides are need in
    // order to successfully shift the slides and simulate an infinite loop.
    this._infiniteLoop = this.loop && this._computeLastViewIndex() > 1;
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

    // Getting the value of _lastViewIndex before calling internalUpdate(),
    // as _internalUpdate() will update its value.
    // This is done to avoid a locking situation, e.g. when the carousel is
    // initialised, selected wouldn't be assigned because of _lastViewIndex
    // still being -1. When we parse the slides from the slot, we can compute
    // _lastViewIndex, and then we can force an update on selected.
    const shouldForceSelectedUpdate = this._slides.length > 0 &&
        this._lastViewIndex === -1;

    // Calling internalUpdate instead of update, to avoid race coniditions
    // (update is debounced). This is because the number of slides is
    // essential for computing the remaining internal values.
    this._internalUpdate();

    // See a few lines above.
    if (shouldForceSelectedUpdate) {
      this.selected = this.selected;
    }
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

    if (this._infiniteLoop) {
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
      // When _infiniteLoop is disabled, if we drag to the left of the first
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

    let newSelected;

    if (diffX === 0) {
      this._decelVelocity = 0;

      // If the user's pointer was not moving, pick the new selected slide
      // based on the pointer's position.
      // Because currentSlideIndex is the slide the pointer is currently onto,
      // distToCurrent is always going to be positive.
      const distToCurrent = this._slides[currentSlideIndex].position -
          this._wrapperTranslateX;
      newSelected = distToCurrent > this._slidesWidth / 2 ?
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
      newSelected = targetSlide;
    }

    // Clamping to ensure that `selected` stays into its allowed values.
    this.selected = clamp(newSelected, 0, this._lastViewIndex);

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
