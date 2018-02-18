import createRollupConfig from './rollup-base.config';
import cssnano from 'cssnano';
import uglify from 'rollup-plugin-uglify';
import babel from 'rollup-plugin-babel';

const config = require('../package.json');

export default createRollupConfig(
  'x-slider.es5.min.js',
  [
    cssnano()
  ],
  {
    collapseWhitespace: true,
    collapseBooleanAttributes: true,
    conservativeCollapse: true,
    removeComments: true,
  },
  [
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
  ]
);
