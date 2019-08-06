import minifyPreset from "babel-preset-minify"
import { isProduction } from "../util"

const allDisabled = {
  booleans: false,
  builtIns: false,
  consecutiveAdds: false,
  deadcode: false,
  evaluate: false,
  flipComparisons: false,
  guards: false,
  infinity: false,
  mangle: false,
  memberExpressions: false,
  mergeVars: false,
  numericLiterals: false,
  propertyLiterals: false,
  regexpConstructors: false,
  removeUndefined: false,
  replace: false,
  simplify: false,
  simplifyComparisons: false,
  typeConstructors: false,
  undefinedToVoid: false
}

const mediumCompression = {
  // Based on a black list of too agressive plugins/settings

  // Settings
  keepFnName: true,
  keepClassName: true,

  // Disable Agressive Plugins
  builtIns: false,
  booleans: false,
  evaluate: false,
  infinity: false,
  mangle: false,
  flipComparisons: false,
  simplify: false
}

const lowCompression = {
  // Based on a white list
  // All disabled + a few things enabled
  ...allDisabled,

  // Settings
  keepFnName: true,
  keepClassName: true,

  // Enable only very basic plugins
  deadcode: true,
  guards: true,
  memberExpressions: true,
  propertyLiterals: true,
  regexpConstructors: true,
  removeUndefined: true,
  simplifyComparisons: true,
  typeConstructors: true
}

export default function compression(presets, plugins, options) {
  // Use basic compression for development/bundling and full compression for production output.
  if (options.compression) {
    if (isProduction(options)) {
      presets.push(minifyPreset)

      if (options.debug) {
        console.log("- Output: Full Minification")
      }
    } else {
      presets.push([ minifyPreset, mediumCompression ])

      if (options.debug) {
        console.log("- Output: Medium Compression")
      }
    }
  }

  // Even when no compression is enabled, it makes sense to remove
  // and code paths which are clearly never executed.
  else {
    presets.push([ minifyPreset, lowCompression ])

    if (options.debug) {
      console.log("- Output: Low Compression")
    }
  }
}
