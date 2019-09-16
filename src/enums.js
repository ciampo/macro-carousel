const baseName = 'macro-carousel';

const TAGNAMES = {
  CAROUSEL: baseName,
  NAV_BTN: `${baseName}-nav-button`,
  PAG_BTN: `${baseName}-pagination-indicator`,
};

const IDS = {
  CAROUSEL: {
    WRAPPER_EXTERNAL: 'externalWrapper',
    WRAPPER_SLIDES: 'slidesWrapper',
    SLOT_SLIDES: 'slidesSlot',
    SLOT_ARIA: 'ariaSlot',
    SLOT_PAGINATION: 'paginationSlot',
    SLOT_NAVIGATION: 'navigationSlot',
  },
};

const CLASSNAMES = {
  CAROUSEL: {},

  NAV_BTN: {
    PREVIOUS: `${baseName}-previous`,
    NEXT: `${baseName}-next`,
  },

  PAG_BTN: {
    SELECTED: 'selected',
  },
};

const EVENTS = {
  STANDARD: {
    CLICK: 'click',
    TOUCHSTART: 'touchstart',
    TOUCHMOVE: 'touchmove',
    TOUCHEND: 'touchend',
    TOUCHCANCEL: 'touchcancel',
    MOUSEDOWN: 'mousedown',
    MOUSEMOVE: 'mousemove',
    MOUSEUP: 'mouseup',
    KEYDOWN: 'keydown',
    RESIZE: 'resize',
    SLOTCHANGE: 'slotchange',
    TRANSITIONEND: 'transitionend',
  },

  CAROUSEL: {
    SELECTED_CHANGED: `${TAGNAMES.CAROUSEL}-selected-changed`,
  },

  NAV_BTN: {
    CLICKED: `${TAGNAMES.NAV_BTN}-clicked`,
  },

  PAG_BTN: {
    CLICKED: `${TAGNAMES.PAG_BTN}-clicked`,
  },
};

const KEYCODES = {
  ENTER: 13,
  SPACE: 32,
  UP: 38,
  RIGHT: 39,
  DOWN: 40,
  LEFT: 37,

};

const ATTRS = {
  STANDARD: {
    ROLE: 'role',
    TABINDEX: 'tabindex',
    INERT: 'inert',
    ARIA: {
      HIDDEN: 'aria-hidden',
      LABEL: 'aria-label',
      LIVE: 'aria-live',
      ATOMIC: 'aria-atomic',
      DISABLED: 'aria-disabled',
    },
    SLOT: 'slot',
    DISABLED: 'disabled',
  },

  NAV_BTN: {
    FLIPPED: 'flipped',
  },
};

const ATTR_VALUES = {
  ARIA_LIVE: {
    POLITE: 'polite',
  },

  ROLES: {
    BUTTON: 'button',
    LIST: 'list',
    LISTITEM: 'listitem',
  },

  TRUE: 'true',
  FALSE: 'false',
};

const SLOTNAMES = {
  ARIA: 'ariaSlot',
  PAGINATION: 'paginationSlot',
  NAVIGATION: 'navigationSlot',
};

const CSS_PROPS = {
  STANDARD: {
    MARGIN_RIGHT: 'margin-right',
  },

  CAROUSEL: {
    GAP: `--${baseName}-gap`,
    SLIDES_PER_VIEW: `--${baseName}__internal__slides-per-view`,
  },
};

export {
  TAGNAMES,
  IDS,
  CLASSNAMES,
  EVENTS,
  KEYCODES,
  ATTRS,
  ATTR_VALUES,
  SLOTNAMES,
  CSS_PROPS,
};
