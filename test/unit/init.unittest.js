/* eslint max-len: ["off"] */

// TODO: reflect props and attrs

(function() {
  const expect = chai.expect;

  describe('x-slider', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      this.container.innerHTML = `<x-slider></x-slider>`;
      return wcutils.waitForElement('x-slider')
        .then(_ => {
          this.slider = this.container.querySelector('x-slider');
        });
    });

    it('should be successfully registered as a XSlider', function() {
      expect(this.slider.constructor.name).to.equal('XSlider');
    });
  });
})();
