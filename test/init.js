/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  describe('Init', function() {
    before(wcutils.before());
    after(wcutils.after());

    it('declarative', function() {
      this.container.innerHTML = `<macro-carousel></macro-carousel>`;

      return wcutils.waitForElement('macro-carousel').then(() => {
        expect(document.querySelector('macro-carousel').constructor.name)
            .to.equal('MacroCarousel');
      });
    });

    it('programmatic', function() {
      const slider = document.createElement('macro-carousel');

      return wcutils.waitForElement('macro-carousel').then(() => {
        expect(slider.constructor.name).to.equal('MacroCarousel');
      });
    });
  });
})();
