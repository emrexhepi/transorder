/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, './src/index.ts'),
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
    path: path.join(__dirname, 'dist'),
    filename: 'transcorder.js',
  },

  node: {
    __dirname: false,
  },

  plugins: [
    new CopyPlugin([
      { from: './src/streams.json', to: 'streams.json' },
      { from: './src/config.json', to: 'config.json' },
    ]),
  ],

  // sourcempas
  devtool: 'sourcemap',
};
