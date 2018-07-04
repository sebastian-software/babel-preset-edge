if (process.env.NODE_ENV === "test") {
  require('babel-plugin-require-context-hook/register')()
}

const loader = require.context(__dirname, false, /\.js/)
