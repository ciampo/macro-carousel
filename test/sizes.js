/* eslint max-len: ["off"] */
/* eslint no-console: ["off"] */

(function() {
  const expect = chai.expect;

  const numberOfSlides = 20;

  const onTransitionEnd = el => Promise.race([
    wcutils.delay(1000),
    new Promise(resolve => {
      el.addEventListener('transitionend', resolve, {once: true});
    }),
  ]);

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
      <macro-carousel>
        ${[...Array(numberOfSlides).keys()]
      .map(i => `<article>Slide ${i}</article>`)
      .join('\n')}
      </macro-carousel>`;
      return wcutils.waitForElement('macro-carousel')
          .then(() => {
            this.slider = this.container.querySelector('macro-carousel');
            this.wrapper = this.slider._slidesWrapper;
          });
    });

    combinationToTest.selected.forEach(selectedValue => {
      combinationToTest.slidesPerView.forEach(slidesPerViewValue => {
        combinationToTest.gap.forEach(gapValue => {
          it(`are correct when the gap is ${gapValue}, selected is ${selectedValue} and slidesPerView is ${slidesPerViewValue}`, async function() {
            // Update gap, force update
            this.slider.style.setProperty('--macro-carousel-gap', `${gapValue}px`);
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
            const slidesGap = parseInt(window.wcutils.getCSSCustomProperty(this.slider, '--macro-carousel-gap'));

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

  const getHeight = el => parseInt(window.getComputedStyle(el)['height']);

  describe('Slides height', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      this.container.innerHTML = `
<macro-carousel class="slider">
  <article class="slide one">Slide 1</article>
  <article class="slide two">Slide 2</article>
  <article class="slide three">Slide 3</article>
  <article class="slide four">Slide 4</article>
  <article class="slide five">Slide 5</article>
</macro-carousel>`;
      return wcutils.waitForElement('macro-carousel')
          .then(() => {
            this.slider = this.container.querySelector('macro-carousel');
            this.slides = this.slider.querySelectorAll('.slide');
            this.one = this.slides[0];
            this.two = this.slides[1];
            this.three = this.slides[2];
            this.four = this.slides[3];
            this.five = this.slides[4];
          });
    });
    afterEach(wcutils.removeStyles);

    it('the tallest slide pushes the slider and the other slides', async function() {
      const setHeight = 400;
      wcutils.appendStyles(`
      .one {
        height: ${setHeight}px;
      }`);

      await wcutils.flush();

      expect(getHeight(this.slider)).to.equal(setHeight);
      expect(getHeight(this.two)).to.equal(setHeight);
    });

    it('slides without an explicit height (or align-self) stretch to the height of the slider', async function() {
      const setHeight = 300;
      const minHeight = 150;
      const slideFiveHeight = 200;

      wcutils.appendStyles(`
      .slider {
        height: ${setHeight}px;
        --macro-carousel-slide-min-height: ${minHeight}px;
      }

      .four {
        align-self: flex-start;
      }

      .five {
        height: ${slideFiveHeight}px;
      }`);

      await wcutils.flush();

      expect(getHeight(this.slider)).to.equal(setHeight);

      [this.one, this.two, this.three].forEach(s => {
        expect(getHeight(s)).to.equal(setHeight);
      });

      expect(getHeight(this.four)).to.equal(minHeight);

      expect(getHeight(this.five)).to.equal(slideFiveHeight);
    });

    it('when no height is set, the slide with the most content pushes everything else', async function() {
      this.three.innerHTML = `
      <h1>I'm slide 3</h1>
      <p>I'm</p>
      <p>the</p>
      <p>tallest!</p>`;

      await wcutils.flush();

      const expectedHeight = getHeight(this.three);

      expect(getHeight(this.slider)).to.equal(expectedHeight);

      this.slides.forEach(s => {
        expect(getHeight(s)).to.equal(expectedHeight);
      });
    });

    it(`the slider's height wins over slides' height`, async function() {
      const sliderHeight = 250;
      const slidesHeight = 400;

      wcutils.appendStyles(`
      .slider {
        height: ${sliderHeight}px;
      }

      .slides {
        height: ${slidesHeight}px;
      }`);

      expect(getHeight(this.slider)).to.equal(sliderHeight);

      this.slides.forEach(s => {
        expect(getHeight(s)).to.equal(sliderHeight);
      });
    });
  });
})();
