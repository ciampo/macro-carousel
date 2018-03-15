/* eslint require-jsdoc: 0 */
module.exports = function(config) {
  const configuration = {
    basePath: '',
    frameworks: ['mocha', 'chai-spies', 'chai'],
    files: [
      'node_modules/@webcomponents/webcomponentsjs/webcomponents-sd-ce.js',
      'node_modules/simulant/dist/simulant.umd.js',
      'dist/x-slider-test.js',
      'test/helpers/testing-helper.js',
      'test/*.js',
    ],
    preprocessors: {},
    reporters: ['progress', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: true,
    browsers: ['ChromeHeadless', 'FirefoxHeadless', 'Safari'],
    concurrency: Infinity,
    // to avoid DISCONNECTED messages
    browserDisconnectTimeout: 10 * 1000, // default 2000
    browserDisconnectTolerance: 1, // default 0
    browserNoActivityTimeout: 4 * 60 * 1000, // default 10000
    captureTimeout: 4 * 60 * 1000, // default 60000,
    processKillTimeout: 10 * 1000, // default 2000

    customLaunchers: {
      FirefoxHeadless: {
        base: 'Firefox',
        flags: [
          '-headless',
        ],
      },
    },

    // Code coverage options
    preprocessors: {
      'dist/x-slider-test.js': [
        'coverage',
      ],
    },
    coverageReporter: {
      type: 'html',
      dir: 'coverage/',
    },
  };

  config.set(configuration);
};
