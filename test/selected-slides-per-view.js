/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  const numberOfSlides = 4;

  describe('The value of selected', function() {
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

    it('changes when slide-per-view changes', async function() {
      this.slider.selected = numberOfSlides - 1;
      expect(this.slider.selected).to.equal(numberOfSlides - 1);

      this.slider.slidesPerView = 2;
      await wcutils.flush();
      const constrainedSelected = numberOfSlides - this.slider.slidesPerView;
      expect(this.slider.selected).to.equal(constrainedSelected);

      this.slider.slidesPerView = 1;
      await wcutils.flush();
      expect(this.slider.selected).to.equal(constrainedSelected);

      this.slider.selected = numberOfSlides - 1;
      await wcutils.flush();
      expect(this.slider.selected).to.equal(numberOfSlides - 1);
    });

    it('returns indexes of slides in view', async function() {
      this.slider.selected = 0;
      this.slider.slidesPerView = 3;

      await wcutils.flush();
      expect(this.slider.slidesInView).to.deep.equal([0, 1, 2]);
    });
  });
})();
