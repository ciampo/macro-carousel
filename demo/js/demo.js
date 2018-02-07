/* eslint-disable no-var */
var getQueryParamValue = function(paramName, url) {
  var url = url || window.location.href;
  var paramName = paramName.replace(/[\[\]]/g, '\\$&');
  var regex = new RegExp('[?&]' + paramName + '(=([^&#]*)|&|#|$)');
  var results = regex.exec(url);
  if (!results) {
    return null;
  }
  if (!results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

// See https://github.com/PolymerElements/marked-element/
var unindent = function(text) {
  if (!text) {
    return text;
  }

  var lines = text.replace(/\t/g, '  ').split('\n');
  var indent = lines.reduce(function(prev, line) {
    // Compvarely ignore blank lines.
    if (/^\s*$/.test(line)) {
      return prev;
    }
    var lineIndent = line.match(/^(\s*)/)[0].length;
    if (prev === null) {
      return lineIndent;
    }
    return lineIndent < prev ? lineIndent : prev;
  }, null);

  return lines.map(function(l) {
    return l.substr(indent);
  }).join('\n');
};


var stampTemplate = function(template) {
  // Append the first time to initialise the carousel.
  document.body.appendChild(template.content.cloneNode(true));

  // Append a second time to show the highlighted code snippet.
  // For some reason, prismjs doesn't automatically get the `x-slider`
  // tagName, so to work around the problem I use its APIs imperatively
  // and I use innerHTML to get the right text to highlight.
  var pre = document.createElement('pre');
  pre.classList.add('language-markup');
  var code = document.createElement('code');
  code.classList.add('language-markup');
  // Remove empty attribute values (ie `=""`) for boolean attributes.
  code.innerHTML = Prism.highlight(
      unindent(template.innerHTML).replace(/=""/g, ''),
      Prism.languages.markup);
  pre.appendChild(code);
  document.body.appendChild(pre);
};

// Download x-slider once the WebCompomnents polyfills have downloaded.
window.addEventListener('WebComponentsReady', function(e) {
  var demoTemplate = document.querySelector('#demoTemplate');
  stampTemplate(demoTemplate);

  var script = document.createElement('script');
  var useEs5 = /es5/.test(window.location.href);
  var useDev = /localhost/.test(window.location.href) ||
      getQueryParamValue('dev') === 'true';
  var filename = 'x-slider';
  if (useEs5) {
    filename += '.es5';
  }
  if (!useDev || useEs5) {
    filename += '.min';
  }
  script.src = '../dist/' + filename + '.js';
  script.defer = true;

  document.head.appendChild(script);
});
