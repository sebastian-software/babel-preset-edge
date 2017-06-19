/* eslint-disable filenames/match-exported */
import { get as getAppRoot } from "app-root-dir"
import { resolve as resolvePath } from "path"

import envPreset from "babel-preset-env"
import reactPreset from "babel-preset-react"
import flowPreset from "babel-preset-flow"

import dynamicImportPlugin from "babel-plugin-syntax-dynamic-import"
import moduleResolverPlugin from "babel-plugin-module-resolver"
import fastAsyncPlugin from "babel-plugin-fast-async"
import classPropertiesPlugin from "babel-plugin-transform-class-properties"
import objectRestSpreadPlugin from "babel-plugin-transform-object-rest-spread"
import lodashPlugin from "babel-plugin-lodash"
import transformRuntimePlugin from "babel-plugin-transform-runtime"

export default function buildPreset(context, opts = {})
{
  const presets = []
  const plugins = []

  presets.push([ envPreset, {
    // Setting this to false will not transform modules.
    // "modules": false,
    useBuiltIns: true,
    exclude: [ "transform-regenerator", "transform-async-to-generator" ],
    targets: {
      browsers: [ "last 2 versions" ],
      node: "current"
    }
  }])

  presets.push(reactPreset)
  presets.push(flowPreset)

  // Support for new @import() syntax
  plugins.push(dynamicImportPlugin)

  // Optimization for lodash imports.
  // Auto cherry-picking es2015 imports from path imports.
  plugins.push(lodashPlugin)

  // Supports loading files in source folder without relative folders
  plugins.push([ moduleResolverPlugin, {
    root: [ resolvePath(getAppRoot(), "src") ]
  }])

  // Alternative to Babel Regenerator
  // Implements the ES7 keywords async and await using syntax transformation at compile-time, rather than generators.
  plugins.push([ fastAsyncPlugin, {
    useRuntimeModule: true
  }])

  // Support for ES7 Class Properties (currently stage-2)
  plugins.push(classPropertiesPlugin)

  // Support for Object Rest Spread `...` operator in objects.
  plugins.push([ objectRestSpreadPlugin, { useBuiltIns: true }])

  // Use helpers, but not polyfills, in a way that omits duplication.
  // For polyfills better use polyfill.io or another more sophisticated solution.
  plugins.push([ transformRuntimePlugin, {
    regenerator: false,
    polyfill: false,
    useBuiltIns: true,
    useESModules: true
  }])

  // Assemble final config
  return {
    presets,
    plugins
  }
}
