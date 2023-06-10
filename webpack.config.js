const { resolve } = require("path");
const TerserPlugin = require('terser-webpack-plugin');
const VueLoaderPlugin = require("vue-loader/lib/plugin");
module.exports = {
  entry: {
    "scrollbar": "./components/index.js",
    "scrollbar.min": "./components/index.js",
  },
  output: {
    filename: "[name].js",
    path: resolve(__dirname, "./lib"),
    library: {
      name: "scrollbar",
      type: "umd",
      export: "default"
    },
    globalObject: "globalThis"
  },
  mode: "production",
  // devtool: false,
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({ // 使用压缩插件
        include: /\.min\.js$/
      }),
      new VueLoaderPlugin()
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/, //转为ES5
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  // 需要兼容到以下浏览器的什么版本
                  "targets": {
                    "ie": 7,
                    "edge": "17",
                    "firefox": "60",
                    "chrome": "67",
                    "safari": "11.1",
                  },
                  // 按需加载
                  "useBuiltIns": "usage",
                  // 指定core-js版本 看好了这个地方如果和你安装的包的版本不一样会报错
                  "corejs": "3.21.0",
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.vue$/,
        use: "vue-loader"
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  }
}