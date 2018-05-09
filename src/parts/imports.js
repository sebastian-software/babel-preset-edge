import dynamicImportSyntaxPlugin from "babel-plugin-syntax-dynamic-import"
import dynamicImportRollupNode from "babel-plugin-dynamic-import-node"
import dynamicImportComponent from "react-imported-component/babel"

export function register(presets, plugins, options) {
  // Support for new @import() syntax
  plugins.push(dynamicImportSyntaxPlugin)

  // Transpile the parsed import() syntax for compatibility or extended features.
  if (options.imports === "node") {
    if (options.debug) {
      console.log("- Rewriting import() for Rollup bundling targeting NodeJS.")
    }

    // Compiles import() to a deferred require() for NodeJS
    plugins.push(dynamicImportRollupNode)
  } else if (options.imports === "ssr") {
    if (options.debug) {
      console.log("- Rewriting import() for universal applications.")
    }

    // Support for enhanced imported components
    plugins.push(dynamicImportComponent)
  } else {
    if (options.debug) {
      console.log("- Keeping import() statement as is.")
    }
  }
}
