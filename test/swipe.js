/* eslint max-len: ["off"] */
/* eslint no-console: ["off"] */

(function() {
  const expect = chai.expect;

  const numberOfSlides = 4;

  describe('Drag —', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      // wcutils.appendStyles(`x-slider {width: 800px}`);
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

    const swipe = async function(slider, type, direction) {
      const distanceTravelled = type === 'short' ? 300 : 700;

      const mult = direction === 'right' ? -1 : 1;

      const initialMouseX = direction === 'right' ? 0 : 800;
      let mouseX = initialMouseX;

      simulant.fire(slider._externalWrapper, 'mousedown', {
        clientX: mouseX,
        clientY: 0,
      });
      await wcutils.delay(0);

      expect(slider.getAttribute('pointer-down')).to.not.be.null;

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

      await swipe(this.slider, 'short', 'left');
      expect(this.slider.selected).to.equal(0);
    });

    it('very long swipes trigger a bigger change in the selected slide', async function() {
      await wcutils.flush();

      await swipe(this.slider, 'long', 'right');
      expect(this.slider.selected).to.equal(2);
    });

    // it('a paused short swipe doesn\'t trigger a change in the selected slide', async function() {
    //   this.timeout(5000);

    //   const carouselWidth = this.slider.getBoundingClientRect().width;

    //   let mouseX = 10;

    //   const distanceTravelled = carouselWidth * 0.1;
    //   const steps = 5;
    //   const interval = 30 / steps;
    //   const increment = distanceTravelled / steps;

    //   simulant.fire(this.slider._externalWrapper, 'mousedown', {
    //     clientX: mouseX,
    //     clientY: 0,
    //   });

    //   await wcutils.flush();

    //   expect(this.slider.getAttribute('pointer-down')).to.not.be.null;

    //   for (let i = 0; i < steps; i++) {
    //     await wcutils.delay(interval);

    //     mouseX -= increment;
    //     simulant.fire(window, 'mousemove', {
    //       clientX: mouseX,
    //       clientY: 0,
    //     });
    //   }

    //   // Pause
    //   await wcutils.delay(200);

    //   simulant.fire(window, 'mouseup', {
    //     clientX: mouseX,
    //     clientY: 0,
    //   });

    //   await wcutils.flush();

    //   expect(this.slider.getAttribute('pointer-down')).to.be.null;
    //   expect(this.slider.selected).to.equal(0);
    // });

    // it('a paused long swipe triggers a change in the selected slide', async function() {
    //   const carouselWidth = this.slider.getBoundingClientRect().width;

    //   let mouseX = 10;

    //   const distanceTravelled = carouselWidth * 0.8;
    //   const steps = 5;
    //   const interval = 30 / steps;
    //   const increment = distanceTravelled / steps;

    //   simulant.fire(this.slider._externalWrapper, 'mousedown', {
    //     clientX: mouseX,
    //     clientY: 0,
    //   });

    //   await wcutils.flush();

    //   expect(this.slider.getAttribute('pointer-down')).to.not.be.null;

    //   for (let i = 0; i < steps; i++) {
    //     await wcutils.delay(interval);

    //     mouseX -= increment;
    //     simulant.fire(window, 'mousemove', {
    //       clientX: mouseX,
    //       clientY: 0,
    //     });
    //   }

    //   // Pause
    //   await wcutils.delay(200);

    //   simulant.fire(window, 'mouseup', {
    //     clientX: mouseX,
    //     clientY: 0,
    //   });

    //   await wcutils.flush();

    //   expect(this.slider.getAttribute('pointer-down')).to.be.null;
    //   expect(this.slider.selected).to.equal(1);
    // });

    // it('swipe gestures when loop is active', async function() {
    //   this.slider.loop = true;

    //   await wcutils.flush();

    //   const carouselWidth = this.slider.getBoundingClientRect().width;

    //   let mouseX = 10;

    //   const distanceTravelled = carouselWidth * 0.4;
    //   const steps = 5;
    //   const interval = 30 / steps;
    //   const increment = distanceTravelled / steps;

    //   simulant.fire(this.slider._externalWrapper, 'mousedown', {
    //     clientX: mouseX,
    //     clientY: 0,
    //   });

    //   expect(this.slider.getAttribute('pointer-down')).to.not.be.null;

    //   for (let i = 0; i < steps; i++) {
    //     await wcutils.delay(interval);

    //     mouseX += increment;
    //     simulant.fire(window, 'mousemove', {
    //       clientX: mouseX,
    //       clientY: 0,
    //     });
    //   }

    //   simulant.fire(window, 'mouseup', {
    //     clientX: mouseX,
    //     clientY: 0,
    //   });

    //   await wcutils.flush();

    //   expect(this.slider.getAttribute('pointer-down')).to.be.null;
    //   expect(this.slider.selected).to.equal(numberOfSlides - 1);

    //   await wcutils.delay(1000);

    //   simulant.fire(this.slider._externalWrapper, 'mousedown', {
    //     clientX: mouseX,
    //     clientY: 0,
    //   });

    //   await wcutils.flush();

    //   expect(this.slider.getAttribute('pointer-down')).to.not.be.null;

    //   for (let i = 0; i < steps; i++) {
    //     await wcutils.delay(interval);

    //     mouseX -= increment;
    //     simulant.fire(window, 'mousemove', {
    //       clientX: mouseX,
    //       clientY: 0,
    //     });
    //   }

    //   simulant.fire(window, 'mouseup', {
    //     clientX: mouseX,
    //     clientY: 0,
    //   });

    //   await wcutils.flush();

    //   expect(this.slider.getAttribute('pointer-down')).to.be.null;
    //   expect(this.slider.selected).to.equal(0);
    // });

    // it('nothing happens when drag is disabled', async function() {
    //   this.slider.disableDrag = true;

    //   await wcutils.flush();

    //   const carouselWidth = this.slider.getBoundingClientRect().width;

    //   let mouseX = 10;

    //   const distanceTravelled = carouselWidth * 0.4;
    //   const steps = 5;
    //   const interval = 30 / steps;
    //   const increment = distanceTravelled / steps;

    //   simulant.fire(this.slider._externalWrapper, 'mousedown', {
    //     clientX: mouseX,
    //     clientY: 0,
    //   });

    //   await wcutils.flush();

    //   expect(this.slider.getAttribute('pointer-down')).to.be.null;

    //   for (let i = 0; i < steps; i++) {
    //     await wcutils.delay(interval);

    //     mouseX -= increment;
    //     simulant.fire(window, 'mousemove', {
    //       clientX: mouseX,
    //       clientY: 0,
    //     });
    //   }

    //   simulant.fire(window, 'mouseup', {
    //     clientX: mouseX,
    //     clientY: 0,
    //   });

    //   await wcutils.flush();

    //   expect(this.slider.getAttribute('pointer-down')).to.be.null;
    //   expect(this.slider.selected).to.equal(0);
    // });
  });
})();
