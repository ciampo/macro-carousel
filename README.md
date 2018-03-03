# x-slider 0.4.0

`<x-slider>` is a carousel vanilla Web Component ([DEMOS](https://ciampo.github.io/x-slider/demo/))

**Please note that this is still a WIP — [wait for version 1.0.0](https://github.com/ciampo/x-slider/milestone/1) !**

- Compatible with every framework
- Public APIs exposed as methods, events and properties/attributes
- Mouse and touch events
- Previous/Next buttons
- Pagination indicators
- Multiple slides per view
- Customisable styles though CSS custom properties
- Focused on a11y


## Setup

### Installing dependencies

`npm` is needed as a global dependency.

Run `npm install` to install all local dependencies.

For enhancing the a11y of the carousel, it's best to also install the `inert` and `focus-visible` polyfills, listed as `peerDependencies`. Have a look at the demos to see them in use.


### Running the project locally

Run `npm run start` to start a local dev server and open the `demo/` page in your browser.


## Usage:

Please read the [full documentation](./docs/x-slider.md)

```html
<x-slider>
  <div>First slide</div>
  <div>Second slide</div>
  <div>Third slide</div>
</x-slider>

<script src="x-slider.min.js" defer></script>
```

For more examples, look at the demos ([Live demo](https://ciampo.github.io/x-slider/demo/), [Demo code](./demo/))

## Browser support

In order for this Web Component to work on all evergreen browsers, you may need to add the [WebComponent polyfills suite](https://github.com/webcomponents/webcomponentsjs) to your page. (*Please note that this repository focuses on the `x-slider` Web Component, and not on the polyfills*)

For browsers not supporting ES6 classes, a possible solution is to transpile the `x-slider` code to ES5 and use the [`custom-elements-es5-adapter.js`](https://github.com/webcomponents/webcomponentsjs#custom-elements-es5-adapterjs) polyfill. However, at the moment none of the demos in this repository show this technique yet.

All the demos in this repository already make use of the polyfills (by using [`webcomponents-loader.js`](https://github.com/webcomponents/webcomponentsjs#webcomponents-loaderjs)). The source code of the `x-slider` Web Component also makes optional calls to the `ShadyCSS` polyfill.

Because of the [`ShadyCSS` polyfill limitations](https://github.com/webcomponents/shadycss#limitations), certain style rules are not applied in polyfilled browsers:
- all the rules that rely on the `:host-context()` selector are not polyfilled correctly
- some of the more complex selectors using `:host()` are also not supported. This mainly impact the hover/focus states on navigation buttons.
- normally, external styles have the priority over the internal Web Component styles. But sometimes, after the polyfill's transformation, some internal selectors end up having a higher specificity then the external ones. This is quite an edge case, but keep an eye for it

As browser support grows and the polyfills improve, these limitations should become less and less frequent and problematic.

## Test

Run `npm run test` to run all tests.


## Whishlist

Please have a look at [the backlog](https://github.com/ciampo/x-slider/milestone/2) to see the plan for the next releases.

If you have a feature request, feel free to open an issue!
