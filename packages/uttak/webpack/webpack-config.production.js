const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');
const commonWebpackConfig = require('./webpack.common.js');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const nodeExternals = require('webpack-node-externals');

module.exports = merge(commonWebpackConfig, {
    entry: '/index.ts',
    mode: 'production',
    devtool: 'source-map',
    output: {
        clean: true,
        filename: 'index.js',
        library: {
            name: '@navikt/k9-fe-uttak',
            type: 'umd',
        },
        path: path.resolve(__dirname, `../build`),
    },
    optimization: {
        minimize: true,
        minimizer: [new TerserPlugin({ extractComments: false }), new CssMinimizerPlugin()],
        moduleIds: 'named',
    },
    performance: {
        maxAssetSize: 400000,
        maxEntrypointSize: 600000,
    },
    externalsPresets: { node: true },
    externals: [nodeExternals({
        modulesDir: path.resolve(__dirname, '../../../node_modules'),
    })],
});
