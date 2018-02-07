import html from 'rollup-plugin-html';

import postcss from 'rollup-plugin-postcss';
import inlineSvg from 'postcss-inline-svg';
import autoprefixer from 'autoprefixer';
import cssnano from 'cssnano';

import babel from 'rollup-plugin-babel';
import uglify from 'rollup-plugin-uglify';

const config = require('../package.json');

export default {
  input: 'src/x-slider.js',
  output: {
    file: 'dist/x-slider.es5.min.js',
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
    babel({
      babelrc: false,
      presets: [
        [
          'env',
          {
            modules: false,
            targets: {
              browsers: [
                '> 1%',
                'last 2 versions',
                'ie >= 11',
              ],
            },
          },
        ],
      ],
      plugins: [
        'external-helpers',
      ],
    }),
    uglify({
      output: {
        beautify: false,
        preamble: `/*!
  @license https://github.com/ciampo/x-slider/blob/master/LICENSE
  ${config.name} ${config.version}
*/`,
      },
    }),
  ],
};
