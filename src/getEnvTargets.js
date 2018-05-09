import browserslist from "browserslist"
import getTargets from "@babel/preset-env/lib/targets-parser"

import { isProduction } from "./util"
import modernTarget from "./modernTarget"

/* eslint-disable immutable/no-mutation, complexity */
export default function getEnvTargets(options) {
  let envTargets = {}

  // if (options.target === "node") {
  //   // Widely used stable NodeJS (LTS) is v6.9.0
  //   // See also: https://nodejs.org/en/blog/release/v6.9.0/
  //   // Newest LTS is v8.9.0 https://nodejs.org/en/blog/release/v8.9.0/
  //   // You can choose the modern version by setting `target` to "node8".
  //   // We also have support for even more modern Node v10 which did not yet reached LTS.
  //   envTargets.node =
  //     options.target === "node8" ?
  //       "8.9.0" :
  //       options.target === "node10" ?
  //         "10.0.0" :
  //         "6.9.0"
  //   envTargets.browsers = []
  // }

  if (options.transpile === "current") {
    // Scripts which are directly used like tests can be transpiled for the current NodeJS version
    envTargets.node = "current"
    envTargets.browsers = []
  } else if (options.transpile === "browser") {
    // What we do here is actually pretty clever/stupid as we just use browserslist
    // itself to query its configuration and pass over that data again to babel-preset-env
    // for passing it to browserslist internally. Yeah.
    envTargets = browserslist(null, {
      env:
        process.env.BROWSERSLIST_ENV ||
          isProduction(options) ? "production" : "development"
    })
  } else if (options.transpile === "modern") {
    envTargets = modernTarget
  } else if (options.transpile === "es5" || options.transpile === "es2015") {
    // Compilation with "latest" preset supporting a wide range of clients via ES5 output
    // For ignoring any existing browserslist config we have to pass over an empty array.
    envTargets.browsers = []
  } else if (typeof options.transpile === "object") {
    envTargets = options.target
  } else if (options.transpile === "node") {
    // TODO
    // read package.json
  }

  if (options.debug) {
    console.log("- Computed Targets:", envTargets)
    console.log("- Final Targets:", getTargets(envTargets))
  }

  return envTargets
}
