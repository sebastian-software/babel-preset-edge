/* eslint-disable filenames/match-exported, no-console, complexity */
import { get as getAppRoot } from "app-root-dir"
import { resolve as resolvePath } from "path"
import browserslist from "browserslist"

import envPreset, { isPluginRequired } from "@babel/preset-env"
import getTargets from "@babel/preset-env/lib/targets-parser"
import envPlugins from "@babel/preset-env/data/plugins.json"

import flowPreset from "@babel/preset-flow"

import classPropertiesPlugin from "@babel/plugin-proposal-class-properties"
import objectRestSpreadPlugin from "@babel/plugin-proposal-object-rest-spread"

import transformRuntimePlugin from "@babel/plugin-transform-runtime"

import es3PropertyLiterals from "@babel/plugin-transform-property-literals"
import es3ExpressionLiterals from "@babel/plugin-transform-member-expression-literals"

import parseJSX from "@babel/plugin-syntax-jsx"
import transformReactJSX from "@babel/plugin-transform-react-jsx"
// import transformReactJSXSource from "@babel/plugin-transform-react-jsx-source"
import transformReactJSXSelf from "@babel/plugin-transform-react-jsx-self"

import reactInlineElementsPlugin from "@babel/plugin-transform-react-inline-elements"
import reactConstantElements from "@babel/plugin-transform-react-constant-elements"

import minifyPreset from "babel-preset-minify"

import deadCodeEliminationPlugin from "babel-plugin-minify-dead-code-elimination"

import dynamicImportSyntaxPlugin from "babel-plugin-syntax-dynamic-import"
import dynamicImportRollupNode from "babel-plugin-dynamic-import-node"
import dynamicImportComponent from "react-imported-component/babel"

import moduleResolver from "babel-plugin-module-resolver"

import lodashPlugin from "babel-plugin-lodash"

import transformRemovePropTypes from "babel-plugin-transform-react-remove-prop-types"
import reactIntlPlugin from "babel-plugin-react-intl"

import fastAsyncPlugin from "fast-async"

const defaults = {
  // Whether to print hints on transpilation settings which were selected.
  debug: false,

  // One of the following:
  // - "auto": Automatically determine runtime and environment variables for deciding on which target to use.
  // - "library": Ideally used for publishing libraries e.g. on NPM [Browsers + NodeJS]
  // - "es2015": Like "library, but explicitely disables all ES2015 transforms. [Browsers + NodeJS]
  // - "modern": Like "library, but only transpiles features requires by modern browsers (see docs) [Browsers + NodeJS]
  // - "node"/"cli"/"script"/"binary": any NodeJS related execution with wide support (currently Node v6 LTS)
  // - "node6": identical to the previous option as long as v6 is more widely used - will force v6 when used afterwards.
  // - "node8": identical to the previous option but enforce target Node v8 LTS instead of v6 LTS
  // - "node10": identical to the previous option but enforce target Node v10 instead of v6 LTS
  // - "current"/"test": current NodeJS version
  // - "browser"/"web": browsers as defined by browserslist config
  // - {}: any custom settings support by Env-Preset
  target: "auto",

  // Choose environment based on environment variables ... or override with custom value here.
  env: "auto",

  // Choose automatically depending on target or use one of these for full control:
  // - "cjs": Transpile module imports to commonjs
  // - false: Keep module imports as is (e.g. protecting ESM for optiomal usage with Webpack/Rollup)
  // - "auto": Automatic selection based on target.
  modules: "auto",

  // Choose automatically depending on target by default or use one of these for full control:
  // - "node": For usage in NodeJS (e.g. produce binaries).
  // - "component": Wraps imports into a helper for dealing with async components.
  // - "auto": Automatically choose best behavior
  imports: "auto",

  // Prefer built-ins over custom code. This mainly benefits for modern engines.
  // As we are using the new "usage" mode for `preset-env` we automatically include
  // all polyfills required by the generated code.
  useBuiltIns: true,

  // JSX Pragma. Default: Use React
  jsxPragma: "React.createElement",

  // Async settings: Either `"promises"` or `null`
  rewriteAsync: "promises",

  // Transpilation Settings: We default on a loose transpilation which is efficient
  // but not overly compliant. If you experience issues it might be better to
  // switch `looseMode` off. `specMode` on the other hand might produce
  // 100% correct code, but tend to be large and slower as well.
  looseMode: true,
  specMode: false,

  // Lodash Plugin Settings
  optimizeModules: [ "lodash", "async", "rambda", "recompose" ],

  // Configuration for module lookup
  sourceFolder: "src",

  // Whether to enable source map output
  sourceMaps: true,

  // Enable full compression on production scripts or basic compression for libraries or during development.
  compression: true,

  // Do not apply general minification by default
  minified: false
}

