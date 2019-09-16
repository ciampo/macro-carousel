import createRollupConfig from './rollup-base.config';
import {terser} from 'rollup-plugin-terser';
import cssnano from 'cssnano';

const config = require('../package.json');

export default createRollupConfig(
  'macro-carousel.min.js',
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
    terser({
      output: {
        beautify: false,
        preamble: `/*!
  @license https://github.com/ciampo/macro-carousel/blob/master/LICENSE
  ${config.name} ${config.version}
*/`,
      },
      mangle: {
        properties: {
          regex: /^_/,
        },
      },
      keep_classnames: true,
      keep_fnames: true,
    }),
  ]
);
