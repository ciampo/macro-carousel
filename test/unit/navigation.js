/* eslint max-len: ["off"] */

// Try to set a different value (not booleans) for the pagination prop

// check that navigation buttons are vertically aligned and at the sides?

// clicking a pagination indicator selectes that view (is it e2e?)

(function() {
  const expect = chai.expect;

  describe('x-slider — navigation buttons', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      this.container.innerHTML = `
      <x-slider selected="2">
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
        <div>Slide 4</div>
        <div>Slide 5</div>
      </x-slider>`;
      return wcutils.waitForElement('x-slider')
        .then(() => {
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
        expect(this.navigationWrapper.childElementCount).to.be.equal(0);
      });
    });

    describe('navigation enabled', function() {
      beforeEach(function() {
        this.slider.navigation = true;

        this.prevButton = this.navigationWrapper.querySelector('#previous');
        this.nextButton = this.navigationWrapper.querySelector('#next');
      });

      it('navigation is true', function() {
        expect(this.slider.navigation).to.be.true;
        expect(this.slider.getAttribute('navigation')).to.not.be.null;
      });

      it('should have 2 navigation buttons', function() {
        expect(this.navigationWrapper.childElementCount).to.be.equal(2);
        expect(this.prevButton).to.exist;
        expect(this.nextButton).to.exist;
      });

      it('should enable prev and next if the selected slide is neither the first nor the last', function() {
        expect(this.prevButton.disabled).to.be.false;
        expect(this.nextButton.disabled).to.be.false;
      });

      it('should disable prev if the first slide is selected', function() {
        this.slider.selected = 0;

        expect(this.prevButton.disabled).to.be.true;
        expect(this.nextButton.disabled).to.be.false;
      });

      it('should disable next if the last slide is selected', function() {
        this.slider.selected = 4;

        expect(this.prevButton.disabled).to.be.false;
        expect(this.nextButton.disabled).to.be.true;
      });

      it('should enable/disable the navigation buttons if the light DOM changes', function(done) {
        const prev = this.prevButton;
        const next = this.nextButton;
        const lastSlide = document.createElement('div');

        this.slider.selected = 4;
        this.slider.appendChild(lastSlide);

        setTimeout(function() {
          expect(prev.disabled).to.be.false;
          expect(next.disabled).to.be.false;

          lastSlide.parentElement.removeChild(lastSlide);

          setTimeout(function() {
            expect(prev.disabled).to.be.false;
            expect(next.disabled).to.be.true;

            done();
          });
        });
      });

      it('should remove the navigation buttons if navigation is disabled', function() {
        this.slider.navigation = false;

        expect(this.navigationWrapper.childElementCount).to.be.equal(0);
      });
    });
  });
})();
