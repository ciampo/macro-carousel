import string from 'rollup-plugin-string';
import uglify from 'rollup-plugin-uglify';
import html from 'rollup-plugin-html';
import {minify} from 'uglify-es';

export default {
  input: 'src/x-slider.js',
  output: {
    file: 'dist/x-slider.min.js',
    format: 'iife',
  },
  plugins: [
    string({include: 'src/*.css'}),
    html({
      include: 'src/*.html',
      htmlMinifierOptions: {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        conservativeCollapse: true,
        removeComments: true,
      },
    }),
    uglify({}, minify),
  ],
};
