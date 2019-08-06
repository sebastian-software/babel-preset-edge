import defaults from "./defaults"
import { isProduction } from "./util"

/* eslint-disable complexity */
export default function getOptions(input = {}) {
  // These are the final options we use later on.
  const output = { ...defaults, ...input }

  // Normalize "auto"/null. Makes processing later in code better.
  if (output.target == null) {
    output.target = "auto"
  }

  if (output.transpile == null) {
    output.transpile = "auto"
  }

  if (output.env == null) {
    output.env = "auto"
  }

  if (output.minified == null) {
    output.minified = "auto"
  }

  if (output.modules == null) {
    output.modules = "auto"
  }

  // Fallback to environment variables when possible.
  if (output.env == null || output.env === "auto") {
    output.env =
      process.env.EDGE_ENV ||
      process.env.BABEL_ENV ||
      process.env.NODE_ENV ||
      "development"
  }

  if (output.target === "auto") {
    if ((/\btest\b/).test(output.env)) {
      output.target = "node"
    } else if ((/\bnode\b/).test(output.env)) {
      output.target = "node"
    } else if ((/\bbrowser\b/).test(output.env)) {
      output.target = "browser"
    } else {
      output.target = "universal"
    }
  }

  if (output.debug) {
    console.log("- Target:", output.target)
  }

  // Auto select test target when running in test environment
  if (output.transpile === "auto") {
    if ((/\btest\b/).test(output.env)) {
      output.transpile = "current"

      if (output.debug) {
        console.log("- Selecting `transpile: current` based on environment.")
      }
    } else if (output.target === "browser") {
      output.transpile = "browser"
    } else if (output.target === "node") {
      output.transpile = "node"
    } else if ((/\bmodern\b/).test(output.env)) {
      output.transpile = "modern"

      if (output.debug) {
        console.log("- Selected 'modern' transpile based on ENV")
      }
    } else if ((/\besm\b/).test(output.env)) {
      output.transpile = "esm"

      if (output.debug) {
        console.log("- Selected 'esm' transpile based on ENV")
      }
    } else if ((/\bes2015\b/).test(output.env)) {
      output.transpile = "es2015"

      if (output.debug) {
        console.log("- Selected 'es2015' transpile based on ENV")
      }
    } else {
      output.transpile = "es5"
    }
  }

  if (output.debug) {
    console.log("- Transpile:", output.transpile)
  }

  // Enforce 'cjs' for all test stuff. This is actually waiting for Jest somehow
  // supporting ESM natively which seems to be quite another story.
  // This overrides even a user defined `modules: false` inside config.
  // A pragmatic solution for now.
  // See also: https://github.com/facebook/jest/issues/4842
  if (output.env === "test") {
    output.modules = "cjs"
  }

  // Automatic detection of "modules" mode based on target
  if (output.modules === "auto") {
    if (output.target === "node" || output.env === "test") {
      output.modules = "cjs"
    } else {
      // Libraries should be published as EcmaScript modules for tree shaking support
      // For browser targets we typically use tools like Webpack, Rollup or Parcel which benefit from EcmaScript modules, too.
      output.modules = false
    }
  }

  if (output.minified === "auto") {
    output.minified = output.compression && isProduction(output)
  }

  if (output.debug) {
    console.log("Final Options:", output)
  }

  return output
}
