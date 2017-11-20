const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  entry: './src/x-slider.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'x-slider.min.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [{
          loader: 'css-loader',
          options: {minimize: true},
        }],
      },
    ],
  },
  plugins: [
    new UglifyJsPlugin({
      uglifyOptions: {
        ecma: 6,
      },
    }),
  ],
};
