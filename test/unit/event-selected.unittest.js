/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  const getSelectedEvent = (el, log) => new Promise(resolve => {
    el.addEventListener('x-slider-selected-changed', resolve, {once: true});
  });

  describe('The x-slider-selected-changed event is fired', function() {
    before(wcutils.before());
    after(wcutils.after());

    it('when the element is initialised', async function() {
      this.container.innerHTML = `<x-slider><div>Slide 1</div></x-slider>`;

      const slider = document.querySelector('x-slider');
      const event = await getSelectedEvent(slider);
      expect(event.detail).to.equal(0);
    });

    it('when setting selected in the markup', async function() {
      const selected = 1;
      this.container.innerHTML = `
<x-slider selected="${selected}">
  <div>Slide 1</div>
  <div>Slide 2</div>
</x-slider>`;

      const slider = document.querySelector('x-slider');
      const event = await getSelectedEvent(slider);
      expect(event.detail).to.equal(selected);
    });

    it('when setting selected programmatically', async function() {
      this.container.innerHTML = `
<x-slider>
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</x-slider>`;

      const slider = document.querySelector('x-slider');
      await wcutils.flush();
      const evListenerPromise = getSelectedEvent(slider);
      slider.selected = 2;
      event = await evListenerPromise;

      expect(event.detail).to.equal(2);
    });

    it('when calling next()', async function() {
      this.container.innerHTML = `
<x-slider>
  <div>Slide 1</div>
  <div>Slide 2</div>
</x-slider>`;

      const slider = document.querySelector('x-slider');
      const selecter = slider.selected;
      await wcutils.flush();
      const evListenerPromise = getSelectedEvent(slider);
      slider.next();
      event = await evListenerPromise;

      expect(event.detail).to.equal(selecter + 1);
    });

    it('when calling previous()', async function() {
      this.container.innerHTML = `
<x-slider selected="1">
  <div>Slide 1</div>
  <div>Slide 2</div>
</x-slider>`;

      const slider = document.querySelector('x-slider');
      const selecter = slider.selected;
      await wcutils.flush();
      const evListenerPromise = getSelectedEvent(slider);
      slider.previous();
      event = await evListenerPromise;

      expect(event.detail).to.equal(selecter - 1);
    });

    it('when calling previous()', async function() {
      this.container.innerHTML = `
<x-slider selected="1">
  <div>Slide 1</div>
  <div>Slide 2</div>
</x-slider>`;

      const slider = document.querySelector('x-slider');
      const selecter = slider.selected;
      await wcutils.flush();
      const evListenerPromise = getSelectedEvent(slider);
      slider.previous();
      event = await evListenerPromise;

      expect(event.detail).to.equal(selecter - 1);
    });

    it('when removing slides', async function() {
      this.container.innerHTML = `
<x-slider selected="2">
  <div class="slide">Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
</x-slider>`;

      const slider = document.querySelector('x-slider');
      await wcutils.flush();
      const evListenerPromise = getSelectedEvent(slider);
      const slide = document.querySelector('.slide');
      slider.removeChild(slide);
      event = await evListenerPromise;

      expect(event.detail).to.equal(1);
    });

    it('when changing slidesPerView', async function() {
      this.container.innerHTML = `
<x-slider selected="4">
  <div>Slide 1</div>
  <div>Slide 2</div>
  <div>Slide 3</div>
  <div>Slide 4</div>
  <div>Slide 5</div>
</x-slider>`;

      const slider = document.querySelector('x-slider');
      await wcutils.flush();
      const evListenerPromise = getSelectedEvent(slider);
      slider.slidesPerView = 3;
      event = await evListenerPromise;

      expect(event.detail).to.equal(2);
    });
  });
})();
