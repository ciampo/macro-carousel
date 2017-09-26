/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  describe('x-slider — default values', () => {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async () => {
      this.container.innerHTML = `<x-slider></x-slider>`;
      return wcutils.waitForElement('x-slider')
        .then(() => {
          this.slider = this.container.querySelector('x-slider');
        });
    });

    /**
     * JS properties / attrs
     */
    it('slides-per-view default value is 1', () => {
      expect(this.slider.slidesPerView).to.equal(1);
    });

    it('selected default value is 0', () => {
      expect(this.slider.selected).to.equal(0);
    });

    it('loop default value is false', () => {
      expect(this.slider.loop).to.be.false;
    });

    it('pagination default value is false', () => {
      expect(this.slider.pagination).to.be.false;
    });

    it('navigation default value is false', () => {
      expect(this.slider.navigation).to.be.false;
    });

    /**
     * JS methods
     */
    it('has a next() method', () => {
      expect(this.slider.next).to.be.defined;
    });

    it('has a previous() method', () => {
      expect(this.slider.previous).to.be.defined;
    });

    it('has an update() method', () => {
      expect(this.slider.update).to.be.defined;
    });

    /**
     * CSS properties
     */
    it('--x-slider-gap default value is 16px', () => {
      const gap = wcutils.getCSSCustomProperty(this.slider, '--x-slider-gap');
      expect(gap).to.be.equal('16px');
    });

    it('--x-slider-transition-duration default value is 0.5s', () => {
      const duration = wcutils.getCSSCustomProperty(this.slider, '--x-slider-transition-duration');
      expect(duration).to.be.equal('0.5s');
    });

    it('--x-slider-transition-timing-function default value is ease-in-out', () => {
      const timingFunction = wcutils.getCSSCustomProperty(this.slider, '--x-slider-transition-timing-function');
      expect(timingFunction).to.be.equal('ease-in-out');
    });

    it('--x-slider-pagination-color default value is #999', () => {
      const color = wcutils.getCSSCustomProperty(this.slider, '--x-slider-pagination-color');
      expect(color).to.be.equal('#999');
    });

    it('--x-slider-pagination-color-selected default value is #000', () => {
      const color = wcutils.getCSSCustomProperty(this.slider, '--x-slider-pagination-color-selected');
      expect(color).to.be.equal('#000');
    });

    it('--x-slider-navigation-color default value is #000', () => {
      const color = wcutils.getCSSCustomProperty(this.slider, '--x-slider-navigation-color');
      expect(color).to.be.equal('#000');
    });
  });
})();
