# `class MacroCarouselNavButton extends HTMLElement`

`<macro-carousel-nav-button>` is a Web Component used internally by `<macro-carousel>` to display the previous / next navigation buttons.

Other docs:

- [`<macro-carousel>` docs](./macro-carousel.md)
- [`<macro-carousel-pagination-indicator>` docs](./macro-carousel-pagination-indicator.md)


## Properties (all reflected to attributes in kebab-case)

**`disabled`**: `boolean` = `false`

When disabled, this element can't be clicked / pressed

## Styling

| Custom property | Description | Default |
| --- | --- | --- |
| `--macro-carousel-navigation-color` | The color of the icon in the previous/next buttons | `#000` |
| `--macro-carousel-navigation-color-focus` | The color of the icon in the previous/next buttons when the button is focused / active / hovered | `var(--macro-carousel-navigation-color);` |
| `--macro-carousel-navigation-color-background` | The background color for the previous/next buttons | `transparent` |
| `--macro-carousel-navigation-color-background-focus` | The background color for the previous/next buttons when they are focused / active / hovered | `#f0f0f0` |
| `--macro-carousel-navigation-button-size` | The size of the previous/next buttons | `48px` |
| `--macro-carousel-navigation-icon-size` | The size of the icon in the previous/next buttons | `24px` |
| `--macro-carousel-navigation-icon-mask` | The shape of the icon in the previous/next buttons to be used as a valid value for the `mask-image` CSS property | `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23000'%3E %3Cpath d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'/%3E %3C/svg%3E")` |

## Events

**`macro-carousel-nav-button-clicked`**: `CustomEvent`
