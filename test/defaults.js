/* eslint max-len: ["off"] */
(function() {
  const expect = chai.expect;

  const jsProps = {
    slidesPerView: 1,
    selected: 0,
    loop: false,
    pagination: false,
    navigation: false,
    disableDrag: false,
    reducedMotion: false,
    autoFocus: false,
  };

  const jsFunc = ['previous', 'next', 'update'];

  const cssCustomProps = {
    '--x-slider-gap': '16px',
    '--x-slider-background-color': 'transparent',
    '--x-slider-slide-min-height': '0px',
    '--x-slider-slide-max-height': 'none',
    '--x-slider-transition-duration': '0.6s',
    '--x-slider-transition-timing-function': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    '--x-slider-navigation-color': '#000',
    '--x-slider-navigation-color-focus': '#000',
    '--x-slider-navigation-color-background': 'transparent',
    '--x-slider-navigation-color-background-focus': '#f0f0f0',
    '--x-slider-navigation-button-size': '48px',
    '--x-slider-navigation-icon-size': '24px',
    '--x-slider-navigation-icon-mask': `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23000\'%3E %3Cpath d=\'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\'/%3E %3C/svg%3E")`,
    '--x-slider-pagination-color': '#999',
    '--x-slider-pagination-color-selected': '#000',
    '--x-slider-pagination-size-clickable': '24px',
    '--x-slider-pagination-size-dot': '8px',
    '--x-slider-pagination-gap': '2px',
    '--x-slider-pagination-height': '44px',
    '--x-slider-fallback-message-color-background': '#fff',
  };

  describe('Default value for', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      this.container.innerHTML = `<x-slider></x-slider>`;
      return wcutils.waitForElement('x-slider')
        .then(() => {
          this.slider = this.container.querySelector('x-slider');
        });
    });

    /**
     * JS properties
     */
    describe('property', () => {
      for ([propName, propDefaultValue] of Object.entries(jsProps)) {
        let [name, value] = [propName, propDefaultValue];
        it(`${name} should be ${value}`, function() {
          expect(this.slider[name]).to.equal(value);
        });
      }
    });

    /**
     * CSS custom properties
     */
    describe('CSS custom property', () => {
      for ([propName, propDefaultValue] of Object.entries(cssCustomProps)) {
        let [name, value] = [propName, propDefaultValue];
        it(`${name} should be ${value}`, function() {
          expect(wcutils.getCSSCustomProperty(this.slider, name))
              .to.equal(value);
        });
      }
    });
  });

  /**
   * Publis functions
   */
  describe('Public function', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      this.container.innerHTML = `<x-slider></x-slider>`;
      return wcutils.waitForElement('x-slider')
        .then(() => {
          this.slider = this.container.querySelector('x-slider');
        });
    });


    for (functionName of jsFunc) {
      let name = functionName;
      it(`${name} should exist`, function() {
          expect(this.slider[name]).to.be.a('function');
      });
    }
  });
})();
