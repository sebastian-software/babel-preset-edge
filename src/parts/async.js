import envPlugins from "@babel/preset-env/data/plugins.json"
import fastAsyncPlugin from "fast-async"
import getTargets from "@babel/preset-env/lib/targets-parser"
import { isPluginRequired } from "@babel/preset-env"

import getEnvTargets from "../getEnvTargets"

export default function async(presets, plugins, options) {
  /* eslint-disable immutable/no-mutation */

  // Directly ask babel-preset-env whether we want to use transform-async
  // based on currently configured targets. Only if that's the case we
  // transform our async/await code. Otherwise we assume it works without
  // any transpilation.
  const requiresAsync = isPluginRequired(
    getTargets(getEnvTargets(options)),
    envPlugins["transform-async-to-generator"]
  )

  // Alternative to Babel Regenerator
  // Implements the ES7 keywords async and await using syntax transformation
  // to at Promises at compile-time, rather than using generators.
  // https://github.com/babel/babel/pull/7076 (NEW: bundled plugin with Babel)
  // https://www.npmjs.com/package/fast-async (OLD: separate Babel plugin)
  if (requiresAsync) {
    plugins.push(fastAsyncPlugin)
  }

  if (options.debug) {
    console.log("- Async/Await Transpilation:", requiresAsync)
  }
}
