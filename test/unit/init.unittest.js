/* eslint max-len: ["off"] */

// TODO: reflect props and attrs:
// - set a property, read the property and the attribute
// - set an attribute, read the property and the attribute
// - Try to set unvalid values

(function() {
  const expect = chai.expect;

  describe('x-slider', () => {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async () => {
      this.container.innerHTML = `<x-slider></x-slider>`;
      return wcutils.waitForElement('x-slider')
        .then(() => {
          this.slider = this.container.querySelector('x-slider');
        });
    });

    it('should be successfully registered as a XSlider', () => {
      expect(this.slider.constructor.name).to.equal('XSlider');
    });
  });
})();
