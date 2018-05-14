import dynamicImportSyntaxPlugin from "babel-plugin-syntax-dynamic-import"
import dynamicImportRollupNode from "babel-plugin-dynamic-import-node"
import dynamicImportServerRendering from "loadable-components/babel"


import json5 from "json5"
import { dirname, basename, extname } from "path"
import crypto from "crypto"
import basex from "base-x"

const base62 = basex("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")

const DEFAULT_LENGTH = 5
function hashString(input, precision=DEFAULT_LENGTH) {
  return base62.encode(crypto.createHash('sha256').update(input).digest()).slice(0, precision)
}

function getImportArgPath(path) {
  return path.parentPath.get("arguments")[0]
}

function autoNamePlugin({ types, template }) {
  const visited = Symbol("visited")

  return {
    name: "better-import",
    visitor: {
      Import(path, state) {
        /* eslint-disable immutable/no-mutation */
        /* eslint-disable prefer-template */

        if (path[visited]) {
          return
        }
        path[visited] = true

        const importArg = getImportArgPath(path)
        const importArgNode = importArg.node
        const { quasis, leadingComments } = importArgNode

        const jsonContent = {}

        // Try to parse all previous comments
        if (leadingComments) {
          leadingComments.forEach((comment, index) => {
            // Skip empty comments
            if (!comment.value.trim()) {
              return
            }

            // Webpack magic comments are declared as JSON5 but miss the curly braces.
            let parsed
            try {
              parsed = json5.parse("{" + comment.value + "}")
            } catch(err) {
              // Most probably a non JSON5 comment
              return
            }

            // Skip comment processing if it already contains a chunk name
            if (parsed.webpackChunkName) {
              jsonContent.webpackChunkName = true
              return
            }

            // We copy over all fields and...
            for (const key in parsed) {
              jsonContent[key] = parsed[key]
            }

            // Cleanup the parsed comment afterwards
            comment.value = ""
          })
        }

        if (!jsonContent.webpackChunkName) {
          const requester = dirname(state.file.opts.filename)
          const request = importArgNode.value
          const plainRequest = basename(request, extname(request))

          // Hash request origin
          const requesterHash = hashString(requester)

          // Add our chunk name to the previously parsed values
          jsonContent.webpackChunkName = plainRequest + "-" + requesterHash

          // Convert to string and remove outer JSON object symbols {}
          const magicComment = json5.stringify(jsonContent).slice(1, -1)

          // Add as a new leading comment
          importArg.addComment("leading", magicComment)
        }
      }
    }
  }
}


export default function imports(presets, plugins, options) {
  // Support for new @import() syntax
  plugins.push(dynamicImportSyntaxPlugin)

  // Support for enhanced imported components with SSR support
  plugins.push(dynamicImportServerRendering)

  plugins.push(autoNamePlugin)


  // Transpile the parsed import() syntax for compatibility or extended features.
  if (options.imports === "node") {
    if (options.debug) {
      console.log("- Rewriting import() for NodeJS.")
    }

    // Compiles import() to a deferred require() for NodeJS
    plugins.push(dynamicImportRollupNode)
  } else {
    if (options.debug) {
      console.log("- Keeping import() statement as is.")
    }
  }
}
