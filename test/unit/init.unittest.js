/* eslint max-len: ["off"] */

// TODO: reflect props and attrs:
// - set a property, read the property and the attribute
// - set an attribute, read the property and the attribute
// - Try to set unvalid values

(function() {
  const expect = chai.expect;

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

  describe('Property', function() {
    const numberOfSlides = 4;

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

    const allPropertyTests = [
      {
        name: 'selected',
        tests: [
          {value: 2, expected: 2},
          {value: -1, expected: 0},
          {value: numberOfSlides, expected: 0},
          {value: 'string', expected: 0},
          {value: null, expected: 0},
          {value: undefined, expected: 0},
          {value: {}, expected: 0},
          {value: true, expected: 0},
        ]
      }
    ];

    for (property of allPropertyTests) {
      describe(`${property.name}`, () => {
        for (test of property.tests) {
          // Since all tests are async function, the current value of `test`
          // is saved to a local variable. An alternative approach would be
          // to wrap the test in a closure.
          let t = test;
          it(`should be ${t.value}`, async function() {
            await wcutils.flush();
            this.slider.selected = t.value;
            await wcutils.flush();
            expect(this.slider.selected).to.equal(t.expected);
          });
        }
      });
    }
  });
})();
