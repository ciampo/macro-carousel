/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  const selectedEvent = 'x-slider-selected-changed';

  const getSelectedThroughEvent = (xslider) => {
    return new Promise(resolve => {
      xslider.addEventListener(selectedEvent, resolve, {once: true});
    });
  }

  describe('Selected Event', function() {
    before(wcutils.before());
    after(wcutils.after());

    it('is fired when the element is initialised', function() {
      this.container.innerHTML = `
<x-slider>
  <article>Slide 1</article>
  <article>Slide 2</article>
  <article>Slide 3</article>
</x-slider>`;

      const slider = document.querySelector('x-slider');
      await customElements.whenDefined(slider.localName);
      const event = await getSelectedThroughEvent(slider);

      expect(event.detail).to.equal(slider.selected);

    });
  });
})();
