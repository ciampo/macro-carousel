/* eslint max-len: ["off"] */
/* eslint no-console: ["off"] */
/* eslint-disable */

(function() {
  const expect = chai.expect;

  const numberOfSlides = 4;

  const bodyWidth = 300;

  describe('Drag —', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      wcutils.appendStyles(`
      html,body {min-width: ${bodyWidth}px}
      macro-carousel {width: ${bodyWidth}px}`);
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

    const swipe = async function(slider, type='short', direction='right', withPause=false) {
      const distanceTravelled = type === 'short' ?
        bodyWidth * 0.45 : bodyWidth * 0.8;

      const mult = direction === 'right' ? -1 : 1;

      const initialPointerX = direction === 'right' ? 1 : bodyWidth - 1;
      let pointerX = initialPointerX;

      simulant.fire(slider._externalWrapper, 'pointerdown', {
        x: pointerX,
        y: 0,
      });
      await wcutils.delay(0);

      pointerX += (mult * distanceTravelled);

      simulant.fire(window, 'pointermove', {
        x: pointerX,
        y: 0,
      });


      await wcutils.delay(10);

      if (withPause) {
        await wcutils.delay(200);
      }

      simulant.fire(window, 'pointerup', {
        x: pointerX,
        y: 0,
      });

      await wcutils.flush();
    };

    // TODO: find a reliable way to mock PointerEvents.
    // it('swipe gestures change selected slide', async function() {
    //   await wcutils.flush();
    //
    //   await swipe(this.slider, 'short', 'right');
    //
    //   expect(this.slider.selected).to.equal(1);
    // });

    // it('very long swipes trigger a bigger change in the selected slide', async function() {
    //   await wcutils.flush();

    //   await swipe(this.slider, 'long', 'right');
    //   expect(this.slider.selected).to.equal(2);
    // });

    // it('a paused short swipe doesn\'t trigger a change in the selected slide', async function() {
    //   await wcutils.flush();

    //   await swipe(this.slider, 'short', 'right', true);
    //   expect(this.slider.selected).to.equal(0);
    // });

    // it('a paused long swipe triggers a change in the selected slide', async function() {
    //   await wcutils.flush();

    //   await swipe(this.slider, 'long', 'right', true);
    //   expect(this.slider.selected).to.equal(1);
    // });

    // it('swipe gestures when loop is active', async function() {
    //   this.slider.loop = true;

    //   await wcutils.flush();

    //   await swipe(this.slider, 'short', 'left');
    //   expect(this.slider.selected).to.equal(numberOfSlides - 1);
    // });

    // it('nothing happens when drag is disabled', async function() {
    //   this.slider.disableDrag = true;

    //   await wcutils.flush();

    //   await swipe(this.slider, 'short', 'right');
    //   expect(this.slider.selected).to.equal(0);
    // });
  });
})();

/* eslint-enable */
