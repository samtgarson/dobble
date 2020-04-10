if (process.env.NODE_ENV !== 'production') require('dotenv').config()

const path = require('path')
module.exports = {
  webpack: config => {
    config.resolve.alias['~'] = path.resolve(__dirname) + "/"
    return config
  }
}
