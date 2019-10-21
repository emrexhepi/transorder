/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.ts',
  target: 'node',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    // needed for ./src folder to be considered as root
    modules: [
      path.join(__dirname, './src'),
      path.join(__dirname, './node_modules'),
    ],

    extensions: ['.tsx', '.ts', '.js'],
  },

  output: {
    filename: 'transcorder.js',
    path: path.resolve(__dirname, 'dist'),
  },

  plugins: [
    new CopyPlugin([
      { from: './src/config.json', to: 'config.json' },
    ]),
  ],

  // sourcempas
  devtool: 'sourcemap',
};
