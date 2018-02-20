/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  describe('Init', function() {
    before(wcutils.before());
    after(wcutils.after());

    it('declarative', function() {
      this.container.innerHTML = `<x-slider></x-slider>`;

      return wcutils.waitForElement('x-slider').then(() => {
        expect(document.querySelector('x-slider').constructor.name)
            .to.equal('XSlider');
      });
    });

    it('programmatic', function() {
      const slider = document.createElement('x-slider');

      return wcutils.waitForElement('x-slider').then(() => {
        expect(slider.constructor.name).to.equal('XSlider');
      });
    });
  });
})();
