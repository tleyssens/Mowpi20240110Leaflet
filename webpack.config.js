// webpack.config.js
const path = require('path');

module.exports = {
  // this is the entry file for webpack
  mode: 'development',
  entry: './src/main.js', 
  // compiled/built output file
  output: {
    path: path.resolve(__dirname, 'public/javascripts'),
    filename: 'main.js',
    // this must be same as Express static use. 
    // Check ./app.js
    publicPath: '/javascripts/',
  },
  devServer: {
    host: 'mowpi1.localdomain',
    //contentBase: "./",
    //inline: true,
    port: 8889,
    //disableHostCheck: true,
    allowedHosts: "all",
    proxy: { 
      // redirect request to port 3333 
      // which is node.js server's port. Check ./bin/www file
      '/': 'http://mowpi1.localdomain:3334' 
    }
  },
  resolve: {
    alias: { 
      // we have to use Vue Es Modules compatible build
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
};