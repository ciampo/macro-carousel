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

    it('setting reducedMotion disables transitions', function() {
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
    });

    // TODO: testing reduced motion on drag events
  });
})();
