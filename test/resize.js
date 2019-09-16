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
      <macro-carousel>
        ${[...Array(numberOfSlides).keys()]
      .map(i => `<article>Slide ${i}</article>`)
      .join('\n')}
      </macro-carousel>`;
      return wcutils.waitForElement('macro-carousel')
          .then(() => {
            this.slider = this.container.querySelector('macro-carousel');
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
