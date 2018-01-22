#!/bin/bash
mkdir -p demo/js/third-party

# Add WC polyfill loader
cp node_modules/@webcomponents/webcomponentsjs/*.js demo/js/third-party

# Add inert polyfill
cp node_modules/wicg-inert/dist/inert.min.js demo/js/third-party

# Add focus-visible polyfill
cp node_modules/focus-visible/dist/focus-visible.js demo/js/third-party
