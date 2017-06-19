/* eslint-disable filenames/match-exported */
import envPreset from "babel-preset-env"
import reactPreset from "babel-preset-react"
import flowPreset from "babel-preset-flow"

export default function buildPreset(context, opts = {})
{
  const presets = []
  const plugins = []

  presets.push([ envPreset, {
    // Setting this to false will not transform modules.
    // "modules": false,
    useBuiltIns: true,
    exclude: [ "transform-regenerator" ],
    targets: {
      browsers: [ "last 2 versions" ],
      node: "current"
    }
  }])

  presets.push(reactPreset)
  presets.push(flowPreset)

  // Support for new @import() syntax
  plugins.push("babel-plugin-syntax-dynamic-import")

  // Supports loading files in source folder without relative folders
  plugins.push([ "babel-plugin-module-resolver", {
    root: [ "src" ]
  }])

  // Alternative to Babel Regenerator
  // Implements the ES7 keywords async and await using syntax transformation at compile-time, rather than generators.
  plugins.push("babel-plugin-fast-async")

  // Support for ES7 Class Properties (currently stage-2)
  plugins.push("babel-plugin-transform-class-properties")

  // Support for Object Rest Spread `...` operator in objects.
  plugins.push([ "babel-plugin-transform-object-rest-spread", { "useBuiltIns": true }])

  // Assemble final config
  return {
    presets,
    plugins
  }
}
