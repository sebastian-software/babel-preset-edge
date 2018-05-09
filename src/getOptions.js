import defaults from "./defaults"
import { isProduction } from "./util"

/* eslint-disable complexity, immutable/no-mutation */
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
  if (output.env == null) {
    output.env =
      process.env.EDGE_ENV ||
      process.env.BABEL_ENV ||
      process.env.NODE_ENV ||
      "development"
  }

  // Auto select test target when running in test environment
  if (output.transpile === "auto") {
    if (/\btest\b/.test(output.env)) {
      output.transpile = "current"

      if (output.debug) {
        console.log("- Selecting `transpile: current` based on environment.")
      }
    }
  }

  // Automatic detection of "modules" mode based on target
  if (output.modules === "auto") {
    if (output.target === "node") {
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

  return output
}
