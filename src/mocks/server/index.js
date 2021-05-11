if (process.env.NODE_ENV === 'development') {
  module.exports = require('./dev-server')
} else if (process.env.NODE_ENV === 'test') {
} else {
  module.exports = require('./dev-server')
}
