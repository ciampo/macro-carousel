# x-slider 0.3.0

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


## Test

**note: the way integration tests work is very likely to change**

*The testing environment is set up the same way as the [howto-components](https://github.com/GoogleChrome/howto-components) project.*

Run `npm run test` to run all tests.


## Whishlist

Please have a look at [the backlog](https://github.com/ciampo/x-slider/milestone/2) to see the plan for the next release.

If you have a feature request, feel free to open an issue!
