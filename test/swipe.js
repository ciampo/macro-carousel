/* eslint max-len: ["off"] */
/* eslint no-console: ["off"] */

(function() {
  const expect = chai.expect;

  const numberOfSlides = 4;

  describe('Drag —', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      wcutils.appendStyles(`x-slider {width: 800px}`);
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

    const swipe = async function(slider, type, direction, withPause) {
      const distanceTravelled = type === 'short' ? 100 : 740;

      const mult = direction === 'right' ? -1 : 1;

      const initialMouseX = 400;
      let mouseX = initialMouseX;

      simulant.fire(slider._externalWrapper, 'mousedown', {
        clientX: mouseX,
        clientY: 0,
      });
      await wcutils.delay(0);

      if (slider.disableDrag) {
        expect(slider.getAttribute('pointer-down')).to.be.null;
      } else {
        expect(slider.getAttribute('pointer-down')).to.not.be.null;
      }

      mouseX = mouseX + (mult * distanceTravelled);

      simulant.fire(window, 'mousemove', {
        clientX: mouseX,
        clientY: 0,
      });
      await wcutils.delay(10);

      simulant.fire(window, 'mousemove', {
        clientX: mouseX,
        clientY: 0,
      });
      await wcutils.delay(10);

      if (withPause) {
        await wcutils.delay(200);
      }

      simulant.fire(window, 'mouseup', {
        clientX: mouseX,
        clientY: 0,
      });

      await wcutils.delay(0);

      expect(slider.getAttribute('pointer-down')).to.be.null;
    };

    it('swipe gestures change selected slide', async function() {
      await wcutils.flush();

      await swipe(this.slider, 'short', 'right');
      expect(this.slider.selected).to.equal(1);

      await wcutils.flush();

      await swipe(this.slider, 'short', 'left');
      expect(this.slider.selected).to.equal(0);
    });

    it('very long swipes trigger a bigger change in the selected slide', async function() {
      await wcutils.flush();

      await swipe(this.slider, 'long', 'right');
      expect(this.slider.selected).to.equal(2);
    });

    it('a paused short swipe doesn\'t trigger a change in the selected slide', async function() {
      this.timeout(5000);

      await wcutils.flush();

      await swipe(this.slider, 'short', 'right', true);
      expect(this.slider.selected).to.equal(0);
    });

    it('a paused long swipe triggers a change in the selected slide', async function() {
      this.timeout(5000);

      await wcutils.flush();

      await swipe(this.slider, 'long', 'right', true);
      expect(this.slider.selected).to.equal(1);
    });

    it('swipe gestures when loop is active', async function() {
      this.timeout(5000);
      this.slider.loop = true;

      await wcutils.flush();

      await swipe(this.slider, 'short', 'left');
      expect(this.slider.selected).to.equal(numberOfSlides - 1);

      await wcutils.flush();

      await swipe(this.slider, 'short', 'right');
      expect(this.slider.selected).to.equal(0);
    });

    it('nothing happens when drag is disabled', async function() {
      this.timeout(5000);
      this.slider.disableDrag = true;

      await wcutils.flush();

      await swipe(this.slider, 'short', 'right');
      expect(this.slider.selected).to.equal(0);
    });
  });
})();
