'use strict';

const path = require('path');
const webpack = require('webpack');
const StylelintPlugin = require('stylelint-webpack-plugin');

function getPath(tsPath) {
  return path.join(__dirname, '..', tsPath);
}

module.exports = {
  entry: {
    app: [getPath('public/src/index.ts')]
  },
  output: {
    path: getPath('dist/'),
    filename: '[name].js',
    publicPath: '/',
    chunkFilename: '[name].js'
  },
  resolve: {
    alias: {
      '@': getPath('public/src'),
      '@css': getPath('public/css'),
      '@comp': getPath('public/src/components'),
      '@img': getPath('public/images'),
    },
    extensions: ['.ts', '.js', '.vue', '.json']
  },
  module: {
    loaders: [
      {
        test: /\.ts$/,
        exclude: /node_modules|vue\/src/,
        enforce: 'pre',
        loader: 'tslint-loader'
      },
      {
        test: /\.ts$/,
        exclude: /node_modules|vue\/src/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          esModule: true,
          loaders: {
            scss: [
              'vue-style-loader',
              'css-loader',
              'sass-loader'
            ]
          }
        }
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192
            }
          }
        ]
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]'
            }
          }
        ]
      }
    ]
  }
};
