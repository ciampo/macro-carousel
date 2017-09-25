// Try to set a different value (not booleans) for the pagination prop

// clicking a pagination indicator selectes that view (is it e2e?)

(function() {
  const expect = chai.expect;

  describe('x-slider — pagination indicators', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      this.container.innerHTML = `
      <x-slider>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
        <div>Slide 4</div>
        <div id="last-slide">Slide 5</div>
      </x-slider>`;
      return wcutils.waitForElement('x-slider')
        .then(_ => {
          this.slider = this.container.querySelector('x-slider');
          this.paginationWrapper = this.slider.shadowRoot.querySelector('#pagination');
        });
    });

    describe('pagination disabled', function() {
      it('pagination is false', function() {
        expect(this.slider.pagination).to.be.false;
        expect(this.slider.getAttribute('pagination')).to.be.null;
      });

      it('should not add pagination indicators', function() {
        expect(this.slider.paginationWrapper.childElementCount).to.be.equal(0);
      });

      it('should add pagination indicators if pagination is enabled later on', function(done) {
        setTimeout(function() {
          this.slider.pagination = true;
          this.slider.selected = 3;
          expect(this.slider.paginationWrapper.childElementCount).to.be.equal(5);

          this.slider.paginationWrapper.querySelectorAll('input[type=radio]')
              .forEach(function(r, i) {
                if (i !== 3) {
                  expect(r.checked).to.be.false;
                } else {
                  expect(r.checked).to.be.true;
                }
              });

          done();
        }.bind(this), 1000);
      });
    });

    describe('pagination enabled', function() {
      beforeEach(function() {
        this.slider.pagination = true;
      });

      it('pagination is true', function() {
        expect(this.slider.pagination).to.be.true;
        expect(this.slider.getAttribute('pagination')).to.not.be.null;
      });

      it('should create as many pagination indicators as the number of slides', function() {
        expect(this.slider.paginationWrapper.childElementCount).to.be.equal(5);
      });

      it('should always mirror the selected slide', function(done) {
        this.slider.paginationWrapper
            .querySelectorAll('input[type=radio]')
            .forEach(function(r, i) {
              if (i !== 0) {
                expect(r.checked).to.be.false;
              } else {
                expect(r.checked).to.be.true;
              }
            });

        setTimeout(function() {
          this.slider.selected = 2;

          this.slider.paginationWrapper
              .querySelectorAll('input[type=radio]')
              .forEach(function(r, i) {
                if (i !== 2) {
                  expect(r.checked).to.be.false;
                } else {
                  expect(r.checked).to.be.true;
                }
              });

          setTimeout(function() {
            this.slider.next();

            this.slider.paginationWrapper
                .querySelectorAll('input[type=radio]')
                .forEach(function(r, i) {
                  if (i !== 3) {
                    expect(r.checked).to.be.false;
                  } else {
                    expect(r.checked).to.be.true;
                  }
                });

            done();
          }.bind(this), 1000);
        }.bind(this), 1000);
      });

      it('should update the pagination indicators when the light DOM changes', function(done) {
        var lastSlide = document.createElement('div');
        this.slider.appendChild(lastSlide);

        expect(this.slider.paginationWrapper.childElementCount).to.be.equal(6);

        setTimeout(function() {
          this.slider.selected = 5;

          this.slider.paginationWrapper
              .querySelectorAll('input[type=radio]')
              .forEach(function(r, i) {
                if (i !== 5) {
                  expect(r.checked).to.be.false;
                } else {
                  expect(r.checked).to.be.true;
                }
              });

          setTimeout(function() {
            lastSlide.parentElement.removeChild(lastSlide);

            expect(this.slider.paginationWrapper.childElementCount).to.be.equal(5);

            this.slider.paginationWrapper
                .querySelectorAll('input[type=radio]')
                .forEach(function(r, i) {
                  if (i !== 4) {
                    expect(r.checked).to.be.false;
                  } else {
                    expect(r.checked).to.be.true;
                  }
                });

            done();
          }.bind(this), 1000);
        }.bind(this), 1000);
      });

      it('should remove the pagination indicators if pagination is disabled', function() {
        this.slider.pagination = false;
        expect(this.slider.paginationWrapper.childElementCount).to.be.equal(0);
      });
    });
  });
})();
