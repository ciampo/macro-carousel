import html from 'rollup-plugin-html';
import sass from 'rollup-plugin-sass';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

export default {
  input: 'src/x-slider.js',
  output: {
    file: 'dist/x-slider.js',
    format: 'iife',
  },
  plugins: [
    sass({
      include: 'src/*.css',
      options: {
        outputStyle: 'expanded',
      },
      processor: css => postcss([autoprefixer({browsers: 'last 2 versions'})])
        .process(css)
        .then(result => result.css),
    }),
    html({
      include: ['src/*.html', 'src/*.svg'],
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
