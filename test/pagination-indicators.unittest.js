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
      container.querySelectorAll('button[slot="paginationSlot"]');

  describe('There should be', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      this.container.innerHTML = `
      <x-slider pagination>
        ${[...Array(numberOfSlides).keys()]
            .map(i => `<article>Slide ${i}</article>`)
            .join('\n')}
      </x-slider>`;
      return wcutils.waitForElement('x-slider')
        .then(() => {
          this.slider = this.container.querySelector('x-slider');
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
      <x-slider pagination>
        ${[...Array(numberOfSlides).keys()]
            .map(i => `<article>Slide ${i}</article>`)
            .join('\n')}
      </x-slider>`;
      return wcutils.waitForElement('x-slider')
        .then(() => {
          this.slider = this.container.querySelector('x-slider');
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
            expect(indicator.classList.contains('disabled')).to.equal(indicatorIndex === s);
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
          <x-slider pagination>
            ${[...Array(numberOfSlides).keys()]
                .map(i => `<article>Slide ${i}</article>`)
                .join('\n')}
          </x-slider>`;
      await wcutils.waitForElement('x-slider');

      const slider = this.container.querySelector('x-slider');
      let paginationIndicators = getPaginationIndicators(this.container);

      expect(paginationIndicators.length).to.equal(numberOfSlides);
      expect(paginationIndicators[0].constructor.name).to.equal('HTMLButtonElement');

      slider.pagination = false;
      await window.wcutils.flush();

      paginationIndicators = getPaginationIndicators(this.container);

      expect(paginationIndicators.length).to.equal(0);
    });

    it('are added and then removed from the light DOM when setting pagination to false and then true', async function() {
      this.container.innerHTML = `
          <x-slider>
            ${[...Array(numberOfSlides).keys()]
                .map(i => `<article>Slide ${i}</article>`)
                .join('\n')}
          </x-slider>`;
      await wcutils.waitForElement('x-slider');

      const slider = this.container.querySelector('x-slider');
      let paginationIndicators = getPaginationIndicators(this.container);

      expect(paginationIndicators.length).to.equal(0);

      slider.pagination = true;
      await window.wcutils.flush();

      paginationIndicators = getPaginationIndicators(this.container);

      expect(paginationIndicators.length).to.equal(numberOfSlides);
      expect(paginationIndicators[0].constructor.name).to.equal('HTMLButtonElement');
    });
  });
})();