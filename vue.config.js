var webpack = require('webpack');
module.exports = {
    publicPath:'./',
  // 在vue.config.js中configureWebpack中配置
// 要引入webpack

configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        'window.Quill': 'quill/dist/quill.js',
        'Quill': 'quill/dist/quill.js'
      }),
    ]
  }
}