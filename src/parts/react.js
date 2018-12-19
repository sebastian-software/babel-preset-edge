import reactConstantElements from "@babel/plugin-transform-react-constant-elements"

import reactInlineElementsPlugin from "@babel/plugin-transform-react-inline-elements"
import reactIntlPlugin from "babel-plugin-react-intl"

import reactPreset from "@babel/preset-react"
import transformRemovePropTypes from "babel-plugin-transform-react-remove-prop-types"

import { isDevelopment, isProduction } from "../util"

export default function react(presets, plugins, options) {
  // Transform JSX and prefer built-in methods
  presets.push([
    reactPreset,
    {
      useBuiltIns: true,
      pragma: options.jsxPragma,
      pragmaFrag: options.jsxPragmaFrag,
      development: isDevelopment(options)
    }
  ])

  if (isProduction(options)) {
    // Remove unnecessary React propTypes from the production build.
    // https://github.com/oliviertassinari/babel-plugin-transform-react-remove-prop-types
    plugins.push([
      transformRemovePropTypes,
      {
        mode: "remove",
        removeImport: true
      }
    ])

    // Cleanup descriptions for translations from compilation output
    plugins.push(reactIntlPlugin)

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
