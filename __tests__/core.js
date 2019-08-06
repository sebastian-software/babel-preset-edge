import { readdirSync } from "fs"
import { transformFile } from "@babel/core"

const FIXTURE_ROOT = "./__tests__/__fixtures__/"

// We need to explicitely change this from "test" via "jest" to
// not automatically switch into the "test" target.
process.env.NODE_ENV = "development"

export function check(fixture, options) {
  // Ignore local non-configured babelrc
  options.babelrc = false

  return new Promise((resolve, reject) => {
    transformFile(`${FIXTURE_ROOT}${fixture}`, options, (error, result) => {
      if (error) {
        reject(error)
      } else {
        expect(result.code.replace(process.cwd(), "~")).toMatchSnapshot()
        resolve()
      }
    })
  })
}

export const fixtures = readdirSync(FIXTURE_ROOT)

export function getTitle(fileName) {
  return fileName
    .replace(/\.js$/, "")
    .replace(/_/, ": ")
    .replace(/-/, " ")
}

export const titles = fixtures.map(getTitle)
