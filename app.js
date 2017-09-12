const htmlStandards = require('reshape-standard');
const cssStandards = require('spike-css-standards');
const jsStandards = require('spike-js-standards');
const pageId = require('spike-page-id');
const path = require('path');
const sugarml = require('sugarml');
const sugarss = require('sugarss');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // eslint-disable-line
const webpack = require('webpack'); // eslint-disable-line

const env = process.env.SPIKE_ENV;

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
      ShoelaceDropDowns: path.resolve(__dirname, 'node_modules/shoelace-css/source/js/dropdowns.js'),
      ShoelaceTabs: path.resolve(__dirname, 'node_modules/shoelace-css/source/js/tabs.js'),
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      Zepto: 'zepto-webpack',
      $: 'zepto-webpack',
    }),
  ],
  afterSpikePlugins: [
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'node_modules/electre-js/lib/workers'),
      to: path.resolve(__dirname, 'public/workers'),
    }]),
  ],
};
