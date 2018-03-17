/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;
  const numberOfSlides = 4;

  const generateTests = (type, rollbackValue, min, max) => {
    if (type === 'boolean') {
      return [
        {value: '_remove_attr_', expected: false},
        {value: '', expected: true},
        {value: 2, expected: true},
        {value: 'string', expected: true},
        {value: {}, expected: true},
        {value: 0, expected: true},
        {value: null, expected: true},
        {value: undefined, expected: true},
      ];
    } else if (type === 'number') {
      const randomValid = wcutils.getRandomInt(min, max);
      return [
        {value: randomValid, expected: randomValid},
        {value: min - 1, expected: rollbackValue},
        {value: max + 1, expected: rollbackValue},
        {value: 'string', expected: rollbackValue},
        {value: null, expected: rollbackValue},
        {value: undefined, expected: rollbackValue},
        {value: {}, expected: rollbackValue},
        {value: true, expected: rollbackValue},
        {value: '_remove_attr_', expected: rollbackValue},
      ];
    }
  };

  const allAttributeToPropertyTests = [
    {
      // selected has to be a Number in range [0, slides.length - 1].
      // Otherwise it rolls back to the previous value.
      attributeName: 'selected',
      tests: generateTests('number', 0, 0, numberOfSlides - 1),
    },
    {
      // truthy values set it to true, falsy values set it to false
      attributeName: 'loop',
      tests: generateTests('boolean'),
    },
    {
      // truthy values set it to true, falsy values set it to false
      attributeName: 'navigation',
      tests: generateTests('boolean'),
    },
    {
      // truthy values set it to true, falsy values set it to false
      attributeName: 'pagination',
      tests: generateTests('boolean'),
    },
    {
      // truthy values set it to true, falsy values set it to false
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
      // truthy values set it to true, falsy values set it to false
      attributeName: 'reduced-motion',
      tests: generateTests('boolean'),
    },
    {
      // truthy values set it to true, falsy values set it to false
      attributeName: 'auto-focus',
      tests: generateTests('boolean'),
    },
  ];

  describe('The value of', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      this.container.innerHTML = `
      <macro-carousel>
        ${[...Array(numberOfSlides).keys()]
            .map(i => `<article>Slide ${i}</article>`)
            .join('\n')}
      </macro-carousel>`;
      return wcutils.waitForElement('macro-carousel')
        .then(() => {
          this.slider = this.container.querySelector('macro-carousel');
        });
    });

    // Since all tests are async function, the loop variable is saved to a local
    // variable. An alternative approach would be to wrap the test in a closure.
    for (let p of allAttributeToPropertyTests) {
      let propertyName = wcutils.dashToCamelCase(p.attributeName);
      describe(`the ${propertyName} property`, () => {
        for (let t of p.tests) {
          it(`should be ${t.expected} when the ${p.attributeName} attribute is set to ${t.value}`, async function() {
            await wcutils.flush();
            if (t.value === '_remove_attr_') {
              this.slider.removeAttribute(p.attributeName);
            } else {
              this.slider.setAttribute(p.attributeName, t.value);
            }
            await wcutils.flush();
            expect(this.slider[propertyName]).to.equal(t.expected);
          });
        }
      });
    }
  });
})();
