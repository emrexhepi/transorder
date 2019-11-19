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
      { from: './src/streams.example.json', to: 'streams.example.json' },
      { from: './src/config.rpi.json', to: 'config.rpi.json' },
    ]),
  ],

  // sourcempas
  devtool: 'sourcemap',
};
