import html from 'rollup-plugin-html';
import postcss from 'rollup-plugin-postcss';
import inlineSvg from 'postcss-inline-svg';
import autoprefixer from 'autoprefixer';
import replace from 'rollup-plugin-re';

const createRollupConf = (
    outputFile = 'macro-carousel.js',
    postcssPlugins = [],
    htmlOptions = {},
    extraPlugins = [],
    removeExposedPrivateFunctions = false) => ({
  input: 'src/index.js',
  output: {
    file: `dist/${outputFile}`,
    format: 'iife',
  },
  plugins: [
    replace({
      defines: {
        IS_REMOVE: removeExposedPrivateFunctions,
      },
    }),
    postcss({
      inject: false,
      plugins: [
        inlineSvg,
        autoprefixer(),
        ...postcssPlugins,
      ],
    }),
    html({
      include: ['src/**/*.html'],
      htmlMinifierOptions: htmlOptions,
    }),
    ...extraPlugins,
  ],
  watch: {
    include: '{src,demo}/**',
  },
});

export default createRollupConf;
