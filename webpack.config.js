const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config();

const isProd = process.env.NODE_ENV === "production";

const config = {
  mode: isProd ? "production" : "development",
  entry: path.join(__dirname, "src", "index.tsx"),
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx", ".css"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/i,
        use: ["css-loader"],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "src", "index.html"),
      filename: "index.html",
      inject: "body",
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: "data", to: "./" },
        { from: "src/*.css", to: "" },
      ],
    }),
    new webpack.DefinePlugin({
      "process.env.REACT_APP_GPHOTOS_CLIENT_ID": JSON.stringify(
        process.env.REACT_APP_GPHOTOS_CLIENT_ID
      ),
      "process.env.REACT_APP_GPHOTOS_CLIENT_SECRET": JSON.stringify(
        process.env.REACT_APP_GPHOTOS_CLIENT_SECRET
      ),
      "process.env.REACT_APP_GOOGLE_VERIFY_TOKEN": JSON.stringify(
        process.env.REACT_APP_GOOGLE_VERIFY_TOKEN
      ),
    }),
  ],
};

if (isProd) {
  config.optimization = {
    minimizer: [new TerserWebpackPlugin()],
  };
} else {
  config.devServer = {
    port: 9000,
    open: true,
    hot: true,
    compress: true,
  };
}

module.exports = config;
