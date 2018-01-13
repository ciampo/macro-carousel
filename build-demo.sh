#!/bin/bash

# Add WC polyfill loader
cp node_modules/@webcomponents/webcomponentsjs/*.js demo/

# Add inert polyfill
cp node_modules/wicg-inert/dist/inert.min.js demo/

# Add focus-visible polyfill
cp node_modules/focus-visible/dist/focus-visible.js demo/
