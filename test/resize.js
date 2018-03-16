/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;
  const spy = chai.spy;

  const numberOfSlides = 4;

  describe('When resizing the window', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      this.container.innerHTML = `
      <x-slider>
        ${[...Array(numberOfSlides).keys()]
            .map(i => `<article>Slide ${i}</article>`)
            .join('\n')}
      </x-slider>`;
      return wcutils.waitForElement('x-slider')
        .then(() => {
          this.slider = this.container.querySelector('x-slider');
        });
    });

    it('the update function is called', async function() {
      await wcutils.flush();

      const spied = spy.on(this.slider, 'update');

      expect(this.slider._transitioning).to.be.true;

      // Resize event.
      simulant.fire(window, 'resize');

      // Transitions are disabled while resizing.
      expect(spied).to.have.been.called();
    });
  });
})();
