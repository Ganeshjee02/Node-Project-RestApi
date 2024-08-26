// webpack.config.js
const path = require('path');

module.exports = {
  entry: './index.js', // Your entry file
  output: {
    path: path.resolve(__dirname, 'dist'), // The output directory
    filename: 'bundle.js', // The output file name
  },
  resolve: {
    fallback: {
      "url": false, // Use an empty module if you don’t need this polyfill
      "stream": false,
      "fs": false,
      "util": false,
      "path":false,
      "buffer": false,
      "crypto": false,
      "querystring": false,
      "http": false,
      "zlib": false,
      "net": false,
    },
  },
  mode: 'production', // Change to 'development' for easier debugging
};
