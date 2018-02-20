/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;
  const numberOfSlides = 4;
  const allPropertyTests = [
    {
      // selected has to be a Number in range [0, slides.length - 1].
      // Otherwise it rolls back to the previous value.
      propertyName: 'selected',
      attributeName: 'selected',
      tests: [
        {value: 2, expected: '2'},
        {value: -1, expected: '0'},
        {value: numberOfSlides, expected: '0'},
        {value: 'string', expected: '0'},
        {value: null, expected: '0'},
        {value: undefined, expected: '0'},
        {value: {}, expected: '0'},
        {value: true, expected: '0'},
      ],
    },
    {
      // truthy values set it to true, falsy values set it to false
      propertyName: 'loop',
      attributeName: 'loop',
      tests: [
        {value: true, expected: ''},
        {value: 2, expected: ''},
        {value: 'string', expected: ''},
        {value: {}, expected: ''},
        {value: 0, expected: null},
        {value: null, expected: null},
        {value: undefined, expected: null},
      ],
    },
    {
      // truthy values set it to true, falsy values set it to false
      propertyName: 'navigation',
      attributeName: 'navigation',
      tests: [
        {value: true, expected: ''},
        {value: 2, expected: ''},
        {value: 'string', expected: ''},
        {value: {}, expected: ''},
        {value: 0, expected: null},
        {value: null, expected: null},
        {value: undefined, expected: null},
      ],
    },
    {
      // truthy values set it to true, falsy values set it to false
      propertyName: 'pagination',
      attributeName: 'pagination',
      tests: [
        {value: true, expected: ''},
        {value: 2, expected: ''},
        {value: 'string', expected: ''},
        {value: {}, expected: ''},
        {value: 0, expected: null},
        {value: null, expected: null},
        {value: undefined, expected: null},
      ],
    },
    {
      // truthy values set it to true, falsy values set it to false
      propertyName: 'disableDrag',
      attributeName: 'disable-drag',
      tests: [
        {value: true, expected: ''},
        {value: 2, expected: ''},
        {value: 'string', expected: ''},
        {value: {}, expected: ''},
        {value: 0, expected: null},
        {value: null, expected: null},
        {value: undefined, expected: null},
      ],
    },
    {
      // slidesPerView has to be a Number in range [1, slides.length].
      // Otherwise it rolls back to the previous value.
      propertyName: 'slidesPerView',
      attributeName: 'slides-per-view',
      tests: [
        {value: numberOfSlides, expected: `${numberOfSlides}`},
        {value: 0, expected: '1'},
        {value: numberOfSlides + 1, expected: '1'},
        {value: 'string', expected: '1'},
        {value: null, expected: '1'},
        {value: undefined, expected: '1'},
        {value: {}, expected: '1'},
        {value: true, expected: '1'},
      ],
    },
    {
      // truthy values set it to true, falsy values set it to false
      propertyName: 'reducedMotion',
      attributeName: 'reduced-motion',
      tests: [
        {value: true, expected: ''},
        {value: 2, expected: ''},
        {value: 'string', expected: ''},
        {value: {}, expected: ''},
        {value: 0, expected: null},
        {value: null, expected: null},
        {value: undefined, expected: null},
      ],
    },
    {
      // truthy values set it to true, falsy values set it to false
      propertyName: 'autoFocus',
      attributeName: 'auto-focus',
      tests: [
        {value: true, expected: ''},
        {value: 2, expected: ''},
        {value: 'string', expected: ''},
        {value: {}, expected: ''},
        {value: 0, expected: null},
        {value: null, expected: null},
        {value: undefined, expected: null},
      ],
    },
  ];

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
      describe(`the ${p.attributeName} attribute`, () => {
        for (let t of p.tests) {
          it(`should be ${t.expected} when the ${p.propertyName} property is set to ${t.value}`, async function() {
            await wcutils.flush();
            this.slider[p.propertyName] = t.value;
            await wcutils.flush();
            expect(this.slider.getAttribute(p.attributeName)).to.equal(t.expected);
          });
        }
      });
    }
  });
})();
