import defaults from "./defaults"

export default function normalize(opts = {}) {
  // These are the final options we use later on.
  const options = { ...defaults, ...opts }

  // Normalize "auto"/null. Makes processing later in code better.
  if (options.target == null) {
    options.target = "auto"
  }

  if (options.transpile == null) {
    options.transpile = "auto"
  }

  if (options.env == null) {
    options.env = "auto"
  }

  if (options.minified == null) {
    options.minified = "auto"
  }

  if (options.modules == null) {
    options.modules = "auto"
  }



  // Fallback to environment variables when possible.
  if (options.env == null) {
    options.env = process.env.EDGE_ENV || process.env.BABEL_ENV || process.env.NODE_ENV || "development"
  }

  // Auto select test target when running in test environment
  if (options.transpile === "auto") {
    if ((/\btest\b/).test(options.env)) {
      options.transpile = "current"

      if (options.debug) {
        console.log("- Selecting `transpile: current` based on environment.")
      }
    }
  }

  // Automatic detection of "modules" mode based on target
  if (options.modules === "auto") {
    if (options.target === "node") {
      options.modules = "cjs"
    } else {
      // Libraries should be published as EcmaScript modules for tree shaking support
      // For browser targets we typically use tools like Webpack, Rollup or Parcel which benefit from EcmaScript modules, too.
      options.modules = false
    }
  }

  if (options.minified == "auto") {
    options.minified = options.compression && hasProductionEnv
  }
}
