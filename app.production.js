const optimize = require('spike-optimize');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // eslint-disable-line

module.exports = {
  devtool: false,
  afterSpikePlugins: [
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'node_modules/electre-js/lib/workers'),
      to: path.resolve(__dirname, 'public/workers'),
    }]),
    ...optimize({
      scopeHosting: true,
      aggressiveSplitting: true,
      minify: true,
    }),
  ],
};
