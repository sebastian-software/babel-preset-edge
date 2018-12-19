import requireContext from "babel-plugin-require-context-hook"
import rollupNode from "babel-plugin-dynamic-import-node"
import serverRendering from "@loadable/babel-plugin"
import smartWebpack from "babel-plugin-smart-webpack-import"
import syntaxPlugin from "@babel/plugin-syntax-dynamic-import"

import { isTest } from "../util"

export default function imports(presets, plugins, options) {
  // Support for require.context in Non-Webpack-Environments like Jest or NodeJS
  if (isTest(options) || options.target === "node") {
    plugins.push(requireContext)
  }

  // Support for new @import() syntax
  plugins.push(syntaxPlugin)

  // Automatically add chunk names to imports() (for Webpack usage)
  plugins.push(smartWebpack)

  // Support for enhanced imported components with SSR support
  plugins.push(serverRendering)

  // Transpile the parsed import() syntax for compatibility or extended features.
  if (options.imports === "node") {
    if (options.debug) {
      console.log("- Rewriting import() for NodeJS.")
    }

    // Compiles import() to a deferred require() for NodeJS
    plugins.push(rollupNode)
  } else {
    if (options.debug) {
      console.log("- Keeping import() statement as is.")
    }
  }
}
