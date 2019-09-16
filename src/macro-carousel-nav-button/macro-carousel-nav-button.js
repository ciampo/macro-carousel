import MacroCarouselButton
  from '../macro-carousel-button/macro-carousel-button';
import buttonHtml from './macro-carousel-nav-button.html';
import buttonStyles from './macro-carousel-nav-button.css';
import {TAGNAMES, EVENTS} from '../enums';

const buttonTmpl = document.createElement('template');
buttonTmpl.innerHTML = `<style>${buttonStyles}</style> ${buttonHtml}`;

if (window.ShadyCSS) {
  window.ShadyCSS.prepareTemplate(buttonTmpl, TAGNAMES.NAV_BTN);
}

/**
 * A navigation button.
 */
class MacroCarouselNavButton extends MacroCarouselButton {
  static get template() {
    return buttonTmpl;
  }

  /**
   * Fired when the button is clicked / pressed.
   * @event MacroCarouselNavButton#macro-carousel-nav-button-clicked
   * @type {Object}
   */

  /**
   * Called when the button is clicked / pressed.
   * @fires MacroCarouselNavButton#macro-carousel-nav-button-clicked
   * @private
   */
  _onClick() {
    this.dispatchEvent(new CustomEvent(EVENTS.NAV_BTN.CLICKED));
  }
}

window.customElements.define(TAGNAMES.NAV_BTN, MacroCarouselNavButton);
