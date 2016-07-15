module.exports = {
  entry: './src/browser.js',
  output: {
    path: './dist',
    filename: 'ab_calculator.js'
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: 'babel'
    }]
  }
};
