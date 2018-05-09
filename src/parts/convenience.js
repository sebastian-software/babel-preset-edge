import { get as getAppRoot } from "app-root-dir"
import { resolve as resolvePath } from "path"

import moduleResolver from "babel-plugin-module-resolver"
import lodashPlugin from "babel-plugin-lodash"

export default function convenience(presets, plugins, options) {
  // Optimization for cheery-picking from lodash, asyncjs, ramba and recompose.
  // Auto cherry-picking es2015 imports from path imports.
  // https://www.npmjs.com/package/babel-plugin-lodash
  // https://github.com/acdlite/recompose#using-babel-lodash-plugin
  plugins.push([ lodashPlugin, { id: options.optimizeModules }])

  // Supports loading files in source folder without relative folders
  // https://github.com/tleunen/babel-plugin-module-resolver
  if (options.sourceFolder != null) {
    plugins.push([
      moduleResolver,
      {
        alias: {
          "~": resolvePath(getAppRoot(), options.sourceFolder)
        }
      }
    ])
  }
}
