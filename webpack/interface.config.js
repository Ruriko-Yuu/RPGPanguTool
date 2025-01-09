const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
module.exports = {
  mode: "development",
  entry: "./interface/index.tsx",
  output: {
    path: path.resolve(__dirname, "../dist-interface"),
    // filename: "interface.js",
    filename: "interface.[hash].js",
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx']
  },
  optimization: {
    //添加抽离公共代码插件的配置
    splitChunks: {
      cacheGroups: {
        //打包公共模块
        commons: {
          chunks: "initial", //initial表示提取入口文件的公共部分
          minChunks: 2, //表示提取公共部分最少的文件数
          minSize: 0, //表示提取公共部分最小的大小
          name: "commons", //提取出来的文件命名
        },
      },
    },
  },
  plugins: [
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].[contenthash].css",
      chunkFilename: "[id].[contenthash].css",
    }),
    new HtmlWebpackPlugin({
      //实例化Html模板模块
      template: path.resolve(__dirname, "../interface/index.html"),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.ts|tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      { test: /\.js$/, use: "babel-loader", exclude: /node-modules/ },
      {
        test: /\.css$/,
        use: [
          { loader: "style-loader" },
          {
            loader: "css-loader",
            options: {},
          },
        ],
      },
      {
        test: /\.scss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.(jpg|png|jpeg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1024,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "img/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
      },
      {
        //配置多媒体资源的打包信息
        test: /\.(mp4|webm|ogg|mp3|wav)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1024,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "media/[name].[hash:8].[ext]",
                },
              },
            },
          },
        ],
      },
    ],
  },
  devServer: {
    hot: true,
    open: false,
    port: 8888,
    // contentBase: '../dist'
  },
};
