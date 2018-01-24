function getQueryParamValue(name) {
  const url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

const template = document.querySelector('#demoTemplate');

// Append the first time to initialise the carousel.
document.body.appendChild(template.content.cloneNode(true));

// Append a second time to show the highlighted code snippet.
// For some reason, prismjs doesn't automatically get the `x-slider`
// tagName, so to work around the problem I use its APIs imperatively
// and I use innerHTML to get the right text to highlight.
const div = document.createElement('div');
div.appendChild(template.content.cloneNode(true));
const pre = document.createElement('pre');
pre.classList.add('language-markup');
const code = document.createElement('code');
code.classList.add('language-markup');
code.innerHTML = Prism.highlight(div.innerHTML, Prism.languages.markup);
pre.appendChild(code);
document.body.appendChild(pre);

// Download x-slider once the WebCompomnents polyfills have downloaded.
window.addEventListener('WebComponentsReady', function() {
  const script = document.createElement('script');
  script.src = getQueryParamValue('dev') === 'true' ?
      '../dist/x-slider.js' :
      '../dist/x-slider.min.js';

  document.head.appendChild(script);
});
