# `class MacroCarousel extends HTMLElement`

`<macro-carousel>` is a carousel Web Component.

Other docs:

- [`<macro-carousel-nav-button>` docs](./macro-carousel-nav-button.md)
- [`<macro-carousel-pagination-indicator>` docs](./macro-carousel-pagination-indicator.md)

## Properties (all reflected to attributes in kebab-case)

**`selected`**: `number` = `0`

The 0-based index of the selected slide.


**`loop`**: `boolean` = `false`

Whether the slider is looping (e.g wrapping around).


**`navigation`**: `boolean` = `false`

Whether the navigation buttons (prev/next) are shown.


**`pagination`**: `boolean` = `false`

Whether the pagination indicators are shown.


**`disableDrag`**: `boolean` = `false`

If true, the slides can not be dragged with pointer events.


**`slidesPerView`**: `number` = `1`

The number of slides seen at once in the slider


**`reducedMotion`**: `boolean` = `false`

If true, disables CSS transitions and drag deceleration.


**`autoFocus`**: `boolean` = `false`

If true, newly selected slides will focused automatically. This will likely move the page so that the slide is completely in view.


## Methods

**`previous()`**

Selects the slide preceding the currently selected one.
If the currently selected slide is the first slide and the loop
functionality is disabled, nothing happens.

**`next()`**

Selects the slide following the currently selected one.
If the currently selected slide is the last slide and the loop
functionality is disabled, nothing happens.


**`update()`**

"Forces" an update by sliding the current view in, and updating
navigation and pagination. Useful to *reset* the state of the carousel.


## Styling

| Custom property | Description | Default |
| --- | --- | --- |
| `--macro-carousel-gap` | The gap between each slide. This value *needs* to be specified in CSS units (e.g. `px`, `em`, `rem`, `%`...). | `16px` |
| `--macro-carousel-background-color` | The background-color of the slider | `transparent` |
| `--macro-carousel-slide-min-height` | The minimum height of a slide | `0px` |
| `--macro-carousel-slide-max-height` | The maximum height of a slide | `none` |
| `--macro-carousel-transition-duration` | The duration of the transition between slides | `.6s` |
| `--macro-carousel-transition-timing-function` | The easing function for the transition between slides | `cubic-bezier(.25, .46, .45, .94)` |
| `--macro-carousel-pagination-gap` | The gap between the pagination dots | `2px` |
| `--macro-carousel-pagination-height` | The height of the pagination dots section | `44px` |

## Events

**`macro-carousel-selected-changed`**: `CustomEvent`

`event.detail` contains the index of the new selected slide.

*This event is not fired if the carousel is initialised without any slide in its light DOM.*
