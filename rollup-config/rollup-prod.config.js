import createRollupConfig from './rollup-base.config';
import cssnano from 'cssnano';
import uglify from 'rollup-plugin-uglify';

const config = require('../package.json');

export default createRollupConfig(
  'x-slider.min.js',
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
      keep_classnames: true,
    }),
  ]
);
