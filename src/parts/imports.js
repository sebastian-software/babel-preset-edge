import dynamicImportSyntaxPlugin from "babel-plugin-syntax-dynamic-import"
import dynamicImportRollupNode from "babel-plugin-dynamic-import-node"
import dynamicImportServerRendering from "loadable-components/babel"

export default function imports(presets, plugins, options) {
  // Support for new @import() syntax
  plugins.push(dynamicImportSyntaxPlugin)

  // Support for enhanced imported components with SSR support
  plugins.push(dynamicImportServerRendering)

  // Transpile the parsed import() syntax for compatibility or extended features.
  if (options.imports === "node") {
    if (options.debug) {
      console.log("- Rewriting import() for Rollup bundling targeting NodeJS.")
    }

    // Compiles import() to a deferred require() for NodeJS
    plugins.push(dynamicImportRollupNode)
  } else {
    if (options.debug) {
      console.log("- Keeping import() statement as is.")
    }
  }
}
