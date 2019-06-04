import lodashPlugin from "babel-plugin-lodash"
import macrosPlugin from "babel-plugin-macros"
import moduleResolver from "babel-plugin-module-resolver"

export default function convenience(presets, plugins, options) {
  // Optimization for cheery-picking from lodash, asyncjs, ramba and recompose.
  // Auto cherry-picking es2015 imports from path imports.
  // https://www.npmjs.com/package/babel-plugin-lodash
  // https://github.com/acdlite/recompose#using-babel-lodash-plugin
  plugins.push([ lodashPlugin, { id: options.optimizeModules }])

  // Enables zero-config, importable babel plugins
  plugins.push(macrosPlugin)

  // Supports loading files in source folder without relative folders
  // https://github.com/tleunen/babel-plugin-module-resolver
  if (options.sourceFolder != null) {
    plugins.push([
      moduleResolver,
      {
        alias: {
          "-": options.sourceFolder
        }
      }
    ])
  }
}
