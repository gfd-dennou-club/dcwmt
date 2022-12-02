const MODE = "development";

// const path = require("path");
import path from "path";

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const RemoveEmptyScriptsPlugin = require("webpack-remove-empty-scripts");
const { VueLoaderPlugin } = require("vue-loader");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");

const cesiumSouece = "./node_modules/cesium/Source";
const cesiumWorkers = "../Build/Cesium/Workers";

module.exports = {
  entry: "./src/index.js",

  output: {
    publicPath: "/",
    filename: "index.js",
    path: path.join(__dirname, "dist"),
  },

  devServer: {
    static: {
      directory: path.join(__dirname, "dist"),
    },
    hot: true,
    liveReload: true,
    historyApiFallback: true,
  },

  mode: MODE,

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader",
      },
      {
        test: /\.(sass|scss|css)$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: "css-loader",
          },
          {
            loader: "sass-loader",
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: {
          presets: ["@babel/preset-env"],
        },
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "./css/[name].css",
    }),
    new RemoveEmptyScriptsPlugin(),
    new VueLoaderPlugin(),
    // for cesium
    new CopyWebpackPlugin({
      patterns: [
        { from: path.join(cesiumSouece, cesiumWorkers), to: "Workers" },
        { from: path.join(cesiumSouece, "Assets"), to: "Assets" },
        { from: path.join(cesiumSouece, "Widgets"), to: "Widgets" },
        {
          from: path.join(cesiumSouece, "ThirdParty/Workers"),
          to: "ThirdParty/Workers",
        },
      ],
    }),
    new webpack.DefinePlugin({
      CESIUM_BASE_URL: JSON.stringify("./"),
    }),
  ],

  resolve: {
    alias: {
      vue$: "vue/dist/vue.esm.js",
    },
    extensions: ["*", ".js", ".vue", ".json"],
    fallback: {
      url: require.resolve("url/"),
      zlib: require.resolve("browserify-zlib"),
      https: require.resolve("https-browserify"),
      http: require.resolve("stream-http"),
      assert: require.resolve("assert/"),
      buffer: require.resolve("buffer/"),
      stream: require.resolve("stream-browserify"),
      util: require.resolve("util/"),
    },
  },
};
