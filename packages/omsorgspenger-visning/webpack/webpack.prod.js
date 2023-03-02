const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const commonWebpackConfig = require('./webpack.common.js');
const CspHtmlWebpackPlugin = require('csp-html-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

process.env.NODE_ENV = 'production';
const dotenv = require("dotenv").config({ path: __dirname + "/../.env.production" });

module.exports = merge(commonWebpackConfig, {
  mode: 'production',
  performance: { hints: false },
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, `../build`),
    publicPath: '/',
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ extractComments: false }), new CssMinimizerPlugin()],
  },
  performance: {
    maxAssetSize: 512000,
    maxEntrypointSize: 600000,
  },
  resolve: {
    modules: ['node_modules', 'src'],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": JSON.stringify(dotenv.parsed),
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      favicon: path.resolve(__dirname, '../public/favicon.ico'),
      template: path.resolve(__dirname, '../public/index.html')
    }),
    new CspHtmlWebpackPlugin(
      {
        'default-src': ["'self'"],
        'connect-src': [
          "'self'",
          'https://omsorgspenger-oidc-auth-proxy.intern.nav.no',
          'https://omsorgspenger-oidc-auth-proxy.dev.intern.nav.no',
          'https://sentry.gc.nav.no',
        ],
        'font-src': ["'self'", 'data:'],
        'img-src': ["'self'", 'data:'],
        'script-src': ["'self'"],
        'style-src': [
          "'self'",
          "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='", // Tomme style-tagger
        ],
      },
      {
        nonceEnabled: {
          'script-src': false,
          'style-src': false,
        },
        hashEnabled: {
          'script-src': true,
          'style-src': true,
        },
      },
    ),
  ]
});