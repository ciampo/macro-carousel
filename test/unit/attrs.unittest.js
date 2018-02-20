/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;
  const numberOfSlides = 4;
  const allAttrTests = [
    {
      // selected has to be a Number in range [0, slides.length - 1].
      // Otherwise it rolls back to the previous value.
      attributeName: 'selected',
      tests: [
        {value: 2, expected: '2'},
        {value: '', expected: '0'},
        {value: -1, expected: '0'},
        {value: numberOfSlides, expected: '0'},
        {value: 'string', expected: '0'},
        {value: null, expected: '0'},
        {value: undefined, expected: '0'},
        {value: {}, expected: '0'},
        {value: true, expected: '0'},
        {value: false, expected: '0'},
        {value: '_remove_attr_', expected: null}
      ],
    },
    {
      // the value should be just the 'toString()' result,
      // unless the attribute is removed
      attributeName: 'loop',
      tests: [
        {value: '', expected: ''},
        {value: -1, expected: '-1'},
        {value: numberOfSlides, expected: `${numberOfSlides}`},
        {value: 'string', expected: 'string'},
        {value: null, expected: `${null}`},
        {value: undefined, expected: `${undefined}`},
        {value: {}, expected: `${{}}`},
        {value: true, expected: `${true}`},
        {value: false, expected: `${false}`},
        {value: '_remove_attr_', expected: null}
      ],
    },
    {
      // the value should be just the 'toString()' result,
      // unless the attribute is removed
      attributeName: 'navigation',
      tests: [
        {value: '', expected: ''},
        {value: -1, expected: '-1'},
        {value: numberOfSlides, expected: `${numberOfSlides}`},
        {value: 'string', expected: 'string'},
        {value: null, expected: `${null}`},
        {value: undefined, expected: `${undefined}`},
        {value: {}, expected: `${{}}`},
        {value: true, expected: `${true}`},
        {value: false, expected: `${false}`},
        {value: '_remove_attr_', expected: null}
      ],
    },
    {
      // the value should be just the 'toString()' result,
      // unless the attribute is removed
      attributeName: 'pagination',
      tests: [
        {value: '', expected: ''},
        {value: -1, expected: '-1'},
        {value: numberOfSlides, expected: `${numberOfSlides}`},
        {value: 'string', expected: 'string'},
        {value: null, expected: `${null}`},
        {value: undefined, expected: `${undefined}`},
        {value: {}, expected: `${{}}`},
        {value: true, expected: `${true}`},
        {value: false, expected: `${false}`},
        {value: '_remove_attr_', expected: null}
      ],
    },
    {
      // the value should be just the 'toString()' result,
      // unless the attribute is removed
      attributeName: 'disable-drag',
      tests: [
        {value: '', expected: ''},
        {value: -1, expected: '-1'},
        {value: numberOfSlides, expected: `${numberOfSlides}`},
        {value: 'string', expected: 'string'},
        {value: null, expected: `${null}`},
        {value: undefined, expected: `${undefined}`},
        {value: {}, expected: `${{}}`},
        {value: true, expected: `${true}`},
        {value: false, expected: `${false}`},
        {value: '_remove_attr_', expected: null}
      ],
    },
    {
      // slidesPerView has to be a Number in range [1, slides.length].
      // Otherwise it rolls back to the previous value.
      attributeName: 'slides-per-view',
      tests: [
        {value: numberOfSlides, expected: `${numberOfSlides}`},
        {value: '', expected: '1'},
        {value: -1, expected: '1'},
        {value: numberOfSlides + 1, expected: '1'},
        {value: 'string', expected: '1'},
        {value: null, expected: '1'},
        {value: undefined, expected: '1'},
        {value: {}, expected: '1'},
        {value: true, expected: '1'},
        {value: false, expected: '1'},
        {value: '_remove_attr_', expected: null}
      ],
    },
    {
      // the value should be just the 'toString()' result,
      // unless the attribute is removed
      attributeName: 'reduced-motion',
      tests: [
        {value: '', expected: ''},
        {value: -1, expected: '-1'},
        {value: numberOfSlides, expected: `${numberOfSlides}`},
        {value: 'string', expected: 'string'},
        {value: null, expected: `${null}`},
        {value: undefined, expected: `${undefined}`},
        {value: {}, expected: `${{}}`},
        {value: true, expected: `${true}`},
        {value: false, expected: `${false}`},
        {value: '_remove_attr_', expected: null}
      ],
    },
    {
      // the value should be just the 'toString()' result,
      // unless the attribute is removed
      attributeName: 'auto-focus',
      tests: [
        {value: '', expected: ''},
        {value: -1, expected: '-1'},
        {value: numberOfSlides, expected: `${numberOfSlides}`},
        {value: 'string', expected: 'string'},
        {value: null, expected: `${null}`},
        {value: undefined, expected: `${undefined}`},
        {value: {}, expected: `${{}}`},
        {value: true, expected: `${true}`},
        {value: false, expected: `${false}`},
        {value: '_remove_attr_', expected: null}
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
