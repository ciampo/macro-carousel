/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  const getSelectedEvent = el => new Promise(resolve => {
    el.addEventListener('x-slider-selected-changed', resolve, {once: true});
  });

  describe('Selected Event', function() {
    before(wcutils.before());
    after(wcutils.after());

    it('is fired when the element is initialised', async function() {
      this.container.innerHTML = `<x-slider><div>Slide 1</div></x-slider>`;

      const slider = document.querySelector('x-slider');
      const event = await getSelectedEvent(slider);
      expect(event.detail).to.equal(slider.selected);
    });
  });
})();
