import reactConstantElements from "@babel/plugin-transform-react-constant-elements"
import reactInlineElementsPlugin from "@babel/plugin-transform-react-inline-elements"
import reactPreset from "@babel/preset-react"

import { isDevelopment, isProduction } from "../util"

export default function react(presets, plugins, options) {
  // Transform JSX and prefer built-in methods
  presets.push([
    reactPreset,
    {
      corejs: 3,
      useBuiltIns: true,
      pragma: options.jsxPragma,
      pragmaFrag: options.jsxPragmaFrag,
      development: isDevelopment(options)
    }
  ])

  if (isProduction(options)) {
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
}
