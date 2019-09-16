import createRollupConfig from './rollup-base.config';
import cssnano from 'cssnano';
import {terser} from 'rollup-plugin-terser';
import babel from 'rollup-plugin-babel';

const config = require('../package.json');

export default createRollupConfig(
  'macro-carousel.es5.min.js',
  [
    cssnano(),
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
      externalHelpers: true,
      presets: [
        [
          '@babel/preset-env',
          {
            modules: false,
          },
        ],
      ],
    }),
    terser({
      output: {
        beautify: false,
        preamble: `/*!
  @license https://github.com/ciampo/macro-carousel/blob/master/LICENSE
  ${config.name} ${config.version}
*/`,
      },
    }),
  ]
);
