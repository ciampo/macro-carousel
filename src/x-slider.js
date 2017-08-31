const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host {
      display: block;
      contain: content;
    }

    #slides {
      background-color: #ccc;
    }

    ::slotted(*) {
      outline: 1px solid red;
    }
  </style>

  <div id="slides">
    <slot><p>No content available</p></slot>
  </div>
`;

class XSlider extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: 'open'});
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {

  }

  disconnectedCallback() {

  }

  attributeChangedCallback(attrName, oldVal, newVal) {

  }
}

window.customElements.define('x-slider', XSlider);
