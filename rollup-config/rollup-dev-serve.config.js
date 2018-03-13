import createRollupConfig from './rollup-base.config';

import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default createRollupConfig(
  'x-slider.js',
  undefined,
  undefined,
  [
    serve({
      contentBase: '',
      port: 8080,
    }),
    livereload('dist'),
  ]
);
