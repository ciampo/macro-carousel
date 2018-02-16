/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  describe('Defaults', function() {
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
    it('slides-per-view default value', function() {
      expect(this.slider.slidesPerView).to.equal(1);
    });

    it('selected default value', function() {
      expect(this.slider.selected).to.equal(0);
    });

    it('loop default value', function() {
      expect(this.slider.loop).to.be.false;
    });

    it('pagination default value', function() {
      expect(this.slider.pagination).to.be.false;
    });

    it('navigation default value', function() {
      expect(this.slider.navigation).to.be.false;
    });

    it('disable-drag default value', function() {
      expect(this.slider.disableDrag).to.be.false;
    });

    it('reduced-motion default value', function() {
      expect(this.slider.reducedMotion).to.be.false;
    });

    it('auto-focus default value', function() {
      expect(this.slider.autoFocus).to.be.false;
    });

    /**
     * JS methods
     */
    it('has a previous() method', function() {
      expect(this.slider.previous).to.be.a('function');
    });

    it('has a next() method', function() {
      expect(this.slider.next).to.be.a('function');
    });

    it('has an update() method', function() {
      expect(this.slider.update).to.be.a('function');
    });

    /**
     * CSS properties
     */
    it('--x-slider-gap default value', function() {
      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-gap'))
          .to.be.equal('16px');
    });

    it('--x-slider-background-color default value', function() {
      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-background-color'))
          .to.be.equal('transparent');
    });

    it('--x-slider-slide-min-height default value', function() {
      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-slide-min-height'))
          .to.be.equal('0px');
    });

    it('--x-slider-slide-max-height default value', function() {
      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-slide-max-height'))
          .to.be.equal('none');
    });

    it('--x-slider-transition-duration default value', function() {
      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-transition-duration'))
          .to.be.equal('0.6s');
    });

    it('--x-slider-transition-timing-function default value', function() {
      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-transition-timing-function'))
          .to.be.equal('cubic-bezier(0.25,0.46,0.45,0.94)');
    });

    it('--x-slider-navigation-color default value', function() {
      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-navigation-color'))
          .to.be.equal('#000');
    });

    it('--x-slider-navigation-color-focus default value', function() {
      const navigationColorFocusVar = wcutils
          .getCSSCustomProperty(this.slider, '--x-slider-navigation-color');

      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-navigation-color-focus'))
          .to.be.equal(navigationColorFocusVar);
    });

    it('--x-slider-navigation-color-background default value', function() {
      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-navigation-color-background'))
          .to.be.equal('transparent');
    });

    it('--x-slider-navigation-color-background-focus default value', function() {
      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-navigation-color-background-focus'))
          .to.be.equal('#f0f0f0');
    });

    it('--x-slider-navigation-button-size default value', function() {
      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-navigation-button-size'))
          .to.be.equal('48px');
    });

    it('--x-slider-navigation-icon-size default value', function() {
      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-navigation-icon-size'))
          .to.be.equal('24px');
    });

    it('--x-slider-navigation-icon-mask default value', function() {
      const mask = `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z'/%3E%3C/svg%3E")`;

      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-navigation-icon-mask'))
          .to.be.equal(mask);
    });

    it('--x-slider-pagination-color default value', function() {
      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-pagination-color'))
          .to.be.equal('#999');
    });

    it('--x-slider-pagination-color-selected default value', function() {
      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-pagination-color-selected'))
          .to.be.equal('#000');
    });

    it('--x-slider-pagination-size-clickable default value', function() {
      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-pagination-size-clickable'))
          .to.be.equal('24px');
    });

    it('--x-slider-pagination-size-dot default value', function() {
      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-pagination-size-dot'))
          .to.be.equal('8px');
    });

    it('--x-slider-pagination-gap default value', function() {
      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-pagination-gap'))
          .to.be.equal('2px');
    });

    it('--x-slider-pagination-height default value', function() {
      expect(wcutils.getCSSCustomProperty(this.slider, '--x-slider-pagination-height'))
          .to.be.equal('44px');
    });
  });
})();
