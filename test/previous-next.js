/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  const numberOfSlides = 4;

  describe('The', function() {
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

    describe('previous() function', function() {
      it('selects the previous slide', async function() {
        this.slider.selected = numberOfSlides - 1;
        this.slider.previous();
        expect(this.slider.selected).to.equal(numberOfSlides - 2);
      });

      it('does not wrap around when loop is disabled', async function() {
        this.slider.selected = 0;
        this.slider.previous();
        expect(this.slider.selected).to.equal(0);
      });

      it('wraps around when loop is enabled', async function() {
        this.slider.selected = 0;
        this.slider.loop = true;
        this.slider.previous();
        expect(this.slider.selected).to.equal(numberOfSlides - 1);
      });
    });

    describe('next() function', function() {
      it('selects the next slide', async function() {
        this.slider.selected = 0;
        this.slider.next();
        expect(this.slider.selected).to.equal(1);
      });

      it('does not wrap around when loop is disabled', async function() {
        this.slider.selected = numberOfSlides - 1;
        this.slider.next();
        expect(this.slider.selected).to.equal(numberOfSlides - 1);
      });

      it('wraps around when loop is enabled', async function() {
        this.slider.selected = numberOfSlides - 1;
        this.slider.loop = true;
        this.slider.next();
        expect(this.slider.selected).to.equal(0);
      });
    });
  });
})();
