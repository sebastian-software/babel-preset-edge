/* eslint-disable filenames/match-exported */
import { get as getAppRoot } from "app-root-dir"
import { resolve as resolvePath } from "path"
import browserslist from "browserslist"

import envPreset from "babel-preset-env"
import flowPreset from "babel-preset-flow"

import dynamicImportSyntaxPlugin from "babel-plugin-syntax-dynamic-import"
import dynamicImportNode from "babel-plugin-dynamic-import-node"
import dynamicImportWebpack from "babel-plugin-dynamic-import-webpack"

import moduleResolver from "babel-plugin-module-resolver"
import fastAsyncPlugin from "babel-plugin-fast-async"
import classPropertiesPlugin from "babel-plugin-transform-class-properties"
import objectRestSpreadPlugin from "babel-plugin-transform-object-rest-spread"
import lodashPlugin from "babel-plugin-lodash"
import transformRuntimePlugin from "babel-plugin-transform-runtime"

import es3PropertyLiterals from "babel-plugin-transform-es3-property-literals"
import es3ExpressionLiterals from "babel-plugin-transform-es3-member-expression-literals"

import parseJSX from "babel-plugin-syntax-jsx"
import transformReactJSX from "babel-plugin-transform-react-jsx"
import transformReactJSXSource from "babel-plugin-transform-react-jsx-source"
import transformReactJSXSelf from "babel-plugin-transform-react-jsx-self"
import transformRemovePropTypes from "babel-plugin-transform-react-remove-prop-types"
import reactIntlPlugin from "babel-plugin-react-intl"
import reactInlineElementsPlugin from "babel-plugin-transform-react-inline-elements"
import reactConstantElements from "babel-plugin-transform-react-constant-elements"

const defaults = {
  // Whether to print hints on transpilation settings which were selected.
  debug: false,

  // One of the following:
  // - "node"/nodejs"/"script"/"binary": any NodeJS related execution with wide support to last LTS aka 6.9.0
  // - "current"/"test": current NodeJS version
  // - "browser"/"web": browsers as defined by browserslist
  // - "library": ideally used for publishing libraries e.g. on NPM
  // - "es2015": same as "library" but targets es2o15 capable engines only.
  // - {}: any custom settings support by Env-Preset
  target: "nodejs",

  // Choose environment based on environment variables ... or override with custom value here.
  env: "auto",

  // Choose automatically depending on target
  modules: "auto",

  // Prefer built-ins over custom code. This mainly benefits for modern engines.
  useBuiltIns: true,

  // JSX Pragma. Default: Use React
  jsxPragma: "React.createElement",

  // Env Settings
  looseMode: true,
  specMode: false,

  // Lodash Plugin Settings
  optimizeModules: [ "lodash", "async", "rambda", "recompose" ],

  // Configuration for module lookup
  sourceFolder: "src",

  // Source map output
  sourceMaps: true,

  // Babel Core Settings
  comments: false,
  minified: true
}

