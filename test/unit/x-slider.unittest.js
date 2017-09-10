/* eslint max-len: ["off"] */

// TODO: initial-selection (correct number, out of bounds number, string, epmty)
// TODO: selected (correct number, out of bounds number, string, empty)
// TODO: hidden
// TODO: pagination (check that bullets are always updated with slides, that the selected bullet point always reflects the currently selected slide)

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

    it('should be registered', function() {
      expect(this.slider.constructor.name).to.equal('XSlider');
    });
  });
})();
