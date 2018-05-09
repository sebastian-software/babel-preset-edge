import minifyPreset from "babel-preset-minify"
import deadCodeEliminationPlugin from "babel-plugin-minify-dead-code-elimination"

export default function register(presets, plugins, options) {
  // Use basic compression for development/bundling and full compression for production output.
  if (options.compression) {
    if (hasProductionEnv) {
      presets.push(minifyPreset)

      if (options.debug) {
        console.log("- Output: Minified")
      }
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

      if (options.debug) {
        console.log("- Output: Compressed")
      }
    }
  }

  // Even when no compression is enabled, it makes sense to remove
  // and code paths which are clearly never executed.
  else {
    plugins.push(deadCodeEliminationPlugin)

    if (options.debug) {
      console.log("- Output: Cleanup")
    }
  }
}
