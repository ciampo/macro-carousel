/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  describe('When there are no slides', function() {
    before(wcutils.before());
    after(wcutils.after());

    it('the selected value is still correct', function() {
      this.container.innerHTML = `<macro-carousel></macro-carousel>`;

      return wcutils.waitForElement('macro-carousel').then(() => {
        expect(document.querySelector('macro-carousel').selected)
            .to.equal(0);
      });
    });

    it('the slidesPerView value is still correct', function() {
      const slidesPerView = 2;
      this.container.innerHTML = `<macro-carousel slides-per-view="${slidesPerView}"></macro-carousel>`;

      return wcutils.waitForElement('macro-carousel').then(() => {
        expect(document.querySelector('macro-carousel').slidesPerView)
            .to.equal(1);
      });
    });
  });
})();
