import html from 'rollup-plugin-html';

import postcss from './tools/rollup-plugin-custom-postcss.js';
import inlineSvg from 'postcss-inline-svg';
import autoprefixer from 'autoprefixer';

import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
  input: 'src/x-slider.js',
  output: {
    file: 'dist/x-slider.js',
    format: 'iife',
  },
  plugins: [
    postcss({
      plugins: [
        inlineSvg,
        autoprefixer({browsers: 'last 2 versions'}),
      ],
    }),
    html({
      include: ['src/*.html'],
    }),
    serve({
      contentBase: '',
      port: 8080,
    }),
    livereload('dist'),
  ],
  watch: {
    include: 'src/**',
  },
};
