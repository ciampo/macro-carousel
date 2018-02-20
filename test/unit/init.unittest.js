/* eslint max-len: ["off"] */

// TODO: reflect props and attrs:
// - set a property, read the property and the attribute
// - set an attribute, read the property and the attribute

(function() {
  const expect = chai.expect;
  const numberOfSlides = 4;
  const allPropertyTests = [
    {
      // selected has to be a Number in range [0, slides.length - 1].
      // Otherwise it rolls back to the previous value.
      propertyName: 'selected',
      tests: [
        {value: 2, expected: 2},
        {value: -1, expected: 0},
        {value: numberOfSlides, expected: 0},
        {value: 'string', expected: 0},
        {value: null, expected: 0},
        {value: undefined, expected: 0},
        {value: {}, expected: 0},
        {value: true, expected: 0},
      ],
    },
    {
      // truthy values set it to true, falsy values set it to false
      propertyName: 'loop',
      tests: [
        {value: true, expected: true},
        {value: 2, expected: true},
        {value: 'string', expected: true},
        {value: {}, expected: true},
        {value: 0, expected: false},
        {value: null, expected: false},
        {value: undefined, expected: false},
      ],
    },
    {
      // truthy values set it to true, falsy values set it to false
      propertyName: 'navigation',
      tests: [
        {value: true, expected: true},
        {value: 2, expected: true},
        {value: 'string', expected: true},
        {value: {}, expected: true},
        {value: 0, expected: false},
        {value: null, expected: false},
        {value: undefined, expected: false},
      ],
    },
    {
      // truthy values set it to true, falsy values set it to false
      propertyName: 'pagination',
      tests: [
        {value: true, expected: true},
        {value: 2, expected: true},
        {value: 'string', expected: true},
        {value: {}, expected: true},
        {value: 0, expected: false},
        {value: null, expected: false},
        {value: undefined, expected: false},
      ],
    },
    {
      // truthy values set it to true, falsy values set it to false
      propertyName: 'disableDrag',
      tests: [
        {value: true, expected: true},
        {value: 2, expected: true},
        {value: 'string', expected: true},
        {value: {}, expected: true},
        {value: 0, expected: false},
        {value: null, expected: false},
        {value: undefined, expected: false},
      ],
    },
    {
      // slidesPerView has to be a Number in range [1, slides.length].
      // Otherwise it rolls back to the previous value.
      propertyName: 'slidesPerView',
      tests: [
        {value: 2, expected: 2},
        {value: 0, expected: 1},
        {value: numberOfSlides + 1, expected: 1},
        {value: 'string', expected: 1},
        {value: null, expected: 1},
        {value: undefined, expected: 1},
        {value: {}, expected: 1},
        {value: true, expected: 1},
      ],
    },
    {
      // truthy values set it to true, falsy values set it to false
      propertyName: 'reducedMotion',
      tests: [
        {value: true, expected: true},
        {value: 2, expected: true},
        {value: 'string', expected: true},
        {value: {}, expected: true},
        {value: 0, expected: false},
        {value: null, expected: false},
        {value: undefined, expected: false},
      ],
    },
    {
      // truthy values set it to true, falsy values set it to false
      propertyName: 'autoFocus',
      tests: [
        {value: true, expected: true},
        {value: 2, expected: true},
        {value: 'string', expected: true},
        {value: {}, expected: true},
        {value: 0, expected: false},
        {value: null, expected: false},
        {value: undefined, expected: false},
      ],
    },
  ];

  describe('Init', function() {
    before(wcutils.before());
    after(wcutils.after());

    it('declarative', function() {
      this.container.innerHTML = `<x-slider></x-slider>`;

      return wcutils.waitForElement('x-slider').then(() => {
        expect(document.querySelector('x-slider').constructor.name)
            .to.equal('XSlider');
      });
    });

    it('programmatic', function() {
      const slider = document.createElement('x-slider');

      return wcutils.waitForElement('x-slider').then(() => {
        expect(slider.constructor.name).to.equal('XSlider');
      });
    });
  });

  describe('The value of', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      this.container.innerHTML = `
      <x-slider>
        ${[...Array(numberOfSlides).keys()]
            .map(i => `<article>Slide ${i}</article>`)
            .join('\n')}
      </x-slider>`;
      return wcutils.waitForElement('x-slider')
        .then(() => {
          this.slider = this.container.querySelector('x-slider');
        });
    });

    // Since all tests are async function, the loop variable is saved to a local
    // variable. An alternative approach would be to wrap the test in a closure.
    for (let p of allPropertyTests) {
      describe(`the ${p.propertyName} property`, () => {
        for (let t of p.tests) {
          it(`should be ${t.expected} when set to ${t.value}`, async function() {
            await wcutils.flush();
            this.slider[p.propertyName] = t.value;
            await wcutils.flush();
            expect(this.slider[p.propertyName]).to.equal(t.expected);
          });
        }
      });
    }
  });
})();
