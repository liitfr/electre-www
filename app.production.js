const CopyWebpackPlugin = require('copy-webpack-plugin')
const optimize = require('spike-optimize')
const path = require('path')

module.exports = {
  devtool: false,
  afterSpikePlugins: [
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, 'node_modules/electre-js/lib/workers'),
      to: path.resolve(__dirname, 'public/workers')
    }]),
    ...optimize({
      scopeHosting: true,
      aggressiveSplitting: true,
      minify: true
    })
  ]
}
