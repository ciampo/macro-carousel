// Try to set a different value (not booleans) for the pagination prop

// clicking a pagination indicator selectes that view (is it e2e?)

(function() {
  const expect = chai.expect;

  describe('x-slider — navigation buttons', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      this.container.innerHTML = `
      <x-slider>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
        <div>Slide 4</div>
        <div>Slide 5</div>
      </x-slider>`;
      return wcutils.waitForElement('x-slider')
        .then(_ => {
          this.slider = this.container.querySelector('x-slider');
          this.navigationWrapper = this.slider.shadowRoot.querySelector('#navigation');
        });
    });

    describe('navigation disabled', function() {
      it('navigation is false', function() {
        expect(this.slider.navigation).to.be.false;
        expect(this.slider.getAttribute('navigation')).to.be.null;
      });

      it('should not add navigation buttons', function() {
        expect(this.slider.navigationWrapper.childElementCount).to.be.equal(0);
      });

      it('should add 2 navigation buttons if navigation is enabled later on', function(done) {
        setTimeout(function() {
          this.slider.pagination = true;
          expect(this.slider.navigationWrapper.childElementCount).to.be.equal(2);

          const prev = this.slider.navigationWrapper.querySelector('#previous');
          const next = this.slider.navigationWrapper.querySelector('#next');

          expect(prev.disabled).to.be.true;
          expect(prev.disables).to.be.false;

          done();
        }.bind(this), 1000);
      });
    });

    describe('navigation enabled', function() {
      beforeEach(function() {
        this.slider.navigation = true;
      });

      it('navigation is true', function() {
        expect(this.slider.navigation).to.be.true;
        expect(this.slider.getAttribute('navigation')).to.not.be.null;
      });

      it('should have 2 navigation buttons', function() {
        expect(this.slider.navigationWrapper.childElementCount).to.be.equal(2);
      });

      // prev should be disabled when first slide is selected
      // next should be disabled when last slide is selected
      // otherwise both enabled

      // prev and next disabled attrs should update as the light DOM changes

      it('should remove the navigation buttons if navigation is disabled', function() {
        this.slider.navigation = false;
        expect(this.slider.navigationWrapper.childElementCount).to.be.equal(0);
      });
    });
  });
})();
