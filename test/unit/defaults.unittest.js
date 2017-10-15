/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  describe('x-slider — default values', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      this.container.innerHTML = `<x-slider></x-slider>`;
      return wcutils.waitForElement('x-slider')
        .then(_ => {
          this.slider = this.container.querySelector('x-slider');
        });
    });

    /**
     * JS properties / attrs
     */
    it('slides-per-view default value is 1', function() {
      expect(this.slider.slidesPerView).to.equal(1);
    });

    it('selected default value is 0', function() {
      expect(this.slider.selected).to.equal(0);
    });

    it('loop default value is false', function() {
      expect(this.slider.loop).to.be.false;
    });

    it('pagination default value is false', function() {
      expect(this.slider.pagination).to.be.false;
    });

    it('navigation default value is false', function() {
      expect(this.slider.navigation).to.be.false;
    });

    /**
     * JS methods
     */
    it('has a next() method', function() {
      expect(this.slider.next).to.be.defined;
    });

    it('has a previous() method', function() {
      expect(this.slider.previous).to.be.defined;
    });

    it('has an update() method', function() {
      expect(this.slider.update).to.be.defined;
    });

    /**
     * CSS properties
     */
    it('--x-slider-gap default value is 16px', function() {
      const gap = wcutils.getCSSCustomProperty(this.slider, '--x-slider-gap');
      expect(gap).to.be.equal('16px');
    });

    it('--x-slider-transition-duration default value is 0.5s', function() {
      const duration = wcutils.getCSSCustomProperty(this.slider, '--x-slider-transition-duration');
      expect(duration).to.be.equal('0.5s');
    });

    it('--x-slider-transition-timing-function default value is ease-in-out', function() {
      const timingFunction = wcutils.getCSSCustomProperty(this.slider, '--x-slider-transition-timing-function');
      expect(timingFunction).to.be.equal('ease-in-out');
    });

    it('--x-slider-pagination-color default value is #999', function() {
      const color = wcutils.getCSSCustomProperty(this.slider, '--x-slider-pagination-color');
      expect(color).to.be.equal('#999');
    });

    it('--x-slider-pagination-color-selected default value is #000', function() {
      const color = wcutils.getCSSCustomProperty(this.slider, '--x-slider-pagination-color-selected');
      expect(color).to.be.equal('#000');
    });

    it('--x-slider-pagination-size default value is 12px', function() {
      const color = wcutils.getCSSCustomProperty(this.slider, '--x-slider-pagination-size');
      expect(color).to.be.equal('12px');
    });

    it('--x-slider-pagination-gap default value is 8px', function() {
      const color = wcutils.getCSSCustomProperty(this.slider, '--x-slider-pagination-gap');
      expect(color).to.be.equal('8px');
    });

    it('--x-slider-pagination-height default value is 32px', function() {
      const color = wcutils.getCSSCustomProperty(this.slider, '--x-slider-pagination-height');
      expect(color).to.be.equal('32px');
    });

    it('--x-slider-navigation-color default value is #000', function() {
      const color = wcutils.getCSSCustomProperty(this.slider, '--x-slider-navigation-color');
      expect(color).to.be.equal('#000');
    });
  });
})();