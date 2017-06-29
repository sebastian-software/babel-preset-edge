/* eslint-disable filenames/match-exported */
import { get as getAppRoot } from "app-root-dir"
import { resolve as resolvePath } from "path"
import browserslist from "browserslist"

import envPreset from "babel-preset-env"
import reactPreset from "babel-preset-react"
import flowPreset from "babel-preset-flow"

import dynamicImportPlugin from "babel-plugin-syntax-dynamic-import"
import moduleResolver from "babel-plugin-module-resolver"
import fastAsyncPlugin from "babel-plugin-fast-async"
import classPropertiesPlugin from "babel-plugin-transform-class-properties"
import objectRestSpreadPlugin from "babel-plugin-transform-object-rest-spread"
import lodashPlugin from "babel-plugin-lodash"
import transformRuntimePlugin from "babel-plugin-transform-runtime"

import reactIntlPlugin from "babel-plugin-react-intl"
import removePropTypesPlugin from "babel-plugin-transform-react-remove-prop-types"
import reactInlineElementsPlugin from "babel-plugin-transform-react-inline-elements"
import reactConstantElements from "babel-plugin-transform-react-constant-elements"

import es3PropertyLiterals from "babel-plugin-transform-es3-property-literals"
import es3ExpressionLiterals from "babel-plugin-transform-es3-member-expression-literals"

const defaults = {
  // One of the following:
  // - "node"/nodejs"/"script"/"binary": any NodeJS related execution with wide support to last LTS aka 6.9.0
  // - "current"/"test": current NodeJS version
  // - "browser"/"web": browsers as defined by browserslist
  // - "library": ideally used for publishing libraries e.g. on NPM
  // - "es2015": same as "library" but targets es2o15 capable engines only.
  // - {}: any custom settings support by Env-Preset
  target: "nodejs",

  // Choose automatically depending on target
  modules: "auto",

  // Env Settings
  looseMode: true,
  specMode: false,

  // Lodash Plugin Settings
  optimizeModules: [ "lodash", "async", "rambda", "recompose" ],

  // Configuration for module lookup
  sourceFolder: "src",

  // Babel Core Settings
  comments: false,
  compact: true,
  minified: true
}

