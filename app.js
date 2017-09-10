const htmlStandards = require('reshape-standard');
const cssStandards = require('spike-css-standards');
const jsStandards = require('spike-js-standards');
const pageId = require('spike-page-id');
const path = require('path');
const sugarml = require('sugarml');
const sugarss = require('sugarss');

const env = process.env.SPIKE_ENV;

const CopyWebpackPlugin = require('copy-webpack-plugin'); // eslint-disable-line

module.exports = {
  devtool: 'source-map',
  matchers: { html: '*(**/)*.sgr', css: '*(**/)*.sss' },
  ignore: ['**/layout.sgr', '**/_*', '**/.*', 'readme.md', 'yarn.lock', 'package-lock.json', 'LICENSE.md', '**/_*/**/*', 'install-eslint-config-airbnb'],
  dumpDirs: ['assets', 'views', 'www', 'favicons'],
  reshape: htmlStandards({
    parser: sugarml,
    locals: ctx => ({ pageId: pageId(ctx) }),
    minify: env === 'production',
  }),
  postcss: cssStandards({
    parser: sugarss,
    minify: env === 'production',
    warnForDuplicates: env !== 'production',
  }),
  babel: jsStandards(),
  resolve: {
    alias: {
      TweenLite: path.resolve(__dirname, 'node_modules/gsap/src/uncompressed/TweenLite.js'),
      AttrPlugin: path.resolve(__dirname, 'node_modules/gsap/src/uncompressed/plugins/AttrPlugin.js'),
    },
  },
  afterSpikePlugins: [
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'node_modules/electre-js/lib/workers'),
      to: path.resolve(__dirname, 'public/workers'),
    }]),
  ],
};
