'use strict';
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.js');
const StylelintPlugin = require('stylelint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');

module.exports = () => {
  return merge(baseWebpackConfig(), {
    // cheap-module-eval-source-map is faster for development
    devtool: 'inline-source-map',
    devServer: {
      hot: true,
      open: true,
      port: 9090,
      inline: true,
      historyApiFallback: true,
      proxy: {
        '/api': 'http://localhost:8002'
      }
    },
    plugins: [
      new StylelintPlugin({
        files: [
          'public/**/*.vue',
          'public/**/*.scss'
        ]
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: function(module) {
          return (
            module.context && module.context.indexOf('node_modules') !== -1
          );
        }
      }),
      new webpack.optimize.CommonsChunkPlugin({
        name: 'manifest',
        minChunks: Infinity
      }),
      // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoEmitOnErrorsPlugin(),
      // https://github.com/ampedandwired/html-webpack-plugin
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'index.html',
        inject: true
      }),
      new FriendlyErrorsPlugin()
    ]
  });
};
