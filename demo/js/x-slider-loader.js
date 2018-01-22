function getParameterByName(name) {
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

window.addEventListener('WebComponentsReady', function() {
  const script = document.createElement('script');
  script.src = getParameterByName('dev') === 'true' ?
      '../dist/x-slider.js' :
      '../dist/x-slider.min.js';

  document.head.appendChild(script);
});
