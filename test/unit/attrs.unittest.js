/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;
  const numberOfSlides = 4;

  const generateTests = (type, rollbackValue, min, max) => {
    if (type === 'boolean') {
      return [
        {value: '', expected: ''},
        {value: -1, expected: '-1'},
        {value: numberOfSlides, expected: `${numberOfSlides}`},
        {value: 'string', expected: 'string'},
        {value: null, expected: `${null}`},
        {value: undefined, expected: `${undefined}`},
        {value: {}, expected: `${{}}`},
        {value: true, expected: `${true}`},
        {value: false, expected: `${false}`},
        {value: '_remove_attr_', expected: null},
      ];
    } else if (type === 'number') {
      const randomValid = wcutils.getRandomInt(min, max);
      return [
        {value: randomValid, expected: `${randomValid}`},
        {value: '', expected: `${rollbackValue}`},
        {value: min - 1, expected: `${rollbackValue}`},
        {value: max + 1, expected: `${rollbackValue}`},
        {value: 'string', expected: `${rollbackValue}`},
        {value: null, expected: `${rollbackValue}`},
        {value: undefined, expected: `${rollbackValue}`},
        {value: {}, expected: `${rollbackValue}`},
        {value: true, expected: `${rollbackValue}`},
        {value: false, expected: `${rollbackValue}`},
      ];
    }
  };

  const allAttrTests = [
    {
      // selected has to be a Number in range [0, slides.length - 1].
      // Otherwise it rolls back to the previous value.
      attributeName: 'selected',
      tests: generateTests('number', 0, 0, numberOfSlides - 1),
    },
    {
      // the value should be just the 'toString()' result,
      // unless the attribute is removed
      attributeName: 'loop',
      tests: generateTests('boolean'),
    },
    {
      // the value should be just the 'toString()' result,
      // unless the attribute is removed
      attributeName: 'navigation',
      tests: generateTests('boolean'),
    },
    {
      // the value should be just the 'toString()' result,
      // unless the attribute is removed
      attributeName: 'pagination',
      tests: generateTests('boolean'),
    },
    {
      // the value should be just the 'toString()' result,
      // unless the attribute is removed
      attributeName: 'disable-drag',
      tests: generateTests('boolean'),
    },
    {
      // slidesPerView has to be a Number in range [1, slides.length].
      // Otherwise it rolls back to the previous value.
      attributeName: 'slides-per-view',
      tests: generateTests('number', 1, 1, numberOfSlides),
    },
    {
      // the value should be just the 'toString()' result,
      // unless the attribute is removed
      attributeName: 'reduced-motion',
      tests: generateTests('boolean'),
    },
    {
      // the value should be just the 'toString()' result,
      // unless the attribute is removed
      attributeName: 'auto-focus',
      tests: generateTests('boolean'),
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
    for (let p of allAttrTests) {
      describe(`the ${p.attributeName} attribute`, () => {
        for (let t of p.tests) {
          it(`should be ${t.expected} when set to ${t.value}`, async function() {
            await wcutils.flush();
            if (t.value === '_remove_attr_') {
              this.slider.removeAttribute(p.attributeName);
            } else {
              this.slider.setAttribute(p.attributeName, t.value);
            }
            await wcutils.flush();
            expect(this.slider.getAttribute(p.attributeName)).to.equal(t.expected);
          });
        }
      });
    }
  });
})();