export default function buildPreset(context, opts = {}) {
  const presets = []
  const plugins = []

  // These are the final options we use later on.
  const options = { ...defaults, ...opts }

  // Reset environment value when configured as "auto"
  if (opts.env === "auto") {
    opts.env = null
  }

  // There is also a BROWSERSLIST_ENV
  const envValue = opts.env || process.env.BABEL_ENV || process.env.NODE_ENV || "development"
  const isProduction = envValue === "production"

  if (options.debug) {
    console.log("- Environment:", envValue)
  }

  // Auto select test target when running in test environment and no other info is available.
  if (envValue === "test" && options.target == null) {
    options.target = "test"
  }

  let envTargets = {}

  let buildDistBinary =
    options.target === "node" ||
    options.target === "nodejs" ||
    options.target === "script" ||
    options.target === "binary"
  let buildForCurrent = options.target === "current" || options.target === "test"
  let buildForBrowserList = options.target === "browser" || options.target === "web"
  let buildAsLibrary = options.target === "library" || options.target === "es2015"
  let buildCustom = typeof options.target === "object"

  if (buildDistBinary) {
    // Last stable NodeJS (LTS) - first LTS of 6.x.x was 6.9.0
    // See also: https://nodejs.org/en/blog/release/v6.9.0/
    envTargets.node = "6.9.0"
  } else if (buildForCurrent) {
    // Scripts which are directly used like tests can be transpiled for the current NodeJS version
    envTargets.node = "current"
  } else if (buildForBrowserList) {
    // Until this issue is fixed we can't use auto config detection for browserslist in babel-preset-env
    // https://github.com/babel/babel-preset-env/issues/149
    // What we do here is actually pretty clever/ytupid as we just pass over the already normalized
    // browser list to browserslist again.
    const autoBrowsers = browserslist(null, { env: isProduction ? "production" : "development" })

    // For the abstract browsers config we let browserslist find the config file
    envTargets.browsers = autoBrowsers
  } else if (buildAsLibrary) {
    // Explicit undefined results into compilation with "latest" preset supporting a wide range of clients via ES5 output
    envTargets = undefined
  } else if (buildCustom) {
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

      // This is already excluded by default
      // "transform-regenerator"
    )
  }

  if (options.debug) {
    if (options.target === "es2015") {
      console.log("- Environment Targets: ES2015 capable")
    } else {
      console.log("- Environment Targets:", envTargets)
    }
  }

  if (options.modules === "auto" || options.modules == null) {
    if (buildForCurrent || buildDistBinary) {
      options.modules = "commonjs"
    } else if (buildAsLibrary || buildForBrowserList) {
      // Libraries should be published as EcmaScript modules for tree shaking support
      // For browser targets we typically use tools like Webpack which benefit from EcmaScript modules, too.
      options.modules = false
    } else {
      // Best overall support when nothing other is applicable
      options.modules = "commonjs"
    }
  }

  if (options.debug) {
    console.log("- Module Settings:", options.modules === false ? "ESM" : options.modules)
    console.log(
      "- Transpilation Compliance:",
      options.specMode ? "SPEC" : options.looseMode ? "LOOSE" : "DEFAULT"
    )
  }

  presets.push([
    envPreset,
    {
      // Setting this to false will not transform modules.
      modules: options.modules,

      // Prefer built-ins which also prefers global polyfills which is the right thing to do
      // for most scenarios like SPAs and NodeJS environments.
      useBuiltIns: options.useBuiltIns,

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
    }
  ])

  // Support for Flowtype Parsing
  presets.push(flowPreset)

  // Support for new @import() syntax
  plugins.push(dynamicImportSyntaxPlugin)

  // Transpile the parsed import() syntax for compatibility in older environments.
  if (buildForCurrent || buildDistBinary) {
    if (options.debug) {
      console.log("- Rewriting import() for NodeJS usage.")
    }

    // Compiles import() to a deferred require() for NodeJS
    plugins.push(dynamicImportNode)
  } else if (buildAsLibrary || buildCustom) {
    if (options.debug) {
      console.log("- Rewriting import() for Webpack usage.")
    }

    // This is our alternative appeoach for now which "protects" these imports from Rollup
    // for usage in Webpack later on. In detail it transpiles `import()` to `require.ensure()` before
    // it reaches RollupJS's bundling engine.
    // https://github.com/airbnb/babel-plugin-dynamic-import-webpack
    plugins.push(dynamicImportWebpack)
  } else {
    if (options.debug) {
      console.log("- Keeping import() statement as is.")
    }
  }

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

  // Alternative to Babel Regenerator
  // Implements the ES7 keywords async and await using syntax transformation at compile-time, rather than generators.
  // https://www.npmjs.com/package/fast-async
  plugins.push([
    fastAsyncPlugin,
    {
      useRuntimeModule: true
    }
  ])

  // Support for ES7 Class Properties (currently stage-2)
  // class { handleClick = () => { } }
  plugins.push(classPropertiesPlugin)

  // Support for Object Rest Spread `...` operator in objects.
  // { ...todo, completed: true }
  plugins.push([
    objectRestSpreadPlugin,
    {
      useBuiltIns: options.useBuiltIns
    }
  ])

  // Allow Babel to parse JSX
  plugins.push(parseJSX)

  // Transform JSX and prefer built-in methods
  plugins.push([
    transformReactJSX,
    {
      useBuiltIns: options.useBuiltIns,
      pragma: options.jsxPragma
    }
  ])

  // The following two plugins are currently necessary to make React warnings
  // include more valuable information. They are included here because they are
  // currently not enabled in babel-preset-react. See the below threads for more info:
  // https://github.com/babel/babel/issues/4702
  // https://github.com/babel/babel/pull/3540#issuecomment-228673661
  // https://github.com/facebookincubator/create-react-app/issues/989
  if (!isProduction) {
    // Adds component stack to warning messages
    // Note: Currently throws an error when activated
    plugins.push(transformReactJSXSource)

    // Adds __self attribute to JSX which React will use for some warnings
    plugins.push(transformReactJSXSelf)
  }

  if (isProduction) {
    // Remove unnecessary React propTypes from the production build.
    // https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types
    plugins.push([
      transformRemovePropTypes,
      {
        mode: "remove",
        removeImport: true
      }
    ])

    // Cleanup descriptions for translations from compilation output
    plugins.push(reactIntlPlugin)

    // Replaces the React.createElement function with one that is
    // more optimized for production.
    // NOTE: Symbol needs to be polyfilled.
    // https://babeljs.io/docs/plugins/transform-react-inline-elements/
    plugins.push(reactInlineElementsPlugin)

    // Hoists element creation to the top level for subtrees that
    // are fully static, which reduces call to React.createElement
    // and the resulting allocations. More importantly, it tells
    // React that the subtree hasn’t changed so React can completely
    // skip it when reconciling.
    // https://babeljs.io/docs/plugins/transform-react-constant-elements/
    plugins.push(reactConstantElements)
  }

  // Use helpers, but not polyfills, in a way that omits duplication.
  // For polyfills better use polyfill.io or another more sophisticated solution.
  plugins.push([
    transformRuntimePlugin,
    {
      helpers: true,
      regenerator: false,
      polyfill: false,
      useBuiltIns: options.useBuiltIns,
      useESModules: options.modules === false
    }
  ])

  // Assemble final config
  return {
    // Babel basic configuration
    comments: options.comments,
    compact: true,
    minified: options.minified,

    // Whether to enable source maps
    sourceMaps: options.sourceMaps,

    // And all the previously built lists of presets and plugins
    presets,
    plugins
  }
}
