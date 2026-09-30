const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.js',
    deleteMe: './src/delete-me.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    // Absolute so pages served from subdirectories (/license/, /delete-me/) resolve assets
    publicPath: '/',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/template.html',
      title: 'The Process — Workout Tracker',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      template: './src/license.html',
      filename: 'license/index.html',
      chunks: ['main'],
    }),
    new HtmlWebpackPlugin({
      template: './src/delete-me.html',
      filename: 'delete-me/index.html',
      chunks: ['main', 'deleteMe'],
    }),
  ],
};
