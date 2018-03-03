/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  const numberOfSlides = 20;

  const onTransitionEnd = el => new Promise(resolve => {
    el.addEventListener('transitionend', resolve, {once: true});
  });

  const combinationToTest = {
    selected: [0, 1, 5, -1],
    slidesPerView: [1, 4],
    gap: [0, 4, 16, 70],
  };

  describe('Slides width, slides gap and wrapper transition', function() {
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
          this.wrapper = this.slider._slidesWrapper;
        });
    });

    combinationToTest.selected.forEach(selectedValue => {
      combinationToTest.slidesPerView.forEach(slidesPerViewValue => {
        combinationToTest.gap.forEach(gapValue => {
          it(`are correct when the gap is ${gapValue}, selected is ${selectedValue} and slidesPerView is ${slidesPerViewValue}`, async function() {
            // Update gap, force update
            this.slider.style.setProperty('--x-slider-gap', `${gapValue}px`);
            this.slider.update();
            await wcutils.flush();

            // Update slidesPerView
            if (this.slider.slidesPerView !== slidesPerViewValue) {
              this.slider.slidesPerView = slidesPerViewValue;
              await wcutils.flush();
            }

            // Change selected, wait for the wrapper transition to end
            let computedSelectedValue = selectedValue >= 0 ?
                selectedValue :
                numberOfSlides + selectedValue;
            // Selected value range is [0, slides.length - slidesPerView]
            computedSelectedValue = Math.max(0, Math.min(computedSelectedValue, numberOfSlides - slidesPerViewValue));

            if (this.slider.selected !== computedSelectedValue) {
              const transitionEndPromise = onTransitionEnd(this.wrapper);
              this.slider.selected = computedSelectedValue;
              await transitionEndPromise;
            }

            // Get slider width
            const sliderWidth = this.slider.getBoundingClientRect().width;

            // Get wrapper computed transform
            const wrapperTranslateX = window.getComputedStyle(this.wrapper)['transform'];
            const wrapperTransformObj = window.wcutils.matrixToTransformObj(wrapperTranslateX);

            // Get slides width and gap, to then compute expected value
            const firstSlide = document.querySelector('article');
            const slidesWidth = firstSlide.getBoundingClientRect().width;
            const slidesGap = parseInt(window.wcutils.getCSSCustomProperty(this.slider, '--x-slider-gap'));

            // Check slides' gap.
            const expectedSlidesGap = parseInt(window.getComputedStyle(firstSlide)['margin-right']);
            expect(gapValue).to.equal(expectedSlidesGap);

            // Check slides' width.
            const expectedSlideWidth =
                (sliderWidth - (this.slider.slidesPerView - 1) * slidesGap) /
                this.slider.slidesPerView;
            expect(slidesWidth).to.equal(expectedSlideWidth);

            // Check wrapper translate.
            const expectedWrapperTranslate = `${- this.slider.selected * (slidesGap + slidesWidth)}px, 0px`;
            expect(wrapperTransformObj.translate).to.equal(expectedWrapperTranslate);
          });
        });
      });
    });
  });
})();
