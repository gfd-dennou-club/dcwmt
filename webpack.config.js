const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopywebpackPlugin = require('copy-webpack-plugin');

const cesiumSource = 'node_modules/cesium/Source';
const cesiumWorkers = '../Build/Cesium/Workers';

module.exports = {
    mode: 'development',
    entry: __dirname + "/src/main.js",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',

        sourcePrefix: '',
    },
    amd: {
        toUrlUndefined: true,
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: [ 'style-loader', 'css-loader' ]
        }, {
            test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
            use: [ 'url-loader' ]
        }]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'main.html'
        }),
        new CopywebpackPlugin({
            patterns: [{from: path.join(cesiumSource, cesiumWorkers), to: 'Workers'}]
        }),
        new CopywebpackPlugin({
            patterns: [{from: path.join(cesiumSource, 'Assets'), to: 'Assets'}]
        }),
        new CopywebpackPlugin({
            patterns: [{from: path.join(cesiumSource, 'Widgets'), to: 'Widgets'}]
        }),
        new webpack.DefinePlugin({
            CESIUM_BASE_URL: JSON.stringify(cesiumSource)
        })
    ],
    resolve: {
        alias: {
            cesium: path.resolve(__dirname, cesiumSource)
        },
        fallback: {
            fs: false
        }
    },
    devtool: 'source-map',
}