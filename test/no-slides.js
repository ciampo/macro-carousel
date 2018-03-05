/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  describe('No slides', function() {
    before(wcutils.before());
    after(wcutils.after());

    it('selected value', function() {
      this.container.innerHTML = `<x-slider></x-slider>`;

      return wcutils.waitForElement('x-slider').then(() => {
        expect(document.querySelector('x-slider').selected)
            .to.equal(0);
      });
    });
  });
})();
