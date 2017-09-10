/* eslint max-len: ["off"], no-console: ["off"], require-jsdoc: 0 */
module.exports = function(config) {
  const configuration = {
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      'node_modules/@webcomponents/webcomponentsjs/webcomponents-sd-ce.js',
      'tools/testing-helper.js',
      'src/*.js',
      'test/unit/*.js',
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
  };

  config.set(configuration);
};
