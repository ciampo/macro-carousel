/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;
  const numberOfSlides = 4;

  const generateTests = (type, rollbackValue, min, max) => {
    if (type === 'boolean') {
      return [
        {value: true, expected: ''},
        {value: 2, expected: ''},
        {value: 'string', expected: ''},
        {value: {}, expected: ''},
        {value: 0, expected: null},
        {value: null, expected: null},
        {value: undefined, expected: null},
      ];
    } else if (type === 'number') {
      const randomValid = wcutils.getRandomInt(min, max);
      return [
        {value: randomValid, expected: `${randomValid}`},
        {value: min - 1, expected: `${rollbackValue}`},
        {value: max + 1, expected: `${rollbackValue}`},
        {value: 'string', expected: `${rollbackValue}`},
        {value: null, expected: `${rollbackValue}`},
        {value: undefined, expected: `${rollbackValue}`},
        {value: {}, expected: `${rollbackValue}`},
        {value: true, expected: `${rollbackValue}`},
      ];
    }
  };

  const allPropertyToAttributeTests = [
    {
      // selected has to be a Number in range [0, slides.length - 1].
      // Otherwise it rolls back to the previous value.
      propertyName: 'selected',
      tests: generateTests('number', 0, 0, numberOfSlides - 1),
    },
    {
      // truthy values set it to true, falsy values set it to false
      propertyName: 'loop',
      tests: generateTests('boolean'),
    },
    {
      // truthy values set it to true, falsy values set it to false
      propertyName: 'navigation',
      tests: generateTests('boolean'),
    },
    {
      // truthy values set it to true, falsy values set it to false
      propertyName: 'pagination',
      tests: generateTests('boolean'),
    },
    {
      // truthy values set it to true, falsy values set it to false
      propertyName: 'disableDrag',
      tests: generateTests('boolean'),
    },
    {
      // slidesPerView has to be a Number in range [1, slides.length].
      // Otherwise it rolls back to the previous value.
      propertyName: 'slidesPerView',
      tests: generateTests('number', 1, 1, numberOfSlides),
    },
    {
      // truthy values set it to true, falsy values set it to false
      propertyName: 'reducedMotion',
      tests: generateTests('boolean'),
    },
    {
      // truthy values set it to true, falsy values set it to false
      propertyName: 'autoFocus',
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
    for (const p of allPropertyToAttributeTests) {
      const attributeName = wcutils.camelCaseToDash(p.propertyName);
      describe(`the ${attributeName} attribute`, () => {
        for (const t of p.tests) {
          it(`should be ${t.expected} when the ${p.propertyName} property is set to ${t.value}`, async function() {
            await wcutils.flush();
            this.slider[p.propertyName] = t.value;
            await wcutils.flush();
            expect(this.slider.getAttribute(attributeName)).to.equal(t.expected);
          });
        }
      });
    }
  });
})();
