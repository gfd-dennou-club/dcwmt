const MODE = "development";

const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts");
const {VueLoaderPlugin} = require("vue-loader");

module.exports = {
    entry: "./src/index.js",

    output: {
        path: path.join(__dirname, "dist"),
        filename: "index.js",
    },

    mode: MODE,

    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "vue-loader",
            },
            {
                test: /\.css$/i,
                use: [ 
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: 'css-loader',
                    },
                ],
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: {
                    presets: ["@babel/preset-env"],
                }
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: "./css/[name].css",
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "index.html"),
            filename: path.join(__dirname, "dist", "index.html"),
        }),
        new RemoveEmptyScriptsPlugin(),
        new VueLoaderPlugin(),
    ],

    resolve: {
        alias: {
            "vue$": "vue/dist/vue.esm.js",
        },
        extensions: ["*", ".js", ".vue", ".json"],
        fallback: {
            "url": require.resolve("url/"),
            "zlib": require.resolve("browserify-zlib"),
            "https": require.resolve("https-browserify"),
            "http": require.resolve("stream-http"),
            "assert": require.resolve("assert/"),
            "buffer": require.resolve("buffer/"),
            "stream": require.resolve("stream-browserify"),
            "util": require.resolve("util/"),
        }
    }    
}