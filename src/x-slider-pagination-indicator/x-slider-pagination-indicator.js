import XSliderButton from '../x-slider-button/x-slider-button';
import indicatorHtml from './x-slider-pagination-indicator.html';
import indicatorStyles from './x-slider-pagination-indicator.css';

const paginationTmpl = document.createElement('template');
paginationTmpl.innerHTML = `<style>${indicatorStyles}</style> ${indicatorHtml}`;

if (window.ShadyCSS) {
  window.ShadyCSS.prepareTemplate(paginationTmpl,
      'x-slider-pagination-indicator');
}

/**
 * A pagination indicator button.
 */
class XSliderPaginationIndicator extends XSliderButton {
  static get template() {
    return paginationTmpl;
  }

  /**
   * Fired when the button is clicked / pressed.
   * @event XSlider#x-slider-pagination-indicator-clicked
   * @type {Object}
   */

  /**
   * Called when the button is clicked / pressed.
   * @fires XSlider#x-slider-pagination-indicator-clicked
   * @private
   */
  _onClick() {
    this.dispatchEvent(
        new CustomEvent('x-slider-pagination-indicator-clicked'));
  }
}

window.customElements.define('x-slider-pagination-indicator',
    XSliderPaginationIndicator);
