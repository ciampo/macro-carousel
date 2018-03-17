import XSliderButton from '../macro-carousel-button/macro-carousel-button';
import buttonHtml from './macro-carousel-nav-button.html';
import buttonStyles from './macro-carousel-nav-button.css';

const buttonTmpl = document.createElement('template');
buttonTmpl.innerHTML = `<style>${buttonStyles}</style> ${buttonHtml}`;

if (window.ShadyCSS) {
  window.ShadyCSS.prepareTemplate(buttonTmpl, 'macro-carousel-nav-button');
}

/**
 * A navigation button.
 */
class XSliderNavButton extends XSliderButton {
  static get template() {
    return buttonTmpl;
  }

  /**
   * Fired when the button is clicked / pressed.
   * @event XSlider#macro-carousel-nav-button-clicked
   * @type {Object}
   */

  /**
   * Called when the button is clicked / pressed.
   * @fires XSlider#macro-carousel-nav-button-clicked
   * @private
   */
  _onClick() {
    this.dispatchEvent(new CustomEvent('macro-carousel-nav-button-clicked'));
  }
}

window.customElements.define('macro-carousel-nav-button', XSliderNavButton);
