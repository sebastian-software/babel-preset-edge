import env from "babel-preset-env"
import react from "babel-preset-react"
import flow from "babel-preset-flow"

const presets = []
const plugins = []

presets.push([ env, {
  // Setting this to false will not transform modules.
  // "modules": false,
  "useBuiltIns": true,
  "exclude": [ "transform-regenerator" ],
  "targets": {
    "browsers": [ "last 2 versions" ],
    "node": "current"
  }
}])

presets.push(react)
presets.push(flow)

// Support for new @import() syntax
plugins.push("syntax-dynamic-import")

// Supports loading files in source folder without relative folders
plugins.push([ "module-resolver", {
  "root": [ "src" ]
}])

// Alternative to Babel Regenerator
// Implements the ES7 keywords async and await using syntax transformation at compile-time, rather than generators.
plugins.push("fast-async")

// Support for ES7 Class Properties (currently stage-2)
plugins.push("transform-class-properties")

// Support for Object Rest Spread `...` operator in objects.
plugins.push([ "transform-object-rest-spread", { "useBuiltIns": true }])

export default {
  presets,
  plugins
}
