if (process.env.NODE_ENV === "development") {
  module.exports = require("./devServer")
} else if (process.env.NODE_ENV === "test") {
} else {
  module.exports = require("./devServer")
}
