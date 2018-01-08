import html from 'rollup-plugin-html';

import postcss from './tools/rollup-plugin-custom-postcss.js';
import inlineSvg from 'postcss-inline-svg';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

import minify from 'rollup-plugin-babel-minify';

const config = require('./package.json');

export default {
  input: 'src/x-slider.js',
  output: {
    file: 'dist/x-slider.min.js',
    format: 'iife',
  },
  plugins: [
    postcss({
      plugins: [
        inlineSvg,
        autoprefixer({browsers: 'last 2 versions'}),
        cssnano(),
      ],
    }),
    html({
      include: ['src/*.html'],
      htmlMinifierOptions: {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        conservativeCollapse: true,
        removeComments: true,
      },
    }),
    minify({
      removeConsole: true,
      comments: false,
      banner: `/* ${config.name} ${config.version} */`,
      sourceMap: false,
    }),
  ],
};
