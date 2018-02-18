/* eslint max-len: ["off"] */

// TODO: reflect props and attrs:
// - set a property, read the property and the attribute
// - set an attribute, read the property and the attribute
// - Try to set unvalid values

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
