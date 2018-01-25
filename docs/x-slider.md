# `class XSlider extends HTMLElement`

`<x-slider>` is a carousel vanilla Web Component.


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
| `--x-slider-gap` | The gap between each slide | `16px` |
| `--x-slider-background-color` | The background-color of the slider | `transparent` |
| `--x-slider-slide-min-height` | The minimum height of a slide | `0px` |
| `--x-slider-slide-max-height` | The maximum height of a slide | `none` |
| `--x-slider-transition-duration` | The duration of the transition between slides | `.6s` |
| `--x-slider-transition-timing-function` | The easing function for the transition between slides | `cubic-bezier(.25, .46, .45, .94)` |
| `--x-slider-navigation-color` | The color of the icon in the previous/next buttons | `#000` |
| `--x-slider-navigation-background-color-active` | The background color for the previous/next buttons when they are active | `#ddd` |
| `--x-slider-navigation-background-color-focus` | The background color for the previous/next buttons when they are focused | `#f0f0f0` |
| `--x-slider-navigation-button-size` | The size of the previous/next buttons | `48px` |
| `--x-slider-navigation-icon-size` | The size of the icon in the previous/next buttons | `24px` |
| `--x-slider-pagination-color` | The color of the pagination dots | `#999` |
| `--x-slider-pagination-color-selected` | The color of the selected pagination dot | `#000` |
| `--x-slider-pagination-size-clickable` | The clickable area around the pagination dot | `24px` |
| `--x-slider-pagination-size-dot` | The size of the pagination dot | `8px` |
| `--x-slider-pagination-gap` | The gap between the pagination dots | `2px` |
| `--x-slider-pagination-height` | The height of the pagination dots section | `44px` |

## Events

**`x-slider-selected-changed`**: `CustomEvent`

`event.detail` contains the index of the new selected slide.
