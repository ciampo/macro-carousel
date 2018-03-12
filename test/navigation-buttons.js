/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  const numberOfSlides = 5;

  const disabledTestCombinations = {
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
    ],
  };

  describe('The', function() {
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

    Object.keys(disabledTestCombinations).forEach(testBtn => {
      describe(`${testBtn} navigation button`, function() {
        disabledTestCombinations[testBtn].forEach(test => {
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

  describe('Navigation buttons', function() {
    before(wcutils.before());
    after(wcutils.after());

    it('are added and then removed from the light DOM when setting navigation to true and then false', async function() {
      this.container.innerHTML = `
          <x-slider navigation>
            ${[...Array(numberOfSlides).keys()]
                .map(i => `<article>Slide ${i}</article>`)
                .join('\n')}
          </x-slider>`;
      await wcutils.waitForElement('x-slider');

      const slider = this.container.querySelector('x-slider');
      let previousBtn = this.container.querySelector('.x-slider-previous');
      let nextBtn = this.container.querySelector('.x-slider-next');

      expect(previousBtn.constructor.name).to.equal('XSliderButton');
      expect(nextBtn.constructor.name).to.equal('XSliderButton');

      slider.navigation = false;
      await window.wcutils.flush();

      previousBtn = this.container.querySelector('.x-slider-previous');
      nextBtn = this.container.querySelector('.x-slider-next');

      expect(previousBtn).to.be.null;
      expect(nextBtn).to.be.null;
    });

    it('are added and then removed from the light DOM when setting navigation to false and then true', async function() {
      this.container.innerHTML = `
          <x-slider>
            ${[...Array(numberOfSlides).keys()]
                .map(i => `<article>Slide ${i}</article>`)
                .join('\n')}
          </x-slider>`;
      await wcutils.waitForElement('x-slider');

      const slider = this.container.querySelector('x-slider');
      let previousBtn = this.container.querySelector('.x-slider-previous');
      let nextBtn = this.container.querySelector('.x-slider-next');

      expect(previousBtn).to.be.null;
      expect(nextBtn).to.be.null;

      slider.navigation = true;
      await window.wcutils.flush();

      previousBtn = this.container.querySelector('.x-slider-previous');
      nextBtn = this.container.querySelector('.x-slider-next');

      expect(previousBtn.constructor.name).to.equal('XSliderButton');
      expect(nextBtn.constructor.name).to.equal('XSliderButton');
    });
  });

  describe('The next navigation button', function() {
    before(wcutils.before());
    after(wcutils.after());

    it('is updated when appending slides', async function() {
      this.container.innerHTML = `
          <x-slider navigation selected="${numberOfSlides - 1}">
            ${[...Array(numberOfSlides).keys()]
                .map(i => `<article>Slide ${i}</article>`)
                .join('\n')}
          </x-slider>`;
      await wcutils.waitForElement('x-slider');

      const slider = this.container.querySelector('x-slider');
      const nextBtn = slider.querySelector('.x-slider-next');

      expect(nextBtn.disabled).to.be.true;

      const newSlide = document.createElement('article');
      slider.appendChild(newSlide);
      await window.wcutils.flush();

      expect(nextBtn.disabled).to.be.false;
    });

    it('is updated when removing slides', async function() {
      this.container.innerHTML = `
          <x-slider navigation selected="${numberOfSlides - 2}">
            ${[...Array(numberOfSlides).keys()]
                .map(i => `<article>Slide ${i}</article>`)
                .join('\n')}
          </x-slider>`;
      await wcutils.waitForElement('x-slider');

      const slider = this.container.querySelector('x-slider');
      const nextBtn = slider.querySelector('.x-slider-next');

      expect(nextBtn.disabled).to.be.false;

      const oneSlide = slider.querySelector('article');
      slider.removeChild(oneSlide);

      await window.wcutils.flush();

      expect(nextBtn.disabled).to.be.true;
    });
  });
})();
