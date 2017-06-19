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

import reactIntlPlugin from "babel-plugin-react-intl"
import removePropTypesPlugin from "babel-plugin-transform-react-remove-prop-types"
import reactInlineElementsPlugin from "babel-plugin-transform-react-inline-elements"
import reactConstantElements from "babel-plugin-transform-react-constant-elements"

export default function buildPreset(context, opts = {})
{
  const presets = []
  const plugins = []

  const looseMode = true

  const defaults = {
    modules: "commonjs"
  }
  const options = { ...defaults, ...opts }

  const envValue = process.env.BABEL_ENV || process.env.NODE_ENV || "development"
  const isProduction = envValue === "production"

  presets.push([ envPreset, {
    // Setting this to false will not transform modules.
    modules: options.modules,

    // Prefer built-ins which also prefers global polyfills which is the right thing to do
    // for most scenarios like SPAs and NodeJS environments.
    useBuiltIns: true,

    loose: looseMode,

    // We prefer the transpilation of the "fast-async" plugin over the
    // slower and more complex Babel internal implementation.
    exclude: [ "transform-regenerator", "transform-async-to-generator" ],

    // Differ between development and production for our scope.
    // NodeJS is generally fine in development to match the runtime version which is currently installed.
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

  if (isProduction) {
    // Cleanup descriptions for translations from compilation output
    plugins.push(reactIntlPlugin)

    // Remove prop types from our code
    plugins.push([ removePropTypesPlugin, { removeImport: true }])

    // Replaces the React.createElement function with one that is
    // more optimized for production.
    // NOTE: Symbol needs to be polyfilled.
    plugins.push(reactInlineElementsPlugin)

    // Hoists element creation to the top level for subtrees that
    // are fully static, which reduces call to React.createElement
    // and the resulting allocations. More importantly, it tells
    // React that the subtree hasn’t changed so React can completely
    // skip it when reconciling.
    plugins.push(reactConstantElements)
  }

  // Assemble final config
  return {
    presets,
    plugins
  }
}
