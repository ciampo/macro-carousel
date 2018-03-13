import buttonClassCreator from '../x-slider-button/x-slider-button';
import buttonHtml from './x-slider-nav-button.html';
import buttonStyles from './x-slider-nav-button.css';

const template = document.createElement('template');
template.innerHTML = `<style>${buttonStyles}</style> ${buttonHtml}`;

if (window.ShadyCSS) {
  window.ShadyCSS.prepareTemplate(template, 'x-slider-nav-button');
}

/**
 * A navigation button.
 */
class XSliderNavButton extends buttonClassCreator(template) {
  /**
   * Fired when the button is clicked / pressed.
   * @event XSlider#x-slider-nav-button-clicked
   * @type {Object}
   */

  /**
   * Called when the button is clicked / pressed.
   * @fires XSlider#x-slider-nav-button-clicked
   * @private
   */
  _onClick() {
    this.dispatchEvent(new CustomEvent('x-slider-nav-button-clicked'));
  }
}

window.customElements.define('x-slider-nav-button', XSliderNavButton);
