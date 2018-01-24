const getQueryParamValue = (paramName, url = window.location.href)  => {
  paramName = paramName.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + paramName + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

// See https://github.com/PolymerElements/marked-element/
const unindent = text => {
  if (!text) {
    return text;
  }

  const lines = text.replace(/\t/g, '  ').split('\n');
  const indent = lines.reduce(function(prev, line) {
    // Completely ignore blank lines.
    if (/^\s*$/.test(line)) {
      return prev;
    }
    const lineIndent = line.match(/^(\s*)/)[0].length;
    if (prev === null) {
      return lineIndent;
    }
    return lineIndent < prev ? lineIndent : prev;
  }, null);

  return lines.map(l => l.substr(indent)).join('\n');
};

const demoTemplate = document.querySelector('#demoTemplate');

// Append the first time to initialise the carousel.
document.body.appendChild(demoTemplate.content.cloneNode(true));

// Append a second time to show the highlighted code snippet.
// For some reason, prismjs doesn't automatically get the `x-slider`
// tagName, so to work around the problem I use its APIs imperatively
// and I use innerHTML to get the right text to highlight.
const pre = document.createElement('pre');
pre.classList.add('language-markup');
const code = document.createElement('code');
code.classList.add('language-markup');
// Remove empty attribute values (ie `=""`) for boolean attributes.
code.innerHTML = Prism.highlight(
    unindent(demoTemplate.innerHTML).replace(/=""/g, ''),
    Prism.languages.markup);
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
