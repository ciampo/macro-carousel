# `class MacroCarousel extends HTMLElement`

`<macro-carousel>` is a carousel vanilla Web Component.


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
| `--macro-carousel-navigation-color` | The color of the icon in the previous/next buttons | `#000` |
| `--macro-carousel-navigation-color-focus` | The color of the icon in the previous/next buttons when the button is focused / active / hovered | `var(--macro-carousel-navigation-color);` |
| `--macro-carousel-navigation-color-background` | The background color for the previous/next buttons | `transparent` |
| `--macro-carousel-navigation-color-background-focus` | The background color for the previous/next buttons when they are focused / active / hovered | `#f0f0f0` |
| `--macro-carousel-navigation-button-size` | The size of the previous/next buttons | `48px` |
| `--macro-carousel-navigation-icon-size` | The size of the icon in the previous/next buttons | `24px` |
| `--macro-carousel-navigation-icon-mask` | The shape of the icon in the previous/next buttons to be used as a valid value for the `mask-image` CSS property | `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000'%3E %3Cpath d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'/%3E %3C/svg%3E")` |
| `--macro-carousel-pagination-color` | The color of the pagination dots | `#999` |
| `--macro-carousel-pagination-color-selected` | The color of the selected pagination dot | `#000` |
| `--macro-carousel-pagination-size-clickable` | The clickable area around the pagination dot | `24px` |
| `--macro-carousel-pagination-size-dot` | The size of the pagination dot | `8px` |
| `--macro-carousel-pagination-border` | The border of the pagination dot | `1px solid var(--macro-carousel-pagination-color)` |
| `--macro-carousel-pagination-border-selected` | THe border of the selected pagination dot | `1px solid var(--macro-carousel-pagination-color-selected)` |
| `--macro-carousel-pagination-gap` | The gap between the pagination dots | `2px` |
| `--macro-carousel-pagination-height` | The height of the pagination dots section | `44px` |

## Events

**`macro-carousel-selected-changed`**: `CustomEvent`

`event.detail` contains the index of the new selected slide.

*This event is not fired if the carousel is initialised without any slide in its light DOM.*
