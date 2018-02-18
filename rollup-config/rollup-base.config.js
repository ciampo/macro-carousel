import html from 'rollup-plugin-html';
import postcss from 'rollup-plugin-postcss';
import inlineSvg from 'postcss-inline-svg';
import autoprefixer from 'autoprefixer';

const createRollupConf = (
    outputFile = 'x-slider.js',
    postcssPlugins = [],
    htmlOptions = {},
    extraPlugins = []) => ({
  input: 'src/x-slider.js',
  output: {
    file: `dist/${outputFile}`,
    format: 'iife',
  },
  plugins: [
    postcss({
      inject: false,
      plugins: [
        inlineSvg,
        autoprefixer({browsers: 'last 2 versions'}),
        ...postcssPlugins
      ],
    }),
    html({
      include: ['src/*.html'],
      htmlMinifierOptions: htmlOptions
    }),
    ...extraPlugins
  ],
  watch: {
    include: '{src,demo}/**',
  }
});

export default createRollupConf;