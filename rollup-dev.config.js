import string from 'rollup-plugin-string';
import html from 'rollup-plugin-html';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
  input: 'src/x-slider.js',
  output: {
    file: 'dist/x-slider.js',
    format: 'iife',
  },
  plugins: [
    string({include: 'src/*.css'}),
    html({
      include: 'src/*.html',
    }),
    serve({
      open: true,
      contentBase: '',
      port: 8080,
    }),
    livereload('dist'),
  ],
  watch: {
    include: 'src/**',
  },
};
