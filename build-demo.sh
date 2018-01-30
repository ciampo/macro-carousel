#!/bin/bash
mkdir -p demo/js/third-party
mkdir -p demo/css/third-party

# Add WC polyfill loader
cp node_modules/@webcomponents/webcomponentsjs/*.js demo/js/third-party
cp node_modules/@webcomponents/webcomponentsjs/*.map demo/js/third-party
rm -rf demo/js/third-party/gulpfile.js

# Add inert polyfill
cp node_modules/wicg-inert/dist/inert.min.js demo/js/third-party

# Add focus-visible polyfill
cp node_modules/focus-visible/dist/focus-visible.js demo/js/third-party

# Add prism.js
cp node_modules/prismjs/prism.js demo/js/third-party
cp node_modules/prismjs/themes/prism.css demo/css/third-party