const modernTarget = {
  node: "8.9.0",
  electron: "1.8",
  browsers: [
    "Safari >= 11.1",
    "iOS >= 11.3",
    "Edge >= 16",
    "Chrome >= 64",
    "ChromeAndroid >= 64",
    "Firefox >= 58"
  ]
}

export default function buildPreset(context, opts = {}) {
  const presets = []
  const plugins = []

  // These are the final options we use later on.
  const options = { ...defaults, ...opts }

  // Reset environment/target value when configured as "auto"
  if (options.target === "auto") {
    options.target = null
  }

  if (options.env === "auto") {
    options.env = null
  }

  // There is also a BROWSERSLIST_ENV
  const envValue =
    options.env || process.env.BABEL_ENV || process.env.NODE_ENV || "development"

  const hasProductionEnv = (/\bproduction\b/).test(envValue)
  const hasDevelopmentEnv = (/\bdevelopment\b/).test(envValue)
  const hasTestEnv = (/\btest\b/).test(envValue)

  if (options.debug) {
    console.log("- Environment:", envValue)
    console.log("- Is Development:", hasDevelopmentEnv)
    console.log("- Is Production:", hasProductionEnv)
    console.log("- Is Test:", hasTestEnv)
  }

  // Auto select test target when running in test environment
  if (options.target == null) {
    if (hasTestEnv) {
      options.target = "test"

      if (options.debug) {
        console.log("- Selecting \"test\" target based on environment.")
      }
    }
  }

  // Check for which major targets we are building
  const supportBrowsersAndNode = /auto|library|es2015|modern/.exec(options.target)
  const supportBrowsers = supportBrowsersAndNode || /browser|web/.exec(options.target)
  const supportNode = supportBrowsersAndNode || /node|node6|node8|node10|cli|script|binary|current|test/.exec(options.target)

  // Separate build targets
  const buildDistBinary =
    options.target === "node" ||
    options.target === "node6" ||
    options.target === "node8" ||
    options.target === "node10" ||
    options.target === "cli" ||
    options.target === "script" ||
    options.target === "binary"
  const buildForCurrent = options.target === "current" || options.target === "test"
  const buildForBrowsersList = options.target === "browser" || options.target === "web"
  const buildAsLibrary =
    options.target === "auto" ||
    options.target === "library" ||
    options.target === "es2015" ||
    options.target === "modern"
  const buildCustom = options.target != null && typeof options.target === "object"

  let envTargets = {}

  if (buildDistBinary) {
    // Widely used stable NodeJS (LTS) is v6.9.0
    // See also: https://nodejs.org/en/blog/release/v6.9.0/
    // Newest LTS is v8.9.0 https://nodejs.org/en/blog/release/v8.9.0/
    // You can choose the modern version by setting `target` to "node8".
    // We also have support for even more modern Node v10 which did not yet reached LTS.
    envTargets.node = options.target === "node8" ? "8.9.0" : options.target === "node10" ? "10.0.0" : "6.9.0"
    envTargets.browsers = []
  } else if (buildForCurrent) {
    // Scripts which are directly used like tests can be transpiled for the current NodeJS version
    envTargets.node = "current"
    envTargets.browsers = []
  } else if (buildForBrowsersList) {
    // What we do here is actually pretty clever/stupid as we just use browserslist
    // itself to query its configuration and pass over that data again to babel-preset-env
    // for passing it to browserslist internally. Yeah.
    const autoBrowsers = browserslist(null, {
      env: process.env.BROWSERSLIST_ENV || hasProductionEnv ? "production" : "development"
    })

    // For the abstract browsers config we let browserslist find the config file
    envTargets.browsers = autoBrowsers
  } else if (buildAsLibrary) {
    if (options.target === "modern") {
      envTargets = modernTarget
    } else {
      // Explicit undefined results into compilation with "latest" preset supporting a wide range of clients via ES5 output
      // For ignoring any existing browserslist config we have to pass over an empty array.
      envTargets.browsers = []
    }
  } else if (buildCustom) {
    envTargets = options.target
  }

  const additionalExcludes = []

  // Exclude all es2015 features which are supported by the default es2015 babel preset.
  // This targets all es2015-capable browsers and engines.
  if (options.target === "es2015") {
    additionalExcludes.push(
      "transform-template-literals",
      "transform-literals",
      "transform-function-name",
      "transform-arrow-functions",
      "transform-block-scoped-functions",
      "transform-classes",
      "transform-object-super",
      "transform-shorthand-properties",
      "transform-duplicate-keys",
      "transform-computed-properties",
      "transform-for-of",
      "transform-sticky-regex",
      "transform-unicode-regex",
      "transform-spread",
      "transform-parameters",
      "transform-destructuring",
      "transform-block-scoping",
      "transform-typeof-symbol",
      "transform-modules-commonjs",
      "transform-modules-systemjs",
      "transform-modules-amd",
      "transform-modules-umd"

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

  // Automatic detection of "modules" mode based on target
  if (options.modules == null || options.modules === "auto") {
    if (buildForCurrent) {
      options.modules = "cjs"
    } else {
      // Libraries should be published as EcmaScript modules for tree shaking support
      // For browser targets we typically use tools like Webpack, Rollup or Parcel which benefit from EcmaScript modules, too.
      options.modules = false
    }
  }

  if (options.imports === "auto") {
    if (buildDistBinary || buildForCurrent) {
      options.imports = "node"
    } else if (buildForBrowsersList) {
      options.imports = "component"
    }
  }

  // Directly ask babel-preset-env whether we want to use transform-async
  // based on currently configured targets. Only if that's the case we
  // transform our async/await code. Otherwise we assume it works without
  // any transpilation.
  const requiresAsync = isPluginRequired(
    getTargets(envTargets),
    envPlugins["transform-async-to-generator"]
  )
  if (!requiresAsync) {
    options.rewriteAsync = null
  }

  const envSupportsES6 =
    options.target === "es2015" ||
    !isPluginRequired(
      getTargets(envTargets),
      envPlugins["transform-arrow-functions"]
    )

  if (options.debug) {
    /* eslint-disable no-nested-ternary */
    console.log("- Module Settings:", options.modules === false ? "ESM" : options.modules)
    console.log(
      "- Transpilation Compliance:",
      options.specMode ? "SPEC" : options.looseMode ? "LOOSE" : "DEFAULT"
    )
    console.log("- Async Transpilation:", options.rewriteAsync)
  }

  // Alternative to Babel Regenerator
  // Implements the ES7 keywords async and await using syntax transformation
  // to at Promises at compile-time, rather than using generators.
  // https://github.com/babel/babel/pull/7076 (NEW: bundled plugin with Babel)
  // https://www.npmjs.com/package/fast-async (OLD: separate Babel plugin)
  if (options.rewriteAsync === "promises") {
    plugins.push(fastAsyncPlugin)
  }

  // Use basic compression for development/bundling and full compression for production output.
  if (options.compression) {
    if (hasProductionEnv) {
      presets.push(minifyPreset)
    } else {
      presets.push([
        minifyPreset,
        {
          booleans: false,
          infinity: false,
          mangle: false,
          flipComparisons: false,
          simplify: false,
          keepFnName: true
        }
      ])
    }
  }

  presets.push([
    envPreset,
    {
      // Setting this to false will not transform modules.
      modules: options.modules,

      // Prefer built-ins which also prefers global polyfills which is the right thing to do
      // for most scenarios like SPAs and NodeJS environments.
      useBuiltIns: options.useBuiltIns ? "usage" : false,

      // Options to tweak the details of the implementation. If both are `false` the environment
      // preset is executed in default mode.
      loose: options.looseMode,
      spec: options.specMode,

      // Debug output of features, plugins and presets which are enabled.
      // debug: true,

      // We prefer the transpilation of the "fast-async" plugin over the
      // slower and more complex Babel internal implementation.
      exclude: [
        "transform-regenerator",
        "transform-async-to-generator",
        ...additionalExcludes
      ],

      // Differ between development and production for our scope.
      // NodeJS is generally fine in development to match the runtime version which is currently installed.
      targets: envTargets
    }
  ])

  // Support for Flowtype Parsing
  presets.push(flowPreset)

  // Support for new @import() syntax
  plugins.push(dynamicImportSyntaxPlugin)

  // Transpile the parsed import() syntax for compatibility or extended features.
  if (options.imports === "node") {
    if (options.debug) {
      console.log("- Rewriting import() for Rollup bundling targeting NodeJS.")
    }

    // Compiles import() to a deferred require() for NodeJS
    plugins.push(dynamicImportRollupNode)
  } else if (options.imports === "component") {
    if (options.debug) {
      console.log("- Rewriting import() for Rollup bundling targeting NodeJS.")
    }

    // Support for enhanced imported components
    plugins.push(dynamicImportComponent)
  } else {
    if (options.debug) {
      console.log("- Keeping import() statement as is.")
    }
  }

  // Improve some ES3 edge case to make code parseable by older clients
  // e.g. when using reserved words as keys like "catch"
  // Does not work together with compression as the preset changes the code
  // back again.
  if (options.compression === false) {
    plugins.push(es3ExpressionLiterals, es3PropertyLiterals)
  }

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

  // Even when no compression is enabled, it makes sense to remove
  // and code paths which are clearly never executed.
  if (!options.compression) {
    plugins.push(deadCodeEliminationPlugin)
  }

  // The following two plugins are currently necessary to make React warnings
  // include more valuable information. They are included here because they are
  // currently not enabled in babel-preset-react. See the below threads for more info:
  // https://github.com/babel/babel/issues/4702
  // https://github.com/babel/babel/pull/3540#issuecomment-228673661
  // https://github.com/facebookincubator/create-react-app/issues/989
  if (!hasProductionEnv) {
    // Adds component stack to warning messages
    // Increases sizes in JSX rich areas quite a bit.
    // // plugins.push(transformReactJSXSource)

    // Adds __self attribute to JSX which React will use for some warnings
    plugins.push(transformReactJSXSelf)
  }

  if (hasProductionEnv) {
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
    // Fine tune comment output
    shouldPrintComment: function (comment) {
      // Keep pure function markers which are generated by some plugins
      // See sideEffects option: https://github.com/mishoo/UglifyJS2
      if (/[#@]__PURE__/.exec(comment)) {
        return true
      }

      // Keep JSON5 magic comments for Webpack instructions
      if (/^\s?webpack[A-Z][A-Za-z]+\:/.exec(comment)) {
        return true
      }

      return false
    },

    // Babel basic configuration
    compact: options.minified ? true : "auto",
    minified: options.minified,

    // Whether to enable source maps
    sourceMaps: options.sourceMaps,

    // And all the previously built lists of presets and plugins
    presets,
    plugins
  }
}
