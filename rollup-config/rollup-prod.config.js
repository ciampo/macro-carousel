import html from 'rollup-plugin-html';

import postcss from 'rollup-plugin-postcss';
import inlineSvg from 'postcss-inline-svg';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

import uglify from 'rollup-plugin-uglify';

const config = require('../package.json');

export default {
  input: 'src/x-slider.js',
  output: {
    file: 'dist/x-slider.min.js',
    format: 'iife',
  },
  plugins: [
    postcss({
      inject: false,
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
    uglify({
      output: {
        beautify: false,
        preamble: `/*!
  @license https://github.com/ciampo/x-slider/blob/master/LICENSE
  ${config.name} ${config.version}
*/`,
      },
      mangle: {
        keep_classnames: true,
        keep_fnames: true,
        properties: {
          regex: /^_/,
        },
      },
    }),
  ],
};
