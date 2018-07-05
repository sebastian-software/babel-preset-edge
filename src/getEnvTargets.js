import browserslist from "browserslist"
import getTargets from "@babel/preset-env/lib/targets-parser"
import semver from "semver"
import { get as getAppRoot } from "app-root-dir"

import modernTarget from "./modernTarget"
import { isProduction } from "./util"

const engines = require(`${getAppRoot()}/package.json`).engines

/* eslint-disable immutable/no-mutation, complexity */
export default function getEnvTargets(options) {
  let envTargets = {}

  if (typeof options.transpile === "object") {
    envTargets = options.transpile
  } else if (options.transpile === "current") {
    // Scripts which are directly used like tests can be transpiled for the current NodeJS version
    envTargets.node = "current"
    envTargets.browsers = []
  } else if (options.transpile === "browser") {
    // What we do here is actually pretty clever/stupid as we just use browserslist
    // itself to query its configuration and pass over that data again to babel-preset-env
    // for passing it to browserslist internally. Yeah.
    envTargets.browsers = browserslist(null, {
      env:
        process.env.BROWSERSLIST_ENV || isProduction(options) ?
          "production" :
          "development"
    })
  } else if (options.transpile === "modern") {
    envTargets = modernTarget
  } else if (options.transpile === "esm") {
    // Support output mode for script type=module aka ESM which is kind of a nice way to deliver ~ES2015 code
    // by using an easy duplicate script tag.
    envTargets = {
      esmodules: true
    }
  } else if (options.transpile === "es5" || options.transpile === "es2015") {
    // Compilation with "latest" preset supporting a wide range of clients via ES5 output
    // For ignoring any existing browserslist config we have to pass over an empty array.
    envTargets.browsers = []
  } else if (options.transpile === "node") {
    // Using NodeJS version from engine field
    if (engines && engines.node) {
      // LTS Overview as of May 2018
      // 4.2.0 - out of support
      // 6.9.0 - maintenance
      // 8.9.0 - active
      if (semver.satisfies("4.2.0", engines.node)) {
        envTargets.node = "4.2.0"
      } else if (semver.satisfies("6.9.0", engines.node)) {
        envTargets.node = "6.9.0"
      } else if (semver.satisfies("8.9.0", engines.node)) {
        envTargets.node = "8.9.0"
      } else {
        throw new Error(`Unable to detect NodeJS target from 'engines' configuration. NodeJS version defined: ${  engines.node}`)
      }
    } else {
      // As Node v4 is out of support, we use the current LTS as default
      // See also: https://github.com/nodejs/Release
      // This behavior reduces the amount a transpilations a bit when working in pure NodeJS environments
      envTargets.node = "6.9.0"
    }
  } else {
    throw new Error("Invalid transpile configuration!")
  }

  // We fill the browsers field if not defined with an empty array so that
  // the browserslist config is properly ignored when transpilation if passed over.
  if (envTargets.node != null && envTargets.browsers == null) {
    envTargets.browsers = []
  }

  if (options.debug) {
    console.log("- Computed Targets:", envTargets)
    console.log("- Final Targets:", getTargets(envTargets))
  }

  return envTargets
}
