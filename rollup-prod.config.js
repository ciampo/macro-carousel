import html from 'rollup-plugin-html';
import sass from 'rollup-plugin-sass';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import minify from 'rollup-plugin-babel-minify';

const config = require('./package.json');

export default {
  input: 'src/x-slider.js',
  output: {
    file: 'dist/x-slider.min.js',
    format: 'iife',
  },
  plugins: [
    sass({
      include: 'src/*.css',
      options: {
        outputStyle: 'compressed',
      },
      processor: css => postcss([autoprefixer({browsers: 'last 2 versions'})])
        .process(css)
        .then(result => result.css),
    }),
    html({
      include: ['src/*.html', 'src/*.svg'],
      htmlMinifierOptions: {
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        conservativeCollapse: true,
        removeComments: true,
      },
    }),
    minify({
      removeConsole: true,
      comments: false,
      banner: `/* ${config.name} ${config.version} */`,
      sourceMap: false,
    }),
  ],
};
