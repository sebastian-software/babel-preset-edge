/* eslint-disable filenames/match-exported, no-console, complexity */
import browserslist from "browserslist"

import envPreset, { isPluginRequired } from "@babel/preset-env"
import getTargets from "@babel/preset-env/lib/targets-parser"
import envPlugins from "@babel/preset-env/data/plugins.json"

import options from "./options"
import shouldPrintComment from "./shouldPrintComment"

import asyncPart from "./parts/async"
import compressionPart from "./parts/compression"
import conveniencePart from "./parts/convenience"
import envPart from "./parts/env"
import importsPart from "./parts/imports"
import proposalsPart from "./parts/proposals"
import reactPart from "./parts/react"

export default function buildPreset(context, opts) {
  const options = options(opts)

  const presets = []
  const plugins = []

  // Plugin/Preset Order is important in Babel as the AST is only processed in one step.
  // If two transforms both visit the "Program" node, the transforms will run in either plugin or preset order.
  //
  // - Plugins run before Presets.
  // - Plugin ordering is first to last.
  // - Preset ordering is last to first(!).
  //
  // Official Docs: https://new.babeljs.io/docs/en/plugins.html#plugin-preset-ordering
  // See also: https://jamie.build/babel-plugin-ordering.html

  // Mainly plugins
  asyncPart(presets, plugins, options)
  conveniencePart(presets, plugins, options)
  importsPart(presets, plugins, options)
  proposalsPart(presets, plugins, options)

  // Mainly presets
  // Run env first, then react, then compression
  compressionPart(presets, plugins, options)
  reactPart(presets, plugins, options)
  envPart(presets, plugins, options)

  // Assemble final config
  return {
    // Babel basic configuration
    compact: options.minified || "auto",
    minified: options.minified,

    // Whether to enable source maps
    sourceMaps: options.sourceMaps,

    // Fine tune comment output
    shouldPrintComment,

    // Add lists of presets and plugins
    presets,
    plugins
  }
}
