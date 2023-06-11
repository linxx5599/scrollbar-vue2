const path = require("path")
const { VueLoaderPlugin } = require("vue-loader");
const Webpack = require("webpack");
const {
  CleanWebpackPlugin
} = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
module.exports = {
  mode: "development",
  entry: ["@babel/polyfill", path.resolve(__dirname, "./src/main.js")],
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].[hash:8].js",
  },
  devServer: {
    port: 8080,
    hot: true,
    static: {
      directory: path.join(__dirname, "dist"),
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new Webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "./public/index.html")
    }),
  ],
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: "vue-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.js$/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      }
    ]
  }
}