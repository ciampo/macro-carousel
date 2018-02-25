/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  const numberOfSlides = 4;

  describe('The value of selected', function() {
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
  });
})();
