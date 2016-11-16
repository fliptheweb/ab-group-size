module.exports = {
  entry: './src/browser.js',
  output: {
    path: './dist',
    filename: 'ab_calculator.js',
    library: 'ab_calculator'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel'
    }, {
      test: /\.css$/,
      loaders: [
        'style-loader',
        'css-loader?importLoaders=1',
        'postcss-loader'
      ]
    }, {
      test: /\.svg$/,
      loader: 'file-loader'
    }, {
      test: /\.html$/,
      loader: 'html'
    }]
  },
  postcss: function () {
    return [
      require('precss')(),
      require('autoprefixer')()
    ];
  }
};
