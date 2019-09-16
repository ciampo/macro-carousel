/* eslint max-len: ["off"] */

(function() {
  const expect = chai.expect;

  const numberOfSlides = 5;

  const disabledTestCombinations = {
    previous: [
      {loop: false, selected: 0, expectDisabled: true},
      {loop: false, selected: 1, expectDisabled: false},
      {loop: false, selected: numberOfSlides - 1, expectDisabled: false},
      {loop: true, selected: 0, expectDisabled: false},
      {loop: true, selected: 1, expectDisabled: false},
      {loop: true, selected: numberOfSlides - 1, expectDisabled: false},
    ],
    next: [
      {loop: false, selected: 0, expectDisabled: false},
      {loop: false, selected: numberOfSlides - 2, expectDisabled: false},
      {loop: false, selected: numberOfSlides - 1, expectDisabled: true},
      {loop: true, selected: 0, expectDisabled: false},
      {loop: true, selected: numberOfSlides - 2, expectDisabled: false},
      {loop: true, selected: numberOfSlides - 1, expectDisabled: false},
    ],
  };

  describe('The', function() {
    before(wcutils.before());
    after(wcutils.after());
    beforeEach(async function() {
      this.container.innerHTML = `
      <macro-carousel navigation>
        ${[...Array(numberOfSlides).keys()]
      .map(i => `<article>Slide ${i}</article>`)
      .join('\n')}
      </macro-carousel>`;
      return wcutils.waitForElement('macro-carousel')
          .then(() => {
            this.slider = this.container.querySelector('macro-carousel');
            this.previousBtn = this.slider.querySelector('.macro-carousel-previous');
            this.nextBtn = this.slider.querySelector('.macro-carousel-next');
          });
    });

    Object.keys(disabledTestCombinations).forEach(testBtn => {
      describe(`${testBtn} navigation button`, function() {
        disabledTestCombinations[testBtn].forEach(test => {
          it(`should${test.expectDisabled ? '' : ' not'} be disabled when loop is ${test.loop} and selected is ${test.selected}`, async function() {
            this.slider.loop = test.loop;
            this.slider.selected = test.selected;
            await window.wcutils.flush();

            expect(this[`${testBtn}Btn`].disabled).to.equal(test.expectDisabled);
          });
        });
      });
    });
  });

  describe('Navigation buttons', function() {
    before(wcutils.before());
    after(wcutils.after());

    it('are added and then removed from the light DOM when setting navigation to true and then false', async function() {
      this.container.innerHTML = `
          <macro-carousel navigation>
            ${[...Array(numberOfSlides).keys()]
      .map(i => `<article>Slide ${i}</article>`)
      .join('\n')}
          </macro-carousel>`;
      await wcutils.waitForElement('macro-carousel');

      const slider = this.container.querySelector('macro-carousel');
      let previousBtn = this.container.querySelector('.macro-carousel-previous');
      let nextBtn = this.container.querySelector('.macro-carousel-next');

      expect(previousBtn.constructor.name).to.equal('MacroCarouselNavButton');
      expect(nextBtn.constructor.name).to.equal('MacroCarouselNavButton');

      slider.navigation = false;
      await window.wcutils.flush();

      previousBtn = this.container.querySelector('.macro-carousel-previous');
      nextBtn = this.container.querySelector('.macro-carousel-next');

      expect(previousBtn).to.be.null;
      expect(nextBtn).to.be.null;
    });

    it('are added and then removed from the light DOM when setting navigation to false and then true', async function() {
      this.container.innerHTML = `
          <macro-carousel>
            ${[...Array(numberOfSlides).keys()]
      .map(i => `<article>Slide ${i}</article>`)
      .join('\n')}
          </macro-carousel>`;
      await wcutils.waitForElement('macro-carousel');

      const slider = this.container.querySelector('macro-carousel');
      let previousBtn = this.container.querySelector('.macro-carousel-previous');
      let nextBtn = this.container.querySelector('.macro-carousel-next');

      expect(previousBtn).to.be.null;
      expect(nextBtn).to.be.null;

      slider.navigation = true;
      await window.wcutils.flush();

      previousBtn = this.container.querySelector('.macro-carousel-previous');
      nextBtn = this.container.querySelector('.macro-carousel-next');

      expect(previousBtn.constructor.name).to.equal('MacroCarouselNavButton');
      expect(nextBtn.constructor.name).to.equal('MacroCarouselNavButton');
    });

    it('selects the previous and next slide when clicked', async function() {
      this.container.innerHTML = `
          <macro-carousel navigation>
            ${[...Array(numberOfSlides).keys()]
      .map(i => `<article>Slide ${i}</article>`)
      .join('\n')}
          </macro-carousel>`;
      await wcutils.waitForElement('macro-carousel');

      const slider = this.container.querySelector('macro-carousel');
      const previousBtn = slider.querySelector('.macro-carousel-previous');
      const nextBtn = slider.querySelector('.macro-carousel-next');

      // Next all the way
      [...Array(numberOfSlides).keys()].forEach(selectedIndex => {
        expect(slider.selected).to.equal(selectedIndex);
        simulant.fire(nextBtn, 'click');
        expect(slider.selected).to.equal(Math.min(selectedIndex + 1, numberOfSlides - 1));
      });

      // Previous all the way
      [...Array(numberOfSlides).keys()].forEach(selectedIndex => {
        expect(slider.selected).to.equal(numberOfSlides - selectedIndex - 1);
        simulant.fire(previousBtn, 'click');
        expect(slider.selected).to.equal(Math.max(0, numberOfSlides - selectedIndex - 2));
      });
    });

    it('selects the previous and next slide when spacebar is pressed', async function() {
      this.container.innerHTML = `
          <macro-carousel navigation>
            ${[...Array(numberOfSlides).keys()]
      .map(i => `<article>Slide ${i}</article>`)
      .join('\n')}
          </macro-carousel>`;
      await wcutils.waitForElement('macro-carousel');

      const slider = this.container.querySelector('macro-carousel');
      const previousBtn = slider.querySelector('.macro-carousel-previous');
      const nextBtn = slider.querySelector('.macro-carousel-next');

      // Next all the way
      [...Array(numberOfSlides).keys()].forEach(selectedIndex => {
        expect(slider.selected).to.equal(selectedIndex);
        simulant.fire(nextBtn, 'keydown', {keyCode: 32});
        expect(slider.selected).to.equal(Math.min(selectedIndex + 1, numberOfSlides - 1));
      });

      // Previous all the way
      [...Array(numberOfSlides).keys()].forEach(selectedIndex => {
        expect(slider.selected).to.equal(numberOfSlides - selectedIndex - 1);
        simulant.fire(previousBtn, 'keydown', {keyCode: 32});
        expect(slider.selected).to.equal(Math.max(0, numberOfSlides - selectedIndex - 2));
      });
    });

    it('selects the previous and next slide when enter key is pressed', async function() {
      this.container.innerHTML = `
          <macro-carousel navigation>
            ${[...Array(numberOfSlides).keys()]
      .map(i => `<article>Slide ${i}</article>`)
      .join('\n')}
          </macro-carousel>`;
      await wcutils.waitForElement('macro-carousel');

      const slider = this.container.querySelector('macro-carousel');
      const previousBtn = slider.querySelector('.macro-carousel-previous');
      const nextBtn = slider.querySelector('.macro-carousel-next');

      // Next all the way
      [...Array(numberOfSlides).keys()].forEach(selectedIndex => {
        expect(slider.selected).to.equal(selectedIndex);
        simulant.fire(nextBtn, 'keydown', {keyCode: 13});
        expect(slider.selected).to.equal(Math.min(selectedIndex + 1, numberOfSlides - 1));
      });

      // Previous all the way
      [...Array(numberOfSlides).keys()].forEach(selectedIndex => {
        expect(slider.selected).to.equal(numberOfSlides - selectedIndex - 1);
        simulant.fire(previousBtn, 'keydown', {keyCode: 13});
        expect(slider.selected).to.equal(Math.max(0, numberOfSlides - selectedIndex - 2));
      });
    });
  });

  describe('The next navigation button', function() {
    before(wcutils.before());
    after(wcutils.after());

    it('is updated when appending slides', async function() {
      this.container.innerHTML = `
          <macro-carousel navigation selected="${numberOfSlides - 1}">
            ${[...Array(numberOfSlides).keys()]
      .map(i => `<article>Slide ${i}</article>`)
      .join('\n')}
          </macro-carousel>`;
      await wcutils.waitForElement('macro-carousel');

      const slider = this.container.querySelector('macro-carousel');
      const nextBtn = slider.querySelector('.macro-carousel-next');

      expect(nextBtn.disabled).to.be.true;

      const newSlide = document.createElement('article');
      slider.appendChild(newSlide);
      await window.wcutils.flush();

      expect(nextBtn.disabled).to.be.false;
    });

    it('is updated when removing slides', async function() {
      this.container.innerHTML = `
          <macro-carousel navigation selected="${numberOfSlides - 2}">
            ${[...Array(numberOfSlides).keys()]
      .map(i => `<article>Slide ${i}</article>`)
      .join('\n')}
          </macro-carousel>`;
      await wcutils.waitForElement('macro-carousel');

      const slider = this.container.querySelector('macro-carousel');
      const nextBtn = slider.querySelector('.macro-carousel-next');

      expect(nextBtn.disabled).to.be.false;

      const oneSlide = slider.querySelector('article');
      slider.removeChild(oneSlide);

      await window.wcutils.flush();

      expect(nextBtn.disabled).to.be.true;
    });
  });
})();
