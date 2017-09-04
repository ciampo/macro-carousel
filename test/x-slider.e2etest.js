const helper = require('../tools/selenium-helper.js');
const expect = require('chai').expect;
// const {Key, By} = require('selenium-webdriver');

describe('x-slider', function() {
  let success;

  const findSlider = `
    window.expectedSlider = document.querySelector('x-slider');
  `;

  const getSelected = `
    return window.expectedSlider.selected;
  `;

  beforeEach(function() {
    return this.driver.get(`${this.address}/demo/index.html`)
      .then(_ => helper.waitForElement(this.driver, 'x-slider'));
  });

  it('should exist', async function() {
    const slider = await this.driver.executeScript(findSlider);

    success = typeof slider !== 'undefined';
    expect(success).to.be.true;
  });

  // TODO replace with actual e2e tests
  it('next() selects the next slide', async function() {
    await this.driver.executeScript(findSlider);

    const s1 = await this.driver.executeScript(getSelected);
    await this.driver.executeScript('window.expectedSlider.next();');
    const s2 = await this.driver.executeScript(getSelected);

    expect(s1).to.equal(s2 - 1);
  });
});
