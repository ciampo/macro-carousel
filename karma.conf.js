/* eslint require-jsdoc: 0 */
module.exports = function(config) {
  const configuration = {
    basePath: '',
    frameworks: ['mocha', 'chai-spies', 'chai'],
    files: [
      'node_modules/@webcomponents/webcomponentsjs/webcomponents-sd-ce.js',
      'node_modules/simulant/dist/simulant.umd.js',
      'dist/macro-carousel-test.js',
      'test/helpers/testing-helper.js',
      'test/*.js',
    ],
    preprocessors: {},
    reporters: ['progress', 'coverage', 'coveralls'],
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
    client: {
      mocha: {
        timeout: 6000, // 6 seconds - upped from 2 seconds
      },
    },

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
      'dist/macro-carousel-test.js': [
        'coverage',
      ],
    },
    coverageReporter: {
      type: 'lcov', // lcov or lcovonly are required for generating lcov.info files
      dir: 'coverage/',
    },
  };

  config.set(configuration);
};
