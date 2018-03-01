/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  const numberOfSlides = 5;

  const testCombinations = {
    previous: [
      {loop: false, selected: 0, expectDisabled: true},
      {loop: false, selected: 1, expectDisabled: false},
      {loop: false, selected: numberOfSlides - 1, expectDisabled: false},
      {loop: true, selected: 0, expectDisabled: false},
      {loop: true, selected: 1, expectDisabled: false},
      {loop: true, selected: numberOfSlides - 1, expectDisabled: false},
    ],
    next: [
      {loop: false, selected: 0, expectDisabled: false},
      {loop: false, selected: numberOfSlides - 2, expectDisabled: false},
      {loop: false, selected: numberOfSlides - 1, expectDisabled: true},
      {loop: true, selected: 0, expectDisabled: false},
      {loop: true, selected: numberOfSlides - 2, expectDisabled: false},
      {loop: true, selected: numberOfSlides - 1, expectDisabled: false},
    ]
  }

  describe('The navigation button', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      this.container.innerHTML = `
      <x-slider navigation>
        ${[...Array(numberOfSlides).keys()]
            .map(i => `<article>Slide ${i}</article>`)
            .join('\n')}
      </x-slider>`;
      return wcutils.waitForElement('x-slider')
        .then(() => {
          this.slider = this.container.querySelector('x-slider');
          this.previousBtn = this.slider.querySelector('.x-slider-previous');
          this.nextBtn = this.slider.querySelector('.x-slider-next');
        });
    });

    Object.keys(testCombinations).forEach(testBtn => {
      describe(testBtn, function() {
        testCombinations[testBtn].forEach(test => {
          it(`should${test.expectDisabled ? '' : ' not'} be disabled when loop is ${test.loop} and selected is ${test.selected}`, async function() {
            this.slider.loop = test.loop;
            this.slider.selected = test.selected;
            await window.wcutils.flush();

            expect(this[`${testBtn}Btn`].disabled).to.equal(test.expectDisabled);
          });
        });
      });
    });

  });
})();
