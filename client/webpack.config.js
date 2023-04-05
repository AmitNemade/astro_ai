const Dotenv = require('dotenv-webpack');

module.exports = {

  // OTHER CONFIGS

  plugins: [
    new Dotenv({
      systemvars: true
    })
  ]
};
