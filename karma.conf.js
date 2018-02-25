/* eslint require-jsdoc: 0 */
module.exports = function(config) {
  const configuration = {
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'node_modules/@webcomponents/webcomponentsjs/webcomponents-sd-ce.js',
      'tools/testing-helper.js',
      'dist/x-slider.js',
      'test/unit/*.unittest.js',
    ],
    preprocessors: {},
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome', 'Firefox', 'Safari'],
    singleRun: true,
    concurrency: Infinity,
    // to avoid DISCONNECTED messages
    browserDisconnectTimeout: 10000, // default 2000
    browserDisconnectTolerance: 1, // default 0
    browserNoActivityTimeout: 4 * 60 *1000, // default 10000
    captureTimeout: 4 * 60 * 1000, // default 60000
  };

  config.set(configuration);
};
