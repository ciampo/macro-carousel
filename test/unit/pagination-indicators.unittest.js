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

        const paginationIndicators = this.container.querySelectorAll('button[slot="paginationSlot"]');

        // Check both number of pagination indicators and the lastViewIndex
        expect(paginationIndicators.length).to.equal(expected);
        expect(this.slider._lastViewIndex).to.equal(expected - 1);
      });
    });
  });
})();
