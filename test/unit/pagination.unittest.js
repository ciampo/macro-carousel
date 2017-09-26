// Try to set a different value (not booleans) for the pagination prop

// clicking a pagination indicator selectes that view (is it e2e?)

(function() {
  const expect = chai.expect;

  describe('x-slider — pagination indicators', () => {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async () => {
      this.container.innerHTML = `
      <x-slider>
        <div>Slide 1</div>
        <div>Slide 2</div>
        <div>Slide 3</div>
        <div>Slide 4</div>
        <div>Slide 5</div>
      </x-slider>`;
      return wcutils.waitForElement('x-slider')
        .then(() => {
          this.slider = this.container.querySelector('x-slider');
          this.paginationWrapper = this.slider.shadowRoot.querySelector('#pagination');
        });
    });

    describe('pagination disabled', () => {
      it('pagination is false', () => {
        expect(this.slider.pagination).to.be.false;
        expect(this.slider.getAttribute('pagination')).to.be.null;
      });

      it('should not add pagination indicators', () => {
        expect(this.slider.paginationWrapper.childElementCount).to.be.equal(0);
      });
    });

    describe('pagination enabled', () => {
      beforeEach(() => {
        this.slider.pagination = true;
      });

      it('pagination is true', () => {
        expect(this.slider.pagination).to.be.true;
        expect(this.slider.getAttribute('pagination')).to.not.be.null;
      });

      it('should create as many pagination indicators as the number of slides', () => {
        expect(this.slider.paginationWrapper.childElementCount).to.be.equal(5);
      });

      it('should always mirror the selected slide', done => {
        this.slider.paginationWrapper
            .querySelectorAll('input[type=radio]')
            .forEach((r, i)  => {
              if (i !== 0) {
                expect(r.checked).to.be.false;
              } else {
                expect(r.checked).to.be.true;
              }
            });

        setTimeout(() => {
          const newSelected = 2;
          this.slider.selected = newSelected;

          this.slider.paginationWrapper
              .querySelectorAll('input[type=radio]')
              .forEach((r, i) => {
                if (i !== 2) {
                  expect(r.checked).to.be.false;
                } else {
                  expect(r.checked).to.be.true;
                }
              });

          setTimeout(() => {
            this.slider.next();

            this.slider.paginationWrapper
                .querySelectorAll('input[type=radio]')
                .forEach((r, i) => {
                  if (i !== newSelected + 1) {
                    expect(r.checked).to.be.false;
                  } else {
                    expect(r.checked).to.be.true;
                  }
                });

            done();
          }, 1000);
        }, 1000);
      });

      it('should update the pagination indicators when the light DOM changes', done => {
        const lastSlide = document.createElement('div');
        this.slider.appendChild(lastSlide);

        expect(this.slider.paginationWrapper.childElementCount).to.be.equal(6);

        setTimeout(() => {
          const newSelected = 5;
          this.slider.selected = newSelected;

          this.slider.paginationWrapper
              .querySelectorAll('input[type=radio]')
              .forEach((r, i) => {
                if (i !== newSelected) {
                  expect(r.checked).to.be.false;
                } else {
                  expect(r.checked).to.be.true;
                }
              });

          setTimeout(() => {
            lastSlide.parentElement.removeChild(lastSlide);

            expect(this.slider.paginationWrapper.childElementCount).to.be.equal(5);

            this.slider.paginationWrapper
                .querySelectorAll('input[type=radio]')
                .forEach((r, i) => {
                  if (i !== newSelected - 1) {
                    expect(r.checked).to.be.false;
                  } else {
                    expect(r.checked).to.be.true;
                  }
                });

            done();
          }, 1000);
        }, 1000);
      });

      it('should remove the pagination indicators if pagination is disabled', () => {
        this.slider.pagination = false;
        expect(this.slider.paginationWrapper.childElementCount).to.be.equal(0);
      });
    });
  });
})();
