/* Eslint requireConfigFile: false */
const path = require('path')
const autoprefixer = require('autoprefixer')
// const HtmlWebpackPlugin = require('html-webpack-plugin');
const LodashWebpackPlugin = require('lodash-webpack-plugin')

export default {
  mode: 'production',
  entry: ['./src/index.js', './src/assets/css/styles.scss'],
  target: 'web',
  node: {
    net: 'empty',
    fs: 'empty',
    tls: 'empty',
  },
  output: {
    path: path.resolve(__dirname, 'dist/public'),
    filename: 'app.js',
    sourceMapFilename: 'app.js.map',
  },
  devtool: '#source-map',
  optimization: {
    minimize: true,
  },
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'assets/css/[name].css',
            },
          },
          {
            loader: 'extract-loader',
          },
          {
            loader: 'css-loader?-url',
          },
          {
            loader: 'postcss-loader',
            options: {
              plugins: [
                autoprefixer(),
              ],
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
  plugins: [
    // new HtmlWebpackPlugin({template: path.resolve(__dirname, "public/index.html")}),
    new LodashWebpackPlugin(),
  ],

}