export default function buildPreset(context, opts = {})
{
  const presets = []
  const plugins = []

  // These are the final options we use later on.
  const options = { ...defaults, ...opts }

  // There is also a BROWSERSLIST_ENV
  const envValue = process.env.BABEL_ENV || process.env.NODE_ENV || "development"
  const isProduction = envValue === "production"

  console.log("- Environment:", envValue)

  // Auto select test target when running in test environment and no other info is available.
  if (envValue === "test" && options.target == null) {
    options.target = "test"
  }

  let envTargets = {}
  if (options.target === "node" || options.target === "nodejs" || options.target === "script" || options.target === "binary") {
    // Last stable NodeJS (LTS) - first LTS of 6.x.x was 6.9.0
    // See also: https://nodejs.org/en/blog/release/v6.9.0/
    envTargets.node = "6.9.0"
  } else if (options.target === "current" || options.target === "test") {
    // Scripts which are directly used like tests can be transpiled for the current NodeJS version
    envTargets.node = "current"
  } else if (options.target === "browser" || options.target === "web") {
    // Until this issue is fixed we can't use auto config detection for browserslist in babel-preset-env
    // https://github.com/babel/babel-preset-env/issues/149
    // What we do here is actually pretty clever/ytupid as we just pass over the already normalized
    // browser list to browserslist again.
    const autoBrowsers = browserslist(null, { env: isProduction ? "production" : "development" })

    // For the abstract browsers config we let browserslist find the config file
    envTargets.browsers = autoBrowsers
  } else if (options.target === "library" || options.target === "es2015") {
    // Explicit undefined results into compilation with "latest" preset supporting a wide range of clients via ES5 output
    envTargets = undefined
  } else if (typeof options.target === "object") {
    envTargets = options.target
  }

  let additionalExcludes = []

  // Exclude all es2015 features which are supported by the default es2015 babel preset.
  // This targets all es2015-capable browsers and engines.
  if (options.target === "es2015") {
    additionalExcludes.push(
      "transform-es2015-template-literals",
      "transform-es2015-literals",
      "transform-es2015-function-name",
      "transform-es2015-arrow-functions",
      "transform-es2015-block-scoped-functions",
      "transform-es2015-classes",
      "transform-es2015-object-super",
      "transform-es2015-shorthand-properties",
      "transform-es2015-duplicate-keys",
      "transform-es2015-computed-properties",
      "transform-es2015-for-of",
      "transform-es2015-sticky-regex",
      "transform-es2015-unicode-regex",
      "check-es2015-constants",
      "transform-es2015-spread",
      "transform-es2015-parameters",
      "transform-es2015-destructuring",
      "transform-es2015-block-scoping",
      "transform-es2015-typeof-symbol",
      "transform-es2015-modules-commonjs",
      "transform-es2015-modules-systemjs",
      "transform-es2015-modules-amd",
      "transform-es2015-modules-umd"
      // "transform-regenerator"
    )
  }

  if (options.target === "es2015") {
    console.log("- Environment Targets: ES2015 capable")
  } else {
    console.log("- Environment Targets:", envTargets)
  }

  if (options.modules === "auto" || options.modules == null) {
    if (options.target === "node" || options.target === "nodejs" || options.target === "script" || options.target === "binary" || options.target === "test") {
      options.modules = "commonjs"
    } else if (options.target === "library" || options.target === "browser") {
      // Libraries should be published as EcmaScript modules for tree shaking support
      // For browser targets we typically use tools like Webpack which benefit from EcmaScript modules, too.
      options.modules = false
    } else {
      // Best overall support when nothing other is applicable
      options.modules = "commonjs"
    }
  }

  console.log("- Module Settings:", options.modules === false ? "ESM" : options.modules)
  console.log("- Transpilation Compliance:", options.specMode ? "SPEC" : options.looseMode ? "LOOSE" : "DEFAULT")

  presets.push([ envPreset, {
    // Setting this to false will not transform modules.
    modules: options.modules,

    // Prefer built-ins which also prefers global polyfills which is the right thing to do
    // for most scenarios like SPAs and NodeJS environments.
    useBuiltIns: true,

    // Options to tweak the details of the implementation. If both are `false` the environment
    // preset is executed in default mode.
    loose: options.looseMode,
    spec: options.specMode,

    // Debug output of features, plugins and presets which are enabled.
    // debug: true,

    // We prefer the transpilation of the "fast-async" plugin over the
    // slower and more complex Babel internal implementation.
    exclude: [ "transform-regenerator", "transform-async-to-generator", ...additionalExcludes ],

    // Differ between development and production for our scope.
    // NodeJS is generally fine in development to match the runtime version which is currently installed.
    targets: envTargets
  }])

  // Support for React (JSX) and Flowtype
  presets.push(reactPreset)
  presets.push(flowPreset)

  // Support for new @import() syntax
  plugins.push(dynamicImportPlugin)

  // Improve some ES3 edge case to make code parseable by older clients
  // e.g. when using reserved words as keys like "catch"
  plugins.push(es3ExpressionLiterals, es3PropertyLiterals)

  // Optimization for cheery-picking from lodash, asyncjs, ramba and recompose.
  // Auto cherry-picking es2015 imports from path imports.
  // https://www.npmjs.com/package/babel-plugin-lodash
  // https://github.com/acdlite/recompose#using-babel-lodash-plugin
  plugins.push([ lodashPlugin, { id: options.optimizeModules }])

  // Supports loading files in source folder without relative folders
  // https://github.com/tleunen/babel-plugin-module-resolver
  plugins.push([ moduleResolver, {
    alias: {
      "~": resolvePath(getAppRoot(), options.sourceFolder)
    }
  }])

  // Alternative to Babel Regenerator
  // Implements the ES7 keywords async and await using syntax transformation at compile-time, rather than generators.
  // https://www.npmjs.com/package/fast-async
  plugins.push([ fastAsyncPlugin, {
    useRuntimeModule: true
  }])

  // Support for ES7 Class Properties (currently stage-2)
  // class { handleClick = () => { } }
  plugins.push(classPropertiesPlugin)

  // Support for Object Rest Spread `...` operator in objects.
  // { ...todo, completed: true }
  plugins.push([ objectRestSpreadPlugin, {
    useBuiltIns: true
  }])

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
    plugins.push([ removePropTypesPlugin, {
      removeImport: true
    }])

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
    // Just some basic minification
    comments: options.comments,
    compact: options.compact,
    minified: options.minified,

    // Enable source maps by default
    sourceMaps: true,

    // And all the previously built lists of presets and plugins
    presets,
    plugins
  }
}
