/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  const numberOfSlides = 5;
  const minNumberOfViewsToEnableInfiniteLoop = 3;

  describe('The infinite loop functionality', function() {
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

    it('is disabled when loop is disabled', async function() {
      expect(this.slider._infiniteLoop).to.be.false;
    });

    it('is disabled when loop is enabled but there aren\'t enough slides', async function() {
      this.slider.loop = true;

      const slides = document.querySelectorAll('article');
      for (let i = minNumberOfViewsToEnableInfiniteLoop - 1; i < numberOfSlides; i++) {
        this.slider.removeChild(slides[i]);
      }
      await wcutils.flush();
      expect(this.slider._infiniteLoop).to.be.false;
    });

    it('is disabled when loop is enabled but there aren\'t enough views', async function() {
      this.slider.loop = true;
      this.slider.slidesPerView = numberOfSlides - 1;
      await wcutils.flush();
      expect(this.slider._infiniteLoop).to.be.false;
    });

    it('is enabled when loop is enabled and there are enough slides', async function() {
      this.slider.loop = true;

      const slides = document.querySelectorAll('article');
      for (let i = minNumberOfViewsToEnableInfiniteLoop; i < numberOfSlides; i++) {
        this.slider.removeChild(slides[i]);
      }
      await wcutils.flush();
      expect(this.slider._infiniteLoop).to.be.true;
    });

    it('is enabled when loop is enabled and there are enough views', async function() {
      this.slider.loop = true;
      this.slider.slidesPerView = numberOfSlides - 3;
      await wcutils.flush();
      expect(this.slider._infiniteLoop).to.be.true;
    });
  });
})();
