import MacroCarouselButton from '../macro-carousel-button/macro-carousel-button';
import indicatorHtml from './macro-carousel-pagination-indicator.html';
import indicatorStyles from './macro-carousel-pagination-indicator.css';

const paginationTmpl = document.createElement('template');
paginationTmpl.innerHTML = `<style>${indicatorStyles}</style> ${indicatorHtml}`;

if (window.ShadyCSS) {
  window.ShadyCSS.prepareTemplate(paginationTmpl,
      'macro-carousel-pagination-indicator');
}

/**
 * A pagination indicator button.
 */
class MacroCarouselPaginationIndicator extends MacroCarouselButton {
  static get template() {
    return paginationTmpl;
  }

  /**
   * Fired when the button is clicked / pressed.
   * @event MacroCarouselPaginationIndicator#macro-carousel-pagination-indicator-clicked
   * @type {Object}
   */

  /**
   * Called when the button is clicked / pressed.
   * @fires MacroCarouselPaginationIndicator#macro-carousel-pagination-indicator-clicked
   * @private
   */
  _onClick() {
    this.dispatchEvent(
        new CustomEvent('macro-carousel-pagination-indicator-clicked'));
  }
}

window.customElements.define('macro-carousel-pagination-indicator',
    MacroCarouselPaginationIndicator);
