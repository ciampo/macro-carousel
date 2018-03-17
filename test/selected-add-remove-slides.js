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
          this.slides = document.querySelectorAll('article');
        });
    });

    it('changes when adding / removing slides', async function() {
      this.slider.selected = numberOfSlides - 1;
      expect(this.slider.selected).to.equal(numberOfSlides - 1);

      this.slider.removeChild(this.slides[0]);
      await wcutils.flush();
      expect(this.slider.selected).to.equal(numberOfSlides - 2);

      this.slider.removeChild(this.slides[1]);
      await wcutils.flush();
      expect(this.slider.selected).to.equal(numberOfSlides - 3);

      this.slider.appendChild(this.slides[0]);
      this.slider.appendChild(this.slides[1]);
      this.slider.appendChild(document.createElement('div'));
      await wcutils.flush();
      expect(this.slider.selected).to.equal(numberOfSlides - 3);

      this.slider.selected = numberOfSlides;
      await wcutils.flush();
      expect(this.slider.selected).to.equal(numberOfSlides);
    });
  });
})();
