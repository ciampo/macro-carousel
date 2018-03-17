/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  const numberOfSlides = 10;

  const getExpectedNumberOfViews = (numberOfSlides, slidesPerView, loop) => (
    // numberOfSlides > slidesPerView + 2 is the condition for the infinite loop
    loop && numberOfSlides > slidesPerView + 2 ?
        numberOfSlides : numberOfSlides - slidesPerView + 1
  );

  const testCombinations = [
    {loop: false, slidesPerView: 1},
    {loop: false, slidesPerView: 3},
    {loop: false, slidesPerView: 6},
    {loop: false, slidesPerView: 9},
    {loop: true, slidesPerView: 1},
    {loop: true, slidesPerView: 3},
    {loop: true, slidesPerView: 6},
    {loop: true, slidesPerView: 9},
  ];

  const getPaginationIndicators = (container) =>
      container.querySelectorAll('macro-carousel-pagination-indicator[slot="paginationSlot"]');

  describe('There should be', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      this.container.innerHTML = `
      <macro-carousel pagination>
        ${[...Array(numberOfSlides).keys()]
            .map(i => `<article>Slide ${i}</article>`)
            .join('\n')}
      </macro-carousel>`;
      return wcutils.waitForElement('macro-carousel')
        .then(() => {
          this.slider = this.container.querySelector('macro-carousel');
        });
    });

    testCombinations.forEach(test => {
      const expected = getExpectedNumberOfViews(numberOfSlides, test.slidesPerView, test.loop);

      it(`${expected} pagination indicators when loop is ${test.loop} and slidesPerView is ${test.slidesPerView}`, async function() {
        this.slider.loop = test.loop;
        this.slider.slidesPerView = test.slidesPerView;
        await window.wcutils.flush();

        const paginationIndicators = getPaginationIndicators(this.container);

        // Check both number of pagination indicators and the lastViewIndex
        expect(paginationIndicators.length).to.equal(expected);
        expect(this.slider._lastViewIndex).to.equal(expected - 1);
      });
    });
  });

  describe('The selected pagination indicator', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      this.container.innerHTML = `
      <macro-carousel pagination>
        ${[...Array(numberOfSlides).keys()]
            .map(i => `<article>Slide ${i}</article>`)
            .join('\n')}
      </macro-carousel>`;
      return wcutils.waitForElement('macro-carousel')
        .then(() => {
          this.slider = this.container.querySelector('macro-carousel');
        });
    });

    testCombinations.forEach(test => {
      it(`correctly reflects the selected slide when loop is ${test.loop} and slidesPerView is ${test.slidesPerView}`, async function() {
        this.slider.loop = test.loop;
        this.slider.slidesPerView = test.slidesPerView;
        await window.wcutils.flush();

        const paginationIndicators = getPaginationIndicators(this.container);

        const validSelectedValues =
            Array(getExpectedNumberOfViews(numberOfSlides, test.slidesPerView, test.loop))
            .fill(0)
            .map((x, y) => y);
        for (let s of validSelectedValues) {
          this.slider.selected = s;
          await window.wcutils.flush();

          paginationIndicators.forEach((indicator, indicatorIndex) => {
            // true is the indicatorIndex is the same at the currently selected slide.
            expect(indicator.classList.contains('selected')).to.equal(indicatorIndex === s);
          });
        }
      });
    });
  });

  describe('Pagination indicators', function() {
    before(wcutils.before());
    after(wcutils.after());

    it('are added and then removed from the light DOM when setting pagination to true and then false', async function() {
      this.container.innerHTML = `
          <macro-carousel pagination>
            ${[...Array(numberOfSlides).keys()]
                .map(i => `<article>Slide ${i}</article>`)
                .join('\n')}
          </macro-carousel>`;
      await wcutils.waitForElement('macro-carousel');

      const slider = this.container.querySelector('macro-carousel');
      let paginationIndicators = getPaginationIndicators(this.container);

      expect(paginationIndicators.length).to.equal(numberOfSlides);
      expect(paginationIndicators[0].constructor.name).to.equal('XSliderPaginationIndicator');

      slider.pagination = false;
      await window.wcutils.flush();

      paginationIndicators = getPaginationIndicators(this.container);

      expect(paginationIndicators.length).to.equal(0);
    });

    it('are added and then removed from the light DOM when setting pagination to false and then true', async function() {
      this.container.innerHTML = `
          <macro-carousel>
            ${[...Array(numberOfSlides).keys()]
                .map(i => `<article>Slide ${i}</article>`)
                .join('\n')}
          </macro-carousel>`;
      await wcutils.waitForElement('macro-carousel');

      const slider = this.container.querySelector('macro-carousel');
      let paginationIndicators = getPaginationIndicators(this.container);

      expect(paginationIndicators.length).to.equal(0);

      slider.pagination = true;
      await window.wcutils.flush();

      paginationIndicators = getPaginationIndicators(this.container);

      expect(paginationIndicators.length).to.equal(numberOfSlides);
      expect(paginationIndicators[0].constructor.name).to.equal('XSliderPaginationIndicator');
    });

    it('are always in sync with the number of slides', async function() {
      this.container.innerHTML = `
          <macro-carousel pagination>
            ${[...Array(numberOfSlides).keys()]
                .map(i => `<article>Slide ${i}</article>`)
                .join('\n')}
          </macro-carousel>`;
      await wcutils.waitForElement('macro-carousel');

      const slider = this.container.querySelector('macro-carousel');
      let paginationIndicators = getPaginationIndicators(this.container);

      expect(paginationIndicators.length).to.equal(numberOfSlides);

      const newSlide = document.createElement('article');
      slider.appendChild(newSlide);
      await window.wcutils.flush();

      paginationIndicators = getPaginationIndicators(this.container);
      expect(paginationIndicators.length).to.equal(numberOfSlides + 1);

      const allSlides = slider.querySelectorAll('article');
      const slidesToRemove = window.wcutils.getRandomInt(2, numberOfSlides);
      for (let i = 0; i < slidesToRemove; i++) {
        slider.removeChild(allSlides[i]);
      }

      await window.wcutils.flush();

      paginationIndicators = getPaginationIndicators(this.container);
      expect(paginationIndicators.length).to.equal(numberOfSlides + 1 - slidesToRemove);
    });

    it('select the corresponding slide when clicked', async function() {
      this.container.innerHTML = `
          <macro-carousel pagination>
            ${[...Array(numberOfSlides).keys()]
                .map(i => `<article>Slide ${i}</article>`)
                .join('\n')}
          </macro-carousel>`;
      await wcutils.waitForElement('macro-carousel');

      const slider = this.container.querySelector('macro-carousel');
      let paginationIndicators = getPaginationIndicators(this.container);

      // Next all the way
      Array.prototype.slice.call(paginationIndicators, 0).forEach((btn, i) => {
        simulant.fire(btn, 'click');
        expect(slider.selected).to.equal(i);
      });
    });

    it('select the corresponding slide when spacebar is pressed', async function() {
      this.container.innerHTML = `
          <macro-carousel pagination>
            ${[...Array(numberOfSlides).keys()]
                .map(i => `<article>Slide ${i}</article>`)
                .join('\n')}
          </macro-carousel>`;
      await wcutils.waitForElement('macro-carousel');

      const slider = this.container.querySelector('macro-carousel');
      let paginationIndicators = getPaginationIndicators(this.container);

      // Next all the way
      Array.prototype.slice.call(paginationIndicators, 0).forEach((btn, i) => {
        simulant.fire(btn, 'keydown', {keyCode: 32});
        expect(slider.selected).to.equal(i);
      });
    });

    it('select the corresponding slide when enter key is pressed', async function() {
      this.container.innerHTML = `
          <macro-carousel pagination>
            ${[...Array(numberOfSlides).keys()]
                .map(i => `<article>Slide ${i}</article>`)
                .join('\n')}
          </macro-carousel>`;
      await wcutils.waitForElement('macro-carousel');

      const slider = this.container.querySelector('macro-carousel');
      let paginationIndicators = getPaginationIndicators(this.container);

      // Next all the way
      Array.prototype.slice.call(paginationIndicators, 0).forEach((btn, i) => {
        simulant.fire(btn, 'keydown', {keyCode: 13});
        expect(slider.selected).to.equal(i);
      });
    });
  });
})();
