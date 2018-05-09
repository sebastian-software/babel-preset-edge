import browserslist from "browserslist"
import envPreset from "@babel/preset-env"
import transformRuntimePlugin from "@babel/plugin-transform-runtime"

import modernTarget from "../modernTarget"
import { isProduction } from "../util"

function getEnvTargets(options) {
  /* eslint-disable immutable/no-mutation */
  let envTargets = {}

  if (buildDistBinary) {
    // Widely used stable NodeJS (LTS) is v6.9.0
    // See also: https://nodejs.org/en/blog/release/v6.9.0/
    // Newest LTS is v8.9.0 https://nodejs.org/en/blog/release/v8.9.0/
    // You can choose the modern version by setting `target` to "node8".
    // We also have support for even more modern Node v10 which did not yet reached LTS.
    envTargets.node =
      options.target === "node8" ?
        "8.9.0" :
        options.target === "node10" ?
          "10.0.0" :
          "6.9.0"
    envTargets.browsers = []
  } else if (options.transpile === "current") {
    // Scripts which are directly used like tests can be transpiled for the current NodeJS version
    envTargets.node = "current"
    envTargets.browsers = []
  } else if (options.transpile === "browser") {
    // What we do here is actually pretty clever/stupid as we just use browserslist
    // itself to query its configuration and pass over that data again to babel-preset-env
    // for passing it to browserslist internally. Yeah.
    envTargets.node = null
    envTargets.browsers = browserslist(null, {
      env:
        process.env.BROWSERSLIST_ENV || isProduction(env) ?
          "production" :
          "development"
    })
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

  return envTargets
}

export default function env(presets, plugins, options) {
  const excludes = []

  excludes.push("transform-regenerator", "transform-async-to-generator")

  // Exclude all es2015 features which are supported by the default es2015 babel preset.
  // This targets all es2015-capable browsers and engines.
  if (options.target === "es2015") {
    excludes.push(
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
      "transform-typeof-symbol"

      // These are not really features to transpile down
      // "transform-modules-commonjs",
      // "transform-modules-systemjs",
      // "transform-modules-amd",
      // "transform-modules-umd"

      // This is already excluded by default
      // "transform-regenerator"
    )
  }

  presets.push([
    envPreset,
    {
      // Setting this to false will not transform modules.
      modules: options.modules,

      // Prefer built-ins which also prefers global polyfills which is the right thing to do
      // for most scenarios like SPAs and NodeJS environments.
      useBuiltIns: "usage",

      // Options to tweak the details of the implementation. If both are `false` the environment
      // preset is executed in default mode.
      loose: options.looseMode,
      spec: options.specMode,

      // Debug output of features, plugins and presets which are enabled.
      debug: options.debug,

      // We prefer the transpilation of the "fast-async" plugin over the
      // slower and more complex Babel internal implementation.
      exclude,

      // Differ between development and production for our scope.
      // NodeJS is generally fine in development to match the runtime version which is currently installed.
      targets: envTargets
    }
  ])

  // Use helpers, but not polyfills, in a way that omits duplication.
  // For polyfills better use polyfill.io or another more sophisticated solution.
  plugins.push([
    transformRuntimePlugin,
    {
      helpers: true,
      regenerator: false,
      polyfill: false,
      useBuiltIns: true,
      useESModules: options.modules === false
    }
  ])

  if (options.debug) {
    /* eslint-disable no-nested-ternary */
    console.log("- Module Settings:", options.modules === false ? "ESM" : options.modules)
    console.log(
      "- Transpilation Compliance:",
      options.specMode ? "SPEC" : options.looseMode ? "LOOSE" : "DEFAULT"
    )
  }
}
