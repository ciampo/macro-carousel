#!/bin/bash

# Add WC polyfill loader
cp node_modules/@webcomponents/webcomponentsjs/*.js demo/

# Add inert polyfill
cp node_modules/wicg-inert/dist/inert.min.js demo/

# Add focus-ring polyfill
cp node_modules/wicg-focus-ring/dist/focus-ring.js demo/
