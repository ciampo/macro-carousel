# `class MacroCarouselPaginationIndicator extends HTMLElement`

`<macro-carousel-pagination-indicator>` is a Web Component used internally by `<macro-carousel>` to display the pagination dots.

Other docs:

- [`<macro-carousel>` docs](./macro-carousel.md)
- [`<macro-carousel-nav-button>` docs](./macro-carousel-nav-button.md)


## Properties (all reflected to attributes in kebab-case)

**`disabled`**: `boolean` = `false`

When disabled, this element can't be clicked / pressed

## Styling

| Custom property | Description | Default |
| --- | --- | --- |
| `--macro-carousel-pagination-color` | The color of the pagination dots | `#999` |
| `--macro-carousel-pagination-color-selected` | The color of the selected pagination dot | `#000` |
| `--macro-carousel-pagination-size-clickable` | The clickable area around the pagination dot | `24px` |
| `--macro-carousel-pagination-size-dot` | The size of the pagination dot | `8px` |
| `--macro-carousel-pagination-border` | The border of the pagination dot | `1px solid var(--macro-carousel-pagination-color)` |
| `--macro-carousel-pagination-border-selected` | THe border of the selected pagination dot | `1px solid var(--macro-carousel-pagination-color-selected)` |

## Events

**`macro-carousel-pagination-indicator-clicked`**: `CustomEvent`
