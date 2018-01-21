#!/bin/bash
mkdir -p demo/js

# Add WC polyfill loader
cp node_modules/@webcomponents/webcomponentsjs/*.js demo/js/

# Add inert polyfill
cp node_modules/wicg-inert/dist/inert.min.js demo/js/

# Add focus-visible polyfill
cp node_modules/focus-visible/dist/focus-visible.js demo/js/
