/* eslint max-len: ["off"] */
/* eslint no-console: ["off"] */

(function() {
  const expect = chai.expect;

  const onTransitionEnd = el => new Promise(resolve => {
    el.addEventListener('transitionend', resolve, {once: true});
  });

  describe('a11y —', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      this.container.innerHTML = `
<x-slider>
  <article>Slide 1</article>
  <article>Slide 2</article>
  <article>Slide 3</article>
</x-slider>`;
      return wcutils.waitForElement('x-slider')
        .then(() => {
          this.slider = this.container.querySelector('x-slider');
          this.wrapper = this.slider._slidesWrapper;
          this.slides = this.container.querySelectorAll('article');
        });
    });

    it('setting autoFocus makes the selected slide the focused element', async function() {
      const selected = 1;

      this.slider.autoFocus = true;
      await window.wcutils.flush();

      const transitionEndPromise = onTransitionEnd(this.wrapper);
      this.slider.selected = selected;
      await transitionEndPromise;

      expect(document.activeElement).to.equal(this.slides[selected]);
    });

    // TODO: testing reduced motion on drag events
    it('setting reducedMotion disables transitions', async function() {
      await wcutils.flush();

      const initialTransitionDuration =
          window.getComputedStyle(this.wrapper)['transition-duration'];
      const initialTransitionDelay =
          window.getComputedStyle(this.wrapper)['transition-delay'];

      this.slider.reducedMotion = true;

      expect(this.slider._transitioning).to.be.false;
      expect(window.getComputedStyle(this.wrapper)['transition-duration'])
          .to.equal('0s');
      expect(window.getComputedStyle(this.wrapper)['transition-delay'])
          .to.equal('0s');

      this.slider.selected = 2;

      // Get wrapper computed transform
      const wrapperTranslateX = window.getComputedStyle(this.wrapper)['transform'];
      const wrapperTransformObj = window.wcutils.matrixToTransformObj(wrapperTranslateX);

      const firstSlide = document.querySelector('article');
      const slidesWidth = firstSlide.getBoundingClientRect().width;
      const slidesGap = parseInt(window.wcutils.getCSSCustomProperty(this.slider, '--x-slider-gap'));

      const expectedWrapperTranslate = `${- this.slider.selected * (slidesGap + slidesWidth)}px, 0px`;
      expect(wrapperTransformObj.translate).to.equal(expectedWrapperTranslate);

      this.slider.reducedMotion = false;

      await wcutils.flush();

      expect(this.slider._transitioning).to.be.true;
      expect(window.getComputedStyle(this.wrapper)['transition-duration'])
          .to.equal(initialTransitionDuration);
      expect(window.getComputedStyle(this.wrapper)['transition-delay'])
          .to.equal(initialTransitionDelay);
    });

    it('slider and slides have correct roles', function() {
      expect(this.slider.getAttribute('role')).to.equal('list');

      this.slides.forEach(s => {
        expect(s.getAttribute('role')).to.equal('listitem');
      });
    });

    it('slides have tabindex=-1', function() {
      this.slides.forEach(s => {
        expect(s.getAttribute('tabindex')).to.equal('-1');
      });
    });

    it('slides have correct `aria-hidden` and `inert` values depending on their visibility', async function() {
      const checkSlides = () => {
        this.slides.forEach((s, i) => {
          const visible = Math.abs(i - this.slider.selected) < this.slider.slidesPerView;
          expect(s.hasAttribute('inert')).to.equal(!visible);
          expect(s.getAttribute('aria-hidden'))
              .to.equal(visible ? 'false' : 'true');
        });
      };

      this.slider.selected = 1;
      await window.wcutils.flush();
      checkSlides();

      this.slider.slidesPerView = 2;
      this.slider.selected = 0;
      await window.wcutils.flush();
      checkSlides();
    });

    it('the aria-live region correctly update its text', async function() {
      // check aria-atomic and aria-live=polite
      const liveRegion = this.slider.querySelector('[slot=ariaSlot]');
      expect(liveRegion.getAttribute('aria-live')).to.equal('polite');
      expect(liveRegion.getAttribute('aria-atomic')).to.equal('true');

      expect(liveRegion.textContent).to.equal(`Item 1 of 3 visible`);

      this.slider.slidesPerView = 2;
      this.slider.selected = 1;
      await window.wcutils.flush();
      expect(liveRegion.textContent).to.equal(`Items 2 and 3 of 3 visible`);
    });

    it('navigation buttons have a correct aria-label', async function() {
      this.slider.navigation = true;
      await window.wcutils.flush();

      const prevBtn = this.slider.querySelector('.x-slider-previous');
      const nextBtn = this.slider.querySelector('.x-slider-next');

      expect(prevBtn.getAttribute('aria-label')).to.equal('Go to previous item');
      expect(nextBtn.getAttribute('aria-label')).to.equal('Go to next item');
    });

    it('paginationIndicators have a correct aria-label', async function() {
      this.slider.pagination = true;
      await window.wcutils.flush();

      const paginationIndicators = this.slider.querySelectorAll('[slot=paginationSlot]');

      paginationIndicators.forEach((pi, i) => {
        expect(pi.getAttribute('aria-label')).to.equal(`Go to item ${i + 1}`);
      });
    });

    it('pressing the arrow keys on the slider selects previous/next slides', function() {
      const numberOfSlides = 3;

      // Right arrow all the way
      [...Array(numberOfSlides).keys()].forEach(selectedIndex => {
        expect(this.slider.selected).to.equal(selectedIndex);
        simulant.fire(this.slider, 'keydown', {keyCode: 39});
        expect(this.slider.selected).to.equal(Math.min(selectedIndex + 1, numberOfSlides - 1));
      });

      // Left arrow all the way
      [...Array(numberOfSlides).keys()].forEach(selectedIndex => {
        expect(this.slider.selected).to.equal(numberOfSlides - selectedIndex - 1);
        simulant.fire(this.slider, 'keydown', {keyCode: 37});
        expect(this.slider.selected).to.equal(Math.max(0, numberOfSlides - selectedIndex - 2));
      });

      // Up arrow all the way
      [...Array(numberOfSlides).keys()].forEach(selectedIndex => {
        expect(this.slider.selected).to.equal(selectedIndex);
        simulant.fire(this.slider, 'keydown', {keyCode: 40});
        expect(this.slider.selected).to.equal(Math.min(selectedIndex + 1, numberOfSlides - 1));
      });

      // Down arrow all the way
      [...Array(numberOfSlides).keys()].forEach(selectedIndex => {
        expect(this.slider.selected).to.equal(numberOfSlides - selectedIndex - 1);
        simulant.fire(this.slider, 'keydown', {keyCode: 38});
        expect(this.slider.selected).to.equal(Math.max(0, numberOfSlides - selectedIndex - 2));
      });
    });
  });
})();
