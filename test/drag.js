/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  const numberOfSlides = 4;

  describe('Drag —', function() {
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

    it('swipe gestures change selected slide', async function() {
      let mouseX = 10;

      const distanceTravelled = 300;
      const steps = 5;
      const interval = 100 / steps;
      const increment = distanceTravelled / steps;

      simulant.fire(this.slider._externalWrapper, 'mousedown', {
        clientX: mouseX,
        clientY: 0,
      });

      expect(this.slider.getAttribute('pointer-down')).to.not.be.null;

      for (let i = 0; i < steps; i++) {
        await wcutils.delay(interval);

        mouseX -= increment;
        simulant.fire(window, 'mousemove', {
          clientX: mouseX,
          clientY: 0,
        });
      }

      simulant.fire(window, 'mouseup', {
        clientX: mouseX,
        clientY: 0,
      });

      expect(this.slider.getAttribute('pointer-down')).to.be.null;
      expect(this.slider.selected).to.equal(1);

      await wcutils.delay(1000);

      simulant.fire(this.slider._externalWrapper, 'mousedown', {
        clientX: mouseX,
        clientY: 0,
      });

      expect(this.slider.getAttribute('pointer-down')).to.not.be.null;

      for (let i = 0; i < steps; i++) {
        await wcutils.delay(interval);

        mouseX += increment;
        simulant.fire(window, 'mousemove', {
          clientX: mouseX,
          clientY: 0,
        });
      }

      simulant.fire(window, 'mouseup', {
        clientX: mouseX,
        clientY: 0,
      });

      expect(this.slider.getAttribute('pointer-down')).to.be.null;
      expect(this.slider.selected).to.equal(0);
    });

    it('very long swipes trigger a bigger change in the selected slide', async function() {
      let mouseX = 10;

      const distanceTravelled = 700;
      const steps = 5;
      const interval = 100 / steps;
      const increment = distanceTravelled / steps;

      simulant.fire(this.slider._externalWrapper, 'mousedown', {
        clientX: mouseX,
        clientY: 0,
      });

      expect(this.slider.getAttribute('pointer-down')).to.not.be.null;

      for (let i = 0; i < steps; i++) {
        await wcutils.delay(interval);

        mouseX -= increment;
        simulant.fire(window, 'mousemove', {
          clientX: mouseX,
          clientY: 0,
        });
      }

      simulant.fire(window, 'mouseup', {
        clientX: mouseX,
        clientY: 0,
      });

      expect(this.slider.getAttribute('pointer-down')).to.be.null;
      expect(this.slider.selected).to.equal(2);
    });

    it('a paused short swipe doesn\'t trigger a change in the selected slide', async function() {
      let mouseX = 10;

      const distanceTravelled = 100;
      const steps = 5;
      const interval = 100 / steps;
      const increment = distanceTravelled / steps;

      simulant.fire(this.slider._externalWrapper, 'mousedown', {
        clientX: mouseX,
        clientY: 0,
      });

      expect(this.slider.getAttribute('pointer-down')).to.not.be.null;

      for (let i = 0; i < steps; i++) {
        await wcutils.delay(interval);

        mouseX -= increment;
        simulant.fire(window, 'mousemove', {
          clientX: mouseX,
          clientY: 0,
        });
      }

      // Pause
      await wcutils.delay(200);

      simulant.fire(window, 'mouseup', {
        clientX: mouseX,
        clientY: 0,
      });

      expect(this.slider.getAttribute('pointer-down')).to.be.null;
      expect(this.slider.selected).to.equal(0);
    });

    it('a paused long swip triggers a change in the selected slide', async function() {
      let mouseX = 10;

      const distanceTravelled = 450;
      const steps = 5;
      const interval = 100 / steps;
      const increment = distanceTravelled / steps;

      simulant.fire(this.slider._externalWrapper, 'mousedown', {
        clientX: mouseX,
        clientY: 0,
      });

      expect(this.slider.getAttribute('pointer-down')).to.not.be.null;

      for (let i = 0; i < steps; i++) {
        await wcutils.delay(interval);

        mouseX -= increment;
        simulant.fire(window, 'mousemove', {
          clientX: mouseX,
          clientY: 0,
        });
      }

      // Pause
      await wcutils.delay(200);

      simulant.fire(window, 'mouseup', {
        clientX: mouseX,
        clientY: 0,
      });

      expect(this.slider.getAttribute('pointer-down')).to.be.null;
      expect(this.slider.selected).to.equal(1);
    });

    it('swipe gestures when loop is active', async function() {
      this.slider.loop = true;

      await wcutils.flush();

      let mouseX = 10;

      const distanceTravelled = 300;
      const steps = 5;
      const interval = 100 / steps;
      const increment = distanceTravelled / steps;

      simulant.fire(this.slider._externalWrapper, 'mousedown', {
        clientX: mouseX,
        clientY: 0,
      });

      expect(this.slider.getAttribute('pointer-down')).to.not.be.null;

      for (let i = 0; i < steps; i++) {
        await wcutils.delay(interval);

        mouseX += increment;
        simulant.fire(window, 'mousemove', {
          clientX: mouseX,
          clientY: 0,
        });
      }

      simulant.fire(window, 'mouseup', {
        clientX: mouseX,
        clientY: 0,
      });

      expect(this.slider.getAttribute('pointer-down')).to.be.null;
      expect(this.slider.selected).to.equal(numberOfSlides - 1);

      await wcutils.delay(1000);

      simulant.fire(this.slider._externalWrapper, 'mousedown', {
        clientX: mouseX,
        clientY: 0,
      });

      expect(this.slider.getAttribute('pointer-down')).to.not.be.null;

      for (let i = 0; i < steps; i++) {
        await wcutils.delay(interval);

        mouseX -= increment;
        simulant.fire(window, 'mousemove', {
          clientX: mouseX,
          clientY: 0,
        });
      }

      simulant.fire(window, 'mouseup', {
        clientX: mouseX,
        clientY: 0,
      });

      expect(this.slider.getAttribute('pointer-down')).to.be.null;
      expect(this.slider.selected).to.equal(0);
    });

    it('nothing happens when drag is disabled', async function() {
      this.slider.disableDrag = true;

      await wcutils.flush();

      let mouseX = 10;

      const distanceTravelled = 300;
      const steps = 5;
      const interval = 100 / steps;
      const increment = distanceTravelled / steps;

      simulant.fire(this.slider._externalWrapper, 'mousedown', {
        clientX: mouseX,
        clientY: 0,
      });

      expect(this.slider.getAttribute('pointer-down')).to.be.null;

      for (let i = 0; i < steps; i++) {
        await wcutils.delay(interval);

        mouseX -= increment;
        simulant.fire(window, 'mousemove', {
          clientX: mouseX,
          clientY: 0,
        });
      }

      simulant.fire(window, 'mouseup', {
        clientX: mouseX,
        clientY: 0,
      });

      expect(this.slider.getAttribute('pointer-down')).to.be.null;
      expect(this.slider.selected).to.equal(0);
    });
  });
})();
