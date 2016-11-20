let webpack = require('webpack');
let UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;
let env = process.env.WEBPACK_ENV || 'development';
let plugins = [];

if (env === 'production') {
  plugins.push(new UglifyJsPlugin({minimize: true}))
}

module.exports = {
  entry: './src/ab_calculator.browser.js',
  output: {
    path: './dist',
    filename: 'ab_calculator.browser.js',
    library: 'ab_calculator',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel?cacheDirectory'
    }, {
      test: /\.css$/,
      loaders: [
        'style-loader',
        'css-loader?importLoaders=1',
        'postcss-loader'
      ]
    }, {
      test: /\.svg$/,
      loader: 'url'
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
  },
  plugins: plugins
};
