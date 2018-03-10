/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  describe('When there are no slides', function() {
    before(wcutils.before());
    after(wcutils.after());

    it('the selected value is still correct', function() {
      this.container.innerHTML = `<x-slider></x-slider>`;

      return wcutils.waitForElement('x-slider').then(() => {
        expect(document.querySelector('x-slider').selected)
            .to.equal(0);
      });
    });

    it('the slidesPerView value is still correct', function() {
      const slidesPerView = 2;
      this.container.innerHTML = `<x-slider slides-per-view="${slidesPerView}"></x-slider>`;

      return wcutils.waitForElement('x-slider').then(() => {
        expect(document.querySelector('x-slider').slidesPerView)
            .to.equal(1);
      });
    });
  });
})();
