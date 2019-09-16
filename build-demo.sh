#!/bin/bash
mkdir -p demo/js/third-party
mkdir -p demo/css/third-party

# Add WC polyfills
cp node_modules/@webcomponents/webcomponentsjs/*.js demo/js/third-party
cp node_modules/@webcomponents/webcomponentsjs/*.map demo/js/third-party
cp node_modules/@webcomponents/shadycss/*.js demo/js/third-party
cp node_modules/@webcomponents/shadycss/*.map demo/js/third-party
rm -rf demo/js/third-party/gulpfile.js

# Add inert polyfill
cp node_modules/wicg-inert/dist/inert.min.js demo/js/third-party

# Add focus-visible polyfill
cp node_modules/focus-visible/dist/focus-visible.js demo/js/third-party

# Add prism.js
cp node_modules/prismjs/prism.js demo/js/third-party
cp node_modules/prismjs/themes/prism.css demo/css/third-party

# Add babel polyfill
cp node_modules/@babel/polyfill/dist/polyfill.min.js demo/js/third-party
