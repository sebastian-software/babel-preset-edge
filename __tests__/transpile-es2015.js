import buildPreset from "../src"

import { check, fixtures, titles } from "./core"

describe("Transpile: ES2015", () => {
  const options = buildPreset(null, {
    sourceMaps: false,
    transpile: "es2015"
  })

  fixtures.forEach((fileName, index) => {
    test(titles[index], () => check(fileName, options))
  })
})
