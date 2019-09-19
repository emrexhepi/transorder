const path = require('path');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    // needed for ./src folder to be considered as root
    modules: [path.join(__dirname, './src')],

    extensions: ['.tsx', '.ts', '.js']
  },
  output: {
    filename: 'transcorder.js',
    path: path.resolve(__dirname, 'dist')
  },

  // sourcempas
  devtool: 'sourcemap',
};
