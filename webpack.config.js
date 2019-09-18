module.exports = {
  // settings
  devtool: 'source-map',

  // modules
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  },

  // watch
  watchOptions: {
    ignored: /node_modules/
  }
};
