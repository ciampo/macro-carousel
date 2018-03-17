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
    '--macro-carousel-gap': '16px',
    '--macro-carousel-background-color': 'transparent',
    '--macro-carousel-slide-min-height': '0px',
    '--macro-carousel-slide-max-height': 'none',
    '--macro-carousel-transition-duration': '0.6s',
    '--macro-carousel-transition-timing-function': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    '--macro-carousel-navigation-color': '#000',
    '--macro-carousel-navigation-color-focus': '#000',
    '--macro-carousel-navigation-color-background': 'transparent',
    '--macro-carousel-navigation-color-background-focus': '#f0f0f0',
    '--macro-carousel-navigation-button-size': '48px',
    '--macro-carousel-navigation-icon-size': '24px',
    '--macro-carousel-navigation-icon-mask': `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'%23000\'%3E %3Cpath d=\'M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z\'/%3E %3C/svg%3E")`,
    '--macro-carousel-pagination-color': '#999',
    '--macro-carousel-pagination-color-selected': '#000',
    '--macro-carousel-pagination-size-clickable': '24px',
    '--macro-carousel-pagination-size-dot': '8px',
    '--macro-carousel-pagination-border': '1px solid  #999',
    '--macro-carousel-pagination-border-selected': '1px solid  #000',
    '--macro-carousel-pagination-gap': '2px',
    '--macro-carousel-pagination-height': '44px',
    '--macro-carousel-fallback-message-color-background': '#fff',
  };

  describe('Default value for', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      this.container.innerHTML = `<macro-carousel></macro-carousel>`;
      return wcutils.waitForElement('macro-carousel')
        .then(() => {
          this.slider = this.container.querySelector('macro-carousel');
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
      this.container.innerHTML = `<macro-carousel></macro-carousel>`;
      return wcutils.waitForElement('macro-carousel')
        .then(() => {
          this.slider = this.container.querySelector('macro-carousel');
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
